/**
 * PrimaryButton - 简约线框按钮（响应式）
 *
 * 用于"进入完整书架"等主操作入口。
 * 图标 + 标题 + 副标题，宽高自适应内容。
 * 线框风格，适配干净背景。
 * 交互：轻微呼吸光效 + 按下内锁反馈
 */

import React, { useState } from "react";
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
  const [isPressed, setIsPressed] = useState(false);

  return (
    <>
      <style>{`
        @keyframes breath {
          0%, 100% { box-shadow: 0 0 20px rgba(233,216,166,0.1); }
          50% { box-shadow: 0 0 28px rgba(233,216,166,0.18); }
        }
      `}</style>
      <button
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        style={{
          width: "100%",
          padding: `${rpx(16)} ${rpx(32)}`,
          border: "1px solid rgba(233,216,166,0.4)",
          borderRadius: rpx(28),
          background: isPressed ? "rgba(233,216,166,0.15)" : "transparent",
          boxShadow: isPressed
            ? "inset 0 2px 8px rgba(233,216,166,0.2)"
            : "0 0 20px rgba(233,216,166,0.1)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: rpx(18),
          transition: "all 0.15s ease",
          animation: isPressed ? "none" : "breath 3s ease-in-out infinite",
          ...style,
        }}
      >
        <Icon
          size={26}
          color="#4A3D22"
          strokeWidth={1.6}
          style={{
            filter:
              "drop-shadow(0px 1.5px 1.5px rgba(255,255,255,1)) drop-shadow(0px -1.5px 1.5px rgba(0,0,0,0.15))",
          }}
        />
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
              textShadow:
                "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)",
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
                textShadow:
                  "0px 1.5px 1.5px rgba(255,255,255,0.9), 0px -1px 1.5px rgba(0,0,0,0.12)",
              }}
            >
              {subtitle}
            </span>
          )}
        </span>
      </button>
    </>
  );
}
