/**
 * DailyQuoteCalendar - 每日语录 · 日历翻阅
 *
 * 替代原 DailyWisdomCard，增加日历翻页交互：
 *
 * 布局结构（上→下）：
 *   ┌──────────────────────────────────────┐
 *   │  日期横条（← 2月14日 星期五 →）       │
 *   ├──────────────────────────────────────┤
 *   │  语录卡片区（可左右滑动翻页）          │
 *   │    类别标签                           │
 *   │    「语录正文」                        │
 *   │    —— 来源                            │
 *   ├──────────────────────────────────────┤
 *   │  日期指示点 ● ● ◉ ● ●               │
 *   └──────────────────────────────────────┘
 *
 * 交互：
 *   - 左右箭头 / 滑动手势切换日期
 *   - 点击日期文字弹出迷你日历（v2 预留）
 *   - 点击语录卡片跳转文章阅读页
 *   - 回到今天按钮（不在今天时出现）
 *
 * 动画：滑动方向感知的淡入平移
 */

import {
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import {
  getQuotesRange,
  getWeekdayCN,
  formatDateDisplay,
  formatDateKey,
  type DailyQuote,
} from "../../config/daily-quotes-data";
import { FONT_SERIF, rpx } from "../../config/styles";

// ─── 类别配色 ──────────────────────────────────────────

const CATEGORY_COLORS: Record<DailyQuote["category"], { bg: string; text: string }> = {
  成长: { bg: "rgba(139,170,125,0.15)", text: "#7A9A6E" },
  宁静: { bg: "rgba(139,170,125,0.12)", text: "#8BAA7D" },
  力量: { bg: "rgba(196,154,108,0.15)", text: "#B08A5C" },
  智慧: { bg: "rgba(180,160,200,0.15)", text: "#9A85B0" },
};

// ─── 常量 ──────────────────────────────────────────────

const PAST_DAYS = 7;
const FUTURE_DAYS = 3;
const SWIPE_THRESHOLD = 40; // px

// ─── Props ─────────────────────────────────────────────

interface DailyQuoteCalendarProps {
  /** 点击语录卡片 */
  onClick?: () => void;
}

export function DailyQuoteCalendar({ onClick }: DailyQuoteCalendarProps) {
  const today = useMemo(() => new Date(), []);

  /** 语录列表 */
  const quotes = useMemo(
    () => getQuotesRange(today, PAST_DAYS, FUTURE_DAYS),
    [today]
  );

  /** 当前索引（today = PAST_DAYS） */
  const todayIndex = PAST_DAYS;
  const [currentIndex, setCurrentIndex] = useState(todayIndex);

  /** 滑动动画方向 */
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  /** 触摸手势 */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  /** 当前数据 */
  const current = quotes[currentIndex];
  const isToday = currentIndex === todayIndex;
  const categoryStyle = CATEGORY_COLORS[current.quote.category];

  // ─── 导航 ────────────────────────────────────────

  const goTo = useCallback(
    (newIndex: number, dir: "left" | "right") => {
      if (isAnimating || newIndex < 0 || newIndex >= quotes.length) return;
      setSlideDir(dir);
      setIsAnimating(true);
      // 短暂延迟后切换内容
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setSlideDir(null);
        setIsAnimating(false);
      }, 200);
    },
    [isAnimating, quotes.length]
  );

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1, "right");
  }, [currentIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(currentIndex + 1, "left");
  }, [currentIndex, goTo]);

  const goToday = useCallback(() => {
    const dir = currentIndex < todayIndex ? "left" : "right";
    goTo(todayIndex, dir);
  }, [currentIndex, todayIndex, goTo]);

  // ─── 触摸手势 ────────────────────────────────────

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // 水平滑动距离大于垂直：判定为翻页手势
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwiping.current) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      if (dx < -SWIPE_THRESHOLD) {
        goNext(); // 向左滑 → 后一天
      } else if (dx > SWIPE_THRESHOLD) {
        goPrev(); // 向右滑 → 前一天
      }
    },
    [goNext, goPrev]
  );

  // ─── 日期格式 ────────────────────────────────────

  const dateDisplay = formatDateDisplay(current.date);
  const weekday = getWeekdayCN(current.date);
  const todayKey = formatDateKey(today);
  const currentKey = formatDateKey(current.date);
  const dayLabel = currentKey === todayKey ? "今天" : dateDisplay;

  // ─── 动画样式 ────────────────────────────────────

  const cardAnimStyle: React.CSSProperties = slideDir
    ? {
        opacity: 0,
        transform: `translateX(${slideDir === "left" ? "-16px" : "16px"})`,
        transition: "none",
      }
    : {
        opacity: 1,
        transform: "translateX(0)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      };

  return (
    <div style={{ marginBottom: "var(--spacing-xl)" }}>
      {/* ═══ 日历卡片 ═══ */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: "var(--radius-xl)",
          background:
            "linear-gradient(135deg, rgba(196,154,108,0.2) 0%, rgba(139,170,125,0.1) 50%, rgba(212,176,138,0.08) 100%)",
          boxShadow: "0 2px 16px rgba(196, 154, 108, 0.08)",
        }}
      >
        {/* 装饰光点 */}
        <div
          className="absolute"
          style={{
            top: rpx(-40),
            right: rpx(-40),
            width: rpx(160),
            height: rpx(160),
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,154,108,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── 日期导航栏 ── */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: `${rpx(22)} ${rpx(24)} ${rpx(10)}`,
          }}
        >
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(48),
              height: rpx(48),
              borderRadius: "50%",
              background: "rgba(196,154,108,0.08)",
              border: "none",
              opacity: currentIndex === 0 ? 0.3 : 1,
              pointerEvents: currentIndex === 0 ? "none" : "auto",
            }}
            onClick={goPrev}
          >
            <ChevronLeft
              size={16}
              strokeWidth={1.8}
              style={{ color: "#C49A6C" }}
            />
          </button>

          <div className="flex items-center" style={{ gap: rpx(8) }}>
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-primary)",
                letterSpacing: rpx(1),
              }}
            >
              {dayLabel}
            </span>
            <span
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-tertiary)",
              }}
            >
              {currentKey === todayKey ? weekday : weekday}
            </span>
            {!isToday && (
              <button
                className="cursor-pointer flex items-center justify-center"
                style={{
                  width: rpx(36),
                  height: rpx(36),
                  borderRadius: "50%",
                  background: "rgba(196,154,108,0.12)",
                  border: "none",
                  marginLeft: rpx(4),
                }}
                onClick={goToday}
                title="回到今天"
              >
                <RotateCcw
                  size={12}
                  strokeWidth={2}
                  style={{ color: "#C49A6C" }}
                />
              </button>
            )}
          </div>

          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(48),
              height: rpx(48),
              borderRadius: "50%",
              background: "rgba(196,154,108,0.08)",
              border: "none",
              opacity: currentIndex >= quotes.length - 1 ? 0.3 : 1,
              pointerEvents:
                currentIndex >= quotes.length - 1 ? "none" : "auto",
            }}
            onClick={goNext}
          >
            <ChevronRight
              size={16}
              strokeWidth={1.8}
              style={{ color: "#C49A6C" }}
            />
          </button>
        </div>

        {/* ── 语录内容区（可滑动） ── */}
        <div
          className="cursor-pointer"
          style={{
            padding: `${rpx(12)} ${rpx(32)} ${rpx(24)}`,
            minHeight: rpx(180),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          onClick={onClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={cardAnimStyle}>
            {/* 类别标签 */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: `${rpx(4)} ${rpx(16)}`,
                borderRadius: rpx(20),
                background: categoryStyle.bg,
                marginBottom: rpx(16),
              }}
            >
              <span
                style={{
                  fontSize: rpx(20),
                  color: categoryStyle.text,
                  letterSpacing: rpx(2),
                }}
              >
                {current.quote.category}
              </span>
            </div>

            {/* 语录正文 */}
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "var(--font-size-lg)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                lineHeight: 1.9,
                margin: `0 0 ${rpx(16)}`,
                letterSpacing: rpx(1),
              }}
            >
              {current.quote.text}
            </p>

            {/* 来源 */}
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-tertiary)",
                fontFamily: FONT_SERIF,
                fontWeight: 300,
                margin: 0,
              }}
            >
              —— {current.quote.source}
            </p>
          </div>
        </div>

        {/* ── 日期指示点 ── */}
        <div
          className="flex items-center justify-center"
          style={{
            padding: `0 ${rpx(32)} ${rpx(20)}`,
            gap: rpx(8),
          }}
        >
          {quotes.map((_, i) => {
            const isCurrent = i === currentIndex;
            const isT = i === todayIndex;
            return (
              <button
                key={i}
                className="cursor-pointer"
                style={{
                  width: isCurrent ? rpx(20) : rpx(8),
                  height: rpx(8),
                  borderRadius: rpx(4),
                  background: isCurrent
                    ? "#C49A6C"
                    : isT
                      ? "rgba(196,154,108,0.35)"
                      : "rgba(196,154,108,0.15)",
                  border: "none",
                  padding: 0,
                  transition: "width 0.25s ease, background 0.25s ease",
                }}
                onClick={() => {
                  const dir = i > currentIndex ? "left" : "right";
                  goTo(i, dir);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── 今日之光标签 ── */}
      <div
        className="flex items-center justify-center"
        style={{
          marginTop: rpx(12),
          gap: rpx(8),
        }}
      >
        <div
          style={{
            width: rpx(20),
            height: 1,
            background: "rgba(196,154,108,0.2)",
          }}
        />
        <span
          style={{
            fontSize: rpx(20),
            color: "var(--color-text-tertiary)",
            letterSpacing: rpx(4),
            fontFamily: FONT_SERIF,
          }}
        >
          今日之光
        </span>
        <div
          style={{
            width: rpx(20),
            height: 1,
            background: "rgba(196,154,108,0.2)",
          }}
        />
      </div>
    </div>
  );
}