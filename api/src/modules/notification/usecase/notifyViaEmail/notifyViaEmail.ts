import type { UseCase } from "../../../../shared/core/usecase";
import { appLogger } from "../../../../shared/utils/logger";
import type { IMailService } from "../../services/mailService";

interface Request {
  options: any;
}

export class NotifyViaEmailUseCase implements UseCase<Request, Promise<void>> {
  private mailService: IMailService;

  constructor(mailService: IMailService) {
    this.mailService = mailService;
  }

  async execute(req: Request): Promise<void> {
    try {
      await this.mailService.sendMail(req.options);
      appLogger.info("Mail send successfully");
    } catch (err) {
      appLogger.error(err);
    }
  }
}
