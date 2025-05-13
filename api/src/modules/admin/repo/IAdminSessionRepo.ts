import type IAdminSession from "../model/adminSession";

export interface IAdminSessionRepo {
  save(adminSession: IAdminSession): Promise<void>;
  sessionExists(adminId: string): Promise<boolean>;
  deactivateAdminSession(adminId: string): Promise<void>;
  getAdminSessionByAdminId(adminId: string): Promise<IAdminSession>;
}
