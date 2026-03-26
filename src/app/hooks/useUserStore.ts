/**
 * 用户状态管理 Hook
 *
 * 管理用户登录状态和用户信息
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  WxUserInfo,
  useWxAuth,
  getWxCodeFromUrl,
  isWechatBrowser,
  redirectToWxAuth,
} from "./useWxAuth";
import { apiGet } from "../config/api";

/** 用户状态 */
interface UserState {
  /** 是否已登录 */
  isLoggedIn: boolean;
  /** 用户信息 */
  userInfo: WxUserInfo | null;
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
}

/**
 * 用户状态管理 Hook
 */
export function useUserStore() {
  const [state, setState] = useState<UserState>({
    isLoggedIn: false,
    userInfo: null,
    loading: true,
    error: null,
  });

  const { handleCallback, logout: wxLogout } = useWxAuth();
  const initializedRef = useRef(false);

  /**
   * 初始化：检查登录状态
   */
  const initialize = useCallback(async () => {
    const token = localStorage.getItem("token");
    const code = getWxCodeFromUrl();
    const isWx = isWechatBrowser();

    // 如果有 code，处理微信授权回调
    if (code) {
      try {
        const user = await handleCallback();
        if (user) {
          setState({
            isLoggedIn: true,
            userInfo: user,
            loading: false,
            error: null,
          });
          return;
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "登录失败";
        setState({
          isLoggedIn: false,
          userInfo: null,
          loading: false,
          error: errMsg,
        });
        return;
      }
    }

    // 如果有 token，获取用户信息
    if (token) {
      try {
        const user = await apiGet<WxUserInfo>("/v1/user/profile");
        setState({
          isLoggedIn: true,
          userInfo: user,
          loading: false,
          error: null,
        });
      } catch {
        // token 无效，清除并重新授权
        localStorage.removeItem("token");
        if (isWx) {
          // 在微信浏览器中，重新跳转授权
          redirectToWxAuth();
          return;
        }
        setState({
          isLoggedIn: false,
          userInfo: null,
          loading: false,
          error: null,
        });
      }
    } else {
      // 没有 token 且没有 code，检查是否在微信浏览器中
      // 如果是，自动跳转到微信授权页面
      if (isWx) {
        redirectToWxAuth();
        return;
      }

      // 非微信浏览器，设置为未登录状态
      setState({
        isLoggedIn: false,
        userInfo: null,
        loading: false,
        error: null,
      });
    }
  }, [handleCallback]);

  /**
   * 登录成功后更新状态
   */
  const setUser = useCallback((user: WxUserInfo) => {
    setState({
      isLoggedIn: true,
      userInfo: user,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * 退出登录
   */
  const logout = useCallback(() => {
    wxLogout();
    setState({
      isLoggedIn: false,
      userInfo: null,
      loading: false,
      error: null,
    });
  }, [wxLogout]);

  /**
   * 清除错误
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // 组件挂载时初始化（只执行一次）
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initialize();
  }, [initialize]);

  return {
    ...state,
    setUser,
    logout,
    clearError,
    initialize,
  };
}
