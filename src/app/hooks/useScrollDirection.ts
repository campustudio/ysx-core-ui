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

/** 从滚动事件目标读取 scrollTop（兼容 window 滚动与任意内层滚动容器） */
function readScrollTop(target: EventTarget | null): number {
  if (
    !target ||
    target === document ||
    target === window ||
    target === document.documentElement ||
    target === document.body
  ) {
    return (
      window.scrollY ||
      document.documentElement?.scrollTop ||
      document.body?.scrollTop ||
      0
    );
  }
  if (target instanceof HTMLElement) return target.scrollTop;
  return window.scrollY;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10, enabled = true } = options;
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const lastTarget = useRef<EventTarget | null>(null);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const update = (target: EventTarget | null) => {
      const scrollY = readScrollTop(target);
      setIsAtTop(scrollY < 10);

      // 切换了滚动容器（如换页面）→ 重置基线，本次不判定方向，避免误触
      if (target !== lastTarget.current) {
        lastTarget.current = target;
        lastScrollY.current = scrollY;
        ticking.current = false;
        return;
      }

      const diff = scrollY - lastScrollY.current;
      if (Math.abs(diff) >= threshold) {
        setScrollDirection(diff > 0 ? "down" : "up");
        lastScrollY.current = scrollY;
      }
      ticking.current = false;
    };

    // capture:true → 即便滚动发生在内层容器（scroll 事件不冒泡），
    // 挂在 window 上的捕获监听也能在捕获阶段收到，从而支持任意滚动区域。
    const onScroll = (e: Event) => {
      const target = e.target;
      if (!ticking.current) {
        window.requestAnimationFrame(() => update(target));
        ticking.current = true;
      }
    };

    lastScrollY.current = window.scrollY;
    setIsAtTop(window.scrollY < 10);

    const opts: AddEventListenerOptions = { passive: true, capture: true };
    window.addEventListener("scroll", onScroll, opts);

    return () => {
      window.removeEventListener("scroll", onScroll, opts);
    };
  }, [threshold, enabled]);

  return {
    scrollDirection,
    isAtTop,
    /** 向下滚动时隐藏导航栏 */
    shouldHideNav: scrollDirection === "down" && !isAtTop,
  };
}
