/**
 * HandbookDaily - 今日一段（⑦）
 *
 * 每日微量滋养：原文（重心）+ 导读 + 自照 + 逐步练习 + 阅读原文。
 */

import { useState, useEffect } from "react";
import {
  Sun,
  Quote,
  Sparkles,
  BookOpen,
  Bookmark,
  Check,
  Share2,
} from "lucide-react";
import { TODAY_PASSAGE } from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  rpx,
  HANDBOOK_BG,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  ICON_ENGRAVED,
} from "../config/styles";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { PracticeContentBox } from "../components/shared/handbook/PracticeContentBox";
import { StepList } from "../components/shared/handbook/StepList";
import { PracticeSectionTitle } from "../components/shared/handbook/PracticeSectionTitle";
import { StaggerReveal } from "../components/shared/handbook/StaggerReveal";
import { HandbookBottomDock } from "../components/shared/handbook/HandbookBottomDock";
import { ShareQuoteSheet } from "../components/shared/handbook/ShareQuoteSheet";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { useDailyActions, formatPracticedDate } from "../hooks/useDailyActions";
import bgLayer1 from "@/assets/images/human-manual/home-top.webp";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookDailyProps {
  onBack?: () => void;
  onReadChapter?: (volumeId: string, chapterId: string) => void;
}

function todayLabel(): string {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function HandbookDaily({ onBack, onReadChapter }: HandbookDailyProps) {
  const [reveal, setReveal] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const t = TODAY_PASSAGE;
  const toast = useToast();
  const {
    favorited,
    toggleFavorite,
    isPracticed,
    practicedAt,
    togglePracticed,
  } = useDailyActions({
    passage: t.passage,
    volumeId: t.volumeId,
    chapterId: t.chapterId,
    volumeTitle: t.volumeTitle,
    chapterTitle: t.chapterTitle,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => setReveal(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleFavorite = () => {
    toggleFavorite();
    toast.show(favorited ? "已取消收藏" : "已留下这句话");
  };

  const handlePracticed = () => {
    togglePracticed();
    toast.show(isPracticed ? "已撤销练习记录" : "今天，我回来了一次");
  };

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
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: rpx(520),
          backgroundImage: `url(${bgLayer1})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.28,
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <HandbookHeader
        onBack={onBack}
        title="今日一段"
        subtitle="一天一段，滋养感知"
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(12)}) ${rpx(48)} calc(env(safe-area-inset-bottom) + ${rpx(220)})`,
        }}
      >
        <StaggerReveal index={0} isVisible={reveal}>
          <p
            style={{
              fontSize: rpx(22),
              color: SUB,
              margin: 0,
              letterSpacing: rpx(3),
              fontFamily: FONT_SERIF,
              textShadow: TEXT_ENGRAVED_SOFT,
            }}
          >
            {todayLabel()}
          </p>
        </StaggerReveal>

        <StaggerReveal index={1} isVisible={reveal}>
          <div
            style={{
              marginTop: rpx(28),
              borderRadius: rpx(32),
              ...LIQUID_GLASS,
              border: "none",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(233,216,166,0.12))",
              padding: `${rpx(40)} ${rpx(36)}`,
            }}
          >
            <Quote
              size={24}
              color={GOLD}
              strokeWidth={1.4}
              style={{ filter: ICON_ENGRAVED }}
            />
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(38),
                fontWeight: 600,
                color: INK,
                lineHeight: 1.75,
                letterSpacing: rpx(1.5),
                margin: `${rpx(20)} 0 0`,
                textShadow: TEXT_ENGRAVED,
              }}
            >
              {t.passage}
            </p>
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(20),
                color: SUB,
                margin: `${rpx(24)} 0 0`,
                letterSpacing: rpx(1),
                textShadow: TEXT_ENGRAVED_SOFT,
              }}
            >
              — 《{t.volumeTitle}》· {t.chapterTitle}
            </p>

            {/* 三个轻功能：收藏 / 已练习 / 分享卡片。
                克制、无打卡焦虑——气质是「今天，我回来了一次」 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(12),
                marginTop: rpx(32),
                paddingTop: rpx(26),
                borderTop: "1px solid rgba(138,123,85,0.14)",
              }}
            >
              <DailyAction
                icon={Bookmark}
                label={favorited ? "已收藏" : "收藏"}
                active={favorited}
                fillWhenActive
                onClick={handleFavorite}
              />
              <DailyAction
                icon={Check}
                label={isPracticed ? "已练习" : "练一次"}
                active={isPracticed}
                onClick={handlePracticed}
              />
              <DailyAction
                icon={Share2}
                label="分享"
                onClick={() => setShareOpen(true)}
              />
            </div>

            {/* 持久练习记录：随时可确认「练过 + 哪天练的」，无天数/完成率 */}
            {isPracticed && practicedAt && (
              <p
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(19),
                  color: GOLD,
                  textAlign: "center",
                  margin: `${rpx(16)} 0 0`,
                  letterSpacing: rpx(1),
                  opacity: 0.85,
                }}
              >
                已于 {formatPracticedDate(practicedAt)} 练习过这一段
              </p>
            )}
          </div>
        </StaggerReveal>

        <StaggerReveal index={2} isVisible={reveal}>
          <div style={{ marginTop: rpx(40) }}>
            <PracticeSectionTitle icon={Sun} label="白话导读" />
            <PracticeContentBox fontSize={26}>{t.guide}</PracticeContentBox>
          </div>
        </StaggerReveal>

        <StaggerReveal index={3} isVisible={reveal}>
          <div style={{ marginTop: rpx(44) }}>
            <PracticeSectionTitle icon={Sparkles} label="自照一问" />
            <PracticeContentBox>{t.question}</PracticeContentBox>
          </div>
        </StaggerReveal>

        <StaggerReveal index={4} isVisible={reveal}>
          <div style={{ marginTop: rpx(44) }}>
            <PracticeSectionTitle icon={BookOpen} label="一分钟练习" />
            <StepList steps={t.practiceSteps} stepByStep />
          </div>
        </StaggerReveal>
      </div>

      <HandbookBottomDock>
        <PrimaryButton
          title="阅读原文"
          variant="filled"
          onClick={() => onReadChapter?.(t.volumeId, t.chapterId)}
        />
      </HandbookBottomDock>

      <ShareQuoteSheet
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        quote={t.passage}
        source={`《${t.volumeTitle}》· ${t.chapterTitle}`}
        onCopied={() => toast.show("已复制")}
        onSaved={() => toast.show("卡片已生成")}
      />

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2200}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}

interface DailyActionProps {
  icon: typeof Bookmark;
  label: string;
  active?: boolean;
  /** 激活时是否给图标填充金色（收藏用） */
  fillWhenActive?: boolean;
  onClick: () => void;
}

/** 今日一段的轻功能按钮：极简文字链气质，激活转柔金，无打卡感 */
function DailyAction({
  icon: Icon,
  label,
  active = false,
  fillWhenActive = false,
  onClick,
}: DailyActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: rpx(8),
        padding: `${rpx(8)} ${rpx(4)}`,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        flex: 1,
        justifyContent: "center",
      }}
      aria-pressed={active}
      aria-label={label}
    >
      <Icon
        size={17}
        color={active ? GOLD : SUB}
        strokeWidth={1.7}
        fill={fillWhenActive && active ? GOLD : "none"}
        style={{ filter: ICON_ENGRAVED }}
      />
      <span
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(22),
          color: active ? GOLD : SUB,
          letterSpacing: rpx(1),
          textShadow: TEXT_ENGRAVED_SOFT,
        }}
      >
        {label}
      </span>
    </button>
  );
}
