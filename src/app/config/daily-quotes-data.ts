/**
 * 每日语录 - 日历翻阅数据
 *
 * 「今日之光」模块的核心数据，按日期索引
 * 支持日历前后翻阅，每天一条语录 + 来源
 *
 * 数据规范：
 * - 语录以中文角引号「」包裹内嵌引用
 * - 来源格式：作者名 或 书名·章节
 * - 每条语录建议 15-40 字，适合卡片展示
 * - category 用于细微的配色区分
 */

export interface DailyQuote {
  /** 日期 key，格式 MM-DD */
  date: string;
  /** 语录内容 */
  text: string;
  /** 来源/作者 */
  source: string;
  /** 类别标签 */
  category: "成长" | "宁静" | "力量" | "智慧";
}

/**
 * 语录库（循环使用）
 * 按月-日为 key，跨年复用
 * 如需按年区分，扩展 key 格式为 YYYY-MM-DD
 */
export const DAILY_QUOTES: DailyQuote[] = [
  // ── 二月 ──
  { date: "02-01", text: "每一个不曾起舞的日子，都是对生命的辜负", source: "尼采", category: "力量" },
  { date: "02-02", text: "万物皆有裂痕，那是光照进来的地方", source: "莱昂纳德·科恩", category: "力量" },
  { date: "02-03", text: "你不需要成为更好的人，你只需要成为你自己", source: "元思想 · 成长笔记", category: "成长" },
  { date: "02-04", text: "春到人间草木知，一年之始在于春", source: "张栻 · 立春偶成", category: "宁静" },
  { date: "02-05", text: "不必追赶任何人的脚步，你有自己的时区", source: "元思想 · 成长笔记", category: "成长" },
  { date: "02-06", text: "真正的平静不是远离喧嚣，而是在喧嚣中保持清醒", source: "元思想 · 成长笔记", category: "宁静" },
  { date: "02-07", text: "知止而后有定，定而后能静，静而后能安", source: "大学", category: "智慧" },
  { date: "02-08", text: "做一个安静的人，读书，旅行，等待爱情", source: "海子", category: "宁静" },
  { date: "02-09", text: "你所浪费的今天，是昨天去世的人奢望的明天", source: "元思想 · 成长笔记", category: "力量" },
  { date: "02-10", text: "心若没有栖息的地方，到哪里都是流浪", source: "三毛", category: "宁静" },
  { date: "02-11", text: "接受自己的不完美，是成长最温柔的开始", source: "元思想 · 成长笔记", category: "成长" },
  { date: "02-12", text: "生活不是等暴风雨过去，而是学会在雨中起舞", source: "元思想 · 成长笔记", category: "力量" },
  { date: "02-13", text: "慢慢来，比较快", source: "元思想 · 成长笔记", category: "智慧" },
  { date: "02-14", text: "当你回到自己，世界便回到了它本来的样子", source: "元思想 · 成长笔记", category: "宁静" },
  { date: "02-15", text: "山不过来，我就过去", source: "元思想 · 成长笔记", category: "智慧" },
  { date: "02-16", text: "所有的答案都在你内心深处，你只是忘了去听", source: "元思想 · 成长笔记", category: "成长" },
  { date: "02-17", text: "允许一切发生，是最大的勇敢", source: "元思想 · 成长笔记", category: "力量" },
  { date: "02-18", text: "活在当下不是口号，是每一次呼吸的选择", source: "元思想 · 成长笔记", category: "宁静" },
  { date: "02-19", text: "好雨知时节，当春乃发生", source: "杜甫 · 春夜喜雨", category: "宁静" },
  { date: "02-20", text: "成长不是变成别人，而是越来越接近自己", source: "元思想 · 成长笔记", category: "成长" },
  { date: "02-21", text: "你无法控制风，但你可以调整帆的方向", source: "元思想 · 成长笔记", category: "智慧" },
  { date: "02-22", text: "不完美的行动，胜过完美的等待", source: "元思想 · 成长笔记", category: "力量" },
  { date: "02-23", text: "简单是终极的复杂", source: "达芬奇", category: "智慧" },
  { date: "02-24", text: "把时间用在让你感到充实的事情上", source: "元思想 · 成长笔记", category: "成长" },
  { date: "02-25", text: "此心安处是吾乡", source: "苏轼", category: "宁静" },
  { date: "02-26", text: "每一天都值得被认真对待", source: "元思想 · 成长笔记", category: "力量" },
  { date: "02-27", text: "温柔地坚持，静静地生长", source: "元思想 · 成长笔记", category: "成长" },
  { date: "02-28", text: "最好的时光，是当下这一刻", source: "元思想 · 成长笔记", category: "宁静" },
  // ── 三月 ──
  { date: "03-01", text: "阳春布德泽，万物生光辉", source: "汉乐府 · 长歌行", category: "力量" },
  { date: "03-02", text: "你的节奏就是最好的节奏", source: "元思想 · 成长笔记", category: "成长" },
  { date: "03-03", text: "岁月不居，时节如流。行稳致远", source: "元思想 · 成长笔记", category: "智慧" },
  { date: "03-04", text: "安静是一种力量，沉默是一种智慧", source: "元思想 · 成长笔记", category: "宁静" },
  { date: "03-05", text: "与其追求完美，不如追求真实", source: "元思想 · 成长笔记", category: "成长" },
  { date: "03-06", text: "微雨众卉新，一雷惊蛰始", source: "韦应物", category: "力量" },
  { date: "03-07", text: "改变从接受开始，成长从放下开始", source: "元思想 · 成长笔记", category: "智慧" },
  { date: "03-08", text: "内心的力量，比任何外在的赞美都可靠", source: "元思想 · 成长笔记", category: "力量" },
  { date: "03-09", text: "你不必急着赶路，花会在路边一直开", source: "元思想 · 成长笔记", category: "宁静" },
  { date: "03-10", text: "把注意力放在你能控制的事情上", source: "元思想 · 成长笔记", category: "智慧" },
  { date: "03-11", text: "所谓成熟，不过是善于藏起脆弱，却不惧展露温柔", source: "元思想 · 成长笔记", category: "成长" },
  { date: "03-12", text: "种一棵树最好的时间是十年前，其次是现在", source: "谚语", category: "力量" },
  { date: "03-13", text: "人间有味是清欢", source: "苏轼", category: "宁静" },
  { date: "03-14", text: "先成为自己的光，再照亮别人的路", source: "元思想 · 成长笔记", category: "力量" },
  { date: "03-15", text: "给自己一些时间，你正在成为更好的自己", source: "元思想 · 成长笔记", category: "成长" },
];

