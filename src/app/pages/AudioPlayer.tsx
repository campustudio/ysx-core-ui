/**
 * 音频播放页 - 元感知
 *
 * 沉浸式全屏音频播放体验
 * 从首页「徐/止/定」卡片进入
 *
 * 布局对齐策略：
 *   所有元素共享同一水平 padding（PAGE_PADDING_H）
 *   返回箭头视觉左边缘 = 曲目标题左边缘 = 进度条左边缘
 *   封面图居中（圆形元素视觉重心需要居中）
 *   播放按钮居中
 *
 * 页面仅负责组装组件 + 管理播放状态
 * 所有数据来自 config/player-data，所有 UI 来自组件层
 *
 * Props:
 * - trackLabel: 曲目标签（徐/止/定），用于查找曲目数据
 * - onBack: 返回首页回调
 */

import { useState } from "react";
import { TRACKS, DEFAULT_TRACK } from "../config/player-data";
import { FONT_SERIF, TEXT_SHADOW_HERO } from "../config/styles";
import { HeroBackground } from "../components/hero/HeroBackground";
import {
  PlayerHeader,
  PAGE_PADDING_H,
} from "../components/player/PlayerHeader";
import { TrackCover } from "../components/player/TrackCover";
import { AudioControl } from "../components/player/AudioControl";

interface AudioPlayerProps {
  /** 曲目标签（徐/止/定） */
  trackLabel: string;
  /** 返回首页回调 */
  onBack?: () => void;
}

export function AudioPlayer({ trackLabel, onBack }: AudioPlayerProps) {
  const track = TRACKS[trackLabel] || DEFAULT_TRACK;
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className="relative w-full"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ═══ 背景层 ═══ 复用 HeroBackground + 加深遮罩 */}
      <HeroBackground src={track.backgroundImage} alt={track.title} />

      {/* 播放页专属加深遮罩 — 让前景元素更清晰 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(30,20,10,0.5) 0%, 
            rgba(30,20,10,0.35) 30%, 
            rgba(30,20,10,0.3) 50%, 
            rgba(30,20,10,0.45) 80%, 
            rgba(30,20,10,0.6) 100%
          )`,
          zIndex: 1,
        }}
      />

      {/* ═══ 内容层 ═══ */}
      <div
        className="relative flex flex-col h-full app-container"
        style={{ zIndex: 2 }}
      >
        {/* 顶部栏 */}
        <PlayerHeader subtitle={track.subtitle} onBack={onBack} />

        {/* 主体内容区 — 垂直居中 */}
        <div
          className="flex-1 flex flex-col justify-center"
          style={{
            paddingTop: "max(calc(var(--rpx) * 24), env(safe-area-inset-top))",
            paddingBottom: "calc(var(--rpx) * 60)",
          }}
        >
          {/* 圆形封面 — 居中 */}
          <div
            className="flex justify-center"
            style={{ marginBottom: "var(--spacing-xl)" }}
          >
            <TrackCover src={track.coverImage} isPlaying={isPlaying} />
          </div>

          {/* 曲目信息 — 左对齐，与返回箭头/进度条对齐 */}
          <div
            className="flex flex-col"
            style={{
              padding: `0 ${PAGE_PADDING_H}`,
              marginBottom: "var(--spacing-2xl)",
              gap: "calc(var(--rpx) * 12)",
            }}
          >
            {/* 标题 — 宋体大字 */}
            <h1
              className="text-white"
              style={{
                fontSize: "var(--font-size-2xl)",
                fontFamily: FONT_SERIF,
                fontWeight: 400,
                textShadow: TEXT_SHADOW_HERO,
                letterSpacing: "calc(var(--rpx) * 6)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {track.title}
            </h1>

            {/* 描述 */}
            <p
              className="text-white/60"
              style={{
                fontSize: "var(--font-size-sm)",
                textShadow: "0 1px 6px rgba(0,0,0,0.3)",
                letterSpacing: "calc(var(--rpx) * 1)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {track.description}
            </p>

            {/* 时长标签 */}
            <span
              className="text-white/40"
              style={{
                fontSize: "var(--font-size-xs)",
                letterSpacing: "calc(var(--rpx) * 1)",
              }}
            >
              {track.durationLabel} · 放松引导
            </span>
          </div>

          {/* 播放控件（进度条 + 播放按钮） */}
          <AudioControl
            audioSrc={track.audioSrc}
            synthType={track.synthType}
            isPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
          />
        </div>
      </div>
    </div>
  );
}
