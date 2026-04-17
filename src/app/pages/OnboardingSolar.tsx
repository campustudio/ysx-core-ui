/**
 * 新人引导页 - 元感知 · 太阳系版
 *
 * 「元」为太阳，功能模块为行星
 * 缓慢公转 + CSS 3D 透视 → 沉浸式太阳系氛围
 *
 * 与星图版(OnboardingGuide.tsx)并存，
 * 通过 App.tsx 路由切换
 *
 * 交互状态：
 *   行星节点点击 → Toast「{模块名}的详细内容正在用心打磨中」
 *   「启程」按钮  → 返回首页
 *   左上返回箭头  → 返回首页
 */

import { useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { SOLAR_TITLE, SOLAR_SUBTITLE } from "../config/solar-data";
import { FONT_SERIF, rpxVw as rpx } from "../config/styles";
import { SolarSystem } from "../components/onboarding/SolarSystem";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

// ─── 背景星尘 ──────────────────────────────────────

interface Dust {
  left: string;
  top: string;
  size: string;
  loOp: number;
  hiOp: number;
  dur: string;
  delay: string;
  anim: string;
}

function makeDust(): Dust[] {
  const out: Dust[] = [];
  for (let i = 0; i < 35; i++) {
    out.push({
      left: `${Math.round((Math.sin(i * 5.1 + 0.9) * 0.5 + 0.5) * 96 + 2)}%`,
      top: `${Math.round((Math.cos(i * 3.5 + 1.4) * 0.5 + 0.5) * 96 + 2)}%`,
      size: rpx(2 + (i % 3) * 0.7),
      loOp: 0.08 + (i % 5) * 0.03,
      hiOp: 0.45 + (i % 4) * 0.08,
      dur: `${4 + (i % 4) * 0.9}s`,
      delay: `${(i * 0.22).toFixed(1)}s`,
      anim: "tw-s",
    });
  }
  for (let i = 0; i < 18; i++) {
    out.push({
      left: `${Math.round((Math.sin(i * 4.3 + 2.6) * 0.5 + 0.5) * 92 + 4)}%`,
      top: `${Math.round((Math.cos(i * 3.1 + 3.3) * 0.5 + 0.5) * 92 + 4)}%`,
      size: rpx(3 + (i % 3) * 0.9),
      loOp: 0.15 + (i % 3) * 0.06,
      hiOp: 0.65 + (i % 3) * 0.1,
      dur: `${3 + (i % 3) * 0.8}s`,
      delay: `${(i * 0.4).toFixed(1)}s`,
      anim: "tw-m",
    });
  }
  for (let i = 0; i < 8; i++) {
    out.push({
      left: `${Math.round((Math.sin(i * 6.7 + 1.1) * 0.5 + 0.5) * 86 + 7)}%`,
      top: `${Math.round((Math.cos(i * 4.9 + 0.5) * 0.5 + 0.5) * 86 + 7)}%`,
      size: rpx(4.5 + (i % 2) * 1.2),
      loOp: 0.25 + (i % 2) * 0.1,
      hiOp: 0.85 + (i % 2) * 0.15,
      dur: `${2.5 + (i % 3) * 0.7}s`,
      delay: `${(i * 0.6).toFixed(1)}s`,
      anim: "tw-b",
    });
  }
  return out;
}

const DUST = makeDust();

// ─── 组件 ────────────────────────────────────────────

interface Props {
  onBack?: () => void;
}

export function OnboardingSolar({ onBack }: Props) {
  const toast = useToast();

  const handlePlanetClick = useCallback(
    (planetId: string, planetTitle: string) => {
      toast.show(`「${planetTitle}」的详细内容正在用心打磨中，敬请期待`);
    },
    [toast.show],
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflow: "hidden",
        background: [
          /* 中心太阳辐射 */
          "radial-gradient(ellipse at 50% 50%, rgba(220,185,120,0.08) 0%, transparent 40%)",
          /* 暖色星云 */
          "radial-gradient(ellipse at 55% 60%, rgba(196,154,108,0.06) 0%, transparent 35%)",
          "radial-gradient(ellipse at 40% 35%, rgba(180,150,100,0.04) 0%, transparent 30%)",
          /* 冷色点缀 */
          "radial-gradient(ellipse at 75% 25%, rgba(100,120,170,0.025) 0%, transparent 25%)",
          /* 暖暗角 */
          "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(10,8,5,0.4) 100%)",
          /* 暖深空基底 */
          "linear-gradient(to bottom, #080C1A 0%, #0C1228 30%, #0E1630 50%, #0A1020 75%, #070B18 100%)",
        ].join(", "),
      }}
    >
      {/* ═══ 闪烁 keyframes ═══ */}
      <style>{`
        @keyframes tw-s {
          0%, 100% { opacity: var(--lo); transform: scale(0.8); }
          50%      { opacity: var(--hi); transform: scale(1.15); }
        }
        @keyframes tw-m {
          0%, 100% { opacity: var(--lo); transform: scale(0.75); }
          50%      { opacity: var(--hi); transform: scale(1.3); }
        }
        @keyframes tw-b {
          0%, 100% { opacity: var(--lo); transform: scale(0.7); }
          50%      { opacity: var(--hi); transform: scale(1.4); }
        }
        @keyframes cta-breathe {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 0.82; }
        }
      `}</style>

      {/* ═══ 背景星尘 ═══ */}
      {DUST.map((p, i) => (
        <div
          key={`d-${i}`}
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,250,240,0.95) 0%, rgba(230,215,190,0.5) 100%)",
            // @ts-expect-error CSS custom property
            "--lo": p.loOp,
            "--hi": p.hiOp,
            opacity: (p.loOp + p.hiOp) / 2,
            animation: `${p.anim} ${p.dur} ease-in-out ${p.delay} infinite`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}

      {/* ═══ 内容层 ═══ */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "100vh",
        }}
      >
        {/* 返回 */}
        <div
          className="cursor-pointer"
          onClick={onBack}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 10,
            paddingTop: "max(calc(var(--rpx) * 24), env(safe-area-inset-top))",
            paddingLeft: rpx(18),
            paddingRight: rpx(20),
            paddingBottom: rpx(20),
          }}
        >
          <ChevronLeft
            style={{
              width: rpx(44),
              height: rpx(44),
              color: "rgba(232,213,184,0.4)",
            }}
            strokeWidth={1.8}
          />
        </div>

        {/* 标题 */}
        <div
          className="flex flex-col items-center"
          style={{
            paddingTop: `calc(max(calc(var(--rpx) * 24), env(safe-area-inset-top)) + ${rpx(56)})`,
            paddingBottom: rpx(8),
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              fontSize: rpx(48),
              fontFamily: FONT_SERIF,
              fontWeight: 600,
              color: "#E8D5B8",
              letterSpacing: rpx(8),
              lineHeight: 1.3,
              margin: 0,
              textShadow: `0 0 ${rpx(24)} rgba(196,154,108,0.2)`,
            }}
          >
            {SOLAR_TITLE}
          </h1>
          <p
            style={{
              fontSize: rpx(24),
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              color: "rgba(232,213,184,0.4)",
              letterSpacing: rpx(3),
              lineHeight: 1.5,
              margin: `${rpx(12)} 0 0`,
              textAlign: "center",
            }}
          >
            {SOLAR_SUBTITLE}
          </p>
        </div>

        {/* 太阳系 */}
        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            position: "relative",
          }}
        >
          <SolarSystem onPlanetClick={handlePlanetClick} />
        </div>

        {/* 底部 */}
        <div
          className="flex flex-col items-center"
          style={{
            flexShrink: 0,
            padding: `${rpx(6)} 0 calc(${rpx(36)} + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <div
            className="cursor-pointer"
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: rpx(16),
              animation: "cta-breathe 4s ease-in-out infinite",
              marginBottom: rpx(14),
              padding: `${rpx(12)} ${rpx(24)}`,
            }}
          >
            <div
              style={{
                width: rpx(48),
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(196,154,108,0.35))",
              }}
            />
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(30),
                fontWeight: 500,
                color: "rgba(196,154,108,0.7)",
                letterSpacing: rpx(12),
                lineHeight: 1,
                textShadow: `0 0 ${rpx(20)} rgba(196,154,108,0.25)`,
              }}
            >
              启程
            </span>
            <div
              style={{
                width: rpx(48),
                height: "1px",
                background:
                  "linear-gradient(to left, transparent, rgba(196,154,108,0.35))",
              }}
            />
          </div>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(17),
              fontWeight: 400,
              color: "rgba(196,154,108,0.22)",
              letterSpacing: rpx(4),
              lineHeight: 1,
              margin: 0,
            }}
          >
            与光同行，步步生花
          </p>
        </div>
      </div>

      {/* Toast 温柔提示 */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={toast.duration}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
