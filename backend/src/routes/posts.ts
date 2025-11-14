import { Router, Request, Response } from "express";
import { deletePost, getPostById, getPosts } from "../db/posts/posts";

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
