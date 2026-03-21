/**
 * GlassCard - 毛玻璃卡片
 *
 * Hero 区的功能入口卡片（徐/止/定），也可复用于其他毛玻璃场景
 * 纵向居中布局：宋体单字在上 + 图标在下，上下左右居中
 * 玻璃拟态背景 + hover 微缩放反馈
 *
 * Props:
 * - icon: 图标组件
 * - label: 卡片标签（单字）
 * - gradient: 背景渐变
 * - onClick: 点击回调
 */

import type { IconProps } from "../../config/icons";
import { FONT_SERIF, TEXT_SHADOW_HERO } from "../../config/styles";

interface GlassCardProps {
  /** 图标组件 */
  icon: React.ComponentType<IconProps>;
  /** 卡片标签（单字） */
  label: string;
  /** 背景渐变 CSS */
  gradient: string;
  /** 点击回调 */
  onClick?: () => void;
}

export function GlassCard({
  icon: Icon,
  label,
  gradient,
  onClick,
}: GlassCardProps) {
  return (
    <div
      className="flex-1 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-all duration-300"
      style={{
        height: "calc(var(--rpx) * 160)",
        borderRadius: "var(--radius-lg)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.12)",
        background: gradient,
        gap: "calc(var(--rpx) * 12)",
        WebkitBackdropFilter: "blur(12px)",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
      }}
      onClick={onClick}
    >
      {/* 单字标签 — 上方居中 */}
      <span
        className="text-white/85"
        style={{
          fontSize: "var(--font-size-sm)",
          fontFamily: FONT_SERIF,
          fontWeight: 300,
          letterSpacing: "calc(var(--rpx) * 3)",
          textShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      >
        {label}
      </span>
      {/* 图标 — 下方居中 */}
      <Icon
        className="text-white/80"
        strokeWidth={1.3}
        style={{
          width: "calc(var(--rpx) * 32)",
          height: "calc(var(--rpx) * 32)",
          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))",
          flexShrink: 0,
        }}
      />
    </div>
  );
}