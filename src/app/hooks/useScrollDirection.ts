/**
 * useScrollDirection - 滚动方向检测 Hook
 *
 * 用于检测页面滚动方向，实现底部导航栏的滚动隐藏/显示效果
 */

import { useState, useEffect, useRef } from "react";

export type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  /** 触发方向变化的最小滚动距离 */
  threshold?: number;
  /** 是否启用 */
  enabled?: boolean;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10, enabled = true } = options;
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // 检测是否在顶部
      setIsAtTop(scrollY < 10);

      // 计算滚动差值
      const diff = scrollY - lastScrollY.current;

      // 只有超过阈值才更新方向
      if (Math.abs(diff) >= threshold) {
        setScrollDirection(diff > 0 ? "down" : "up");
        lastScrollY.current = scrollY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    // 初始化
    lastScrollY.current = window.scrollY;
    setIsAtTop(window.scrollY < 10);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold, enabled]);

  return {
    scrollDirection,
    isAtTop,
    /** 向下滚动时隐藏导航栏 */
    shouldHideNav: scrollDirection === "down" && !isAtTop,
  };
}
