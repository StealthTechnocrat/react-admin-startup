import Fastify from "fastify";
import path from "path";
import fastifyCookie from "@fastify/cookie";
import fastifyFormbody from "@fastify/formbody";
import fastifyStatic from "@fastify/static";
import helmet from "@fastify/helmet";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
import routes from "./routes";
import { appLogger, httpLogger } from "../utils/logger";
import connectDb from "../db/mongoConnection";
import { appConfig } from "../../config";

const fastify = Fastify({
  logger: false,
  ajv: {
    customOptions: {
      strict: true,
    },
  },
  bodyLimit: 5 * 1024 * 1024,
});

fastify.addHook("onRequest", (request, reply, done) => {
  const logData = {
    ip: request.ip,
    method: request.method,
    url: request.url,
    userAgent: request.headers["user-agent"],
  };
  httpLogger.info(logData, "HTTP request");
  done();
});

async function initializeServer() {
  try {
    // Initialize DB
    await connectDb();
    // initialize Socket IO

    // Register plugins
    fastify.register(fastifyRateLimit, { global: false });
    fastify.register(fastifyCors, {
      origin: appConfig.origin,

      credentials: true,
    });
    fastify.register(helmet);
    fastify.register(fastifyCookie);
    fastify.register(fastifyFormbody);
    fastify.register(fastifyMultipart, {
      limits: { fileSize: 5 * 1024 * 1024 },
    });
    fastify.register(fastifyStatic, {
      root: path.resolve("assets"),
      prefix: "/assets",
      setHeaders(res) {
        // Set CORS and resource headers for static files
        res.setHeader("Content-Type", "image/webp");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      },
    });

    // Register routes
    const platformPrefix = process.env["PLATFORM_PREFIX"];
    fastify.register(routes, { prefix: platformPrefix });

    // Start the server
    const port = parseInt(process.env["PORT"] || "4500", 10);
    await fastify.listen({ port });

    appLogger.info(`Server listening on http://localhost:${port}`);
  } catch (error) {
    appLogger.error(error, "Error starting server:");
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  appLogger.info("Shutting down server...");
  console.log("Disconnecting all sockets...");
  await fastify.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  appLogger.info("Shutting down server...");
  console.log("Disconnecting all sockets...");
  await fastify.close();
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(0);
});

initializeServer();
