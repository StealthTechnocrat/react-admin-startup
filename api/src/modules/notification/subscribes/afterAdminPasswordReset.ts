import { appConfig } from "../../../config";
import { JWTUtils } from "../../../shared/utils/JWTUtils";
import { appLogger } from "../../../shared/utils/logger";
import type IAdmin from "../../admin/model/admin";
import type { NotifyViaEmailUseCase } from "../usecase/notifyViaEmail/notifyViaEmail";

export class AfterAdminPasswordReset {
  private notifyViaEmail: NotifyViaEmailUseCase;

  constructor(notifyViaEmail: NotifyViaEmailUseCase) {
    this.notifyViaEmail = notifyViaEmail;
  }

  private craftPasswordResetEmail(
    admin: IAdmin,
    resetToken: string,
    dateTime: Date
  ): any {
    const resetLink = `${appConfig.frontendBaseUrl}/reset-password?token=${resetToken}`;

    return {
      from: appConfig.fromMail,
      to: `${admin.email}`,
      subject: "Password Reset Request",
      html: `
      <h4>Dear ${admin.name}</h4>
      <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
      <p>To reset your password, click the link below:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Regards,</p>
      <p>Your MMG Community Team</p>`,
    };
  }

  public async onPasswordResetRequestedEvent(event: {
    admin: IAdmin;
    dateTimeOccurred: Date;
  }): Promise<void> {
    const { admin, dateTimeOccurred } = event;

    try {
      // Generate a password reset token
      const resetToken = JWTUtils.signJWT({
        adminId: admin.adminId,
        email: admin.email,
        name: admin.name,
      });

      // Craft the email content with the reset link
      const emailOptions = this.craftPasswordResetEmail(
        admin,
        resetToken,
        dateTimeOccurred
      );

      // Send the email with the reset link
      await this.notifyViaEmail.execute({
        options: emailOptions,
      });

      appLogger.info(
        "[AfterAdminPasswordReset]: Successfully sent password reset email."
      );
    } catch (err) {
      appLogger.error(
        "[AfterAdminPasswordReset]: Failed to send password reset email."
      );
    }
  }
}
