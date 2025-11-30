export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

// DTOs
export type RegisterUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginUserDto = {
  email: string;
  password: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  otp: string;
  newPassword: string;
};

export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export type UserFilter = {
  page?: number;
  limit?: number;
  search?: string;
  isVerified?: boolean;
}; 

export type VerifyOtp = {
  email: string;
  otp: string;
}