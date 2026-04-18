/**
 * PracticePage - 新人生之路践行引导页 (version 3.0 - 纯引导模式)
 *
 * 基于第五卷设计原则：
 * - 践行不是任务，是"在"的提醒
 * - 没有"开始"和"结束"，只有引导
 * - 看完引导，回到生活中践行
 * - "在"优先于"做"
 */

import { useEffect, useState } from "react";
import { Edit3 } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import {
  PageHeader,
  PAGE_HEADER_HEIGHT,
} from "../components/shared/PageHeader";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

/** 践行引导配置 */
const PRACTICE_CONFIG: Record<
  string,
  {
    title: string;
    guidance: string;
    hint?: string;
  }
> = {
  // === 开始践行入口 ===
  p1: {
    title: "每日状态确认",
    guidance:
      "此刻，感受一下自己。\n\n身体感觉如何？\n有什么情绪在？\n你有多少程度真正在这里？",
    hint: "不是为了改变什么，只是为了看见。",
  },
  p2: {
    title: "践行提醒",
    guidance:
      "在日常中，记得『在』。\n\n吃饭时，真的在吃饭。\n说话时，真的在说话。\n走路时，真的在走路。",
    hint: "这不是任务，只是轻轻的提醒。",
  },
  p3: {
    title: "状态记录",
    guidance:
      "给自己一个空间，\n记录真实的状态。\n\n不需要写得完美，\n让它自然流出来。",
    hint: "与自己对话的空间。",
  },

  // === 身体维度 ===
  "body-1": {
    title: "身体扫描",
    guidance:
      "闭上眼睛，\n感受此刻的身体。\n\n从头顶开始，\n慢慢向下，\n感受每一个部位。\n\n不需要改变什么，\n只是感受。",
    hint: "重新回到身体里。",
  },
  "body-2": {
    title: "饮食觉察",
    guidance:
      "在下一餐中，\n试着真正地吃。\n\n看见食物的颜色，\n闻到它的气味，\n感受每一口的味道。\n\n注意身体的信号。",
    hint: "我们每天都在吃，但很少真正在吃。",
  },
  "body-3": {
    title: "运动感知",
    guidance:
      "在下一次运动中，\n把注意力放在身体内部。\n\n感受肌肉的收缩和放松，\n感受呼吸的自然配合，\n感受身体的活力。",
    hint: "不是为了燃烧卡路里，而是感受身体。",
  },

  // === 情绪维度 ===
  "emotion-1": {
    title: "情绪命名",
    guidance:
      "此刻有什么情绪？\n\n不要急着回答，\n真正去感受。\n\n它在身体的哪个位置？\n给它一个名字。\n\n告诉它：我看见你了。",
    hint: "命名是看见的开始。",
  },
  "emotion-2": {
    title: "情绪日记",
    guidance:
      "今天经历了哪些情绪？\n\n它们是如何流动的？\n从哪里来，到哪里去？\n\n情绪是流动的能量，\n不需要抓住。",
    hint: "通过记录，看见情绪的模式。",
  },

  // === 思维维度 ===
  "mind-1": {
    title: "念头观察",
    guidance:
      "找一个安静的地方，\n坐下来。\n\n看着念头来来去去，\n不参与，不评判，\n只是看着。\n\n你不是你的念头。",
    hint: "当你能观察念头，你就开始从念头中解脱。",
  },

  // === 关系维度 ===
  "relation-1": {
    title: "深度倾听",
    guidance:
      "在下一次对话中，\n试着只是听。\n\n放下准备回应的念头，\n放下评判，\n全部注意力放在对方身上。\n\n听他们的话，\n也感受他们的情绪。",
    hint: "我们常常在听的时候已经在准备回应。",
  },
};

interface PracticePageProps {
  practiceId: string;
  onBack?: () => void;
}

