import type { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import { appLogger } from "../../../shared/utils/logger";
import { PasswordUtils } from "../../../shared/utils/PasswordUtils";
import { afterAdminPasswordReset } from "../../notification/subscribes";

export class SendForgotPasswordMailController extends BaseController {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<any> {
    try {
      const { email } = req.params as { email: string };

      // Validate data

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return this.clientError(
          res,
          `Given Email ${email} is not valid. Please check`
        );
      }

      const adminExistOrNot = await this.adminRepo.emailExists(email);

      if (adminExistOrNot === false) {
        return this.clientError(res, "Email Not Assosiated With Any Account");
      }

      // Get the admin
      const admin = await this.adminRepo.getAdminbyEmailId(email);

      afterAdminPasswordReset.onPasswordResetRequestedEvent({
        admin: admin,
        dateTimeOccurred: new Date(),
      });

      return this.ok<void>(res);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
