/**
 * HandbookPractice - 读后练习（图5-03）
 *
 * 阅读走向践行。引导句 + 思考一问 + 1分钟自照练习（按当前章节内容针对性设计）。
 * 进入即标记本节完成；按钮：写下自照 / 继续下一节。
 */

import { useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import {
  getV2VolumeById,
  getV2Chapter,
  markChapterComplete,
} from "../config/handbook-v2-data";
import { FONT_SERIF, rpx, HANDBOOK_BG } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";
import { PrimaryButton } from "../components/shared/PrimaryButton";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookPracticeProps {
  volumeId: string;
  chapterId: string;
  onBack?: () => void;
  onNextChapter?: (volumeId: string, chapterId: string) => void;
  onFinishVolume?: (volumeId: string) => void;
  /** 模式：'reading' 读后练习（默认） | 'recommend' 推荐练习 */
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
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const volume = getV2VolumeById(volumeId);
  const chapter = getV2Chapter(volumeId, chapterId);

  const isRecommendMode = mode === "recommend";

  // 下一章
  const idx = volume?.chapters.findIndex((c) => c.id === chapterId) ?? -1;
  const nextChapter =
    volume && idx >= 0 && idx < volume.chapters.length - 1
      ? volume.chapters[idx + 1]
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    // 读后练习模式：进入即视为读完本节；推荐练习模式不标记
    if (!isRecommendMode) {
      markChapterComplete(chapterId);
    }
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, [chapterId, isRecommendMode]);

  const handleNext = useCallback(() => {
    if (nextChapter) {
      onNextChapter?.(volumeId, nextChapter.id);
    } else {
      toast.show("本卷已读完，做得很好");
      onFinishVolume?.(volumeId);
    }
  }, [nextChapter, volumeId, onNextChapter, onFinishVolume, toast]);

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

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: HANDBOOK_BG,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <HandbookHeader
        onBack={onBack}
        title={isRecommendMode ? "推荐练习" : "读后练习"}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `0 ${rpx(48)} ${rpx(220)}`,
        }}
      >
        {/* 顶部光感图（代码绘制）+ 引导句 */}
        <div
          style={{
            position: "relative",
            margin: `0 ${rpx(-48)}`,
            height: rpx(560),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: rpx(48),
          }}
        >
          <PracticeGlow />
          <h1
            style={{
              position: "relative",
              fontFamily: FONT_SERIF,
              fontSize: rpx(42),
              fontWeight: 600,
              color: INK,
              letterSpacing: rpx(2),
              lineHeight: 1.5,
              margin: 0,
              textAlign: "center",
              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
            }}
          >
            {practice.intro}
          </h1>
        </div>

        {/* 思考一问 */}
        <div
          style={{
            marginTop: rpx(8),
            background:
              "linear-gradient(135deg, rgba(184,151,90,0.1), rgba(233,216,166,0.05))",
            border: "1px solid rgba(184,151,90,0.2)",
            borderRadius: rpx(36),
            padding: `${rpx(40)} ${rpx(40)}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: rpx(10) }}>
            <Sparkles size={16} color={GOLD} strokeWidth={1.8} />
            <span
              style={{
                fontSize: rpx(24),
                color: GOLD,
                letterSpacing: rpx(2),
                fontFamily: FONT_SERIF,
              }}
            >
              思考一问
            </span>
          </div>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(30),
              color: INK,
              lineHeight: 1.8,
              margin: `${rpx(20)} 0 0`,
            }}
          >
            {practice.question}
          </p>
        </div>

        {/* 1分钟自照练习 */}
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(28),
            fontWeight: 600,
            color: INK,
            margin: `${rpx(52)} 0 ${rpx(24)}`,
            letterSpacing: rpx(2),
          }}
        >
          1 分钟自照练习
        </h2>
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: rpx(28),
            padding: `${rpx(32)} ${rpx(36)}`,
          }}
        >
          {practice.steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: rpx(16),
                marginBottom: i < practice.steps.length - 1 ? rpx(20) : 0,
              }}
            >
              <span
                style={{
                  width: rpx(36),
                  height: rpx(36),
                  borderRadius: "50%",
                  background: "rgba(184,151,90,0.14)",
                  color: GOLD,
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(20),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: rpx(2),
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  flex: 1,
                  fontSize: rpx(22),
                  color: "#3A3A3A",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: `${rpx(28)} ${rpx(48)} calc(env(safe-area-inset-bottom) + ${rpx(40)})`,
          display: "flex",
          gap: rpx(20),
        }}
      >
        {isRecommendMode ? (
          // 推荐练习模式：只显示完成按钮
          <PrimaryButton
            title="完成练习"
            variant="filled"
            onClick={onBack}
            style={{ flex: 1 }}
          />
        ) : (
          // 读后练习模式：写下自照 + 继续下一节
          <>
            <PrimaryButton
              title="写下自照"
              onClick={() => toast.show("「写下自照」即将开放")}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title={nextChapter ? "继续下一节" : "完成本卷"}
              variant="filled"
              onClick={handleNext}
              style={{ flex: 1.4 }}
            />
          </>
        )}
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}

/**
 * PracticeGlow - 读后练习顶部光感图（纯代码绘制，替代背景图片）
 * 暖金光晕 + 同心涟漪 + 中心一株新芽，呼应「暂停、沉淀、向上生长」。
 */
function PracticeGlow() {
  return (
    <svg
      viewBox="0 0 375 360"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <defs>
        <radialGradient id="pgGlow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="rgba(255,236,184,0.95)" />
          <stop offset="35%" stopColor="rgba(233,216,166,0.45)" />
          <stop offset="70%" stopColor="rgba(245,244,241,0.05)" />
          <stop offset="100%" stopColor="rgba(245,244,241,0)" />
        </radialGradient>
        <radialGradient id="pgCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,248,222,1)" />
          <stop offset="100%" stopColor="rgba(255,232,170,0)" />
        </radialGradient>
        <linearGradient id="pgGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9B96A" />
          <stop offset="1" stopColor="#B8975A" />
        </linearGradient>
      </defs>

      {/* 整体光晕 */}
      <rect x="0" y="0" width="375" height="360" fill="url(#pgGlow)" />

      {/* 同心涟漪（椭圆，营造水面光波） */}
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

      {/* 中心光点 */}
      <circle cx="187.5" cy="150" r="70" fill="url(#pgCore)" />

      {/* 新芽（茎 + 双叶） */}
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
