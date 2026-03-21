/**
 * 太阳系引导页 - 配置数据
 *
 * 七大行星围绕「元」(太阳)缓慢运转
 * 内圈 → 外圈 = 起步 → 远方
 *
 * 轨道参数：
 *   radius   — 轨道半径（rpx 值）
 *   period   — 公转周期（秒），外圈更慢
 *   startDeg — 初始角度（0°=顶部，均匀分散避免重叠）
 *   size     — 行星直径（rpx），外圈略大保证可读
 *
 * 视觉色调：
 *   每颗行星有独立色相 hue（金色系微偏移）
 *   + 对应光晕色
 */

export interface SolarPlanet {
  id: string;
  glyph: string;
  title: string;
  description: string;
  /** 轨道半径 rpx */
  radius: number;
  /** 公转周期（秒） */
  period: number;
  /** 初始角度（度） */
  startDeg: number;
  /** 行星直径 rpx */
  size: number;
  /** 行星色调 [核心R,G,B] */
  color: [number, number, number];
}

/** 太阳中心文字 */
export const SUN_GLYPH = "元";
export const SUN_SUB = "思想";

/** 页面文案 */
export const SOLAR_TITLE = "欢迎来到元思想";
export const SOLAR_SUBTITLE =
  "每一步，都通向更好的自己";

/** 七星行星（内→外） */
export const SOLAR_PLANETS: SolarPlanet[] = [
  {
    id: "camp",
    glyph: "启",
    title: "入门营地",
    description: "成长的旅程从这里开始",
    radius: 105,
    period: 120,
    startDeg: 15,
    size: 58,
    color: [245, 225, 180],
  },
  {
    id: "daily",
    glyph: "习",
    title: "日常练习",
    description: "每天进步一点点",
    radius: 140,
    period: 150,
    startDeg: 200,
    size: 60,
    color: [240, 215, 170],
  },
  {
    id: "handbook",
    glyph: "归",
    title: "人类手册",
    description: "认识自己的指南",
    radius: 178,
    period: 185,
    startDeg: 85,
    size: 62,
    color: [235, 210, 165],
  },
  {
    id: "mirror",
    glyph: "镜",
    title: "明镜对话",
    description: "看见清晰的自己",
    radius: 218,
    period: 220,
    startDeg: 310,
    size: 64,
    color: [225, 208, 175],
  },
  {
    id: "community",
    glyph: "聚",
    title: "社群聚集地",
    description: "因热爱而聚",
    radius: 260,
    period: 260,
    startDeg: 140,
    size: 66,
    color: [220, 205, 168],
  },
  {
    id: "growth",
    glyph: "行",
    title: "成长轨迹",
    description: "每一步都算数",
    radius: 305,
    period: 310,
    startDeg: 250,
    size: 68,
    color: [210, 200, 175],
  },
  {
    id: "newlife",
    glyph: "新",
    title: "新人生之路",
    description: "重塑生命旅程",
    radius: 352,
    period: 380,
    startDeg: 50,
    size: 70,
    color: [205, 198, 180],
  },
];