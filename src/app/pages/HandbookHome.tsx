/**
 * HandbookHome - 人类手册馆 · 首页（图3）
 *
 * 先稳住再导读：三大入口 + 十卷横滑 + 阅读陪伴 + 继续阅读 + 进入完整书架。
 * 风格：简约为底（沿用现有克制基调），柔金少量点缀；背景图先用现有图占位。
 */

import { useState, useCallback, useEffect } from "react";
import {
  ChevronRight,
  Sun,
  Lock,
  Book,
  Map,
  Bookmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  V2_VOLUMES,
  VOLUME_CN,
  getV2VolumeById,
  getV2Chapter,
  getVolumeProgressPercent,
} from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  rpx,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  ICON_ENGRAVED,
  HANDBOOK_BG,
} from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { VolumeBookCover } from "../components/shared/VolumeBookCover";
import { HandbookPlaceholderCard } from "../components/shared/HandbookPlaceholderCard";
import { useToast } from "../hooks/useToast";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { HandbookBookmarksSheet } from "../components/shared/HandbookBookmarksSheet";
import { ComingSoonSheet } from "../components/shared/handbook/ComingSoonSheet";
import { useBottomNav } from "../components/navigation/BottomNavContext";
import bgLayer1 from "@/assets/images/human-manual/home-top.webp";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookHomeProps {
  onOpenShelf?: () => void;
  onOpenReadingEntry?: () => void;
  onOpenDaily?: () => void;
  onOpenVolume?: (volumeId: string) => void;
  onOpenPractice?: (volumeId: string, chapterId: string) => void;
  onContinueReading?: (volumeId: string, chapterId: string) => void;
  onNavChange?: (index: number) => void;
}

/** 三大入口（图标：内层页面统一使用 lucide 图标，遵循简约原则） */
const ENTRIES: {
  id: string;
  icon: LucideIcon | null;
  iconImg: string | null;
  title: string;
  desc: string;
}[] = [
  {
    id: "shelf",
    icon: Book,
    iconImg: null,
    title: "开始读十卷母本",
    desc: "从根本理解生命与感知的规律",
  },
  {
    id: "entry",
    icon: Map,
    iconImg: null,
    title: "找到我的阅读入口",
    desc: "从当下感知出发，找到适合的路径",
  },
  {
    id: "daily",
    icon: Sun,
    iconImg: null,
    title: "今日一段",
    desc: "一天一段文字，滋养你的感知",
  },
];

