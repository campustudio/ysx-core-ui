/**
 * StarConstellation - 星图导航（v7 · 放大 + 无连线 + 星云背景适配）
 *
 * 变化：
 *   ① 移除星座连线 → 更干净，不干扰星云背景
 *   ② 整体放大 → 最小星（depth=0.22）也能清晰阅读
 *   ③ 位置整体上移 → 底部预留更多空间
 *   ④ text-shadow 加强 → 在星云照片背景上保持可读
 *   ⑤ 星名标注保留 → 传统文化标识
 *   ⑥ 点击区域扩展 → 圆盘 + 标签均可点击，提升移动端触控精度
 *
 * Props:
 *   - onStarClick: 星体节点点击回调 (starId, starTitle)
 */

import { GUIDE_STARS } from "../../config/onboarding-data";
import { FONT_SERIF, rpxVw as rpx } from "../../config/styles";

interface StarConstellationProps {
  /** 星体节点点击回调 */
  onStarClick?: (starId: string, starTitle: string) => void;
}

export function StarConstellation({ onStarClick }: StarConstellationProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ═══ 光晕呼吸动画 ═══ */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1);    opacity: var(--g-o); }
          50%      { transform: scale(1.35); opacity: calc(var(--g-o) * 1.6); }
        }
      `}</style>

      {/* ═══ 星体层（无连线） ═══ */}
      {GUIDE_STARS.map((star, i) => {
        const d = star.depth;

        /* ── 尺寸（大幅放大，确保七星主导视觉） ── */
        const coreSize = rpx(74 + 46 * d);
        const glowSize = rpx(130 + 240 * d);

        /* ── 色温（暖金 ↔ 冷银） ── */
        const wR = Math.round(220 + 35 * d);
        const wG = Math.round(218 + 32 * d);
        const wB = Math.round(225 + 5 * d);

        const mR = Math.round(200 + 50 * d);
        const mG = Math.round(188 + 48 * d);
        const mB = Math.round(165 + 40 * d);

        const coreBg = `radial-gradient(circle,
          rgba(${wR},${wG},${wB},${(0.96 + 0.04 * d).toFixed(2)}) 5%,
          rgba(${mR},${mG},${mB},${(0.65 + 0.25 * d).toFixed(2)}) 22%,
          rgba(${mR},${mG},${mB},${(0.28 + 0.18 * d).toFixed(2)}) 42%,
          rgba(${mR},${mG},${mB},${(0.08 + 0.08 * d).toFixed(3)}) 58%,
          transparent 70%)`;

        /* ── 光晕（更亮更大，从背景中跳出） ── */
        const glR = Math.round(185 + 40 * d);
        const glG = Math.round(170 + 25 * d);
        const glB = Math.round(155 - 20 * d);
        const glowAlpha = 0.15 + 0.55 * d;

        const glowBg = `radial-gradient(circle,
          rgba(${glR},${glG},${glB},${(0.35 * d + 0.08).toFixed(3)}) 0%,
          rgba(${glR},${glG},${glB},${(0.12 * d + 0.02).toFixed(4)}) 40%,
          transparent 100%)`;
        const glowBlur = `blur(${rpx((1 - d) * 2)})`;

        /* ── 字体（放大，保证远处也能读） ── */
        const glyphFont = rpx(34 + 10 * d);
        const glyphA = (0.88 + 0.1 * d).toFixed(2);
        const tR = Math.round(105 + 30 * d);
        const tG = Math.round(90 + 16 * d);
        const tB = Math.round(72 - 6 * d);

        /* ── 标签（放大，提高对比） ── */
        const labelOff = rpx(30 + 16 * d);
        const titleFont = rpx(25 + 4 * d);
        const titleA = (0.78 + 0.2 * d).toFixed(2);
        const descFont = rpx(19 + 3 * d);
        const descA = (0.42 + 0.22 * d).toFixed(2);

        return (
          <div
            key={star.id}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: 0,
              height: 0,
              zIndex: 2,
            }}
          >
            {/* 光晕 */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: glowSize,
                height: glowSize,
                marginLeft: `calc(-1 * ${glowSize} / 2)`,
                marginTop: `calc(-1 * ${glowSize} / 2)`,
                borderRadius: "50%",
                background: glowBg,
                filter: glowBlur,
                // @ts-expect-error CSS custom property
                "--g-o": glowAlpha,
                animation: `glow-pulse ${4 + (1 - d) * 3}s ease-in-out ${i * 0.6}s infinite`,
                pointerEvents: "none",
              }}
            />

            {/* 圆盘 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: coreSize,
                height: coreSize,
                borderRadius: "50%",
                background: coreBg,
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => onStarClick?.(star.id, star.title)}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: glyphFont,
                  fontWeight: 600,
                  color: `rgba(${tR},${tG},${tB},${glyphA})`,
                  lineHeight: 1,
                  textShadow: `0 0 ${rpx(8)} rgba(255,245,220,0.35), 0 0 ${rpx(3)} rgba(255,245,220,0.5)`,
                }}
              >
                {star.glyph}
              </span>
            </div>

            {/* 标签（圆盘下方） */}
            <div
              style={{
                position: "absolute",
                top: labelOff,
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
              onClick={() => onStarClick?.(star.id, star.title)}
            >
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: titleFont,
                  fontWeight: 600,
                  color: `rgba(232,213,184,${titleA})`,
                  lineHeight: 1.3,
                  textShadow:
                    "0 0 12px rgba(4,6,14,0.95), 0 0 5px rgba(4,6,14,0.9), 0 1px 4px rgba(4,6,14,0.8)",
                }}
              >
                {star.title}
              </div>
              <div
                style={{
                  fontSize: descFont,
                  fontWeight: 400,
                  color: `rgba(232,213,184,${descA})`,
                  lineHeight: 1.3,
                  marginTop: rpx(3),
                  textShadow:
                    "0 0 10px rgba(4,6,14,0.95), 0 0 4px rgba(4,6,14,0.85), 0 1px 3px rgba(4,6,14,0.7)",
                }}
              >
                {star.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}