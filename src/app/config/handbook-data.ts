/**
 * 人类手册 - 数据配置
 *
 * 「人类手册」模块核心数据，类似喜马拉雅听书平台：
 *   - 书籍/音频课程列表（按分类组织）
 *   - 每本书包含多章节
 *   - 每章节有音频 + 文字稿
 *   - 学习进度追踪（localStorage）
 *
 * 音频来源说明：
 *   当前 audioSrc 为占位路径，UI 阶段使用合成音频 demo
 *   正式上线时替换为 CDN URL（如阿里云 OSS / 腾讯云 COS）
 *
 * 数据规范：
 *   - 标题不硬编码省略号，截断由 CSS line-clamp 处理
 *   - 副标题分隔符用中圆点（·）
 */

// ─── 类型定义 ──────────────────────────────────────────

/** 章节 */
export interface Chapter {
  id: string;
  /** 章节序号（显示用） */
  index: number;
  /** 章节标题 */
  title: string;
  /** 章节副标题 / 简介 */
  subtitle?: string;
  /** 音频时长（秒） */
  duration: number;
  /** 音频资源路径（占位，后续替换为 CDN URL） */
  audioSrc: string;
  /** 文字稿（段落数组，用于文稿模式） */
  transcript: string[];
}

/** 书籍/课程 */
export interface Book {
  id: string;
  /** 书名 */
  title: string;
  /** 作者 */
  author: string;
  /** 封面图 */
  cover: string;
  /** 简介 */
  description: string;
  /** 分类标签 */
  category: string;
  /** 章节列表 */
  chapters: Chapter[];
  /** 总章节数 */
  totalChapters: number;
}

/** 分类 */
export interface HandbookCategory {
  id: string;
  label: string;
}

// ─── 分类列表 ──────────────────────────────────────────

export const HANDBOOK_CATEGORIES: HandbookCategory[] = [
  { id: "recommend", label: "推荐" },
  { id: "video", label: "视频" },
  { id: "audio", label: "音频" },
  { id: "ebook", label: "电子书" },
  { id: "graphic", label: "图文" },
];

// ─── 书籍数据 ──────────────────────────────────────────

