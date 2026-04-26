import { useEffect, useState } from "react";
import api from "./api";

export type Role = "creator" | "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  token?: string;
}

const KEY = "viral_auth_user";

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser | null) {
  if (user) localStorage.setItem(KEY, JSON.stringify(user));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("auth-change"));
}

export function useAuth() {
  const [user, setUserState] = useState<AuthUser | null>(getUser());
  useEffect(() => {
    const handler = () => setUserState(getUser());
    window.addEventListener("auth-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("auth-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return {
    user,
    login: (u: AuthUser) => setUser(u),
    logout: () => setUser(null),
  };
}

export async function login(email: string, password: string): Promise<AuthUser> {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;

    const user: AuthUser = {
      id: userData._id,
      // Backend login returns 'username' not 'name'. Use name if present, else username.
      name: userData.name || userData.username || email.split('@')[0],
      email: userData.email,
      role: userData.role || "user",
      avatar: userData.avatar,
      token,
    };

    setUser(user);
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function googleLogin(accessToken: string): Promise<AuthUser> {
  try {
    const response = await api.post('/auth/google', { accessToken });
    const { token, ...userData } = response.data;

    const user: AuthUser = {
      id: userData._id,
      name: userData.name || userData.username,
      email: userData.email,
      role: userData.role || "user",
      avatar: userData.avatar,
      token,
    };

    setUser(user);
    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Google login failed');
  }
}

export async function register(userData: {
  name: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  referredBy?: string;
}): Promise<any> {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function verifyOtp(email: string, otp: string): Promise<any> {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
}

export async function resendOtp(email: string): Promise<any> {
  try {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
}

export async function forgotPassword(email: string): Promise<any> {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send reset OTP');
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string): Promise<any> {
  try {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
}

