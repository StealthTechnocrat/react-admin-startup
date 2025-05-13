import { appConfig } from "../../../config";
import { JWTUtils } from "../../../shared/utils/JWTUtils";
import { appLogger } from "../../../shared/utils/logger";
import type IAdmin from "../../admin/model/admin";
import type { NotifyViaEmailUseCase } from "../usecase/notifyViaEmail/notifyViaEmail";

export class VerifiyEmailSubscriber {
  private notifyViaEmail: NotifyViaEmailUseCase;

  constructor(notifyViaEmail: NotifyViaEmailUseCase) {
    this.notifyViaEmail = notifyViaEmail;
  }

  private craftVerifiyEmailMessage(
    admin: IAdmin,
    verifiyToken: string,
    dateTime: Date
  ): any {
    const verifiyEmailLink = `${appConfig.frontendBaseUrl}/verifiy-email?token=${verifiyToken}`;

    return {
      from: appConfig.fromMail,
      to: `${admin.email}`,
      subject: "Password Reset Request",
      html: `
      <h4>Dear ${admin.name}</h4>
      <p>We received a request to verifiy your email. If you did not make this request, please ignore this email.</p>
      <p>To Verifiy, click the link below:</p>
      <a href="${verifiyEmailLink}" target="_blank">Verify Email</a>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Regards,</p>
      <p>Your Elite Community Team</p>`,
    };
  }

  public async onVerifiyEmailRequest(event: {
    admin: IAdmin;
    dateTimeOccurred: Date;
  }): Promise<void> {
    const { admin, dateTimeOccurred } = event;

    try {
      // Generate a verifiy email token

      const verifiyToken = JWTUtils.signJWT({
        adminId: admin.adminId,
        email: admin.email,
        name: admin.name,
      });

      // Craft the email content with the reset link
      const emailOptions = this.craftVerifiyEmailMessage(
        admin,
        verifiyToken,
        dateTimeOccurred
      );

      // Send the email with the reset link
      await this.notifyViaEmail.execute({
        options: emailOptions,
      });

      appLogger.info(
        "[VerifiyEmailSubscriber]: Successfully sent password reset email."
      );
    } catch (err) {
      appLogger.error(
        "[VerifiyEmailSubscriber]: Failed to send password reset email."
      );
    }
  }
}
