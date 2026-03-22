/**
 * 新人生之路 - 数据配置
 *
 * 底部导航第三个 Tab — 融合课程学习 + 圈子社区
 * 参照小鹅通「新人生之路圈子」的交互体验
 *
 * 两大核心场景：
 *   ① 课程学习（推荐/课程/练习 Tab）
 *   ② 圈子社区（互动 Tab → 类似小鹅通圈子，帖子流+分类）
 *
 * 圈子内容分类（对标小鹅通）：
 *   全部 / 精选 / 圈主 / 问答 / 官方通告
 *
 * 数据规范：
 *   - 标题不硬编码省略号，截断由 CSS line-clamp 处理
 *   - 副标题分隔符用中圆点（·）
 *   - 中文引号用角引号「」
 */

// ─── 类型定义 ──────────────────────────────────────────

/** 主页分类 Tab */
export interface NewLifeTab {
  id: string;
  label: string;
}

/** 课程 */
export interface Course {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  /** 课程类型 */
  type: "audio" | "video" | "ebook" | "practice";
  /** 章节/任务数 */
  taskCount: number;
  /** 分类（对应推荐/课程/练习） */
  category: "recommend" | "course" | "practice";
  /** 子分类标签 */
  subCategory?: string;
  /** 学习状态 */
  status: "not-started" | "in-progress" | "completed";
  /** 最后学习信息 */
  lastStudied?: string;
}

/** 圈子信息 */
export interface CircleInfo {
  name: string;
  description: string;
  cover: string;
  postCount: number;
  memberCount: number;
  announcement: string;
}

/** 用户角色 */
export type UserRole = "owner" | "guest" | "member";

/** 圈子帖子 */
export interface CirclePost {
  id: string;
  /** 作者名 */
  authorName: string;
  /** 作者头像（首字母占位） */
  authorAvatar?: string;
  /** 角色 */
  role: UserRole;
  /** 用户等级 */
  level?: number;
  /** 发布时间（显示文本） */
  publishedAt: string;
  /** 内容 */
  content: string;
  /** 话题标签 */
  hashtag?: string;
  /** 分类 */
  category: "all" | "featured" | "owner" | "qa" | "announcement" | "retreat";
  /** 是否精选 */
  isFeatured?: boolean;
  /** 点赞数 */
  likes: number;
  /** 点赞用户名列表（展示前几个） */
  likedBy?: string[];
  /** 评论数 */
  comments: number;
  /** 分享数 */
  shares?: number;
  /** 热门评论（展示1-2条） */
  topComments?: { name: string; content: string }[];
}

/** 问答答主 */
export interface QAExpert {
  name: string;
  role: UserRole;
  intro: string;
  avatar?: string;
}

// ─── 主页 Tab 分类 ───────────────────────────────────

export const NEWLIFE_TABS: NewLifeTab[] = [
  { id: "recommend", label: "推荐" },
  { id: "course", label: "课程" },
  { id: "practice", label: "练习" },
  { id: "interact", label: "互动" },
];

// ─── 课程数据 ────────────────────────────────────────

