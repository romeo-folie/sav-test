import { Router, Request, Response } from "express";

import { getUsers, getUsersCount, getUserById } from "../db/users/users";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const pageNumber = Number(req.query.pageNumber) || 0;
    const pageSize = Number(req.query.pageSize) || 4;
    if (pageNumber < 0 || pageSize < 1) {
      res.status(400).send({ message: "Invalid page number or page size" });
      return;
    }

    const users = await getUsers(pageNumber, pageSize);
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  try {
    const count = await getUsersCount();
    res.send({ count });
  } catch (error) {
    console.error("Error fetching users count:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      res.status(400).send({ message: "Invalid user ID" });
      return;
    }

    const user = await getUserById(userId);

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.send(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