export function HandbookHome({
  onOpenShelf,
  onOpenReadingEntry,
  onOpenDaily,
  onOpenVolume,
  onOpenPractice,
  onContinueReading,
}: HandbookHomeProps) {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showGuideNote, setShowGuideNote] = useState(false);
  const toast = useToast();
  const navDock = useBottomNav();
  const { lastProgress, hasProgress, bookmarks, removeBookmark } =
    useReadingProgress();

  // 继续阅读详情（卷名/章名/进度百分比）
  // 新用户case：无进度时显示第一卷第一章
  const contVolume =
    hasProgress && lastProgress
      ? getV2VolumeById(lastProgress.volumeId)
      : V2_VOLUMES[0];
  const contChapter =
    hasProgress && lastProgress
      ? getV2Chapter(lastProgress.volumeId, lastProgress.chapterId)
      : (V2_VOLUMES[0]?.chapters[0] ?? null);
  const contPercent = contVolume ? getVolumeProgressPercent(contVolume.id) : 0;

  // 本卷是否已读完（最后一章）：若已读完，则「继续阅读」应指向下一卷
  const volumeFinished = !!(
    contVolume &&
    contChapter &&
    contChapter.index >= contVolume.chapters.length
  );
  const nextVolume =
    volumeFinished && contVolume
      ? (V2_VOLUMES.find(
          (v) => v.volumeNumber === contVolume.volumeNumber + 1,
        ) ?? null)
      : null;

  // 实际展示与跳转目标：读完且有下一卷 → 下一卷第 1 章；否则维持当前
  const dockVolume = nextVolume ?? contVolume;
  const dockChapter = nextVolume ? nextVolume.chapters[0] : contChapter;
  const dockPercent = nextVolume ? 0 : contPercent;
  const isNewUser = !hasProgress;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEntry = useCallback(
    (id: string) => {
      if (id === "shelf") onOpenShelf?.();
      else if (id === "entry") onOpenReadingEntry?.();
      else if (id === "daily") onOpenDaily?.();
    },
    [onOpenShelf, onOpenReadingEntry, onOpenDaily],
  );

  const handlePractice = useCallback(() => {
    if (hasProgress && lastProgress) {
      onOpenPractice?.(lastProgress.volumeId, lastProgress.chapterId);
    } else {
      toast.show("先开始阅读一节，再来做读后练习吧");
    }
  }, [hasProgress, lastProgress, onOpenPractice, toast]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: HANDBOOK_BG,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: rpx(760),
          backgroundImage: `url(${bgLayer1})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          // opacity: 0.9,
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* 标题区（居中 + 右上角收藏入口） */}
        <div
          style={{
            padding: `calc(env(safe-area-inset-top) + ${rpx(72)}) ${rpx(48)} 0`,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* 右上角收藏入口 */}
          <button
            onClick={() => setShowBookmarks(true)}
            style={{
              position: "absolute",
              right: rpx(48),
              top: rpx(8),
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: rpx(8),
              display: "flex",
              alignItems: "center",
            }}
          >
            <Bookmark size={20} color={GOLD} strokeWidth={1.5} />
          </button>

          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(64),
              fontWeight: 600,
              color: "#2A2620",
              letterSpacing: rpx(8),
              margin: 0,
              textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            }}
          >
            人类手册馆
          </h1>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              color: "#6A6052",
              letterSpacing: rpx(2),
              lineHeight: 1.7,
              margin: `${rpx(20)} 0 0`,
              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
            }}
          >
            这里不是书库，而是一条回到感知的路。
          </p>
        </div>

        {/* 三大入口（液态玻璃·三列） */}
        <div
          style={{
            display: "flex",
            gap: rpx(20),
            padding: `${rpx(48)} ${rpx(40)} 0`,
          }}
        >
          {ENTRIES.map((e) => {
            const Icon = e.icon;
            return (
              <button
                key={e.id}
                onClick={() => handleEntry(e.id)}
                style={{
                  ...LIQUID_GLASS,
                  flex: 1,
                  minWidth: 0,
                  borderRadius: rpx(28),
                  padding: `${rpx(36)} ${rpx(16)} ${rpx(32)}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.18s ease",
                }}
                onMouseDown={(ev) =>
                  (ev.currentTarget.style.transform = "scale(0.97)")
                }
                onMouseUp={(ev) =>
                  (ev.currentTarget.style.transform = "scale(1)")
                }
                onMouseLeave={(ev) =>
                  (ev.currentTarget.style.transform = "scale(1)")
                }
              >
                <div
                  style={{
                    height: rpx(40),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: rpx(16),
                  }}
                >
                  {e.iconImg ? (
                    <img
                      src={e.iconImg}
                      alt=""
                      style={{
                        width: rpx(40),
                        height: rpx(40),
                        objectFit: "contain",
                        opacity: 0.55,
                      }}
                    />
                  ) : (
                    Icon && (
                      <Icon
                        size={22}
                        strokeWidth={1.4}
                        color={GOLD}
                        style={{
                          filter:
                            "drop-shadow(0px 1.5px 1.5px rgba(255,255,255,1)) drop-shadow(0px -1.5px 1.5px rgba(0,0,0,0.15))",
                        }}
                      />
                    )
                  )}
                </div>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(26),
                    fontWeight: 700,
                    color: "#23201A",
                    margin: 0,
                    letterSpacing: rpx(1),
                    lineHeight: 1.3,
                    minHeight: rpx(68),
                    textShadow:
                      "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)",
                  }}
                >
                  {e.title}
                </p>
                <p
                  style={{
                    fontSize: rpx(18),
                    color: "#6F665A",
                    margin: `${rpx(12)} 0 0`,
                    textShadow:
                      "0px 1.5px 1.5px rgba(255,255,255,0.9), 0px -1px 1.5px rgba(0,0,0,0.12)",
                    lineHeight: 1.5,
                  }}
                >
                  {e.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* 白色内容承托层：十卷横滑 + 阅读陪伴 */}
        <div
          style={{
            marginTop: rpx(56),
            background: "#FBFAF7",
            borderRadius: `${rpx(48)} ${rpx(48)} 0 0`,
            padding: `${rpx(48)} ${rpx(40)} ${
              hasProgress ? rpx(360) : rpx(300)
            }`,
            boxShadow: "0 -10px 30px rgba(60,50,30,0.06)",
            minHeight: rpx(800),
          }}
        >
          {/* 十卷母本横滑 */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(36),
                  fontWeight: 600,
                  color: INK,
                  margin: 0,
                  letterSpacing: rpx(3),
                }}
              >
                十卷母本
              </h2>
              <p
                style={{
                  fontSize: rpx(22),
                  color: SUB,
                  margin: `${rpx(8)} 0 0`,
                }}
              >
                回到源头，系统理解感知的十个维度
              </p>
            </div>
            <button
              onClick={onOpenShelf}
              style={{
                background: "transparent",
                border: "none",
                color: GOLD,
                fontSize: rpx(22),
                display: "flex",
                alignItems: "center",
                gap: rpx(4),
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              查看全部
              <ChevronRight size={16} color={GOLD} strokeWidth={1.8} />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: rpx(20),
              overflowX: "auto",
              marginTop: rpx(24),
              paddingBottom: rpx(8),
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {V2_VOLUMES.map((vol) => (
              <div
                key={vol.id}
                onClick={() => onOpenVolume?.(vol.id)}
                style={{
                  flexShrink: 0,
                  width: rpx(184),
                  scrollSnapAlign: "start",
                  cursor: "pointer",
                }}
              >
                <VolumeBookCover
                  volumeNumber={vol.volumeNumber}
                  volumeCn={VOLUME_CN[vol.volumeNumber - 1]}
                  subtitle={vol.subtitle}
                />
                <p
                  style={{
                    fontSize: rpx(18),
                    color: GOLD,
                    margin: `${rpx(14)} 0 0`,
                    textAlign: "center",
                    letterSpacing: rpx(1),
                  }}
                >
                  卷{VOLUME_CN[vol.volumeNumber - 1]}
                </p>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(22),
                    color: INK,
                    margin: `${rpx(4)} 0 0`,
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {vol.title}
                </p>
              </div>
            ))}
            <HandbookPlaceholderCard
              width={rpx(184)}
              height={rpx(248)}
              fixedHeight
              containerStyle={{
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            />
          </div>

          {/* 阅读陪伴（标题+副标题，左右两卡带背景图） */}
          <div style={{ marginTop: rpx(56) }}>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(36),
                fontWeight: 600,
                color: INK,
                margin: 0,
                letterSpacing: rpx(3),
              }}
            >
              阅读陪伴
            </h2>
            <p
              style={{ fontSize: rpx(22), color: SUB, margin: `${rpx(8)} 0 0` }}
            >
              在阅读路上，陪你走得更稳更远
            </p>
            <div style={{ display: "flex", gap: rpx(20), marginTop: rpx(28) }}>
              {/* 手册导读（即将开放·液态玻璃·偏冷银灰） */}
              <div
                onClick={() => setShowGuideNote(true)}
                style={{
                  flex: 1,
                  height: rpx(176),
                  borderRadius: rpx(28),
                  ...LIQUID_GLASS,
                  background:
                    "linear-gradient(135deg, rgba(199,205,211,0.55), rgba(216,212,203,0.32))",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: rpx(12),
                  padding: `${rpx(26)} ${rpx(26)}`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: rpx(14),
                    right: rpx(14),
                    fontSize: rpx(15),
                    color: "#6E6A62",
                    background: "rgba(255,255,255,0.5)",
                    padding: `${rpx(3)} ${rpx(10)}`,
                    borderRadius: rpx(16),
                    display: "flex",
                    alignItems: "center",
                    gap: rpx(4),
                  }}
                >
                  <Lock size={11} strokeWidth={2} /> 即将开放
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(30),
                      fontWeight: 600,
                      color: "#56616B",
                      margin: `0 0 ${rpx(10)}`,
                      textShadow: TEXT_ENGRAVED,
                    }}
                  >
                    手册导读
                  </p>
                  <p
                    style={{
                      fontSize: rpx(18),
                      color: "#828791",
                      margin: 0,
                      lineHeight: 1.5,
                      textShadow: TEXT_ENGRAVED_SOFT,
                    }}
                  >
                    专业卷导读内容，帮助你更好地理解与运用
                  </p>
                </div>
                <GuideIcon />
              </div>

              {/* 读后练习（液态玻璃·偏暖） */}
              <div
                onClick={handlePractice}
                style={{
                  flex: 1,
                  height: rpx(176),
                  borderRadius: rpx(28),
                  ...LIQUID_GLASS,
                  background:
                    "linear-gradient(135deg, rgba(232,216,189,0.5), rgba(215,197,161,0.3))",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: rpx(12),
                  padding: `${rpx(26)} ${rpx(26)}`,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(30),
                      fontWeight: 600,
                      color: "#5A4F3C",
                      margin: `0 0 ${rpx(10)}`,
                      textShadow: TEXT_ENGRAVED,
                    }}
                  >
                    读后练习
                  </p>
                  <p
                    style={{
                      fontSize: rpx(18),
                      color: "#8C7F66",
                      margin: 0,
                      lineHeight: 1.5,
                      textShadow: TEXT_ENGRAVED_SOFT,
                    }}
                  >
                    每卷配套练习，让理解内化为行动
                  </p>
                </div>
                <PracticeIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
        底部固定坞：仅「继续阅读」。
        与底部导航同步升降：刚进入/上滑时显示，向下滚动时连同导航一起柔和滑出视口，
        避免长内容（如「阅读陪伴」）被固定坞遮挡而无法继续浏览（见 BottomNavContext）。
      */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: navDock.present ? navDock.height : "0px",
          zIndex: 40,
          background: "#FBFAF7",
          boxShadow: "0 -8px 24px rgba(60,50,30,0.10)",
          padding: `${rpx(20)} ${rpx(40)} ${
            navDock.present
              ? rpx(18)
              : `calc(env(safe-area-inset-bottom) + ${rpx(18)})`
          }`,
          transform: navDock.hidden
            ? `translateY(calc(100% + ${navDock.height}))`
            : "translateY(0)",
          opacity: navDock.hidden ? 0 : 1,
          transition:
            "transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
          pointerEvents: navDock.hidden ? "none" : "auto",
        }}
      >
        {/* 顶部柔和渐隐：让上方滚动内容（如「阅读陪伴」）在触达坞之前先淡出，
            从视觉上把固定坞与上方内容明确分开，避免「阅读陪伴」被误读为坞的标题 */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: rpx(-48),
            height: rpx(48),
            background:
              "linear-gradient(to top, #FBFAF7 20%, rgba(251,250,247,0))",
            pointerEvents: "none",
          }}
        />
        {dockVolume && dockChapter && (
          <>
            {!isNewUser && (
              <p
                style={{
                  fontSize: rpx(18),
                  color: SUB,
                  margin: `0 0 ${rpx(10)} ${rpx(4)}`,
                  letterSpacing: rpx(1),
                }}
              >
                {nextVolume ? "开启下一卷" : "你的上次阅读进度"}
              </p>
            )}
            <div
              onClick={() => onContinueReading?.(dockVolume.id, dockChapter.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(20),
                padding: rpx(18),
                background:
                  "linear-gradient(135deg, rgba(184,151,90,0.1), rgba(184,151,90,0.04))",
                border: "1.5px solid rgba(233,216,166,0.6)",
                borderRadius: rpx(24),
                cursor: "pointer",
              }}
            >
              {/* 封面缩略（黑书风格小封面） */}
              <div style={{ width: rpx(84), flexShrink: 0 }}>
                <VolumeBookCover
                  volumeNumber={dockVolume.volumeNumber}
                  volumeCn={VOLUME_CN[dockVolume.volumeNumber - 1]}
                  height={rpx(112)}
                  compact
                />
              </div>
              {/* 标题 + 副标题 + 进度条 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(28),
                    fontWeight: 600,
                    color: INK,
                    margin: 0,
                    letterSpacing: rpx(1),
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  卷{VOLUME_CN[dockVolume.volumeNumber - 1]} {dockVolume.title}
                </p>
                <p
                  style={{
                    fontSize: rpx(20),
                    color: SUB,
                    margin: `${rpx(6)} 0 0`,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  第{dockChapter.index}章 · {dockChapter.title}
                </p>
                <div style={{ margin: `${rpx(16)} 0 0` }}>
                  <div
                    style={{
                      height: rpx(6),
                      background: "rgba(184,151,90,0.18)",
                      borderRadius: rpx(4),
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${dockPercent}%`,
                        height: "100%",
                        background: GOLD,
                        borderRadius: rpx(4),
                        transition: "width 0.18s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* 继续按钮 */}
              <div
                style={{ flexShrink: 0, width: "100px" }}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onContinueReading?.(dockVolume.id, dockChapter.id);
                }}
              >
                <PrimaryButton
                  title={
                    isNewUser ? "开始阅读" : nextVolume ? "开始" : "继续阅读"
                  }
                  // variant="filled"
                  style={{
                    padding: `${rpx(10)} ${rpx(20)}`,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
      <HandbookBookmarksSheet
        visible={showBookmarks}
        bookmarks={bookmarks}
        onClose={() => setShowBookmarks(false)}
        onNavigateToChapter={(volumeId, chapterId) =>
          onContinueReading?.(volumeId, chapterId)
        }
        onRemoveBookmark={(id) => {
          removeBookmark(id);
          toast.show("已删除收藏");
        }}
      />
      <ComingSoonSheet
        visible={showGuideNote}
        onClose={() => setShowGuideNote(false)}
        title="手册导读"
        phase="第二阶段开放"
        message="手册导读会在这套书与练习稳稳落地之后再上线——它将基于十卷母本，陪你把读到的东西照见、内化。先慢慢读，不急。"
      />
    </div>
  );
}