export const BOOKS: Book[] = [
  {
    id: "book-human-handbook",
    title: "人类手册",
    author: "元感知",
    cover: "/images/img-163691431565.jpg",
    description:
      "探索人类存在的本质，从身体、情绪、思维到意识，系统性地认识自己。每一章都是一把钥匙，帮助你打开自我认知的大门。",
    category: "audio",
    totalChapters: 8,
    chapters: [
      {
        id: "hh-ch1",
        index: 1,
        title: "人是误会，还是奇迹",
        subtitle: "重新认识人类存在的意义",
        duration: 303,
        audioSrc: "placeholder://handbook/ch1.mp3",
        transcript: [
          "我是谁？为何而活，又将走向哪里？",
          "这些问题看似宏大，实则与每个人的日常息息相关。当我们停下脚步，认真审视自己的生活，会发现许多我们习以为常的事情，其实都值得重新思考。",
          "人类的存在本身就是一个奇迹。从宇宙大爆炸到生命的诞生，从单细胞生物到拥有复杂意识的人类，每一步都是不可思议的飞跃。",
          "然而在日常生活中，我们往往忘记了这一点。我们被工作、社交、消费等各种事务填满，很少有时间停下来感受生命本身的神奇。",
          "这本手册的目的，不是给你一个标准答案，而是陪你一起探索。在探索的过程中，你可能会发现，那些看似复杂的问题，其实都有一个简单的起点——回到自己。",
          "让我们从这里开始，一起踏上认识自己的旅程。",
        ],
      },
      {
        id: "hh-ch2",
        index: 2,
        title: "身体的智慧",
        subtitle: "倾听身体发出的信号",
        duration: 285,
        audioSrc: "placeholder://handbook/ch2.mp3",
        transcript: [
          "我们的身体远比我们想象的更加智慧。它每时每刻都在向我们发送信号，只是我们常常忽略了这些信号。",
          "当你感到疲倦时，身体在告诉你需要休息。当你感到紧张时，身体在提醒你需要放松。这些看似简单的信号，其实承载着深刻的生命智慧。",
          "学会倾听身体，是认识自己的第一步。试着在忙碌的一天中，找几分钟时间，闭上眼睛，感受自己的呼吸、心跳、肌肉的紧张与放松。",
          "你会发现，身体一直在默默地照顾着你，而你需要做的，只是给它一点关注和感谢。",
        ],
      },
      {
        id: "hh-ch3",
        index: 3,
        title: "情绪的本质",
        subtitle: "理解情绪背后的信息",
        duration: 320,
        audioSrc: "placeholder://handbook/ch3.mp3",
        transcript: [
          "情绪不是我们的敌人，它是我们内在的信使。每一种情绪的出现，都在传递着某种重要的信息。",
          "愤怒告诉我们边界被侵犯了，悲伤告诉我们失去了重要的东西，恐惧告诉我们面临未知的挑战，喜悦告诉我们正在做对的事情。",
          "问题不在于情绪本身，而在于我们如何与情绪相处。当我们学会不评判、不压抑、也不被情绪牵着走，我们就找到了一种更健康的方式来面对生活中的各种挑战。",
          "下一次当你感受到强烈的情绪时，试着停下来，问问自己：这个情绪在告诉我什么？",
        ],
      },
      {
        id: "hh-ch4",
        index: 4,
        title: "思维的陷阱",
        subtitle: "识别自动化思维模式",
        duration: 290,
        audioSrc: "placeholder://handbook/ch4.mp3",
        transcript: [
          "我们每天都在想大量的事情，但很少有人意识到，绝大多数的想法都是自动产生的，而且常常是重复的。",
          "这些自动化的思维模式，有些是有益的，比如过马路前会自动看看两边；但有些则是有害的，比如总是想着最坏的结果，或者不断地自我批评。",
          "认识到这一点非常重要：你不等于你的想法。想法只是想法，它们来了又去，就像天空中的云朵一样。",
          "学会观察自己的想法，而不是被想法带走，这是一种可以练习的能力。当你开始练习，你会发现自己获得了一种前所未有的内在自由。",
        ],
      },
      {
        id: "hh-ch5",
        index: 5,
        title: "关系的镜子",
        subtitle: "从关系中认识自己",
        duration: 310,
        audioSrc: "placeholder://handbook/ch5.mp3",
        transcript: [
          "我们的每一段关系，都是认识自己的一面镜子。在与他人的互动中，我们的模式、信念和未完成的课题都会浮现出来。",
          "为什么某些人总是让我们感到不舒服？为什么我们在某些关系中总是重复同样的模式？这些问题的答案，往往不在对方身上，而在我们自己内心。",
          "当我们开始在关系中观察自己，而不是一味地要求对方改变，我们就踏上了真正的成长之路。",
          "好的关系不是没有冲突的关系，而是两个人都愿意通过关系来成长的关系。",
        ],
      },
      {
        id: "hh-ch6",
        index: 6,
        title: "时间的意义",
        subtitle: "重新理解时间与生命的关系",
        duration: 275,
        audioSrc: "placeholder://handbook/ch6.mp3",
        transcript: [
          "我们总觉得时间不够用，但真的是这样吗？也许问题不在于时间的多少，而在于我们如何感受和使用时间。",
          "当我们全然投入当下的体验时，时间似乎变慢了；当我们焦虑地想着未来或懊悔着过去时，时间却飞速流逝。",
          "活在当下不是一个空洞的口号，而是一种具体的生活方式。它意味着把注意力放在此时此刻正在发生的事情上，而不是被思绪带到过去或未来。",
          "试试在日常生活中创造一些「时间停顿」——喝茶时认真感受茶的味道，走路时留意脚步的节奏，吃饭时细细品味食物的口感。这些小小的练习，会让你的生活质量发生质的改变。",
        ],
      },
      {
        id: "hh-ch7",
        index: 7,
        title: "接纳与放下",
        subtitle: "与生活和解的艺术",
        duration: 330,
        audioSrc: "placeholder://handbook/ch7.mp3",
        transcript: [
          "接纳不是认输，放下不是遗忘。接纳是承认现实的样子，放下是不再用力对抗。",
          "我们的很多痛苦，来自于对现实的不接受。我们希望事情按照我们的期望发展，当现实与期望不符时，我们就会感到挫败和痛苦。",
          "学会接纳，意味着我们不再与现实对抗，而是在现实的基础上寻找可能的改变。这不是消极，恰恰是一种更智慧的积极。",
          "放下并不意味着不在乎，而是意味着我们不再被过去束缚，可以更轻松地走向未来。",
        ],
      },
      {
        id: "hh-ch8",
        index: 8,
        title: "回到自己",
        subtitle: "一切探索的终点，也是起点",
        duration: 300,
        audioSrc: "placeholder://handbook/ch8.mp3",
        transcript: [
          "经过前面的探索，你可能已经发现了一个重要的事实：所有的答案都在你自己身上。",
          "外在的学习、阅读、交流当然重要，但最终，你需要把这些知识转化为自己的体验和理解。没有人能代替你走这条路。",
          "「回到自己」不是一个终点，而是一种持续的状态。在每一天的生活中，在每一个选择面前，你都可以问自己：这是我真正想要的吗？这样做是否让我更接近真实的自己？",
          "你不需要成为别人眼中的完美，你只需要成为真实的自己。这条路可能不总是容易的，但一定是值得的。",
          "感谢你陪我们走完这段旅程。但请记住，这只是开始。真正的旅程，在你合上这本书的那一刻，才刚刚开始。",
        ],
      },
    ],
  },
  {
    id: "book-inner-peace",
    title: "当下的力量",
    author: "元感知",
    cover: "/images/img-175934937543.jpg",
    description:
      "学会在忙碌的生活中找到内心的宁静。这不是逃避现实，而是一种更深层次的面对生活的方式。",
    category: "audio",
    totalChapters: 6,
    chapters: [
      {
        id: "ip-ch1",
        index: 1,
        title: "什么是当下",
        subtitle: "重新定义此时此刻",
        duration: 280,
        audioSrc: "placeholder://inner-peace/ch1.mp3",
        transcript: [
          "当下是什么？它不是一个抽象的哲学概念，而是你正在经历的这一刻。",
          "当你读这段文字的时候，你的呼吸在继续，你的心脏在跳动，周围的声音在流动。这一切，都是当下。",
          "我们大多数时候并不在当下。我们的注意力要么在过去（回忆、懊悔），要么在未来（计划、担忧）。而当下，这个唯一真实存在的时刻，却被我们忽略了。",
          "回到当下，不需要做任何特别的事情。你只需要把注意力从思绪的洪流中抽回来，放到此刻正在发生的事情上。",
        ],
      },
      {
        id: "ip-ch2",
        index: 2,
        title: "呼吸的锚点",
        subtitle: "用呼吸连接当下",
        duration: 260,
        audioSrc: "placeholder://inner-peace/ch2.mp3",
        transcript: [
          "呼吸是我们与当下连接的最自然的桥梁。它一直在那里，从不停歇，却很少被我们注意到。",
          "试试这个简单的练习：找一个舒适的姿势，闭上眼睛，把注意力放在呼吸上。不需要改变呼吸的节奏，只是观察它。",
          "吸气的时候，感受空气进入鼻腔、流经喉咙、充盈胸腔。呼气的时候，感受身体自然地放松和释放。",
          "你可能会发现，仅仅几次有意识的呼吸，就能让你的内心变得更加平静。这就是呼吸的力量。",
        ],
      },
      {
        id: "ip-ch3",
        index: 3,
        title: "日常中的练习",
        subtitle: "把平静带入每一天",
        duration: 295,
        audioSrc: "placeholder://inner-peace/ch3.mp3",
        transcript: [
          "练习不需要专门留出时间，日常生活本身就是最好的练习场。",
          "洗碗的时候，感受水流过手指的温度；走路的时候，感受脚底接触地面的感觉；等红灯的时候，做三次深呼吸。",
          "这些微小的练习看似不起眼，但它们会逐渐改变你与生活的关系。你会发现，当你更加投入当下的体验时，即使是最平常的事情也变得有趣起来。",
          "生活不在别处，就在此时此地。",
        ],
      },
      {
        id: "ip-ch4",
        index: 4,
        title: "与情绪共处",
        subtitle: "不逃避也不沉溺",
        duration: 315,
        audioSrc: "placeholder://inner-peace/ch4.mp3",
        transcript: [
          "面对负面情绪，我们通常有两种反应：逃避或沉溺。逃避是不愿面对，沉溺是陷入其中无法自拔。",
          "还有第三种方式：与情绪共处。这意味着你承认情绪的存在，感受它在身体中的位置和感觉，但不被它带走。",
          "就像看天上的云一样，你知道云在那里，你看着它们飘过，但你不需要抓住它们。",
          "当你学会用这种方式面对情绪，你会发现情绪来得快去得也快。真正让我们痛苦的，不是情绪本身，而是我们对情绪的抗拒。",
        ],
      },
      {
        id: "ip-ch5",
        index: 5,
        title: "放松的艺术",
        subtitle: "在紧张中找到松弛",
        duration: 270,
        audioSrc: "placeholder://inner-peace/ch5.mp3",
        transcript: [
          "真正的放松不是什么都不做，而是在做事的时候保持一种内在的松弛感。",
          "观察一个高水平的运动员，你会发现他们在激烈运动时身体是放松的。紧张反而会影响表现。生活也是如此。",
          "我们可以在忙碌中保持从容，在压力下保持清醒。这不是天生的能力，而是可以通过练习获得的。",
          "关键在于觉知——当你意识到自己紧张了，紧张就已经开始松动了。",
        ],
      },
      {
        id: "ip-ch6",
        index: 6,
        title: "日常即道场",
        subtitle: "生活就是最好的老师",
        duration: 300,
        audioSrc: "placeholder://inner-peace/ch6.mp3",
        transcript: [
          "不需要去远方寻找平静，你的日常生活就是最好的练习场。",
          "每一次与家人的对话，每一次工作中的挑战，一次独处的时光，都是成长的机会。",
          "当你开始用这样的眼光看待生活，你会发现每一天都变得更有意义。不是因为发生了什么特别的事情，而是因为你学会了用心去体验每一个平凡的瞬间。",
          "这就是当下的力量——它不需要任何外在条件，它就在这里，等待你去发现。",
        ],
      },
    ],
  },
  {
    id: "book-life-exploration",
    title: "生命的探索",
    author: "元感知",
    cover: "/images/img-170940863515.jpg",
    description:
      "从宇宙的视角重新审视人类的生命历程。每一个生命都是独一无二的旅程，这本书帮你找到属于自己的方向。",
    category: "audio",
    totalChapters: 5,
    chapters: [
      {
        id: "le-ch1",
        index: 1,
        title: "生命的起点",
        subtitle: "从好奇心开始的旅程",
        duration: 290,
        audioSrc: "placeholder://life-exploration/ch1.mp3",
        transcript: [
          "每一个孩子都是天生的探索者。他们对世界充满好奇，不断提问，不断尝试。",
          "遗憾的是，随着年龄的增长，我们中的很多人逐渐失去了这种好奇心。我们变得习以为常，不再对身边的世界感到惊奇。",
          "找回好奇心，是重新激活生命力的关键。当你开始用好奇的眼光看待生活中的一切，你会发现世界比你想象的要丰富得多。",
        ],
      },
      {
        id: "le-ch2",
        index: 2,
        title: "选择的勇气",
        subtitle: "在不确定中前行",
        duration: 305,
        audioSrc: "placeholder://life-exploration/ch2.mp3",
        transcript: [
          "生命中最重要的时刻，往往是那些需要我们做出选择的时刻。而真正的选择，总是伴随着不确定性。",
          "如果一切都确定了，那就不叫选择了。正是因为不知道结果会怎样，选择才有了重量和意义。",
          "勇气不是没有恐惧，而是在恐惧中依然行动。每一次你在不确定中迈出一步，你就变得更加强大。",
        ],
      },
      {
        id: "le-ch3",
        index: 3,
        title: "失败的礼物",
        subtitle: "从挫折中获取成长",
        duration: 280,
        audioSrc: "placeholder://life-exploration/ch3.mp3",
        transcript: [
          "没有人喜欢失败，但每一次失败都包含着珍贵的信息。关键在于你是否愿意去听。",
          "失败告诉我们哪条路走不通，它帮我们排除了错误的方向。从这个角度看，失败其实是在帮助我们接近正确的答案。",
          "真正的失败不是跌倒，而是跌倒后不愿再站起来。只要你还愿意尝试，一切就都还有可能。",
        ],
      },
      {
        id: "le-ch4",
        index: 4,
        title: "连接的力量",
        subtitle: "在关系中成长",
        duration: 295,
        audioSrc: "placeholder://life-exploration/ch4.mp3",
        transcript: [
          "人不是孤岛。我们在关系中出生，在关系中成长，在关系中找到归属感和意义。",
          "好的连接不是要求别人满足我们的需要，而是两个完整的人之间的真诚相遇。",
          "学会建立和维护有意义的连接，是生命中最值得投入的事情之一。因为在真正的连接中，我们不仅看到了别人，也看到了更真实的自己。",
        ],
      },
      {
        id: "le-ch5",
        index: 5,
        title: "创造的使命",
        subtitle: "找到属于你的表达",
        duration: 310,
        audioSrc: "placeholder://life-exploration/ch5.mp3",
        transcript: [
          "每个人都有创造的冲动。它可能表现为画一幅画、写一首诗、做一道菜、设计一个方案，或者仅仅是用自己的方式生活。",
          "创造不是少数人的特权，它是每一个人与生俱来的能力。区别只在于你是否给自己机会去表达。",
          "找到你的创造方式，你就找到了生命的意义。不是因为你创造了什么伟大的作品，而是因为在创造的过程中，你与生命本身产生了最深的连接。",
          "这就是生命的探索——不是要到达某个目的地，而是享受旅途本身。",
        ],
      },
    ],
  },
];

