import { Hono } from "hono";
import { apiRoutes } from "./api";
import { ApiError } from "~/lib";

/**
 * Main application routes
 */
export const routes = new Hono();

routes.route("/api", apiRoutes);

routes.get("/health", (c) => c.json({ status: "ok" }));

// Handle 404 for all other routes
routes.all("*", (c) => {
  throw new ApiError(404, "NOT_FOUND", "The requested resource was not found.");
});
