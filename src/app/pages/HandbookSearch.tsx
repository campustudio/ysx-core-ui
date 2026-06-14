/**
 * HandbookSearch - 搜索 / 问手册（统一入口 · 结果页骨架）
 *
 * 本期只做「可见、可点、可输入、可进入」的入口与结果页骨架：
 *   - 顶部一个搜索/提问输入框（自然语言，如「我最近很焦虑怎么办」「从哪一卷开始读」）
 *   - 下方建议气泡，降低开口门槛
 *   - 提交后给出「智能伴读正在接入中」的温和占位 + 现有目的地快捷直达
 *
 * 真正的语义检索 + 明镜回应是后端能力，分阶段接入（见《明镜模块集成规划》）。
 * 气质：像「在问我们自己的 AI 伴读」，显眼但不喧宾夺主；柔和、克制、不制造焦虑。
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Search, Sparkles, Book, Map, Sun, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  FONT_SERIF,
  rpx,
  LIQUID_GLASS,
  HANDBOOK_BG,
  TEXT_ENGRAVED_SOFT,
} from "../config/styles";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

/** 建议气泡：接住「不知道怎么问」的人，覆盖常见困境 / 主题 / 入口 */
const SUGGESTIONS = [
  "我最近很焦虑怎么办",
  "什么是感知",
  "从哪一卷开始读",
  "亲密关系很痛苦",
  "死亡",
  "怎么开始练习",
];

interface QuickLink {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    id: "shelf",
    icon: Book,
    title: "系统阅读十卷母本",
    desc: "从第一卷开始，完整理解人类与感知",
  },
  {
    id: "entry",
    icon: Map,
    title: "生成我的阅读路径",
    desc: "根据你此刻状态，找到最适合的入口",
  },
  {
    id: "daily",
    icon: Sun,
    title: "今日一段",
    desc: "每天一段文字，一次回到感知的练习",
  },
];

interface HandbookSearchProps {
  initialQuery?: string;
  onBack?: () => void;
  onOpenShelf?: () => void;
  onOpenReadingEntry?: () => void;
  onOpenDaily?: () => void;
}

