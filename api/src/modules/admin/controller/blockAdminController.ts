import type { FastifyReply } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import type DecodedFastifyRequest from "../infra/DecodedRequest";

export class BlockAdminController extends BaseController {
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
      const dto = req.params as { blockId: string };

      const { adminId } = req.decoded;

      const superAdmin = await this.adminRepo.getAdminbyAdminId(adminId);

      if (adminId === dto.blockId) {
        return this.clientError(res, "Connot Block Itself");
      }

      if (superAdmin.role !== "SUPERADMIN") {
        return this.clientError(res, "Connot Block Admin");
      }

      const user = await this.adminRepo.getAdminbyAdminId(dto.blockId);

      if (user.role === "SUPERADMIN") {
        return this.clientError(res, "SUPERADMIN Cannot Be Blocked");
      }

      user.isBlocked = !user.isBlocked;
      await this.adminRepo.save(user);

      return this.created(res);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
