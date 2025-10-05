import { Hono } from "hono";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { docsRoutes } from "./document.routes";

export const apiRoutes = new Hono();

apiRoutes.route("/auth", authRoutes);
apiRoutes.route("/user", userRoutes);
apiRoutes.route("/docs", docsRoutes);
