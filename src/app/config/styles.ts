/**
 * 共享样式常量
 *
 * 集中管理跨组件复用的样式值（text-shadow、渐变、色彩方案等）
 * 避免各组件重复定义
 */

// ─── Text Shadow ──────────────────────────────────────
/** Hero 区白色文字三层阴影（白云背景可读性兜底） */
export const TEXT_SHADOW_HERO =
  "0 1px 4px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.15)";

/** Hero 区图标投影 */
export const ICON_SHADOW_HERO = "drop-shadow(0 1px 3px rgba(0,0,0,0.2))";

// ─── Header 色彩方案 ─────────────────────────────────
/** Hero 模式（透明背景上的白色文字） */
export const HERO_COLORS = {
  title: "white",
  subtitle: "rgba(255,255,255,0.65)",
  time: "rgba(255,255,255,0.5)",
  divider: "rgba(255,255,255,0.2)",
  textShadow: TEXT_SHADOW_HERO,
} as const;

/** 吸顶模式（绢轴色背景上的深色文字） */
export const STICKY_COLORS = {
  title: "#3D3428",
  subtitle: "rgba(61, 52, 40, 0.7)",
  time: "rgba(61, 52, 40, 0.4)",
  divider: "rgba(61, 52, 40, 0.15)",
  textShadow: "none",
} as const;

/** Header 色彩方案类型 */
export type HeaderColorScheme = typeof HERO_COLORS;

// ─── 背景色 ──────────────────────────────────────────
/** 绢轴/古纸色 */
export const BG_PARCHMENT = "#F0E4CE";
export const BG_PARCHMENT_END = "#F5E8D2";

/** 内容区渐变 */
export const BG_CONTENT_GRADIENT = `linear-gradient(to bottom, ${BG_PARCHMENT}, ${BG_PARCHMENT_END})`;

// ─── 玻璃卡片渐变 ─────────────────────────────────────
export const GLASS_GRADIENTS = {
  sage: "linear-gradient(135deg, rgba(139,170,125,0.28), rgba(168,192,157,0.12))",
  amber: "linear-gradient(135deg, rgba(196,154,108,0.25), rgba(212,176,138,0.1))",
  lavender: "linear-gradient(135deg, rgba(180,160,200,0.22), rgba(200,185,215,0.1))",
} as const;

// ─── 宋体字族 ─────────────────────────────────────────
export const FONT_SERIF = "'Noto Serif SC', serif";

// ─── rpx 响应式单位工具函数 ────────────────────────────
/**
 * 基于 750px 设计稿的响应式单位转换
 * 将设计稿 px 值转为使用 CSS --rpx 变量的 calc 表达式
 *
 * 使用方式：rpx(48) → "calc(var(--rpx) * 48)"
 * 在 >750px 屏幕上，--rpx 固定为 1px（由 theme.css @media 控制）
 *
 * ⚠️ Onboarding 页面（星图/太阳系）使用 rpxVw 版本，
 *    因为它们是全屏沉浸体验、不受 750px 上限约束。
 *
 * @param v - 设计稿上的 px 值
 * @returns CSS calc 表达式字符串
 */
export const rpx = (v: number): string => `calc(var(--rpx) * ${v})`;

/**
 * vw 版本的 rpx，不受 750px 上限约束
 *
 * 专用于 Onboarding 沉浸页面（星图/太阳系），全屏无约束缩放。
 * 与 rpx() 的区别：rpx 使用 CSS --rpx 变量（大屏固定 1px），
 * rpxVw 始终按屏幕宽度等比缩放（100vw / 750）。
 *
 * 使用场景：StarConstellation / SolarSystem / OnboardingGuide / OnboardingSolar
 *
 * @param v - 设计稿上的 px 值
 * @returns vw 单位字符串
 */
export const rpxVw = (v: number): string => `${v * (100 / 750)}vw`;

// ─── 页面内边距（48rpx，详情页/内容区通用） ──────────
export const PAGE_PX = rpx(48);