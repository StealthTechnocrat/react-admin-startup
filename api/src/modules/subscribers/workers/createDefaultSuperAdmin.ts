import { BaseModel } from "../../../shared/core/baseModel";
import { UniqueID } from "../../../shared/core/uniqueId";
import type { UseCase } from "../../../shared/core/usecase";
import { appLogger } from "../../../shared/utils/logger";
import type IAdmin from "../../admin/model/admin";
import type { IAdminRepo } from "../../admin/repo/IAdminRepo";

type Response = void;

export class CreateDefaultSuperAdmin implements UseCase<void, Response> {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    this.adminRepo = adminRepo;
  }
  public async execute(): Promise<void> {
    try {
      const getDefaultSuperAdmion = {
        email: process.env["DEFAULT_SUPERADMIN_EMAIL"] as string,
        password: process.env["DEFAULT_SUPERADMIN_PASSWORD"] as string,
      };

      const exists = await this.adminRepo.emailExists(
        getDefaultSuperAdmion.email
      );

      if (exists === true) {
        return;
      }

      const admin = BaseModel.create<IAdmin>({
        adminId: new UniqueID().getId(),
        email: getDefaultSuperAdmion.email,
        password: getDefaultSuperAdmion.password,
        isEmailVerified: true,
        name: "SuperAdmin",
        role: "SUPERADMIN",
      });

      if (admin.isFailure) {
        throw new Error("Default Super Admin Not Created");
      }

      const existOrNot = await this.adminRepo.emailExists(
        admin.getValue().email
      );

      if (existOrNot === false) {
        await this.adminRepo.save(admin.getValue());
      }
      appLogger.info({}, "Default Super Admin Created");
    } catch (error) {
      appLogger.error(error, "Error In Creating Super Admin");
    }
  }
}
