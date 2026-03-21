/**
 * LoginPage - 登录页
 *
 * 全屏沉浸式登录页面，参考潮汐但有自己的风格创新：
 *   - 自然风景背景 + 深色遮罩
 *   - 品牌标识 + 欢迎文案
 *   - 三种登录方式（微信主推 + 手机号 + Apple）
 *   - 底部隐私协议勾选
 *
 * 当前为 UI 外壳阶段：
 *   点击登录按钮 → 检查协议勾选 → 模拟登录成功 → 回调
 *   未勾选协议 → 弹出 PrivacyDialog
 */

import { useState, useCallback } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Smartphone,
  Apple,
  Check,
} from "lucide-react";
import {
  LOGIN_METHODS,
  AUTH_COPY,
  LOGIN_BG_IMAGE,
} from "../config/auth-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { PrivacyDialog } from "../components/auth/PrivacyDialog";

// ─── 图标映射 ──────────────────────────────────────────

const LOGIN_ICON_MAP: Record<
  string,
  React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>
> = {
  "message-circle": MessageCircle,
  smartphone: Smartphone,
  apple: Apple,
};

// ─── Props ─────────────────────────────────────────────

interface LoginPageProps {
  /** 返回上一页 */
  onBack: () => void;
  /** 登录成功回调（传入模拟用户信息） */
  onLoginSuccess: (userInfo: {
    name: string;
    avatar: string;
    days: number;
  }) => void;
}