export function PracticePage({ practiceId, onBack }: PracticePageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");
  const toast = useToast();

  const config = PRACTICE_CONFIG[practiceId] || {
    title: "践行",
    guidance: "此刻，感受自己。",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);

    // 进入页面即记录一次践行（“在”的见证）
    const now = new Date();
    const record = {
      id: `p-${Date.now()}`,
      practiceId,
      title: config.title,
      timestamp: now.toISOString(),
      type: "presence", // 在场类型
    };
    // 存储到localStorage
    const existing = JSON.parse(
      localStorage.getItem("practice_records") || "[]",
    );
    existing.unshift(record);
    localStorage.setItem(
      "practice_records",
      JSON.stringify(existing.slice(0, 100)),
    );

    return () => clearTimeout(timer);
  }, [practiceId, config.title]);

  const handleSaveNote = () => {
    if (note.trim()) {
      // 保存笔记到记录
      const records = JSON.parse(
        localStorage.getItem("practice_records") || "[]",
      );
      if (records.length > 0) {
        records[0].note = note.trim();
        localStorage.setItem("practice_records", JSON.stringify(records));
      }
      toast.show("已记录你的感受");
      setShowNoteInput(false);
      setNote("");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FAFAFA",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <PageHeader onBack={onBack} />
      <div style={{ paddingTop: PAGE_HEADER_HEIGHT }} />

      {/* 引导内容 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: `0 ${rpx(48)} ${rpx(80)}`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(40),
            fontWeight: 600,
            color: "#18181A",
            letterSpacing: rpx(4),
            margin: 0,
            marginBottom: rpx(48),
          }}
        >
          {config.title}
        </h1>

        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(28),
            color: "#333",
            lineHeight: 2.2,
            maxWidth: rpx(560),
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {config.guidance}
        </p>

        {config.hint && (
          <p
            style={{
              fontSize: rpx(22),
              color: "#999",
              marginTop: rpx(48),
              fontStyle: "italic",
            }}
          >
            {config.hint}
          </p>
        )}
      </div>

      {/* 记录感受区 */}
      {!showNoteInput ? (
        <div
          style={{
            padding: `${rpx(24)} ${rpx(48)}`,
            textAlign: "center",
          }}
        >
          <button
            onClick={() => setShowNoteInput(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: rpx(8),
              padding: `${rpx(14)} ${rpx(24)}`,
              fontSize: rpx(20),
              color: "#666",
              background: "rgba(0,0,0,0.04)",
              border: "none",
              borderRadius: rpx(24),
              cursor: "pointer",
            }}
          >
            <Edit3 size={16} strokeWidth={1.5} />
            记录此刻感受
          </button>
        </div>
      ) : (
        <div style={{ padding: `0 ${rpx(48)} ${rpx(24)}` }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="此刻有什么想记录的..."
            style={{
              width: "100%",
              minHeight: rpx(120),
              padding: rpx(20),
              fontSize: rpx(22),
              color: "#333",
              background: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: rpx(16),
              resize: "none",
              fontFamily: "inherit",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: rpx(16),
              marginTop: rpx(16),
            }}
          >
            <button
              onClick={() => {
                setShowNoteInput(false);
                setNote("");
              }}
              style={{
                padding: `${rpx(12)} ${rpx(24)}`,
                fontSize: rpx(20),
                color: "#999",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              取消
            </button>
            <button
              onClick={handleSaveNote}
              style={{
                padding: `${rpx(12)} ${rpx(24)}`,
                fontSize: rpx(20),
                color: "#fff",
                background: "#5B8B7A",
                border: "none",
                borderRadius: rpx(20),
                cursor: "pointer",
              }}
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 底部提示 */}
      <div
        style={{
          padding: `${rpx(24)} ${rpx(48)} calc(env(safe-area-inset-bottom) + ${rpx(32)})`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: rpx(20),
            color: "#BBB",
          }}
        >
          看完后，回到生活中践行
        </p>
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2000}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
