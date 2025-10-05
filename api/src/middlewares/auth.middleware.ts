import { User } from "@knowledgescout/schemas";
import { createMiddleware } from "hono/factory";
import { AUTHORIZATION_HEADER, SHARE_TOKEN_HEADER } from "~/config/CONSTS";
import { ApiError } from "~/lib/error";
import * as bcrypt from "bcryptjs";

// in api how to pass basic auth
//  headers: {
//     "Content-Type": "application/json",
//     "x-authorization": `Basic ${btoa(`${EMAIL}:${PASSWORD}`)}`,
//   },

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header(AUTHORIZATION_HEADER);
  const shareToken = c.req.header(SHARE_TOKEN_HEADER);

  if (!authHeader && !shareToken) {
    throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
  }

  let email: string | null = null;
  let password: string | null = null;

  if (authHeader) {
    const authMatch = authHeader.match(/^Basic (.+)$/);
    if (!authMatch) {
      throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
    }
    const credentials = atob(authMatch[1]).split(":");
    if (credentials.length !== 2) {
      throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
    }
    email = credentials[0];
    password = credentials[1];
  }

  const user = await User.findOne({
    $or: [{ email }, { shareToken }],
  }).lean();

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
  }

  if (shareToken && shareToken === user.shareToken) {
    c.set("user", { _id: user._id.toString() });
  }

  if (email && password) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
    }
    c.set("user", { _id: user._id.toString() });
  }

  if (!c.get("user")) {
    throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
  }

  await next();
});
