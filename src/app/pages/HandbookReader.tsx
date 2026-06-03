/**
 * HandbookReader - 正文阅读器（图5-02）
 *
 * 沉浸阅读：顶栏(章名/Aa/夜间/更多) + 导读条 + 章标题副标题 + 正文 + 进度。
 * 底部：收藏 / 笔记 / 目录 / 问答(预留，第一版置灰)。读完一节 → 读后练习。
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Type,
  Moon,
  Sun,
  MoreHorizontal,
  Bookmark,
  PenLine,
  List,
  MessageCircle,
  X,
  Home,
  Library,
} from "lucide-react";
import {
  getV2VolumeById,
  getV2Chapter,
  getChapterProgressLabel,
  getChapterScrollPercent,
} from "../config/handbook-v2-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";

const GOLD = "#B8975A";

const FONT_SCALES = [28, 32, 36] as const; // 正文字号(rpx) 小/中/大

interface HandbookReaderProps {
  volumeId: string;
  chapterId: string;
  onBack?: () => void;
  onSelectChapter?: (volumeId: string, chapterId: string) => void;
  onFinish?: (volumeId: string, chapterId: string) => void;
  onGoHome?: () => void;
  onGoShelf?: () => void;
}

export function HandbookReader({
  volumeId,
  chapterId,
  onBack,
  onSelectChapter,
  onFinish,
  onGoHome,
  onGoShelf,
}: HandbookReaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [night, setNight] = useState(false);
  const [fontIdx, setFontIdx] = useState(1);
  const [showToc, setShowToc] = useState(false);
  const [percent, setPercent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const {
    saveProgress,
    addBookmark,
    removeBookmark,
    isBookmarked,
    bookmarks,
    getChapterProgress,
    updateChapterScrollProgress,
    markChapterAsComplete,
  } = useReadingProgress();

  const volume = getV2VolumeById(volumeId);
  const chapter = getV2Chapter(volumeId, chapterId);
  const total = volume?.chapters.length ?? 0;
  const bookmarked = isBookmarked(volumeId, chapterId);
  const [marked, setMarked] = useState(bookmarked);

  // 下一章
  const idx = volume?.chapters.findIndex((c) => c.id === chapterId) ?? -1;
  const nextChapter =
    volume && idx >= 0 && idx < volume.chapters.length - 1
      ? volume.chapters[idx + 1]
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    setMarked(isBookmarked(volumeId, chapterId));
    // 初始化进度显示为已保存的最大进度
    setPercent(getChapterScrollPercent(chapterId));
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, [volumeId, chapterId, getChapterProgress]);

  // 监听 bookmarks 变化，同步收藏按钮状态
  useEffect(() => {
    setMarked(isBookmarked(volumeId, chapterId));
  }, [bookmarks, volumeId, chapterId, isBookmarked]);

  // 防止目录抽屉背景滚动穿透
  useBodyScrollLock(showToc);

  // 保存阅读进度（继续阅读 / 读后练习 依赖）
  useEffect(() => {
    if (volume && chapter) {
      saveProgress({
        volumeId,
        chapterId,
        scrollPosition: 0,
        title: `${volume.title} · ${chapter.title}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volumeId, chapterId]);

  /** 根据滚动容器计算阅读进度；无滚动条时视为已浏览全文 (100%) */
  const syncScrollProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const currentPercent =
      max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100;
    setPercent((prev) => {
      const next = Math.max(prev, currentPercent);
      if (next > prev) {
        updateChapterScrollProgress(chapterId, next);
      }
      return next;
    });
  }, [chapterId, updateChapterScrollProgress]);

  const handleScroll = useCallback(() => {
    syncScrollProgress();
  }, [syncScrollProgress]);

  // 内容较短无滚动条时 onScroll 不会触发，需在布局完成后主动测量
  useEffect(() => {
    if (!isLoaded) return;
    syncScrollProgress();
    const t1 = requestAnimationFrame(syncScrollProgress);
    const t2 = window.setTimeout(syncScrollProgress, 150);
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return () => {
        cancelAnimationFrame(t1);
        clearTimeout(t2);
      };
    }
    const ro = new ResizeObserver(syncScrollProgress);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
  }, [volumeId, chapterId, isLoaded, fontIdx, syncScrollProgress]);

  // 收藏：Toggle（再点取消）
  const handleBookmark = useCallback(() => {
    if (marked) {
      const existing = bookmarks.find(
        (b) => b.volumeId === volumeId && b.chapterId === chapterId,
      );
      if (existing) removeBookmark(existing.id);
      setMarked(false);
      toast.show("已取消收藏");
      return;
    }
    if (volume && chapter) {
      const ok = addBookmark({
        volumeId,
        chapterId,
        title: `${volume.title} · ${chapter.title}`,
      });
      if (ok) {
        setMarked(true);
        toast.show("已加入收藏");
      } else {
        setMarked(true);
        toast.show("已在收藏中");
      }
    }
  }, [
    marked,
    bookmarks,
    volume,
    chapter,
    volumeId,
    chapterId,
    addBookmark,
    removeBookmark,
    toast,
  ]);

  if (!volume || !chapter) {
    return (
      <div style={{ padding: rpx(80), textAlign: "center", color: "#888" }}>
        章节内容筹备中
      </div>
    );
  }

  const bg = night ? "#16181C" : "#F7F5F0";
  const ink = night ? "rgba(255,255,255,0.86)" : "#1F1F1F";
  const sub = night ? "rgba(255,255,255,0.5)" : "#606266";
  const barBg = night ? "rgba(22,24,28,0.96)" : "rgba(247,245,240,0.96)";
  const fontSize = FONT_SCALES[fontIdx];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: bg,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.4s ease, background 0.25s ease",
      }}
    >
      <HandbookHeader
        onBack={onBack}
        title={chapter.title}
        withBackground
        rightContent={
          <div style={{ display: "flex", alignItems: "center", gap: rpx(16) }}>
            <button
              onClick={() => setFontIdx((i) => (i + 1) % FONT_SCALES.length)}
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Type size={19} color={ink} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setNight((n) => !n)}
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
            >
              {night ? (
                <Sun size={19} color={ink} strokeWidth={1.5} />
              ) : (
                <Moon size={19} color={ink} strokeWidth={1.5} />
              )}
            </button>
            <button
              onClick={() => toast.show("更多设置即将开放")}
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
            >
              <MoreHorizontal size={19} color={ink} strokeWidth={1.5} />
            </button>
          </div>
        }
      />

      {/* 正文滚动区 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(40)}) ${rpx(56)} ${rpx(80)}`,
        }}
      >
        {/* 导读盒（带「导读」标签） */}
        <div
          style={{
            background: night
              ? "rgba(184,151,90,0.12)"
              : "rgba(184,151,90,0.07)",
            border: `1px solid ${night ? "rgba(184,151,90,0.24)" : "rgba(184,151,90,0.18)"}`,
            borderRadius: rpx(24),
            padding: `${rpx(28)} ${rpx(30)}`,
            marginBottom: rpx(56),
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: FONT_SERIF,
              fontSize: rpx(20),
              color: GOLD,
              letterSpacing: rpx(2),
              background: night
                ? "rgba(184,151,90,0.16)"
                : "rgba(184,151,90,0.12)",
              padding: `${rpx(4)} ${rpx(16)}`,
              borderRadius: rpx(14),
              marginBottom: rpx(16),
            }}
          >
            导读
          </span>
          <p
            style={{
              fontSize: rpx(22),
              color: night ? "rgba(255,255,255,0.66)" : "#8A7B55",
              margin: 0,
              lineHeight: 1.8,
            }}
          >
            {chapter.guide}
          </p>
        </div>

        {/* 章标题（居中） */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            margin: `0 0 ${rpx(56)}`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              color: GOLD,
              letterSpacing: rpx(4),
            }}
          >
            {(() => {
              const chineseNumbers = [
                "",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六",
                "七",
                "八",
                "九",
                "十",
              ];
              const num = chapter.index;
              if (num <= 10) {
                return `第${chineseNumbers[num]}章`;
              }
              return `第${num}章`;
            })()}
          </span>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(56),
              fontWeight: 600,
              color: ink,
              margin: `${rpx(14)} 0 0`,
              letterSpacing: rpx(4),
              lineHeight: 1.35,
            }}
          >
            {chapter.title}
          </h1>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              color: sub,
              margin: `${rpx(16)} 0 0`,
              letterSpacing: rpx(2),
            }}
          >
            {chapter.subtitle}
          </p>
        </div>

        {/* 正文 */}
        {chapter.paragraphs.map((p, i) => (
          <p
            key={i}
            style={{
              fontSize: rpx(fontSize),
              color: ink,
              lineHeight: 1.95,
              margin: `0 0 ${rpx(36)}`,
              letterSpacing: rpx(0.5),
            }}
          >
            {p}
          </p>
        ))}

        {/* 底部按钮：下一节 + 去练习 */}
        <div
          style={{
            display: "flex",
            gap: rpx(16),
            marginTop: rpx(40),
          }}
        >
          <PrimaryButton
            title={nextChapter ? "下一节" : "完成本卷"}
            onClick={() => {
              markChapterAsComplete(chapterId);
              if (nextChapter) {
                onSelectChapter?.(volumeId, nextChapter.id);
              } else {
                toast.show("本卷已读完，做得很好");
              }
            }}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title="去练习"
            variant="filled"
            onClick={() => {
              markChapterAsComplete(chapterId);
              onFinish?.(volumeId, chapterId);
            }}
            style={{ flex: 1.2 }}
          />
        </div>
      </div>

      {/* 进度 + 底部操作栏 */}
      <div
        style={{
          background: barBg,
          backdropFilter: "blur(10px)",
          borderTop: night
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.05)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* 本章阅读进度（参照设计：标签上、进度条下） */}
        <div style={{ padding: `${rpx(12)} ${rpx(40)} 0` }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: rpx(10),
            }}
          >
            <span
              style={{
                fontSize: rpx(20),
                color: sub,
                fontFamily: FONT_SERIF,
              }}
            >
              章节进度 {chapter.index}/{total}
            </span>
            <span
              style={{
                fontSize: rpx(20),
                color: GOLD,
                fontFamily: FONT_SERIF,
              }}
            >
              {percent}%
            </span>
          </div>
          <div
            style={{
              height: rpx(4),
              background: night ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
              borderRadius: rpx(2),
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: GOLD,
                borderRadius: rpx(2),
                transition: "width 0.18s ease",
              }}
            />
          </div>
        </div>

        {/* 操作栏 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: `${rpx(16)} ${rpx(20)} ${rpx(20)}`,
          }}
        >
          {[
            { id: "fav", icon: Bookmark, label: "收藏", disabled: false },
            { id: "note", icon: PenLine, label: "笔记", disabled: true },
            { id: "toc", icon: List, label: "目录", disabled: false },
            { id: "ask", icon: MessageCircle, label: "问答", disabled: true },
          ].map((a) => {
            const Icon = a.icon;
            const color = a.disabled
              ? night
                ? "rgba(255,255,255,0.25)"
                : "#C2BEB3"
              : a.id === "fav" && marked
                ? GOLD
                : ink;
            return (
              <button
                key={a.id}
                onClick={() => {
                  if (a.disabled) {
                    toast.show(`「${a.label}」即将开放，敬请期待`);
                  } else if (a.id === "fav") handleBookmark();
                  else if (a.id === "toc") setShowToc(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: rpx(6),
                  cursor: a.disabled ? "not-allowed" : "pointer",
                }}
              >
                <Icon
                  size={20}
                  color={color}
                  strokeWidth={1.5}
                  fill={a.id === "fav" && marked ? GOLD : "none"}
                />
                <span style={{ fontSize: rpx(18), color }}>{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 目录弹层 */}
      {showToc && (
        <div
          onClick={() => setShowToc(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 50,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxHeight: "70vh",
              background: night ? "#1C1E22" : "#fff",
              borderRadius: `${rpx(32)} ${rpx(32)} 0 0`,
              padding: `${rpx(32)} ${rpx(40)} calc(env(safe-area-inset-bottom) + ${rpx(40)})`,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: rpx(24),
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(32),
                  fontWeight: 600,
                  color: ink,
                }}
              >
                {volume.title} · 目录
              </span>
              <button
                onClick={() => setShowToc(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <X size={20} color={sub} strokeWidth={1.6} />
              </button>
            </div>

            {/* 快捷导航：返回首页 / 查看书架 */}
            <div
              style={{
                display: "flex",
                gap: rpx(12),
                marginBottom: rpx(24),
                paddingBottom: rpx(24),
                borderBottom: night
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <button
                onClick={() => {
                  setShowToc(false);
                  onGoHome?.();
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: rpx(8),
                  padding: `${rpx(16)} 0`,
                  background: night
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  border: "none",
                  borderRadius: rpx(16),
                  cursor: "pointer",
                }}
              >
                <Home size={16} color={GOLD} strokeWidth={1.6} />
                <span
                  style={{
                    fontSize: rpx(22),
                    color: ink,
                    fontFamily: FONT_SERIF,
                  }}
                >
                  返回首页
                </span>
              </button>
              <button
                onClick={() => {
                  setShowToc(false);
                  onGoShelf?.();
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: rpx(8),
                  padding: `${rpx(16)} 0`,
                  background: night
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  border: "none",
                  borderRadius: rpx(16),
                  cursor: "pointer",
                }}
              >
                <Library size={16} color={GOLD} strokeWidth={1.6} />
                <span
                  style={{
                    fontSize: rpx(22),
                    color: ink,
                    fontFamily: FONT_SERIF,
                  }}
                >
                  查看书架
                </span>
              </button>
            </div>

            {volume.chapters.map((c) => {
              const active = c.id === chapterId;
              const progressLabel = getChapterProgressLabel(c.id);
              const bookmarked = isBookmarked(volumeId, c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setShowToc(false);
                    if (c.id !== chapterId) onSelectChapter?.(volumeId, c.id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: rpx(16),
                    padding: `${rpx(24)} 0`,
                    borderBottom: night
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(0,0,0,0.05)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(24),
                      color: active ? GOLD : "#B8B4AA",
                      minWidth: rpx(44),
                    }}
                  >
                    {String(c.index).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: rpx(26),
                      color: active ? GOLD : ink,
                      fontWeight: active ? 600 : 400,
                      fontFamily: FONT_SERIF,
                    }}
                  >
                    {c.title}
                  </span>
                  {progressLabel ? (
                    <span
                      style={{
                        fontSize: rpx(18),
                        color: progressLabel === "已完成" ? GOLD : "#B8B4AA",
                        fontFamily: FONT_SERIF,
                        flexShrink: 0,
                      }}
                    >
                      {progressLabel}
                    </span>
                  ) : null}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (bookmarked) {
                        const existing = bookmarks.find(
                          (b) =>
                            b.volumeId === volumeId && b.chapterId === c.id,
                        );
                        if (existing) removeBookmark(existing.id);
                        toast.show("已取消收藏");
                      } else {
                        const ok = addBookmark({
                          volumeId,
                          chapterId: c.id,
                          title: `${volume.title} · ${c.title}`,
                        });
                        if (ok) toast.show("已加入收藏");
                        else toast.show("已在收藏中");
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: rpx(4),
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Bookmark
                      size={18}
                      color={bookmarked ? GOLD : sub}
                      strokeWidth={1.5}
                      fill={bookmarked ? GOLD : "none"}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
