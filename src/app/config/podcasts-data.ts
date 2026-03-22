/**
 * 播客/故事数据源 - 元思想
 *
 * 承接首页「同行者的声音」卡片的点击跳转
 * 用户的真实分享：音频故事、播客节目
 *
 * 数据规范：
 *   - 标题不硬编码省略号，截断由 CSS line-clamp 处理
 *   - 副标题分隔符用中圆点（·）
 *   - 中文引号统一用角引号「」
 *
 * 音频状态：
 *   当前 audioSrc 为空（预留字段）。
 *   播客为用户原创人声内容，无法用通用音乐库替代，需自行录制。
 *   替换方式：将 audioSrc 设为 CDN URL 即可启用播放功能。
 *   详见 /src/app/config/audio-sources.ts 中的完整资源指南。
 *
 * 播放背景图：
 *   各播客详情页的 coverImage 即用于播放时的视觉背景。
 *   图片来源：Unsplash（Unsplash License，允许商用）
 */

// ─── 类型定义 ─────────────────────────────────────────

export interface PodcastEpisode {
  /** 时间戳（如 "02:30"） */
  time: string;
  /** 章节标题 */
  title: string;
}

export interface Podcast {
  /** 唯一标识，对应 home-data 中的 card id */
  id: string;
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle: string;
  /** 所属栏目 */
  category: string;
  /** 封面图 */
  coverImage: string;
  /** 分享者 */
  author: {
    name: string;
    role: string;
  };
  /** 时长标签 */
  duration: string;
  /** 音频路径（预留） */
  audioSrc?: string;
  /** 简介 */
  description: string;
  /** 章节列表 */
  chapters: PodcastEpisode[];
  /** 文字摘录（金句） */
  highlights: string[];
}

// ─── 播客数据 ─────────────────────────────────────────

export const PODCASTS: Record<string, Podcast> = {
  "vc-1": {
    id: "vc-1",
    title: "新人生之路圈子分享",
    subtitle: "感知者的声音 · 播客",
    category: "感知者的声音",
    coverImage:
      "/images/img-169888429218.jpg",
    author: { name: "小林", role: "练习者 · 3个月" },
    duration: "12 分钟",
    description:
      "小林是一位互联网从业者，三个月前第一次接触放松练习。从最初的怀疑到后来在日常中发现细微的变化，她把这段旅程用声音记录下来，分享给每一个正在犹豫要不要开始的人。",
    chapters: [
      { time: "00:00", title: "为什么我决定尝试放松练习" },
      { time: "02:15", title: "第一周：什么都感觉不到的日子" },
      { time: "05:40", title: "转折点：公交车上的三分钟" },
      { time: "08:20", title: "现在的我，和以前有什么不同" },
      { time: "10:45", title: "给同样犹豫的你" },
    ],
    highlights: [
      "我以为放松练习是要让自己变得平静，后来发现，它只是让我看见真实的自己。",
      "改变不是某一天突然发生的，它藏在每一个你决定停下来的瞬间里。",
      "如果你也在犹豫要不要开始，我想说：不需要准备好，开始本身就是最好的准备。",
    ],
  },

  "vc-2": {
    id: "vc-2",
    title: "社群分享",
    subtitle: "感知者的声音 · 故事",
    category: "感知者的声音",
    coverImage:
      "/images/img-176537151433.jpg",
    author: { name: "让舒", role: "引导师 · 2年" },
    duration: "18 分钟",
    description:
      "让舒曾经是一位焦虑症患者，在经历了漫长的自我探索后，选择成为一名引导师。在这期分享中，她谈到了从「对抗自己」到「与自己和解」的转变，以及那些看似微小却真实改变了她生活的时刻。",
    chapters: [
      { time: "00:00", title: "曾经，我是一个停不下来的人" },
      { time: "03:30", title: "崩溃的那个下午" },
      { time: "07:15", title: "第一次真正地呼吸" },
      { time: "11:00", title: "从患者到引导师" },
      { time: "14:30", title: "我现在每天都在做的一件小事" },
    ],
    highlights: [
      "焦虑不是敌人，它是一封没拆开的信。",
      "我不是变得不焦虑了，而是学会了在焦虑中也能安定。",
      "每一个决定回到呼吸的瞬间，都是一次微小的勇敢。",
    ],
  },

  "vc-3": {
    id: "vc-3",
    title: "个人分享",
    subtitle: "感知者的声音 · 故事",
    category: "感知者的声音",
    coverImage:
      "/images/img-1555069855-e.jpg",
    author: { name: "老张", role: "企业管理者 · 1年" },
    duration: "15 分钟",
    description:
      "老张是一家公司的管理者，一年前在朋友推荐下开始放松练习。最初只是为了缓解压力，但渐渐发现这不仅改变了他与自己的关系，也改变了他与团队、与家人的相处方式。",
    chapters: [
      { time: "00:00", title: "一个管理者的困惑" },
      { time: "03:00", title: "朋友的一句话" },
      { time: "06:30", title: "从管理别人到管理自己" },
      { time: "09:45", title: "家庭关系的意外变化" },
      { time: "12:30", title: "写给每一个忙碌的人" },
    ],
    highlights: [
      "我以为我管理得很好，直到我发现自己连自己的情绪都管理不了。",
      "放松练习教会我最重要的事：在反应之前，留出一个呼吸的空间。",
      "当我不再试图控制一切的时候，一切反而开始变好了。",
    ],
  },
};

/**
 * 根据 card id 获取播客
 */
export function getPodcastById(cardId: string): Podcast | undefined {
  return PODCASTS[cardId];
}

/**
 * 判断某个 card id 是否有对应播客
 */
export function hasPodcast(cardId: string): boolean {
  return cardId in PODCASTS;
}
