/**
 * HandbookPractice - 读后练习（图5-03）
 *
 * 阅读走向践行。引导句 + 思考一问 + 1分钟自照练习（按当前章节内容针对性设计）。
 * 进入即标记本节完成；按钮：写下自照 / 继续下一节。
 */

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Check } from "lucide-react";
import {
  getV2VolumeById,
  getV2Chapter,
  markChapterComplete,
} from "../config/handbook-v2-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookPracticeProps {
  volumeId: string;
  chapterId: string;
  onBack?: () => void;
  onNextChapter?: (volumeId: string, chapterId: string) => void;
  onFinishVolume?: (volumeId: string) => void;
}

export function HandbookPractice({
  volumeId,
  chapterId,
  onBack,
  onNextChapter,
  onFinishVolume,
}: HandbookPracticeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const volume = getV2VolumeById(volumeId);
  const chapter = getV2Chapter(volumeId, chapterId);

  // 下一章
  const idx = volume?.chapters.findIndex((c) => c.id === chapterId) ?? -1;
  const nextChapter =
    volume && idx >= 0 && idx < volume.chapters.length - 1
      ? volume.chapters[idx + 1]
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    // 进入练习即视为读完本节
    markChapterComplete(chapterId);
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, [chapterId]);

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
        <HandbookHeader onBack={onBack} title="读后练习" />
        练习内容筹备中
      </div>
    );
  }

  const { practice } = chapter;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F5F4F1",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <HandbookHeader
        onBack={onBack}
        title="读后练习"
        subtitle={`${chapter.index} / ${volume.chapters.length}`}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(24)}) ${rpx(48)} ${rpx(220)}`,
        }}
      >
        {/* 来源章节 */}
        <p
          style={{
            fontSize: rpx(22),
            color: SUB,
            margin: 0,
            letterSpacing: rpx(1),
          }}
        >
          {volume.title} · {chapter.title}
        </p>

        {/* 引导句 */}
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(48),
            fontWeight: 600,
            color: INK,
            letterSpacing: rpx(3),
            lineHeight: 1.5,
            margin: `${rpx(20)} 0 0`,
          }}
        >
          {practice.intro}
        </h1>

        {/* 思考一问 */}
        <div
          style={{
            marginTop: rpx(48),
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
              fontSize: rpx(34),
              color: INK,
              lineHeight: 1.8,
              margin: `${rpx(24)} 0 0`,
            }}
          >
            {practice.question}
          </p>
        </div>

        {/* 1分钟自照练习 */}
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(32),
            fontWeight: 600,
            color: INK,
            margin: `${rpx(56)} 0 ${rpx(28)}`,
            letterSpacing: rpx(2),
          }}
        >
          1 分钟自照练习
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: rpx(20) }}>
          {practice.steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: rpx(20),
                padding: `${rpx(28)} ${rpx(32)}`,
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: rpx(28),
              }}
            >
              <span
                style={{
                  width: rpx(48),
                  height: rpx(48),
                  borderRadius: "50%",
                  background: "rgba(184,151,90,0.14)",
                  color: GOLD,
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(26),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  flex: 1,
                  fontSize: rpx(26),
                  color: "#3A3A3A",
                  lineHeight: 1.7,
                  margin: 0,
                  paddingTop: rpx(8),
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>

        {/* 完成提示 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: rpx(10),
            marginTop: rpx(40),
            color: GOLD,
            fontSize: rpx(22),
          }}
        >
          <Check size={16} strokeWidth={2.4} />
          本节已完成
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
          background:
            "linear-gradient(to top, #F5F4F1 60%, rgba(245,244,241,0))",
          display: "flex",
          gap: rpx(20),
        }}
      >
        <button
          onClick={() => toast.show("「写下自照」即将开放")}
          style={{
            flex: 1,
            padding: `${rpx(32)} 0`,
            border: "1px solid rgba(184,151,90,0.4)",
            borderRadius: rpx(56),
            background: "transparent",
            color: GOLD,
            fontFamily: FONT_SERIF,
            fontSize: rpx(28),
            letterSpacing: rpx(2),
            cursor: "pointer",
          }}
        >
          写下自照
        </button>
        <button
          onClick={handleNext}
          style={{
            flex: 1.4,
            padding: `${rpx(32)} 0`,
            border: "none",
            borderRadius: rpx(56),
            background: "linear-gradient(135deg, #C9A961, #B8975A)",
            color: "#fff",
            fontFamily: FONT_SERIF,
            fontSize: rpx(30),
            fontWeight: 600,
            letterSpacing: rpx(3),
            boxShadow: "0 10px 30px rgba(184,151,90,0.3)",
            cursor: "pointer",
          }}
        >
          {nextChapter ? "继续下一节" : "完成本卷"}
        </button>
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
