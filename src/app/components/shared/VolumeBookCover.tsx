/**
 * VolumeBookCover - 十卷母本 · 立体黑书封面（纯代码实现）
 *
 * 用 CSS + SVG 还原"一本黑色精装书正放在你面前"的立体层次感：
 *   - 多层封面叠放：下层封面(背板) → 白色书页边 → 上层封面(正面)
 *     从右侧/底部能看到「上层封面盖在书页与下层封面之上」的层次
 *   - 黑色皮革质感（多层渐变 + 高光 + 颗粒）
 *   - 左侧立体书脊（暗带 + 折痕高光）
 *   - 刻进封面的内凹描边框（debossed，非黄线框）
 *   - 红色卷号（衬线）
 *   - 中央史诗感徽记（SVG，按卷号差异化）
 *   - 底部两行小字（取自卷副标题，自动剔除箭头等符号）
 *
 * 零图片加载、完全可控、响应式。
 */

import { FONT_SERIF, rpx } from "../../config/styles";

interface VolumeBookCoverProps {
  /** 卷序号（1-10） */
  volumeNumber: number;
  /** 卷序中文（一二三…） */
  volumeCn: string;
  /** 卷副标题，用于底部两行小字 */
  subtitle?: string;
  /** 整体高度，默认 rpx(248) */
  height?: string;
  /** 紧凑缩略图模式（用于「继续阅读」小封面） */
  compact?: boolean;
}

/** 暗红卷号色 */
const SEAL_RED = "#A8312A";
/** 徽记描边金 */
const SIGIL_GOLD = "rgba(196,158,98,0.6)";
/** 徽记描边红 */
const SIGIL_RED = "rgba(168,49,42,0.55)";

/** 黑色皮革封面（正面 / 背板共用基底，背板更暗以示下层） */
const LEATHER_FRONT =
  "radial-gradient(120% 90% at 25% 15%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 42%), linear-gradient(135deg, #2d2823 0%, #18140f 38%, #0c0a07 72%, #050403 100%)";
const LEATHER_BACK =
  "linear-gradient(135deg, #1c1812 0%, #0c0a07 60%, #040302 100%)";

