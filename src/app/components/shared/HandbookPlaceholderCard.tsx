/**
 * HandbookPlaceholderCard - 占位卡（持续更新中）
 *
 * 用于书架和首页的"持续更新中"占位提示
 * 统一的液态玻璃 + 刻进去质感样式
 */

import { Plus } from "lucide-react";
import {
  FONT_SERIF,
  LIQUID_GLASS,
  rpx,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  ICON_ENGRAVED,
} from "../../config/styles";

const GOLD = "#B8975A";

interface HandbookPlaceholderCardProps {
  /** 点击回调 */
  onClick?: () => void;
  /** 卡片宽度（首页用 rpx(184)，书架用 auto） */
  width?: string;
  /** 卡片高度（首页用 rpx(248)，书架用 minHeight: rpx(260)） */
  height?: string;
  /** 是否使用固定高度（false 则用 minHeight） */
  fixedHeight?: boolean;
  /** 外层容器样式（用于 scrollSnapAlign 等） */
  containerStyle?: React.CSSProperties;
}

export function HandbookPlaceholderCard({
  onClick,
  width = "auto",
  height = "auto",
  fixedHeight = false,
  containerStyle,
}: HandbookPlaceholderCardProps) {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", ...containerStyle }}>
      <div
        style={{
          ...LIQUID_GLASS,
          width,
          ...(fixedHeight ? { height } : { minHeight: height }),
          borderRadius: rpx(24),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: rpx(12),
          padding: `0 ${rpx(16)}`,
          textAlign: "center",
        }}
      >
        <Plus
          size={24}
          strokeWidth={1.6}
          color={GOLD}
          style={{ filter: ICON_ENGRAVED }}
        />
        <span
          style={{
            fontSize: rpx(22),
            fontFamily: FONT_SERIF,
            color: "#8A8170",
            textShadow: TEXT_ENGRAVED,
          }}
        >
          持续更新中
        </span>
        <span
          style={{
            fontSize: rpx(17),
            color: "#9A9282",
            lineHeight: 1.5,
            textShadow: TEXT_ENGRAVED_SOFT,
          }}
        >
          更多内容敬请期待
        </span>
      </div>
    </div>
  );
}
