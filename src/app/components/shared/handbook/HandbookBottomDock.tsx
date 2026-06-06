/**
 * HandbookBottomDock - 底部操作区
 *
 * 极简：不画实心条 / 边框，只用一层从透明到背景色的柔和渐变，
 * 让滚动内容自然淡入底部，按钮（自带背景）落在其上即可。
 */

import type { ReactNode } from "react";
import { rpx, HANDBOOK_BG, GENTLE_EASE_OUT } from "../../../config/styles";
import { useBottomNav } from "../../navigation/BottomNavContext";

interface HandbookBottomDockProps {
  children: ReactNode;
}

export function HandbookBottomDock({ children }: HandbookBottomDockProps) {
  const { present, hidden, height } = useBottomNav();
  // 导航存在且显示时，坞抬到导航之上并随其升降；否则落到视口底部
  const lifted = present && !hidden;
  const bottomOffset = lifted ? height : "0px";
  const paddingBottom = lifted
    ? rpx(28)
    : `calc(env(safe-area-inset-bottom) + ${rpx(28)})`;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        zIndex: 10,
        padding: `${rpx(40)} ${rpx(48)} ${paddingBottom}`,
        background: `linear-gradient(to bottom, rgba(245,244,241,0) 0%, ${HANDBOOK_BG} 38%)`,
        transition: `bottom 0.34s ${GENTLE_EASE_OUT}`,
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto" }}>{children}</div>
    </div>
  );
}
