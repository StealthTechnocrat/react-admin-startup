import { BaseModel } from "../../../../shared/core/baseModel";
import type { PaginatedResponse } from "../../../../shared/core/PaginatedResponse";
import type IAdmin from "../../model/admin";
import type Admin from "../../model/admin";
import type { IAdminRepo } from "../IAdminRepo";

export class AdminRepo implements IAdminRepo {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }
  public async referrelCodeExists(referralCode: string): Promise<boolean> {
    try {
      const result = await this.model.findOne({ referalCode: referralCode });

      return result === null || result === undefined ? false : true;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  public async emailExists(email: string): Promise<boolean> {
    try {
      const result = await this.model.findOne({ email: email });

      return result === null || result === undefined ? false : true;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  public async getAdminbyEmailId(email: string): Promise<Admin> {
    try {
      const result = await this.model.findOne({ email: email });

      if (result === null || result === undefined) {
        throw new Error("Admin Not Found");
      }

      return result;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async save(admin: Admin): Promise<void> {
    try {
      const exists = await this.exists(admin.adminId);

      if (exists) {
        await this.model.updateOne({ adminId: admin.adminId }, admin);
      } else {
        await this.model.create(admin);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  public async getAdminbyAdminId(adminId: string): Promise<Admin> {
    try {
      const result = await this.model.findOne({ adminId: adminId });

      if (result === null || result === undefined) {
        throw new Error("Admin Not Found");
      }

      const adminOrError = BaseModel.create<IAdmin>(result);

      if (adminOrError.isFailure) {
        throw new Error(`${adminOrError.getErrorValue()}`);
      }

      return adminOrError.getValue();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  public async exists(adminId: string): Promise<boolean> {
    try {
      const result = await this.model.findOne({ adminId: adminId });

      return result === null || result === undefined ? false : true;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  public async getAllAdmins(filters: {
    q?: string;
    page: number;
    offset: number;
  }): Promise<PaginatedResponse<IAdmin>> {
    try {
      const { q, page, offset } = filters;

      // Create the base filter object
      const matchFilter: any = {};

      if (q) {
        matchFilter.email = { $regex: q, $options: "i" }; // Case-insensitive match
      }

      const pageSize = offset;
      const skip = (page - 1) * pageSize;
      const sort = -1;

      // Perform the aggregation query
      const result = await this.model.aggregate([
        // Match filter based on provided criteria
        { $match: matchFilter },

        { $sort: { _id: -1 } },
        // Count total number of matching records
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            admins: [{ $skip: skip }, { $limit: pageSize }],
          },
        },
      ]);

      // Extract totalCount and admins
      if (result === null || result === undefined) {
        throw new Error("No User Found");
      }
      const totalCount = result[0].totalCount[0]
        ? result[0].totalCount[0].count
        : 0;

      const admins = result[0].admins;

      // Return the formatted response
      return {
        totalCount: totalCount,
        page: page,
        offset: offset,
        items: admins,
      };
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
