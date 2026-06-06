/**
 * NoteSheets - 章节笔记编辑抽屉
 *
 * ChapterNoteSheet：针对【整章内容】的笔记编辑器。打开即显示已有笔记可续写；
 * 提供字数上限与计数；点「保存」或收起抽屉（有改动时）都会写入本地存储。
 *
 * 说明：早先「长按段落 → 划线 / 写想法」的段落级交互已整体移除（移动端长按与滚动、
 * 合成点击易冲突，且段落级注解非平台核心需求）。笔记统一收敛到章节级。
 *
 * 复用 `BottomSheet`（柔和升起 / 降回）。
 */

import { useState, useEffect } from "react";
import { PenLine } from "lucide-react";
import { BottomSheet } from "../BottomSheet";
import { rpx, FONT_SERIF, GENTLE_EASE_OUT } from "../../../config/styles";
import { CHAPTER_NOTE_MAX } from "../../../hooks/useChapterNote";

const GOLD = "#B8975A";

function fmtDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

interface ChapterNoteSheetProps {
  visible: boolean;
  onClose: () => void;
  chapterTitle: string;
  initialText: string;
  updatedAt?: number;
  /** 保存（文本为空表示清除该章笔记）；点保存与「有改动时收起」都会触发 */
  onSave: (text: string) => void;
  night?: boolean;
}

export function ChapterNoteSheet({
  visible,
  onClose,
  chapterTitle,
  initialText,
  updatedAt,
  onSave,
  night = false,
}: ChapterNoteSheetProps) {
  const [draft, setDraft] = useState(initialText);

  useEffect(() => {
    if (visible) setDraft(initialText);
  }, [visible, initialText]);

  const panelBg = night ? "#1C1E22" : "#FBFAF7";
  const ink = night ? "rgba(255,255,255,0.86)" : "#1F1F1F";
  const sub = night ? "rgba(255,255,255,0.5)" : "#8A8170";
  const fieldBg = night ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.85)";

  const dirty = draft !== initialText;

  // 收起时若有改动则静默保存，避免用户输入丢失
  const handleClose = () => {
    if (dirty) onSave(draft.trim());
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      background={panelBg}
      maxHeight="82vh"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: rpx(12),
          marginBottom: rpx(8),
        }}
      >
        <PenLine size={20} color={GOLD} strokeWidth={1.7} />
        <span
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(32),
            fontWeight: 600,
            color: ink,
          }}
        >
          本章笔记
        </span>
      </div>
      <p
        style={{
          fontSize: rpx(22),
          color: sub,
          margin: `0 0 ${rpx(20)}`,
          fontFamily: FONT_SERIF,
        }}
      >
        《{chapterTitle}》
        {updatedAt ? ` · 上次记于 ${fmtDate(updatedAt)}` : ""}
      </p>

      <style>{`
        .hb-chapter-note::placeholder { color: ${
          night ? "rgba(255,255,255,0.32)" : "rgba(96,98,102,0.5)"
        }; opacity: 1; }
      `}</style>
      <textarea
        className="hb-chapter-note"
        value={draft}
        maxLength={CHAPTER_NOTE_MAX}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="写下你读这一章的想法、触动你的句子，或想留住的领悟"
        style={{
          width: "100%",
          minHeight: rpx(280),
          padding: rpx(24),
          borderRadius: rpx(20),
          border: "none",
          background: fieldBg,
          boxShadow: "0 2px 12px rgba(80,66,38,0.05)",
          fontFamily: FONT_SERIF,
          fontSize: rpx(26),
          lineHeight: 1.7,
          color: ink,
          resize: "none",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: rpx(10),
        }}
      >
        <span style={{ fontSize: rpx(20), color: sub }}>
          {draft.length} / {CHAPTER_NOTE_MAX}
        </span>
      </div>

      <button
        onClick={() => {
          onSave(draft.trim());
          onClose();
        }}
        style={{
          width: "100%",
          marginTop: rpx(16),
          padding: `${rpx(22)} 0`,
          borderRadius: rpx(28),
          border: "none",
          background: "linear-gradient(135deg, #D9B96A, #B8975A)",
          color: "#fff",
          fontFamily: FONT_SERIF,
          fontSize: rpx(26),
          fontWeight: 600,
          letterSpacing: rpx(2),
          cursor: "pointer",
          transition: `opacity 0.3s ${GENTLE_EASE_OUT}`,
        }}
      >
        保存笔记
      </button>
    </BottomSheet>
  );
}
