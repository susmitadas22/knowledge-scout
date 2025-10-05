import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { routes } from "./routes";

/**
 * The main application instance.
 */
export const app = new Hono();

// middlewares
app.use(cors({ origin: "*" }));
app.use("*", logger());

// routes
app.route("/", routes);
