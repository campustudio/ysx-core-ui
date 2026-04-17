/**
 * BreathingCircle - 呼吸引导圆环
 *
 * 元感知品牌标志性交互元素
 * 4秒吸气 + 4秒呼气 = 8秒一个呼吸周期
 *
 * 内圈文字：收 ｜ 清
 *   左「收」— 收回注意力（吸气时高亮）
 *   右「清」— 清空思绪（呼气时高亮）
 *   中间短竖线分隔
 *
 * 文字高亮与呼吸联动：
 *   扩张（吸气）→「收」高亮，「清」变淡
 *   收缩（呼气）→「清」高亮，「收」变淡
 *
 * 文字尺寸稳定设计：
 *   内圈 breatheInner 动画使圆环 scale(0.97↔1.03)，
 *   文字容器加反向补偿动画 textCompensate scale(1/0.97↔1/1.03)，
 *   视觉上文字大小始终不变，只有亮度在呼吸。
 *   避免"圆圈缩放带文字一起缩放"与高亮产生主次错乱。
 *
 * 三层呼吸动画：
 *   外圈 — 大幅scale(0.92→1.08) + opacity脉动
 *   中圈 — 中幅scale(0.95→1.05) + opacity脉动，0.5s延迟
 *   内圈 — 小幅scale(0.97→1.03) + 光晕脉动
 *
 * 中圈和内圈用 inset:0 + margin:auto 居中，
 * 避免 CSS animation 的 transform 覆盖 inline transform
 *
 * Props:
 * - size: 外圈尺寸（rpx），默认 280
 * - leftText/rightText: 内圈文字
 * - onClick: 点击回调（点击内圈区域触发）
 */

import { FONT_SERIF } from "../../config/styles";

interface BreathingCircleProps {
  /** 外圈尺寸（rpx 值），默认 280 */
  size?: number;
  /** 内圈右侧文字 */
  rightText?: string;
  /** 内圈左侧文字 */
  leftText?: string;
  /** 点击圆环回调 */
  onClick?: () => void;
}

export function BreathingCircle({
  size = 280,
  rightText = "清",
  leftText = "收",
  onClick,
}: BreathingCircleProps) {
  const textShadow = "0 1px 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.2)";

  const outerSize = `calc(var(--rpx) * ${size})`;
  const midSize = `calc(var(--rpx) * ${Math.round(size * 0.714)})`;
  const innerSize = `calc(var(--rpx) * ${Math.round(size * 0.571)})`;

  /** 共享文字基础样式 */
  const baseTextStyle = {
    fontSize: "var(--font-size-xl)",
    fontFamily: FONT_SERIF,
    fontWeight: 400,
    textShadow,
    lineHeight: 1,
  } as const;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 呼吸光环容器 */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: outerSize, height: outerSize }}
      >
        {/* 外圈光晕 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(196, 154, 108, 0.18) 0%, rgba(196, 154, 108, 0.06) 50%, transparent 70%)",
            animation: "breatheOuter 8s ease-in-out infinite",
          }}
        />

        {/* 中圈 */}
        <div
          className="absolute rounded-full"
          style={{
            width: midSize,
            height: midSize,
            inset: 0,
            margin: "auto",
            background:
              "radial-gradient(circle, rgba(255, 252, 245, 0.28) 0%, rgba(255, 252, 245, 0.1) 60%, transparent 100%)",
            animation: "breatheMid 8s ease-in-out infinite 0.5s",
          }}
        />

        {/* 内圈 — 暖色磨砂玻璃 */}
        <div
          className="absolute rounded-full backdrop-blur-2xl flex items-center justify-center cursor-pointer"
          onClick={onClick}
          style={{
            width: innerSize,
            height: innerSize,
            inset: 0,
            margin: "auto",
            background: "rgba(255, 248, 235, 0.12)",
            boxShadow:
              "0 0 60px rgba(196, 154, 108, 0.1), inset 0 0 30px rgba(255, 255, 255, 0.06)",
            animation: "breatheInner 8s ease-in-out infinite",
            WebkitBackdropFilter: "blur(40px)",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* 收 ｜ 清 — 呼吸联动高亮 + 反向补偿缩放 */}
          <div
            className="flex items-center"
            style={{
              gap: "calc(var(--rpx) * 14)",
              animation: "textCompensate 8s ease-in-out infinite",
            }}
          >
            {/* 左：收（吸气/扩张时高亮） */}
            <span
              style={{
                ...baseTextStyle,
                color: "white",
                animation: "highlightInhale 8s ease-in-out infinite",
              }}
            >
              {leftText}
            </span>
            {/* 短竖线 */}
            <span
              style={{
                width: "1px",
                height: "calc(var(--rpx) * 22)",
                background: "rgba(255,255,255,0.3)",
                flexShrink: 0,
              }}
            />
            {/* 右：清（呼气/收缩时高亮） */}
            <span
              style={{
                ...baseTextStyle,
                color: "white",
                animation: "highlightExhale 8s ease-in-out infinite",
              }}
            >
              {rightText}
            </span>
          </div>
        </div>
      </div>

      {/* 呼吸动画 — 三层各自独立 + 文字高亮联动 + 反向补偿 */}
      <style>{`
        @keyframes breatheOuter {
          0%, 100% { transform: scale(0.92); opacity: 0.45; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes breatheMid {
          0%, 100% { transform: scale(0.95); opacity: 0.55; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes breatheInner {
          0%, 100% { 
            transform: scale(0.97); 
            opacity: 0.8;
            box-shadow: 0 0 40px rgba(196, 154, 108, 0.06), inset 0 0 20px rgba(255, 255, 255, 0.03);
          }
          50% { 
            transform: scale(1.03); 
            opacity: 1;
            box-shadow: 0 0 80px rgba(196, 154, 108, 0.2), inset 0 0 40px rgba(255, 255, 255, 0.1);
          }
        }
        /* 文字反向补偿：抵消内圈 scale，保持文字视觉大小恒定 */
        @keyframes textCompensate {
          0%, 100% { transform: scale(${(1 / 0.97).toFixed(4)}); }
          50% { transform: scale(${(1 / 1.03).toFixed(4)}); }
        }
        /* 收 — 吸气(扩张)时高亮 */
        @keyframes highlightInhale {
          0%, 100% { color: rgba(255,255,255,0.3); }
          45%, 55% { color: rgba(255,255,255,1); }
        }
        /* 清 — 呼气(收缩)时高亮 */
        @keyframes highlightExhale {
          0%, 100% { color: rgba(255,255,255,1); }
          45%, 55% { color: rgba(255,255,255,0.3); }
        }
      `}</style>
    </div>
  );
}
