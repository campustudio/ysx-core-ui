/**
 * NotFoundFallback - 内容不存在时的降级 UI
 *
 * 全屏居中显示提示文案 + 返回链接
 * 古纸色背景 + 宋体字 — 统一三类详情页的 404 体验
 *
 * 复用场景：ArticleReader、PodcastDetail、ActivityDetail
 *
 * Props:
 *   - message: 提示文案（如"文章正在路上"）
 *   - onBack: 返回回调
 */

import { useCallback } from "react";
import { FONT_SERIF, BG_PARCHMENT, rpx } from "../../config/styles";

interface Props {
  /** 提示文案 */
  message?: string;
  /** 返回回调 */
  onBack?: () => void;
}

export function NotFoundFallback({
  message = "内容正在路上",
  onBack,
}: Props) {
  const handleBack = useCallback(() => onBack?.(), [onBack]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        width: "100%",
        height: "100vh",
        background: BG_PARCHMENT,
      }}
    >
      <p
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(30),
          fontWeight: 400,
          color: "var(--color-text-secondary)",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {message}
      </p>
      <div
        className="cursor-pointer"
        onClick={handleBack}
        style={{
          marginTop: rpx(32),
          fontFamily: FONT_SERIF,
          fontSize: rpx(26),
          fontWeight: 400,
          color: "var(--color-primary)",
          lineHeight: 1,
        }}
      >
        返回
      </div>
    </div>
  );
}
