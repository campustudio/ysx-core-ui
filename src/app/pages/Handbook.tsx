/**
 * Handbook - 人类手册 · 听书学习主页
 *
 * 底部导航第二个 Tab 对应的页面
 * 宇宙星空深色主题，区别于首页的古纸暖色调
 *
 * 布局（上→下）：
 *   ① 星空背景 + 顶部标题栏
 *   ② 分类标签条（推荐/视频/音频/电子书/图文）
 *   ③ 书籍列表（深色卡片，封面+标题+作者+进度）
 *
 * 配色：
 *   背景：深空蓝 #0B1120 → #111D35
 *   卡片：rgba(255,255,255,0.06)
 *   文字：白色系
 *   强调：鼠尾草绿 #8BAA7D（标签） + 琥珀金 #C49A6C（进度）
 */

import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import {
  HANDBOOK_CATEGORIES,
  BOOKS,
  getBooksByCategory,
  calcBookPercent,
  getCompletedCount,
  type Book,
} from "../config/handbook-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

// ─── 星空主题色 ──────────────────────────────────────

const COSMIC = {
  bgStart: "#0B1120",
  bgEnd: "#111D35",
  card: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.06)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.35)",
  accent: "#8BAA7D",
  accentBg: "rgba(139,170,125,0.2)",
  amber: "#C49A6C",
  amberBg: "rgba(196,154,108,0.15)",
  star: "rgba(255,255,255,0.03)",
} as const;

interface HandbookProps {
  onSelectBook?: (bookId: string) => void;
  onNavChange?: (index: number) => void;
}

const NAV_LABELS = ["首页", "人类手册", "新人生之路", "明镜"];

export function Handbook({ onSelectBook, onNavChange }: HandbookProps) {
  const [activeCategory, setActiveCategory] = useState("recommend");
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryChange = useCallback((catId: string) => {
    setActiveCategory(catId);
    setBooks(getBooksByCategory(catId));
  }, []);

  const handleSearch = useCallback(() => {
    toast.show("搜索功能正在用心打磨中，敬请期待");
  }, [toast]);

  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 1) return; // 当前页
      if (index === 0 || index === 2) {
        // 回首页 / 新人生之路 → 委托 App.tsx
        onNavChange?.(index);
        return;
      }
      toast.show(`「${NAV_LABELS[index]}」正在用心打磨中，敬请期待`);
    },
    [onNavChange, toast]
  );

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${COSMIC.bgStart} 0%, ${COSMIC.bgEnd} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 星点装饰 */}
      <div
        className="absolute"
        style={{
          top: rpx(60),
          right: rpx(80),
          width: rpx(4),
          height: rpx(4),
          borderRadius: "50%",
          background: "rgba(255,255,255,0.5)",
          boxShadow: `
            ${rpx(120)} ${rpx(40)} 0 rgba(255,255,255,0.3),
            ${rpx(-180)} ${rpx(100)} 0 rgba(255,255,255,0.2),
            ${rpx(60)} ${rpx(200)} 0 rgba(255,255,255,0.4),
            ${rpx(-100)} ${rpx(300)} 0 rgba(255,255,255,0.15),
            ${rpx(200)} ${rpx(150)} 0 rgba(255,255,255,0.25)
          `,
          pointerEvents: "none",
        }}
      />

      {/* ═══ 顶部标题栏 ═══ */}
      <div
        className="app-container"
        style={{
          paddingTop: `max(${rpx(24)}, env(safe-area-inset-top))`,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: `${rpx(24)} ${rpx(36)} ${rpx(16)}`,
          }}
        >
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "var(--font-size-2xl)",
              color: COSMIC.textPrimary,
              margin: 0,
              letterSpacing: rpx(2),
            }}
          >
            人类手册
          </h1>
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(64),
              height: rpx(64),
              borderRadius: "50%",
              background: COSMIC.card,
              border: "none",
            }}
            onClick={handleSearch}
          >
            <Search
              size={18}
              strokeWidth={1.5}
              style={{ color: COSMIC.textSecondary }}
            />
          </button>
        </div>

        {/* ═══ 分类标签 ═══ */}
        <div
          className="flex"
          style={{
            padding: `0 ${rpx(36)} ${rpx(20)}`,
            gap: rpx(16),
            overflowX: "auto",
          }}
        >
          {HANDBOOK_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className="cursor-pointer flex-shrink-0"
                style={{
                  padding: `${rpx(12)} ${rpx(28)}`,
                  borderRadius: rpx(32),
                  border: isActive
                    ? "none"
                    : `1px solid rgba(255,255,255,0.12)`,
                  background: isActive ? COSMIC.accent : "transparent",
                  color: isActive ? "#fff" : COSMIC.textSecondary,
                  fontSize: "var(--font-size-xs)",
                  transition: "all 0.25s ease",
                }}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 书籍列表 ═══ */}
      <div
        className="app-container"
        style={{
          padding: `0 ${rpx(36)}`,
          paddingBottom: "calc(var(--nav-height) + var(--spacing-xl))",
        }}
      >
        {books.map((book) => {
          const percent = calcBookPercent(book);
          const completedCount = getCompletedCount(book);

          return (
            <div
              key={book.id}
              className="cursor-pointer"
              style={{
                display: "flex",
                gap: rpx(24),
                padding: `${rpx(24)} 0`,
                borderBottom: `1px solid rgba(255,255,255,0.04)`,
              }}
              onClick={() => onSelectBook?.(book.id)}
            >
              {/* 封面 */}
              <div
                className="flex-shrink-0 overflow-hidden"
                style={{
                  width: rpx(180),
                  height: rpx(240),
                  borderRadius: rpx(12),
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)",
                }}
              >
                <ImageWithFallback
                  src={book.cover}
                  alt={book.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* 信息 */}
              <div
                className="flex-1 flex flex-col justify-between"
                style={{ minWidth: 0, padding: `${rpx(4)} 0` }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: "var(--font-size-lg)",
                      color: COSMIC.textPrimary,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {book.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: COSMIC.textTertiary,
                      margin: `${rpx(6)} 0 0`,
                    }}
                  >
                    {book.author}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: COSMIC.textSecondary,
                      margin: `${rpx(12)} 0 0`,
                      lineHeight: 1.6,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {book.description}
                  </p>
                </div>

                {/* 进度 */}
                <div>
                  <div
                    className="flex items-center"
                    style={{ gap: rpx(8), marginBottom: rpx(8) }}
                  >
                    <span
                      style={{
                        fontSize: rpx(20),
                        color: percent > 0 ? COSMIC.accent : COSMIC.textTertiary,
                      }}
                    >
                      {percent > 0 ? `已学 ${percent}%` : "未开始"}
                    </span>
                    <span
                      style={{
                        fontSize: rpx(20),
                        color: COSMIC.textTertiary,
                      }}
                    >
                      · {book.totalChapters}章
                      {completedCount > 0 && ` · 已完成${completedCount}章`}
                    </span>
                  </div>
                  {/* 进度条 */}
                  <div
                    style={{
                      width: "100%",
                      height: rpx(6),
                      borderRadius: rpx(3),
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        borderRadius: rpx(3),
                        background:
                          percent > 0
                            ? `linear-gradient(90deg, ${COSMIC.accent}, #A8C09D)`
                            : "transparent",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {books.length === 0 && (
          <div
            className="flex items-center justify-center"
            style={{
              padding: `${rpx(120)} 0`,
              color: COSMIC.textTertiary,
              fontSize: "var(--font-size-sm)",
            }}
          >
            暂无相关内容
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <BottomNavigation active={1} onChange={handleNavChange} />

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={toast.duration}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}