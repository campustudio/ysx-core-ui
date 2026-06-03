/**
 * HandbookVolume - 卷内首页（图5-01）
 *
 * 卷封 + 卷名 + 分享；本卷导言（建立语境与价值锚点）；
 * 章节结构（序号+标题+副标题+完成圆点）；底部「开始阅读」。
 */

import { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import {
  getV2VolumeById,
  VOLUME_CN,
  getChapterProgressLabel,
} from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  rpx,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  HANDBOOK_BG,
} from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import {
  HandbookHeader,
  HANDBOOK_HEADER_ICON,
} from "../components/shared/HandbookHeader";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

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
  }, [volumeId]);

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
        background: HANDBOOK_BG,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* 卷封背景图（明亮·全宽·延伸至屏幕顶部） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: rpx(620),
          backgroundImage: `url(${volume.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

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

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
          padding: `0 ${rpx(48)} ${rpx(80)}`,
        }}
      >
        {/* 卷封标题（叠在背景图上，深色阴刻文字） */}
        <div
          style={{
            height: rpx(480),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              color: "#3A3024",
              letterSpacing: rpx(6),
              textShadow: TEXT_ENGRAVED_SOFT,
            }}
          >
            第{VOLUME_CN[volume.volumeNumber - 1]}卷
          </span>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(72),
              fontWeight: 600,
              color: "#23201A",
              margin: `${rpx(18)} 0 0`,
              letterSpacing: rpx(8),
              textShadow: TEXT_ENGRAVED,
            }}
          >
            {volume.title}
          </h1>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              color: "#4A4030",
              margin: `${rpx(20)} 0 0`,
              letterSpacing: rpx(2),
              textShadow: TEXT_ENGRAVED_SOFT,
            }}
          >
            {volume.oneLine}
          </p>
        </div>
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
          const progressLabel = getChapterProgressLabel(ch.id);
          return (
            <div
              key={ch.id}
              onClick={() => onSelectChapter?.(volumeId, ch.id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: rpx(20),
                padding: `${rpx(30)} 0`,
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(30),
                  color: GOLD,
                  flexShrink: 0,
                  minWidth: rpx(48),
                }}
              >
                {String(ch.index).padStart(2, "0")}
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
                  {ch.title}
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
              {progressLabel ? (
                <span
                  style={{
                    fontSize: rpx(22),
                    color: progressLabel === "已完成" ? GOLD : SUB,
                    fontFamily: FONT_SERIF,
                    flexShrink: 0,
                    paddingTop: rpx(4),
                  }}
                >
                  {progressLabel}
                </span>
              ) : null}
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
