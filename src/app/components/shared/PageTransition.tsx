/**
 * PageTransition - 页面转场动画包装器
 *
 * 根据导航方向播放不同的入场动画：
 *   forward（前进）: 淡入（稍慢，0.38s）
 *   back（返回）:    淡入（稍快，0.3s）
 *
 * ⚠️ 不使用 transform！
 *   transform / will-change:transform 会创建新的 containing block，
 *   导致子组件中 position:fixed 的元素（底部导航栏、吸顶 Header）
 *   相对于此 div 定位而非 viewport，从而"消失"。
 *   因此只用 opacity 动画，符合「克制自然」品牌调性。
 *
 * Props:
 *   - direction: 导航方向 "forward" | "back"
 *   - children: 页面内容
 */

import { useEffect, useState, type ReactNode } from "react";

interface Props {
  /** 导航方向：forward 前进 | back 返回 */
  direction?: "forward" | "back";
  children: ReactNode;
}

/**
 * CSS 关键帧 — 仅使用 opacity，不用 transform
 * forward: 透明度 0→1（稍慢）
 * back:    透明度 0→1（稍快）
 */
const TRANSITION_STYLES = `
@keyframes meta-page-forward {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes meta-page-back {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

export function PageTransition({ direction = "forward", children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const animName =
    direction === "forward" ? "meta-page-forward" : "meta-page-back";
  const duration = direction === "forward" ? "0.38s" : "0.3s";

  return (
    <>
      <style>{TRANSITION_STYLES}</style>
      <div
        style={{
          animation: `${animName} ${duration} cubic-bezier(0.25, 0.1, 0.25, 1) both`,
          willChange: mounted ? "auto" : "opacity",
        }}
      >
        {children}
      </div>
    </>
  );
}
