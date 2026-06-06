/**
 * @deprecated 请使用 PracticeSectionTitle + PracticeContentBox（标题在卡片外，玻璃克制使用）
 *
 * ReflectBlock - 思考一问 / 自照一问（液态玻璃 + 阴刻）
 */

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  FONT_SERIF,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  ICON_ENGRAVED,
  HANDBOOK_CARD_BORDER,
  rpx,
} from "../../../config/styles";

const GOLD = "#B8975A";
const INK = "#1F1F1F";

interface ReflectBlockProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

export function ReflectBlock({ icon: Icon, label, children }: ReflectBlockProps) {
  return (
    <div
      style={{
        ...LIQUID_GLASS,
        border: HANDBOOK_CARD_BORDER,
        borderRadius: rpx(32),
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.42), rgba(233,216,166,0.1))",
        padding: `${rpx(36)} ${rpx(36)}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: rpx(10) }}>
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
      <div
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(30),
          color: INK,
          lineHeight: 1.75,
          marginTop: rpx(20),
          textShadow: TEXT_ENGRAVED,
        }}
      >
        {children}
      </div>
    </div>
  );
}
