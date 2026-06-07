/**
 * HandbookShelf - 十卷母本书架（图4-03）
 *
 * 双视图：书架（概览）/ 列表（详情）；列表默认折叠长导言，保持清晰。
 */

import { useState, useEffect, useCallback } from "react";
import { List, LayoutGrid, ChevronRight, Plus } from "lucide-react";
import { V2_VOLUMES, VOLUME_CN } from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  rpx,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  TEXT_ENGRAVED_SOFT,
  ICON_ENGRAVED,
  HANDBOOK_BG,
} from "../config/styles";
import { HandbookPlaceholderCard } from "../components/shared/HandbookPlaceholderCard";
import { VolumeBookCover } from "../components/shared/VolumeBookCover";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";
import { CrossFade } from "../components/shared/CrossFade";
import bgLayer1 from "@/assets/images/human-manual/home-top.webp";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";
type ViewMode = "list" | "shelf";

interface HandbookShelfProps {
  onBack?: () => void;
  onOpenVolume?: (volumeId: string) => void;
}

export function HandbookShelf({ onBack, onOpenVolume }: HandbookShelfProps) {
  const [view, setView] = useState<ViewMode>("shelf");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ToggleBtn = useCallback(
    (mode: ViewMode, Icon: typeof List, label: string) => (
      <button
        type="button"
        onClick={() => setView(mode)}
        aria-label={label}
        aria-pressed={view === mode}
        style={{
          width: rpx(60),
          height: rpx(60),
          borderRadius: rpx(34),
          background: view === mode ? "rgba(184,151,90,0.18)" : "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.25s ease",
        }}
      >
        <Icon
          size={18}
          strokeWidth={1.6}
          color={view === mode ? GOLD : "#A8A498"}
          style={{ filter: ICON_ENGRAVED }}
        />
      </button>
    ),
    [view],
  );

  const ViewToggle = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: rpx(8),
        padding: rpx(6),
        borderRadius: rpx(40),
        background: "rgba(250,247,240,0.6)",
        backdropFilter: "blur(12px) saturate(1.1)",
        WebkitBackdropFilter: "blur(12px) saturate(1.1)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 2px 10px rgba(60,50,30,0.12)",
      }}
    >
      {ToggleBtn("shelf", LayoutGrid, "书架视图")}
      {ToggleBtn("list", List, "列表视图")}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
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
          height: "100vh",
          backgroundImage: `url(${bgLayer1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: view === "list" ? 0.5 : 1,
          transition: "opacity 0.55s ease",
          pointerEvents: "none",
        }}
      />

      <HandbookHeader
        onBack={onBack}
        title="十卷母本书架"
        subtitle={
          view === "shelf" ? "书架视图 · 一览十卷" : "列表视图 · 卷简介与导言"
        }
        withBackground={view === "list"}
        rightRaw
        rightContent={ViewToggle}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(8)}) ${rpx(40)} calc(env(safe-area-inset-bottom) + ${rpx(56)})`,
        }}
      >
        <CrossFade contentKey={view}>
          {view === "list" ? (
            <div>
              {V2_VOLUMES.map((vol) => (
                <div
                  key={vol.id}
                  onClick={() => onOpenVolume?.(vol.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: rpx(20),
                    padding: `${rpx(36)} 0`,
                    borderBottom: "1px solid rgba(233,216,166,0.35)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: rpx(24),
                    }}
                  >
                    <div
                      style={{
                        width: rpx(100),
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <VolumeBookCover
                        volumeNumber={vol.volumeNumber}
                        volumeCn={VOLUME_CN[vol.volumeNumber - 1]}
                        height={rpx(140)}
                        compact
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(22),
                          color: GOLD,
                          margin: 0,
                          letterSpacing: rpx(2),
                        }}
                      >
                        卷{VOLUME_CN[vol.volumeNumber - 1]}
                      </p>
                      <h3
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(38),
                          fontWeight: 600,
                          color: INK,
                          margin: `${rpx(8)} 0 0`,
                          letterSpacing: rpx(2),
                          textShadow: TEXT_ENGRAVED,
                        }}
                      >
                        {vol.title}
                      </h3>
                      <p
                        style={{
                          fontSize: rpx(24),
                          color: SUB,
                          margin: `${rpx(8)} 0 0`,
                          lineHeight: 1.5,
                        }}
                      >
                        {vol.subtitle}
                      </p>
                      <p
                        style={{
                          fontSize: rpx(22),
                          color: "#8A8678",
                          margin: `${rpx(8)} 0 0`,
                          lineHeight: 1.5,
                        }}
                      >
                        {vol.oneLine}
                      </p>
                    </div>
                    <ChevronRight
                      size={22}
                      color="#C7C2B6"
                      strokeWidth={1.5}
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: rpx(26),
                      color: "#7A7268",
                      margin: 0,
                      lineHeight: 1.85,
                      paddingLeft: rpx(124),
                    }}
                  >
                    {vol.intro}
                  </p>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: rpx(8),
                  padding: `${rpx(48)} 0`,
                  color: "#B0AC9F",
                }}
              >
                <Plus size={20} strokeWidth={1.6} />
                <span
                  style={{
                    fontSize: rpx(24),
                    fontFamily: FONT_SERIF,
                    color: "#9A9384",
                  }}
                >
                  持续更新中
                </span>
                <span style={{ fontSize: rpx(18), color: "#B0AC9F" }}>
                  第六至十卷筹备中
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: rpx(20),
              }}
            >
              {V2_VOLUMES.map((vol) => (
                <div
                  key={vol.id}
                  onClick={() => onOpenVolume?.(vol.id)}
                  style={{
                    ...LIQUID_GLASS,
                    borderRadius: rpx(24),
                    padding: `${rpx(24)} ${rpx(20)}`,
                    minHeight: rpx(248),
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.18s ease",
                  }}
                  onMouseDown={(ev) => {
                    ev.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseUp={(ev) => {
                    ev.currentTarget.style.transform = "translateY(0)";
                  }}
                  onMouseLeave={(ev) => {
                    ev.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(20),
                      color: GOLD,
                      letterSpacing: rpx(1),
                      textShadow: TEXT_ENGRAVED_SOFT,
                    }}
                  >
                    卷{VOLUME_CN[vol.volumeNumber - 1]}
                  </span>
                  <h3
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(28),
                      fontWeight: 600,
                      color: INK,
                      margin: `${rpx(12)} 0 0`,
                      letterSpacing: rpx(1),
                      lineHeight: 1.35,
                      textShadow: TEXT_ENGRAVED,
                    }}
                  >
                    {vol.title}
                  </h3>
                  <p
                    style={{
                      fontSize: rpx(18),
                      color: "#6F665A",
                      margin: `${rpx(12)} 0 0`,
                      lineHeight: 1.6,
                      textShadow: TEXT_ENGRAVED_SOFT,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {vol.oneLine}
                  </p>
                </div>
              ))}
              <HandbookPlaceholderCard height={rpx(248)} />
            </div>
          )}
        </CrossFade>
      </div>
    </div>
  );
}
