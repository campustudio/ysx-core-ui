/**
 * ReaderSettingsSheet - 阅读设置面板（字号 / 行距 / 主题 / 字体）
 *
 * 收口阅读器顶栏「…更多」入口，替代原 toast 占位。
 * 复用 `BottomSheet`（柔和升起 / 降回），所有切换即时生效并本地持久化。
 */

import { Type } from "lucide-react";
import { BottomSheet } from "../BottomSheet";
import { rpx, FONT_SERIF, GENTLE_EASE_OUT } from "../../../config/styles";
import {
  type ReaderPrefs,
  type ReaderTheme,
  READER_FONT_LABELS,
  READER_LINE_LABELS,
} from "../../../hooks/useReaderPrefs";

const GOLD = "#B8975A";

const THEME_OPTIONS: { id: ReaderTheme; label: string; swatch: string }[] = [
  { id: "day", label: "日间", swatch: "#F7F5F0" },
  { id: "sepia", label: "纸黄", swatch: "#F3E9D6" },
  { id: "night", label: "夜间", swatch: "#16181C" },
];

interface ReaderSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  prefs: ReaderPrefs;
  onChange: (patch: Partial<ReaderPrefs>) => void;
  night: boolean;
}

export function ReaderSettingsSheet({
  visible,
  onClose,
  prefs,
  onChange,
  night,
}: ReaderSettingsSheetProps) {
  const panelBg = night ? "#1C1E22" : "#FBFAF7";
  const ink = night ? "rgba(255,255,255,0.86)" : "#1F1F1F";
  const sub = night ? "rgba(255,255,255,0.5)" : "#8A8170";
  const trackBg = night ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)";
  const selBg = night ? "rgba(184,151,90,0.28)" : "rgba(184,151,90,0.16)";

  const segmentBtn = (selected: boolean) =>
    ({
      flex: 1,
      padding: `${rpx(16)} 0`,
      border: "none",
      borderRadius: rpx(16),
      background: selected ? selBg : "transparent",
      color: selected ? GOLD : ink,
      fontFamily: FONT_SERIF,
      fontSize: rpx(24),
      fontWeight: selected ? 600 : 400,
      cursor: "pointer",
      transition: `background 0.3s ${GENTLE_EASE_OUT}, color 0.3s ease`,
    }) as const;

  const rowLabel = (text: string) => (
    <p
      style={{
        fontSize: rpx(22),
        color: sub,
        margin: `0 0 ${rpx(14)}`,
        letterSpacing: rpx(1),
      }}
    >
      {text}
    </p>
  );

  const Segmented = ({
    labels,
    active,
    onSelect,
  }: {
    labels: readonly string[];
    active: number;
    onSelect: (i: number) => void;
  }) => (
    <div
      style={{
        display: "flex",
        gap: rpx(8),
        background: trackBg,
        borderRadius: rpx(20),
        padding: rpx(6),
      }}
    >
      {labels.map((l, i) => (
        <button
          key={l}
          onClick={() => onSelect(i)}
          style={segmentBtn(active === i)}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      background={panelBg}
      maxHeight="80vh"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: rpx(12),
          marginBottom: rpx(32),
        }}
      >
        <Type size={20} color={GOLD} strokeWidth={1.6} />
        <span
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(32),
            fontWeight: 600,
            color: ink,
          }}
        >
          阅读设置
        </span>
      </div>

      <div style={{ marginBottom: rpx(36) }}>
        {rowLabel("字号")}
        <Segmented
          labels={READER_FONT_LABELS}
          active={prefs.fontIdx}
          onSelect={(i) => onChange({ fontIdx: i })}
        />
      </div>

      <div style={{ marginBottom: rpx(36) }}>
        {rowLabel("行距")}
        <Segmented
          labels={READER_LINE_LABELS}
          active={prefs.lineIdx}
          onSelect={(i) => onChange({ lineIdx: i })}
        />
      </div>

      <div style={{ marginBottom: rpx(36) }}>
        {rowLabel("正文字体")}
        <Segmented
          labels={["黑体", "宋体"]}
          active={prefs.serifBody ? 1 : 0}
          onSelect={(i) => onChange({ serifBody: i === 1 })}
        />
      </div>

      <div>
        {rowLabel("阅读主题")}
        <div style={{ display: "flex", gap: rpx(20) }}>
          {THEME_OPTIONS.map((t) => {
            const selected = prefs.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange({ theme: t.id })}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: rpx(12),
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: rpx(96),
                    height: rpx(96),
                    borderRadius: rpx(24),
                    background: t.swatch,
                    border: selected
                      ? `2px solid ${GOLD}`
                      : `1px solid ${night ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.1)"}`,
                    boxShadow: selected
                      ? "0 4px 14px rgba(184,151,90,0.28)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                    transition: `border 0.3s ${GENTLE_EASE_OUT}, box-shadow 0.3s ease`,
                  }}
                />
                <span
                  style={{
                    fontSize: rpx(22),
                    fontFamily: FONT_SERIF,
                    color: selected ? GOLD : sub,
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}