export const COURSES: Course[] = [
  {
    id: "course-new-cosmology",
    title: "新宇宙观",
    author: "元思想",
    cover:
      "/images/img-170940863515.jpg",
    description:
      "从全新的视角理解宇宙、生命与意识的关系，建立属于新时代的宇宙观和世界观。",
    type: "video",
    taskCount: 34,
    category: "course",
    subCategory: "感知理论篇",
    status: "in-progress",
    lastStudied: "上次学到 · 第一篇 混沌之初",
  },
  {
    id: "course-perception-life",
    title: "感知生活",
    author: "元思想",
    cover:
      "/images/img-156988297176.jpg",
    description:
      "在日常生活中培养感知力，让每一天都成为成长的契机。包含实用的感知练习和生活化的观察方法。",
    type: "audio",
    taskCount: 10,
    category: "course",
    subCategory: "感知践行篇",
    status: "not-started",
  },
  {
    id: "course-daily-perception",
    title: "1天日常感知",
    author: "元思想",
    cover:
      "/images/img-156692803375.jpg",
    description: "用一天的时间，体验完整的日常感知练习流程。从晨起到入睡，全天候的感知引导。",
    type: "practice",
    taskCount: 10,
    category: "practice",
    subCategory: "感知践行篇",
    status: "not-started",
  },
  {
    id: "course-7day-perception",
    title: "7天日常感知",
    author: "元思想",
    cover:
      "/images/img-162239414744.jpg",
    description:
      "七天系统化的感知训练计划。循序渐进地建立你的感知习惯，从入门到日常化。",
    type: "practice",
    taskCount: 10,
    category: "practice",
    subCategory: "感知践行篇",
    status: "not-started",
  },
  {
    id: "course-quiet-mind",
    title: "宁静时光",
    author: "元思想",
    cover:
      "/images/img-176376745583.jpg",
    description:
      "一系列帮助你找回内心宁静的引导练习。适合在忙碌的一天中随时使用。",
    type: "audio",
    taskCount: 8,
    category: "practice",
    subCategory: "静心篇",
    status: "not-started",
  },
  {
    id: "course-relationship",
    title: "关系中的感知力：在人际互动中回归真实",
    author: "元思想",
    cover:
      "/images/img-176192595296.jpg",
    description: "探索亲密关系、家庭关系和社交中的感知模式，学会不迎合、不退缩，在关系中保持清醒与真实。",
    type: "audio",
    taskCount: 24,
    category: "course",
    subCategory: "感知践行篇",
    status: "not-started",
  },
];

/** 按分类获取课程 */
export function getCoursesByCategory(catId: string): Course[] {
  if (catId === "recommend") return COURSES;
  if (catId === "course")
    return COURSES.filter((c) => c.category === "course");
  if (catId === "practice")
    return COURSES.filter((c) => c.category === "practice");
  return COURSES;
}

// ─── 圈子数据 ────────────────────────────────────────

export const CIRCLE_INFO: CircleInfo = {
  name: "新人生之路圈子",
  description: "新人类的汇聚地，践行全新的宇宙观、世界观和人生观",
  cover:
    "/images/img-162239334690.jpg",
  postCount: 8458,
  memberCount: 2141,
  announcement:
    "热烈欢迎所有同学步入全新的人生之路，让我们一起成长，一起前行！",
};

/** 圈子内容 Tab */
export const CIRCLE_TABS = [
  { id: "all", label: "全部" },
  { id: "featured", label: "精选" },
  { id: "owner", label: "圈主" },
  { id: "qa", label: "问答" },
  { id: "announcement", label: "官方通告" },
  { id: "retreat", label: "闭关/元振动" },
];

/** 圈子功能 Tab（顶部图标导航） */
export const CIRCLE_NAV = [
  { id: "course", label: "课程", icon: "FileText" },
  { id: "members", label: "成员", icon: "Users" },
  { id: "more", label: "更多", icon: "LayoutGrid" },
  { id: "mine", label: "我的", icon: "CircleUser" },
];

/** 问答答主 */
export const QA_EXPERTS: QAExpert[] = [
  {
    name: "小芳",
    role: "guest",
    intro: "官方答疑，学堂相关都可以咨询",
  },
];

