import type { FastifyRequest } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { FastifyReply } from "fastify";
import { toNumber } from "lodash";
import type { IAdminRepo } from "../repo/IAdminRepo";
import type DecodedFastifyRequest from "../infra/DecodedRequest";

interface GetAllAdminsQuery {
  page: string;
  limit: string;
  q?: string;
}

export class GetAllAdminsController extends BaseController {
  private adminRepo: IAdminRepo;
  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(
    req: DecodedFastifyRequest<{ Querystring: GetAllAdminsQuery }>,
    res: FastifyReply
  ): Promise<any> {
    try {
      const { adminId } = req.decoded;

      const admin = await this.adminRepo.getAdminbyAdminId(adminId);

      if (admin.role === "ADMIN") {
        return this.clientError(res, "Only SuperAdmin Can Access This Data");
      }

      const filters = {
        page: toNumber(req.query?.page) || 1, // Default page to 1 if not provided
        offset: toNumber(req.query?.limit) || 10, // Default offset (limit) to 10
        q: req.query?.q || "", // Default query to an empty string if not provided
      };

      // Check if pagination parameters are valid
      if (!filters.page || !filters.offset) {
        return this.fail(res, "Page and limit are required parameters.");
      }

      // Call the repository to get the filtered cities
      const adminResult = await this.adminRepo.getAllAdmins(filters);

      return this.ok(res, {
        totalCount: adminResult.totalCount,
        page: adminResult.page,
        offset: adminResult.offset,
        items: adminResult.items,
      });
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