export function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  /** 隐私协议是否已勾选 */
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  /** 隐私弹框是否显示 */
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  /** 当前尝试登录的方式 ID（用于弹框后继续） */
  const [pendingLoginMethod, setPendingLoginMethod] = useState<string | null>(
    null
  );

  /** 执行模拟登录 */
  const doMockLogin = useCallback(
    (_methodId: string) => {
      // 模拟登录成功 — 返回假用户数据
      onLoginSuccess({
        name: "元思想用户",
        avatar:
          "https://images.unsplash.com/photo-1587362869854-3898f1e5c2ac?w=100&h=100&fit=crop",
        days: 7,
      });
    },
    [onLoginSuccess]
  );

  /** 点击登录按钮 */
  const handleLogin = useCallback(
    (methodId: string) => {
      if (!privacyAgreed) {
        setPendingLoginMethod(methodId);
        setShowPrivacyDialog(true);
        return;
      }
      doMockLogin(methodId);
    },
    [privacyAgreed, doMockLogin]
  );

  /** 隐私弹框 - 同意 */
  const handlePrivacyAgree = useCallback(() => {
    setPrivacyAgreed(true);
    setShowPrivacyDialog(false);
    if (pendingLoginMethod) {
      // 延迟一帧执行，等弹框关闭动画
      requestAnimationFrame(() => {
        doMockLogin(pendingLoginMethod);
      });
    }
  }, [pendingLoginMethod, doMockLogin]);

  /** 隐私弹框 - 取消 */
  const handlePrivacyCancel = useCallback(() => {
    setShowPrivacyDialog(false);
    setPendingLoginMethod(null);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 背景图 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${LOGIN_BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* 遮罩 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(30,20,10,0.3) 0%, rgba(30,20,10,0.55) 50%, rgba(30,20,10,0.75) 100%)",
        }}
      />

      {/* ── 内容 ── */}
      <div
        className="relative flex flex-col flex-1"
        style={{
          maxWidth: "var(--max-container-width)",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* 返回按钮 */}
        <div
          style={{
            paddingTop: `max(${rpx(24)}, env(safe-area-inset-top))`,
            paddingLeft: rpx(28),
            paddingBottom: rpx(12),
          }}
        >
          <button
            className="cursor-pointer"
            style={{
              background: "none",
              border: "none",
              padding: rpx(12),
              color: "rgba(255,255,255,0.8)",
            }}
            onClick={onBack}
          >
            <ArrowLeft size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* 品牌区 */}
        <div
          className="flex-1 flex flex-col items-center justify-center"
          style={{ padding: `0 ${rpx(60)}` }}
        >
          {/* 品牌呼吸光圈 */}
          <div
            style={{
              width: rpx(120),
              height: rpx(120),
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(196,154,108,0.35) 0%, rgba(196,154,108,0.08) 60%, transparent 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: rpx(32),
              animation: "loginGlow 4s ease-in-out infinite",
            }}
          >
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "var(--font-size-3xl)",
                color: "rgba(255,255,255,0.9)",
                textShadow:
                  "0 1px 8px rgba(0,0,0,0.3), 0 0 20px rgba(196,154,108,0.2)",
              }}
            >
              元
            </span>
          </div>

          <p
            style={{
              fontSize: "var(--font-size-sm)",
              color: "rgba(255,255,255,0.6)",
              margin: `0 0 ${rpx(6)}`,
              letterSpacing: rpx(2),
            }}
          >
            {AUTH_COPY.loginWelcome}
          </p>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "var(--font-size-2xl)",
              color: "rgba(255,255,255,0.95)",
              margin: 0,
              letterSpacing: rpx(4),
              textShadow: "0 1px 6px rgba(0,0,0,0.25)",
            }}
          >
            {AUTH_COPY.loginBrand}
          </h1>
          <p
            style={{
              fontSize: "var(--font-size-xs)",
              color: "rgba(255,255,255,0.5)",
              margin: `${rpx(16)} 0 0`,
              letterSpacing: rpx(1),
            }}
          >
            {AUTH_COPY.loginSubtitle}
          </p>
        </div>

        {/* ── 登录按钮区 ── */}
        <div
          style={{
            padding: `0 ${rpx(60)} ${rpx(24)}`,
            display: "flex",
            flexDirection: "column",
            gap: rpx(20),
          }}
        >
          {LOGIN_METHODS.map((method) => {
            const Icon = LOGIN_ICON_MAP[method.icon];
            const isPrimary = method.variant === "primary";

            return (
              <button
                key={method.id}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: "100%",
                  height: rpx(88),
                  borderRadius: rpx(44),
                  border: isPrimary
                    ? "none"
                    : method.variant === "outline"
                      ? "1px solid rgba(255,255,255,0.3)"
                      : "none",
                  background: isPrimary
                    ? method.bgColor
                    : method.variant === "secondary"
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                  color: isPrimary
                    ? method.textColor
                    : "rgba(255,255,255,0.85)",
                  fontSize: "var(--font-size-sm)",
                  gap: rpx(12),
                  backdropFilter:
                    method.variant === "secondary" ? "blur(12px)" : undefined,
                  WebkitBackdropFilter:
                    method.variant === "secondary" ? "blur(12px)" : undefined,
                  transition: "opacity 0.2s ease",
                }}
                onClick={() => handleLogin(method.id)}
              >
                {Icon && <Icon size={20} strokeWidth={1.5} />}
                {method.label}
              </button>
            );
          })}
        </div>

        {/* ── 隐私协议勾选 ── */}
        <div
          className="flex items-start justify-center"
          style={{
            padding: `${rpx(16)} ${rpx(60)} ${rpx(48)}`,
            paddingBottom: `max(${rpx(48)}, env(safe-area-inset-bottom))`,
            gap: rpx(10),
          }}
        >
          <button
            className="flex-shrink-0 cursor-pointer"
            style={{
              width: rpx(32),
              height: rpx(32),
              borderRadius: rpx(6),
              border: privacyAgreed
                ? "none"
                : "1.5px solid rgba(255,255,255,0.35)",
              background: privacyAgreed
                ? "#C49A6C"
                : "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              marginTop: rpx(2),
            }}
            onClick={() => setPrivacyAgreed(!privacyAgreed)}
          >
            {privacyAgreed && (
              <Check
                size={14}
                strokeWidth={2.5}
                style={{ color: "#ffffff" }}
              />
            )}
          </button>
          <p
            style={{
              fontSize: "var(--font-size-xs)",
              color: "rgba(255,255,255,0.45)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {AUTH_COPY.privacyCheckLabel}{" "}
            <span
              style={{ color: "rgba(196,154,108,0.8)", cursor: "pointer" }}
            >
              {AUTH_COPY.privacyTerms}
            </span>{" "}
            和{" "}
            <span
              style={{ color: "rgba(196,154,108,0.8)", cursor: "pointer" }}
            >
              {AUTH_COPY.privacyPolicy}
            </span>
          </p>
        </div>
      </div>

      {/* 品牌光圈呼吸动画 */}
      <style>{`
        @keyframes loginGlow {
          0%, 100% { opacity: 0.7; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>

      {/* 隐私协议弹框 */}
      <PrivacyDialog
        open={showPrivacyDialog}
        onCancel={handlePrivacyCancel}
        onAgree={handlePrivacyAgree}
      />
    </div>
  );
}
