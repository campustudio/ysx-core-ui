/**
 * HandbookHome - 人类手册馆 · 首页（图3）
 *
 * 先稳住再导读：三大入口 + 十卷横滑 + 阅读陪伴 + 继续阅读 + 进入完整书架。
 * 风格：简约为底（沿用现有克制基调），柔金少量点缀；背景图先用现有图占位。
 */

import { useState, useCallback, useEffect } from "react";
import {
  ChevronRight,
  BookOpen,
  Compass,
  Sun,
  Sparkles,
  Lock,
  Library,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  V2_VOLUMES,
  VOLUME_CN,
  getV2VolumeById,
  getV2Chapter,
} from "../config/handbook-v2-data";
import { FONT_SERIF, rpx, LIQUID_GLASS } from "../config/styles";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { useNavigation } from "../hooks/useNavigation";
import { useReadingProgress } from "../hooks/useReadingProgress";
import bgLayer1 from "@/assets/images/home/1-menqian.webp";
import bgLayer2 from "@/assets/images/home/2-dingqi.webp";
import bgLayer3 from "@/assets/images/home/3-neidan.webp";
import iconBook from "@/assets/images/home/icon-book.webp";

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

/** 三大入口（图标：母本沿用现有 icon-book；入口/今日一段暂用 lucide 占位，待新图） */
const ENTRIES: {
  id: string;
  icon: LucideIcon | null;
  iconImg: string | null;
  title: string;
  desc: string;
}[] = [
  {
    id: "shelf",
    icon: null,
    iconImg: iconBook,
    title: "开始读十卷母本",
    desc: "从根本理解生命与感知的规律",
  },
  {
    id: "entry",
    icon: Compass,
    iconImg: null,
    title: "找到我的阅读入口",
    desc: "从当下感受出发，找到适合的路径",
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
  onNavChange,
}: HandbookHomeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const { isHidden } = useNavigation("handbook");
  const { lastProgress, hasProgress } = useReadingProgress();

  // 继续阅读详情（卷名/章名/进度百分比）
  const contVolume =
    hasProgress && lastProgress ? getV2VolumeById(lastProgress.volumeId) : null;
  const contChapter =
    hasProgress && lastProgress
      ? getV2Chapter(lastProgress.volumeId, lastProgress.chapterId)
      : null;
  const contPercent =
    contVolume && contChapter
      ? Math.round((contChapter.index / contVolume.chapters.length) * 100)
      : 0;

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

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 1) return;
      if (index === 3) {
        toast.show("「明镜」正在精心筹备中，敬请期待");
        return;
      }
      onNavChange?.(index);
    },
    [onNavChange, toast],
  );

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
        background: "#EEE7DA",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* 顶部背景图（沿用首页第一层·门前光感，渐隐融入白色承托层） */}
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
        {/* 标题区（居中） */}
        <div
          style={{
            padding: `calc(env(safe-area-inset-top) + ${rpx(72)}) ${rpx(48)} 0`,
            textAlign: "center",
          }}
        >
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

        {/* 三大入口（液态玻璃·三列，参照首页第三层质感） */}
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
                    height: rpx(56),
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
                        width: rpx(56),
                        height: rpx(56),
                        objectFit: "contain",
                        opacity: 0.55,
                      }}
                    />
                  ) : (
                    Icon && <Icon size={30} strokeWidth={1.4} color={GOLD} />
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
                  }}
                >
                  {e.title}
                </p>
                <p
                  style={{
                    fontSize: rpx(18),
                    color: "#6F665A",
                    margin: `${rpx(12)} 0 0`,
                    lineHeight: 1.5,
                  }}
                >
                  {e.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* 白色内容承托层 */}
        <div
          style={{
            marginTop: rpx(56),
            background: "#FBFAF7",
            borderRadius: `${rpx(48)} ${rpx(48)} 0 0`,
            padding: `${rpx(48)} ${rpx(40)} ${
              hasProgress ? rpx(540) : rpx(320)
            }`,
            boxShadow: "0 -10px 30px rgba(60,50,30,0.06)",
            minHeight: rpx(800),
          }}
        >
          {/* 十卷母本横滑（缩小卡片） */}
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
                <div
                  style={{
                    width: "100%",
                    height: rpx(248),
                    borderRadius: rpx(18),
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 6px 18px rgba(60,50,30,0.14)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${vol.cover})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, rgba(31,31,31,0.1) 0%, rgba(31,31,31,0.5) 100%)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: rpx(16),
                      left: rpx(16),
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(20),
                      color: "rgba(255,255,255,0.9)",
                      letterSpacing: rpx(2),
                    }}
                  >
                    第{VOLUME_CN[vol.volumeNumber - 1]}卷
                  </span>
                </div>
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
            <div style={{ display: "flex", gap: rpx(24), marginTop: rpx(28) }}>
              {/* 手册导读（即将开放·置灰，背景图占位） */}
              <div
                onClick={() => toast.show("「手册导读」即将开放，敬请期待")}
                style={{
                  flex: 1,
                  height: rpx(260),
                  borderRadius: rpx(32),
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${bgLayer3})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.25,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(247,245,240,0.78)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    padding: `${rpx(32)} ${rpx(28)}`,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: rpx(20),
                      right: rpx(20),
                      fontSize: rpx(16),
                      color: GOLD,
                      background: "rgba(184,151,90,0.14)",
                      padding: `${rpx(4)} ${rpx(12)}`,
                      borderRadius: rpx(16),
                      display: "flex",
                      alignItems: "center",
                      gap: rpx(4),
                    }}
                  >
                    <Lock size={11} strokeWidth={2} /> 即将开放
                  </span>
                  <Sparkles size={24} strokeWidth={1.5} color="#B8B4AA" />
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(30),
                      fontWeight: 600,
                      color: "#9A968C",
                      margin: `${rpx(20)} 0 ${rpx(8)}`,
                    }}
                  >
                    手册导读
                  </p>
                  <p
                    style={{
                      fontSize: rpx(20),
                      color: "#AEAAA0",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    专业卷导读内容，帮助你更好地理解与运用
                  </p>
                </div>
              </div>

              {/* 读后练习（背景图占位） */}
              <div
                onClick={handlePractice}
                style={{
                  flex: 1,
                  height: rpx(260),
                  borderRadius: rpx(32),
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  border: "1px solid rgba(184,151,90,0.18)",
                  boxShadow: "0 8px 24px rgba(60,50,30,0.06)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${bgLayer2})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.32,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,251,242,0.78))",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    padding: `${rpx(32)} ${rpx(28)}`,
                  }}
                >
                  <BookOpen size={24} strokeWidth={1.5} color={GOLD} />
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(30),
                      fontWeight: 600,
                      color: INK,
                      margin: `${rpx(20)} 0 ${rpx(8)}`,
                    }}
                  >
                    读后练习
                  </p>
                  <p
                    style={{
                      fontSize: rpx(20),
                      color: SUB,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    每段都配套练习，让理解内化为行动
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
        底部固定坞：继续阅读 + 进入完整书架
        始终固定在视口底部；随底部菜单显隐切换 bottom 偏移：
          - 菜单显示(isHidden=false)：上移到菜单上方，紧贴其顶部
          - 菜单隐藏(isHidden=true)：落到视口最底部
        仅过渡 bottom，避免文档流跳动。
      */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: isHidden
            ? 0
            : `calc(env(safe-area-inset-bottom) + ${rpx(94)})`,
          zIndex: 40,
          background: "#FBFAF7",
          boxShadow: "0 -8px 24px rgba(60,50,30,0.10)",
          padding: `${rpx(20)} ${rpx(40)} ${
            isHidden
              ? `calc(env(safe-area-inset-bottom) + ${rpx(18)})`
              : rpx(18)
          }`,
          transition: "bottom 0.3s ease-out",
        }}
      >
        {hasProgress && lastProgress && dockVolume && dockChapter && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: rpx(16),
                marginBottom: rpx(14),
              }}
            >
              <h2
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(30),
                  fontWeight: 600,
                  color: INK,
                  margin: 0,
                  letterSpacing: rpx(2),
                }}
              >
                继续阅读
              </h2>
              <span style={{ fontSize: rpx(20), color: SUB }}>
                {nextVolume ? "开启下一卷" : "你的上次阅读进度"}
              </span>
            </div>
            <div
              onClick={() => onContinueReading?.(dockVolume.id, dockChapter.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(20),
                padding: rpx(18),
                background:
                  "linear-gradient(135deg, rgba(184,151,90,0.1), rgba(184,151,90,0.04))",
                border: "1px solid rgba(184,151,90,0.18)",
                borderRadius: rpx(24),
                cursor: "pointer",
                marginBottom: rpx(16),
              }}
            >
              {/* 封面缩略 */}
              <div
                style={{
                  width: rpx(84),
                  height: rpx(112),
                  borderRadius: rpx(10),
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(60,50,30,0.16)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${dockVolume.cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(31,31,31,0.1), rgba(31,31,31,0.5))",
                  }}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: rpx(12),
                    margin: `${rpx(12)} 0 0`,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
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
                      }}
                    />
                  </div>
                  <span
                    style={{ fontSize: rpx(18), color: GOLD, flexShrink: 0 }}
                  >
                    已读 {dockPercent}%
                  </span>
                </div>
              </div>
              {/* 继续按钮 */}
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  onContinueReading?.(dockVolume.id, dockChapter.id);
                }}
                style={{
                  flexShrink: 0,
                  padding: `${rpx(16)} ${rpx(22)}`,
                  border: "none",
                  borderRadius: rpx(36),
                  background: "linear-gradient(135deg, #C9A961, #B8975A)",
                  color: "#fff",
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(22),
                  letterSpacing: rpx(1),
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(184,151,90,0.28)",
                }}
              >
                {nextVolume ? "开始" : "继续阅读"}
              </button>
            </div>
          </>
        )}

        {/* 进入完整书架（紧凑·图标左 + 文案右） */}
        <button
          onClick={onOpenShelf}
          style={{
            width: "100%",
            padding: `${rpx(16)} ${rpx(32)}`,
            border: "none",
            borderRadius: rpx(28),
            background: "linear-gradient(135deg, #D8C089, #C2A661)",
            boxShadow: "0 8px 22px rgba(184,151,90,0.28)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: rpx(18),
          }}
        >
          <Library size={26} color="#4A3D22" strokeWidth={1.6} />
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(28),
                fontWeight: 600,
                color: "#4A3D22",
                letterSpacing: rpx(2),
                lineHeight: 1.2,
              }}
            >
              进入完整书架
            </span>
            <span
              style={{
                fontSize: rpx(18),
                color: "rgba(74,61,34,0.7)",
                lineHeight: 1.2,
              }}
            >
              浏览全部书籍与资料
            </span>
          </span>
        </button>
      </div>

      <BottomNavigation
        active={1}
        onChange={handleNavChange}
        hidden={isHidden}
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
