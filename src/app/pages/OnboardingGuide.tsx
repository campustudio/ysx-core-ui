/**
 * 新人引导页 - 元思想
 *
 * 星图导航 · v6 · 星云背景版
 *
 * 核心变化：
 *   ① 真实星云照片做背景（Unsplash），不再用 CSS 渐变模拟
 *   ② 暖色调色层叠加在星云上 → 保持品牌色调统一
 *   ③ 星体连线 + 传统星名标注 → 星图形态一目了然
 *   ④ 减少背景星尘（真实照片已有星点），只保留少量亮星点缀
 *   ⑤ CSS perspective 增强 → 远近立体空间感
 *
 * 交互状态：
 *   星体节点点击 → Toast「{模块名}的详细内容正在用心打磨中，敬请期待」
 *   「启程」按钮  → 返回首页
 *   左上返回箭头  → 返回首页
 */

import { useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import {
  ONBOARDING_TITLE,
  ONBOARDING_SUBTITLE,
  JOURNEY_GLYPHS_SUMMARY,
} from "../config/onboarding-data";
import { FONT_SERIF, rpxVw as rpx } from "../config/styles";
import { StarConstellation } from "../components/onboarding/StarConstellation";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

/** 星云背景图 */
const NEBULA_BG =
  "https://images.unsplash.com/photo-1711559382724-fcd1f136a50d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJpbmElMjBuZWJ1bGElMjB2aXppZCUyMGRlZXAlMjBzcGFjZXxlbnwxfHx8fDE3NzA3MjI4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

// ─── 少量点缀星尘（与照片背景互补，不喧宾夺主） ────────

interface Dust {
  left: string;
  top: string;
  size: string;
  opacity: number;
  dur: string;
  delay: string;
}

function makeDust(): Dust[] {
  const out: Dust[] = [];
  for (let i = 0; i < 15; i++) {
    out.push({
      left: `${Math.round((Math.sin(i * 5.7 + 0.3) * 0.5 + 0.5) * 94 + 3)}%`,
      top: `${Math.round((Math.cos(i * 3.9 + 1.7) * 0.5 + 0.5) * 94 + 3)}%`,
      size: rpx(3 + (i % 3) * 1.2),
      opacity: 0.3 + (i % 4) * 0.12,
      dur: `${3 + (i % 3) * 1.2}s`,
      delay: `${(i * 0.4).toFixed(1)}s`,
    });
  }
  return out;
}

const DUST = makeDust();

// ─── 组件 ────────────────────────────────────────────

interface Props {
  onBack?: () => void;
}

export function OnboardingGuide({ onBack }: Props) {
  const toast = useToast();

  const handleStarClick = useCallback(
    (_starId: string, starTitle: string) => {
      toast.show(`「${starTitle}」的详细内容正在用心打磨中，敬请期待`);
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
        /* 纯黑底色（图片加载前可见） */
        background: "#060810",
      }}
    >
      {/* ═══ 星云背景图 ═══ */}
      <ImageWithFallback
        src={NEBULA_BG}
        alt="星云背景"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 40%",
          /* 适度压暗背景 → 让七星从背景星点中跳出 */
          filter: "brightness(0.68) saturate(0.7)",
          zIndex: 0,
        }}
      />

      {/* ═══ 暖色调色层 → 仅保留极轻微暗角，不遮盖星云 ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(6,8,16,0.18) 100%)",
        }}
      />

      {/* ═══ 点缀星尘 ═══ */}
      <style>{`
        @keyframes tw-dot {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50%      { opacity: var(--op); transform: scale(1.3); }
        }
        @keyframes cta-breathe {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.03); }
        }
      `}</style>

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
            "--op": p.opacity,
            opacity: p.opacity * 0.6,
            animation: `tw-dot ${p.dur} ease-in-out ${p.delay} infinite`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* ═══ 内容层 ═══ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
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
            paddingTop: `calc(max(calc(var(--rpx) * 24), env(safe-area-inset-top)) + ${rpx(60)})`,
            paddingBottom: rpx(12),
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              fontSize: rpx(50),
              fontFamily: FONT_SERIF,
              fontWeight: 600,
              color: "#E8D5B8",
              letterSpacing: rpx(8),
              lineHeight: 1.3,
              margin: 0,
              textShadow: [
                `0 0 ${rpx(28)} rgba(196,154,108,0.25)`,
                "0 2px 8px rgba(0,0,0,0.6)",
              ].join(", "),
            }}
          >
            {ONBOARDING_TITLE}
          </h1>
          <p
            style={{
              fontSize: rpx(24),
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              color: "rgba(232,213,184,0.62)",
              letterSpacing: rpx(2),
              lineHeight: 1.6,
              margin: `${rpx(14)} 0 0`,
              textAlign: "center",
              padding: `0 ${rpx(48)}`,
              textShadow: "0 0 10px rgba(0,0,0,0.8), 0 1px 6px rgba(0,0,0,0.6)",
            }}
          >
            {ONBOARDING_SUBTITLE}
          </p>
          <div
            style={{
              width: rpx(80),
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(196,154,108,0.25), transparent)",
              margin: `${rpx(16)} 0`,
            }}
          />
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(22),
              fontWeight: 400,
              color: "rgba(196,154,108,0.72)",
              letterSpacing: rpx(4),
              lineHeight: 1,
              margin: 0,
              textShadow: `0 0 10px rgba(0,0,0,0.7), 0 0 ${rpx(10)} rgba(196,154,108,0.2)`,
            }}
          >
            {JOURNEY_GLYPHS_SUMMARY}
          </p>
        </div>

        {/* 星图 */}
        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            position: "relative",
            perspective: rpx(1600),
            perspectiveOrigin: "50% 90%",
            padding: `0 ${rpx(4)}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "rotateX(7deg)",
              transformOrigin: "center 88%",
            }}
          >
            <StarConstellation onStarClick={handleStarClick} />
          </div>
        </div>

        {/* 底部 */}
        <div
          className="flex flex-col items-center"
          style={{
            flexShrink: 0,
            padding: `${rpx(6)} 0 calc(${rpx(36)} + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          {/* 启程 */}
          <div
            className="cursor-pointer"
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: rpx(12),
              animation: "cta-breathe 4s ease-in-out infinite",
              marginBottom: rpx(14),
              padding: `${rpx(14)} ${rpx(48)}`,
              borderRadius: rpx(40),
              border: "1px solid rgba(196,154,108,0.3)",
              background: "rgba(196,154,108,0.08)",
            }}
          >
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(34),
                fontWeight: 500,
                color: "rgba(232,213,184,0.95)",
                letterSpacing: rpx(14),
                lineHeight: 1,
                textShadow: [
                  `0 0 ${rpx(24)} rgba(196,154,108,0.4)`,
                  "0 0 8px rgba(0,0,0,0.5)",
                ].join(", "),
              }}
            >
              启程
            </span>
          </div>

          {/* 注解 */}
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(19),
              fontWeight: 400,
              color: "rgba(232,213,184,0.58)",
              letterSpacing: rpx(5),
              lineHeight: 1,
              margin: 0,
              textShadow:
                "0 0 12px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            每一颗星，都是你成长的方向
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
