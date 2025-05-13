import type { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import { JWTUtils } from "../../../shared/utils/JWTUtils";
import { afterAdminPasswordReset } from "../../notification/subscribes";

interface VerifiyEmailQuery {
  token: string;
}

export class VerifiyEmailController extends BaseController {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(
    req: FastifyRequest<{ Querystring: VerifiyEmailQuery }>,
    res: FastifyReply
  ): Promise<any> {
    try {
      const { token } = req.query;

      // Token should be passed in the query params

      const decodedToken = await JWTUtils.decodeJWT(token as string);
      if (!decodedToken) {
        return this.clientError(res, "Invalid or expired token");
      }

      // Get the admin
      const admin = await this.adminRepo.getAdminbyAdminId(
        decodedToken.adminId
      );
      if (!admin) {
        return this.clientError(res, "Admin not found");
      }

      // Ensure the email from the token matches the admin email
      if (admin.email !== decodedToken.email) {
        return this.clientError(res, "Token does not match the admin email");
      }

      if (admin.isEmailVerified === true) {
        return this.clientError(res, "Email Aready Verfied");
      }

      admin.isEmailVerified = true;
      // Save the updated admin
      await this.adminRepo.save(admin);

      return this.ok<void>(res);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