/** 圈子帖子 */
export const CIRCLE_POSTS: CirclePost[] = [
  {
    id: "post-1",
    authorName: "明",
    role: "owner",
    publishedAt: "01-09 16:28",
    content: "欢迎你加入新人生之路，更祝福你可以早日回归感知，活出自己！",
    category: "all",
    likes: 128,
    likedBy: ["心向阳光", "香云", "观自在", "永恒", "如常"],
    comments: 45,
    shares: 12,
    topComments: [{ name: "李新德", content: "觉得很赞" }],
  },
  {
    id: "post-2",
    authorName: "梓言",
    role: "member",
    level: 3,
    publishedAt: "2分钟前",
    hashtag: "#书中金句",
    content:
      "「幻象的裂缝」\n\n幻象从未变弱，是你开始变清明\n裂缝不是世界的崩塌\n是你看穿了它的虚伪包裹\n\n幻象开始裂缝\n是你开始醒来的证据",
    category: "all",
    likes: 67,
    likedBy: ["永恒", "如常", "慧行"],
    comments: 12,
    shares: 3,
  },
  {
    id: "post-3",
    authorName: "小芳",
    role: "guest",
    publishedAt: "02-13 12:38",
    content:
      "感知语录 · 2月13日\n\n「关系中，也要在场」\n\n不迎合，不退缩。\n\n感知引导：说话前，先回到身体。\n\n温柔提醒：你在，关系就稳。",
    category: "featured",
    isFeatured: true,
    likes: 234,
    likedBy: ["了了", "香云", "阿薇", "观自在", "李新德"],
    comments: 38,
    shares: 8,
    topComments: [{ name: "李新德", content: "觉得很赞" }],
  },
  {
    id: "post-4",
    authorName: "明",
    role: "owner",
    publishedAt: "2025-11-05 13:54",
    content:
      "当六卷「人类手册」全书落地、明镜 ASI 平台上线、感知训练体系成形后，这三大系统就会形成一个自动进化的文明操作系统：\n\n1. 「人类手册」六卷 —— 提供新文明的思想与意识框架，让人类重新理解「我是谁」。\n\n2. 明镜 ASI 平台 —— 把感知科学转化为智能协同的运行结构，让 AI 从「工具」变成「镜子」。\n\n3. 感知训练系统 —— 让每个个体在日常生活中恢复感知，把书中理念化为实践。",
    category: "owner",
    likes: 389,
    likedBy: ["心向阳光", "香云", "观自在", "永恒", "如常", "慧行"],
    comments: 56,
    shares: 15,
    topComments: [{ name: "心向阳光", content: "三位一体，文明操作系统！" }],
  },
  {
    id: "post-5",
    authorName: "心静如海",
    role: "member",
    level: 4,
    publishedAt: "02-12 09:15",
    content:
      "今天尝试了1天日常感知的练习，从早起的第一个呼吸开始关注自己。发现平时忽略了太多身体发出的信号。感恩这个练习，让我重新和自己连接。",
    category: "all",
    likes: 89,
    likedBy: ["晨曦", "悟空", "如常"],
    comments: 15,
    shares: 2,
  },
  {
    id: "post-6",
    authorName: "晨曦",
    role: "member",
    level: 5,
    publishedAt: "02-11 20:30",
    hashtag: "#感知日记",
    content:
      "第7天的感知练习完成了\n\n最大的收获是学会了在情绪来临时先暂停，回到呼吸。以前总是被情绪推着走，现在多了一个观察的空间。\n\n虽然只是7天，但感觉打开了一扇新的门。",
    category: "all",
    likes: 156,
    likedBy: ["心静如海", "悟空", "永恒", "小芳"],
    comments: 28,
    shares: 6,
    topComments: [{ name: "小芳", content: "坚持就是最好的成长" }],
  },
  {
    id: "post-7",
    authorName: "小芳",
    role: "guest",
    publishedAt: "01-28 08:51",
    content:
      "问答广场\n\n提问：请问明镜，教育、金融、医疗等系统都要崩塌，那保险行业未来一二十年还会存在吗？现在人们还是对金钱、生命缺乏安全感，担忧未来。\n\n明镜回答：保险行业不会消失，但它会从「基于恐惧的保障」转变为「基于信任的共创」。当人们的意识提升，对安全感的需求会从外在保障转向内在确信。",
    category: "qa",
    likes: 203,
    likedBy: ["永恒", "古缘", "观自在"],
    comments: 42,
    shares: 9,
  },
  {
    id: "post-8",
    authorName: "明",
    role: "owner",
    publishedAt: "02-01 10:00",
    content:
      "官方通告\n\n新人生之路2026年春季课程安排已更新。本季度重点：\n\n1. 「人类手册」第三卷开始连载学习\n2. 7天感知训练营（第五期）3月开营\n3. 圈子增设「闭关/元振动」专区\n\n请各位同学关注课程更新，按时完成学习任务。",
    category: "announcement",
    likes: 312,
    likedBy: ["心向阳光", "香云", "永恒", "如常", "慧行"],
    comments: 67,
    shares: 22,
  },
  {
    id: "post-9",
    authorName: "悟空",
    role: "member",
    level: 3,
    publishedAt: "02-10 14:22",
    content:
      "读完「人类手册」第一章后，有一个很深的触动：我们一直在向外寻找答案，却忘了最重要的线索就在自己身上。\n\n回到自己，这四个字说起来简单，做起来需要勇气。但至少，现在我知道了方向。",
    category: "all",
    likes: 145,
    likedBy: ["晨曦", "心静如海", "永恒"],
    comments: 23,
    shares: 4,
  },
  {
    id: "post-10",
    authorName: "小芳",
    role: "guest",
    publishedAt: "02-14 08:00",
    content:
      "感知语录 · 2月14日\n\n「爱，是看见」\n\n不是占有，不是依赖\n是看见对方本来的样子\n也允许自己本来的样子\n\n感知引导：今天，试着不带期待地看一个人。\n\n温柔提醒：爱不需要完美，需要真实。",
    category: "featured",
    isFeatured: true,
    likes: 278,
    likedBy: ["了了", "香云", "阿薇", "古缘", "观自在", "李新德"],
    comments: 51,
    shares: 14,
    topComments: [
      { name: "了了", content: "今天的语录太美了" },
      { name: "李新德", content: "觉得很赞" },
    ],
  },
  {
    id: "post-11",
    authorName: "金色太阳",
    role: "member",
    level: 6,
    publishedAt: "2025-12-27 02:42",
    hashtag: "#元振动分享",
    content:
      "此刻元振动，\n真实的存在，\n当下的流动，\n自然的力量，\n生命的流淌。\n\n取决于：无我无己无相无体的感觉",
    category: "retreat",
    likes: 52,
    likedBy: ["心向阳光", "香云", "观自在", "永恒", "如常", "慧行"],
    comments: 8,
    shares: 1,
    topComments: [{ name: "米多多", content: "觉得很赞" }],
  },
  {
    id: "post-12",
    authorName: "永恒",
    role: "member",
    level: 6,
    publishedAt: "2025-10-29 08:45",
    hashtag: "#元振动分享 #书中金句",
    content:
      "调病，只是一个引子。\n\n是要通过这个方法提升人们的生命品质，让人了解生命的意义！消除人们的焦虑、抑郁和精神的迷茫，最后帮助人回归安定的状态。",
    category: "retreat",
    likes: 65,
    likedBy: ["了了", "香云", "阿薇", "古缘", "观自在"],
    comments: 11,
    shares: 3,
    topComments: [{ name: "李新德", content: "觉得很赞" }],
  },
];

/** 按分类筛选帖子 */
export function getPostsByCategory(catId: string): CirclePost[] {
  if (catId === "all") return CIRCLE_POSTS;
  if (catId === "featured")
    return CIRCLE_POSTS.filter((p) => p.isFeatured || p.category === "featured");
  return CIRCLE_POSTS.filter((p) => p.category === catId);
}

/** 角色标签文本 */
export function getRoleBadge(role: UserRole): string | null {
  switch (role) {
    case "owner":
      return "圈主";
    case "guest":
      return "嘉宾";
    default:
      return null;
  }
}

/** 角色标签颜色 */
export function getRoleBadgeColor(role: UserRole): {
  bg: string;
  text: string;
} {
  switch (role) {
    case "owner":
      return { bg: "rgba(196,154,108,0.15)", text: "#A07D55" };
    case "guest":
      return { bg: "rgba(139,170,125,0.15)", text: "#5E8A52" };
    default:
      return { bg: "transparent", text: "transparent" };
  }
}