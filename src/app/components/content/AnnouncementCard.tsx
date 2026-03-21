/**
 * AnnouncementCard - 官方公告卡片
 *
 * 结构：SectionTitle（标题行）+ 柔和渐变公告内容
 *
 * Props:
 * - sectionTitle: 区块标题
 * - title: 公告标题
 * - description: 公告描述
 * - onClick: 点击回调
 */

import { SectionTitle } from "../shared/SectionTitle";

interface AnnouncementCardProps {
  /** 区块标题 */
  sectionTitle?: string;
  /** 公告标题 */
  title: string;
  /** 公告描述 */
  description: string;
  /** 点击回调 */
  onClick?: () => void;
}

export function AnnouncementCard({
  sectionTitle = "官方公告",
  title,
  description,
  onClick,
}: AnnouncementCardProps) {
  return (
    <section>
      <SectionTitle
        title={sectionTitle}
        showArrow={false}
      />

      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          borderRadius: "var(--radius-lg)",
          padding: "var(--spacing-lg)",
          marginTop: "var(--spacing-sm)",
          background:
            "linear-gradient(150deg, rgba(139,170,125,0.1) 0%, rgba(196,154,108,0.08) 35%, rgba(180,160,200,0.07) 70%, rgba(212,176,138,0.06) 100%)",
          boxShadow: "0 2px 12px rgba(139, 170, 125, 0.06)",
        }}
        onClick={onClick}
      >
        {/* 装饰光点 */}
        <div
          className="absolute"
          style={{
            bottom: "calc(var(--rpx) * -30)",
            left: "calc(var(--rpx) * -30)",
            width: "calc(var(--rpx) * 120)",
            height: "calc(var(--rpx) * 120)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,170,125,0.1) 0%, transparent 70%)",
          }}
        />
        <h3
          style={{
            fontSize: "var(--font-size-base)",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            marginBottom: "var(--spacing-xs)",
          }}
        >
          {title}
        </h3>
        <p
          className="font-light leading-relaxed"
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-secondary)",
          }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
