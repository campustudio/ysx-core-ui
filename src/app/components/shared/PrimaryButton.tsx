/**
 * PrimaryButton - 简约按钮（响应式）
 *
 * 用于"进入完整书架"等主操作入口。
 * 图标 + 标题 + 副标题，宽高自适应内容。
 * 支持两种变体：outline（线框版）/ filled（背景版）。
 * 交互：轻微呼吸光效 + 按下内锁反馈
 */

import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { rpx } from "../../config/styles";

interface PrimaryButtonProps {
  /** Lucide 图标组件（可选） */
  icon?: LucideIcon;
  /** 主标题 */
  title: string;
  /** 副标题（可选） */
  subtitle?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义样式（可选） */
  style?: React.CSSProperties;
  /** 变体：outline（线框版）/ filled（背景版） */
  variant?: "outline" | "filled";
  /** 禁用态（置灰·不可点击） */
  disabled?: boolean;
}

export function PrimaryButton({
  icon: Icon,
  title,
  subtitle,
  onClick,
  style,
  variant = "outline",
  disabled = false,
}: PrimaryButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isFilled = variant === "filled";

  return (
    <>
      <style>{`
        @keyframes breath {
          0%, 100% { box-shadow: 0 0 20px rgba(233,216,166,0.1); }
          50% { box-shadow: 0 0 28px rgba(233,216,166,0.18); }
        }
        @keyframes breath-filled {
          0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 0 25px rgba(233,216,166,0.15); }
          50% { box-shadow: 0 4px 12px rgba(0,0,0,0.12), 0 0 35px rgba(233,216,166,0.25); }
        }
      `}</style>
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        onMouseDown={() => !disabled && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        style={{
          width: "100%",
          padding: `${rpx(16)} ${rpx(32)}`,
          border: isFilled ? "none" : "1.5px solid rgba(233,216,166,0.6)",
          borderRadius: rpx(28),
          background: disabled
            ? "rgba(0,0,0,0.05)"
            : isFilled
              ? isPressed
                ? "#D4B896"
                : "#E9D8A6"
              : isPressed
                ? "rgba(233,216,166,0.15)"
                : "transparent",
          boxShadow: disabled
            ? "none"
            : isPressed
              ? isFilled
                ? "inset 0 2px 6px rgba(0,0,0,0.15)"
                : "inset 0 2px 8px rgba(233,216,166,0.2)"
              : isFilled
                ? "0 4px 12px rgba(0,0,0,0.08)"
                : "0 0 20px rgba(233,216,166,0.1)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: Icon ? rpx(18) : 0,
          transition: "all 0.15s ease",
          animation:
            disabled || isPressed
              ? "none"
              : isFilled
                ? "breath-filled 3s ease-in-out infinite"
                : "breath 3s ease-in-out infinite",
          ...style,
        }}
      >
        {Icon && (
          <Icon
            size={26}
            color={isFilled ? "#2C2416" : "#4A3D22"}
            strokeWidth={1.6}
            style={{
              filter: isFilled
                ? "none"
                : "drop-shadow(0px 1.5px 1.5px rgba(255,255,255,1)) drop-shadow(0px -1.5px 1.5px rgba(0,0,0,0.15))",
            }}
          />
        )}
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flex: Icon ? undefined : 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: rpx(24),
              fontWeight: 600,
              color: disabled ? "#B0AC9F" : isFilled ? "#2C2416" : "#4A3D22",
              letterSpacing: rpx(2),
              lineHeight: 1.35,
              textShadow: disabled
                ? "none"
                : "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)",
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              style={{
                marginTop: rpx(4),
                fontSize: rpx(18),
                color: isFilled ? "rgba(44,36,22,0.75)" : "rgba(74,61,34,0.75)",
                lineHeight: 1.35,
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
