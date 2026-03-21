/**
 * ContentCard - 通用内容卡片
 *
 * 用于显示课程、音频、放松内容等
 * 包含图片、标题、副标题
 *
 * Props:
 * - image: 图片地址
 * - title: 标题
 * - subtitle: 副标题（可选）
 * - aspectRatio: 图片比例（square / wide）
 * - onClick: 点击回调
 */

import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ContentCardProps {
  /** 卡片图片 */
  image: string;
  /** 标题 */
  title: string;
  /** 副标题/描述 */
  subtitle?: string;
  /** 宽高比 */
  aspectRatio?: "square" | "wide";
  /** 点击回调 */
  onClick?: () => void;
}

export function ContentCard({
  image,
  title,
  subtitle,
  aspectRatio = "square",
  onClick,
}: ContentCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* 图片容器 */}
      <div
        className={`relative overflow-hidden transition-shadow duration-200 ${
          aspectRatio === "square" ? "aspect-square" : "aspect-[16/9]"
        }`}
        style={{
          borderRadius: "var(--radius-lg)",
          marginBottom: "var(--spacing-xs)",
          boxShadow: "var(--shadow-sm)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "var(--shadow-md)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "var(--shadow-sm)")
        }
      >
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 文字内容 */}
      <div>
        <h3
          className="line-clamp-2"
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: 400,
            color: "var(--color-text-primary)",
            marginBottom: "2px",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className="line-clamp-1"
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-tertiary)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}