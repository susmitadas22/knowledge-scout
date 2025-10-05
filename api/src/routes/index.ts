import { Hono } from "hono";
import { apiRoutes } from "./api";
import { ApiError } from "~/lib";
import { rateLimiter } from "~/middlewares";

/**
 * Main application routes
 */
export const routes = new Hono();

routes.use("/api", rateLimiter);
routes.route("/api", apiRoutes);

routes.get("/_meta", (c) => {
  return c.json({
    name: "Knowledge Scout API",
    version: "1.0.0",
    description: "API for Knowledge Scout application",
    github: "https://github.com/susmitadas22/knowledge-scout",
  });
});

routes.get("/.well-known/hackathon.json", (c) => {
  return c.json({
    name: "susmita das",
    portfolio: "https://sushh.me",
    github: "https://github.com/susmitadas22",
    project: {
      name: "Knowledge Scout",
    },
  });
});

routes.get("/health", (c) => c.json({ status: "ok" }));

// Handle 404 for all other routes
routes.all("*", (c) => {
  throw new ApiError(404, "NOT_FOUND", "The requested resource was not found.");
});
