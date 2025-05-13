import { notifyViaEmailUseCase } from "../usecase/notifyViaEmail";
import { AfterAdminCreated } from "./afterAdminCreated";
import { AfterAdminPasswordReset } from "./afterAdminPasswordReset";
import { VerifiyEmailSubscriber } from "./verifiyEmailSubscriber";

const afterAdminCreated = new AfterAdminCreated(notifyViaEmailUseCase);

const afterAdminPasswordReset = new AfterAdminPasswordReset(
  notifyViaEmailUseCase
);

const verifiyEmailSubscriber = new VerifiyEmailSubscriber(
  notifyViaEmailUseCase
);

export { afterAdminCreated, afterAdminPasswordReset, verifiyEmailSubscriber };
