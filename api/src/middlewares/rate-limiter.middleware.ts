import { createMiddleware } from "hono/factory";
import { ApiError } from "~/lib";

const store: {
  [key: string]: {
    count: number;
    resetTime: number;
  };
} = {};

const windowMs = 60000;
const limit = 60;

setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000);

export const rateLimiter = createMiddleware(async (c, next) => {
  const user = c.get("user") as { _id: string } | undefined;
  const key = `rate_limit:${user?._id}`;
  const now = Date.now();

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  store[key].count++;

  c.header("X-RateLimit-Limit", limit.toString());
  c.header(
    "X-RateLimit-Remaining",
    Math.max(0, limit - store[key].count).toString()
  );
  c.header("X-RateLimit-Reset", new Date(store[key].resetTime).toISOString());

  if (store[key].count > limit) {
    throw new ApiError(
      429,
      "RATE_LIMIT",
      "Too many requests, please try again later."
    );
  }

  await next();
});