/**
 * GuideIcon - 手册导读图标（代码绘制·偏冷银灰，呼应左卡渐变）
 * 书签丝带 + 两行示意文字，寓意「导读 / 指引阅读路径」，区别于底部菜单。
 */
function GuideIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      style={{
        width: rpx(60),
        height: rpx(60),
        flexShrink: 0,
        filter: ICON_ENGRAVED,
      }}
      fill="none"
    >
      <defs>
        <linearGradient id="hbGuide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C6CCD2" />
          <stop offset="1" stopColor="#8B949D" />
        </linearGradient>
      </defs>
      <path
        d="M16 9 h16 a3 3 0 0 1 3 3 v28 l-11 -7 -11 7 v-28 a3 3 0 0 1 3 -3 z"
        fill="url(#hbGuide)"
      />
      <line
        x1="20"
        y1="18"
        x2="28"
        y2="18"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="24"
        x2="28"
        y2="24"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * PracticeIcon - 读后练习图标（代码绘制·偏暖金，呼应右卡渐变）
 * 圆形印记徽章 + 内放射光点，寓意「练习 / 内化印记」，区别于底部菜单。
 */
function PracticeIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      style={{
        width: rpx(60),
        height: rpx(60),
        flexShrink: 0,
        filter: ICON_ENGRAVED,
      }}
      fill="none"
    >
      <defs>
        <linearGradient id="hbPractice" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DCC089" />
          <stop offset="1" stopColor="#B6924F" />
        </linearGradient>
      </defs>
      <circle
        cx="24"
        cy="24"
        r="15"
        stroke="url(#hbPractice)"
        strokeWidth="2.4"
      />
      <circle
        cx="24"
        cy="24"
        r="9"
        stroke="rgba(182,146,79,0.55)"
        strokeWidth="1.4"
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={24 + Math.cos(a) * 9}
            y1={24 + Math.sin(a) * 9}
            x2={24 + Math.cos(a) * 14}
            y2={24 + Math.sin(a) * 14}
            stroke="url(#hbPractice)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="24" cy="24" r="2.6" fill="url(#hbPractice)" />
    </svg>
  );
}
