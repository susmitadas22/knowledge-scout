import { Hono } from "hono";
import { ValidationError } from "~/lib";
import { authMiddleware } from "~/middlewares";
import { askService } from "~/services";
import { AuthSession } from "~/types";
import { askSchema } from "~/validators";

export const askRoutes = new Hono<AuthSession>();

askRoutes.use("*", authMiddleware);

askRoutes.post("/", async (c) => {
  const userId = c.get("user")?._id;
  const { success, data, error } = await askSchema.safeParseAsync(
    await c.req.json()
  );

  if (!success) {
    throw new ValidationError(
      error.issues[0].code,
      error.issues[0].message,
      error.issues[0].path[0] as string
    );
  }

  const answer = await askService.ask(userId!, data);
  return c.json({ answer });
});
