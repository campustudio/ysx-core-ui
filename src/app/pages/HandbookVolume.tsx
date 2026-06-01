/**
 * HandbookVolume - 卷内首页（图5-01）
 *
 * 卷封 + 卷名 + 分享；本卷导言（建立语境与价值锚点）；
 * 章节结构（序号+标题+副标题+完成圆点）；底部「开始阅读」。
 */

import { useState, useEffect } from "react";
import {
  Share2,
  Triangle,
  Drama,
  Eye,
  Gem,
  Sparkles,
  Footprints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getV2VolumeById, VOLUME_CN } from "../config/handbook-v2-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
  HANDBOOK_HEADER_ICON,
} from "../components/shared/HandbookHeader";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

/** 章节图标（按序循环取用，参照图中每章前的象形小图标） */
const CHAPTER_ICONS: LucideIcon[] = [
  Triangle,
  Drama,
  Eye,
  Gem,
  Sparkles,
  Footprints,
];

interface HandbookVolumeProps {
  volumeId: string;
  onBack?: () => void;
  onSelectChapter?: (volumeId: string, chapterId: string) => void;
}

export function HandbookVolume({
  volumeId,
  onBack,
  onSelectChapter,
}: HandbookVolumeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const volume = getV2VolumeById(volumeId);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  if (!volume) {
    return (
      <div style={{ padding: rpx(200), textAlign: "center", color: SUB }}>
        <HandbookHeader onBack={onBack} title="卷内首页" />
        卷不存在
      </div>
    );
  }

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
        rightContent={
          <button
            onClick={() => toast.show("分享功能即将开放")}
            style={{
              background: "transparent",
              border: "none",
              padding: rpx(8),
              cursor: "pointer",
              display: "flex",
            }}
          >
            <Share2 size={20} color={HANDBOOK_HEADER_ICON} strokeWidth={1.6} />
          </button>
        }
      />

      {/* 卷封（圆角卡片，标题副标题居中） */}
      <div
        style={{
          margin: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(8)}) ${rpx(40)} 0`,
          height: rpx(440),
          borderRadius: rpx(36),
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 14px 36px rgba(60,50,30,0.16)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${volume.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(31,28,22,0.42) 0%, rgba(31,28,22,0.26) 50%, rgba(31,28,22,0.52) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${rpx(40)}`,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              color: "rgba(255,255,255,0.9)",
              letterSpacing: rpx(6),
            }}
          >
            第{VOLUME_CN[volume.volumeNumber - 1]}卷
          </span>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(72),
              fontWeight: 600,
              color: "#fff",
              margin: `${rpx(18)} 0 0`,
              letterSpacing: rpx(8),
              textShadow: "0 2px 14px rgba(0,0,0,0.35)",
            }}
          >
            {volume.title}
          </h1>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              color: "rgba(255,255,255,0.88)",
              margin: `${rpx(20)} 0 0`,
              letterSpacing: rpx(2),
            }}
          >
            {volume.oneLine}
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `${rpx(16)} ${rpx(48)} ${rpx(80)}`,
        }}
      >
        {/* 本卷导言 */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(184,151,90,0.08), rgba(233,216,166,0.04))",
            border: "1px solid rgba(184,151,90,0.16)",
            borderRadius: rpx(32),
            padding: `${rpx(36)} ${rpx(36)}`,
          }}
        >
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(28),
              fontWeight: 600,
              color: GOLD,
              margin: 0,
              letterSpacing: rpx(3),
            }}
          >
            本卷导言
          </h2>
          <p
            style={{
              fontSize: rpx(26),
              color: "#4A4A4A",
              lineHeight: 1.9,
              margin: `${rpx(20)} 0 0`,
            }}
          >
            {volume.intro}
          </p>
        </div>

        {/* 章节结构 */}
        <h2
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(34),
            fontWeight: 600,
            color: INK,
            margin: `${rpx(52)} 0 ${rpx(8)}`,
            letterSpacing: rpx(2),
          }}
        >
          章节结构
        </h2>
        <p style={{ fontSize: rpx(22), color: SUB, margin: `0 0 ${rpx(20)}` }}>
          共 {volume.chapters.length} 章
        </p>

        {volume.chapters.map((ch) => {
          const ChIcon = CHAPTER_ICONS[(ch.index - 1) % CHAPTER_ICONS.length];
          return (
            <div
              key={ch.id}
              onClick={() => onSelectChapter?.(volumeId, ch.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(24),
                padding: `${rpx(30)} 0`,
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              {/* 章节图标 */}
              <span
                style={{
                  width: rpx(72),
                  height: rpx(72),
                  borderRadius: rpx(20),
                  flexShrink: 0,
                  border: "1px solid rgba(184,151,90,0.3)",
                  background: "rgba(184,151,90,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChIcon size={22} color={GOLD} strokeWidth={1.5} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(32),
                    fontWeight: 500,
                    color: INK,
                    margin: 0,
                    letterSpacing: rpx(1),
                  }}
                >
                  {ch.index}. {ch.title}
                </h3>
                <p
                  style={{
                    fontSize: rpx(22),
                    color: SUB,
                    margin: `${rpx(8)} 0 0`,
                    lineHeight: 1.5,
                  }}
                >
                  {ch.subtitle}
                </p>
              </div>
            </div>
          );
        })}
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
