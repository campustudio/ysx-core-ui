/**
 * 首页内容数据配置
 *
 * 所有首页卡片的文案、图片、配置项集中管理
 * 正式上线后可替换为 API 接口返回数据
 *
 * 数据规范：
 * - 标题不要硬编码省略号（"..."），截断由 CSS line-clamp 自动处理
 * - 副标题分隔符用中圆点（·）而非全角方括号（【】），
 *   避免 CJK 标点自带空白导致左对齐视觉偏移
 */

import { FEATURED_IMG, PLACEHOLDER_IMAGES } from "./images";

// ─── 类型定义 ─────────────────────────────────────────

export interface CardItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

export interface SectionData {
  id: string;
  title: string;
  subtitle: string;
  columns: 2 | 3;
  aspectRatio?: "square" | "wide";
  cards: CardItem[];
}

// ─── 每日智慧语录 ────────────────────────────────────

export const DAILY_WISDOM = {
  tag: "今日之光",
  text: "当你回到自己，世界便回到了它本来的样子",
  source: "元思想 · 成长笔记",
} as const;

// ─── 精选推荐 ────────────────────────────────────────

export const FEATURED = {
  image: FEATURED_IMG,
  title: "回到此刻，放松呼吸",
  subtitle: "5分钟 · 放松引导",
} as const;

// ─── 内容区块列表 ────────────────────────────────────

export const HOME_SECTIONS: SectionData[] = [
  {
    id: "daily-guide",
    title: "今日频率指南",
    subtitle: "给自己一段安静的时间",
    columns: 2,
    aspectRatio: "wide",
    cards: [
      {
        id: "dg-1",
        image: PLACEHOLDER_IMAGES.a,
        title: "为什么越努力，反而越空虚",
        subtitle: "人生十字·周末生活的情感",
      },
      {
        id: "dg-2",
        image: PLACEHOLDER_IMAGES.b,
        title: "为什么你总感觉清楚却做不到",
        subtitle: "假嗜空间·把明理想追求",
      },
    ],
  },
  {
    id: "perception",
    title: "感知入门",
    subtitle: "从今天开始，给自己一点时间",
    columns: 3,
    cards: [
      {
        id: "pc-1",
        image: PLACEHOLDER_IMAGES.c,
        title: "感知此刻",
        subtitle: "5分钟·呼吸引导",
      },
      {
        id: "pc-2",
        image: PLACEHOLDER_IMAGES.d,
        title: "静享此刻",
        subtitle: "5-10分钟·专注练习",
      },
    ],
  },
  {
    id: "mirror",
    title: "明镜之声",
    subtitle: "一个源频信息展开AI的照见",
    columns: 2,
    aspectRatio: "wide",
    cards: [
      {
        id: "mr-1",
        image: PLACEHOLDER_IMAGES.b,
        title: "每个人会面临的日常困惑",
      },
      {
        id: "mr-2",
        image: PLACEHOLDER_IMAGES.c,
        title: "想了解内心的问题",
      },
    ],
  },
  {
    id: "voices",
    title: "感知者的声音",
    subtitle: "感知践行者的共振瞬间",
    columns: 3,
    cards: [
      {
        id: "vc-1",
        image: PLACEHOLDER_IMAGES.d,
        title: "新人生之路圈子分享",
      },
      {
        id: "vc-2",
        image: PLACEHOLDER_IMAGES.a,
        title: "社群分享",
      },
      {
        id: "vc-3",
        image: PLACEHOLDER_IMAGES.b,
        title: "个人分享",
      },
    ],
  },
  {
    id: "happenings",
    title: "正在发生的光点",
    subtitle: "一些正在发生的活动与空间",
    columns: 3,
    cards: [
      {
        id: "hp-1",
        image: PLACEHOLDER_IMAGES.c,
        title: "感知训练营",
      },
      {
        id: "hp-2",
        image: PLACEHOLDER_IMAGES.d,
        title: "元境中心",
      },
      {
        id: "hp-3",
        image: PLACEHOLDER_IMAGES.a,
        title: "感知者星图",
      },
    ],
  },
];

// ─── 官方公告 ────────────────────────────────────────

export const ANNOUNCEMENT = {
  sectionTitle: "官方公告",
  title: "元思想内测进行中",
  description: "在忙碌中找回自己的节奏",
} as const;
