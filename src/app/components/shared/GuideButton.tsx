/**
 * GuideButton - 探索按钮
 *
 * 竖排文字 + 右上/左下弧线包裹 + 呼吸动画
 * 点击后跳转到引导页
 *
 * Props:
 * - label: 按钮文字（默认"探索"）
 * - onClick: 点击回调
 */

import { FONT_SERIF, TEXT_SHADOW_HERO } from "../../config/styles";

interface GuideButtonProps {
  /** 按钮文字 */
  label?: string;
  /** 点击回调 */
  onClick?: () => void;
}

export function GuideButton({ label = "探索", onClick }: GuideButtonProps) {
  return (
    <>
      <div
        className="flex justify-center"
        style={{ marginBottom: "var(--spacing-md)" }}
      >
        <button
          className="cursor-pointer inline-flex items-center justify-center"
          style={{
            background: "none",
            border: "none",
            padding: "calc(var(--rpx) * 10)",
            position: "relative",
            animation: "guideArcBreath 3.5s ease-in-out infinite",
          }}
          onClick={onClick}
        >
          {/* 右上弧线 */}
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "calc(var(--rpx) * 16)",
              height: "calc(var(--rpx) * 16)",
              borderTop: "1.5px solid rgba(255,255,255,0.55)",
              borderRight: "1.5px solid rgba(255,255,255,0.55)",
              borderTopRightRadius: "calc(var(--rpx) * 8)",
              pointerEvents: "none",
            }}
          />
          {/* 左下弧线 */}
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "calc(var(--rpx) * 16)",
              height: "calc(var(--rpx) * 16)",
              borderBottom: "1.5px solid rgba(255,255,255,0.55)",
              borderLeft: "1.5px solid rgba(255,255,255,0.55)",
              borderBottomLeftRadius: "calc(var(--rpx) * 8)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              writingMode: "vertical-rl",
              display: "block",
              fontSize: "var(--font-size-base)",
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "calc(var(--rpx) * 6)",
              textShadow:
                "0 1px 4px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.15)",
            }}
          >
            {label}
          </span>
        </button>
      </div>

      {/* 弧线呼吸动画 */}
      <style>{`
        @keyframes guideArcBreath {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
