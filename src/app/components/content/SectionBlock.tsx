/**
 * SectionBlock - 内容区块组件
 *
 * 结构：SectionTitle（标题行） + 横向滚动卡片列表
 *
 * 卡片布局逻辑：
 * - 2列/3列模式下，卡片按指定列数展示
 * - 当卡片数量超过列数时，自动开启横向滚动（无滚动条）
 * - 卡片宽度固定，由列数决定
 *
 * Props:
 * - title/subtitle: 区块标题
 * - cards: 卡片数据列表
 * - columns: 可见列数（2 或 3）
 * - aspectRatio: 图片比例（square / wide）
 * - onMore: 标题箭头点击
 * - onCardClick: 卡片点击
 */

import type { CardItem } from "../../config/home-data";
import { SectionTitle } from "../shared/SectionTitle";
import { ContentCard } from "./ContentCard";

interface SectionBlockProps {
  /** 区块标题 */
  title: string;
  /** 副标题/描述 */
  subtitle: string;
  /** 卡片数据 */
  cards: CardItem[];
  /** 可见列数，默认 3 */
  columns?: 2 | 3;
  /** 卡片宽高比，默认 square */
  aspectRatio?: "square" | "wide";
  /** 点击标题箭头 */
  onMore?: () => void;
  /** 点击卡片 */
  onCardClick?: (cardId: string) => void;
}

export function SectionBlock({
  title,
  subtitle,
  cards,
  columns = 3,
  aspectRatio = "square",
  onMore,
  onCardClick,
}: SectionBlockProps) {
  // 是否需要横向滚动（卡片数量 > 可见列数）
  const needsScroll = cards.length > columns;

  return (
    <section style={{ marginBottom: "var(--spacing-xl)" }}>
      <SectionTitle
        title={title}
        subtitle={subtitle}
        onMore={onMore}
      />

      {needsScroll ? (
        /* 横向滚动模式 */
        <div
          className="flex overflow-x-auto"
          style={{
            gap: "var(--spacing-xs)",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                flex: `0 0 calc(${100 / columns}% - var(--spacing-xs) * ${(columns - 1) / columns})`,
                scrollSnapAlign: "start",
              }}
            >
              <ContentCard
                image={card.image}
                title={card.title}
                subtitle={card.subtitle}
                aspectRatio={aspectRatio}
                onClick={() => onCardClick?.(card.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        /* 网格模式 */
        <div
          className={`grid ${columns === 2 ? "grid-cols-2" : "grid-cols-3"}`}
          style={{ gap: "var(--spacing-xs)" }}
        >
          {cards.map((card) => (
            <ContentCard
              key={card.id}
              image={card.image}
              title={card.title}
              subtitle={card.subtitle}
              aspectRatio={aspectRatio}
              onClick={() => onCardClick?.(card.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
