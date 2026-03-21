/**
 * DetailPageShell - 详情页通用外壳
 *
 * 抽离文章/播客/活动详情页的通用结构：
 *   ① 封面图 + 返回按钮 + 栏目标签
 *   ② 内容区（children）
 *
 * 复用场景：ArticleReader、PodcastDetail、ActivityDetail
 *
 * Props:
 *   - coverImage: 封面图 URL
 *   - category: 栏目名称
 *   - categoryColor: amber | sage
 *   - bgColor: 背景色起始值
 *   - bgColorEnd: 背景色结束值
 *   - onBack: 返回回调
 *   - children: 内容区
 */

import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { rpx, PAGE_PX } from "../../config/styles";

const CATEGORY_COLORS = {
  amber: { bg: "rgba(196,154,108,0.12)", text: "#A07D55" },
  sage: { bg: "rgba(139,170,125,0.12)", text: "#5E8A52" },
} as const;

interface Props {
  coverImage: string;
  coverAlt?: string;
  category: string;
  categoryColor: "amber" | "sage";
  /** 背景起始色 */
  bgColor?: string;
  /** 背景结束色 */
  bgColorEnd?: string;
  /** 封面高度（rpx），默认 500 */
  coverHeight?: number;
  onBack?: () => void;
  children: ReactNode;
}

export function DetailPageShell({
  coverImage,
  coverAlt = "",
  category,
  categoryColor,
  bgColor = "#F0E4CE",
  bgColorEnd = "#F5E8D2",
  coverHeight = 500,
  onBack,
  children,
}: Props) {
  /** 进入页面时滚动到顶部 */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const catStyle = CATEGORY_COLORS[categoryColor];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: `linear-gradient(to bottom, ${bgColor} 0%, ${bgColorEnd} 100%)`,
        overflowY: "auto",
      }}
    >
      {/* ═══ 封面图区域 ═══ */}
      <div
        className="relative"
        style={{
          width: "100%",
          height: rpx(coverHeight),
          overflow: "hidden",
        }}
      >
        <ImageWithFallback
          src={coverImage}
          alt={coverAlt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* 底部渐变遮罩 */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(30,20,10,0.08) 0%, 
              rgba(30,20,10,0.02) 40%, 
              transparent 50%,
              ${bgColor}AA 75%, 
              ${bgColor} 100%)`,
          }}
        />

        {/* 返回按钮 */}
        <div
          className="absolute cursor-pointer"
          onClick={onBack}
          style={{
            top: `calc(max(${rpx(24)}, env(safe-area-inset-top)) + ${rpx(4)})`,
            left: rpx(24),
            width: rpx(64),
            height: rpx(64),
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          <ArrowLeft
            style={{
              width: rpx(32),
              height: rpx(32),
              color: "var(--color-text-primary)",
            }}
            strokeWidth={1.8}
          />
        </div>

        {/* 栏目标签 */}
        <div
          className="absolute"
          style={{
            bottom: rpx(72),
            left: PAGE_PX,
            padding: `${rpx(8)} ${rpx(20)}`,
            borderRadius: rpx(20),
            background: catStyle.bg,
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontSize: rpx(22),
              fontWeight: 500,
              color: catStyle.text,
              letterSpacing: rpx(1),
              lineHeight: 1,
            }}
          >
            {category}
          </span>
        </div>
      </div>

      {/* ═══ 内容区 ═══ */}
      <div
        className="app-container"
        style={{
          padding: `0 ${PAGE_PX}`,
          marginTop: rpx(-20),
          position: "relative",
          zIndex: 2,
        }}
      >
        {children}

        {/* 底部留白 */}
        <div style={{ height: rpx(120) }} />
      </div>
    </div>
  );
}