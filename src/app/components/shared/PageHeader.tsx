/**
 * PageHeader - 统一页面顶部导航组件
 *
 * 固定在页面顶部，包含返回按钮和可选的标题、右侧操作区
 * 所有详情页面统一使用此组件
 */

import React from "react";
import { ArrowLeft } from "lucide-react";
import { rpx } from "../../config/styles";

// Header高度常量，供页面添加顶部间距（padding-top 16 + 按钮约36 + padding-bottom 16 = 68，留余量用80）
export const PAGE_HEADER_HEIGHT = `calc(env(safe-area-inset-top) + ${rpx(80)})`;

interface PageHeaderProps {
  onBack?: () => void;
  title?: string;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  dark?: boolean; // 深色主题模式
}

export function PageHeader({
  onBack,
  title,
  rightContent,
  transparent = false,
  dark = false,
}: PageHeaderProps) {
  const textColor = dark ? "rgba(255,255,255,0.9)" : "#666";
  const bgColor = dark
    ? transparent
      ? "transparent"
      : "rgba(11,17,32,0.95)"
    : transparent
      ? "transparent"
      : "rgba(250,250,250,0.95)";

  return (
    <div
      style={{
        padding: `calc(env(safe-area-inset-top) + ${rpx(16)}) ${rpx(24)} ${rpx(16)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: bgColor,
        backdropFilter: transparent ? "none" : "blur(10px)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* 左侧返回按钮 */}
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          padding: rpx(8),
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: rpx(6),
          color: textColor,
          minWidth: rpx(60),
        }}
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
        {!title && <span style={{ fontSize: rpx(20) }}>返回</span>}
      </button>

      {/* 中间标题 */}
      {title && (
        <span
          style={{
            fontSize: rpx(24),
            color: textColor,
            fontWeight: 500,
            flex: 1,
            textAlign: "center",
          }}
        >
          {title}
        </span>
      )}

      {/* 右侧操作区 */}
      <div
        style={{
          minWidth: rpx(60),
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {rightContent}
      </div>
    </div>
  );
}
