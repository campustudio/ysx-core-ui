/**
 * BottomSheet - 通用底部抽屉（极简 / 零滚动锁 / 零全局监听 / 零 body 锁）
 *
 * 根本原因复盘（2026-06-06，详见 spec/design/ui-design-system.md §十三）：
 * 本应用是「内层容器滚动」架构——页面根 height:100vh，内部 div overflow:auto 自己滚，
 * body 从不滚动。而成熟弹层库（vaul / Radix）「防止背景滚动」依赖 react-remove-scroll，
 * 其设计前提是「页面滚 body」：它会锁 body 并挂一批非 passive 的 wheel/touchmove 监听
 * 去 preventDefault。这与内层容器滚动天生冲突，且在快速反复开关时监听泄漏残留，导致
 * 「关闭后第一下滚不动」「开关若干次后整页彻底滚不动」。
 *
 * 关键认知：我们「根本不需要」滚动锁。一个铺满全屏的固定遮罩，天然就挡住了背景滚动
 * （遮罩的滚动祖先是 body，不是内层滚动容器，触碰/滚轮都带不动背景）。所以这里：
 *   - 不锁 body、不挂任何全局监听、不引入 react-remove-scroll；
 *   - 遮罩/面板的 pointer-events 直接绑定父级 visible（唯一真相），关闭即放行，
 *     即使万一未及时卸载也绝不可能拦截背景；动画结束后再卸载。
 * 如此，关闭后没有任何残留，两类卡死从机制上都不可能再发生。
 *
 * 接口与旧版一致，调用方无需改动。
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { rpx, GENTLE_EASE_OUT, GENTLE_EASE_IN } from "../../config/styles";

const ENTER_MS = 420;
const EXIT_MS = 320;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 面板背景（夜间模式可传深色） */
  background?: string;
  /** 面板最大高度 */
  maxHeight?: string;
  /** 面板内容内边距 */
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
  /** 纯视觉「展开态」：驱动升起/淡入动画，与 pointer-events 解耦 */
  const [shown, setShown] = useState(false);
  const rafRef = useRef<number[]>([]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // 双 rAF：先以收起态挂载，下一帧再切到展开态，触发升起动画
      const r1 = requestAnimationFrame(() => {
        const r2 = requestAnimationFrame(() => setShown(true));
        rafRef.current.push(r2);
      });
      rafRef.current.push(r1);
      return () => {
        rafRef.current.forEach(cancelAnimationFrame);
        rafRef.current = [];
      };
    }
    // 关闭：立刻收起视觉；卸载延后到动画结束
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [visible]);

  if (!mounted || typeof document === "undefined") return null;

  const resolvedPadding =
    padding ??
    `${rpx(8)} ${rpx(40)} calc(env(safe-area-inset-bottom) + ${rpx(40)})`;

  // pointer-events 绑定「可见态 shown」而非「visible」：只有肉眼可见（遮罩已淡入）时才拦截。
  // 这样物理上杜绝「visible=true 但 shown=false」的隐形遮罩——看不见就绝不挡路，
  // 关闭/收起动画期间 shown 立即为 false → 立刻放行，绝不可能出现「看不到弹框却滚不动」。
  const interactive: CSSProperties["pointerEvents"] = shown ? "auto" : "none";

  const panelStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    maxHeight,
    background,
    borderRadius: `${rpx(32)} ${rpx(32)} 0 0`,
    padding: resolvedPadding,
    overflowY: "auto",
    overscrollBehavior: "contain",
    transform: shown ? "translateY(0)" : "translateY(100%)",
    transition: `transform ${shown ? ENTER_MS : EXIT_MS}ms ${
      shown ? GENTLE_EASE_OUT : GENTLE_EASE_IN
    }`,
    pointerEvents: interactive,
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        display: "flex",
        alignItems: "flex-end",
        pointerEvents: interactive,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          opacity: shown ? 1 : 0,
          transition: `opacity ${shown ? ENTER_MS : EXIT_MS}ms ease`,
        }}
      />
      <div onClick={(e) => e.stopPropagation()} style={panelStyle}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
