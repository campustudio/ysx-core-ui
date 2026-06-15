/**
 * HandbookHome - 人类手册馆 · 首页（图3）
 *
 * 先稳住再导读：三大入口 + 十卷横滑 + 阅读陪伴 + 继续阅读 + 进入完整书架。
 * 风格：简约为底（沿用现有克制基调），柔金少量点缀；背景图先用现有图占位。
 */

import { useState, useCallback, useEffect } from "react";
import {
  ChevronRight,
  Lock,
  Book,
  Map,
  Bookmark,
  Search,
  Sparkles,
  MoveHorizontal,
  RotateCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  V2_VOLUMES,
  VOLUME_CN,
  getV2VolumeById,
  getV2Chapter,
  getVolumeProgressPercent,
  TODAY_PASSAGE,
  VOLUME_COVER_PLACEHOLDER,
} from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  rpx,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  ICON_ENGRAVED,
  HANDBOOK_BG,
  SUGGEST_CHIP,
} from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { VolumeGlassCover } from "../components/shared/VolumeGlassCover";
import { HandbookPlaceholderCard } from "../components/shared/HandbookPlaceholderCard";
import { useToast } from "../hooks/useToast";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { useReadingPath } from "../hooks/useReadingPath";
import { HandbookBookmarksSheet } from "../components/shared/HandbookBookmarksSheet";
import { useDailyFavorites } from "../hooks/useDailyActions";
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
  onOpenMyPath?: () => void;
  onOpenSearch?: (query?: string) => void;
  onNavChange?: (index: number) => void;
}

/**
 * 两大入口（图标统一 lucide，遵循简约原则）。
 * 「今日一段」已抽出为首页顶部单独大卡（见 DailyHeroCard），此处只保留系统阅读与生成路径。
 */
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
    title: "系统阅读十卷母本",
    desc: "从第一卷开始，完整理解人类与感知",
  },
  {
    id: "entry",
    icon: Map,
    iconImg: null,
    title: "生成我的阅读路径",
    desc: "根据你此刻状态，找到最适合的入口",
  },
];

/**
 * 读后练习（简版）首页大卡的三步预览。
 * 内容**以现有 `HandbookPractice` 页为准**：思考一问 / 1 分钟自照练习 / 写下自照。
 * 首页仅作「大致体现里面有什么」的预览（不在此输入、不放序号/图标），
 * 点击整卡进入现有完整练习流程去操作。
 */
const PRACTICE_STEPS: { title: string; hint: string }[] = [
  { title: "思考一问", hint: "带一个问题回看" },
  { title: "1 分钟自照练习", hint: "跟着引导做一次" },
  { title: "写下自照", hint: "留下真实的一句" },
];

/**
 * 快捷提问胶囊池（3组，每组3个，点击右侧刷新按钮循环切换）
 */
const SUGGESTION_POOL = [
  "我很焦虑怎么办",
  "感知是什么",
  "从哪里开始读",
  "什么是元感知",
  "亲密关系很痛苦",
  "如何面对死亡",
  "怎么开始练习",
  "总是分心怎么办",
  "写下自照有什么用",
];