// ─── 查找工具 ──────────────────────────────────────────

/** 根据 ID 查找书籍 */
export function getBookById(bookId: string): Book | undefined {
  return BOOKS.find((b) => b.id === bookId);
}

/** 根据分类筛选书籍 */
export function getBooksByCategory(categoryId: string): Book[] {
  if (categoryId === "recommend") return BOOKS;
  return BOOKS.filter((b) => b.category === categoryId);
}

// ─── 学习进度（localStorage） ─────────────────────────

const PROGRESS_STORAGE_KEY = "metamind_handbook_progress";

export interface ChapterProgress {
  /** 是否已完成 */
  completed: boolean;
  /** 已播放秒数 */
  playedSeconds: number;
  /** 最后学习时间 */
  lastStudiedAt: number;
}

export type BookProgress = Record<string, ChapterProgress>;
export type AllProgress = Record<string, BookProgress>;

/** 读取全部进度 */
export function loadAllProgress(): AllProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** 保存全部进度 */
function saveAllProgress(data: AllProgress): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage 满或不可用时静默失败
  }
}

/** 获取某本书的进度 */
export function getBookProgress(bookId: string): BookProgress {
  const all = loadAllProgress();
  return all[bookId] || {};
}

/** 获取某章节的进度 */
export function getChapterProgress(
  bookId: string,
  chapterId: string,
): ChapterProgress {
  const bookProg = getBookProgress(bookId);
  return (
    bookProg[chapterId] || {
      completed: false,
      playedSeconds: 0,
      lastStudiedAt: 0,
    }
  );
}

/** 更新章节进度 */
export function updateChapterProgress(
  bookId: string,
  chapterId: string,
  update: Partial<ChapterProgress>,
): void {
  const all = loadAllProgress();
  if (!all[bookId]) all[bookId] = {};
  const prev = all[bookId][chapterId] || {
    completed: false,
    playedSeconds: 0,
    lastStudiedAt: 0,
  };
  all[bookId][chapterId] = {
    ...prev,
    ...update,
    lastStudiedAt: Date.now(),
  };
  saveAllProgress(all);
}

/** 计算某本书的学习百分比 */
export function calcBookPercent(book: Book): number {
  const prog = getBookProgress(book.id);
  if (book.chapters.length === 0) return 0;
  let completed = 0;
  for (const ch of book.chapters) {
    if (prog[ch.id]?.completed) completed++;
  }
  return Math.round((completed / book.chapters.length) * 100);
}

/** 获取某本书已完成的章节数 */
export function getCompletedCount(book: Book): number {
  const prog = getBookProgress(book.id);
  let count = 0;
  for (const ch of book.chapters) {
    if (prog[ch.id]?.completed) count++;
  }
  return count;
}

/** 格式化秒数为 MM:SS */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
