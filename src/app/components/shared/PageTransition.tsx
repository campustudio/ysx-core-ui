/**
 * PageTransition - 全局页面路由转场
 *
 * 仅是 `CrossFade` 的一层路由语义封装：把柔和交叉淡化的实现统一收口在
 * `CrossFade` 中（见该文件）。本组件只负责按导航方向微调时长。
 *
 * ⚠️ 不使用 transform（详见 CrossFade 注释）。
 */

import { type ReactNode } from "react";
import { CrossFade } from "./CrossFade";
import { GENTLE_FADE_IN_MS, GENTLE_FADE_OUT_MS } from "../../config/styles";

interface Props {
  routeKey: number;
  direction?: "forward" | "back";
  children: ReactNode;
}

export function PageTransition({
  routeKey,
  direction = "forward",
  children,
}: Props) {
  // 返回略快于前进，符合「展开 ≥ 收起」的气质
  const fadeInMs =
    direction === "forward" ? GENTLE_FADE_IN_MS : GENTLE_FADE_IN_MS - 60;

  return (
    <CrossFade
      contentKey={routeKey}
      fadeInMs={fadeInMs}
      fadeOutMs={GENTLE_FADE_OUT_MS}
      overlayZIndex={200}
    >
      {children}
    </CrossFade>
  );
}
