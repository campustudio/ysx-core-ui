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

/**
 * 人类手册模块统一默认背景（象牙白·温暖中性）
 * 依据设计文档第四节视觉规范：色彩首位「象牙白 #F7F5F1」+ 风格「温暖中性(金白灰)」。
 * 阅读器(纸/夜间专用色)不使用此常量；带整屏背景图的页面在其上叠图。
 */
export const HANDBOOK_BG = "#F7F5F1";

/** 内容区渐变 */
export const BG_CONTENT_GRADIENT = `linear-gradient(to bottom, ${BG_PARCHMENT}, ${BG_PARCHMENT_END})`;

// ─── 玻璃卡片渐变 ─────────────────────────────────────
export const GLASS_GRADIENTS = {
  sage: "linear-gradient(135deg, rgba(139,170,125,0.28), rgba(168,192,157,0.12))",
  amber:
    "linear-gradient(135deg, rgba(196,154,108,0.25), rgba(212,176,138,0.1))",
  lavender:
    "linear-gradient(135deg, rgba(180,160,200,0.22), rgba(200,185,215,0.1))",
} as const;

// ─── 液态玻璃卡片（与首页第三层一致，供人类手册馆复用） ───
/**
 * Apple 液态玻璃质感：依赖 backdrop-filter 毛玻璃。
 * 用法：<div style={{ ...LIQUID_GLASS, borderRadius: rpx(40) }} />
 * ⚠️ 兼容性：iOS Safari 9+ / Android Chrome 76+；老式国产安卓 WebView 可能不渲染模糊，
 *   届时需用 @supports 检测降级为半透明实底（如 rgba(247,245,240,0.85)）兜底可读性。
 */
export const LIQUID_GLASS = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(18px) saturate(1.15)",
  WebkitBackdropFilter: "blur(18px) saturate(1.15)",
  // 弱化硬质白色描边，改为极淡、柔和过渡的半透明白（消除死板白边，与首页第三层一致）
  borderTop: "1px solid rgba(255, 255, 255, 0.45)",
  borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
  borderRight: "1px solid rgba(255, 255, 255, 0.12)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
  boxShadow:
    "inset 1.5px 1.5px 3px rgba(255,255,255,0.35), inset -2px -2px 4px rgba(0,0,0,0.04), inset 0 0 20px rgba(255,255,255,0.1), 0 12px 28px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)",
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

// ─── 刻进去（活版印刷/letterpress）效果 ──────────────
/**
 * 统一的"刻进去"质感：浅色卡片/按钮上的文字与图标都用此组常量，
 * 与首页第三层 + 人类手册馆液态玻璃卡片保持一致。
 * - TEXT_ENGRAVED：标题级（更实）
 * - TEXT_ENGRAVED_SOFT：副标题/正文级（更柔）
 * - ICON_ENGRAVED：lucide/SVG 图标的 filter（drop-shadow 双层）
 */
export const TEXT_ENGRAVED =
  "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)";
export const TEXT_ENGRAVED_SOFT =
  "0px 1.5px 1.5px rgba(255,255,255,0.9), 0px -1px 1.5px rgba(0,0,0,0.12)";
export const ICON_ENGRAVED =
  "drop-shadow(0px 1.5px 1.5px rgba(255,255,255,1)) drop-shadow(0px -1.5px 1.5px rgba(0,0,0,0.15))";

// ─── 人类手册馆 · 统一边框与柔和动效 ─────────────────
export const HANDBOOK_CARD_BORDER = "1.5px solid rgba(233,216,166,0.6)";

export const GENTLE_EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const GENTLE_EASE_IN = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * 柔和交叉淡化时长（ms）—— 统一供 `CrossFade` / `PageTransition` 使用。
 * 任何「切换」（页面路由、页内视图切换等）都应走这套时长，保持气质一致。
 */
export const GENTLE_FADE_IN_MS = 620;
export const GENTLE_FADE_OUT_MS = 540;

/** 展开（宜慢于收起） */
export const TRANSITION_EXPAND = `grid-template-rows 1.1s ${GENTLE_EASE_OUT}, opacity 0.8s ease 0.12s`;
/** 收起 */
export const TRANSITION_COLLAPSE = `grid-template-rows 0.85s ${GENTLE_EASE_IN}, opacity 0.6s ease`;

// ─── 可点击「快捷提问」胶囊（首页 & 搜索页统一） ──────────
/**
 * 统一的快捷提问胶囊样式：去掉金色描边，仅用极淡玻璃底 + 柔和投影，
 * 保持通透简约。首页与搜索页共用，确保风格一致。
 */
export const SUGGEST_CHIP = {
  background: "rgba(255,255,255,0.5)",
  border: "none",
  borderRadius: rpx(40),
  padding: `${rpx(12)} ${rpx(26)}`,
  fontSize: rpx(23),
  color: "#6F665A",
  fontFamily: FONT_SERIF,
  letterSpacing: rpx(1),
  backdropFilter: "blur(6px) saturate(1.05)",
  WebkitBackdropFilter: "blur(6px) saturate(1.05)",
  boxShadow: "0 2px 8px rgba(70,55,30,0.06)",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
} as const;
