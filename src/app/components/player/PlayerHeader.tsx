/**
 * PlayerHeader - 播放页顶部栏
 *
 * 透明背景，左侧返回箭头（仅图标，无文字），右侧副标题
 * 箭头左边缘与页面内容统一 padding 对齐
 * ChevronLeft SVG 内有视觉白边，用负 margin 补偿
 *
 * Props:
 * - subtitle: 右侧副标题文字（如 "徐 · 放松引导"）
 * - onBack: 返回按钮回调
 */

import { ChevronLeft } from "lucide-react";
import { FONT_SERIF, TEXT_SHADOW_HERO } from "../../config/styles";

/** 页面统一水平内边距（与 AudioControl 进度条对齐） */
export const PAGE_PADDING_H = `${48 * (100 / 750)}vw`;

interface PlayerHeaderProps {
  /** 副标题（显示在右侧） */
  subtitle?: string;
  /** 返回按钮回调 */
  onBack?: () => void;
}

export function PlayerHeader({ subtitle, onBack }: PlayerHeaderProps) {
  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: `0 ${PAGE_PADDING_H}`,
        paddingTop: "max(calc(var(--rpx) * 24), env(safe-area-inset-top))",
        paddingBottom: `${20 * (100 / 750)}vw`,
      }}
    >
      <div className="flex justify-between items-center">
        {/* 返回箭头 — 仅图标，负 margin 补偿使视觉距左 ≈ 距顶 */}
        <div
          className="cursor-pointer"
          onClick={onBack}
          style={{
            marginLeft: "calc(var(--rpx) * -30)",
            padding: "calc(var(--rpx) * 8)",
          }}
        >
          <ChevronLeft
            className="text-white"
            style={{
              width: "calc(var(--rpx) * 44)",
              height: "calc(var(--rpx) * 44)",
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
            }}
            strokeWidth={1.8}
          />
        </div>

        {/* 副标题 */}
        {subtitle && (
          <span
            className="text-white/65"
            style={{
              fontSize: "var(--font-size-xs)",
              fontFamily: FONT_SERIF,
              textShadow: TEXT_SHADOW_HERO,
              letterSpacing: "calc(var(--rpx) * 2)",
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </header>
  );
}