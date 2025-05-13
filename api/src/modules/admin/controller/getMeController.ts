import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import type IAdmin from "../model/admin";
import type DecodedFastifyRequest from "../infra/DecodedRequest";

export class GetMeController extends BaseController {
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

      const admin = await this.adminRepo.getAdminbyAdminId(adminId);

      return this.ok<IAdmin>(res, admin);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
