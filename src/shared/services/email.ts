import { StatusCodes } from 'http-status-codes';
import { transporter } from '../lib/nodemailer';
import { ServiceStatus } from '../utils/constants';
import { logger } from '../utils/logger';
import ServiceException from '../utils/serverException';
import { TEmailSendType } from '../types';

export default class EmailService {
  static async send({ to, subject, html}: TEmailSendType) {
    try {
      const result = await transporter.sendMail({
        from: process.env.SMTP2GO_FROM_EMAIL,
        to: to,
        subject: subject,
        html: html
      })
      logger.info(`Email sent to ${JSON.stringify(to)}:`, result);
    } catch (error) {
      logger.error('Unable to send email', error);
      throw new ServiceException(
        StatusCodes.BAD_REQUEST,
        ServiceStatus.FAILURE,
        'Unable to send email.',
      );
    }
  }
}
