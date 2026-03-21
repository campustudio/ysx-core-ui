/**
 * ChapterPlayer - 章节播放器（宇宙星空主题）
 *
 * 听书核心页面，两种模式：
 *   - 封面模式：深空背景 + 封面图 + 全宽音频控制
 *   - 文稿模式：深色底 + 浅色文字 + 底部全宽控制栏
 *
 * 播放控制全宽铺满屏幕（进度条、按钮），不留左右边距
 *
 * 学习进度追踪：
 *   - 播放到 100%（结束）自动标记为已完成
 *   - 实时保存播放秒数到 localStorage
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  List,
} from "lucide-react";
import {
  getBookById,
  formatDuration,
  updateChapterProgress,
  getChapterProgress,
  type Chapter,
} from "../config/handbook-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// ─── 星空主题色 ──────────────────────────────────────

const COSMIC = {
  bgStart: "#0B1120",
  bgMid: "#0F1729",
  bgEnd: "#111D35",
  surface: "rgba(255,255,255,0.04)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.35)",
  accent: "#8BAA7D",
  amber: "#C49A6C",
  controlBg: "rgba(11,17,32,0.95)",
  /** 文稿模式用稍浅的底色方便阅读 */
  transcriptBg: "#131B2E",
} as const;

interface ChapterPlayerProps {
  bookId: string;
  chapterId: string;
  onBack?: () => void;
}

