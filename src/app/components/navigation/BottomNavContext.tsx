/**
 * BottomNavContext - 全局底部导航状态（供页面内的固定底部按钮/坞「跟随」导航）
 *
 * 由 `App` 统一计算并下发：
 *   - present：本页是否存在全局底部导航
 *   - hidden ：当前是否隐藏（滚动隐藏 / 沉浸页）
 *   - height ：导航占位高度（含安全区），用于把底部按钮抬到导航之上
 *
 * 页面里的固定底部坞/按钮消费它后：导航显示时上抬到导航之上、隐藏时随之落回底部，
 * 既不会被遮挡，也不会留下突兀空隙（柔和跟随）。
 */

import { createContext, useContext } from "react";

export interface BottomNavState {
  present: boolean;
  hidden: boolean;
  /** 导航占位高度（含安全区）的 CSS 值 */
  height: string;
}

const DEFAULT_STATE: BottomNavState = {
  present: false,
  hidden: true,
  height: "0px",
};

const BottomNavContext = createContext<BottomNavState>(DEFAULT_STATE);

export const BottomNavProvider = BottomNavContext.Provider;

export function useBottomNav(): BottomNavState {
  return useContext(BottomNavContext);
}
