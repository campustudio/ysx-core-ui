/**
 * HandbookPractice - 读后练习 / 推荐练习（图5-03）
 *
 * 践行页：光感引导 + 思考一问 + 逐步练习 + 写下自照（本地）+ 底部操作坞。
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, BookOpen } from "lucide-react";
import {
  getV2VolumeById,
  getV2Chapter,
  markChapterComplete,
} from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  rpx,
  HANDBOOK_BG,
  TEXT_ENGRAVED,
  GENTLE_EASE_OUT,
  GENTLE_EASE_IN,
} from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { usePracticeJournal } from "../hooks/usePracticeJournal";
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

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookPracticeProps {
  volumeId: string;
  chapterId: string;
  onBack?: () => void;
  onNextChapter?: (volumeId: string, chapterId: string) => void;
  onFinishVolume?: (volumeId: string) => void;
  mode?: "reading" | "recommend";
}

export function HandbookPractice({
  volumeId,
  chapterId,
  onBack,
  onNextChapter,
  onFinishVolume,
  mode = "reading",
}: HandbookPracticeProps) {
  const [reveal, setReveal] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const followRafRef = useRef<number | null>(null);
  const toast = useToast();
  const volume = getV2VolumeById(volumeId);
  const chapter = getV2Chapter(volumeId, chapterId);
  const { text: journalText, setText: setJournalText, hydrated } =
    usePracticeJournal(volumeId, chapterId);

  const isRecommendMode = mode === "recommend";

  const idx = volume?.chapters.findIndex((c) => c.id === chapterId) ?? -1;
  const nextChapter =
    volume && idx >= 0 && idx < volume.chapters.length - 1
      ? volume.chapters[idx + 1]
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isRecommendMode) {
      markChapterComplete(chapterId);
    }
    const id = requestAnimationFrame(() => setReveal(true));
    return () => cancelAnimationFrame(id);
  }, [chapterId, isRecommendMode]);

  useEffect(() => {
    if (hydrated && journalText.trim()) {
      setJournalOpen(true);
    }
  }, [hydrated, journalText]);

  // 跟随「写下自照」展开动画，柔和地把滚动容器带到底部，
  // 让输入框完整露出（不被底部两枚按钮遮挡），无需用户手动上滑。
  const followToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (followRafRef.current) cancelAnimationFrame(followRafRef.current);
    const start = performance.now();
    const DURATION = 1200; // 略长于展开动画，持续跟随到位
    const step = (now: number) => {
      const target = el.scrollHeight - el.clientHeight;
      el.scrollTop += (target - el.scrollTop) * 0.16; // 缓动跟随，避免突兀
      if (now - start < DURATION) {
        followRafRef.current = requestAnimationFrame(step);
      } else {
        el.scrollTop = el.scrollHeight - el.clientHeight;
        followRafRef.current = null;
      }
    };
    followRafRef.current = requestAnimationFrame(step);
  }, []);

  const handleToggleJournal = useCallback(() => {
    setJournalOpen((open) => {
      const next = !open;
      // 仅在「展开」时跟随滚动；收起不滚动
      if (next) requestAnimationFrame(() => followToBottom());
      return next;
    });
  }, [followToBottom]);

  useEffect(
    () => () => {
      if (followRafRef.current) cancelAnimationFrame(followRafRef.current);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (nextChapter) {
      onNextChapter?.(volumeId, nextChapter.id);
    } else {
      toast.show("本卷已读完，做得很好");
      onFinishVolume?.(volumeId);
    }
  }, [nextChapter, volumeId, onNextChapter, onFinishVolume, toast]);

  const handleRecommendComplete = useCallback(() => {
    setExiting(true);
    window.setTimeout(() => onBack?.(), 480);
  }, [onBack]);

  if (!volume || !chapter) {
    return (
      <div style={{ padding: rpx(80), textAlign: "center", color: SUB }}>
        <HandbookHeader
          onBack={onBack}
          title={isRecommendMode ? "推荐练习" : "读后练习"}
        />
        练习内容筹备中
      </div>
    );
  }

  const { practice } = chapter;
  const contextLine = isRecommendMode
    ? `《${volume.title}》· 路径推荐练习`
    : `${volume.title} · ${chapter.subtitle}`;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: HANDBOOK_BG,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(8px)" : "translateY(0)",
        transition: exiting
          ? `opacity 0.48s ${GENTLE_EASE_IN}, transform 0.48s ${GENTLE_EASE_IN}`
          : undefined,
      }}
    >
      <HandbookHeader
        onBack={onBack}
        withBackground
        title={isRecommendMode ? "推荐练习" : "读后练习"}
        subtitle={
          isRecommendMode
            ? "来自你的阅读路径"
            : `第${chapter.index}章 · ${chapter.title}`
        }
      />

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(8)}) ${rpx(48)} ${rpx(280)}`,
        }}
      >
        <StaggerReveal index={0} isVisible={reveal}>
          <p
            style={{
              fontSize: rpx(22),
              color: SUB,
              margin: `0 0 ${rpx(12)}`,
              letterSpacing: rpx(1),
              fontFamily: FONT_SERIF,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            {contextLine}
          </p>

          <div
            style={{
              position: "relative",
              height: rpx(440),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: rpx(36),
              background:
                "radial-gradient(58% 50% at 50% 40%, rgba(255,236,184,0.5) 0%, rgba(233,216,166,0.15) 40%, rgba(247,245,241,0) 72%)",
            }}
          >
            <PracticeGlow />
            <h1
              style={{
                position: "relative",
                fontFamily: FONT_SERIF,
                fontSize: rpx(38),
                fontWeight: 600,
                color: INK,
                letterSpacing: rpx(2),
                lineHeight: 1.55,
                margin: 0,
                textAlign: "center",
                padding: `0 ${rpx(16)}`,
                textShadow: TEXT_ENGRAVED,
              }}
            >
              {practice.intro}
            </h1>
          </div>
        </StaggerReveal>

        <StaggerReveal index={1} isVisible={reveal}>
          <div style={{ marginTop: rpx(36) }}>
            <PracticeSectionTitle icon={Sparkles} label="思考一问" />
            <PracticeContentBox>{practice.question}</PracticeContentBox>
          </div>
        </StaggerReveal>

        <StaggerReveal index={2} isVisible={reveal}>
          <div style={{ marginTop: rpx(44) }}>
            <PracticeSectionTitle icon={BookOpen} label="1 分钟自照练习" />
            <StepList steps={practice.steps} stepByStep />
          </div>
        </StaggerReveal>

        {!isRecommendMode && (
          <StaggerReveal index={3} isVisible={reveal}>
            <div
              style={{
                marginTop: rpx(40),
                display: "grid",
                gridTemplateRows: journalOpen ? "1fr" : "0fr",
                transition: journalOpen
                  ? `grid-template-rows 1.1s ${GENTLE_EASE_OUT}, margin-top 0.5s ease`
                  : `grid-template-rows 0.85s ${GENTLE_EASE_IN}`,
              }}
            >
              <div style={{ overflow: "hidden", minHeight: 0 }}>
                <div
                  style={{
                    paddingTop: rpx(8),
                    opacity: journalOpen ? 1 : 0,
                    transition: journalOpen
                      ? "opacity 0.75s ease 0.1s"
                      : "opacity 0.5s ease",
                  }}
                >
                  <PracticeSectionTitle icon={Sparkles} label="写下自照" />
                  <style>{`
                    .hb-practice-journal::placeholder {
                      color: rgba(96, 98, 102, 0.55);
                      opacity: 1;
                    }
                  `}</style>
                  <textarea
                    className="hb-practice-journal"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="此刻，你想留下一句什么？"
                    style={{
                      width: "100%",
                      minHeight: rpx(160),
                      padding: rpx(24),
                      borderRadius: rpx(24),
                      border: "none",
                      background: "rgba(255,255,255,0.7)",
                      boxShadow: "0 2px 14px rgba(80,66,38,0.05)",
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(26),
                      lineHeight: 1.65,
                      color: INK,
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>
          </StaggerReveal>
        )}
      </div>

      <HandbookBottomDock>
        {isRecommendMode ? (
          <PrimaryButton
            title="回到阅读建议"
            variant="filled"
            onClick={handleRecommendComplete}
          />
        ) : (
          <div style={{ display: "flex", gap: rpx(16) }}>
            <PrimaryButton
              title={journalOpen ? "收起自照" : "写下自照"}
              onClick={handleToggleJournal}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title={nextChapter ? "继续下一节" : "完成本卷"}
              variant="filled"
              onClick={handleNext}
              style={{ flex: 1.35 }}
            />
          </div>
        )}
      </HandbookBottomDock>

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}

function PracticeGlow() {
  return (
    <svg
      viewBox="0 0 375 360"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <defs>
        <radialGradient id="pgCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,248,222,0.9)" />
          <stop offset="100%" stopColor="rgba(255,232,170,0)" />
        </radialGradient>
        <linearGradient id="pgGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9B96A" />
          <stop offset="1" stopColor="#B8975A" />
        </linearGradient>
      </defs>
      {[
        { ry: 26, rx: 150, o: 0.1 },
        { ry: 18, rx: 110, o: 0.16 },
        { ry: 12, rx: 74, o: 0.22 },
      ].map((r, i) => (
        <ellipse
          key={i}
          cx="187.5"
          cy="206"
          rx={r.rx}
          ry={r.ry}
          fill="none"
          stroke="rgba(184,151,90,1)"
          strokeOpacity={r.o}
          strokeWidth="1.2"
        />
      ))}
      <circle cx="187.5" cy="150" r="70" fill="url(#pgCore)" />
      <path
        d="M187.5 196 L187.5 150"
        stroke="url(#pgGold)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M187.5 168 C175 162 168 150 169 138 C181 140 188 152 187.5 168 Z"
        fill="url(#pgGold)"
        opacity="0.92"
      />
      <path
        d="M187.5 162 C200 156 207 144 206 132 C194 134 187 146 187.5 162 Z"
        fill="url(#pgGold)"
        opacity="0.92"
      />
    </svg>
  );
}
