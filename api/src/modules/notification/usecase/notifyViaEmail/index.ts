import { mailService } from "../../services";
import { NotifyViaEmailUseCase } from "./notifyViaEmail";

const notifyViaEmailUseCase = new NotifyViaEmailUseCase(mailService);

export { notifyViaEmailUseCase };