export function VolumeBookCover({
  volumeNumber,
  volumeCn,
  subtitle,
  height,
  compact = false,
}: VolumeBookCoverProps) {
  // 副标题 → 两行小字：按分隔符拆分，剔除空串与「纯符号」token（如 → · 等）
  const tokens = (subtitle ?? "")
    .split(/[·•→＞>/、,，\s]+/)
    .map((s) => s.trim())
    .filter((s) => /[\u4e00-\u9fa5A-Za-z0-9]/.test(s));
  const line1 = tokens[0] ?? "";
  const line2 = tokens[1] ?? "";

  // 紧凑/完整两套尺寸
  const spineW = compact ? rpx(8) : rpx(16);
  const frameTop = compact ? rpx(8) : rpx(16);
  const frameLeft = compact ? rpx(12) : rpx(22);
  const frameRight = compact ? rpx(7) : rpx(14);
  const frameBottom = compact ? rpx(8) : rpx(16);
  const contentPad = compact ? `${rpx(8)} ${rpx(4)}` : `${rpx(20)} ${rpx(10)}`;
  const volFz = compact ? rpx(16) : rpx(26);
  const volLs = compact ? rpx(1) : rpx(3);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: height ?? rpx(248),
      }}
    >
      {/* ① 下层封面（背板）：占满，最暗，仅在底部露出薄边 → 「下层封面」 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: rpx(10),
          background: LEATHER_BACK,
          // 立体投影：偏下、负扩散，避免横向外溢与相邻书连成一片
          boxShadow:
            "0 14px 22px -8px rgba(20,12,4,0.5), 0 4px 8px -2px rgba(20,12,4,0.35)",
        }}
      />

      {/* ② 白色书页：仅在底部上层/下层封面之间露出一丝（不明显） */}
      <div
        style={{
          position: "absolute",
          top: rpx(3),
          left: rpx(3),
          right: rpx(2),
          bottom: rpx(3),
          borderRadius: `${rpx(8)} ${rpx(8)} ${rpx(8)} ${rpx(8)}`,
          background:
            "repeating-linear-gradient(90deg, #efe7d6 0px, #ffffff 1.5px, #e3dac8 3px)",
        }}
      />

      {/* ③ 上层封面（正面）：向右下铺满，盖住右侧白页，仅底部露层次 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: rpx(2),
          bottom: rpx(6),
          borderRadius: rpx(10),
          background: LEATHER_FRONT,
          // 封面本体立体：顶部高光 + 底部内阴影 + 底部投影到下层封面
          boxShadow:
            "inset 0 1.5px 1px rgba(255,255,255,0.12), inset 0 -3px 8px rgba(0,0,0,0.7), 0 5px 8px -2px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* 左侧立体书脊：暗带 + 右缘折痕高光 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: spineW,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, rgba(255,255,255,0.10) 96%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* 刻进封面的内凹描边框（debossed） */}
        <div
          style={{
            position: "absolute",
            top: frameTop,
            left: frameLeft,
            right: frameRight,
            bottom: frameBottom,
            borderRadius: rpx(4),
            boxShadow:
              "inset 1px 1px 2px rgba(0,0,0,0.75), inset -1px -1px 1px rgba(255,255,255,0.07)",
            border: "1px solid rgba(180,140,80,0.14)",
            pointerEvents: "none",
          }}
        />

        {/* 内容区 */}
        <div
          style={{
            position: "absolute",
            top: frameTop,
            left: frameLeft,
            right: frameRight,
            bottom: frameBottom,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: contentPad,
          }}
        >
          {/* 红色卷号 */}
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: volFz,
              fontWeight: 700,
              color: SEAL_RED,
              letterSpacing: volLs,
              textShadow:
                "0 1px 2px rgba(0,0,0,0.6), 0 0 6px rgba(168,49,42,0.25)",
            }}
          >
            卷{volumeCn}
          </span>

          {/* 中央史诗感徽记（按卷差异化） */}
          <EpicSigil volumeNumber={volumeNumber} compact={compact} />

          {/* 底部两行小字（紧凑模式隐藏） */}
          {!compact && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: rpx(4),
              }}
            >
              {line1 && (
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(13),
                    color: "rgba(205,175,125,0.72)",
                    letterSpacing: rpx(2),
                  }}
                >
                  {line1}
                </span>
              )}
              {line2 && (
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(13),
                    color: "rgba(205,175,125,0.55)",
                    letterSpacing: rpx(2),
                  }}
                >
                  {line2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * EpicSigil - 史诗感徽记（SVG），按卷号 1-10 各自不同的几何母题。
 * 统一暗金/暗红描边，营造"刻在封面上"的克制神圣感。
 */
function EpicSigil({
  volumeNumber,
  compact = false,
}: {
  volumeNumber: number;
  compact?: boolean;
}) {
  const s = compact ? 40 : 90;
  const size = { width: rpx(s), height: rpx(s) };
  const sw = 0.8; // 统一描边宽度
  const common = { stroke: SIGIL_GOLD, strokeWidth: sw, fill: "none" as const };
  const red = { stroke: SIGIL_RED, strokeWidth: sw, fill: "none" as const };

  // 1-10 各自的母题（超出范围按取模兜底）
  const v = ((volumeNumber - 1) % 10) + 1;

  return (
    <svg viewBox="0 0 100 100" style={size} fill="none">
      <circle {...common} cx="50" cy="50" r="34" />
      {renderMotif(v, common, red)}
      <circle cx="50" cy="50" r="2.2" fill={SIGIL_RED} />
    </svg>
  );
}

type StrokeProps = { stroke: string; strokeWidth: number; fill: "none" };

/** 各卷母题：返回外圆内部的差异化图形 */
function renderMotif(v: number, g: StrokeProps, r: StrokeProps) {
  switch (v) {
    case 1: // 行星轨道：椭圆轨道 + 内圆 + 十字轴（启蒙·本源）
      return (
        <>
          <circle {...r} cx="50" cy="50" r="22" />
          <ellipse {...g} cx="50" cy="50" rx="32" ry="13" opacity={0.8} />
          <line {...g} x1="50" y1="14" x2="50" y2="86" opacity={0.5} />
          <line {...g} x1="18" y1="50" x2="82" y2="50" opacity={0.5} />
          <circle cx="72" cy="50" r="1.8" fill={r.stroke} />
        </>
      );
    case 2: // 上三角 + 内圆（愿景·序典）
      return (
        <>
          <polygon {...r} points="50,22 73,66 27,66" />
          <circle {...g} cx="50" cy="50" r="14" opacity={0.8} />
        </>
      );
    case 3: // 方形 + 旋转方形（理论·结构）
      return (
        <>
          <rect {...g} x="32" y="32" width="36" height="36" />
          <rect
            {...r}
            x="32"
            y="32"
            width="36"
            height="36"
            transform="rotate(45 50 50)"
            opacity={0.85}
          />
        </>
      );
    case 4: // 五角星（问答·指引）
      return (
        <>
          <polygon
            {...r}
            points="50,20 59,42 82,42 63,57 70,80 50,66 30,80 37,57 18,42 41,42"
            opacity={0.9}
          />
        </>
      );
    case 5: // 同心多环 + 放射节点（践行·扩展）
      return (
        <>
          <circle {...g} cx="50" cy="50" r="24" opacity={0.85} />
          <circle {...r} cx="50" cy="50" r="14" opacity={0.8} />
          {[0, 72, 144, 216, 288].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle
                key={a}
                cx={50 + Math.cos(rad) * 29}
                cy={50 + Math.sin(rad) * 29}
                r="1.8"
                fill={g.stroke}
              />
            );
          })}
        </>
      );
    case 6: // 六边形 + 内接圆
      return (
        <>
          <polygon
            {...g}
            points="50,18 78,34 78,66 50,82 22,66 22,34"
            opacity={0.85}
          />
          <circle {...r} cx="50" cy="50" r="15" opacity={0.8} />
        </>
      );
    case 7: // 双环交叠（vesica）
      return (
        <>
          <circle {...g} cx="40" cy="50" r="20" opacity={0.8} />
          <circle {...r} cx="60" cy="50" r="20" opacity={0.8} />
        </>
      );
    case 8: // 放射光芒（太阳）
      return (
        <>
          <circle {...r} cx="50" cy="50" r="12" opacity={0.85} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                {...g}
                x1={50 + Math.cos(a) * 16}
                y1={50 + Math.sin(a) * 16}
                x2={50 + Math.cos(a) * 30}
                y2={50 + Math.sin(a) * 30}
                opacity={0.7}
              />
            );
          })}
        </>
      );
    case 9: // 偏心同心圆（涟漪）
      return (
        <>
          <circle {...g} cx="46" cy="50" r="24" opacity={0.7} />
          <circle {...r} cx="52" cy="50" r="16" opacity={0.8} />
          <circle {...g} cx="56" cy="50" r="8" opacity={0.85} />
        </>
      );
    case 10: // 生命之花雏形（多圆环绕）
    default:
      return (
        <>
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle
                key={a}
                {...g}
                cx={50 + Math.cos(rad) * 13}
                cy={50 + Math.sin(rad) * 13}
                r="13"
                opacity={0.7}
              />
            );
          })}
        </>
      );
  }
}
