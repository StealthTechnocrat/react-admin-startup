import type { FastifyReply, FastifyRequest } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import { appLogger } from "../../../shared/utils/logger";
import { PasswordUtils } from "../../../shared/utils/PasswordUtils";
import type DecodedFastifyRequest from "../infra/DecodedRequest";

export class ChangePasswordController extends BaseController {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(
    req: DecodedFastifyRequest,
    res: FastifyReply
  ): Promise<any> {
    try {
      const { adminId } = req.decoded;
      const dto = req.body as {
        oldPassword: string;
        password: string;
      };

      // Validate data
      if (!dto.oldPassword || !dto.password) {
        return this.clientError(res, "Password fields are missing");
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.{8,})/;
      if (!passwordRegex.test(dto.password)) {
        return this.clientError(res, "Password is Not Valid");
      }

      // Get the admin
      const admin = await this.adminRepo.getAdminbyAdminId(adminId);

      const matchOrNotPWD = await PasswordUtils.verifyPassword(
        dto.oldPassword,
        admin.password
      );
      if (matchOrNotPWD === false) {
        return this.clientError(res, "Current Password Not Matched");
      }

      // Hash the new password before saving it
      const hashedPassword = await PasswordUtils.hashPassword(dto.password);

      admin.password = hashedPassword;

      // Save the updated admin
      await this.adminRepo.save(admin);

      // Optionally log this change
      appLogger.info(`Admin ${admin.adminId} reset their password`);

      return this.ok<void>(res);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
