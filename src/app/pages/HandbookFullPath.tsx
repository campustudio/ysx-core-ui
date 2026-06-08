/**
 * HandbookFullPath - 完整路径（《人类手册》十卷旅程）
 *
 * 「完整路径」是所有人共有的那条**完整的、系统的**阅读之路：从卷一到卷十，
 * 一条竖向的旅程线。它回答「整体地图 + 我此刻在哪」。
 *   - 现有五卷可读、可点击进入；第六至十卷为「筹备中」占位（不臆造卷名，见设计文档 §6）。
 *   - 若来自「我的路径 / 阅读建议」，高亮你的**起点卷**，并显示各卷阅读进度。
 *
 * 它与「我的路径」的关系：我的路径 = 你在这条完整路径上的个人化切入点与路线。
 */

import { useEffect } from "react";
import { Check, Book } from "lucide-react";
import {
  V2_VOLUMES,
  VOLUME_CN,
  getVolumeProgressPercent,
} from "../config/handbook-v2-data";
import { FONT_SERIF, rpx, HANDBOOK_BG } from "../config/styles";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
  HANDBOOK_HEADER_ICON,
} from "../components/shared/HandbookHeader";
import { useBottomNav } from "../components/navigation/BottomNavContext";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";
const TOTAL_VOLUMES = 10;

interface HandbookFullPathProps {
  /** 高亮的起点卷 id（来自「我的路径」） */
  highlightVolumeId?: string;
  onBack?: () => void;
  onOpenVolume?: (volumeId: string) => void;
  /** 直达十卷书架 */
  onOpenShelf?: () => void;
}

export function HandbookFullPath({
  highlightVolumeId,
  onBack,
  onOpenVolume,
  onOpenShelf,
}: HandbookFullPathProps) {
  const navDock = useBottomNav();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 底部留白：有全局导航时为内容预留导航高度，避免末卷被遮挡
  const bottomReserve = navDock.present
    ? `calc(${navDock.height} + ${rpx(48)})`
    : `calc(env(safe-area-inset-bottom) + ${rpx(64)})`;

  // 十个站点：现有卷为可读站点，其余为「筹备中」占位
  const stations = Array.from({ length: TOTAL_VOLUMES }, (_, i) => {
    const num = i + 1;
    const vol = V2_VOLUMES.find((v) => v.volumeNumber === num);
    return { num, vol };
  });

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: HANDBOOK_BG,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HandbookHeader
        onBack={onBack}
        title="完整路径"
        subtitle="《人类手册》十卷 · 一条回到感知的路"
        withBackground
        rightContent={
          onOpenShelf ? (
            <button
              onClick={onOpenShelf}
              style={{
                background: "transparent",
                border: "none",
                padding: rpx(8),
                cursor: "pointer",
                display: "flex",
              }}
              aria-label="进入书架"
            >
              <Book size={20} color={HANDBOOK_HEADER_ICON} strokeWidth={1.6} />
            </button>
          ) : undefined
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(24)}) ${rpx(40)} ${bottomReserve}`,
        }}
      >
        <p
          style={{
            fontSize: rpx(24),
            color: SUB,
            lineHeight: 1.8,
            margin: `0 0 ${rpx(40)}`,
            textAlign: "center",
            letterSpacing: rpx(1),
          }}
        >
          十卷是一条完整的路。
          <br />
          你不必从头读起，从最贴近此刻的一卷进入即可。
        </p>

        <div style={{ position: "relative" }}>
          {stations.map((s, i) => {
            const available = !!s.vol;
            const highlighted = available && s.vol!.id === highlightVolumeId;
            const percent = available ? getVolumeProgressPercent(s.vol!.id) : 0;
            const started = percent > 0;
            const isLast = i === stations.length - 1;

            return (
              <div
                key={s.num}
                style={{ display: "flex", gap: rpx(24), position: "relative" }}
              >
                {/* 左：时间轴（连接线 + 节点） */}
                <div
                  style={{
                    flexShrink: 0,
                    width: rpx(40),
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: rpx(40),
                      height: rpx(40),
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: highlighted
                        ? GOLD
                        : available
                          ? "rgba(184,151,90,0.16)"
                          : "rgba(0,0,0,0.05)",
                      border: highlighted
                        ? "none"
                        : available
                          ? "1.5px solid rgba(184,151,90,0.45)"
                          : "1.5px solid rgba(0,0,0,0.08)",
                      color: highlighted ? "#fff" : available ? GOLD : "#BBB6AC",
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(20),
                      fontWeight: 600,
                    }}
                  >
                    {available && percent >= 100 ? (
                      <Check size={18} strokeWidth={2.4} />
                    ) : (
                      VOLUME_CN[i]
                    )}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        flex: 1,
                        width: rpx(3),
                        minHeight: rpx(40),
                        margin: `${rpx(6)} 0`,
                        borderRadius: rpx(2),
                        background: available
                          ? "rgba(184,151,90,0.3)"
                          : "rgba(0,0,0,0.06)",
                      }}
                    />
                  )}
                </div>

                {/* 右：卷卡 */}
                <div
                  onClick={available ? () => onOpenVolume?.(s.vol!.id) : undefined}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    marginBottom: rpx(24),
                    padding: `${rpx(24)} ${rpx(28)}`,
                    borderRadius: rpx(24),
                    cursor: available ? "pointer" : "default",
                    background: highlighted
                      ? "linear-gradient(135deg, rgba(184,151,90,0.12), rgba(233,216,166,0.05))"
                      : available
                        ? "#FFFFFF"
                        : "rgba(247,245,240,0.5)",
                    border: highlighted
                      ? "1.5px solid rgba(184,151,90,0.5)"
                      : "1px solid rgba(60,50,30,0.06)",
                    boxShadow: available
                      ? "0 6px 18px rgba(60,50,30,0.05)"
                      : "none",
                    opacity: available ? 1 : 0.7,
                  }}
                >
                  {highlighted && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: rpx(18),
                        color: "#fff",
                        background: GOLD,
                        borderRadius: rpx(12),
                        padding: `${rpx(2)} ${rpx(14)}`,
                        marginBottom: rpx(12),
                        letterSpacing: rpx(2),
                      }}
                    >
                      你的起点
                    </span>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: rpx(12),
                    }}
                  >
                    <span
                      style={{
                        fontSize: rpx(20),
                        color: available ? GOLD : "#BBB6AC",
                        fontFamily: FONT_SERIF,
                        letterSpacing: rpx(1),
                        flexShrink: 0,
                      }}
                    >
                      卷{VOLUME_CN[i]}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: rpx(28),
                        fontWeight: 600,
                        color: available ? INK : "#A8A398",
                        letterSpacing: rpx(1),
                      }}
                    >
                      {available ? s.vol!.title : "筹备中"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: rpx(22),
                      color: SUB,
                      margin: `${rpx(8)} 0 0`,
                      lineHeight: 1.6,
                    }}
                  >
                    {available ? s.vol!.oneLine : "第六至十卷正在筹备中"}
                  </p>

                  {available && started && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: rpx(12),
                        marginTop: rpx(16),
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: rpx(5),
                          background: "rgba(184,151,90,0.16)",
                          borderRadius: rpx(3),
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: "100%",
                            background: GOLD,
                            borderRadius: rpx(3),
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: rpx(18),
                          color: percent >= 100 ? GOLD : SUB,
                          fontFamily: FONT_SERIF,
                          flexShrink: 0,
                        }}
                      >
                        {percent >= 100 ? "已读完" : "阅读中"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
