/**
 * 中国传统时间体系 - 24节气 + 十二时辰
 *
 * "三处点睛"之一：节气时辰
 * 用中国哲学时间体系替代现代日期显示
 *
 * 节气描述选自唐诗宋词及经典文献，保持优美正能量
 * 日期为近似值，实际部署需接入天文算法库（如 lunar-javascript）
 */

// ─── 24节气 ──────────────────────────────────────────
export interface SolarTerm {
  name: string;
  month: number;
  day: number;
  desc: string;
}

export const SOLAR_TERMS: SolarTerm[] = [
  { name: "小寒", month: 1, day: 5, desc: "雁北乡归，鹊始筑巢" },
  { name: "大寒", month: 1, day: 20, desc: "松柏经霜翠更浓" },
  { name: "立春", month: 2, day: 4, desc: "春到人间草木知" },
  { name: "雨水", month: 2, day: 19, desc: "润物无声，草木萌动" },
  { name: "惊蛰", month: 3, day: 6, desc: "春雷初响，万卉皆新" },
  { name: "春分", month: 3, day: 21, desc: "陌上花开缓缓归" },
  { name: "清明", month: 4, day: 5, desc: "草长莺飞，万物清明" },
  { name: "谷雨", month: 4, day: 20, desc: "雨润百谷，春茶正好" },
  { name: "立夏", month: 5, day: 6, desc: "薰风初入弦" },
  { name: "小满", month: 5, day: 21, desc: "小得盈满，恰到好处" },
  { name: "芒种", month: 6, day: 6, desc: "梅子金黄杏子肥" },
  { name: "夏至", month: 6, day: 21, desc: "绿筠含粉，圆荷散芳" },
  { name: "小暑", month: 7, day: 7, desc: "荷风送香气" },
  { name: "大暑", month: 7, day: 23, desc: "时有微凉不是风" },
  { name: "立秋", month: 8, day: 7, desc: "云天收夏色，木叶动秋声" },
  { name: "处暑", month: 8, day: 23, desc: "四时俱可喜，最好新秋时" },
  { name: "白露", month: 9, day: 8, desc: "蒹葭苍苍，白露为霜" },
  { name: "秋分", month: 9, day: 23, desc: "碧云天，黄叶地" },
  { name: "寒露", month: 10, day: 8, desc: "菊有佳色，秋露清华" },
  { name: "霜降", month: 10, day: 23, desc: "霜叶红于二月花" },
  { name: "立冬", month: 11, day: 7, desc: "寒炉美酒时温" },
  { name: "小雪", month: 11, day: 22, desc: "绿蚁新醅，红泥小炉" },
  { name: "大雪", month: 12, day: 7, desc: "终南阴岭秀，积雪浮云端" },
  { name: "冬至", month: 12, day: 22, desc: "冬至阳生春又来" },
];

/** 获取当前节气（日期为近似值，精确计算需天文算法库） */
export function getSolarTerm(): SolarTerm {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
    const t = SOLAR_TERMS[i];
    if (m > t.month || (m === t.month && d >= t.day)) return t;
  }
  return SOLAR_TERMS[SOLAR_TERMS.length - 1];
}

// ─── 十二时辰 ────────────────────────────────────────
export interface Shichen {
  name: string;
  alias: string;
  start: number;
}

export const SHICHEN_LIST: Shichen[] = [
  { name: "子时", alias: "夜半", start: 23 },
  { name: "丑时", alias: "鸡鸣", start: 1 },
  { name: "寅时", alias: "平旦", start: 3 },
  { name: "卯时", alias: "日出", start: 5 },
  { name: "辰时", alias: "食时", start: 7 },
  { name: "巳时", alias: "隅中", start: 9 },
  { name: "午时", alias: "日中", start: 11 },
  { name: "未时", alias: "日昳", start: 13 },
  { name: "申时", alias: "哺时", start: 15 },
  { name: "酉时", alias: "日入", start: 17 },
  { name: "戌时", alias: "黄昏", start: 19 },
  { name: "亥时", alias: "人定", start: 21 },
];

/** 获取当前时辰 */
export function getShichen(): Shichen {
  const h = new Date().getHours();
  if (h >= 23 || h < 1) return SHICHEN_LIST[0];
  for (let i = SHICHEN_LIST.length - 1; i >= 0; i--) {
    if (h >= SHICHEN_LIST[i].start) return SHICHEN_LIST[i];
  }
  return SHICHEN_LIST[0];
}
