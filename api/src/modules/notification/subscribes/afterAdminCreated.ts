import { appConfig } from "../../../config";
import { appLogger } from "../../../shared/utils/logger";
import type IAdmin from "../../admin/model/admin";
import type { NotifyViaEmailUseCase } from "../usecase/notifyViaEmail/notifyViaEmail";

export class AfterAdminCreated {
  private notifyViaEmail: NotifyViaEmailUseCase;
  //   private otpGeneratedUseCase: OTPGeneratorUseCase;

  constructor(
    notifyViaEmail: NotifyViaEmailUseCase
    // otpGeneratedUseCase: OTPGeneratorUseCase
  ) {
    this.notifyViaEmail = notifyViaEmail;
    // this.otpGeneratedUseCase = otpGeneratedUseCase;
  }

  private craftEmailMessage(admin: IAdmin, dateTime: Date): any {
    return {
      from: appConfig.fromMail,
      to: `${admin.email}`,
      subject: " Welcome to MMG Community!",
      html: `
      <h4>Dear ${admin.name}</h4>
      <p>Welcome to MMG Community! We're thrilled to have you join our community and embark on this journey with us.</p>`,
    };
  }

  public async onAdminCreatedEvent(event: {
    admin: IAdmin;
    dateTimeOccurred: Date;
  }): Promise<void> {
    const { admin, dateTimeOccurred } = event;

    try {
      await this.notifyViaEmail.execute({
        options: this.craftEmailMessage(admin, dateTimeOccurred),
      });

      appLogger.info(
        "[AfterUserCreated]: Successfully executed NotifyViaEmailUseCase   AfterUserCreated"
      );
    } catch (err) {
      appLogger.error(
        "[AfterUserCreated]: Failed to execute NotifyViaEmailUseCase AfterUserCreated."
      );
    }
  }
}
