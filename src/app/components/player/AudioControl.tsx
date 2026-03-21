/**
 * AudioControl - 音频播放控制组件
 *
 * 核心交互组件，接收音频地址，提供完整的播放控制
 * 包含：播放/暂停按钮 + 进度条 + 时间显示
 *
 * HTML5 Audio API 驱动，无外部依赖
 *
 * 视觉设计：
 *   播放按钮 — 大圆形毛玻璃按钮，呼应呼吸圆环内圈质感
 *   进度条   — 纤细琥珀金线条，触摸可拖拽跳转
 *   时间显示 — 左右分布当前时间/总时长
 *
 * Props:
 * - audioSrc: 音频文件 URL
 * - isPlaying/onPlayingChange: 受控播放状态
 * - onEnded: 播放结束回调
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { PAGE_PADDING_H } from "./PlayerHeader";
import type { AudioType } from "../../utils/audio-generator";
import { getAudioUrl } from "../../utils/audio-generator";

interface AudioControlProps {
  /** 音频文件 URL */
  audioSrc: string;
  /** 合成音频类型标识（优先于 audioSrc） */
  synthType?: AudioType;
  /** 播放状态（受控） */
  isPlaying?: boolean;
  /** 播放状态变更回调 */
  onPlayingChange?: (playing: boolean) => void;
  /** 播放结束回调 */
  onEnded?: () => void;
}

/** 格式化秒数为 mm:ss */
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AudioControl({
  audioSrc,
  synthType,
  isPlaying = false,
  onPlayingChange,
  onEnded,
}: AudioControlProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  /** 实际使用的音频 URL（可能是合成的 blob URL） */
  const [resolvedSrc, setResolvedSrc] = useState(audioSrc);

  // ─── 音频源解析（真实音频优先，合成音频兜底） ──────────────────────────────────
  useEffect(() => {
    if (audioSrc) {
      // 有真实音频路径时直接使用
      setResolvedSrc(audioSrc);
    } else if (synthType) {
      // 无真实音频时才使用合成音频
      getAudioUrl(synthType).then((url) => {
        if (url) setResolvedSrc(url);
      });
    }
  }, [synthType, audioSrc]);

  // ─── 播放/暂停同步 ────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // 自动播放被浏览器阻止时静默处理
        onPlayingChange?.(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPlayingChange]);

  // ─── 音频事件监听 ──────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onDurationChange = () => setDuration(audio.duration);
    const onEndedHandler = () => {
      onPlayingChange?.(false);
      onEnded?.();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEndedHandler);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEndedHandler);
    };
  }, [isDragging, onPlayingChange, onEnded]);

  // ─── 切换播放/暂停 ────────────────────────────────
  const togglePlay = useCallback(() => {
    onPlayingChange?.(!isPlaying);
  }, [isPlaying, onPlayingChange]);

  // ─── 进度条跳转（点击 + 拖拽） ────────────────────
  const seekToPosition = useCallback(
    (clientX: number) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !duration) return;

      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const newTime = ratio * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration],
  );

  const handleProgressClick = useCallback(
    (e: React.MouseEvent) => seekToPosition(e.clientX),
    [seekToPosition],
  );

  const handleTouchStart = useCallback(() => setIsDragging(true), []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) seekToPosition(e.touches[0].clientX);
    },
    [isDragging, seekToPosition],
  );

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  // ─── 进度百分比 ────────────────────────────────────
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 隐藏的 Audio 元素 */}
      <audio ref={audioRef} src={resolvedSrc} preload="metadata" loop />

      {/* 进度条区域 */}
      <div
        className="w-full"
        style={{
          padding: `0 ${PAGE_PADDING_H}`,
          marginBottom: "var(--spacing-lg)",
        }}
      >
        {/* 进度轨道 — 可点击跳转 */}
        <div
          ref={progressRef}
          className="relative w-full cursor-pointer"
          style={{
            height: "calc(var(--rpx) * 36)",
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleProgressClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 轨道背景 */}
          <div
            className="absolute w-full rounded-full"
            style={{
              height: "calc(var(--rpx) * 4)",
              background: "rgba(255,255,255,0.15)",
            }}
          />
          {/* 已播进度 */}
          <div
            className="absolute rounded-full"
            style={{
              height: "calc(var(--rpx) * 4)",
              width: `${progress}%`,
              background:
                "linear-gradient(to right, rgba(196,154,108,0.6), rgba(196,154,108,0.9))",
              transition: isDragging ? "none" : "width 0.25s linear",
            }}
          />
          {/* 拖拽圆点 */}
          <div
            className="absolute rounded-full"
            style={{
              width: "calc(var(--rpx) * 16)",
              height: "calc(var(--rpx) * 16)",
              background: "rgba(255,248,235,0.9)",
              boxShadow: "0 0 12px rgba(196,154,108,0.4)",
              left: `${progress}%`,
              transform: "translateX(-50%)",
              transition: isDragging ? "none" : "left 0.25s linear",
            }}
          />
        </div>

        {/* 时间显示 */}
        <div
          className="flex justify-between"
          style={{ marginTop: "calc(var(--rpx) * 8)" }}
        >
          <span
            className="text-white/50"
            style={{ fontSize: "var(--font-size-xs)" }}
          >
            {formatTime(currentTime)}
          </span>
          <span
            className="text-white/50"
            style={{ fontSize: "var(--font-size-xs)" }}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 播放/暂停按钮 — 大圆形毛玻璃 */}
      <div
        className="rounded-full backdrop-blur-2xl flex items-center justify-center cursor-pointer hover:scale-[1.04] transition-transform duration-300"
        style={{
          width: "calc(var(--rpx) * 120)",
          height: "calc(var(--rpx) * 120)",
          background: "rgba(255, 248, 235, 0.12)",
          boxShadow:
            "0 0 40px rgba(196,154,108,0.12), inset 0 0 20px rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.15)",
          WebkitBackdropFilter: "blur(40px)",
          WebkitBackfaceVisibility: "hidden",
        }}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause
            className="text-white/90"
            style={{
              width: "calc(var(--rpx) * 40)",
              height: "calc(var(--rpx) * 40)",
              filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.3))",
            }}
            strokeWidth={1.8}
          />
        ) : (
          <Play
            className="text-white/90"
            style={{
              width: "calc(var(--rpx) * 40)",
              height: "calc(var(--rpx) * 40)",
              marginLeft: "calc(var(--rpx) * 4)",
              filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.3))",
            }}
            strokeWidth={1.8}
          />
        )}
      </div>
    </div>
  );
}
