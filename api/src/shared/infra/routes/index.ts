import type { FastifyInstance } from "fastify";
import adminRoutes from "../../../modules/admin/routes/adminRoutes";

async function routes(fastify: FastifyInstance) {
  fastify.register(adminRoutes, { prefix: "/admins" });
}
export default routes;
