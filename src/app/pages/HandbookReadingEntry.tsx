/**
 * HandbookReadingEntry - 找到我的阅读入口（图4-01）
 *
 * 用问题代替目录焦虑。主问「你现在最需要什么？」单选（点击微光扩散），
 * 主按钮「生成阅读建议」→ 阅读建议结果页（静态模拟推荐）。
 */

import { useState, useEffect, useCallback } from "react";
import {
  Check,
  User,
  BookOpen,
  HeartCrack,
  Layers,
  PencilLine,
  CalendarDays,
} from "lucide-react";
import { ENTRY_OPTIONS } from "../config/handbook-v2-data";
import {
  FONT_SERIF,
  LIQUID_GLASS,
  rpx,
  TEXT_ENGRAVED,
  ICON_ENGRAVED,
  HANDBOOK_BG,
} from "../config/styles";
import bgLayer1 from "@/assets/images/human-manual/home-top.webp";
import { Toast } from "../components/shared/Toast";
import { PrimaryButton } from "../components/shared/PrimaryButton";
import { useToast } from "../hooks/useToast";
import {
  HandbookHeader,
  HANDBOOK_HEADER_HEIGHT,
  HANDBOOK_HEADER_ICON,
} from "../components/shared/HandbookHeader";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

const OPTION_ICONS = [BookOpen, HeartCrack, Layers, PencilLine, CalendarDays];

interface HandbookReadingEntryProps {
  onBack?: () => void;
  onGenerate?: (optionId: string) => void;
}

export function HandbookReadingEntry({
  onBack,
  onGenerate,
}: HandbookReadingEntryProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = useCallback(() => {
    if (selected) onGenerate?.(selected);
  }, [selected, onGenerate]);

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
        transition: "opacity 0.5s ease",
      }}
    >
      {/* 顶部背景图（占满屏幕） */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
          backgroundImage: `url(${bgLayer1})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          pointerEvents: "none",
        }}
      />

      <HandbookHeader
        onBack={onBack}
        title="人类手册管"
        subtitle="看见真相，回到生命本身"
        rightContent={
          <button
            onClick={() => toast.show("个人中心即将开放")}
            style={{
              background: "transparent",
              border: "none",
              padding: rpx(8),
              cursor: "pointer",
              display: "flex",
            }}
          >
            <User size={20} color={HANDBOOK_HEADER_ICON} strokeWidth={1.6} />
          </button>
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `calc(${HANDBOOK_HEADER_HEIGHT} + ${rpx(40)}) ${rpx(48)} ${rpx(260)}`,
        }}
      >
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(52),
            fontWeight: 600,
            color: INK,
            letterSpacing: rpx(4),
            margin: 0,
            lineHeight: 1.4,
            textAlign: "center",
          }}
        >
          你现在最需要什么？
        </h1>

        <div
          style={{
            marginTop: rpx(48),
            display: "flex",
            flexDirection: "column",
            gap: rpx(22),
          }}
        >
          {ENTRY_OPTIONS.map((opt, i) => {
            const active = selected === opt.id;
            const Icon = OPTION_ICONS[i] ?? BookOpen;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                style={{
                  ...LIQUID_GLASS,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: rpx(20),
                  width: "100%",
                  textAlign: "left",
                  padding: `${rpx(30)} ${rpx(34)}`,
                  borderRadius: rpx(32),
                  ...(active
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(184,151,90,0.22), rgba(233,216,166,0.1))",
                        borderTop: "1px solid rgba(184,151,90,0.55)",
                        borderLeft: "1px solid rgba(184,151,90,0.4)",
                        borderRight: "1px solid rgba(184,151,90,0.3)",
                        borderBottom: "1px solid rgba(184,151,90,0.35)",
                        boxShadow: "0 8px 28px rgba(184,151,90,0.18)",
                      }
                    : {}),
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: rpx(20),
                    minWidth: 0,
                  }}
                >
                  <Icon
                    size={22}
                    color={GOLD}
                    strokeWidth={1.6}
                    style={{ flexShrink: 0, filter: ICON_ENGRAVED }}
                  />
                  <span
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(30),
                      color: active ? INK : "#3A3A3A",
                      letterSpacing: rpx(1),
                      textShadow: TEXT_ENGRAVED,
                    }}
                  >
                    {opt.label}
                  </span>
                </span>
                <span
                  style={{
                    width: rpx(44),
                    height: rpx(44),
                    borderRadius: "50%",
                    flexShrink: 0,
                    border: active
                      ? "none"
                      : "1.5px solid rgba(120,110,90,0.3)",
                    background: active ? GOLD : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.25s ease",
                  }}
                >
                  {active && (
                    <Check
                      size={18}
                      color="#fff"
                      strokeWidth={2.4}
                      style={{ filter: ICON_ENGRAVED }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 底部主按钮 */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          padding: `${rpx(24)} ${rpx(48)} calc(env(safe-area-inset-bottom) + ${rpx(32)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: rpx(14),
        }}
      >
        <PrimaryButton
          title="生成阅读建议"
          variant="filled"
          disabled={!selected}
          onClick={handleGenerate}
        />
        <span style={{ fontSize: rpx(20), color: SUB, letterSpacing: rpx(1) }}>
          基于你的选择，生成个性化阅读路径
        </span>
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
