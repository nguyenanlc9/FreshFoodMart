import { apiRequest } from "./queryClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: number;
  email: string;
}

export async function login(credentials: LoginCredentials): Promise<AdminUser> {
  const response = await apiRequest("POST", "/api/admin/login", credentials);
  const data = await response.json();
  return data.admin;
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/admin/logout");
}

export async function checkAuth(): Promise<{ authenticated: boolean; adminId?: number }> {
  try {
    const response = await apiRequest("GET", "/api/admin/me");
    return await response.json();
  } catch (error) {
    return { authenticated: false };
  }
}
