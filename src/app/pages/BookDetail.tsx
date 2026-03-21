/**
 * BookDetail - 书籍详情 · 章节列表（宇宙星空主题）
 *
 * 深色背景 + 星点装饰 + 发光封面
 * 与 Handbook 保持统一的宇宙星空视觉语言
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { ArrowLeft, Play, CheckCircle2, Clock } from "lucide-react";
import {
  getBookById,
  getBookProgress,
  calcBookPercent,
  getCompletedCount,
  formatDuration,
  type ChapterProgress,
} from "../config/handbook-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// ─── 星空主题色（与 Handbook 保持一致） ────────────────

const COSMIC = {
  bgStart: "#0B1120",
  bgEnd: "#111D35",
  card: "rgba(255,255,255,0.06)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.35)",
  accent: "#8BAA7D",
  amber: "#C49A6C",
} as const;

interface BookDetailProps {
  bookId: string;
  onBack?: () => void;
  onSelectChapter?: (bookId: string, chapterId: string) => void;
}

export function BookDetail({
  bookId,
  onBack,
  onSelectChapter,
}: BookDetailProps) {
  const book = useMemo(() => getBookById(bookId), [bookId]);
  const [progress, setProgress] = useState<Record<string, ChapterProgress>>(
    {}
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (book) {
      setProgress(getBookProgress(book.id));
    }
  }, [book]);

  const refreshProgress = useCallback(() => {
    if (book) setProgress(getBookProgress(book.id));
  }, [book]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshProgress();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [refreshProgress]);

  if (!book) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: COSMIC.bgStart,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COSMIC.textTertiary,
        }}
      >
        书籍不存在
      </div>
    );
  }

  const percent = calcBookPercent(book);
  const completedCount = getCompletedCount(book);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${COSMIC.bgStart} 0%, ${COSMIC.bgEnd} 100%)`,
      }}
    >
      {/* ═══ 顶部区域 ═══ */}
      <div
        className="app-container"
        style={{
          paddingTop: `max(${rpx(24)}, env(safe-area-inset-top))`,
        }}
      >
        {/* 返回按钮 */}
        <div style={{ padding: `${rpx(16)} ${rpx(28)}` }}>
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(64),
              height: rpx(64),
              borderRadius: "50%",
              background: COSMIC.card,
              border: "none",
            }}
            onClick={onBack}
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              style={{ color: COSMIC.textPrimary }}
            />
          </button>
        </div>

        {/* 书籍信息卡 */}
        <div
          className="flex"
          style={{
            padding: `${rpx(8)} ${rpx(36)} ${rpx(28)}`,
            gap: rpx(24),
          }}
        >
          {/* 封面（带光晕） */}
          <div className="flex-shrink-0 relative">
            <div
              className="absolute"
              style={{
                inset: rpx(-8),
                borderRadius: rpx(16),
                background:
                  "radial-gradient(ellipse at center, rgba(139,170,125,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              className="overflow-hidden relative"
              style={{
                width: rpx(160),
                height: rpx(213),
                borderRadius: rpx(12),
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              <ImageWithFallback
                src={book.cover}
                alt={book.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* 信息 */}
          <div
            className="flex-1 flex flex-col justify-between"
            style={{ minWidth: 0 }}
          >
            <div>
              <h2
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "var(--font-size-xl)",
                  color: COSMIC.textPrimary,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {book.title}
              </h2>
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: COSMIC.textTertiary,
                  margin: `${rpx(8)} 0 0`,
                }}
              >
                {book.author}
              </p>
              <p
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: COSMIC.textSecondary,
                  margin: `${rpx(12)} 0 0`,
                  lineHeight: 1.5,
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
            <div style={{ marginTop: rpx(12) }}>
              <div
                className="flex items-center"
                style={{ gap: rpx(8), marginBottom: rpx(8) }}
              >
                <span
                  style={{
                    fontSize: rpx(22),
                    color: percent > 0 ? COSMIC.accent : COSMIC.textTertiary,
                    fontFamily: FONT_SERIF,
                  }}
                >
                  {percent > 0 ? `已学 ${percent}%` : "未开始学习"}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: rpx(8),
                  borderRadius: rpx(4),
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    borderRadius: rpx(4),
                    background: `linear-gradient(90deg, ${COSMIC.accent}, #A8C09D)`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: rpx(20),
                  color: COSMIC.textTertiary,
                  margin: `${rpx(6)} 0 0`,
                }}
              >
                {completedCount}/{book.totalChapters} 章已完成
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 分割线 ═══ */}
      <div
        style={{
          height: 1,
          margin: `0 ${rpx(36)}`,
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* ═══ 章节列表 ═══ */}
      <div
        className="app-container"
        style={{
          padding: `${rpx(20)} ${rpx(36)}`,
          paddingBottom: rpx(120),
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: rpx(16) }}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "var(--font-size-sm)",
              color: COSMIC.textPrimary,
            }}
          >
            全部章节（{book.totalChapters}）
          </span>
        </div>

        {book.chapters.map((ch) => {
          const chProgress = progress[ch.id];
          const isCompleted = chProgress?.completed;
          const isInProgress =
            !isCompleted &&
            chProgress?.playedSeconds &&
            chProgress.playedSeconds > 0;

          return (
            <div
              key={ch.id}
              className="cursor-pointer flex items-center"
              style={{
                padding: `${rpx(20)} 0`,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                gap: rpx(16),
              }}
              onClick={() => onSelectChapter?.(book.id, ch.id)}
            >
              {/* 序号/图标 */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: rpx(48),
                  height: rpx(48),
                  borderRadius: "50%",
                  background: isCompleted
                    ? "rgba(139,170,125,0.15)"
                    : "rgba(255,255,255,0.06)",
                }}
              >
                {isCompleted ? (
                  <CheckCircle2
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: COSMIC.accent }}
                  />
                ) : (
                  <Play
                    size={14}
                    strokeWidth={1.5}
                    style={{
                      color: isInProgress
                        ? COSMIC.amber
                        : COSMIC.textTertiary,
                      marginLeft: 2,
                    }}
                  />
                )}
              </div>

              {/* 标题 */}
              <div className="flex-1" style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: isCompleted
                      ? COSMIC.textTertiary
                      : COSMIC.textPrimary,
                    margin: 0,
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  第{ch.index}章 · {ch.title}
                </p>
                {ch.subtitle && (
                  <p
                    style={{
                      fontSize: rpx(22),
                      color: COSMIC.textTertiary,
                      margin: `${rpx(4)} 0 0`,
                      lineHeight: 1.3,
                    }}
                  >
                    {ch.subtitle}
                  </p>
                )}
              </div>

              {/* 时长 */}
              <div
                className="flex-shrink-0 flex items-center"
                style={{ gap: rpx(6) }}
              >
                <Clock
                  size={12}
                  strokeWidth={1.5}
                  style={{ color: COSMIC.textTertiary }}
                />
                <span
                  style={{
                    fontSize: rpx(20),
                    color: COSMIC.textTertiary,
                  }}
                >
                  {formatDuration(ch.duration)}
                </span>
              </div>

              {/* 状态标签 */}
              <div
                className="flex-shrink-0"
                style={{
                  padding: `${rpx(4)} ${rpx(14)}`,
                  borderRadius: rpx(16),
                  background: isCompleted
                    ? "rgba(139,170,125,0.15)"
                    : isInProgress
                      ? "rgba(196,154,108,0.15)"
                      : "rgba(255,255,255,0.04)",
                  fontSize: rpx(20),
                  color: isCompleted
                    ? COSMIC.accent
                    : isInProgress
                      ? COSMIC.amber
                      : COSMIC.textTertiary,
                }}
              >
                {isCompleted ? "已学完" : isInProgress ? "学习中" : "未学习"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
