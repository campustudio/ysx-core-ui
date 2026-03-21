/**
 * ImmersiveBreathingCircle - 沉浸式呼吸圆环（白绿生命力系）
 *
 * 全屏模式下的放大版呼吸引导圆环
 * 与首页 BreathingCircle 共享品牌设计语言：
 *   - 三层呼吸动画（外/中/内）
 *   - 收｜清 文字联动高亮
 *   - 反向补偿缩放（文字大小恒定）
 *   - inset:0 + margin:auto 居中
 *
 * 白绿背景适配：
 *   - 光晕为鼠尾草绿 + 微金色混合
 *   - 内圈半透明白色磨砂 + 绿色柔光
 *   - 文字深苔绿，高亮时为鼠尾草绿
 *
 * Props:
 *   - isActive: 是否正在呼吸中（控制阶段提示显隐）
 *   - breathCycle: 呼吸周期秒数（默认8s）
 */

import { FONT_SERIF, rpx } from "../../config/styles";
import { BREATH_CYCLE } from "../../config/breathing-data";

interface Props {
  isActive?: boolean;
  breathCycle?: number;
}

export function ImmersiveBreathingCircle({
  isActive = false,
  breathCycle = BREATH_CYCLE.inhale + BREATH_CYCLE.exhale,
}: Props) {
  const dur = `${breathCycle}s`;

  const baseTextStyle = {
    fontSize: rpx(38),
    fontFamily: FONT_SERIF,
    fontWeight: 400,
    lineHeight: 1,
  } as const;

  return (
    <div className="flex flex-col items-center justify-center" style={{ gap: rpx(40) }}>
      {/* 呼吸光环容器 */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: rpx(420), height: rpx(420) }}
      >
        {/* 外圈光晕 — 鼠尾草绿柔光 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,170,125,0.16) 0%, rgba(139,170,125,0.06) 50%, transparent 70%)",
            animation: `ib-outer ${dur} ease-in-out infinite`,
          }}
        />

        {/* 中圈 — 绿+金混合光 */}
        <div
          className="absolute rounded-full"
          style={{
            width: rpx(300),
            height: rpx(300),
            inset: 0,
            margin: "auto",
            background:
              "radial-gradient(circle, rgba(139,170,125,0.12) 0%, rgba(196,154,108,0.04) 60%, transparent 100%)",
            animation: `ib-mid ${dur} ease-in-out infinite 0.5s`,
          }}
        />

        {/* 内圈 — 半透明白磨砂 + 绿色柔光 */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: rpx(220),
            height: rpx(220),
            inset: 0,
            margin: "auto",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.72) 0%, rgba(240,246,237,0.45) 100%)",
            boxShadow:
              "0 4px 40px rgba(139,170,125,0.12), 0 0 80px rgba(139,170,125,0.05), inset 0 0 30px rgba(255,255,255,0.55)",
            animation: `ib-inner ${dur} ease-in-out infinite`,
          }}
        >
          {/* 收 ｜ 清 */}
          <div
            className="flex items-center"
            style={{
              gap: rpx(18),
              animation: `ib-text-comp ${dur} ease-in-out infinite`,
            }}
          >
            <span
              style={{
                ...baseTextStyle,
                color: "#5A7A52",
                animation: `ib-hl-inhale ${dur} ease-in-out infinite`,
              }}
            >
              收
            </span>
            <span
              style={{
                width: "1px",
                height: rpx(28),
                background: "rgba(139,170,125,0.3)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                ...baseTextStyle,
                color: "#5A7A52",
                animation: `ib-hl-exhale ${dur} ease-in-out infinite`,
              }}
            >
              清
            </span>
          </div>
        </div>
      </div>

      {/* 呼吸阶段提示 — 仅呼吸中显示 */}
      {isActive && (
        <div
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(24),
            fontWeight: 400,
            color: "rgba(90,122,82,0.45)",
            letterSpacing: rpx(6),
            lineHeight: 1,
          }}
        >
          <span className="relative">
            <span
              style={{
                animation: `ib-show-inhale ${dur} ease-in-out infinite`,
              }}
            >
              吸
            </span>
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                animation: `ib-show-exhale ${dur} ease-in-out infinite`,
              }}
            >
              呼
            </span>
          </span>
        </div>
      )}

      {/* 动画定义 — 白绿生命力配色 */}
      <style>{`
        @keyframes ib-outer {
          0%, 100% { transform: scale(0.90); opacity: 0.4; }
          50%      { transform: scale(1.10); opacity: 1; }
        }
        @keyframes ib-mid {
          0%, 100% { transform: scale(0.93); opacity: 0.5; }
          50%      { transform: scale(1.07); opacity: 1; }
        }
        @keyframes ib-inner {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.8;
            box-shadow: 0 4px 30px rgba(139,170,125,0.08), 0 0 60px rgba(139,170,125,0.04), inset 0 0 25px rgba(255,255,255,0.45);
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
            box-shadow: 0 4px 50px rgba(139,170,125,0.16), 0 0 100px rgba(139,170,125,0.08), inset 0 0 40px rgba(255,255,255,0.65);
          }
        }
        @keyframes ib-text-comp {
          0%, 100% { transform: scale(${(1 / 0.96).toFixed(4)}); }
          50%      { transform: scale(${(1 / 1.04).toFixed(4)}); }
        }
        /* 收 — 扩张时亮（鼠尾草绿） */
        @keyframes ib-hl-inhale {
          0%, 100% { color: rgba(90,122,82,0.28); }
          45%, 55% { color: #6B8F63; }
        }
        /* 清 — 收缩时亮 */
        @keyframes ib-hl-exhale {
          0%, 100% { color: #6B8F63; }
          45%, 55% { color: rgba(90,122,82,0.28); }
        }
        /* 吸 — 前半周期可见 */
        @keyframes ib-show-inhale {
          0%       { opacity: 0; }
          10%, 45% { opacity: 1; }
          55%, 100%{ opacity: 0; }
        }
        /* 呼 — 后半周期可见 */
        @keyframes ib-show-exhale {
          0%, 45%  { opacity: 0; }
          55%, 90% { opacity: 1; }
          100%     { opacity: 0; }
        }
      `}</style>
    </div>
  );
}