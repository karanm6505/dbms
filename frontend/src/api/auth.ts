import { apiClient } from "./client";
import { AuthUser } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/auth/login", payload);
  },
  async getCurrentUser(): Promise<AuthUser> {
    return apiClient.get<AuthUser>("/api/auth/me");
  },
  async register(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/auth/register", payload);
  },
};
