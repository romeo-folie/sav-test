import { Router, Request, Response } from "express";
import { createPost, deletePost, getPostById, getPosts } from "../db/posts/posts";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const userId = req.query.userId?.toString();
  if (!userId) {
    res.status(400).send({ error: "userId is required" });
    return;
  }
  const posts = await getPosts(userId);
  res.send(posts);
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, body, userId } = req.body;

    // intentionally keeping validation simple for this project
    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).send({ error: "Title is required and must be a non-empty string" });
      return;
    }

    if (!body || typeof body !== "string" || body.trim() === "") {
      res.status(400).send({ error: "Body is required and must be a non-empty string" });
      return;
    }

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      res.status(400).send({ error: "UserId is required and must be a non-empty string" });
      return;
    }

    const newPost = await createPost(title.trim(), body.trim(), userId.trim());
    res.status(201).send(newPost);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    if (!postId || postId.trim() === "") {
      res.status(400).send({ error: "Post ID is required" });
      return;
    }

    const post = await getPostById(postId);

    if (!post) {
      res.status(404).send({ error: "Post not found" });
      return;
    }

    const deleted = await deletePost(postId);

    if (!deleted) {
      res.status(500).send({ error: "Failed to delete post" });
      return;
    }

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
