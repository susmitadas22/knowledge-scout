import { Hono } from "hono";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { docsRoutes } from "./document.routes";
import { indexRoutes } from "./index.routes";
import { askRoutes } from "./ask.routes";

export const apiRoutes = new Hono();

apiRoutes.route("/ask", askRoutes);
apiRoutes.route("/auth", authRoutes);
apiRoutes.route("/user", userRoutes);
apiRoutes.route("/docs", docsRoutes);
apiRoutes.route("/index", indexRoutes);

apiRoutes.get("/_meta", (c) => {
  return c.json({
    name: "Knowledge Scout API",
    version: "1.0.0",
    description: "API for Knowledge Scout application",
    github: "https://github.com/susmitadas22/knowledge-scout",
  });
});

apiRoutes.get("/health", (c) => c.json({ status: "ok" }));
