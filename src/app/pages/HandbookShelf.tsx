/**
 * HandbookShelf - 十卷母本书架（图4-03）
 *
 * 完整体系自由探索：列表 / 书架 两视图切换（右上角）。
 * 每卷一卡（卷号+卷名+一句话简介），末尾占位「+持续更新中」。
 * 背景图先用现有图占位。
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
} from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
} from "../components/shared/HandbookHeader";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [view, setView] = useState<ViewMode>("shelf");
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const ToggleBtn = useCallback(
    (mode: ViewMode, Icon: typeof List) => (
      <button
        onClick={() => setView(mode)}
        style={{
          background: view === mode ? "rgba(184,151,90,0.16)" : "transparent",
          border: "none",
          borderRadius: rpx(16),
          padding: rpx(12),
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          size={18}
          strokeWidth={1.6}
          color={view === mode ? GOLD : "#A8A498"}
        />
      </button>
    ),
    [view],
  );

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F3EEE3",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {/* 柔光背景图（占位，营造图中通透氛围） */}
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
          opacity: 0.16,
          pointerEvents: "none",
        }}
      />

      <HandbookHeader
        onBack={onBack}
        title="十卷母本书架"
        subtitle="完整体系 · 自由探索"
        rightContent={
          <div style={{ display: "flex", gap: rpx(6) }}>
            {ToggleBtn("shelf", LayoutGrid)}
            {ToggleBtn("list", List)}
          </div>
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(8)}) ${rpx(40)} ${rpx(80)}`,
        }}
      >
        {view === "list" ? (
          // ─── 列表视图 ───
          <div>
            {V2_VOLUMES.map((vol) => (
              <div
                key={vol.id}
                onClick={() => onOpenVolume?.(vol.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: rpx(28),
                  padding: `${rpx(32)} 0`,
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: rpx(110),
                    height: rpx(150),
                    borderRadius: rpx(16),
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                    boxShadow: "0 6px 18px rgba(60,50,30,0.12)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${vol.cover})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, rgba(31,31,31,0.05), rgba(31,31,31,0.5))",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: rpx(12),
                      left: rpx(12),
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(18),
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    第{VOLUME_CN[vol.volumeNumber - 1]}卷
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(36),
                      fontWeight: 600,
                      color: INK,
                      margin: 0,
                      letterSpacing: rpx(2),
                    }}
                  >
                    {vol.title}
                  </h3>
                  <p
                    style={{
                      fontSize: rpx(22),
                      color: SUB,
                      margin: `${rpx(10)} 0 0`,
                    }}
                  >
                    {vol.subtitle}
                  </p>
                  <p
                    style={{
                      fontSize: rpx(22),
                      color: "#8A8678",
                      margin: `${rpx(12)} 0 0`,
                      lineHeight: 1.5,
                    }}
                  >
                    {vol.oneLine}
                  </p>
                </div>
                <ChevronRight size={20} color="#C7C2B6" strokeWidth={1.5} />
              </div>
            ))}
            {/* 占位 */}
            <div
              onClick={() => toast.show("更多卷正在敬请期待")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: rpx(8),
                padding: `${rpx(48)} 0`,
                color: "#B0AC9F",
                cursor: "pointer",
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
                更多卷正在敬请期待
              </span>
            </div>
          </div>
        ) : (
          // ─── 书架视图（三列小卡·液态玻璃） ───
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
                  minHeight: rpx(260),
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
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
                  }}
                >
                  {vol.oneLine}
                </p>
              </div>
            ))}
            {/* 占位卡（与其它卡片统一为液态玻璃 + 刻进去质感） */}
            <div
              onClick={() => toast.show("更多卷正在敬请期待")}
              style={{
                ...LIQUID_GLASS,
                minHeight: rpx(260),
                borderRadius: rpx(24),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: rpx(12),
                cursor: "pointer",
                padding: `0 ${rpx(16)}`,
                textAlign: "center",
              }}
            >
              <Plus
                size={24}
                strokeWidth={1.6}
                color={GOLD}
                style={{ filter: ICON_ENGRAVED }}
              />
              <span
                style={{
                  fontSize: rpx(22),
                  fontFamily: FONT_SERIF,
                  color: "#8A8170",
                  textShadow: TEXT_ENGRAVED,
                }}
              >
                持续更新中
              </span>
              <span
                style={{
                  fontSize: rpx(17),
                  color: "#9A9282",
                  lineHeight: 1.5,
                  textShadow: TEXT_ENGRAVED_SOFT,
                }}
              >
                更多卷正在敬请期待
              </span>
            </div>
          </div>
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
