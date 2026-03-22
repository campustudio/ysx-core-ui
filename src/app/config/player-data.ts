/**
 * 音频播放页 - 曲目数据配置
 *
 * 对应首页三个入口卡片：徐 → 止 → 定
 * 每个曲目包含封面、标题、音频地址等信息
 *
 * 音频来源：
 *   当前使用 Web Audio API 合成的沉浸放松音频（零外部依赖）：
 *   - 徐：174 Hz 放松基频 + 泛音 + 呼吸节奏起伏
 *   - 止：136.1 Hz 放松基频 + 温暖和弦泛音
 *   - 定：111 Hz 深度放松共振 + 双耳节拍（左右声道微差 1Hz → Alpha 波）
 *   合成逻辑见 /src/app/utils/audio-generator.ts
 *
 *   未来可替换为真实录制的引导音频：
 *   - 将 audioSrc 改为 CDN URL 即可，合成器自动跳过非占位路径
 *   - 推荐免费商用音频来源及搜索词详见 /src/app/config/audio-sources.ts
 *
 * 数据规范：
 *   - 标题不硬编码省略号，由 CSS line-clamp 处理
 *   - 副标题分隔符用中圆点（·）
 *
 * 图片来源：Unsplash（Unsplash License，允许商用）
 */

import type { AudioType } from "../utils/audio-generator";

// ─── 类型定义 ─────────────────────────────────────────

export interface TrackData {
  /** 唯一标识，与首页卡片 label 对应 */
  id: string;
  /** 卡片标签（单字） */
  label: string;
  /** 曲目标题 */
  title: string;
  /** 曲目副标题 */
  subtitle: string;
  /** 曲目简介（一句话描述） */
  description: string;
  /**
   * 音频文件地址
   * 支持两种模式：
   *   - 占位路径（/assets/...） → 运行时由 audio-generator 合成替换
   *   - 真实 CDN URL（https://...） → 直接播放
   */
  audioSrc: string;
  /** 合成音频类型标识（用于 audio-generator 合成） */
  synthType: AudioType;
  /** 圆形封面图 URL */
  coverImage: string;
  /** 背景图 URL（全屏沉浸背景） */
  backgroundImage: string;
  /** 时长标注（展示用） */
  durationLabel: string;
}

// ─── 封面图 ──────────────────────────────────────────

const COVER_IMAGES = {
  /** 徐 — 金色暮云，柔和天空 */
  xu: "/images/img-177016382140.jpg",
  /** 止 — 晨光草地，温柔绿意 */
  zhi: "/images/img-171852320238.jpg",
  /** 定 — 柔光花田，梦幻浅色调 */
  ding: "/images/img-175157653073.jpg",
} as const;

/**
 * 播放页全屏背景图（与封面图分离，视觉差异化）
 * 封面图用于圆形小图，背景图用于全屏沉浸背景
 */
const BG_IMAGES = {
  /** 徐 — 金色暮光天空，温暖包裹 */
  xu: "/images/img-177016382140.jpg",
  /** 止 — 晨光草地，温柔绿意 */
  zhi: "/images/img-171852320238.jpg",
  /** 定 — 梦幻花田暮色 */
  ding: "/images/img-175157653073.jpg",
} as const;

// ─── 曲目数据 ────────────────────────────────────────

export const TRACKS: Record<string, TrackData> = {
  徐: {
    id: "xu",
    label: "徐",
    title: "慢下来",
    subtitle: "徐 · 放松引导",
    description: "放慢脚步，聆听自己的节奏",
    audioSrc: "./assets/audios/do_what_you_want-relax-278945.mp3",
    synthType: "xu",
    coverImage: COVER_IMAGES.xu,
    backgroundImage: BG_IMAGES.xu,
    durationLabel: "5分钟",
  },
  止: {
    id: "zhi",
    label: "止",
    title: "停下来",
    subtitle: "止 · 放松引导",
    description: "暂停奔忙，让自己归于平静",
    audioSrc: "./assets/audios/do_what_you_want-relax-278945.mp3",
    synthType: "zhi",
    coverImage: COVER_IMAGES.zhi,
    backgroundImage: BG_IMAGES.zhi,
    durationLabel: "8分钟",
  },
  定: {
    id: "ding",
    label: "定",
    title: "静下来",
    subtitle: "定 · 放松引导",
    description: "安静下来，找到自己的节奏",
    audioSrc: "./assets/audios/do_what_you_want-relax-278945.mp3",
    synthType: "ding",
    coverImage: COVER_IMAGES.ding,
    backgroundImage: BG_IMAGES.ding,
    durationLabel: "10分钟",
  },
} as const;

/** 默认曲目（找不到匹配时使用） */
export const DEFAULT_TRACK = TRACKS["徐"];
