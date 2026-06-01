/**
 * PrimaryButton - 金色主按钮（响应式）
 *
 * 用于"进入完整书架"等主操作入口。
 * 图标 + 标题 + 副标题，宽高自适应内容。
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import { rpx } from "../../config/styles";

interface PrimaryButtonProps {
  /** Lucide 图标组件 */
  icon: LucideIcon;
  /** 主标题 */
  title: string;
  /** 副标题（可选） */
  subtitle?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义样式（可选） */
  style?: React.CSSProperties;
}

export function PrimaryButton({
  icon: Icon,
  title,
  subtitle,
  onClick,
  style,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: `${rpx(16)} ${rpx(32)}`,
        border: "none",
        borderRadius: rpx(28),
        background: "linear-gradient(135deg, #D8C089, #C2A661)",
        boxShadow: "0 8px 22px rgba(184,151,90,0.28)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: rpx(18),
        ...style,
      }}
    >
      <Icon size={26} color="#4A3D22" strokeWidth={1.6} />
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: rpx(28),
            fontWeight: 600,
            color: "#4A3D22",
            letterSpacing: rpx(2),
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: rpx(18),
              color: "rgba(74,61,34,0.7)",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
}
