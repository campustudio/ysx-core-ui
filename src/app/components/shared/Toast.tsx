/**
 * Toast - 轻量提示组件
 *
 * 温柔浮现的底部提示，自动消失
 * 视觉风格：琥珀金点缀 + 古纸底 + 柔和阴影
 * 位置：底部导航栏上方
 *
 * 长文本处理：maxWidth 85vw + wordBreak: break-word 自动换行
 * 不使用 whiteSpace: nowrap（避免溢出截断）
 *
 * Props:
 *   - message: 提示文案
 *   - visible: 是否显示
 *   - duration: 显示时长（ms），默认 2000
 *   - onDismiss: 消失回调
 */

import { useEffect, useState, useRef } from "react";
import { FONT_SERIF, rpx } from "../../config/styles";

/** CSS 动画 — 淡入上浮 / 淡出下沉 */
const TOAST_STYLES = `
@keyframes meta-toast-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes meta-toast-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(8px);
  }
}
`;

interface ToastProps {
  /** 提示文案 */
  message: string;
  /** 是否显示 */
  visible: boolean;
  /** 显示时长，默认 2000ms */
  duration?: number;
  /** 消失后的回调 */
  onDismiss?: () => void;
}

export function Toast({
  message,
  visible,
  duration = 2000,
  onDismiss,
}: ToastProps) {
  /** 内部展示状态：控制退出动画播放完毕后再真正隐藏 */
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  /** 用 ref 保存最新的 onDismiss，避免因引用变化导致计时器重置 */
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!visible) return;

    setShow(true);
    setExiting(false);

    // 显示一段时间后开始退出动画
    const showTimer = setTimeout(() => {
      setExiting(true);
    }, duration);

    // 退出动画结束后真正隐藏
    const hideTimer = setTimeout(() => {
      setShow(false);
      setExiting(false);
      onDismissRef.current?.();
    }, duration + 280);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [visible, duration]);

  if (!show) return null;

  return (
    <>
      <style>{TOAST_STYLES}</style>
      <div
        className="fixed left-0 right-0 flex justify-center pointer-events-none"
        style={{
          bottom: `calc(var(--nav-height) + ${rpx(32)})`,
          zIndex: "var(--z-toast)",
        }}
      >
        <div
          className="pointer-events-auto"
          style={{
            padding: `${rpx(20)} ${rpx(40)}`,
            background: "rgba(60, 50, 38, 0.88)",
            borderRadius: rpx(40),
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(196,154,108,0.2)",
            animation: exiting
              ? "meta-toast-out 0.28s ease-in forwards"
              : "meta-toast-in 0.32s cubic-bezier(0.25,0.1,0.25,1) both",
            maxWidth: "85vw",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              fontWeight: 400,
              color: "#F0E4CE",
              letterSpacing: rpx(1),
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {message}
          </span>
        </div>
      </div>
    </>
  );
}