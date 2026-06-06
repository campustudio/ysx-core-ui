/**
 * PracticeSectionTitle - 践行区块小标题（图标 + 标签）
 */

import type { LucideIcon } from "lucide-react";
import { FONT_SERIF, ICON_ENGRAVED, TEXT_ENGRAVED_SOFT, rpx } from "../../../config/styles";

const GOLD = "#B8975A";

interface PracticeSectionTitleProps {
  icon: LucideIcon;
  label: string;
}

export function PracticeSectionTitle({
  icon: Icon,
  label,
}: PracticeSectionTitleProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: rpx(10),
        marginBottom: rpx(20),
      }}
    >
      <Icon
        size={16}
        color={GOLD}
        strokeWidth={1.8}
        style={{ filter: ICON_ENGRAVED }}
      />
      <span
        style={{
          fontSize: rpx(24),
          color: GOLD,
          letterSpacing: rpx(2),
          fontFamily: FONT_SERIF,
          textShadow: TEXT_ENGRAVED_SOFT,
        }}
      >
        {label}
      </span>
    </div>
  );
}