// ─── 工具函数 ──────────────────────────────────────────

/** 中文星期 */
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

/** 获取中文星期 */
export function getWeekdayCN(date: Date): string {
  return `星期${WEEKDAYS[date.getDay()]}`;
}

/** 格式化日期为 MM-DD */
export function formatDateKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}-${d}`;
}

/** 格式化显示日期 — "2月14日" */
export function formatDateDisplay(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 获取指定日期的语录
 * 如果当天没有对应语录，则循环取模到语录库中
 */
export function getQuoteForDate(date: Date): DailyQuote {
  const key = formatDateKey(date);
  const match = DAILY_QUOTES.find((q) => q.date === key);
  if (match) return match;

  // 兜底：用日期的 dayOfYear 对语录库取模
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_QUOTES.length;
  return {
    ...DAILY_QUOTES[index],
    date: key,
  };
}

/**
 * 获取以 today 为中心的 N 天语录数组
 * 用于日历翻阅：[...过去几天, 今天, ...未来几天]
 */
export function getQuotesRange(
  centerDate: Date,
  pastDays: number = 7,
  futureDays: number = 3
): { date: Date; quote: DailyQuote }[] {
  const result: { date: Date; quote: DailyQuote }[] = [];
  for (let i = -pastDays; i <= futureDays; i++) {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + i);
    result.push({ date: d, quote: getQuoteForDate(d) });
  }
  return result;
}
