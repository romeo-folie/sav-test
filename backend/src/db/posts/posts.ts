import { connection } from "../connection";
import {
  deletePostTemplate,
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
