import { Hono } from "hono";
import { apiRoutes } from "./api";
import { ApiError } from "~/lib";
import { rateLimiter } from "~/middlewares";
import { ui } from "./ui";

/**
 * Main application routes
 */
export const routes = new Hono();

routes.route("/", ui);

routes.use("/api", rateLimiter);
routes.route("/api", apiRoutes);

// Handle 404 for all other routes
routes.all("*", (c) => {
  throw new ApiError(404, "NOT_FOUND", "The requested resource was not found.");
});
