/**
 * 新人引导页 - 星图导航配置（v6 · 真实星云形态 · 连线版）
 *
 * ★ 标准七星 · 斗口朝上 · 弧形柄朝下 ★
 *
 *   新(天枢α)──────────行(天璇β)     ← 斗口顶边（指极星方向）
 *     │                   │
 *   归(天权δ)──────────镜(天玑γ)     ← 斗底边（连接柄）
 *     │
 *   启(玉衡ε)                        ← 柄起点
 *      \
 *       聚(开阳ζ)                     ← 柄中段
 *        /
 *      习(摇光η)                      ← 柄尖（最近/最大/最亮）
 *
 *   柄呈弧形弯曲（先向左、再向右回弹）
 *   参照真实星图形态
 *
 * ★ 纵深体系 ★
 *   depth 1.0=最近(大/亮) → 0.20=最远(小/淡)
 *   斗口(远/小) → 柄尖(近/大)
 */

export interface GuideStar {
  id: string;
  glyph: string;
  title: string;
  description: string;
  x: number;
  y: number;
  starName: string;
  /** 透视深度 1.0=最近(大/亮/暖) → 0=最远(小/淡/冷) */
  depth: number;
}

/** 星座连线定义 [fromId, toId] */
export type StarConnection = [string, string];

export const ONBOARDING_TITLE = "欢迎来到元感知";
export const ONBOARDING_SUBTITLE = "人生的方向，不在剩下的路，而在心中的光";

// ─── 七星（斗口→柄尖，远→近） ────────────────────────

export const GUIDE_STARS: GuideStar[] = [
  // ── 斗体（上宽下窄梯形） ──
  {
    id: "newlife",
    glyph: "新",
    title: "新人生之路",
    description: "重塑生命旅程",
    x: 28,
    y: 7,
    starName: "天枢",
    depth: 0.24,
  },
  {
    id: "growth",
    glyph: "行",
    title: "成长轨迹",
    description: "每一步都算数",
    x: 78,
    y: 10,
    starName: "天璇",
    depth: 0.22,
  },
  {
    id: "handbook",
    glyph: "归",
    title: "人类手册",
    description: "认识自己的指南",
    x: 36,
    y: 27,
    starName: "天权",
    depth: 0.42,
  },
  {
    id: "mirror",
    glyph: "镜",
    title: "明镜对话",
    description: "看见清晰的自己",
    x: 72,
    y: 30,
    starName: "天玑",
    depth: 0.38,
  },
  // ── 弧柄（从天权延伸，弧形弯曲） ──
  {
    id: "camp",
    glyph: "启",
    title: "入门营地",
    description: "成长的旅程从这里开始",
    x: 28,
    y: 47,
    starName: "玉衡",
    depth: 0.58,
  },
  {
    id: "community",
    glyph: "聚",
    title: "社群聚集地",
    description: "因热爱而聚",
    x: 32,
    y: 64,
    starName: "开阳",
    depth: 0.78,
  },
  {
    id: "daily",
    glyph: "习",
    title: "日常练习",
    description: "每天进步一点点",
    x: 44,
    y: 80,
    starName: "摇光",
    depth: 1.0,
  },
];

// ─── 星座连线 ─────────────────────────

export const STAR_CONNECTIONS: StarConnection[] = [
  // 斗体四边
  ["newlife", "growth"], // 天枢─天璇（斗口顶边）
  ["newlife", "handbook"], // 天枢─天权（斗体左侧）
  ["growth", "mirror"], // 天璇─天玑（斗体右侧）
  ["handbook", "mirror"], // 天权─天玑（斗底边）
  // 弧柄三段
  ["handbook", "camp"], // 天权─玉衡
  ["camp", "community"], // 玉衡─开阳
  ["community", "daily"], // 开阳─摇光
];

/** 功能一览（近→远：习聚启镜归行新） */
export const JOURNEY_GLYPHS_SUMMARY = [...GUIDE_STARS]
  .sort((a, b) => b.depth - a.depth)
  .map((s) => s.glyph)
  .join(" · ");
