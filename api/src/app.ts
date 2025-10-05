import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { routes } from "./routes";
import { HTTPException } from "hono/http-exception";
import { ApiError, ValidationError } from "./lib/error";

/**
 * The main application instance.
 */
export const app = new Hono();

// middlewares
app.use(cors({ origin: "*" }));
app.use("*", logger());

// routes
app.route("/", routes);

app.onError((err, c) => {
  console.error("Error:", err);

  // Handle custom ValidationError
  if (err instanceof ValidationError) {
    return c.json(
      {
        error: {
          code: err.code,
          field: err.field,
          message: err.message,
        },
      },
      err.status
    );
  }

  // Handle custom ApiError
  if (err instanceof ApiError) {
    return c.json(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      err.status
    );
  }

  // Handle standard HTTPException
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: {
          code: "HTTP_ERROR",
          message: err.message,
        },
      },
      err.status
    );
  }

  // Handle unknown errors
  return c.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    },
    500
  );
});
