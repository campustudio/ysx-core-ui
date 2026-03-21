/**
 * 沉浸呼吸页 - 配置数据
 *
 * 时长选项、呼吸节奏参数、环境音效、完成语等
 * 呼吸周期：4秒吸气 + 4秒呼气 = 8秒一个周期（与首页圆环一致）
 *
 * 环境音效：
 *   当前使用 Web Audio API 在浏览器中实时合成（零外部依赖）：
 *   - 细雨：高频过滤噪音 + 随机振幅调制（雨丝沙沙）
 *   - 海浪：低频噪音 + 缓慢正弦调制（10秒一个浪）
 *   - 山林：柔和粉噪 + 高频鸟鸣脉冲（安静森林）
 *   - 清风：低频带通噪音 + 极慢调制（微风拂耳）
 *   合成逻辑见 /src/app/utils/audio-generator.ts
 *
 *   src 字段保持占位路径，运行时由 resolveAudioUrl() 自动替换为合成 Blob URL。
 *   未来可替换为真实录音：将 src 改为 CDN URL 即可，resolveAudioUrl() 会原样透传。
 *
 * 音频资源替换指南：
 *   当前 4 种环境音效由 Web Audio API 实时合成。
 *   如需替换为真实录制的高品质音效，推荐以下免费商用来源：
 *   - Pixabay Music (pixabay.com/sound-effects/) — CC0 协议，无需署名
 *   - Freesound.org — 部分 CC0/CC-BY，注意筛选许可证
 *   - Mixkit (mixkit.co/free-sound-effects/) — 免费商用
 *   替换方式：将 src 改为 CDN URL（https://...），resolveAudioUrl() 会原样透传。
 *   详见 /src/app/config/audio-sources.ts 中的完整资源清单。
 */

// ─── 类型定义 ─────────────────────────────────────────

export interface AmbientSound {
  /** 唯一标识 */
  id: string;
  /** 显示标签 */
  label: string;
  /** lucide-react 图标标识 */
  icon: "volume-x" | "cloud-rain" | "waves" | "trees" | "wind";
  /**
   * 音频路径
   * - 占位路径（/audio/...） → 运行时由 resolveAudioUrl() 合成替换
   * - 真实 CDN URL（https://...） → 直接播放
   * - 空字符串 → 静默模式
   */
  src: string;
}

export interface DurationOption {
  /** 唯一标识 */
  id: string;
  /** 显示标签（如 "3分钟"） */
  label: string;
  /** 对应秒数 */
  seconds: number;
}

export interface CompletionMessage {
  /** 完成大标题 */
  headline: string;
  /** 副标题 */
  subline: string;
  /** 按钮文案 */
  cta: string;
}

// ─── 呼吸节奏参数 ─────────────────────────────────────

/** 单个呼吸周期（与首页圆环动画保持一致） */
export const BREATH_CYCLE = {
  /** 吸气时长（秒） */
  inhale: 4,
  /** 呼气时长（秒） */
  exhale: 4,
} as const;

// ─── 时长选项 ─────────────────────────────────────────

export const DURATION_OPTIONS: DurationOption[] = [
  { id: "3min", label: "3分钟", seconds: 180 },
  { id: "5min", label: "5分钟", seconds: 300 },
  { id: "10min", label: "10分钟", seconds: 600 },
];

/** 默认选中的时长 */
export const DEFAULT_DURATION_ID = "3min";

// ─── 环境音效 ─────────────────────────────────────────

/**
 * 环境音效列表
 *
 * 音效来源（当前状态）：
 *   全部使用 Web Audio API 在浏览器中实时合成。
 *   占位路径由 audio-generator.ts 的 resolveAudioUrl() 自动映射为合成音频。
 *
 * 未来替换为真实录音时，只需将 src 改为 CDN URL 即可：
 *   示例：src: "https://cdn.pixabay.com/audio/2024/xx/rain-ambient.mp3"
 */
export const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: "silent",
    label: "静默",
    icon: "volume-x",
    src: "",
  },
  {
    id: "rain",
    label: "细雨",
    icon: "cloud-rain",
    src: "/audio/ambient-rain.mp3",
  },
  {
    id: "ocean",
    label: "海浪",
    icon: "waves",
    src: "/audio/ambient-ocean.mp3",
  },
  {
    id: "forest",
    label: "山林",
    icon: "trees",
    src: "/audio/ambient-forest.mp3",
  },
  {
    id: "wind",
    label: "清风",
    icon: "wind",
    src: "/audio/ambient-wind.mp3",
  },
];

/** 默认选中的环境音效 */
export const DEFAULT_AMBIENT_ID = "silent";

/** 环境音效播放音量（0-1） */
export const AMBIENT_VOLUME = 0.35;

/** 环境音效淡出时长（毫秒） */
export const AMBIENT_FADE_OUT_MS = 2000;

// ─── 完成语 ─────────────────────────────────────────

/**
 * 各时长对应的完成语
 * key 与 DurationOption.id 对应
 */
export const COMPLETION_MESSAGES: Record<string, CompletionMessage> = {
  "3min": {
    headline: "片刻安宁，已是收获",
    subline: "三分钟的停留，是给自己最温柔的礼物",
    cta: "回到当下",
  },
  "5min": {
    headline: "你已回到此刻",
    subline: "五分钟的呼吸，让世界安静了一会儿",
    cta: "回到当下",
  },
  "10min": {
    headline: "深深地，回来了",
    subline: "十分钟的旅程，内心比来时更开阔",
    cta: "回到当下",
  },
};

/** 找不到对应完成语时的默认值 */
export const DEFAULT_COMPLETION: CompletionMessage = {
  headline: "呼吸完成",
  subline: "愿这份安宁伴随你的一天",
  cta: "回到当下",
};
