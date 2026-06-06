/**
 * BottomSheet - 通用底部抽屉（柔和升起 / 缓慢降下的唯一封装处）
 *
 * 任何「从底部弹出的面板/抽屉」都应走这里，保证：
 *   - 背板（遮罩）**淡入 / 淡出**，不硬切
 *   - 面板**从底部缓慢升起**，关闭时**缓慢降回**底部（关闭也有过渡，不瞬间消失）
 *
 * 关闭动画期间组件**保持挂载**，待动画结束再卸载，所以「关」也是柔和的。
 *
 * ⚠️ 仅面板用 transform（其内部无 position:fixed 子元素），遮罩用 opacity。
 */

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { rpx, GENTLE_EASE_OUT, GENTLE_EASE_IN } from "../../config/styles";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

const ENTER_MS = 460;
const EXIT_MS = 380;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 面板背景（夜间模式可传深色） */
  background?: string;
  /** 面板最大高度 */
  maxHeight?: string;
  /** 面板内边距 */
  padding?: string;
  /** 叠放层级 */
  zIndex?: number;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  background = "#fff",
  maxHeight = "70vh",
  padding,
  zIndex = 50,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(visible);
  const [open, setOpen] = useState(false);

  useBodyScrollLock(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // 双 rAF 确保先以「收起态」挂载，再过渡到「展开态」，触发升起动画
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setOpen(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setOpen(false);
    const t = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [visible]);

  if (!mounted) return null;

  const resolvedPadding =
    padding ??
    `${rpx(32)} ${rpx(40)} calc(env(safe-area-inset-bottom) + ${rpx(40)})`;

  const panelStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    maxHeight,
    background,
    borderRadius: `${rpx(32)} ${rpx(32)} 0 0`,
    padding: resolvedPadding,
    overflowY: "auto",
    transform: open ? "translateY(0)" : "translateY(100%)",
    transition: `transform ${open ? ENTER_MS : EXIT_MS}ms ${
      open ? GENTLE_EASE_OUT : GENTLE_EASE_IN
    }`,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          opacity: open ? 1 : 0,
          transition: `opacity ${open ? ENTER_MS : EXIT_MS}ms ease`,
        }}
      />
      <div onClick={(e) => e.stopPropagation()} style={panelStyle}>
        {children}
      </div>
    </div>
  );
}
