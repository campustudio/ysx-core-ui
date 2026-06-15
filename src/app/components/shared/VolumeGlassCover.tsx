/**
 * VolumeGlassCover - 十卷母本 · 极清透水晶玻璃封面（支持通用 3D 水晶背景图 + 动态代码金丝徽记与文字）
 *
 * 完美的工程与视觉结合方案：
 *   - 1. 通用背景图方案：由用户提供一张由 AI（如 ChatGPT / Midjourney）生成的极致 3D 水晶书本背景图（带脊痕、厚度、中心发光，但无文字和徽记）。
 *   - 2. 动态代码叠加：用代码在背景图之上，精准叠加动态的金色矢量徽记（`renderMotif`）、卷号、罗马数字和卷名。
 *   - 3. 优雅降级 Fallback：若未提供 `imageUrl`，自动使用高保真纯 CSS/SVG 水晶玻璃材质渲染，确保开发与生产环境完美呈现。
 */

import { FONT_SERIF, rpx } from "../../config/styles";
import { renderMotif, type StrokeProps, VolumeBookCover } from "./VolumeBookCover";

interface VolumeGlassCoverProps {
  volumeNumber: number;
  volumeCn: string;
  title?: string;
  subtitle?: string; // 增加 subtitle 支持，在降级到老版本黑封面时渲染两行小字
  height?: string;
  compact?: boolean;
  /** 通用 3D 水晶玻璃书本背景图 URL（不带文字与徽记，仅带质感与中心发散光芒） */
  imageUrl?: string;
}

const GOLD_INK = "#9A7C3E";
const GOLD_SOFT = "rgba(168,134,72,0.85)";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function VolumeGlassCover({
  volumeNumber,
  volumeCn,
  title,
  subtitle,
  height,
  compact = false,
  imageUrl,
}: VolumeGlassCoverProps) {
  // 智能双模式：
  // 1. 如果没传新图片，我们就用原来的那个老版本，即黑色的黑色封面的那个效果，包括上面的文字
  if (!imageUrl) {
    return (
      <VolumeBookCover
        volumeNumber={volumeNumber}
        volumeCn={volumeCn}
        subtitle={subtitle || title}
        height={height}
        compact={compact}
      />
    );
  }

  // 2. 如果是传了新图片，就用我们最新的带图片的这个效果，并在上面用代码动态叠加金色矢量徽记与文字
  const h = height ?? rpx(248);
  const creaseLeft = compact ? rpx(9) : rpx(16);
  // 调整内缩边距，使得带图片的版本内容排版与老版黑书完全对齐
  const inset = compact ? rpx(10) : rpx(16);
  // 背景图书脊在左侧（约占书宽 10%），可书写「正面」的光学中心在几何中心右侧约 8px；
  // 故左内缩 > 右内缩，把文字/徽记整体右移到正面中心，做到视觉居中（与老版黑书 frameLeft>frameRight 同理）
  const insetL = compact ? rpx(13) : rpx(24);
  const insetR = compact ? rpx(7) : rpx(8);
  const pad = compact ? `${rpx(10)} ${rpx(8)}` : `${rpx(18)} ${rpx(14)}`;
  const volFz = compact ? rpx(15) : rpx(24);
  const sigil = compact ? 42 : 92;

  return (
    <div style={{ position: "relative", width: "100%", height: h }}>
      {/* 只有在没有背景图时，才需要底部的 CSS 接触投影（因为 AI 生成的背景图自带逼真投影） */}
      {!imageUrl && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "6%",
            right: "2%",
            bottom: rpx(-4),
            height: rpx(22),
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 80%)",
            filter: "blur(3px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ① 下层封面（背板）：只有在没有背景图时才渲染 CSS 模拟背板 */}
      {!imageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: rpx(13),
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.12) 100%)",
            boxShadow:
              "0 16px 28px -10px rgba(0,0,0,0.15), 0 6px 12px -5px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.8), inset -1px -1px 2px rgba(0,0,0,0.04)",
          }}
        />
      )}

      {/* ② 上层封面（正面水晶面）：如果是图片模式，则作为背景容器；如果是 CSS 模式，则渲染水晶质感 */}
      <div
        style={{
          position: "absolute",
          top: imageUrl ? 0 : rpx(2),
          left: 0,
          right: imageUrl ? 0 : rpx(3),
          bottom: imageUrl ? 0 : rpx(4),
          borderRadius: rpx(13),
          overflow: "hidden",
          // 背景图已预先裁切到书体边界（去掉了 AI 出图四周的白边），故用 cover 铺满即可与老版黑书宽高对齐；否则使用纯 CSS 极清透水晶渐变
          background: imageUrl
            ? `url(${imageUrl}) no-repeat center center / cover`
            : "radial-gradient(50% 42% at 50% 46%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%), " +
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.12) 100%)",
          backdropFilter: imageUrl ? "none" : "blur(1.5px) saturate(1.02)",
          WebkitBackdropFilter: imageUrl ? "none" : "blur(1.5px) saturate(1.02)",
          // 图片模式：加一层更轻、更柔、偏冷灰的接触投影，使水晶书与黑皮书一样"落"在桌面，落地感一致；
          // 否则用 inset shadow 模拟水晶斜面
          boxShadow: imageUrl
            ? "0 18px 30px -14px rgba(86,84,78,0.3), 0 7px 14px -8px rgba(86,84,78,0.18)"
            : "inset 0 0 0 1px rgba(255,255,255,0.45), inset 0 2px 3px rgba(255,255,255,0.8), inset 2px 0 3px rgba(255,255,255,0.6), inset 0 -5px 10px rgba(0,0,0,0.03), inset -4px -2px 8px rgba(0,0,0,0.03), inset 0 0 20px rgba(255,255,255,0.15)",
        }}
      >
        {/* ─── 纯 CSS 模式下的细节渲染（有图片时隐藏，因为图片已完美自带） ─── */}
        {!imageUrl && (
          <>
            {/* 左侧明显压痕（书脊折痕）：通过颜色对比（左暗右亮）制造凹进去的沟槽效果 */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: rpx(8),
                bottom: rpx(8),
                left: creaseLeft,
                width: rpx(3),
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 35%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: rpx(8),
                bottom: rpx(8),
                left: `calc(${creaseLeft} + ${rpx(6)})`,
                width: rpx(2),
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 35%, rgba(255,255,255,0.6) 55%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* 中央徽记背后的发散细光芒 */}
            <CrystalRays />
          </>
        )}

        {/* ─── 核心图层：动态文字与金色矢量徽记（无论有无图片，均在最上层渲染） ─── */}
        <div
          style={{
            position: "absolute",
            top: inset,
            left: insetL,
            right: insetR,
            bottom: inset,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: pad,
            zIndex: 2,
          }}
        >
          {/* 顶部：卷号 + VOLUME 罗马数字 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: rpx(2),
              marginTop: compact ? 0 : rpx(10), // 调整顶部边距以完美对齐老版黑书
            }}
          >
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: volFz,
                fontWeight: 700,
                color: GOLD_INK,
                letterSpacing: compact ? rpx(1) : rpx(3),
                textShadow: "0 1px 1px rgba(255,255,255,0.9)",
              }}
            >
              卷{volumeCn}
            </span>
            {!compact && (
              <span
                style={{
                  fontSize: rpx(12),
                  color: "rgba(122,118,110,0.6)",
                  letterSpacing: rpx(2),
                }}
              >
                VOLUME {ROMAN[(volumeNumber - 1) % 10]}
              </span>
            )}
          </div>

          {/* 中央金色发光矢量徽记（动态按卷号渲染，带微发光） */}
          <GlassSigil volumeNumber={volumeNumber} size={sigil} />

          {/* 底部卷名 */}
          {!compact && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: rpx(4),
                marginBottom: rpx(10), // 调整底部边距以完美对齐老版黑书
              }}
            >
              {title && (
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(20),
                    fontWeight: 600,
                    color: GOLD_INK,
                    letterSpacing: rpx(1),
                    textAlign: "center",
                    textShadow: "0 1px 1px rgba(255,255,255,0.85)",
                  }}
                >
                  {title}
                </span>
              )}
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(12),
                  color: "rgba(122,118,110,0.55)",
                  letterSpacing: rpx(3),
                }}
              >
                · 人类手册 ·
              </span>
            </div>
          )}
        </div>

        {/* 顶部斜向镜面高光（无论是图片还是 CSS，都盖在最上层，增加物理玻璃反光感） */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(132deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0) 30%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
}

