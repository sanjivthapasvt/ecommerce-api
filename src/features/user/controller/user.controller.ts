import { Request, Response, NextFunction } from 'express';
import { injectable, singleton } from 'tsyringe';
import UserService from '../services/user.service';
import { StatusCodes } from 'http-status-codes';
import { ServerResponse } from '../../../shared/utils/serverResponse';
import {
  RegisterUserDto,
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
  VerifyOtp,
} from '../types';

@injectable()
@singleton()
export default class UserController {
  constructor(private userService: UserService) {}

  async register(req: Request<{}, {}, RegisterUserDto>, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.register(req.body);
      res.status(StatusCodes.CREATED).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request<{}, {}, VerifyOtp>, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.verifyOtp(req.body);
      res.status(StatusCodes.ACCEPTED).json();
      ServerResponse.success(result).toJson();
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request<{}, {}, LoginUserDto>, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.login(req.body);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request<{}, {}, ForgotPasswordDto>, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.forgotPassword(req.body);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request<{ userId: number }, {}, ResetPasswordDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await this.userService.resetPassword(req.params.userId, req.body);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request<{ userId: number }, {}, UpdateUserDto>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await this.userService.updateUser(req.params.userId, req.body);
      res.status(StatusCodes.OK).json(ServerResponse.success(result).toJson());
    } catch (error) {
      next(error);
    }
  }
}
