import { randomBytes } from "crypto";
import { connection } from "../connection";
import {
  deletePostTemplate,
  insertPostTemplate,
  selectPostByIdTemplate,
  selectPostsTemplate,
} from "./query-tamplates";
import { Post } from "./types";

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results as Post[]);
    });
  });

export const getPostById = (postId: string): Promise<Post | null> =>
  new Promise((resolve, reject) => {
    connection.get<Post>(
      selectPostByIdTemplate,
      [postId],
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result || null);
      }
    );
  });

export const deletePost = (postId: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    connection.run(deletePostTemplate, [postId], function (error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this.changes > 0);
    });
  });

const generatePostId = (): string => {
  return randomBytes(16).toString("hex");
};

const generateTimestamp = (): string => {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offset) / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
  const timezone = `${sign}${hours}:${minutes}`;
  return `${now.toISOString().slice(0, -1)}${timezone}`;
};

export const createPost = (
  title: string,
  body: string,
  userId: string
): Promise<Post> =>
  new Promise((resolve, reject) => {
    const id = generatePostId();
    const created_at = generateTimestamp();

    connection.run(
      insertPostTemplate,
      [id, userId, title, body, created_at],
      function (error) {
        if (error) {
          reject(error);
          return;
        }

        connection.get<Post>(
          selectPostByIdTemplate,
          [id],
          (fetchError, result) => {
            if (fetchError || !result) {
              reject(fetchError || new Error("Failed to fetch created post"));
              return;
            }
            resolve(result);
          }
        );
      }
    );
  });