export function ChapterPlayer({
  bookId,
  chapterId,
  onBack,
}: ChapterPlayerProps) {
  const book = useMemo(() => getBookById(bookId), [bookId]);
  const [currentChapterId, setCurrentChapterId] = useState(chapterId);
  const [mode, setMode] = useState<"cover" | "transcript">("cover");

  // 音频状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressSaveTimer = useRef<number>(0);

  // 章节列表展开
  const [showChapterList, setShowChapterList] = useState(false);

  const currentChapter = useMemo(() => {
    if (!book) return null;
    return (
      book.chapters.find((c) => c.id === currentChapterId) || book.chapters[0]
    );
  }, [book, currentChapterId]);

  const chapterIndex = useMemo(() => {
    if (!book || !currentChapter) return 0;
    return book.chapters.findIndex((c) => c.id === currentChapter.id);
  }, [book, currentChapter]);

  const hasPrev = chapterIndex > 0;
  const hasNext = book ? chapterIndex < book.chapters.length - 1 : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 初始化章节
  useEffect(() => {
    if (currentChapter) {
      setDuration(currentChapter.duration);
      const saved = getChapterProgress(bookId, currentChapter.id);
      if (saved.playedSeconds > 0 && !saved.completed) {
        setCurrentTime(saved.playedSeconds);
      } else {
        setCurrentTime(0);
      }
      setIsPlaying(false);
    }
  }, [currentChapter, bookId]);

  // 模拟播放计时器
  useEffect(() => {
    let timer: number;
    if (isPlaying && currentChapter) {
      timer = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= currentChapter.duration) {
            setIsPlaying(false);
            // 播放完毕（100%）→ 标记完成
            updateChapterProgress(bookId, currentChapter.id, {
              completed: true,
              playedSeconds: currentChapter.duration,
            });
            return currentChapter.duration;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentChapter, bookId]);

  // 定期保存进度（每 5 秒）
  useEffect(() => {
    if (isPlaying && currentChapter) {
      progressSaveTimer.current = window.setInterval(() => {
        updateChapterProgress(bookId, currentChapter.id, {
          playedSeconds: currentTime,
        });
      }, 5000);
    }
    return () => {
      if (progressSaveTimer.current) clearInterval(progressSaveTimer.current);
    };
  }, [isPlaying, currentChapter, bookId, currentTime]);

  // ─── 控制 ────────────────────────────────────────

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(Math.max(0, seconds));
  }, []);

  const goPrevChapter = useCallback(() => {
    if (!book || !hasPrev) return;
    if (currentChapter) {
      updateChapterProgress(bookId, currentChapter.id, {
        playedSeconds: currentTime,
      });
    }
    const prevCh = book.chapters[chapterIndex - 1];
    setCurrentChapterId(prevCh.id);
    setShowChapterList(false);
  }, [book, hasPrev, chapterIndex, currentChapter, bookId, currentTime]);

  const goNextChapter = useCallback(() => {
    if (!book || !hasNext) return;
    if (currentChapter) {
      updateChapterProgress(bookId, currentChapter.id, {
        playedSeconds: currentTime,
      });
    }
    const nextCh = book.chapters[chapterIndex + 1];
    setCurrentChapterId(nextCh.id);
    setShowChapterList(false);
  }, [book, hasNext, chapterIndex, currentChapter, bookId, currentTime]);

  const selectChapter = useCallback(
    (ch: Chapter) => {
      if (currentChapter) {
        updateChapterProgress(bookId, currentChapter.id, {
          playedSeconds: currentTime,
        });
      }
      setCurrentChapterId(ch.id);
      setShowChapterList(false);
    },
    [currentChapter, bookId, currentTime]
  );

  const handleBack = useCallback(() => {
    if (currentChapter) {
      updateChapterProgress(bookId, currentChapter.id, {
        playedSeconds: currentTime,
      });
    }
    onBack?.();
  }, [currentChapter, bookId, currentTime, onBack]);

  // ─── 进度条 ──────────────────────────────────────

  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || !currentChapter) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      seekTo(Math.floor(ratio * currentChapter.duration));
    },
    [currentChapter, seekTo]
  );

  if (!book || !currentChapter) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: COSMIC.bgStart,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COSMIC.textTertiary,
        }}
      >
        内容不存在
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          mode === "cover"
            ? `linear-gradient(180deg, ${COSMIC.bgStart} 0%, ${COSMIC.bgMid} 50%, ${COSMIC.bgEnd} 100%)`
            : COSMIC.transcriptBg,
        overflow: "hidden",
      }}
    >
      {/* ═══ 顶部栏 ═══ */}
      <div
        className="flex-shrink-0"
        style={{
          paddingTop: `max(${rpx(24)}, env(safe-area-inset-top))`,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{ padding: `${rpx(16)} ${rpx(28)}` }}
        >
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(64),
              height: rpx(64),
              borderRadius: "50%",
              background: COSMIC.surface,
              border: "none",
            }}
            onClick={handleBack}
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              style={{ color: COSMIC.textPrimary }}
            />
          </button>

          {/* 封面/文稿 切换 */}
          <div
            className="flex"
            style={{
              background: COSMIC.surface,
              borderRadius: rpx(24),
              padding: rpx(4),
            }}
          >
            {(["cover", "transcript"] as const).map((m) => (
              <button
                key={m}
                className="cursor-pointer"
                style={{
                  padding: `${rpx(10)} ${rpx(28)}`,
                  borderRadius: rpx(20),
                  border: "none",
                  background: mode === m ? COSMIC.amber : "transparent",
                  color: mode === m ? "#fff" : COSMIC.textSecondary,
                  fontSize: rpx(24),
                  transition: "all 0.2s ease",
                }}
                onClick={() => setMode(m)}
              >
                {m === "cover" ? "封面" : "文稿"}
              </button>
            ))}
          </div>

          {/* 目录按钮 */}
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(64),
              height: rpx(64),
              borderRadius: "50%",
              background: COSMIC.surface,
              border: "none",
            }}
            onClick={() => setShowChapterList(!showChapterList)}
          >
            <List
              size={18}
              strokeWidth={1.5}
              style={{ color: COSMIC.textPrimary }}
            />
          </button>
        </div>
      </div>

      {/* ═══ 内容区 ═══ */}
      <div className="flex-1" style={{ overflow: "auto", position: "relative" }}>
        {mode === "cover" ? (
          /* ── 封面模式 ── */
          <div
            className="flex flex-col items-center justify-center h-full"
            style={{ padding: `0 ${rpx(60)}` }}
          >
            {/* 封面光晕 */}
            <div className="relative" style={{ marginBottom: rpx(36) }}>
              <div
                className="absolute"
                style={{
                  inset: rpx(-20),
                  borderRadius: rpx(28),
                  background:
                    "radial-gradient(ellipse at center, rgba(139,170,125,0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="overflow-hidden relative"
                style={{
                  width: rpx(400),
                  height: rpx(400),
                  borderRadius: rpx(20),
                  boxShadow:
                    "0 12px 48px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
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
            </div>

            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "var(--font-size-lg)",
                color: COSMIC.textPrimary,
                margin: 0,
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              {currentChapter.title}
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: COSMIC.textTertiary,
                margin: `${rpx(8)} 0 0`,
                textAlign: "center",
              }}
            >
              {book.title} · 第{currentChapter.index}章
            </p>
          </div>
        ) : (
          /* ── 文稿模式 ── */
          <div style={{ padding: `${rpx(20)} ${rpx(40)} ${rpx(40)}` }}>
            {currentChapter.transcript.map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: "var(--font-size-base)",
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 2,
                  margin: `0 0 ${rpx(24)}`,
                  textIndent: "2em",
                }}
              >
                {para}
              </p>
            ))}

            {/* 书籍信息卡 */}
            <div
              className="flex items-center"
              style={{
                padding: rpx(20),
                borderRadius: rpx(16),
                background: COSMIC.surface,
                gap: rpx(16),
                marginTop: rpx(24),
              }}
            >
              <div
                className="flex-shrink-0 overflow-hidden"
                style={{
                  width: rpx(80),
                  height: rpx(80),
                  borderRadius: rpx(8),
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
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: "var(--font-size-sm)",
                    color: COSMIC.textPrimary,
                    margin: 0,
                  }}
                >
                  {book.title}
                </p>
                <p
                  style={{
                    fontSize: rpx(22),
                    color: COSMIC.textTertiary,
                    margin: `${rpx(4)} 0 0`,
                  }}
                >
                  {currentChapter.subtitle || `第${currentChapter.index}章`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ 底部音频控制栏（全宽） ═══ */}
      <div
        className="flex-shrink-0"
        style={{
          width: "100%",
          background: COSMIC.controlBg,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          paddingBottom: `max(${rpx(24)}, env(safe-area-inset-bottom))`,
        }}
      >
        {/* 进度条 - 全宽无边距 */}
        <div style={{ padding: `${rpx(16)} ${rpx(24)} ${rpx(8)}` }}>
          <div
            ref={progressBarRef}
            className="cursor-pointer"
            style={{
              width: "100%",
              height: rpx(8),
              borderRadius: rpx(4),
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={handleProgressClick}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                borderRadius: rpx(4),
                background: `linear-gradient(90deg, ${COSMIC.amber}, #D4B08A)`,
                transition: isPlaying ? "none" : "width 0.2s ease",
              }}
            />
          </div>
          <div
            className="flex justify-between"
            style={{
              marginTop: rpx(6),
              fontSize: rpx(20),
              color: COSMIC.textTertiary,
            }}
          >
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* 播放控制 - 全宽居中 */}
        <div
          className="flex items-center justify-center"
          style={{
            padding: `${rpx(8)} ${rpx(24)} ${rpx(12)}`,
            gap: rpx(48),
          }}
        >
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(72),
              height: rpx(72),
              border: "none",
              background: "none",
              opacity: hasPrev ? 1 : 0.3,
              pointerEvents: hasPrev ? "auto" : "none",
            }}
            onClick={goPrevChapter}
          >
            <SkipBack
              size={22}
              strokeWidth={1.5}
              style={{ color: COSMIC.textPrimary }}
            />
          </button>

          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(96),
              height: rpx(96),
              borderRadius: "50%",
              background: COSMIC.amber,
              border: "none",
              boxShadow: `0 4px 20px rgba(196,154,108,0.35)`,
            }}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause size={24} strokeWidth={2} style={{ color: "#fff" }} />
            ) : (
              <Play
                size={24}
                strokeWidth={2}
                style={{ color: "#fff", marginLeft: 3 }}
              />
            )}
          </button>

          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(72),
              height: rpx(72),
              border: "none",
              background: "none",
              opacity: hasNext ? 1 : 0.3,
              pointerEvents: hasNext ? "auto" : "none",
            }}
            onClick={goNextChapter}
          >
            <SkipForward
              size={22}
              strokeWidth={1.5}
              style={{ color: COSMIC.textPrimary }}
            />
          </button>
        </div>
      </div>

      {/* ═══ 章节列表浮层 ═══ */}
      {showChapterList && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
            }}
            onClick={() => setShowChapterList(false)}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "60vh",
              background: COSMIC.bgMid,
              borderRadius: `${rpx(28)} ${rpx(28)} 0 0`,
              boxShadow: "0 -8px 40px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              className="flex items-center justify-between flex-shrink-0"
              style={{
                padding: `${rpx(24)} ${rpx(36)} ${rpx(16)}`,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "var(--font-size-sm)",
                  color: COSMIC.textPrimary,
                }}
              >
                按课程目录学习
              </span>
              <button
                className="cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "var(--font-size-xs)",
                  color: COSMIC.textTertiary,
                }}
                onClick={() => setShowChapterList(false)}
              >
                关闭
              </button>
            </div>

            <div
              style={{
                overflowY: "auto",
                flex: 1,
                padding: `0 ${rpx(36)}`,
              }}
            >
              {book.chapters.map((ch) => {
                const isCurrent = ch.id === currentChapterId;
                return (
                  <div
                    key={ch.id}
                    className="cursor-pointer flex items-center"
                    style={{
                      padding: `${rpx(18)} 0`,
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      gap: rpx(12),
                    }}
                    onClick={() => selectChapter(ch)}
                  >
                    {isCurrent && (
                      <div
                        style={{
                          width: rpx(6),
                          height: rpx(6),
                          borderRadius: "50%",
                          background: COSMIC.amber,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: isCurrent
                          ? COSMIC.amber
                          : COSMIC.textPrimary,
                        flex: 1,
                        fontFamily: isCurrent ? FONT_SERIF : undefined,
                      }}
                    >
                      第{ch.index}章 · {ch.title}
                    </span>
                    <span
                      style={{
                        fontSize: rpx(20),
                        color: COSMIC.textTertiary,
                        flexShrink: 0,
                      }}
                    >
                      {formatDuration(ch.duration)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                height: `max(${rpx(24)}, env(safe-area-inset-bottom))`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
