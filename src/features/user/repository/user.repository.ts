import { Repository } from 'typeorm';
import { injectable, singleton } from 'tsyringe';
import { User } from '../models/user.model';
import AppDataSource from '../../../config/database';
import { UserFilter, TUser } from '../types';
import { logger } from '../../../shared/utils/logger';
import ServiceException from '../../../shared/utils/serverException';
import { getDatabaseExceptionStatusCode } from '../../../shared/utils/helper';
import { ServiceStatus } from '../../../shared/utils/constants';
import { buildPaginatedResult } from '../../../shared/utils/pagination';

@injectable()
@singleton()
export default class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { email } });
    } catch (error: any) {
      logger.error('Unable to find user by email.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to find user by email.',
      );
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error: any) {
      logger.error('Unable to find user by id.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to find user by id.',
      );
    }
  }

  async create(user: Partial<TUser>): Promise<User> {
    try {
      const newUser = this.repository.create(user);
      return await this.repository.save(newUser);
    } catch (error: any) {
      logger.error('Unable to create user.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to create user.',
      );
    }
  }

  async update(id: number, data: Partial<TUser>): Promise<User | null> {
    try {
      await this.repository.update(id, data);
      return this.findById(id);
    } catch (error: any) {
      logger.error('Unable to update user.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to update user.',
      );
    }
  }

  async updateOtp(id: number, otp: string, expiresAt: Date): Promise<void> {
    try {
      await this.repository.update(id, { otp, otpExpiresAt: expiresAt });
    } catch (error: any) {
      logger.error('Unable to update user OTP.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to update user OTP.',
      );
    }
  }

  async verifyUser(id: number): Promise<void> {
    try {
      await this.repository.update(id, { isVerified: true });
    } catch (error: any) {
      logger.error('Unable to verify user.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to verify user.',
      );
    }
  }

  async getUsers(filters: UserFilter) {
    try {
      const { page = 1, limit = 10, search, isVerified } = filters;
      const skip = (page - 1) * limit;

      const queryBuilder = this.repository.createQueryBuilder('user');

      if (search) {
        queryBuilder.where(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (typeof isVerified === 'boolean') {
        queryBuilder.andWhere('user.isVerified = :isVerified', { isVerified });
      }

      const [users, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('user.createdAt', 'DESC')
        .getManyAndCount();

      return buildPaginatedResult(users, total, page, limit);
    } catch (error: any) {
      logger.error('Unable to get users.', error);
      throw new ServiceException(
        getDatabaseExceptionStatusCode(error),
        ServiceStatus.FAILURE,
        'Unable to get users.',
      );
    }
  }
} 