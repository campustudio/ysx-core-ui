/**
 * FeaturedCard - 精选推荐大卡片
 *
 * 全宽图片 + 底部渐变遮罩 + 文字叠层
 * 用于突出展示一个内容/引导
 *
 * Props:
 * - image: 背景图片地址
 * - title: 主标题
 * - subtitle: 副标题
 * - height: 卡片高度（rpx）
 * - onClick: 点击回调
 */

import { FONT_SERIF } from "../../config/styles";

interface FeaturedCardProps {
  /** 背景图片 URL */
  image: string;
  /** 主标题 */
  title: string;
  /** 副标题/描述 */
  subtitle?: string;
  /** 卡片高度（rpx），默认 280 */
  height?: number;
  /** 点击回调 */
  onClick?: () => void;
}

export function FeaturedCard({
  image,
  title,
  subtitle,
  height = 280,
  onClick,
}: FeaturedCardProps) {
  return (
    <div style={{ marginBottom: "var(--spacing-xl)" }}>
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          height: `calc(var(--rpx) * ${height})`,
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
        onClick={onClick}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 flex flex-col justify-end"
          style={{
            background:
              "linear-gradient(to top, rgba(30,25,18,0.5) 0%, rgba(30,25,18,0.1) 40%, transparent 65%)",
            padding: "var(--spacing-lg)",
          }}
        >
          <p
            style={{
              fontSize: "var(--font-size-xl)",
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "calc(var(--rpx) * 2)",
              textShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {title}
          </p>
          {subtitle && (
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.65)",
                marginTop: "calc(var(--rpx) * 8)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
