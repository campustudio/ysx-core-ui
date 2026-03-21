/**
 * UserDrawer - 用户侧边面板（底部上滑抽屉）
 *
 * 点击左上角头像后弹出，覆盖约 60% 屏幕高度
 *
 * 未登录状态：
 *   空头像 + "登录元思想" + 菜单项（灰色禁用需登录的项）
 *   点击登录区域 → 跳转登录页
 *
 * 已登录状态（模拟）：
 *   用户头像 + 昵称 + 使用天数 + 菜单项全部可用
 *
 * 动画：底部上滑 + 遮罩渐入，不使用 transform 避免 fixed 失效
 */

import { useEffect, useState, useCallback } from "react";
import {
  X,
  Bell,
  Settings,
  Heart,
  Bookmark,
  Clock,
  Info,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { DRAWER_MENU_ITEMS, AUTH_COPY } from "../../config/auth-data";
import { FONT_SERIF, rpx } from "../../config/styles";

// ─── 图标映射 ──────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  heart: Heart,
  bookmark: Bookmark,
  clock: Clock,
  settings: Settings,
  info: Info,
};

// ─── Props ─────────────────────────────────────────────

interface UserDrawerProps {
  /** 是否打开 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 点击登录 → 跳转登录页 */
  onLoginClick: () => void;
  /** 是否已登录（模拟） */
  isLoggedIn?: boolean;
  /** 用户信息（模拟） */
  userInfo?: {
    name: string;
    avatar: string;
    days: number;
  };
  /** 点击退出登录 */
  onLogout?: () => void;
}

export function UserDrawer({
  open,
  onClose,
  onLoginClick,
  isLoggedIn = false,
  userInfo,
  onLogout,
}: UserDrawerProps) {
  /** 内部动画状态：mounted → visible → unmount */
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(timer);
    }
  }, [open]);

  /** 点击遮罩关闭 */
  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* 遮罩层 */}
      <div
        onClick={handleOverlayClick}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(30, 20, 10, 0.45)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* 抽屉面板 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "70vh",
          background: "#FAF7F2",
          borderRadius: `${rpx(28)} ${rpx(28)} 0 0`,
          boxShadow: "0 -8px 40px rgba(30, 20, 10, 0.15)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.35s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── 顶栏：消息 + 设置 + 关闭 ── */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: `${rpx(28)} ${rpx(36)} ${rpx(12)}`,
          }}
        >
          <div className="flex items-center" style={{ gap: rpx(24) }}>
            <button
              className="cursor-pointer"
              style={{ background: "none", border: "none", padding: rpx(8) }}
              onClick={onClose}
            >
              <Bell
                size={20}
                strokeWidth={1.5}
                style={{ color: "rgba(58,48,40,0.55)" }}
              />
            </button>
          </div>
          <button
            className="cursor-pointer"
            style={{ background: "none", border: "none", padding: rpx(8) }}
            onClick={onClose}
          >
            <X
              size={22}
              strokeWidth={1.5}
              style={{ color: "rgba(58,48,40,0.65)" }}
            />
          </button>
        </div>

        {/* ── 用户信息区 ── */}
        <div
          className="flex items-center cursor-pointer"
          style={{
            padding: `${rpx(20)} ${rpx(36)} ${rpx(28)}`,
            gap: rpx(24),
          }}
          onClick={isLoggedIn ? undefined : onLoginClick}
        >
          {/* 头像 */}
          <div
            className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              width: rpx(96),
              height: rpx(96),
              background: isLoggedIn ? "transparent" : "rgba(196,154,108,0.12)",
            }}
          >
            {isLoggedIn && userInfo ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User
                size={36}
                strokeWidth={1.2}
                style={{ color: "rgba(196,154,108,0.5)" }}
              />
            )}
          </div>

          {/* 名字/登录提示 */}
          <div className="flex-1" style={{ minWidth: 0 }}>
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "var(--font-size-lg)",
                color: "#3A3028",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {isLoggedIn && userInfo
                ? `${AUTH_COPY.loggedInGreeting}，${userInfo.name}`
                : AUTH_COPY.drawerTitle}
            </p>
            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "rgba(58,48,40,0.5)",
                margin: `${rpx(6)} 0 0`,
                lineHeight: 1.4,
              }}
            >
              {isLoggedIn && userInfo
                ? `${AUTH_COPY.usageDaysLabel} ${userInfo.days} ${AUTH_COPY.usageDaysSuffix}`
                : AUTH_COPY.drawerSubtitle}
            </p>
          </div>

          {!isLoggedIn && (
            <ChevronRight
              size={18}
              strokeWidth={1.5}
              style={{ color: "#C49A6C", flexShrink: 0 }}
            />
          )}
        </div>

        {/* ── 分割线 ── */}
        <div
          style={{
            height: 1,
            margin: `0 ${rpx(36)}`,
            background: "rgba(196,154,108,0.12)",
          }}
        />

        {/* ── 菜单列表 ── */}
        <div
          style={{
            padding: `${rpx(12)} 0`,
            overflowY: "auto",
            flex: 1,
          }}
        >
          {DRAWER_MENU_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon] || Info;
            const disabled = item.requiresAuth && !isLoggedIn;

            return (
              <button
                key={item.id}
                className="flex items-center w-full cursor-pointer"
                style={{
                  padding: `${rpx(22)} ${rpx(36)}`,
                  background: "none",
                  border: "none",
                  gap: rpx(20),
                  opacity: disabled ? 0.4 : 1,
                  pointerEvents: disabled ? "none" : "auto",
                }}
                onClick={() => {
                  if (!disabled) onClose();
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  style={{ color: "#C49A6C", flexShrink: 0 }}
                />
                <span
                  className="flex-1"
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "#3A3028",
                    textAlign: "left",
                  }}
                >
                  {item.label}
                </span>
                <ChevronRight
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "rgba(58,48,40,0.2)", flexShrink: 0 }}
                />
              </button>
            );
          })}

          {/* 退出登录（仅已登录时） */}
          {isLoggedIn && (
            <button
              className="flex items-center w-full cursor-pointer"
              style={{
                padding: `${rpx(22)} ${rpx(36)}`,
                background: "none",
                border: "none",
                gap: rpx(20),
                marginTop: rpx(8),
              }}
              onClick={() => {
                onLogout?.();
                onClose();
              }}
            >
              <LogOut
                size={20}
                strokeWidth={1.5}
                style={{ color: "rgba(58,48,40,0.4)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "rgba(58,48,40,0.5)",
                  textAlign: "left",
                }}
              >
                退出登录
              </span>
            </button>
          )}
        </div>

        {/* 底部安全区 */}
        <div style={{ height: "env(safe-area-inset-bottom, 16px)" }} />
      </div>
    </div>
  );
}
