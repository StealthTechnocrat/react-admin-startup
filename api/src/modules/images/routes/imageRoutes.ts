import type { FastifyInstance } from "fastify";
import { middleware } from "../../../shared/middleware";
import { getAllImagesController, imageUploaderController } from "../controller";

async function imageRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/image",
    preHandler: [middleware.ensureAuthenticated()],
    handler: (req, res) => imageUploaderController.executeImpl(req, res),
  });

  fastify.route({
    method: "GET",
    url: "/image",
    preHandler: [middleware.ensureAuthenticated()],
    handler: (req, res) => getAllImagesController.executeImpl(req, res),
  });
}

export default imageRoutes;
