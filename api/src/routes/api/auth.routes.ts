import { Hono } from "hono";
import { ValidationError } from "~/lib";
import { userService } from "~/services";
import { createUserSchema } from "~/validators";

export const authRoutes = new Hono();

/**
 * create a new user
 */
authRoutes.post("/", async (c) => {
  const json = await c.req.json();
  const { success, data, error } = await createUserSchema.safeParseAsync(json);

  if (!success) {
    throw new ValidationError(
      error.issues[0].code,
      error.issues[0].message,
      error.issues[0].path[0] as string
    );
  }

  // create the user
  const user = await userService.createUser(data);
  return c.json(user);
});
