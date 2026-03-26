/**
 * API 配置与封装
 *
 * 统一管理后端 API 调用
 */

/** API 基础地址 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.metamindpt.com";

/** 微信 AppID */
export const WX_APPID = import.meta.env.VITE_WX_APPID || "wx61079aa3f7c3bd14";

/** 应用域名 */
export const APP_DOMAIN =
  import.meta.env.VITE_APP_DOMAIN || "https://www.metamindpt.com";

/**
 * 通用 API 请求封装
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * GET 请求
 */
export function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET" });
}

/**
 * POST 请求
 */
export function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}
