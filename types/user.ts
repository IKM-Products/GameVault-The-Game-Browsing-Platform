// types/user.ts

export type UserRole = "user" | "admin";

export interface User {
  id: string;

  name: string | null;

  email: string;

  image: string | null;

  emailVerified: boolean;

  role: UserRole;

  createdAt: Date;

  updatedAt: Date;
}

export interface UpdateUserPayload {
  name: string;
  image?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
}

export interface UserProfile extends User {
  vaultCount?: number;
}