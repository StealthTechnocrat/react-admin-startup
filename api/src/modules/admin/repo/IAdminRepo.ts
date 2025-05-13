import type { PaginatedResponse } from "../../../shared/core/PaginatedResponse";

import type IAdmin from "../model/admin";

export interface IAdminRepo {
  referrelCodeExists(referralCode: string): Promise<boolean>;
  save(admin: IAdmin): Promise<void>;
  getAdminbyAdminId(adminId: string): Promise<IAdmin>;
  getAdminbyEmailId(email: string): Promise<IAdmin>;
  exists(adminId: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  getAllAdmins(filters: {
    q?: string;
    page: number;
    offset: number;
  }): Promise<PaginatedResponse<IAdmin>>;
}
