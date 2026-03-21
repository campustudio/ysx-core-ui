/**
 * 沉浸呼吸页 - 元思想（白绿生命力系）
 *
 * 从首页呼吸圆环（收/清）点击进入的全屏沉浸式呼吸体验
 * 视觉：白→浅鼠尾草绿渐变，像晨光穿过树叶的光感
 *
 * 三个阶段：
 *   ① 准备  — 大圆环 + 环境音效选择 + 时长选择 + "开始"
 *   ② 呼吸中 — 圆环呼吸 + 倒计时 + 吸/呼提示 + 背景音效循环
 *   ③ 完成  — 音效渐出 + 温暖的完成语 + 返回按钮
 *
 * 环境音效接入：
 *   将 mp3 文件放置到 /public/audio/ 目录即可生效：
 *     ambient-rain.mp3 / ambient-ocean.mp3 / ambient-forest.mp3 / ambient-wind.mp3
 *
 * Props:
 *   - onBack: 返回首页
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import {
  DURATION_OPTIONS,
  DEFAULT_DURATION_ID,
  DEFAULT_AMBIENT_ID,
  AMBIENT_SOUNDS,
  AMBIENT_FADE_OUT_MS,
  COMPLETION_MESSAGES,
  DEFAULT_COMPLETION,
} from "../config/breathing-data";
import { ImmersiveBreathingCircle } from "../components/breathing/ImmersiveBreathingCircle";
import { AmbientSoundPicker } from "../components/breathing/AmbientSoundPicker";
import { useAmbientAudio } from "../components/breathing/useAmbientAudio";

type Phase = "ready" | "breathing" | "complete";

interface Props {
  onBack?: () => void;
}

export function BreathingSession({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [selectedId, setSelectedId] = useState(DEFAULT_DURATION_ID);
  const [ambientId, setAmbientId] = useState(DEFAULT_AMBIENT_ID);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ambient = useAmbientAudio();

  const selectedOption =
    DURATION_OPTIONS.find((o) => o.id === selectedId) || DURATION_OPTIONS[0];
  const completion =
    COMPLETION_MESSAGES[selectedId] || DEFAULT_COMPLETION;
  const ambientSrc =
    AMBIENT_SOUNDS.find((s) => s.id === ambientId)?.src || "";

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStart = useCallback(() => {
    setRemaining(selectedOption.seconds);
    setPhase("breathing");
    if (ambientSrc) {
      ambient.play(ambientSrc);
    }
  }, [selectedOption, ambientSrc, ambient]);

  const handleBack = useCallback(() => {
    ambient.fadeOut(AMBIENT_FADE_OUT_MS);
    onBack?.();
  }, [ambient, onBack]);

  useEffect(() => {
    if (phase !== "breathing") {
      clearTimer();
      return;
    }
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          ambient.fadeOut(AMBIENT_FADE_OUT_MS);
          setPhase("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, clearTimer, ambient]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  /* ── 浅绿生命力色系 ── */
  const textPrimary = "#3A4A38";       /* 深苔绿 — 主文字 */
  const textSecondary = "rgba(58,74,56,0.55)"; /* 中等 — 副文字 */
  const textTertiary = "rgba(58,74,56,0.32)";  /* 淡 — 辅助信息 */
  const accentGreen = "#6B8F63";       /* 鼠尾草绿深一度 — 按钮/高亮 */

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        /* 白 → 浅鼠尾草绿渐变，生命力基底 */
        background:
          "linear-gradient(175deg, #FAFCF9 0%, #F0F6ED 30%, #E6F0E2 55%, #EBF3E8 80%, #F4F8F2 100%)",
      }}
    >
      {/* ═══ 氛围动画定义 ═══ */}
      <style>{`
        @keyframes bs-particle {
          0%, 100% { opacity: var(--p-min); transform: scale(0.8) translateY(0); }
          50%      { opacity: var(--p-max); transform: scale(1.2) translateY(-3px); }
        }
        @keyframes bs-glow-breathe {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95); }
          50%      { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes bs-fade-in {
          from { opacity: 0; transform: translateY(${rpx(20)}); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bs-fade-in-slow {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* 中心生命光域 — 大面积柔和绿光晕 */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          width: rpx(800),
          height: rpx(800),
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(139,170,125,0.12) 0%, rgba(139,170,125,0.05) 35%, rgba(196,154,108,0.03) 55%, transparent 75%)",
          animation: "bs-glow-breathe 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* 顶部白光 — 晨光从上方洒下 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 底部浅绿加深 — 像草地 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "15%",
          background:
            "linear-gradient(to top, rgba(139,170,125,0.06) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 光斑粒子 — 像树叶间漏下的光 */}
      {Array.from({ length: 10 }).map((_, i) => {
        const isWarm = i % 3 === 0; /* 每三颗一个暖金色，其余绿色 */
        return (
          <div
            key={`p-${i}`}
            style={{
              position: "absolute",
              left: `${8 + ((i * 29 + 13) % 84)}%`,
              top: `${6 + ((i * 37 + 9) % 88)}%`,
              width: rpx(2.5 + (i % 3) * 1),
              height: rpx(2.5 + (i % 3) * 1),
              borderRadius: "50%",
              background: isWarm
                ? "radial-gradient(circle, rgba(196,174,128,0.8) 0%, rgba(196,154,108,0.3) 100%)"
                : "radial-gradient(circle, rgba(139,170,125,0.7) 0%, rgba(139,170,125,0.25) 100%)",
              // @ts-expect-error CSS custom property
              "--p-min": 0.06 + (i % 3) * 0.04,
              // @ts-expect-error CSS custom property
              "--p-max": 0.25 + (i % 4) * 0.08,
              animation: `bs-particle ${7 + (i % 4) * 2}s ease-in-out ${i * 0.7}s infinite`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ═══ 关闭按钮 ═══ */}
      <div
        className="cursor-pointer"
        onClick={handleBack}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 10,
          paddingTop: `calc(max(${rpx(24)}, env(safe-area-inset-top)) + ${rpx(4)})`,
          paddingRight: rpx(28),
          paddingLeft: rpx(28),
          paddingBottom: rpx(28),
        }}
      >
        <X
          style={{
            width: rpx(40),
            height: rpx(40),
            color: textTertiary,
          }}
          strokeWidth={1.5}
        />
      </div>

      {/* ═══ 内容层 ═══ */}
      <div
        className="relative flex flex-col items-center justify-center h-full"
        style={{ zIndex: 2 }}
      >
        {/* ── 阶段：准备 ── */}
        {phase === "ready" && (
          <div
            className="flex flex-col items-center"
            style={{
              animation: "bs-fade-in 0.8s ease-out both",
              gap: rpx(16),
            }}
          >
            {/* 引导语 */}
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(26),
                fontWeight: 400,
                color: textSecondary,
                letterSpacing: rpx(4),
                lineHeight: 1,
                marginBottom: rpx(16),
              }}
            >
              找到舒适的姿势，准备好了吗
            </p>

            {/* 呼吸圆环 */}
            <ImmersiveBreathingCircle isActive={false} />

            {/* 环境音效选择 */}
            <div style={{ marginTop: rpx(20) }}>
              <AmbientSoundPicker
                selectedId={ambientId}
                onChange={setAmbientId}
              />
            </div>

            {/* 时长选择 */}
            <div
              className="flex items-center justify-center"
              style={{ gap: rpx(20), marginTop: rpx(16) }}
            >
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = opt.id === selectedId;
                return (
                  <div
                    key={opt.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(opt.id)}
                    style={{
                      padding: `${rpx(12)} ${rpx(28)}`,
                      borderRadius: rpx(30),
                      background: isSelected
                        ? "rgba(139,170,125,0.18)"
                        : "rgba(139,170,125,0.06)",
                      boxShadow: isSelected
                        ? "0 2px 12px rgba(139,170,125,0.12), inset 0 1px 0 rgba(255,255,255,0.5)"
                        : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: rpx(24),
                        fontWeight: 400,
                        color: isSelected ? textPrimary : textTertiary,
                        letterSpacing: rpx(2),
                        lineHeight: 1,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {opt.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 开始按钮 */}
            <div
              className="cursor-pointer"
              onClick={handleStart}
              style={{
                marginTop: rpx(32),
                padding: `${rpx(16)} ${rpx(64)}`,
                borderRadius: rpx(40),
                background:
                  "linear-gradient(135deg, rgba(139,170,125,0.22) 0%, rgba(139,170,125,0.10) 100%)",
                boxShadow:
                  "0 2px 16px rgba(139,170,125,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(30),
                  fontWeight: 500,
                  color: accentGreen,
                  letterSpacing: rpx(12),
                  lineHeight: 1,
                }}
              >
                开始
              </span>
            </div>
          </div>
        )}

        {/* ── 阶段：呼吸中 ── */}
        {phase === "breathing" && (
          <div
            className="flex flex-col items-center"
            style={{
              animation: "bs-fade-in-slow 1.5s ease-out both",
              gap: rpx(8),
            }}
          >
            <ImmersiveBreathingCircle isActive />

            <p
              style={{
                fontFamily: "'SF Mono', 'Menlo', monospace",
                fontSize: rpx(28),
                fontWeight: 300,
                color: textTertiary,
                letterSpacing: rpx(4),
                lineHeight: 1,
                marginTop: rpx(16),
              }}
            >
              {formatTime(remaining)}
            </p>
          </div>
        )}

        {/* ── 阶段：完成 ── */}
        {phase === "complete" && (
          <div
            className="flex flex-col items-center"
            style={{
              animation: "bs-fade-in 1.2s ease-out both",
              padding: `0 ${rpx(60)}`,
              gap: rpx(0),
            }}
          >
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(36),
                fontWeight: 500,
                color: textPrimary,
                letterSpacing: rpx(3),
                lineHeight: 1.6,
                textAlign: "center",
                margin: 0,
              }}
            >
              {completion.headline}
            </h2>

            {/* 分隔线 — 绿+金点缀 */}
            <div
              className="flex items-center justify-center"
              style={{ gap: rpx(12), margin: `${rpx(32)} 0` }}
            >
              <div
                style={{
                  width: rpx(40),
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, rgba(139,170,125,0.4))",
                }}
              />
              <div
                style={{
                  width: rpx(4),
                  height: rpx(4),
                  borderRadius: "50%",
                  background: "rgba(139,170,125,0.5)",
                }}
              />
              <div
                style={{
                  width: rpx(40),
                  height: "1px",
                  background:
                    "linear-gradient(to left, transparent, rgba(139,170,125,0.4))",
                }}
              />
            </div>

            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(24),
                fontWeight: 400,
                color: textSecondary,
                letterSpacing: rpx(2),
                lineHeight: 1.6,
                textAlign: "center",
                margin: 0,
              }}
            >
              {completion.subline}
            </p>

            <div
              className="cursor-pointer"
              onClick={handleBack}
              style={{
                marginTop: rpx(56),
                padding: `${rpx(16)} ${rpx(56)}`,
                borderRadius: rpx(40),
                background:
                  "linear-gradient(135deg, rgba(139,170,125,0.18) 0%, rgba(139,170,125,0.08) 100%)",
                boxShadow:
                  "0 2px 12px rgba(139,170,125,0.1), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(28),
                  fontWeight: 500,
                  color: accentGreen,
                  letterSpacing: rpx(8),
                  lineHeight: 1,
                }}
              >
                {completion.cta}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}