/**
 * DailyWisdomCard - 每日智慧语录卡片
 *
 * "今日之光"语录展示
 * 温暖渐变背景 + 装饰光点 + 宋体排版
 *
 * Props:
 * - tag: 标签文字
 * - text: 语录内容
 * - source: 来源
 * - onClick: 点击回调
 */

import { FONT_SERIF } from "../../config/styles";

interface DailyWisdomCardProps {
  /** 标签文字 */
  tag: string;
  /** 语录内容 */
  text: string;
  /** 来源 */
  source: string;
  /** 点击回调 */
  onClick?: () => void;
}

export function DailyWisdomCard({
  tag,
  text,
  source,
  onClick,
}: DailyWisdomCardProps) {
  return (
    <div
      className="cursor-pointer"
      style={{ marginBottom: "var(--spacing-xl)" }}
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: "var(--radius-xl)",
          padding: "var(--spacing-xl) var(--spacing-lg)",
          background:
            "linear-gradient(135deg, rgba(196,154,108,0.25) 0%, rgba(139,170,125,0.12) 50%, rgba(212,176,138,0.1) 100%)",
          boxShadow: "0 2px 16px rgba(196, 154, 108, 0.08)",
        }}
      >
        {/* 装饰光点 */}
        <div
          className="absolute"
          style={{
            top: "calc(var(--rpx) * -40)",
            right: "calc(var(--rpx) * -40)",
            width: "calc(var(--rpx) * 160)",
            height: "calc(var(--rpx) * 160)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,154,108,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            fontSize: "var(--font-size-xs)",
            color: "var(--color-primary)",
            fontFamily: FONT_SERIF,
            fontWeight: 400,
            marginBottom: "var(--spacing-sm)",
            letterSpacing: "calc(var(--rpx) * 4)",
          }}
        >
          {tag}
        </div>
        <p
          style={{
            fontSize: "var(--font-size-lg)",
            fontFamily: FONT_SERIF,
            fontWeight: 400,
            color: "var(--color-text-primary)",
            lineHeight: 1.8,
            marginBottom: "var(--spacing-sm)",
          }}
        >
          {text}
        </p>
        <p
          style={{
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-tertiary)",
            fontFamily: FONT_SERIF,
            fontWeight: 300,
          }}
        >
          —— {source}
        </p>
      </div>
    </div>
  );
}