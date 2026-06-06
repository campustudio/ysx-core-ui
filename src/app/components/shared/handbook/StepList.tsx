/**
 * StepList - 一分钟练习步骤（逐步展开 + 柔和淡入）
 *
 * 关键点：
 *  - 列表项用 **稳定 key（索引）**，新增步骤时已显示的步骤不会重挂载，
 *    因此不会整组闪动；只有新步骤做一次淡入。
 *  - 极简：无金线边框，仅一层很轻的底，避免「卡中卡」。
 */

import { useState, useEffect } from "react";
import { FONT_SERIF, rpx } from "../../../config/styles";

const GOLD = "#B8975A";

interface StepListProps {
  steps: string[];
  stepByStep?: boolean;
}

function StepItem({
  step,
  index,
  animate,
}: {
  step: string;
  index: number;
  animate: boolean;
}) {
  // animate=true：本步是新出现的，做一次淡入；否则直接显示（不重播）
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: rpx(18),
        marginTop: index === 0 ? 0 : rpx(24),
        opacity: visible ? 1 : 0,
        transition: "opacity 0.85s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span
        style={{
          width: rpx(38),
          height: rpx(38),
          borderRadius: "50%",
          background: "rgba(184,151,90,0.12)",
          color: GOLD,
          fontFamily: FONT_SERIF,
          fontSize: rpx(20),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </span>
      <p
        style={{
          flex: 1,
          fontSize: rpx(26),
          color: "#33312C",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {step}
      </p>
    </div>
  );
}

export function StepList({ steps, stepByStep = false }: StepListProps) {
  const [visibleCount, setVisibleCount] = useState(
    stepByStep ? 1 : steps.length,
  );

  const shown = steps.slice(0, visibleCount);
  const hasMore = stepByStep && visibleCount < steps.length;

  return (
    <div>
      <div
        style={{
          background: "rgba(255,255,255,0.6)",
          boxShadow: "0 2px 14px rgba(80,66,38,0.05)",
          borderRadius: rpx(28),
          padding: `${rpx(30)} ${rpx(34)}`,
        }}
      >
        {shown.map((step, i) => (
          <StepItem
            key={i}
            index={i}
            step={step}
            animate={stepByStep && i >= 1}
          />
        ))}
      </div>

      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() =>
              setVisibleCount((c) => Math.min(c + 1, steps.length))
            }
            style={{
              marginTop: rpx(22),
              padding: `${rpx(14)} ${rpx(40)}`,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              color: GOLD,
              letterSpacing: rpx(3),
              opacity: 0.9,
            }}
          >
            下一步
          </button>
        </div>
      )}
    </div>
  );
}
