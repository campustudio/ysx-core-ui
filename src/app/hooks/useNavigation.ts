/**
 * useNavigation - 统一的导航栏管理 Hook
 *
 * 结合页面配置和滚动检测，提供统一的导航栏状态管理
 */

import { useCallback } from "react";
import { getNavConfig, type NavConfig } from "../config/navigation-config";
import { useScrollDirection } from "./useScrollDirection";

interface UseNavigationReturn {
  /** 导航配置 */
  config: NavConfig;
  /** 导航栏是否应该隐藏（综合考虑配置和滚动状态） */
  isHidden: boolean;
  /** 是否显示导航栏 */
  showNav: boolean;
  /** 当前激活的导航项索引 */
  activeIndex: number;
}

/**
 * 统一的导航栏管理 Hook
 * @param page 当前页面标识
 * @returns 导航栏状态和配置
 */
export function useNavigation(page: string): UseNavigationReturn {
  const config = getNavConfig(page);
  const { shouldHideNav } = useScrollDirection();

  // 只有在配置了 scrollHide 时，才根据滚动状态隐藏
  const isHidden = config.scrollHide && shouldHideNav;

  return {
    config,
    isHidden,
    showNav: config.showNav,
    activeIndex: config.activeIndex ?? 0,
  };
}

/**
 * 创建导航切换处理器
 * @param currentIndex 当前页面的导航索引
 * @param handlers 各导航项的处理函数
 */
export function useNavChangeHandler(
  currentIndex: number,
  handlers: {
    onHome?: () => void;
    onHandbook?: () => void;
    onNewLife?: () => void;
    onMirror?: () => void;
    onProfile?: () => void;
  },
) {
  return useCallback(
    (index: number) => {
      if (index === currentIndex) return;

      switch (index) {
        case 0:
          handlers.onHome?.();
          break;
        case 1:
          handlers.onHandbook?.();
          break;
        case 2:
          handlers.onNewLife?.();
          break;
        case 3:
          handlers.onMirror?.();
          break;
        case 4:
          handlers.onProfile?.();
          break;
      }
    },
    [currentIndex, handlers],
  );
}
