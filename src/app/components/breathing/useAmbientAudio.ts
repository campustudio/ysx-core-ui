/**
 * useAmbientAudio - 环境音效播放 Hook
 *
 * 封装音频播放的完整生命周期：
 *   - play(src)   → 加载并循环播放指定音源
 *   - fadeOut(ms)  → 平滑淡出后停止
 *   - stop()       → 立即停止
 *   - 组件卸载时自动清理
 *
 * 使用方式：
 *   const audio = useAmbientAudio();
 *   audio.play("/audio/ambient-rain.mp3");  // 开始播放
 *   audio.fadeOut(2000);                     // 2秒淡出
 *
 * 注意：
 *   浏览器要求用户交互后才能播放音频（autoplay policy）
 *   此 hook 需在用户点击"开始"后调用 play()
 */

import { useRef, useCallback, useEffect } from "react";
import { AMBIENT_VOLUME, AMBIENT_FADE_OUT_MS } from "../../config/breathing-data";
import { resolveAudioUrl } from "../../utils/audio-generator";

export function useAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** 清理淡出定时器 */
  const clearFadeTimer = useCallback(() => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  /** 停止播放并释放资源 */
  const stop = useCallback(() => {
    clearFadeTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      audioRef.current = null;
    }
  }, [clearFadeTimer]);

  /** 播放指定音源 */
  const play = useCallback(
    (src: string) => {
      // 先停掉之前的
      stop();
      if (!src) return;

      // 解析音频 URL（如果是占位路径，自动合成替换）
      resolveAudioUrl(src).then((resolvedUrl) => {
        if (!resolvedUrl) return;

        const audio = new Audio(resolvedUrl);
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;

        // 渐入：从 0 到目标音量，300ms
        audio
          .play()
          .then(() => {
            let vol = 0;
            const step = AMBIENT_VOLUME / 15;
            const fadeIn = setInterval(() => {
              vol += step;
              if (vol >= AMBIENT_VOLUME) {
                vol = AMBIENT_VOLUME;
                clearInterval(fadeIn);
              }
              if (audioRef.current) {
                audioRef.current.volume = vol;
              }
            }, 20);
          })
          .catch(() => {
            // 浏览器 autoplay 策略阻止 — 静默失败
          });
      });
    },
    [stop]
  );

  /** 淡出停止 */
  const fadeOut = useCallback(
    (ms: number = AMBIENT_FADE_OUT_MS) => {
      if (!audioRef.current) return;
      const audio = audioRef.current;
      const startVol = audio.volume;
      const steps = Math.max(Math.floor(ms / 20), 1);
      const decrement = startVol / steps;
      let current = startVol;

      clearFadeTimer();
      fadeTimerRef.current = setInterval(() => {
        current -= decrement;
        if (current <= 0) {
          current = 0;
          stop();
        } else if (audioRef.current) {
          audioRef.current.volume = current;
        }
      }, 20);
    },
    [clearFadeTimer, stop]
  );

  /** 组件卸载时清理 */
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { play, fadeOut, stop };
}