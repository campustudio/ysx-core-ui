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
  HANDBOOK_BG,
} from "../config/styles";
import { ICON_ENGRAVED as ICON_ENGRAVED_STYLE } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { HandbookPlaceholderCard } from "../components/shared/HandbookPlaceholderCard";
import { VolumeBookCover } from "../components/shared/VolumeBookCover";
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
          style={{ filter: ICON_ENGRAVED_STYLE }}
        />
      </button>
    ),
    [view],
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
          opacity: view === "list" ? 0.5 : 1,
          pointerEvents: "none",
        }}
      />

      <HandbookHeader
        onBack={onBack}
        title="十卷母本书架"
        subtitle="完整体系 · 自由探索"
        withBackground={view === "list"}
        rightContent={
          <div
            style={{ display: "flex", gap: view === "list" ? rpx(28) : rpx(6) }}
          >
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
                  flexDirection: "column",
                  gap: rpx(24),
                  padding: `${rpx(36)} 0`,
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  cursor: "pointer",
                }}
              >
                {/* 第一行：封面 + 标题信息 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: rpx(28),
                  }}
                >
                  <div style={{ width: rpx(100), flexShrink: 0 }}>
                    <VolumeBookCover
                      volumeNumber={vol.volumeNumber}
                      volumeCn={VOLUME_CN[vol.volumeNumber - 1]}
                      height={rpx(140)}
                      compact
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: rpx(40),
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
                        fontSize: rpx(26),
                        color: SUB,
                        margin: `${rpx(10)} 0 0`,
                      }}
                    >
                      {vol.subtitle}
                    </p>
                    <p
                      style={{
                        fontSize: rpx(24),
                        color: "#8A8678",
                        margin: `${rpx(10)} 0 0`,
                        lineHeight: 1.5,
                      }}
                    >
                      {vol.oneLine}
                    </p>
                  </div>
                  <ChevronRight size={25} color="#C7C2B6" strokeWidth={1.5} />
                </div>
                {/* 第二行：导言 */}
                <p
                  style={{
                    fontSize: rpx(26),
                    color: "#9A9282",
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {vol.intro}
                </p>
              </div>
            ))}
            {/* 占位（列表模式保持简单样式） */}
            <div
              onClick={() => toast.show("更多内容敬请期待")}
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
                更多内容敬请期待
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
            <HandbookPlaceholderCard
              onClick={() => toast.show("更多内容敬请期待")}
              height={rpx(260)}
            />
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
