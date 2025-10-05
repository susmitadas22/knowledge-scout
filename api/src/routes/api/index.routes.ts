import { Hono } from "hono";
import { authMiddleware } from "~/middlewares";
import { indexService } from "~/services";
import { AuthSession } from "~/types";

export const indexRoutes = new Hono<AuthSession>();

indexRoutes.use("*", authMiddleware);

indexRoutes.post("/rebuild", async (c) => {
  const userId = c.get("user")?._id;

  const result = await indexService.rebuildIndex(userId!);

  return c.json(result);
});

indexRoutes.get("/stats", async (c) => {
  const userId = c.get("user")?._id;

  const result = await indexService.getStats(userId!);

  return c.json(result);
});
