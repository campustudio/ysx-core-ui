/**
 * HandbookMyPath - 我的路径（个人、可保存、可调整的阅读路线）
 *
 * 「阅读建议」生成的路线会存为**我的路径**，用户可随时回到这里查看与调整。
 *   - 你的起点：建议起始卷 + 理由 + 阅读进度 + 开始/继续阅读
 *   - 这条路径上：核心章节 / 推荐练习 / 延伸阅读（沿用阅读建议的路径语言，非「解锁」）
 *   - 完整路径：进入十卷全景，看清自己在整条路上的位置
 *   - 调整路径：重新回答阅读入口，重新铺一条路（人拥有选择，非算法黑箱）
 *
 * 未生成路径时给出温和的空状态，引导去「找到我的阅读入口」。
 */

import { useEffect } from "react";
import {
  BookOpen,
  Target,
  BookMarked,
  Map,
  RefreshCw,
  Book,
} from "lucide-react";
import {
  VOLUME_CN,
  getVolumeProgressPercent,
} from "../config/handbook-v2-data";
import { useReadingPath } from "../hooks/useReadingPath";
import {
  FONT_SERIF,
  LIQUID_GLASS,
  TEXT_ENGRAVED,
  rpx,
  HANDBOOK_BG,
} from "../config/styles";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
  HANDBOOK_HEADER_ICON,
} from "../components/shared/HandbookHeader";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { VolumeBookCover } from "../components/shared/VolumeBookCover";
import { useBottomNav } from "../components/navigation/BottomNavContext";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookMyPathProps {
  onBack?: () => void;
  onStartReading?: (volumeId: string, chapterId?: string) => void;
  onOpenVolume?: (volumeId: string) => void;
  onOpenPractice?: (volumeId: string, chapterId: string) => void;
  onOpenFullPath?: (highlightVolumeId?: string) => void;
  /** 重新选择阅读入口（调整路径 / 空状态 CTA） */
  onReselect?: () => void;
  /** 直达十卷书架 */
  onOpenShelf?: () => void;
}

