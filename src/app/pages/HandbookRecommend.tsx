/**
 * HandbookRecommend - 阅读建议结果（图4-02）
 *
 * 基于问卷选择生成个性化阅读路径（静态模拟推荐，后台推荐系统为后续工作）。
 * 核心卡：建议从第 N 卷开始 + 理由；为你解锁：核心章节 / 推荐练习 / 延伸阅读。
 * 按钮：开始阅读 / 查看完整路径。
 */

import { useState, useEffect } from "react";
import { BookOpen, Target, BookMarked } from "lucide-react";
import { getRecommendation, VOLUME_CN } from "../config/handbook-v2-data";
import { FONT_SERIF, LIQUID_GLASS, rpx, HANDBOOK_BG } from "../config/styles";
import bgLayer2 from "@/assets/images/home/2-dingqi.webp";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
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
  const toast = useToast();
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
          subtitle="为你生成的个性化路径"
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
        {/* 副标题（两行居中） */}
        <div style={{ textAlign: "center", marginBottom: rpx(32) }}>
          <p
            style={{
              fontSize: rpx(24),
              color: SUB,
              margin: 0,
              letterSpacing: rpx(2),
            }}
          >
            基于你的选择
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
            为你生成个性化阅读路径
          </p>
        </div>

        {/* 液态玻璃主卡（含全部内容） */}
        <div
          style={{
            ...LIQUID_GLASS,
            borderRadius: rpx(40),
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* 顶部背景图（首页第二层） */}
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
            {/* 建议块（居中） */}
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(28),
                  color: SUB,
                  letterSpacing: rpx(2),
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
                }}
              >
                {rec.reason}
              </p>
            </div>

            {/* 将为你解锁（居中分隔） */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(20),
                margin: `${rpx(44)} 0 ${rpx(32)}`,
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
                  fontSize: rpx(26),
                  color: INK,
                  letterSpacing: rpx(3),
                }}
              >
                将为你解锁
              </span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(184,151,90,0.25)",
                }}
              />
            </div>

            {/* 核心阅读章节 */}
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

            {/* 推荐练习（合并为一个入口） */}
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

            {/* 延伸阅读 */}
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

            {/* 按钮（紧凑） */}
            <div
              style={{
                display: "flex",
                gap: rpx(20),
                margin: `${rpx(44)} 0 0`,
              }}
            >
              <PrimaryButton
                title="开始阅读"
                variant="filled"
                onClick={() => onStartReading?.(rec.volumeId)}
                style={{ flex: 1.4 }}
              />
              <PrimaryButton
                title="查看完整路径"
                onClick={() => toast.show("『完整路径』即将开放，敬请期待")}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>

        {/* 底部说明（液态玻璃卡外部） */}
        <p
          style={{
            fontSize: rpx(20),
            color: "#A8A498",
            margin: `${rpx(28)} 0 0`,
            textAlign: "center",
          }}
        >
          随时可在『我的路径』中调整
        </p>
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