/** 中央发散细光芒：从徽记中心向四周散出的极细银白光线 + 极淡光核，点缀式发光 */
function CrystalRays() {
  const cx = 50;
  const cy = 58;
  const rays = Array.from({ length: 24 }).map((_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    const inner = 9;
    const outer = i % 2 === 0 ? 38 : 24; // 长短交替，营造星芒散射
    const warm = i % 6 === 0;
    return {
      x1: cx + Math.cos(a) * inner,
      y1: cy + Math.sin(a) * inner,
      x2: cx + Math.cos(a) * outer,
      y2: cy + Math.sin(a) * outer,
      stroke: warm
        ? "rgba(255,238,196,0.35)"
        : "rgba(255,255,255,0.45)",
    };
  });
  return (
    <svg
      viewBox="0 0 100 140"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      fill="none"
    >
      <defs>
        <radialGradient id="vgCore" cx="50%" cy={`${(cy / 140) * 100}%`} r="30%">
          <stop offset="0%" stopColor="rgba(255,253,246,0.7)" />
          <stop offset="50%" stopColor="rgba(255,248,228,0.12)" />
          <stop offset="100%" stopColor="rgba(255,248,228,0)" />
        </radialGradient>
        <filter id="vgBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
      {/* 极淡光核 */}
      <ellipse cx={cx} cy={cy} rx="30" ry="30" fill="url(#vgCore)" />
      {/* 发散细光芒（中间向四周扩散的折射光线，唯一光感来源） */}
      <g filter="url(#vgBlur)">
        {rays.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke={r.stroke}
            strokeWidth="0.45"
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}

/** 金色线条徽记：复用各卷母题，统一描成金色 + 发光（玻璃封面用） */
function GlassSigil({
  volumeNumber,
  size,
}: {
  volumeNumber: number;
  size: number;
}) {
  const gold: StrokeProps = {
    stroke: GOLD_SOFT,
    strokeWidth: 0.8,
    fill: "none",
  };
  const v = ((volumeNumber - 1) % 10) + 1;
  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        width: rpx(size),
        height: rpx(size),
        filter: "drop-shadow(0 0 1.2px rgba(255,236,180,0.45))",
      }}
      fill="none"
    >
      <circle {...gold} cx="50" cy="50" r="34" />
      {renderMotif(v, gold, gold)}
      <circle cx="50" cy="50" r="2.2" fill={GOLD_SOFT} />
    </svg>
  );
}
