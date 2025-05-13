import { adminRepo, adminSessionRepo } from "../repo";
import { BlockAdminController } from "./blockAdminController";
import { ChangePasswordController } from "./changePasswordController";
import { CreateAdminController } from "./createAdminController";
import { GetAllAdminsController } from "./getAllAdminsController";
import { GetMeController } from "./getMeController";
import { LoginController } from "./loginController";
import { LogoutController } from "./logoutController";
import { ResetAdminPasswordController } from "./resetPasswordController";
import { SendForgotPasswordMailController } from "./sendForgotPasswordMail";
import { VerifiyEmailController } from "./verifiyEmailController";

const createAdminController = new CreateAdminController(adminRepo);

const loginController = new LoginController(adminRepo, adminSessionRepo);

const getMeController = new GetMeController(adminRepo);

const getAllAdminsController = new GetAllAdminsController(adminRepo);

const resetAdminPasswordController = new ResetAdminPasswordController(
  adminRepo
);

const verifiyEmailController = new VerifiyEmailController(adminRepo);

const logoutController = new LogoutController(adminRepo, adminSessionRepo);

const blockAdminController = new BlockAdminController(adminRepo);

const sendForgotPasswordMailController = new SendForgotPasswordMailController(
  adminRepo
);

const changePasswordController = new ChangePasswordController(adminRepo);

export {
  createAdminController,
  loginController,
  getMeController,
  getAllAdminsController,
  resetAdminPasswordController,
  verifiyEmailController,
  logoutController,
  blockAdminController,
  sendForgotPasswordMailController,
  changePasswordController,
};
