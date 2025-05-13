import nodeMailer from "nodemailer";
import { appConfig, isProduction } from "../../../config";
import { appLogger } from "../../../shared/utils/logger";

export interface IMailService {
  sendMail(options: any): Promise<void>;
}
export class MailService implements IMailService {
  transporter: any;

  constructor() {
    this.init();
  }

  private init() {
    this.transporter = nodeMailer.createTransport({
      host: appConfig.nodeMailerHost,
      port: 587,
      secure: false,
      auth: {
        user: appConfig.nodeMailerUser,
        pass: appConfig.nodeMailerPass,
      },
      logger: !isProduction,
    });
  }

  async sendMail(options: any): Promise<void> {
    // send mail with defined transport object
    // eslint-disable-next-line no-param-reassign

    try {
      const info = await this.transporter.sendMail(options);
      appLogger.info(info);
    } catch (err) {
      appLogger.error(err);
    }
  }
}
