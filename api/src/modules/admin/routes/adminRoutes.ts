import type { FastifyInstance } from "fastify";
import {
  blockAdminController,
  changePasswordController,
  createAdminController,
  getAllAdminsController,
  getMeController,
  loginController,
  logoutController,
  resetAdminPasswordController,
  sendForgotPasswordMailController,
  verifiyEmailController,
} from "../controller"; // Ensure this is correctly imported
import { middleware } from "../../../shared/middleware";

async function adminRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/",
    preHandler: [
      middleware.ensureAuthenticated(),
      middleware.ensureAuthorization("SUPERADMIN"),
    ],
    handler: (req, res) => createAdminController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "GET",
    url: "/getme",
    preHandler: [middleware.ensureAuthenticated()],
    handler: (req, res) => getMeController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "POST",
    url: "/login",
    handler: (req, res) => loginController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "Get",
    url: "/",
    preHandler: [middleware.ensureAuthenticated()],
    handler: (req, res) => getAllAdminsController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "POST",
    url: "/reset-password",
    handler: (req, res) => resetAdminPasswordController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "GET",
    url: "/verifiy-email",
    handler: (req, res) => verifiyEmailController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "GET",
    url: "/logout",
    preHandler: [middleware.ensureAuthenticated()],
    handler: (req, res) => logoutController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "GET",
    url: "/block-admin/:blockId",
    preHandler: [
      middleware.ensureAuthenticated(),
      middleware.ensureAuthorization("SUPERADMIN"),
    ],
    handler: (req, res) => blockAdminController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "GET",
    url: "/send-forgot-request/:email",
    handler: (req, res) => sendForgotPasswordMailController.execute(req, res), // Ensure `this` context is preserved
  });
  fastify.route({
    method: "POST",
    url: "/change-password",
    preHandler: [middleware.ensureAuthenticated()],
    handler: (req, res) => changePasswordController.execute(req, res), // Ensure `this` context is preserved
  });
}

export default adminRoutes;