export function HandbookSearch({
  initialQuery,
  onBack,
  onOpenShelf,
  onOpenReadingEntry,
  onOpenDaily,
}: HandbookSearchProps) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [submitted, setSubmitted] = useState(!!initialQuery?.trim());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // 进入即聚焦，让用户可以直接开口提问（带建议气泡时仍可点气泡）
    if (!initialQuery) inputRef.current?.focus();
  }, [initialQuery]);

  const submit = useCallback((q: string) => {
    if (!q.trim()) return;
    setSubmitted(true);
  }, []);

  const handleQuickLink = useCallback(
    (id: string) => {
      if (id === "shelf") onOpenShelf?.();
      else if (id === "entry") onOpenReadingEntry?.();
      else if (id === "daily") onOpenDaily?.();
    },
    [onOpenShelf, onOpenReadingEntry, onOpenDaily],
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: HANDBOOK_BG,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 顶部：返回 + 搜索/提问输入框 */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: rpx(16),
          padding: `calc(env(safe-area-inset-top) + ${rpx(20)}) ${rpx(32)} ${rpx(20)}`,
        }}
      >
        <button
          onClick={onBack}
          aria-label="返回"
          style={{
            flexShrink: 0,
            width: rpx(64),
            height: rpx(64),
            borderRadius: rpx(40),
            background: "rgba(250,247,240,0.6)",
            backdropFilter: "blur(12px) saturate(1.1)",
            WebkitBackdropFilter: "blur(12px) saturate(1.1)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 2px 10px rgba(60,50,30,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <ArrowLeft size={20} color="#5A4B33" strokeWidth={1.8} />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
            inputRef.current?.blur();
          }}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: rpx(14),
            height: rpx(72),
            padding: `0 ${rpx(8)} 0 ${rpx(24)}`,
            borderRadius: rpx(40),
            // 通透玻璃：更亮珠光白 + 清晰高光边（0.5px 内描边锐化边缘，收紧外影）
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.6) 100%)",
            backdropFilter: "blur(14px) saturate(1.4)",
            WebkitBackdropFilter: "blur(14px) saturate(1.4)",
            border: "1px solid rgba(255,255,255,1)",
            boxShadow:
              "inset 0 1.5px 1.5px rgba(255,255,255,1), inset 0 0 0 0.5px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(150,125,75,0.10), 0 4px 14px rgba(60,50,30,0.08)",
          }}
        >
          <Search size={18} color={GOLD} strokeWidth={2} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索卷目、主题、问题、练习"
            enterKeyHint="search"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: rpx(28),
              color: INK,
              fontFamily: FONT_SERIF,
              letterSpacing: rpx(1),
            }}
          />
          {/* 可见的「提问/搜索」按钮：移动端点它即发起搜索（回车亦可） */}
          <button
            type="submit"
            aria-label="提问"
            style={{
              position: "relative",
              flexShrink: 0,
              width: rpx(58),
              height: rpx(58),
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.9)",
              cursor: "pointer",
              padding: 0,
              // 通透金宝珠：更亮高光中心 + 清晰边缘（亮描边 + 0.5px 内环），收紧外影避免糊边
              background:
                "radial-gradient(circle at 34% 27%, #FFF8E2 0%, #EFD7A0 30%, #CCA860 62%, #A8853F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "inset 0 2px 3px rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(255,255,255,0.55), inset 0 -3px 5px rgba(110,82,35,0.5), 0 2px 6px rgba(150,115,55,0.4)",
            }}
          >
            {/* 镜面高光点：增强通透/透亮立体感 */}
            <span
              style={{
                position: "absolute",
                top: "14%",
                left: "20%",
                width: "34%",
                height: "30%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 72%)",
              }}
            />
            <Sparkles
              size={18}
              color="#FFF7E6"
              strokeWidth={1.6}
              style={{
                position: "relative",
                filter: "drop-shadow(0 1px 1px rgba(120,90,40,0.5))",
              }}
            />
          </button>
        </form>
      </div>

      {/* 内容区（可滚动） */}
      <div style={{ flex: 1, overflowY: "auto", padding: `${rpx(16)} ${rpx(40)} ${rpx(80)}` }}>
        {/* 建议气泡：始终可见，降低开口门槛 */}
        <p
          style={{
            fontSize: rpx(22),
            color: SUB,
            margin: `${rpx(12)} 0 ${rpx(20)}`,
            letterSpacing: rpx(1),
          }}
        >
          试试这样问
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: rpx(16) }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                submit(s);
              }}
              style={{
                ...LIQUID_GLASS,
                border: "1px solid rgba(184,151,90,0.3)",
                borderRadius: rpx(40),
                padding: `${rpx(14)} ${rpx(26)}`,
                fontSize: rpx(24),
                color: "#5A4F3C",
                fontFamily: FONT_SERIF,
                letterSpacing: rpx(1),
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 提交后：智能伴读占位 + 现有目的地快捷直达 */}
        {submitted && (
          <div style={{ marginTop: rpx(56) }}>
            {/* 温和占位：说明智能伴读正在接入 */}
            <div
              style={{
                ...LIQUID_GLASS,
                borderRadius: rpx(32),
                padding: `${rpx(36)} ${rpx(32)}`,
                display: "flex",
                gap: rpx(20),
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: rpx(64),
                  height: rpx(64),
                  borderRadius: rpx(20),
                  background:
                    "linear-gradient(135deg, rgba(232,216,189,0.6), rgba(215,197,161,0.35))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={24} color={GOLD} strokeWidth={1.6} />
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
                  }}
                >
                  智能伴读正在接入中
                </p>
                <p
                  style={{
                    fontSize: rpx(22),
                    color: SUB,
                    margin: `${rpx(14)} 0 0`,
                    lineHeight: 1.8,
                    textShadow: TEXT_ENGRAVED_SOFT,
                  }}
                >
                  很快，你可以直接问它「{query.trim() || "我最近很焦虑怎么办"}
                  」，它会带你到对应的章节、练习与一段温和的回应。
                  在那之前，下面这些入口也许能先陪你走一段。
                </p>
              </div>
            </div>

            {/* 现有目的地快捷直达 */}
            <p
              style={{
                fontSize: rpx(22),
                color: SUB,
                margin: `${rpx(40)} 0 ${rpx(20)}`,
                letterSpacing: rpx(1),
              }}
            >
              你也许想先去
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: rpx(16) }}>
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleQuickLink(link.id)}
                    style={{
                      ...LIQUID_GLASS,
                      borderRadius: rpx(28),
                      padding: `${rpx(28)} ${rpx(28)}`,
                      display: "flex",
                      alignItems: "center",
                      gap: rpx(20),
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: rpx(56),
                        height: rpx(56),
                        borderRadius: rpx(18),
                        background: "rgba(184,151,90,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={20} color={GOLD} strokeWidth={1.6} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(28),
                          fontWeight: 600,
                          color: INK,
                          margin: 0,
                          letterSpacing: rpx(1),
                        }}
                      >
                        {link.title}
                      </p>
                      <p
                        style={{
                          fontSize: rpx(20),
                          color: SUB,
                          margin: `${rpx(6)} 0 0`,
                          lineHeight: 1.5,
                        }}
                      >
                        {link.desc}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      color={GOLD}
                      strokeWidth={1.8}
                      style={{ flexShrink: 0 }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