export function HandbookHome({
  onOpenShelf,
  onOpenReadingEntry,
  onOpenDaily,
  onOpenVolume,
  onOpenPractice,
  onContinueReading,
  onOpenMyPath,
  onOpenSearch,
}: HandbookHomeProps) {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showGuideNote, setShowGuideNote] = useState(false);
  const toast = useToast();
  const navDock = useBottomNav();
  const { lastProgress, hasProgress, bookmarks, removeBookmark } =
    useReadingProgress();
  const { favorites: favPassages, removeFavorite, reload: reloadFavorites } =
    useDailyFavorites();
  const { hasPath } = useReadingPath();

  // 快捷提问胶囊换一换逻辑
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  // 累加式旋转角度：每次点击 +360，始终顺时针前进、绝不反向回退
  const [refreshSpin, setRefreshSpin] = useState(0);
  // 胶囊淡入淡出可见态：换组时先淡出旧的、再淡入新的，符合平台柔和气质
  const [chipsVisible, setChipsVisible] = useState(true);

  const handleRefreshSuggestions = useCallback(() => {
    setRefreshSpin((prev) => prev + 360);
    // 先柔和淡出，待旧胶囊隐去后切换内容并淡入新胶囊
    setChipsVisible(false);
    setTimeout(() => {
      setSuggestionIndex((prev) => (prev + 1) % 3);
      setChipsVisible(true);
    }, 560);
  }, []);

  const visibleSuggestions = SUGGESTION_POOL.slice(
    suggestionIndex * 3,
    (suggestionIndex + 1) * 3
  );

  // 横滑指示条比例
  const [scrollRatio, setScrollRatio] = useState(0);

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

  // 首页练习区显示规则（§2.6）：有进度 → 指向「上次所读章节」的读后练习入口；
  // 无进度 → 轻引导（不强行塞输入框到首页）。简版始终开放，不置灰。
  const lastReadChapter =
    hasProgress && lastProgress
      ? getV2Chapter(lastProgress.volumeId, lastProgress.chapterId)
      : null;
  const practiceHint = lastReadChapter
    ? `为「第${lastReadChapter.index}章」做一次读后练习`
    : "先读一节，再回来做一次读后练习";

  // 今日一段大卡数据：当日日期（月/日 + 星期）+ 当日引文 + 出处卷名
  const dailyVolume = getV2VolumeById(TODAY_PASSAGE.volumeId);
  const dailyVolumeCn = dailyVolume
    ? VOLUME_CN[dailyVolume.volumeNumber - 1]
    : "一";
  const today = new Date();
  const dailyMonth = String(today.getMonth() + 1).padStart(2, "0");
  const dailyDay = String(today.getDate()).padStart(2, "0");
  const dailyWeekday = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ][today.getDay()];

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
            onClick={() => {
              reloadFavorites();
              setShowBookmarks(true);
            }}
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
            <Bookmark
              size={20}
              color={GOLD}
              strokeWidth={1.5}
              style={{ filter: ICON_ENGRAVED }}
            />
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

        {/* 搜索 / 问手册：统一入口（可见可点，进入结果页骨架；语义检索后端分阶段接入） */}
        <div style={{ padding: `${rpx(44)} ${rpx(40)} 0` }}>
          <button
            onClick={() => onOpenSearch?.()}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: rpx(16),
              height: rpx(84),
              padding: `0 ${rpx(14)} 0 ${rpx(28)}`,
              borderRadius: rpx(42),
              // 通透玻璃药丸：更亮的珠光白 + 极淡、柔和的高光边（弱化硬质白色边缘）
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 100%)",
              backdropFilter: "blur(14px) saturate(1.4)",
              WebkitBackdropFilter: "blur(14px) saturate(1.4)",
              border: "1px solid rgba(255,255,255,0.45)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1.5px 3px rgba(150,125,75,0.06), 0 3px 10px rgba(60,50,30,0.05)",
              cursor: "pointer",
            }}
          >
            <Search
              size={19}
              color={GOLD}
              strokeWidth={2}
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                flex: 1,
                minWidth: 0,
                textAlign: "left",
                fontSize: rpx(27),
                color: "#7B7264",
                fontFamily: FONT_SERIF,
                letterSpacing: rpx(1),
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              搜索 / 问手册
            </span>
            {/* 龙珠外圈柔和渐变发光环：提供从内到外的渐变淡化、光感与层次感 */}
            <span
              aria-hidden
              style={{
                position: "relative",
                flexShrink: 0,
                width: rpx(62),
                height: rpx(62),
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
            >
              {/* 金色宝珠 ✦：立体高光 + 微凸星标，明确「问 AI 伴读」入口 */}
              <span
                style={{
                  position: "relative",
                  width: rpx(52),
                  height: rpx(52),
                  borderRadius: "50%",
                  // 通透金宝珠：更亮高光中心 + 清晰边缘（亮描边 + 0.5px 内环），收紧外影避免糊边
                  background:
                    "radial-gradient(circle at 32% 25%, #FFFBF0 0%, #F5DFAC 28%, #D4B069 60%, #9E7A35 100%)",
                  boxShadow:
                    "inset 0 1.5px 2px rgba(255,255,255,0.95), inset 0 -2px 4px rgba(90,65,25,0.45), 0 1.5px 3px rgba(130,100,45,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* 镜面高光点：增强通透/透亮的立体感 */}
                <span
                  style={{
                    position: "absolute",
                    top: "14%",
                    left: "20%",
                    width: "34%",
                    height: "30%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 72%)",
                  }}
                />
                <Sparkles
                  size={16}
                  color="#FFF7E6"
                  strokeWidth={1.6}
                  style={{
                    position: "relative",
                    // 金色宝珠上的「刻进去」效果：顶部暗压 + 底部微亮，使星标像凹刻进金面
                    filter:
                      "drop-shadow(0 -1px 1px rgba(110,80,30,0.6)) drop-shadow(0 1px 1px rgba(255,250,235,0.55))",
                  }}
                />
              </span>
            </span>
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: rpx(16),
              marginTop: rpx(20),
              width: "100%",
            }}
          >
            {/* 优雅单行横滑容器：通过横滑（不换行）完美解决多行高度过高的问题，同时用 mask-image 制造右侧渐变淡出，暗示可继续滑动 */}
            <div
              className="no-scrollbar"
              style={{
                display: "flex",
                gap: rpx(14),
                flex: 1,
                overflowX: "auto",
                whiteSpace: "nowrap",
                WebkitOverflowScrolling: "touch",
                paddingBottom: rpx(6), // 预留一点微弱投影空间
                WebkitMaskImage: "linear-gradient(to right, #000 0%, #000 82%, transparent 100%)",
                // 换组时柔和淡入淡出，呼应平台「柔和、柔软」的整体气质
                opacity: chipsVisible ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            >
              {visibleSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => onOpenSearch?.(s)}
                  style={{
                    ...SUGGEST_CHIP,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* 旋转刷新按钮：采用精致圆形液态玻璃效果，弱化生硬白边，增强立体过渡感 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefreshSuggestions();
              }}
              aria-label="换一换"
              style={{
                // 用径向渐变玻璃底（从内向外逐渐淡化），保证整圆完整可见、不会出现某侧边缘像缺了一块
                background:
                  "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.42) 62%, rgba(255,255,255,0.32) 100%)",
                backdropFilter: "blur(10px) saturate(1.15)",
                WebkitBackdropFilter: "blur(10px) saturate(1.15)",
                // 彻底去除生硬的 1px border，改用多层渐变内阴影（类似龙珠）来实现边缘的自然淡化与过渡；
                // 末尾加一道极淡的外缘发丝线，柔和地勾勒完整圆形轮廓（不刺眼、无硬白边）
                border: "none",
                boxShadow:
                  "inset 0 2.5px 3px rgba(255,255,255,0.85), inset 0 -2.5px 3.5px rgba(110,95,65,0.15), inset 0 0 0 0.75px rgba(255,255,255,0.35), 0 3px 8px rgba(70,55,30,0.05), 0 0 0 0.5px rgba(120,105,70,0.07)",
                cursor: "pointer",
                width: rpx(54),
                height: rpx(54),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                color: "rgba(184,151,90,0.8)",
                flexShrink: 0,
                transition:
                  "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
                transform: `rotate(${refreshSpin}deg)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#B8975A";
                e.currentTarget.style.background =
                  "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.58) 62%, rgba(255,255,255,0.45) 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(184,151,90,0.8)";
                e.currentTarget.style.background =
                  "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.42) 62%, rgba(255,255,255,0.32) 100%)";
              }}
            >
              <RotateCw size={15} strokeWidth={2} style={{ filter: ICON_ENGRAVED }} />
            </button>
          </div>
        </div>

        {/* 今日一段 · 当日核心大卡（整卡可点；入口用极简文字链而非按钮）
            配色与其他液态玻璃一致：不另加暖黄底色，玻璃通透感由页面背景透出。 */}
        <div style={{ padding: `${rpx(40)} ${rpx(40)} 0` }}>
          <div
            onClick={() => onOpenDaily?.()}
            style={{
              ...LIQUID_GLASS,
              position: "relative",
              overflow: "hidden",
              borderRadius: rpx(32),
              padding: `${rpx(28)} ${rpx(34)} ${rpx(26)}`,
              cursor: "pointer",
            }}
          >
            <OrbitGlow />
            <div style={{ position: "relative", maxWidth: "74%" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: rpx(10) }}
              >
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(28),
                    fontWeight: 600,
                    color: "#6B5526",
                    letterSpacing: rpx(2),
                    textShadow: TEXT_ENGRAVED,
                  }}
                >
                  今日一段
                </span>
                <Sparkles
                  size={15}
                  color={GOLD}
                  strokeWidth={1.6}
                  style={{ filter: ICON_ENGRAVED }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: rpx(14),
                  margin: `${rpx(14)} 0 0`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(46),
                    fontWeight: 600,
                    color: INK,
                    letterSpacing: rpx(2),
                    textShadow: TEXT_ENGRAVED,
                  }}
                >
                  {dailyMonth} / {dailyDay}
                </span>
                <span
                  style={{
                    fontSize: rpx(21),
                    color: SUB,
                    textShadow: TEXT_ENGRAVED_SOFT,
                  }}
                >
                  {dailyWeekday}
                </span>
              </div>

              <p
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(26),
                  lineHeight: 1.6,
                  color: "#33302A",
                  margin: `${rpx(14)} 0 0`,
                  textShadow: TEXT_ENGRAVED_SOFT,
                }}
              >
                {TODAY_PASSAGE.passage}
              </p>
              <p
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(20),
                  color: SUB,
                  margin: `${rpx(10)} 0 0`,
                  letterSpacing: rpx(1),
                }}
              >
                ——《人类手册 · 卷{dailyVolumeCn}》
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: rpx(6),
                  margin: `${rpx(18)} 0 0`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(23),
                    color: GOLD,
                    letterSpacing: rpx(1),
                  }}
                >
                  进入今日一段
                </span>
                <ChevronRight size={15} color={GOLD} strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* 两大入口（系统阅读 / 生成路径）：横向卡片，图标在左、文案在右 */}
        <div
          style={{
            display: "flex",
            gap: rpx(20),
            padding: `${rpx(28)} ${rpx(40)} 0`,
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
                  padding: `${rpx(28)} ${rpx(26)}`,
                  display: "flex",
                  alignItems: "center",
                  gap: rpx(18),
                  textAlign: "left",
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
                    width: rpx(48),
                    height: rpx(48),
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {Icon && (
                    <Icon
                      size={24}
                      strokeWidth={1.4}
                      color={GOLD}
                      style={{
                        filter:
                          "drop-shadow(0px 1.5px 1.5px rgba(255,255,255,1)) drop-shadow(0px -1.5px 1.5px rgba(0,0,0,0.15))",
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(26),
                      fontWeight: 700,
                      color: "#23201A",
                      margin: 0,
                      letterSpacing: rpx(1),
                      lineHeight: 1.35,
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
                      margin: `${rpx(8)} 0 0`,
                      textShadow:
                        "0px 1.5px 1.5px rgba(255,255,255,0.9), 0px -1px 1.5px rgba(0,0,0,0.12)",
                      lineHeight: 1.45,
                    }}
                  >
                    {e.desc}
                  </p>
                </div>
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
            onScroll={(e) => {
              const target = e.currentTarget;
              const maxScroll = target.scrollWidth - target.clientWidth;
              if (maxScroll > 0) {
                setScrollRatio(target.scrollLeft / maxScroll);
              }
            }}
            style={{
              display: "flex",
              gap: rpx(20),
              overflowX: "auto",
              marginTop: rpx(24),
              // 横滑容器 overflow-x:auto 会令 overflow-y 也变 auto，从而裁切封面投影；
              // 预留足够的上下内边距，让柔和的接触阴影完整显示而不被硬裁成矩形
              paddingTop: rpx(6),
              paddingBottom: rpx(40),
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
                {/* 通透水晶玻璃封面（卷号/徽记/卷名均在封面内，呼应参考图） */}
                <VolumeGlassCover
                  volumeNumber={vol.volumeNumber}
                  volumeCn={VOLUME_CN[vol.volumeNumber - 1]}
                  title={vol.title}
                  subtitle={vol.subtitle}
                  height={rpx(290)}
                  imageUrl={vol.cover !== VOLUME_COVER_PLACEHOLDER ? vol.cover : undefined}
                />
              </div>
            ))}
            <HandbookPlaceholderCard
              width={rpx(184)}
              height={rpx(290)}
              fixedHeight
              containerStyle={{
                flexShrink: 0,
                scrollSnapAlign: "start",
              }}
            />
          </div>

          {/* 极简横滑指示条：替代多余的文字提示，用现代高档的滑动轨迹，优雅提示可左右滑动 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: rpx(4),
              paddingBottom: rpx(24),
            }}
          >
            <div
              style={{
                position: "relative",
                width: rpx(72),
                height: rpx(3),
                borderRadius: rpx(1.5),
                background: "rgba(184,151,90,0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: rpx(24),
                  height: "100%",
                  borderRadius: rpx(1.5),
                  background: "rgba(184,151,90,0.65)",
                  transform: `translateX(calc(${scrollRatio} * ${rpx(72 - 24)}))`,
                  transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              />
            </div>
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
            {/* 读后练习（简版）· 整行大卡：与小卡相比，仅多「把页内三步大致显出来」。
                配色同其他液态玻璃（不另加暖色底）；不放输入框/序号/逐格图标，保持简约。 */}
            <div
              onClick={handlePractice}
              style={{
                ...LIQUID_GLASS,
                marginTop: rpx(28),
                position: "relative",
                overflow: "hidden",
                borderRadius: rpx(28),
                padding: `${rpx(26)} ${rpx(28)} ${rpx(24)}`,
                cursor: "pointer",
              }}
            >
              {/* 头部：标题 + 已开放标识 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: rpx(12),
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: rpx(10) }}
                >
                  <PracticeIcon />
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(30),
                      fontWeight: 600,
                      color: "#5A4F3C",
                      letterSpacing: rpx(1),
                      textShadow: TEXT_ENGRAVED,
                    }}
                  >
                    读后练习（简版）
                  </span>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: rpx(16),
                    color: "#7A5E2E",
                    background: "rgba(255,255,255,0.45)",
                    padding: `${rpx(3)} ${rpx(12)}`,
                    borderRadius: rpx(16),
                    whiteSpace: "nowrap",
                    textShadow: TEXT_ENGRAVED_SOFT,
                  }}
                >
                  已开放 · 简版
                </span>
              </div>

              {/* 三步预览：仅「思考一问 / 1分钟自照练习 / 写下自照」三个名称 + 一句轻提示，
                  以连接符示意顺序，不放输入框。点击整卡进入完整练习去操作。 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: rpx(8),
                  margin: `${rpx(20)} 0 0`,
                }}
              >
                {PRACTICE_STEPS.map((s, i) => (
                  <div
                    key={s.title}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                      <p
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(23),
                          fontWeight: 600,
                          color: "#3A352C",
                          margin: 0,
                          letterSpacing: rpx(0.5),
                          whiteSpace: "nowrap",
                          textShadow: TEXT_ENGRAVED_SOFT,
                        }}
                      >
                        {s.title}
                      </p>
                      <p
                        style={{
                          fontSize: rpx(16),
                          color: "#9A9078",
                          margin: `${rpx(6)} 0 0`,
                          lineHeight: 1.4,
                        }}
                      >
                        {s.hint}
                      </p>
                    </div>
                    {i < PRACTICE_STEPS.length - 1 && (
                      <ChevronRight
                        size={14}
                        color="rgba(184,151,90,0.55)"
                        strokeWidth={2}
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 底部：状态/进度文案 + 极简入口（文字链 + 箭头，非按钮） */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: rpx(16),
                  margin: `${rpx(22)} 0 0`,
                }}
              >
                <span style={{ fontSize: rpx(17), color: "#9A9078" }}>
                  {practiceHint}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: rpx(6),
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(23),
                    color: GOLD,
                    letterSpacing: rpx(1),
                    whiteSpace: "nowrap",
                  }}
                >
                  开始练习
                  <ChevronRight size={15} color={GOLD} strokeWidth={2} />
                </span>
              </div>
            </div>

            {/* 手册导读（即将开放·保留）：纤细整行卡，配色同其他液态玻璃（不另加银灰底色） */}
            <div
              onClick={() => setShowGuideNote(true)}
              style={{
                ...LIQUID_GLASS,
                marginTop: rpx(20),
                position: "relative",
                overflow: "hidden",
                borderRadius: rpx(28),
                padding: `${rpx(22)} ${rpx(28)}`,
                display: "flex",
                alignItems: "center",
                gap: rpx(16),
                cursor: "pointer",
              }}
            >
              <GuideIcon />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(26),
                    fontWeight: 600,
                    color: "#56616B",
                    margin: 0,
                    textShadow: TEXT_ENGRAVED,
                  }}
                >
                  手册导读
                </p>
                <p
                  style={{
                    fontSize: rpx(17),
                    color: "#828791",
                    margin: `${rpx(6)} 0 0`,
                    lineHeight: 1.4,
                    textShadow: TEXT_ENGRAVED_SOFT,
                  }}
                >
                  专业卷导读内容，帮助你更好地理解与运用
                </p>
              </div>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: rpx(15),
                  color: "#6E6A62",
                  background: "rgba(255,255,255,0.45)",
                  padding: `${rpx(3)} ${rpx(10)}`,
                  borderRadius: rpx(16),
                  display: "flex",
                  alignItems: "center",
                  gap: rpx(4),
                }}
              >
                <Lock size={11} strokeWidth={2} /> 即将开放
              </span>
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
          background: "rgba(251,250,247,0.72)",
          backdropFilter: "blur(20px) saturate(1.2)",
          WebkitBackdropFilter: "blur(20px) saturate(1.2)",
          boxShadow: "0 -8px 24px rgba(60,50,30,0.08)",
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
            {(!isNewUser || hasPath) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: rpx(16),
                  margin: `0 0 ${rpx(10)}`,
                  padding: `0 ${rpx(4)}`,
                }}
              >
                <span
                  style={{
                    fontSize: rpx(18),
                    color: SUB,
                    letterSpacing: rpx(1),
                  }}
                >
                  {!isNewUser
                    ? nextVolume
                      ? "开启下一卷"
                      : "你的上次阅读进度"
                    : ""}
                </span>
                {hasPath && (
                  <button
                    onClick={onOpenMyPath}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: rpx(4),
                      fontSize: rpx(20),
                      color: GOLD,
                      fontFamily: FONT_SERIF,
                      letterSpacing: rpx(1),
                    }}
                  >
                    我的路径
                    <ChevronRight size={14} color={GOLD} strokeWidth={1.8} />
                  </button>
                )}
              </div>
            )}
            <div
              onClick={() => onContinueReading?.(dockVolume.id, dockChapter.id)}
              style={{
                ...LIQUID_GLASS,
                display: "flex",
                alignItems: "center",
                gap: rpx(20),
                padding: rpx(18),
                borderRadius: rpx(24),
                cursor: "pointer",
              }}
            >
              {/* 封面缩略（通透水晶玻璃小封面） */}
              <div style={{ width: rpx(84), flexShrink: 0 }}>
                <VolumeGlassCover
                  volumeNumber={dockVolume.volumeNumber}
                  volumeCn={VOLUME_CN[dockVolume.volumeNumber - 1]}
                  height={rpx(112)}
                  compact
                  imageUrl={dockVolume.cover !== VOLUME_COVER_PLACEHOLDER ? dockVolume.cover : undefined}
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
        passages={favPassages}
        onClose={() => setShowBookmarks(false)}
        onNavigateToChapter={(volumeId, chapterId) =>
          onContinueReading?.(volumeId, chapterId)
        }
        onRemoveBookmark={(id) => {
          removeBookmark(id);
          toast.show("已删除收藏");
        }}
        onRemovePassage={(id) => {
          removeFavorite(id);
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
 * OrbitGlow - 今日一段大卡右侧轨道/星点装饰（代码绘制·柔金低透明度）
 * 同心轨道 + 一枚发光的「日」与一颗轨道星点，呼应「回到感知」的日常节律；纯装饰、不抢正文。
 */
function OrbitGlow() {
  return (
    <svg
      viewBox="0 0 240 200"
      aria-hidden
      style={{
        position: "absolute",
        right: rpx(-24),
        top: "50%",
        transform: "translateY(-50%)",
        width: rpx(340),
        height: rpx(284),
        pointerEvents: "none",
        opacity: 0.92,
      }}
      fill="none"
    >
      <defs>
        {/* 柔和日晕：白→金→透明，营造发光的「太阳金圈」光感 */}
        <radialGradient id="hbSunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,252,238,0.95)" />
          <stop offset="35%" stopColor="rgba(255,236,180,0.5)" />
          <stop offset="100%" stopColor="rgba(255,224,150,0)" />
        </radialGradient>
        {/* 轨道金环：两端淡、中段亮，模拟一道掠过的金色光弧 */}
        <linearGradient id="hbRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(212,178,108,0)" />
          <stop offset="0.5" stopColor="rgba(201,167,99,0.7)" />
          <stop offset="1" stopColor="rgba(212,178,108,0)" />
        </linearGradient>
      </defs>

      {/* 日晕 */}
      <circle cx="152" cy="96" r="82" fill="url(#hbSunCore)" />

      {/* 同心金色轨道环 */}
      {[70, 54, 38].map((r, i) => (
        <circle
          key={i}
          cx="152"
          cy="96"
          r={r}
          stroke="url(#hbRing)"
          strokeWidth="1.1"
          opacity={0.5 + i * 0.12}
        />
      ))}

      {/* 太阳本体：金核 + 高光 */}
      <circle cx="152" cy="96" r="11" fill="rgba(214,176,100,0.9)" />
      <circle cx="152" cy="96" r="5" fill="rgba(255,246,216,0.95)" />

      {/* 轨道星点 */}
      <circle cx="222" cy="96" r="3.4" fill="rgba(201,167,99,0.8)" />
      <circle cx="152" cy="26" r="2.6" fill="rgba(201,167,99,0.6)" />
      <circle cx="98" cy="120" r="2" fill="rgba(201,167,99,0.5)" />

      {/* 隐约的山水金线（极淡，点到为止） */}
      <path
        d="M64 152 Q116 130 168 148 T240 142"
        stroke="rgba(201,167,99,0.26)"
        strokeWidth="1"
      />
      <path
        d="M64 164 Q128 152 192 162 T240 158"
        stroke="rgba(201,167,99,0.16)"
        strokeWidth="1"
      />
    </svg>
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
