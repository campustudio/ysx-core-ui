/**
 * CrossFade - 通用「交叉淡化」容器（柔和过渡的唯一封装处）
 *
 * 任何「切换」都应走这里，保持全局气质一致：
 *   - 页面路由切换（见 `PageTransition`，内部即委托本组件）
 *   - 页内视图切换（如书架「书架视图 / 列表视图」）
 *   - 任何"同一位置内容被替换"的场景
 *
 * 工作方式：`contentKey` 变化时，把旧内容冻结为快照，**绝对定位浮于上层缓慢淡出**，
 * 新内容在常规流中缓慢淡入，形成 cross-dissolve，而非瞬间替换。
 *
 * ⚠️ 仅用 opacity，不用 transform / filter / perspective：
 *   这些会为 position:fixed 子元素（吸顶 Header、底部坞、导航栏）创建新的
 *   containing block，导致其相对本容器定位而错位/消失。position:absolute/relative
 *   不会触发该问题，故安全。
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  GENTLE_EASE_OUT,
  GENTLE_EASE_IN,
  GENTLE_FADE_IN_MS,
  GENTLE_FADE_OUT_MS,
} from "../../config/styles";

interface CrossFadeProps {
  /** 内容标识：变化即触发交叉淡化 */
  contentKey: string | number;
  children: ReactNode;
  /** 淡入时长(ms) */
  fadeInMs?: number;
  /** 淡出时长(ms) */
  fadeOutMs?: number;
  /** 淡出层叠放层级（默认浮于当前内容之上） */
  overlayZIndex?: number;
  /** 容器样式（默认 position:relative） */
  style?: CSSProperties;
}

interface Snapshot {
  key: string | number;
  node: ReactNode;
}

const STYLE_ID = "meta-crossfade-keyframes";
const KEYFRAMES = `
@keyframes meta-crossfade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes meta-crossfade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
`;

/** 仅注入一次全局 keyframes（避免每个实例重复插入 <style>） */
function useKeyframesOnce() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
  }, []);
}

export function CrossFade({
  contentKey,
  children,
  fadeInMs = GENTLE_FADE_IN_MS,
  fadeOutMs = GENTLE_FADE_OUT_MS,
  overlayZIndex = 5,
  style,
}: CrossFadeProps) {
  useKeyframesOnce();

  const lastChildrenRef = useRef<ReactNode>(children);
  const lastKeyRef = useRef<string | number>(contentKey);
  const [previous, setPrevious] = useState<Snapshot | null>(null);

  // contentKey 改变：把旧内容快照冻结为淡出层
  if (contentKey !== lastKeyRef.current) {
    setPrevious({ key: lastKeyRef.current, node: lastChildrenRef.current });
    lastKeyRef.current = contentKey;
  }
  lastChildrenRef.current = children;

  useEffect(() => {
    if (!previous) return;
    const t = window.setTimeout(() => setPrevious(null), fadeOutMs);
    return () => window.clearTimeout(t);
  }, [previous, fadeOutMs]);

  return (
    <div style={{ position: "relative", ...style }}>
      <div
        key={`cf-${contentKey}`}
        style={{
          animation: `meta-crossfade-in ${fadeInMs}ms ${GENTLE_EASE_OUT} both`,
        }}
      >
        {children}
      </div>

      {previous && (
        <div
          key={`cf-prev-${previous.key}`}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: overlayZIndex,
            pointerEvents: "none",
            animation: `meta-crossfade-out ${fadeOutMs}ms ${GENTLE_EASE_IN} both`,
          }}
        >
          {previous.node}
        </div>
      )}
    </div>
  );
}
