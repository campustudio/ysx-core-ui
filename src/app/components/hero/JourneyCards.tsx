/**
 * JourneyCards - 三个功能入口卡片 + 探索按钮
 *
 * 现代阅读方向（左→右）排列，哲学递进顺序：
 *   徐 → 止 → 定
 *
 * 古风语言（源自《大学》）：
 *   徐 = 慢下来 —— "清风徐来"（门槛最低的第一步）
 *   止 = 停下来 —— "知止而后有定"（慢下来后才能停住）
 *   定 = 静下来 —— "定而后能静"（停住后归于安定）
 *
 * 设计决策：功能性入口遵循现代左→右阅读习惯，
 * 传统阅读方向仅保留在装饰/氛围元素（节气竖排等）
 *
 * 图标：柔和云朵(徐) · Leaf(止) · Moon(定) — 圆润无尖锐
 */

import { Leaf, Moon } from "lucide-react";
import { SoftCloudIcon } from "../../config/icons";
import type { IconProps } from "../../config/icons";
import { GLASS_GRADIENTS } from "../../config/styles";
import { GlassCard } from "../shared/GlassCard";
import { GuideButton } from "../shared/GuideButton";

// ─── 卡片配置 ────────────────────────────────────────

interface JourneyCardData {
  icon: React.ComponentType<IconProps>;
  label: string;
  gradient: string;
}

/** 左→右排列：徐→止→定（由动入静的渐进路径） */
const JOURNEY_CARDS: JourneyCardData[] = [
  { icon: SoftCloudIcon, label: "徐", gradient: GLASS_GRADIENTS.amber },
  { icon: Leaf, label: "止", gradient: GLASS_GRADIENTS.sage },
  { icon: Moon, label: "定", gradient: GLASS_GRADIENTS.lavender },
];

// ─── 组件 ────────────────────────────────────────────

interface JourneyCardsProps {
  onCardClick?: (label: string) => void;
  onGuideClick?: () => void;
}

export function JourneyCards({ onCardClick, onGuideClick }: JourneyCardsProps) {
  return (
    <div style={{ marginBottom: "var(--spacing-md)" }}>
      {/* 「探索」按钮 */}
      <GuideButton onClick={onGuideClick} />

      {/* 三卡片 — 左→右：徐→止→定 */}
      <div
        className="flex"
        style={{
          gap: "var(--spacing-sm)",
          padding: `0 ${48 * (100 / 750)}vw`,
        }}
      >
        {JOURNEY_CARDS.map((card) => (
          <GlassCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            gradient={card.gradient}
            onClick={() => onCardClick?.(card.label)}
          />
        ))}
      </div>
    </div>
  );
}