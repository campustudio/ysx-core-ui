/**
 * HandbookHeader - 人类手册馆专用顶部导航
 *
 * 固定吸顶（不随内容滚动），左返回 + 居中两行标题/副标题 + 右侧操作位。
 * 用于书架 / 找到我的阅读入口 / 阅读建议结果等页面，外观与参考图一致：
 * 看起来融入页面而非一条厚重 header 条（默认透明背景）。
 */

import React from "react";
import { ArrowLeft } from "lucide-react";
import { FONT_SERIF, rpx, ICON_ENGRAVED } from "../../config/styles";

/** Header 高度（含安全区），供页面占位 */
export const HANDBOOK_HEADER_HEIGHT = `calc(env(safe-area-inset-top) + ${rpx(132)})`;

/** 操作区深色图标推荐色（配合磨砂胶囊，任何背景下都清晰可见） */
export const HANDBOOK_HEADER_ICON = "#5A4B33";

interface HandbookHeaderProps {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  /** 深色文字（深色 Hero 背景设 true） */
  light?: boolean;
  /** 是否带吸顶背景色（用于需要滚动的页面） */
  withBackground?: boolean;
}

/**
 * 磨砂胶囊：半透明浅色 + 模糊，深色图标。
 * 无论页面背景明暗，返回/操作按钮都能保持可见。
 */
const CHIP_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: rpx(64),
  borderRadius: rpx(40),
  background: "rgba(250,247,240,0.55)",
  backdropFilter: "blur(12px) saturate(1.1)",
  WebkitBackdropFilter: "blur(12px) saturate(1.1)",
  border: "1px solid rgba(255,255,255,0.5)",
  boxShadow: "0 2px 10px rgba(60,50,30,0.12)",
};

export function HandbookHeader({
  onBack,
  title,
  subtitle,
  rightContent,
  light = false,
  withBackground = false,
}: HandbookHeaderProps) {
  const titleColor = light ? "rgba(255,255,255,0.96)" : "#5A4B33";
  const subColor = light ? "rgba(255,255,255,0.75)" : "#9A968C";
  const titleShadow = light
    ? "0 1px 6px rgba(0,0,0,0.35)"
    : "0 1px 2px rgba(255,255,255,0.7)";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: `calc(env(safe-area-inset-top) + ${rpx(20)}) ${rpx(32)} ${rpx(20)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: rpx(16),
        ...(withBackground
          ? {
              background: "rgba(243,238,227,0.85)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }
          : {}),
      }}
    >
      {/* 左：返回 */}
      <div style={{ width: rpx(64), flexShrink: 0 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={
              withBackground
                ? {
                    width: rpx(64),
                    height: rpx(64),
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
                : {
                    ...CHIP_STYLE,
                    width: rpx(64),
                    padding: 0,
                    cursor: "pointer",
                  }
            }
          >
            <ArrowLeft
              size={withBackground ? 24 : 20}
              color={HANDBOOK_HEADER_ICON}
              strokeWidth={withBackground ? 2 : 1.8}
              style={withBackground ? { filter: ICON_ENGRAVED } : undefined}
            />
          </button>
        )}
      </div>

      {/* 中：两行标题 */}
      <div style={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
        {title && (
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(30),
              fontWeight: 600,
              color: titleColor,
              letterSpacing: rpx(3),
              lineHeight: 1.2,
              textShadow: titleShadow,
            }}
          >
            {title}
          </div>
        )}
        {subtitle && (
          <div
            style={{
              fontSize: rpx(20),
              color: subColor,
              letterSpacing: rpx(2),
              marginTop: rpx(6),
              textShadow: titleShadow,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* 右：操作位 */}
      <div
        style={{
          minWidth: rpx(64),
          flexShrink: 0,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {rightContent &&
          (withBackground ? (
            React.cloneElement(rightContent as React.ReactElement, {
              style: {
                ...(rightContent as React.ReactElement).props.style,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              },
              children: React.Children.map(
                (rightContent as React.ReactElement).props.children,
                (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                      style: {
                        filter: ICON_ENGRAVED,
                      },
                    });
                  }
                  return child;
                },
              ),
            })
          ) : (
            <div style={{ ...CHIP_STYLE, padding: `0 ${rpx(10)}` }}>
              {rightContent}
            </div>
          ))}
      </div>
    </div>
  );
}
