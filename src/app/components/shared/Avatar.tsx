/**
 * Avatar - 头像按钮
 *
 * 可复用的圆形头像组件
 * 支持两种视觉模式：light（深色背景上） / dark（浅色背景上）
 *
 * 未登录状态（无 src）显示空心人物图标
 * 已登录状态（有 src）显示用户头像
 *
 * Props:
 * - src: 头像图片地址（为空时显示默认图标）
 * - size: 尺寸（sm/md/lg）
 * - variant: 视觉模式（light=白色边框适合深色背景, dark=深色边框适合浅色背景）
 * - onClick: 点击回调
 */

import { User } from "lucide-react";

interface AvatarProps {
  /** 头像图片 URL，为空时显示默认图标 */
  src?: string;
  /** 尺寸 */
  size?: "sm" | "md" | "lg";
  /** 视觉模式 */
  variant?: "light" | "dark";
  /** 点击回调 */
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: "var(--avatar-sm)",
  md: "var(--avatar-md)",
  lg: "var(--avatar-lg)",
} as const;

/** 图标尺寸（px），与头像尺寸匹配 */
const ICON_SIZE_MAP = {
  sm: 18,
  md: 24,
  lg: 30,
} as const;

const BG_MAP = {
  light: "rgba(255,255,255,0.4)",
  dark: "rgba(61, 52, 40, 0.08)",
} as const;

const ICON_COLOR_MAP = {
  light: "rgba(255,255,255,0.7)",
  dark: "rgba(61, 52, 40, 0.45)",
} as const;

export function Avatar({
  src,
  size = "sm",
  variant = "light",
  onClick,
}: AvatarProps) {
  const hasImage = !!src;

  return (
    <button
      className="rounded-full overflow-hidden flex items-center justify-center p-0 m-0 flex-shrink-0 cursor-pointer"
      style={{
        width: SIZE_MAP[size],
        height: SIZE_MAP[size],
        background: BG_MAP[variant],
        transition: "background 0.35s ease",
        border: "none",
      }}
      onClick={onClick}
    >
      {hasImage ? (
        <img
          src={src}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <User
          size={ICON_SIZE_MAP[size]}
          strokeWidth={1.5}
          style={{ color: ICON_COLOR_MAP[variant] }}
        />
      )}
    </button>
  );
}
