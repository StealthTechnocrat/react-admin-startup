import type { FastifyReply } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import type { ICreateAdminDTO } from "../dto/createAdminDto";
import { BaseModel } from "../../../shared/core/baseModel";
import type IAdmin from "../model/admin";
import { UniqueID } from "../../../shared/core/uniqueId";
import type DecodedFastifyRequest from "../infra/DecodedRequest";
import {
  afterAdminCreated,
  afterAdminPasswordReset,
  verifiyEmailSubscriber,
} from "../../notification/subscribes";

import { Utility } from "../../../shared/utils/Utility";

export class CreateAdminController extends BaseController {
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
      const dto = req.body as ICreateAdminDTO;
      const { adminId } = req.decoded;

      // validate data

      if (!dto.email || !dto.password || !dto.name) {
        return this.clientError(res, "Field is missing");
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(dto.email)) {
        return this.clientError(
          res,
          `Given Email ${dto.email} is not valid. Please check`
        );
      }
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.{8,})/;
      if (!passwordRegex.test(dto.password)) {
        return this.clientError(res, "Password is Not Valid");
      }

      const emailExistOrNot = await this.adminRepo.emailExists(dto.email);

      if (emailExistOrNot === true) {
        return this.clientError(res, "Email Already Exists");
      }

      const admin = await this.adminRepo.getAdminbyAdminId(adminId);

      if (admin.role !== "SUPERADMIN") {
        return this.clientError(res, "Connot Create Admin");
      }

      const newAdminOrError = BaseModel.create<IAdmin>({
        adminId: new UniqueID().getId(),
        email: dto.email,
        password: dto.password,
        name: dto.name,
        role: "ADMIN",
      });

      if (newAdminOrError.isFailure) {
        return this.clientError(res, newAdminOrError.getErrorValue.toString());
      }
      afterAdminCreated.onAdminCreatedEvent({
        admin: newAdminOrError.getValue(),
        dateTimeOccurred: new Date(),
      });
      verifiyEmailSubscriber.onVerifiyEmailRequest({
        admin: newAdminOrError.getValue(),
        dateTimeOccurred: new Date(),
      });
      await this.adminRepo.save(newAdminOrError.getValue());

      return this.created(res);
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
