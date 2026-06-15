/**
 * HandbookReader - 正文阅读器（图5-02）
 *
 * 沉浸阅读：顶栏 + 导读 + 正文；滚动时收起底栏，减少干扰。
 * 底部：收藏 / 目录（笔记、问答置灰静默）；进度条无百分比数字。
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Type,
  Moon,
  Sun,
  MoreHorizontal,
  Share2,
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
import { BottomSheet } from "../components/shared/BottomSheet";
import { useToast } from "../hooks/useToast";
import { useReadingProgress } from "../hooks/useReadingProgress";
import {
  useReaderPrefs,
  READER_FONT_SCALES,
  READER_LINE_HEIGHTS,
} from "../hooks/useReaderPrefs";
import { ReaderSettingsSheet } from "../components/shared/handbook/ReaderSettingsSheet";
import { ChapterNoteSheet } from "../components/shared/handbook/NoteSheets";
import { useChapterNote } from "../hooks/useChapterNote";
import { ShareQuoteSheet } from "../components/shared/handbook/ShareQuoteSheet";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";

const GOLD = "#B8975A";

const CONTENT_MAX_WIDTH = rpx(620);
const SCROLL_CHROME_HIDE_MS = 720;

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
  const { prefs, update: updatePrefs } = useReaderPrefs();
  const night = prefs.theme === "night";
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [percent, setPercent] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();
  const { getNote, hasNote, saveNote } = useChapterNote();
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

  const idx = volume?.chapters.findIndex((c) => c.id === chapterId) ?? -1;
  const nextChapter =
    volume && idx >= 0 && idx < volume.chapters.length - 1
      ? volume.chapters[idx + 1]
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    setMarked(isBookmarked(volumeId, chapterId));
    setPercent(getChapterScrollPercent(chapterId));
    setChromeVisible(true);
    setIsLoaded(true);
  }, [volumeId, chapterId, getChapterProgress, isBookmarked]);

  useEffect(() => {
    setMarked(isBookmarked(volumeId, chapterId));
  }, [bookmarks, volumeId, chapterId, isBookmarked]);

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
    if (max > 0 && el.scrollTop + el.clientHeight >= el.scrollHeight - 48) {
      setChromeVisible(true);
    }
  }, [chapterId, updateChapterScrollProgress]);

  const handleScroll = useCallback(() => {
    setChromeVisible(false);
    if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    scrollIdleTimer.current = setTimeout(() => {
      setChromeVisible(true);
      scrollIdleTimer.current = null;
    }, SCROLL_CHROME_HIDE_MS);
    syncScrollProgress();
  }, [syncScrollProgress]);

  useEffect(() => {
    return () => {
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    };
  }, []);

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
  }, [
    volumeId,
    chapterId,
    isLoaded,
    prefs.fontIdx,
    prefs.lineIdx,
    prefs.serifBody,
    syncScrollProgress,
  ]);

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

  const chapterNote = getNote(volumeId, chapterId);
  const noted = hasNote(volumeId, chapterId);

  const palette = {
    day: {
      bg: "#F7F5F0",
      ink: "#1F1F1F",
      sub: "#606266",
      barBg: "rgba(247,245,240,0.96)",
    },
    sepia: {
      bg: "#F3E9D6",
      ink: "#43381F",
      sub: "#6B5D44",
      barBg: "rgba(243,233,214,0.96)",
    },
    night: {
      bg: "#16181C",
      ink: "rgba(255,255,255,0.86)",
      sub: "rgba(255,255,255,0.5)",
      barBg: "rgba(22,24,28,0.96)",
    },
  }[prefs.theme];
  const bg = palette.bg;
  const ink = palette.ink;
  const sub = palette.sub;
  const barBg = palette.barBg;
  const fontSize = READER_FONT_SCALES[prefs.fontIdx];
  const bodyLineHeight = READER_LINE_HEIGHTS[prefs.lineIdx];
  const bodyFont = prefs.serifBody ? FONT_SERIF : "inherit";

  const chapterLabel = (() => {
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
    if (num <= 10) return `第${chineseNumbers[num]}章`;
    return `第${num}章`;
  })();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: bg,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.25s ease",
      }}
    >
      <HandbookHeader
        onBack={onBack}
        title={chapter.title}
        withBackground
        rightContent={
          <div style={{ display: "flex", alignItems: "center", gap: rpx(16) }}>
            <button
              onClick={() => setShareOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
              aria-label="分享本章"
            >
              <Share2 size={19} color={ink} strokeWidth={1.5} />
            </button>
            <button
              onClick={() =>
                updatePrefs({
                  fontIdx: (prefs.fontIdx + 1) % READER_FONT_SCALES.length,
                })
              }
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
              aria-label="调整字号"
            >
              <Type size={19} color={ink} strokeWidth={1.5} />
            </button>
            <button
              onClick={() =>
                updatePrefs({ theme: night ? "day" : "night" })
              }
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
              aria-label={night ? "日间模式" : "夜间模式"}
            >
              {night ? (
                <Sun size={19} color={ink} strokeWidth={1.5} />
              ) : (
                <Moon size={19} color={ink} strokeWidth={1.5} />
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
              aria-label="阅读设置"
            >
              <MoreHorizontal size={19} color={ink} strokeWidth={1.5} />
            </button>
          </div>
        }
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onClick={() => setChromeVisible((v) => !v)}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(32)}) ${rpx(32)} ${rpx(48)}`,
        }}
      >
        <div
          style={{
            maxWidth: CONTENT_MAX_WIDTH,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: night
                ? "rgba(184,151,90,0.12)"
                : "rgba(184,151,90,0.07)",
              border: `1px solid ${night ? "rgba(184,151,90,0.24)" : "rgba(184,151,90,0.18)"}`,
              borderRadius: rpx(24),
              padding: `${rpx(24)} ${rpx(28)}`,
              marginBottom: rpx(48),
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
                marginBottom: rpx(12),
              }}
            >
              导读
            </span>
            <p
              style={{
                fontSize: rpx(24),
                // 导读位于浅金背景上，正文加深以保证长时间阅读清晰（P0-5 对比度）
                color: night ? "rgba(255,255,255,0.74)" : "#6B5C36",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {chapter.guide}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              margin: `0 0 ${rpx(48)}`,
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
              {chapterLabel}
            </span>
            <h1
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(52),
                fontWeight: 700,
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

          {chapter.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: rpx(fontSize),
                fontFamily: bodyFont,
                color: ink,
                lineHeight: bodyLineHeight,
                margin: `0 0 ${rpx(32)}`,
                letterSpacing: rpx(0.5),
              }}
            >
              {p}
            </p>
          ))}

          <div
            style={{
              display: "flex",
              gap: rpx(16),
              marginTop: rpx(48),
              paddingBottom: rpx(24),
            }}
            onClick={(e) => e.stopPropagation()}
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
      </div>

      <div
        style={{
          background: barBg,
          backdropFilter: "blur(10px)",
          borderTop: night
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.05)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          transform: chromeVisible ? "translateY(0)" : "translateY(100%)",
          opacity: chromeVisible ? 1 : 0,
          transition:
            "transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease",
          pointerEvents: chromeVisible ? "auto" : "none",
        }}
      >
        <div style={{ padding: `${rpx(10)} ${rpx(40)} 0` }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: rpx(8),
            }}
          >
            <span
              style={{
                fontSize: rpx(20),
                color: sub,
                fontFamily: FONT_SERIF,
              }}
            >
              第 {chapter.index} / {total} 章
            </span>
            <span
              style={{
                fontSize: rpx(20),
                color: sub,
                fontFamily: FONT_SERIF,
              }}
            >
              阅读中
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: `${rpx(14)} ${rpx(20)} ${rpx(18)}`,
          }}
        >
          {[
            { id: "fav", icon: Bookmark, label: "收藏", disabled: false },
            { id: "note", icon: PenLine, label: "笔记", disabled: false },
            { id: "toc", icon: List, label: "目录", disabled: false },
            { id: "ask", icon: MessageCircle, label: "问答", disabled: true },
          ].map((a) => {
            const Icon = a.icon;
            const active =
              (a.id === "fav" && marked) || (a.id === "note" && noted);
            const color = a.disabled
              ? night
                ? "rgba(255,255,255,0.22)"
                : "#C8C4BA"
              : active
                ? GOLD
                : ink;
            return (
              <button
                key={a.id}
                onClick={() => {
                  if (a.disabled) return;
                  if (a.id === "fav") handleBookmark();
                  else if (a.id === "toc") setShowToc(true);
                  else if (a.id === "note") setShowNotes(true);
                }}
                disabled={a.disabled}
                style={{
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: rpx(6),
                  cursor: a.disabled ? "default" : "pointer",
                  opacity: a.disabled ? 0.55 : 1,
                }}
                aria-label={
                  a.disabled
                    ? `${a.label}（即将开放）`
                    : a.id === "note" && noted
                      ? "笔记（已记）"
                      : a.label
                }
              >
                <span style={{ position: "relative", display: "flex" }}>
                  <Icon
                    size={20}
                    color={color}
                    strokeWidth={1.5}
                    fill={a.id === "fav" && marked ? GOLD : "none"}
                  />
                  {a.id === "note" && noted && (
                    <span
                      style={{
                        position: "absolute",
                        top: rpx(-3),
                        right: rpx(-5),
                        width: rpx(10),
                        height: rpx(10),
                        borderRadius: "50%",
                        background: GOLD,
                        boxShadow: night
                          ? "0 0 0 2px #1C1E22"
                          : "0 0 0 2px rgba(247,245,240,0.96)",
                      }}
                    />
                  )}
                </span>
                <span style={{ fontSize: rpx(18), color }}>{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <BottomSheet
        visible={showToc}
        onClose={() => setShowToc(false)}
        background={night ? "#1C1E22" : "#fff"}
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
              const chBookmarked = isBookmarked(volumeId, c.id);
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
                      if (chBookmarked) {
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
                      color={chBookmarked ? GOLD : sub}
                      strokeWidth={1.5}
                      fill={chBookmarked ? GOLD : "none"}
                    />
                  </button>
                </div>
              );
            })}
      </BottomSheet>

      <ReaderSettingsSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        prefs={prefs}
        onChange={updatePrefs}
        night={night}
      />

      <ShareQuoteSheet
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        quote={chapter.guide || chapter.subtitle || chapter.title}
        source={`《${volume.title}》· ${chapter.title}`}
        onCopied={() => toast.show("已复制")}
      />

      <ChapterNoteSheet
        visible={showNotes}
        onClose={() => setShowNotes(false)}
        chapterTitle={chapter.title}
        initialText={chapterNote?.text ?? ""}
        updatedAt={chapterNote?.updatedAt}
        night={night}
        onSave={(text) => {
          saveNote(volumeId, chapterId, text);
          toast.show(text.trim() ? "笔记已保存" : "已清空笔记");
        }}
      />

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
