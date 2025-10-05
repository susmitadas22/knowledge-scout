import { app } from "./app";
import { serve } from "@hono/node-server";
import { env } from "./config";
import { connectToMongo } from "./lib";

/**
 * The main entry point for the application.
 */
const main = async () => {
  await connectToMongo();
  serve({ fetch: app.fetch, port: env.HTTP_PORT });
  console.log(`app listening on port ${env.HTTP_PORT}`);
};

main();

const handleGracefulShutdown = () => {
  console.log("Received shutdown signal, shutting down gracefully...");
};

process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);
