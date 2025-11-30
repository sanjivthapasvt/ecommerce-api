import { Router } from 'express';
import { container } from 'tsyringe';
import UserController from '../controller/user.controller';
import { validate } from '@/middleware/validateRequest';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  OtpSchema,
} from '../schema/user.schema';
import { authenticate } from '../../../middleware/auth';

const router = Router();
const userController = container.resolve(UserController);

// Public routes
router.post('/register', validate(registerSchema), userController.register.bind(userController));

router.post(
  '/register/verify-otp',
  validate(OtpSchema),
  userController.verifyOtp.bind(userController),
);

router.post('/login', validate(loginSchema), userController.login.bind(userController));

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  userController.forgotPassword.bind(userController),
);

router.post(
  '/reset-password/:userId',
  validate(resetPasswordSchema),
  userController.resetPassword.bind(userController),
);

// Protected routes
router.use(authenticate);

router.patch(
  '/:userId',
  validate(updateUserSchema),
  userController.updateUser.bind(userController),
);

export const userRoutes = router;
