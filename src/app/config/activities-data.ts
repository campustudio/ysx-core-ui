/**
 * 活动数据源 - 元思想
 *
 * 承接首页「正在发生的光点」卡片的点击跳转
 * 线上线下活动、工作坊、训练营等
 *
 * 数据规范：
 *   - 标题不硬编码省略号，截断由 CSS line-clamp 处理
 *   - 副标题分隔符用中圆点（·）
 *   - 中文引号统一用角引号「」
 */

// ─── 类型定义 ─────────────────────────────────────────

export interface ActivityScheduleItem {
  /** 时间 */
  time: string;
  /** 内容 */
  content: string;
}

export interface Activity {
  /** 唯一标识，对应 home-data 中的 card id */
  id: string;
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle: string;
  /** 活动状态 */
  status: "ongoing" | "upcoming" | "ended";
  /** 状态文字 */
  statusLabel: string;
  /** 封面图 */
  coverImage: string;
  /** 活动类型 */
  type: string;
  /** 地点 */
  location: string;
  /** 日期 */
  date: string;
  /** 费用 */
  price: string;
  /** 参与人数 */
  participants: string;
  /** 简介 */
  description: string;
  /** 活动亮点 */
  highlights: string[];
  /** 日程安排 */
  schedule: ActivityScheduleItem[];
  /** 报名按钮文案 */
  ctaText: string;
}

// ─── 活动数据 ─────────────────────────────────────────

export const ACTIVITIES: Record<string, Activity> = {
  "hp-1": {
    id: "hp-1",
    title: "成长训练营",
    subtitle: "正在发生的光点 · 训练营",
    status: "ongoing",
    statusLabel: "报名中",
    type: "线上训练营",
    location: "线上 · 微信群 + 直播",
    date: "2026年3月1日 - 3月21日",
    price: "免费（内测期）",
    participants: "已报名 42 人",
    coverImage:
      "/images/img-157079965008.jpg",
    description:
      "21天的陪伴式放松练习，每天一个小练习，每周一次直播引导。不需要基础，不需要准备，只需要你愿意花每天5分钟，回到自己。",
    highlights: [
      "每日一练：5分钟放松练习，配文字引导",
      "每周直播：资深引导师在线带练 + 答疑",
      "社群陪伴：和志同道合的伙伴一起走过21天",
      "结营礼物：专属成长笔记 + 个人成长报告",
    ],
    schedule: [
      { time: "第1-7天", content: "认识自我 · 建立与身体的连接" },
      { time: "第8-14天", content: "沉稳之境 · 学会在不适中安定" },
      { time: "第15-21天", content: "回归之路 · 将练习融入日常" },
    ],
    ctaText: "立即报名",
  },

  "hp-2": {
    id: "hp-2",
    title: "元境中心",
    subtitle: "正在发生的光点 · 空间",
    status: "ongoing",
    statusLabel: "开放中",
    type: "线下体验空间",
    location: "杭州市西湖区 · 西溪湿地旁",
    date: "长期开放",
    price: "体验课 ¥0 · 会员制",
    participants: "本周可预约",
    coverImage:
      "/images/img-176389096539.jpg",
    description:
      "元境中心是元思想的线下体验空间，坐落在西溪湿地旁的安静角落。这里没有课表的压力，没有社交的焦虑，只有一个可以安静待着的地方。你可以来这里做一次呼吸引导，也可以只是坐着发呆。",
    highlights: [
      "自然环境：紧邻西溪湿地，四季变换可感",
      "自由空间：无课表压力，来去自如",
      "引导服务：资深引导师在场，需要时可预约",
      "茶室共享：慢下来喝一杯茶的地方",
    ],
    schedule: [
      { time: "周二至周五", content: "10:00 - 18:00 自由开放" },
      { time: "周六", content: "10:00 - 20:00 含晚间放松" },
      { time: "周日", content: "10:00 - 16:00 安静日" },
    ],
    ctaText: "预约体验",
  },

  "hp-3": {
    id: "hp-3",
    title: "成长工作坊",
    subtitle: "正在发生的光点 · 工作坊",
    status: "upcoming",
    statusLabel: "即将开始",
    type: "主题工作坊",
    location: "线上 · 腾讯会议",
    date: "2026年3月15日 14:00-16:30",
    price: "¥99（早鸟价 ¥69）",
    participants: "限30人",
    coverImage:
      "/images/img-175855522590.jpg",
    description:
      "成长工作坊是元思想的主题工作坊系列。本期主题：「身体的记忆」——探索情绪如何存储在身体中，以及如何通过身体练习来释放积压的情绪。适合对自我成长感兴趣的朋友。",
    highlights: [
      "理论 + 体验：不只是听，更是亲身感受",
      "小班制：最多30人，确保每位参与者被看见",
      "课后支持：附赠7天练习指南 + 社群答疑",
      "适合人群：对自我探索感兴趣的初学者和进阶者",
    ],
    schedule: [
      { time: "14:00 - 14:30", content: "开场引导 · 身体扫描热身" },
      { time: "14:30 - 15:15", content: "主题分享 · 身体如何记住情绪" },
      { time: "15:15 - 15:30", content: "休息 · 自由交流" },
      { time: "15:30 - 16:15", content: "体验练习 · 情绪释放引导" },
      { time: "16:15 - 16:30", content: "闭环分享 · 回到日常" },
    ],
    ctaText: "立即报名",
  },
};

/**
 * 根据 card id 获取活动
 */
export function getActivityById(cardId: string): Activity | undefined {
  return ACTIVITIES[cardId];
}

/**
 * 判断某个 card id 是否有对应活动
 */
export function hasActivity(cardId: string): boolean {
  return cardId in ACTIVITIES;
}