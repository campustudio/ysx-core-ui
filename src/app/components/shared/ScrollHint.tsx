/**
 * ScrollHint - 滚动提示
 *
 * 向下箭头动画，引导用户上滑探索内容
 * 与上方「探索」上下对称呼应
 *
 * v1.1: 移除「觉知」文字标签，仅保留箭头引导（产品反馈 #7）
 */

import { ChevronDown } from "lucide-react";

export function ScrollHint() {
  return (
    <>
      <div className="flex flex-col items-center">
        <ChevronDown
          style={{
            width: "calc(var(--rpx) * 28)",
            height: "calc(var(--rpx) * 28)",
            color: "rgba(255,255,255,0.5)",
            animation: "scrollHint 2s ease-in-out infinite",
            filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.4))",
          }}
          strokeWidth={1.2}
        />
      </div>

      {/* 滚动提示动画 */}
      <style>{`
        @keyframes scrollHint {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}