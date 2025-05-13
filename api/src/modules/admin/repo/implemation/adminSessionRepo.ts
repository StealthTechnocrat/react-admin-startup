import type IAdminSession from "../../model/adminSession";
import type { IAdminSessionRepo } from "../IAdminSessionRepo";

export class AdminSessionRepo implements IAdminSessionRepo {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  public async getAdminSessionByAdminId(
    adminId: string
  ): Promise<IAdminSession> {
    try {
      const adminSession = await this.model.findOne({
        adminId: adminId,
        isDeleted: false,
      });

      if (!!adminSession === false) throw new Error("Refresh token not found.");

      return adminSession;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async deactivateAdminSession(adminId: string): Promise<void> {
    try {
      await this.model.updateMany(
        { adminId: adminId, isDeleted: false },
        { isDeleted: true }
      );
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async sessionExists(adminId: string): Promise<boolean> {
    let token;
    try {
      token = await this.model.find({ adminId: adminId });
    } catch (err) {
      throw new Error(`${err}`);
    }
    if (token) {
      return true;
    }
    return false;
  }

  public async save(adminSession: IAdminSession): Promise<void> {
    try {
      await this.model.create(adminSession);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
