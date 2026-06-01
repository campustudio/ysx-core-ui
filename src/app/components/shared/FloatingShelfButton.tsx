/**
 * FloatingShelfButton - 「进入完整书架」浮动按钮
 *
 * 固定在视口底部，按底部菜单栏显隐切换定位：
 *   - 菜单栏隐藏（navHidden=true）：贴近视口底部浮动。
 *   - 菜单栏显示（navHidden=false）：上移到菜单栏上方并留间距，不遮挡菜单。
 * 仅改变 bottom 偏移并加过渡，避免在 fixed / 文档流之间切换造成的跳动。
 */

import { Library } from "lucide-react";
import { FONT_SERIF, rpx } from "../../config/styles";

interface FloatingShelfButtonProps {
  onClick?: () => void;
  /** 底部菜单栏是否隐藏 */
  navHidden?: boolean;
  title?: string;
  subtitle?: string;
}

export function FloatingShelfButton({
  onClick,
  navHidden = false,
  title = "进入完整书架",
  subtitle = "浏览全部书籍与资料",
}: FloatingShelfButtonProps) {
  // 菜单栏可见时上移到其上方（菜单高度约 94rpx + 间距）；隐藏时贴底
  const bottom = navHidden
    ? `calc(env(safe-area-inset-bottom) + ${rpx(28)})`
    : `calc(env(safe-area-inset-bottom) + ${rpx(150)})`;

  return (
    <div
      style={{
        position: "fixed",
        left: rpx(40),
        right: rpx(40),
        bottom,
        zIndex: 60,
        transition: "bottom 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: `${rpx(26)} 0`,
          border: "none",
          borderRadius: rpx(40),
          background: "linear-gradient(135deg, #D8C089, #C2A661)",
          boxShadow: "0 12px 30px rgba(184,151,90,0.32)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: rpx(4),
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(12),
            fontFamily: FONT_SERIF,
            fontSize: rpx(30),
            fontWeight: 600,
            color: "#4A3D22",
            letterSpacing: rpx(3),
          }}
        >
          <Library size={20} color="#4A3D22" strokeWidth={1.6} />
          {title}
        </span>
        <span style={{ fontSize: rpx(20), color: "rgba(74,61,34,0.7)", letterSpacing: rpx(1) }}>
          {subtitle}
        </span>
      </button>
    </div>
  );
}
