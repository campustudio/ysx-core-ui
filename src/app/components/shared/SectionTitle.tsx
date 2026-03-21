/**
 * SectionTitle - 琥珀竖线区块标题
 *
 * 品牌辨识度组件：琥珀金竖线 + 标题 + 副标题 + 可选右箭头
 * 复用场景：SectionBlock、AnnouncementCard 等所有内容区块的标题行
 *
 * 点击行为：整行可点击（非仅箭头），触发 onMore 回调
 *
 * Props:
 * - title: 主标题
 * - subtitle: 副标题（可选）
 * - showArrow: 是否显示右侧箭头（默认 true）
 * - onMore: 点击整行回调（标题行整体可点击，非仅箭头）
 */

import { ChevronRight } from "lucide-react";
import { FONT_SERIF } from "../../config/styles";

interface SectionTitleProps {
  /** 主标题 */
  title: string;
  /** 副标题（可选） */
  subtitle?: string;
  /** 是否显示右侧箭头，默认 true */
  showArrow?: boolean;
  /** 点击整行回调（标题 + 箭头整体可点击） */
  onMore?: () => void;
}

export function SectionTitle({
  title,
  subtitle,
  showArrow = true,
  onMore,
}: SectionTitleProps) {
  /** 标题行是否可交互（有 onMore 回调且显示箭头时） */
  const isClickable = showArrow && !!onMore;

  return (
    <div>
      {/* 标题行 — 整行可点击 */}
      <div
        className={`flex items-center justify-between${isClickable ? " cursor-pointer" : ""}`}
        style={{ marginBottom: "2px" }}
        onClick={isClickable ? onMore : undefined}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={isClickable ? (e) => { if (e.key === "Enter" || e.key === " ") onMore?.(); } : undefined}
      >
        <h2
          className="flex items-center"
          style={{
            fontSize: "var(--font-size-xl)",
            fontFamily: FONT_SERIF,
            fontWeight: 400,
            color: "var(--color-text-primary)",
            gap: "calc(var(--rpx) * 12)",
          }}
        >
          {/* 琥珀竖线 */}
          <span
            style={{
              width: "calc(var(--rpx) * 5)",
              height: "calc(var(--rpx) * 28)",
              borderRadius: "calc(var(--rpx) * 3)",
              background: "var(--color-primary)",
              flexShrink: 0,
            }}
          />
          {title}
        </h2>
        {showArrow && (
          <span
            className="hover:opacity-70 transition-colors flex-shrink-0"
            style={{ color: "var(--color-primary)" }}
          >
            <ChevronRight
              style={{
                width: "calc(var(--rpx) * 40)",
                height: "calc(var(--rpx) * 40)",
              }}
            />
          </span>
        )}
      </div>

      {/* 副标题 */}
      {subtitle && (
        <p
          className="font-light"
          style={{
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-tertiary)",
            marginBottom: "var(--spacing-xs)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}