export function HandbookMyPath({
  onBack,
  onStartReading,
  onOpenVolume,
  onOpenPractice,
  onOpenFullPath,
  onReselect,
  onOpenShelf,
}: HandbookMyPathProps) {
  const { path, hasPath } = useReadingPath();
  const navDock = useBottomNav();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 底部留白：有全局导航时为内容预留导航高度，避免末条内容被遮挡
  const bottomReserve = navDock.present
    ? `calc(${navDock.height} + ${rpx(48)})`
    : `calc(env(safe-area-inset-bottom) + ${rpx(64)})`;

  const sectionTitle = (Icon: typeof Target, text: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: rpx(12),
        marginBottom: rpx(14),
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
        <span style={{ fontSize: rpx(20), color: "#C7B98E", fontFamily: FONT_SERIF }}>
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
      }}
    >
      <HandbookHeader
        onBack={onBack}
        title="我的路径"
        subtitle="你的个人阅读路线 · 可随时调整"
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
        {!hasPath || !path ? (
          // ── 空状态：尚未生成路径 ──
          <div
            style={{
              marginTop: rpx(120),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Map size={40} color={GOLD} strokeWidth={1.3} />
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(34),
                fontWeight: 600,
                color: INK,
                margin: `${rpx(28)} 0 0`,
                letterSpacing: rpx(2),
              }}
            >
              你还没有自己的路径
            </p>
            <p
              style={{
                fontSize: rpx(24),
                color: SUB,
                margin: `${rpx(16)} 0 ${rpx(48)}`,
                lineHeight: 1.8,
                maxWidth: rpx(460),
              }}
            >
              回答一个问题，我们就为你铺开一条
              <br />
              贴近此刻的阅读路线。
            </p>
            <div style={{ width: rpx(420), maxWidth: "100%" }}>
              <PrimaryButton
                title="找到我的阅读入口"
                variant="filled"
                onClick={onReselect}
              />
            </div>
          </div>
        ) : (
          <>
            {/* ── 你的起点 ── */}
            <div
              style={{
                ...LIQUID_GLASS,
                borderRadius: rpx(32),
                padding: `${rpx(36)} ${rpx(32)}`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(24),
                  color: GOLD,
                  letterSpacing: rpx(2),
                  textShadow: TEXT_ENGRAVED,
                }}
              >
                你的起点
              </span>
              <div
                style={{
                  display: "flex",
                  gap: rpx(24),
                  alignItems: "center",
                  margin: `${rpx(20)} 0 0`,
                }}
              >
                <div style={{ width: rpx(96), flexShrink: 0 }}>
                  <VolumeBookCover
                    volumeNumber={path.volumeNumber}
                    volumeCn={VOLUME_CN[path.volumeNumber - 1]}
                    height={rpx(128)}
                    compact
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(30),
                      fontWeight: 600,
                      color: INK,
                      margin: 0,
                      letterSpacing: rpx(1),
                      textShadow: TEXT_ENGRAVED,
                    }}
                  >
                    第{VOLUME_CN[path.volumeNumber - 1]}卷
                  </p>
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(26),
                      color: GOLD,
                      margin: `${rpx(6)} 0 0`,
                      letterSpacing: rpx(1),
                    }}
                  >
                    《{path.volumeTitle}》
                  </p>
                  {(() => {
                    const percent = getVolumeProgressPercent(path.volumeId);
                    return (
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
                            color: SUB,
                            fontFamily: FONT_SERIF,
                            flexShrink: 0,
                          }}
                        >
                          {percent >= 100
                            ? "已读完"
                            : percent > 0
                              ? "阅读中"
                              : "未开始"}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
              <p
                style={{
                  fontSize: rpx(23),
                  color: SUB,
                  margin: `${rpx(20)} 0 0`,
                  lineHeight: 1.75,
                }}
              >
                {path.reason}
              </p>
              <div style={{ marginTop: rpx(28) }}>
                <PrimaryButton
                  title={
                    getVolumeProgressPercent(path.volumeId) > 0
                      ? "继续阅读"
                      : "开始阅读"
                  }
                  variant="filled"
                  onClick={() => onStartReading?.(path.volumeId)}
                />
              </div>
            </div>

            {/* ── 这条路径上 ── */}
            <div style={{ marginTop: rpx(44) }}>
              {sectionTitle(BookOpen, "核心阅读章节")}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: `0 0 ${rpx(28)} ${rpx(30)}`,
                }}
              >
                {path.coreChapters.map((c) =>
                  entryRow(c.label, () =>
                    onStartReading?.(c.volumeId, c.chapterId),
                  ),
                )}
              </div>

              {sectionTitle(Target, "推荐练习")}
              <div style={{ margin: `0 0 ${rpx(28)} ${rpx(30)}` }}>
                {entryRow(path.practices.join(" · "), () => {
                  if (path.coreChapters.length > 0 && onOpenPractice) {
                    onOpenPractice(
                      path.coreChapters[0].volumeId,
                      path.coreChapters[0].chapterId,
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
                {path.extendedReading.map((e) =>
                  entryRow(e.label, () => onOpenVolume?.(e.volumeId)),
                )}
              </div>
            </div>

            {/* ── 完整路径入口 ── */}
            <button
              type="button"
              onClick={() => onOpenFullPath?.(path.volumeId)}
              style={{
                width: "100%",
                marginTop: rpx(44),
                display: "flex",
                alignItems: "center",
                gap: rpx(16),
                padding: `${rpx(24)} ${rpx(28)}`,
                borderRadius: rpx(24),
                background: "rgba(184,151,90,0.06)",
                border: "1.5px solid rgba(233,216,166,0.6)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Map size={22} color={GOLD} strokeWidth={1.6} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(27),
                    fontWeight: 600,
                    color: INK,
                    margin: 0,
                    letterSpacing: rpx(1),
                  }}
                >
                  查看完整路径
                </p>
                <p style={{ fontSize: rpx(20), color: SUB, margin: `${rpx(6)} 0 0` }}>
                  十卷全景 · 看清自己在整条路上的位置
                </p>
              </div>
              <span style={{ fontSize: rpx(24), color: "#C7B98E" }}>→</span>
            </button>

            {/* ── 调整路径 ── */}
            <button
              type="button"
              onClick={onReselect}
              style={{
                width: "100%",
                marginTop: rpx(24),
                padding: `${rpx(18)} 0`,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: rpx(10),
                color: SUB,
                fontSize: rpx(23),
                fontFamily: FONT_SERIF,
                letterSpacing: rpx(1),
              }}
            >
              <RefreshCw size={16} color={SUB} strokeWidth={1.6} />
              重新选择阅读入口，换一条路
            </button>

            <p
              style={{
                fontSize: rpx(20),
                color: "#A8A498",
                margin: `${rpx(20)} 0 0`,
                textAlign: "center",
                lineHeight: 1.7,
              }}
            >
              这条路径只属于你，随时可以调整或换卷阅读
            </p>
          </>
        )}
      </div>
    </div>
  );
}
