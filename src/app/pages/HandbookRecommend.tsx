/**
 * HandbookRecommend - 阅读建议结果（图4-02）
 *
 * 路径引导（非算法推荐）：首屏仅展示建议卷 + 理由 + 开始阅读；
 * 章节/练习/延伸路径默认折叠，可展开查看。
 */

import { useState, useEffect } from "react";
import { BookOpen, Target, BookMarked, ChevronDown } from "lucide-react";
import { getRecommendation, VOLUME_CN } from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  rpx,
  HANDBOOK_BG,
} from "../config/styles";
import bgLayer2 from "@/assets/images/home/2-dingqi.webp";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";
import { PrimaryButton } from "../components/shared/PrimaryButton";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookRecommendProps {
  optionId: string;
  onBack?: () => void;
  onStartReading?: (volumeId: string, chapterId?: string) => void;
  onOpenVolume?: (volumeId: string) => void;
  onOpenPractice?: (volumeId: string, chapterId: string) => void;
}

export function HandbookRecommend({
  optionId,
  onBack,
  onStartReading,
  onOpenVolume,
  onOpenPractice,
}: HandbookRecommendProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pathExpanded, setPathExpanded] = useState(false);
  const rec = getRecommendation(optionId);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  if (!rec) {
    return (
      <div style={{ padding: rpx(200), textAlign: "center", color: SUB }}>
        <HandbookHeader
          onBack={onBack}
          title="阅读建议"
          subtitle="根据你的选择整理的路径"
        />
        暂无建议，请返回重新选择。
      </div>
    );
  }

  const sectionTitle = (Icon: typeof Target, text: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: rpx(12),
        marginBottom: rpx(16),
      }}
    >
      <Icon size={18} strokeWidth={1.6} color={GOLD} />
      <span
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(26),
          fontWeight: 600,
          color: INK,
          letterSpacing: rpx(2),
        }}
      >
        {text}
      </span>
    </div>
  );

  const entryRow = (text: string, onClick?: () => void) => (
    <div
      key={text}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: rpx(16),
        padding: `${rpx(18)} ${rpx(6)}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span
        style={{
          fontSize: rpx(25),
          color: "#4A4030",
          fontFamily: FONT_SERIF,
          letterSpacing: rpx(1),
        }}
      >
        {text}
      </span>
      {onClick && (
        <span
          style={{
            fontSize: rpx(20),
            color: "#C7B98E",
            fontFamily: FONT_SERIF,
          }}
        >
          →
        </span>
      )}
    </div>
  );

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
      <HandbookHeader onBack={onBack} title="阅读建议" />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(8)}) ${rpx(40)} ${rpx(80)}`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: rpx(28) }}>
          <p
            style={{
              fontSize: rpx(24),
              color: SUB,
              margin: 0,
              letterSpacing: rpx(2),
            }}
          >
            根据你的选择
          </p>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              color: GOLD,
              margin: `${rpx(8)} 0 0`,
              letterSpacing: rpx(2),
            }}
          >
            我们建议你从这一卷开始
          </p>
        </div>

        <div
          style={{
            ...LIQUID_GLASS,
            borderRadius: rpx(40),
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: rpx(440),
              backgroundImage: `url(${bgLayer2})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.5,
              maskImage: "linear-gradient(to bottom, #000 25%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 25%, transparent)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{ position: "relative", padding: `${rpx(48)} ${rpx(40)}` }}
          >
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(28),
                  color: SUB,
                  letterSpacing: rpx(2),
                  textShadow: TEXT_ENGRAVED_SOFT,
                }}
              >
                建议从
              </span>
              <h2
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(56),
                  fontWeight: 600,
                  color: INK,
                  margin: `${rpx(8)} 0 0`,
                  letterSpacing: rpx(4),
                  lineHeight: 1.3,
                  textShadow: TEXT_ENGRAVED,
                }}
              >
                第{VOLUME_CN[rec.volumeNumber - 1]}卷开始
              </h2>
              <p
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(30),
                  color: GOLD,
                  margin: `${rpx(12)} 0 0`,
                  letterSpacing: rpx(2),
                }}
              >
                《{rec.volumeTitle}》
              </p>
              <p
                style={{
                  fontSize: rpx(24),
                  color: SUB,
                  margin: `${rpx(24)} 0 0`,
                  lineHeight: 1.8,
                  textAlign: "left",
                }}
              >
                {rec.reason}
              </p>
            </div>

            <div style={{ margin: `${rpx(40)} 0 0` }}>
              <PrimaryButton
                title="开始阅读"
                variant="filled"
                onClick={() => onStartReading?.(rec.volumeId)}
              />
            </div>

            <button
              type="button"
              onClick={() => setPathExpanded((v) => !v)}
              style={{
                width: "100%",
                marginTop: rpx(28),
                padding: `${rpx(16)} 0`,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: rpx(8),
                fontFamily: FONT_SERIF,
                fontSize: rpx(24),
                color: INK,
                letterSpacing: rpx(2),
              }}
            >
              {pathExpanded ? "收起阅读路径" : "展开阅读路径"}
              <ChevronDown
                size={18}
                color={GOLD}
                strokeWidth={1.8}
                style={{
                  transform: pathExpanded ? "rotate(180deg)" : "rotate(0)",
                  transition: pathExpanded
                    ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
                    : "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </button>

            {/* 展开/收起：展开慢于收起，避免急促感（见设计文档 §7.1） */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: pathExpanded ? "1fr" : "0fr",
                marginTop: pathExpanded ? rpx(8) : 0,
                transition: pathExpanded
                  ? "grid-template-rows 1.1s cubic-bezier(0.22, 1, 0.36, 1), margin-top 0.5s ease"
                  : "grid-template-rows 0.85s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.45s ease",
                pointerEvents: pathExpanded ? "auto" : "none",
              }}
            >
              <div style={{ overflow: "hidden", minHeight: 0 }}>
                <div
                  style={{
                    opacity: pathExpanded ? 1 : 0,
                    transition: pathExpanded
                      ? "opacity 0.8s ease 0.15s"
                      : "opacity 0.6s ease",
                  }}
                >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: rpx(20),
                    margin: `${rpx(16)} 0 ${rpx(24)}`,
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(184,151,90,0.25)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(24),
                      color: INK,
                      letterSpacing: rpx(2),
                    }}
                  >
                    阅读路径
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(184,151,90,0.25)",
                    }}
                  />
                </div>

                {sectionTitle(BookOpen, "核心阅读章节")}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: `0 0 ${rpx(28)} ${rpx(30)}`,
                  }}
                >
                  {rec.coreChapters.map((c) =>
                    entryRow(c.label, () =>
                      onStartReading?.(c.volumeId, c.chapterId),
                    ),
                  )}
                </div>

                {sectionTitle(Target, "推荐练习")}
                <div style={{ margin: `0 0 ${rpx(28)} ${rpx(30)}` }}>
                  {entryRow(rec.practices.join(" · "), () => {
                    if (rec.coreChapters.length > 0 && onOpenPractice) {
                      onOpenPractice(
                        rec.coreChapters[0].volumeId,
                        rec.coreChapters[0].chapterId,
                      );
                    }
                  })}
                </div>

                {sectionTitle(BookMarked, "延伸阅读")}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: `0 0 0 ${rpx(30)}`,
                  }}
                >
                  {rec.extendedReading.map((e) =>
                    entryRow(e.label, () => onOpenVolume?.(e.volumeId)),
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: rpx(20),
            color: "#A8A498",
            margin: `${rpx(28)} 0 0`,
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          这是根据你的选择整理的路径建议，你随时可以换卷阅读
        </p>
      </div>
    </div>
  );
}
