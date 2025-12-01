import { injectable, singleton } from 'tsyringe';
import jwt from 'jsonwebtoken';
import UserRepository from '../repository/user.repository';
import {
  RegisterUserDto,
  LoginUserDto,
  VerifyOtp,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
  UserFilter,
} from '../types';
import { generateOTP } from '../utils/otp';
import { config } from '../../../config/environmentVariables';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../../shared/utils/logger';
import { ServiceStatus } from '../../../shared/utils/constants';
import ServiceException from '../../../shared/utils/serverException';
import { EmailService } from '@/shared/services';
import { TEmailSendType } from '@/shared/types';
import bcrypt from 'bcryptjs';

@injectable()
@singleton()
export default class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(data: RegisterUserDto) {
    try {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ServiceException(
          StatusCodes.CONFLICT,
          ServiceStatus.FAILURE,
          'Email already exists',
        );
      }

      const user = await this.userRepository.create(data);
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await this.userRepository.updateOtp(user.id, otp, otpExpiresAt);

      // Send OTP via email
      const emailData: TEmailSendType = {
        to: data.email,
        subject: 'Register otp for notes',
        text: otp,
      };
      EmailService.send(emailData);

      return {
        message: 'Registration successful. Please verify your email.',
        userId: user.id,
      };
    } catch (error: any) {
      logger.error('Error in user registration:', error);
      throw error;
    }
  }

  async login(data: LoginUserDto) {
    try {
      const user = await this.userRepository.findByEmail(data.email);
      if (!user) {
        throw new ServiceException(
          StatusCodes.UNAUTHORIZED,
          ServiceStatus.FAILURE,
          'Invalid credentials',
        );
      }

      const isPasswordValid = await user.validatePassword(data.password);
      if (!isPasswordValid) {
        throw new ServiceException(
          StatusCodes.UNAUTHORIZED,
          ServiceStatus.FAILURE,
          'Invalid credentials',
        );
      }

      if (!user.isVerified) {
        throw new ServiceException(
          StatusCodes.FORBIDDEN,
          ServiceStatus.FAILURE,
          'Please verify your email first',
        );
      }

      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error: any) {
      logger.error('Error in user login:', error);
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    try {
      const user = await this.userRepository.findByEmail(data.email);
      if (!user) {
        throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, 'User not found');
      }

      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await this.userRepository.updateOtp(user.id, otp, otpExpiresAt);

      // Send OTP via email
      const emailData: TEmailSendType = {
        to: data.email,
        subject: 'Password reset otp for notes',
        text: otp,
      };
      EmailService.send(emailData);

      return { message: 'Password reset OTP sent to your email' };
    } catch (error: any) {
      logger.error('Error in forgot password:', error);
      throw error;
    }
  }

  async resetPassword(userId: number, data: ResetPasswordDto) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, 'User not found');
      }

      if (!user.otp || !user.otpExpiresAt) {
        throw new ServiceException(
          StatusCodes.BAD_REQUEST,
          ServiceStatus.FAILURE,
          'No OTP requested',
        );
      }

      if (user.otp !== data.otp) {
        throw new ServiceException(StatusCodes.BAD_REQUEST, ServiceStatus.FAILURE, 'Invalid OTP');
      }

      if (user.otpExpiresAt < new Date()) {
        throw new ServiceException(StatusCodes.BAD_REQUEST, ServiceStatus.FAILURE, 'OTP expired');
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 12);

      await this.userRepository.update(userId, {
        password: hashedPassword,
        otp: undefined,
        otpExpiresAt: undefined,
      });

      return { message: 'Password reset successful' };
    } catch (error: any) {
      logger.error('Error in reset password:', error);
      throw error;
    }
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, 'User not found');
      }

      if (data.email && data.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
          throw new ServiceException(
            StatusCodes.CONFLICT,
            ServiceStatus.FAILURE,
            'Email already exists',
          );
        }
      }

      const updatedUser = await this.userRepository.update(userId, data);
      return {
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error: any) {
      logger.error('Error in update user:', error);
      throw error;
    }
  }

  async getUsers(filters: UserFilter) {
    try {
      return await this.userRepository.getUsers(filters);
    } catch (error: any) {
      logger.error('Error in get users:', error);
      throw error;
    }
  }

  private generateToken(user: { id: number; email: string }) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1d' });
  }

  async verifyOtp(data: VerifyOtp) {
    try {
      const user = await this.userRepository.findByEmail(data.email);
      if (!user) {
        throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, 'User not found');
      }
      if (data.otp !== user.otp) {
        throw new ServiceException(StatusCodes.CONFLICT, ServiceStatus.FAILURE, "OTP didn't match");
      }
      if (user.otpExpiresAt && user.otpExpiresAt.getTime() < Date.now()) {
        throw new ServiceException(
          StatusCodes.BAD_REQUEST,
          ServiceStatus.FAILURE,
          'OTP has been expired',
        );
      }
      await this.userRepository.verifyUser(user.id);
      await this.userRepository.update(user.id, { otp: undefined, otpExpiresAt: undefined });
      return { message: 'Successfully verified otp' };
    } catch (error: any) {
      logger.error('Error in verifying otp:', error);
      throw error;
    }
  }
}
