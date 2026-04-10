/**
 * DetailPageShell - 详情页通用外壳 (极致极简无图版)
 *
 * 抽离文章/播客/活动详情页的通用结构：
 *   ① 极简返回按钮 + 纯文字栏目标签
 *   ② 内容区（children）
 *   - 完全去图片化，去除背景渐变，只保留纯净的阅读空间
 */

import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { rpx, PAGE_PX } from "../../config/styles";
import { FONT_SERIF } from "../../config/styles";

const CATEGORY_COLORS = {
  amber: { bg: "transparent", text: "#111" },
  sage: { bg: "transparent", text: "#111" },
} as const;

interface Props {
  coverImage?: string; // 留着兼容老代码，但不使用
  coverAlt?: string;
  category: string;
  categoryColor: "amber" | "sage";
  bgColor?: string;
  bgColorEnd?: string;
  coverHeight?: number;
  onBack?: () => void;
  children: ReactNode;
}

export function DetailPageShell({
  category,
  categoryColor,
  bgColor = "#F2F2F5", // 统一底色为冷灰白
  bgColorEnd = "#F2F2F5",
  onBack,
  children,
}: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const colorConfig = CATEGORY_COLORS[categoryColor];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: bgColor,
        paddingBottom: rpx(160),
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 极简纯白文字头部 */}
      <div
        style={{
          padding: `calc(env(safe-area-inset-top) + ${rpx(40)}) ${PAGE_PX} ${rpx(60)}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: rpx(64),
            height: rpx(64),
            cursor: "pointer",
            padding: 0,
            margin: `0 0 0 -${rpx(16)}`, // 抵消内边距，使其视觉左对齐
          }}
        >
          <ArrowLeft size={24} color="#111" strokeWidth={1.5} />
        </button>

        <span
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(24),
            fontWeight: 500,
            color: "#111",
            letterSpacing: rpx(4),
          }}
        >
          {category}
        </span>
      </div>

      {/* 内容容器 */}
      <div
        style={{
          flex: 1,
          background: "transparent",
          padding: `${rpx(60)} ${PAGE_PX}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}