import { Hono } from "hono";
import { authMiddleware } from "~/middlewares";
import { AuthSession } from "~/types";

export const userRoutes = new Hono<AuthSession>();

userRoutes.use("*", authMiddleware);

// get the user in the context
userRoutes.get("/", (c) => {
  return c.json({ user: c.get("user") });
});
