/**
 * PracticeContentBox - 践行区块内容容器
 *
 * emphasis：液态玻璃（每页最多 1～2 处视觉重心）
 * plain：极简轻底（无金线边框），用于导读 / 自照 / 练习等大多数区块
 */

import type { ReactNode } from "react";
import {
  FONT_SERIF,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  rpx,
} from "../../../config/styles";

const INK = "#2A2A2A";

interface PracticeContentBoxProps {
  children: ReactNode;
  /** emphasis = 液态玻璃重心；plain = 极简轻底 */
  variant?: "emphasis" | "plain";
  /** 正文级字号（默认 28） */
  fontSize?: number;
}

export function PracticeContentBox({
  children,
  variant = "plain",
  fontSize = 28,
}: PracticeContentBoxProps) {
  const isEmphasis = variant === "emphasis";

  return (
    <div
      style={{
        ...(isEmphasis ? LIQUID_GLASS : {}),
        border: "none",
        borderRadius: rpx(28),
        background: isEmphasis
          ? "linear-gradient(135deg, rgba(255,255,255,0.48), rgba(233,216,166,0.1))"
          : "rgba(255,255,255,0.6)",
        boxShadow: isEmphasis ? undefined : "0 2px 14px rgba(80,66,38,0.05)",
        padding: `${rpx(isEmphasis ? 36 : 30)} ${rpx(isEmphasis ? 36 : 32)}`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(fontSize),
          color: INK,
          lineHeight: 1.78,
          textShadow: isEmphasis ? TEXT_ENGRAVED : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
