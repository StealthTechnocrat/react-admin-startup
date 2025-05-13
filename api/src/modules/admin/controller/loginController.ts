import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../../shared/core/baseController";
import type { IAdminRepo } from "../repo/IAdminRepo";
import type ILoginDTO from "../dto/loginDTO";
import type { IAdminSessionRepo } from "../repo/IAdminSessionRepo";
import { PasswordUtils } from "../../../shared/utils/PasswordUtils";
import { JWTUtils } from "../../../shared/utils/JWTUtils";
import { authConfig } from "../../../config";
import { BaseModel } from "../../../shared/core/baseModel";
import type IAdminSession from "../model/adminSession.ts";
import { UniqueID } from "../../../shared/core/uniqueId";
import { CookiesUtils } from "../../../shared/utils/CookieUtils";

export class LoginController extends BaseController {
  private adminRepo: IAdminRepo;
  private adminSessionRepo: IAdminSessionRepo;

  constructor(adminRepo: IAdminRepo, adminSessionRepo: IAdminSessionRepo) {
    super();
    this.adminRepo = adminRepo;
    this.adminSessionRepo = adminSessionRepo;
  }

  public async executeImpl(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<any> {
    try {
      const dto = req.body as ILoginDTO;
      // validate data

      if (!dto || !dto.email || !dto.password) {
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
        return this.clientError(res, "Password is INVALID");
      }

      const emailExistOrNot = await this.adminRepo.emailExists(dto.email);

      if (emailExistOrNot === false) {
        return this.clientError(res, "Given Email Is Not Register!");
      }

      const admin = await this.adminRepo.getAdminbyEmailId(dto.email);
      if (!admin.isEmailVerified) {
        return this.clientError(res, "Email is not verified");
      }

      if (admin?.isBlocked) {
        return this.clientError(
          res,
          "Your account is blocked. Contact customer support."
        );
      }

      // if (!admin?.isActive) {
      //   return this.clientError(
      //     res,
      //     "Your account has been marked inactive. Contact customer support."
      //   );
      // }

      const sessionExists = await this.adminSessionRepo.sessionExists(
        admin.adminId
      );
      if (sessionExists) {
        // logout user from previous session
        try {
          await this.adminSessionRepo.deactivateAdminSession(admin.adminId);
        } catch (err) {
          //
        }
      }

      if (admin.lockUntil && admin.lockUntil > new Date()) {
        const timeLeft = Math.ceil(
          (admin.lockUntil.getTime() - new Date().getTime()) / 60000
        );

        throw new Error(
          `Your account is locked. Please try again after ${timeLeft} minutes.`
        );
      }

      const matchOrNot = await PasswordUtils.verifyPassword(
        dto.password,
        admin.password
      );
      if (matchOrNot !== true) {
        admin.loginAttempts = admin?.loginAttempts
          ? admin.loginAttempts + 1
          : 1;

        if (admin.loginAttempts === 3) {
          // Lock the account for 5 minutes
          const lockUntil = new Date();
          lockUntil.setMinutes(lockUntil.getMinutes() + 5);
          admin.lockUntil = lockUntil;
          await this.adminRepo.save(admin);

          throw new Error(
            "Your account is locked due to 3 failed attempts. Please try again after 5 minutes."
          );
        }
        await this.adminRepo.save(admin);
        throw new Error("Invalid Email Or Password");
      } else {
        const accessToken = JWTUtils.signJWT({
          adminId: admin.adminId,
          name: admin.name,
          email: admin.email,
        });

        // this data is going to save in database
        const expiredAt = new Date();
        expiredAt.setSeconds(
          expiredAt.getSeconds() + authConfig.refreshTokenExpiryTime
        );

        const adminSessionResult = BaseModel.create<IAdminSession>({
          adminSessionId: new UniqueID().getId(),
          adminId: admin.adminId,
          expiryDate: expiredAt,
          token: accessToken,
        });

        // last login time

        admin.isActive = true;

        admin.lastLogin?.push(new Date());
        admin.loginAttempts = 0;

        await this.adminRepo.save(admin);

        await this.adminSessionRepo.save(adminSessionResult.getValue());
        CookiesUtils.setAccessTokenInCookie(res, accessToken);

        return this.ok<void>(res);
      }
    } catch (error) {
      if (error instanceof Error) {
        return this.fail(res, error.message);
      }
      return this.fail(res, "Internal Server Error");
    }
  }
}
