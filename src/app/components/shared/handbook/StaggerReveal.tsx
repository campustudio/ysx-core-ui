/**
 * StaggerReveal - 区块错峰淡入（践行页/今日一段用）
 */

import type { ReactNode } from "react";
import { rpx, GENTLE_EASE_OUT } from "../../../config/styles";

interface StaggerRevealProps {
  index: number;
  isVisible: boolean;
  children: ReactNode;
  style?: React.CSSProperties;
}

export function StaggerReveal({
  index,
  isVisible,
  children,
  style,
}: StaggerRevealProps) {
  const delay = index * 0.11;
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${rpx(20)})`,
        transition: `opacity 0.85s ${GENTLE_EASE_OUT} ${delay}s, transform 0.85s ${GENTLE_EASE_OUT} ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
