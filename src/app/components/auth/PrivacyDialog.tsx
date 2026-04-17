/**
 * PrivacyDialog - 隐私协议确认弹框
 *
 * 未勾选隐私协议就点登录时弹出
 * 居中弹窗 + 遮罩，两个按钮：取消 / 同意
 * 点击「服务条款」「隐私协议」可跳转查看（当前 Toast 提示）
 */

import { useEffect, useState } from "react";
import { AUTH_COPY } from "../../config/auth-data";
import { FONT_SERIF, rpx } from "../../config/styles";

interface PrivacyDialogProps {
  /** 是否显示 */
  open: boolean;
  /** 取消回调 */
  onCancel: () => void;
  /** 同意回调 → 勾选协议 + 执行登录 */
  onAgree: () => void;
}

export function PrivacyDialog({ open, onCancel, onAgree }: PrivacyDialogProps) {
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
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* 遮罩 */}
      <div
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(30, 20, 10, 0.5)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* 弹窗 */}
      <div
        style={{
          position: "relative",
          width: `min(${rpx(580)}, 85vw)`,
          background: "#FAF7F2",
          borderRadius: rpx(24),
          boxShadow: "0 16px 48px rgba(30, 20, 10, 0.2)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.92)",
          transition:
            "opacity 0.25s ease, transform 0.25s cubic-bezier(0.33, 1, 0.68, 1)",
          overflow: "hidden",
        }}
      >
        {/* 标题 */}
        <div
          style={{
            padding: `${rpx(40)} ${rpx(36)} ${rpx(16)}`,
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "var(--font-size-lg)",
              color: "#3A3028",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {AUTH_COPY.privacyTitle}
          </h3>
        </div>

        {/* 内容 */}
        <div style={{ padding: `0 ${rpx(36)} ${rpx(32)}` }}>
          <p
            style={{
              fontSize: "var(--font-size-sm)",
              color: "rgba(58,48,40,0.7)",
              lineHeight: 1.7,
              margin: 0,
              textAlign: "center",
            }}
          >
            在使用元感知前，请你仔细阅读并同意
            <span
              style={{ color: "#C49A6C", cursor: "pointer" }}
              onClick={(e) => e.stopPropagation()}
            >
              {AUTH_COPY.privacyTerms}
            </span>
            和
            <span
              style={{ color: "#C49A6C", cursor: "pointer" }}
              onClick={(e) => e.stopPropagation()}
            >
              {AUTH_COPY.privacyPolicy}
            </span>
            。我们将依法保护你的个人信息安全。
          </p>
        </div>

        {/* 按钮 */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(196,154,108,0.1)",
          }}
        >
          <button
            className="cursor-pointer"
            style={{
              flex: 1,
              padding: `${rpx(24)} 0`,
              background: "none",
              border: "none",
              borderRight: "1px solid rgba(196,154,108,0.1)",
              fontSize: "var(--font-size-base)",
              color: "rgba(58,48,40,0.5)",
            }}
            onClick={onCancel}
          >
            取消
          </button>
          <button
            className="cursor-pointer"
            style={{
              flex: 1,
              padding: `${rpx(24)} 0`,
              background: "none",
              border: "none",
              fontSize: "var(--font-size-base)",
              color: "#C49A6C",
              fontFamily: FONT_SERIF,
            }}
            onClick={onAgree}
          >
            同意
          </button>
        </div>
      </div>
    </div>
  );
}
