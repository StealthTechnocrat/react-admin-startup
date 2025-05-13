import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import type { IAdminSessionRepo } from "../repo/IAdminSessionRepo";
import type DecodedFastifyRequest from "../infra/DecodedRequest";
import { CookiesUtils } from "../../../shared/utils/CookieUtils";

export class LogoutController extends BaseController {
  private adminRepo: IAdminRepo;
  private adminSessionRepo: IAdminSessionRepo;
  constructor(adminRepo: IAdminRepo, adminSessionRepo: IAdminSessionRepo) {
    super();
    this.adminRepo = adminRepo;
    this.adminSessionRepo = adminSessionRepo;
  }

  public async executeImpl(
    req: DecodedFastifyRequest,
    res: FastifyReply
  ): Promise<any> {
    try {
      const { adminId } = req.decoded;

      const adminExistOrNot = await this.adminRepo.exists(adminId);
      if (adminExistOrNot === false) {
        return this.notFound(res);
      }
      const admin = await this.adminRepo.getAdminbyAdminId(adminId);

      await this.adminSessionRepo.deactivateAdminSession(admin.adminId);

      admin.isActive = false;
      await this.adminRepo.save(admin);
      CookiesUtils.clearAccessTokenFromCookie(res);

      return this.ok<void>(res);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
