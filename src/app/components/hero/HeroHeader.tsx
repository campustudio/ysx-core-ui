/**
 * HeroHeader - Hero 区顶部栏（支持吸顶）
 *
 * 组合：SolarTermDisplay + Avatar
 *
 * Hero 模式（古卷）：
 *   左侧头像 —— 右侧竖排节气信息
 *   三列顶部严格对齐
 *   左侧内边距与顶部距离对齐（约 24rpx）
 *
 * 吸顶模式（当代）：
 *   左侧横排节气信息 —— 右侧头像
 *
 * Props:
 * - solarTerm/shichen: 时间数据
 * - isSticky: 是否吸顶
 * - stickyBg: 吸顶背景色（可定制）
 * - avatarUrl: 头像地址
 * - onAvatarClick: 头像点击回调
 */

import type { SolarTerm, Shichen } from "../../config/calendar";
import { HERO_COLORS, STICKY_COLORS, BG_PARCHMENT } from "../../config/styles";
import { Avatar } from "../shared/Avatar";
import { SolarTermDisplay } from "./SolarTermDisplay";

interface HeroHeaderProps {
  solarTerm: SolarTerm;
  shichen: Shichen;
  /** 是否吸顶 */
  isSticky?: boolean;
  /** 吸顶背景色（默认绢轴色） */
  stickyBg?: string;
  /** 头像地址 */
  avatarUrl?: string;
  /** 头像点击回调 */
  onAvatarClick?: () => void;
}

export function HeroHeader({
  solarTerm,
  shichen,
  isSticky = false,
  stickyBg = BG_PARCHMENT,
  avatarUrl,
  onAvatarClick,
}: HeroHeaderProps) {
  const colors = isSticky ? STICKY_COLORS : HERO_COLORS;
  const avatarVariant = isSticky ? "dark" : "light";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: "var(--z-header)" as string,
        /* Hero 模式：左侧内边距缩小，使头像更靠左与顶部距离对齐 */
        paddingLeft: isSticky
          ? `${48 * (100 / 750)}vw`
          : `${28 * (100 / 750)}vw`,
        paddingRight: `${48 * (100 / 750)}vw`,
        paddingTop: "max(calc(var(--rpx) * 24), env(safe-area-inset-top))",
        paddingBottom: `${20 * (100 / 750)}vw`,
        background: isSticky ? stickyBg : "transparent",
        transition: "background 0.35s ease, padding-left 0.35s ease",
        borderWidth: 0,
        borderStyle: "none",
        boxShadow: "none",
      }}
    >
      {isSticky ? (
        /* ═══ 吸顶模式：现代横排 ═══ */
        <div className="flex justify-between items-center">
          <SolarTermDisplay
            solarTerm={solarTerm}
            shichen={shichen}
            layout="horizontal"
            colors={colors}
          />
          <Avatar
            src={avatarUrl}
            variant={avatarVariant}
            onClick={onAvatarClick}
          />
        </div>
      ) : (
        /* ═══ Hero 模式：古卷竖排 ═══ */
        <div className="flex justify-between items-start">
          <Avatar
            src={avatarUrl}
            variant={avatarVariant}
            onClick={onAvatarClick}
          />
          <SolarTermDisplay
            solarTerm={solarTerm}
            shichen={shichen}
            layout="vertical"
            colors={colors}
          />
        </div>
      )}

      {/* 吸顶底部渐变融合带 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "100%",
          height: "calc(var(--rpx) * 24)",
          background: isSticky
            ? `linear-gradient(to bottom, ${stickyBg}, rgba(240, 228, 206, 0))`
            : "transparent",
          transition: "background 0.35s ease",
          pointerEvents: "none",
        }}
      />
    </header>
  );
}