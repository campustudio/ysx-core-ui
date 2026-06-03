/**
 * useBodyScrollLock - 防止弹窗/抽屉打开时背景滚动穿透
 *
 * 当弹窗打开时锁定 body 滚动，关闭时恢复。
 * 用于 Modal、Sheet、Drawer 等遮罩组件。
 */

import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
