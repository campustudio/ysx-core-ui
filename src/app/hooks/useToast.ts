/**
 * useToast - Toast 状态管理 Hook
 *
 * 抽离 5 个页面中重复的 Toast 状态逻辑：
 *   [toastVisible, setToastVisible] + [toastMessage, setToastMessage]
 *   + showToast() + dismissToast()
 *
 * 使用方式：
 *   const toast = useToast();
 *   toast.show("消息文案");
 *
 *   <Toast
 *     message={toast.message}
 *     visible={toast.visible}
 *     duration={toast.duration}
 *     onDismiss={toast.dismiss}
 *   />
 *
 * 已在以下页面统一使用：
 *   Home / OnboardingGuide / OnboardingSolar / PodcastDetail / ActivityDetail
 */

import { useState, useCallback } from "react";

interface UseToastReturn {
  /** 当前提示文案 */
  message: string;
  /** 是否显示 */
  visible: boolean;
  /** 显示时长 (ms) */
  duration: number;
  /** 显示 Toast（传入文案） */
  show: (msg: string) => void;
  /** 手动关闭 Toast（通常传给 onDismiss） */
  dismiss: () => void;
}

/**
 * @param duration 显示时长，默认 2200ms
 */
export function useToast(duration = 2200): UseToastReturn {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return { message, visible, duration, show, dismiss };
}
