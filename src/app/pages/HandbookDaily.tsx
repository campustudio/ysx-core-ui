/**
 * HandbookDaily - 今日一段（⑦）
 *
 * 参考图未给出，依据文字指引自行设计：
 * 一段原文 + 一句白话导读 + 一个自照问题 + 一个一分钟练习。
 * 底部可直达原章节阅读。
 */

import { useState, useEffect, type ReactNode } from "react";
import { Sun, Quote, Sparkles, BookOpen } from "lucide-react";
import {
  TODAY_PASSAGE,
  VOLUME_COVER_PLACEHOLDER,
} from "../config/handbook-v2-data";
import { FONT_SERIF, rpx, HANDBOOK_BG } from "../config/styles";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";
import { PrimaryButton } from "../components/shared/PrimaryButton";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const t = TODAY_PASSAGE;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const block = (icon: typeof Sun, label: string, children: ReactNode) => {
    const Icon = icon;
    return (
      <div style={{ marginTop: rpx(44) }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(10),
            marginBottom: rpx(20),
          }}
        >
          <Icon size={16} color={GOLD} strokeWidth={1.8} />
          <span
            style={{
              fontSize: rpx(24),
              color: GOLD,
              letterSpacing: rpx(2),
              fontFamily: FONT_SERIF,
            }}
          >
            {label}
          </span>
        </div>
        {children}
      </div>
    );
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
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <HandbookHeader onBack={onBack} title="今日一段" />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(16)}) ${rpx(48)} ${rpx(80)}`,
        }}
      >
        {/* 日期 */}
        <p
          style={{
            fontSize: rpx(22),
            color: SUB,
            margin: 0,
            letterSpacing: rpx(2),
          }}
        >
          {todayLabel()}
        </p>

        {/* 原文卡 */}
        <div
          style={{
            marginTop: rpx(24),
            borderRadius: rpx(32),
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(184,151,90,0.15)",
            padding: `${rpx(40)} ${rpx(36)}`,
            boxShadow: "0 4px 20px rgba(60,50,30,0.08)",
          }}
        >
          <Quote size={24} color={GOLD} strokeWidth={1.4} />
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(38),
              color: INK,
              lineHeight: 1.8,
              letterSpacing: rpx(1.5),
              margin: `${rpx(20)} 0 0`,
            }}
          >
            {t.passage}
          </p>
          <p
            style={{
              fontSize: rpx(20),
              color: SUB,
              margin: `${rpx(24)} 0 0`,
              letterSpacing: rpx(1),
            }}
          >
            — 《{t.volumeTitle}》· {t.chapterTitle}
          </p>
        </div>

        {/* 白话导读 */}
        {block(
          Sun,
          "白话导读",
          <p
            style={{
              fontSize: rpx(24),
              color: "#3A3A3A",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {t.guide}
          </p>,
        )}

        {/* 自照一问 */}
        {block(
          Sparkles,
          "自照一问",
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(184,151,90,0.1), rgba(233,216,166,0.05))",
              border: "1px solid rgba(184,151,90,0.2)",
              borderRadius: rpx(32),
              padding: `${rpx(36)} ${rpx(36)}`,
            }}
          >
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(28),
                color: INK,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {t.question}
            </p>
          </div>,
        )}

        {/* 一分钟练习 */}
        {block(
          BookOpen,
          "一分钟练习",
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: rpx(28),
              padding: `${rpx(32)} ${rpx(36)}`,
            }}
          >
            {t.practiceSteps.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: rpx(16),
                  marginBottom: i < t.practiceSteps.length - 1 ? rpx(20) : 0,
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
          </div>,
        )}
      </div>
    </div>
  );
}
