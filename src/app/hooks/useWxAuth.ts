/**
 * 微信授权 Hook
 *
 * 处理微信公众号网页授权流程
 */

import { useCallback } from "react";
import { WX_APPID, APP_DOMAIN, API_BASE_URL } from "../config/api";

/** 用户信息类型 */
export interface WxUserInfo {
  openid: string;
  nickname: string;
  avatar: string;
  /** 同行天数 */
  days: number;
}

/** 登录响应类型 */
interface LoginResponse {
  token: string;
  user: WxUserInfo;
}

/**
 * 检测是否在微信浏览器中
 */
export function isWechatBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
}

/**
 * 获取微信授权 URL
 * @param state 可选状态参数，用于防止 CSRF
 */
export function getWxAuthUrl(state = "STATE"): string {
  const redirectUri = encodeURIComponent(`${APP_DOMAIN}/app/index.html`);
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
}

/**
 * 跳转到微信授权页面
 */
export function redirectToWxAuth(state = "STATE"): void {
  window.location.href = getWxAuthUrl(state);
}

/**
 * 从 URL 中获取微信授权 code
 */
export function getWxCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

/**
 * 使用 code 换取用户信息
 */
export async function wxLogin(code: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/wx/login?code=${code}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "登录失败" }));
    throw new Error(error.detail || "微信登录失败");
  }

  return response.json();
}

/**
 * 微信授权 Hook
 */
export function useWxAuth() {
  /**
   * 检查并处理微信授权回调
   * @returns 如果有 code 则返回 true，否则返回 false
   */
  const handleCallback = useCallback(async (): Promise<WxUserInfo | null> => {
    const code = getWxCodeFromUrl();

    if (!code) {
      return null;
    }

    try {
      const { token, user } = await wxLogin(code);

      // 保存 token
      localStorage.setItem("token", token);

      // 清理 URL 中的 code 参数
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      window.history.replaceState({}, "", url.toString());

      return user;
    } catch (error) {
      console.error("微信登录失败:", error);
      throw error;
    }
  }, []);

  /**
   * 发起微信授权
   */
  const login = useCallback(() => {
    if (!isWechatBrowser()) {
      console.warn("请在微信中打开此页面");
      return;
    }
    redirectToWxAuth();
  }, []);

  /**
   * 退出登录
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
  }, []);

  /**
   * 检查是否已登录
   */
  const isLoggedIn = useCallback((): boolean => {
    return !!localStorage.getItem("token");
  }, []);

  return {
    isWechatBrowser,
    handleCallback,
    login,
    logout,
    isLoggedIn,
  };
}
