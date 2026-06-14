/**
 * 底部导航栏配置
 *
 * 控制每个页面是否显示底部导航栏，以及是否启用滚动隐藏效果
 */

export interface NavConfig {
  /** 是否显示底部导航栏 */
  showNav: boolean;
  /** 是否启用滚动隐藏效果（向下滚动隐藏，向上滚动显示） */
  scrollHide: boolean;
  /** 当前激活的导航项索引 */
  activeIndex?: number;
}

/**
 * 各页面的底部导航配置
 *
 * 设计原则：
 * - 主Tab页面（Home/Handbook/NewLifePath）：显示导航，启用滚动隐藏
 * - 二级详情页（有较长内容）：显示导航，启用滚动隐藏
 * - 三级及更深页面：不显示导航
 * - 功能专注页面（如践行、阅读）：不显示导航
 */
export const PAGE_NAV_CONFIG: Record<string, NavConfig> = {
  // === 主Tab页面 ===
  home: {
    showNav: true,
    scrollHide: false, // 首页导航常驻，不隐藏
    activeIndex: 0,
  },
  handbook: {
    showNav: true,
    scrollHide: true, // 手册页有长列表，启用滚动隐藏
    activeIndex: 1,
  },
  newlife: {
    showNav: true,
    scrollHide: true, // 新人生之路有长列表，启用滚动隐藏
    activeIndex: 2,
  },

  // === 人类手册馆（v2）===
  // 原则：能不加底部导航的页面就不加（占视线/占空间）。
  // 仅在「模块落地页」保留导航（作为 Tab 落点，便于切换大模块，类比支付宝首页）；
  // 进入子页后不再携带全局导航，返回用顶部返回键逐级后退。
  // 子页若有固定底部按钮，会通过 BottomNavContext 自动落到视口底部（无导航占位）。
  "handbook-home": {
    showNav: true, // 模块落地页：保留导航（Tab 落点）
    scrollHide: true,
    activeIndex: 1,
  },
  "hb-shelf": {
    showNav: false, // 书架子页
    scrollHide: false,
  },
  "hb-volume": {
    showNav: false, // 卷详情子页
    scrollHide: false,
  },
  "hb-recommend": {
    showNav: false, // 阅读建议子页
    scrollHide: false,
  },
  "hb-entry": {
    showNav: false, // 阅读入口子页（自带「生成阅读建议」按钮）
    scrollHide: false,
  },
  "hb-daily": {
    showNav: false, // 今日一段子页（自带「阅读原文」坞）
    scrollHide: false,
  },
  "hb-search": {
    showNav: false, // 搜索/问手册：专注的提问页，顶部自带返回
    scrollHide: false,
  },
  "hb-mypath": {
    // 路径概览页：保留全局导航，提供「一键直达模块首页/其他模块」的逃生入口，
    // 避免反复进出只能回退到「生成阅读建议」页（见设计文档 §7.2）
    showNav: true,
    scrollHide: true,
    activeIndex: 1,
  },
  "hb-fullpath": {
    showNav: true, // 同上：完整路径为概览页，保留导航逃生入口
    scrollHide: true,
    activeIndex: 1,
  },
  // 沉浸/专注流程页：不显示全局导航（各自有底部工具栏/操作）
  "hb-reader": {
    showNav: false, // 长文阅读，自带底部工具栏，避免双层底部冲突
    scrollHide: false,
  },
  "hb-practice": {
    showNav: false, // 读后练习专注页，自带两枚底部按钮
    scrollHide: false,
  },

  // === 二级详情页 ===
  "volume-detail": {
    showNav: false, // 卷详情页专注阅读，不显示导航
    scrollHide: false,
  },
  "path-layer": {
    showNav: true, // 路径层有长内容，显示导航
    scrollHide: true,
    activeIndex: 2,
  },

  // === 三级及更深页面（专注模式，不显示导航）===
  "chapter-detail": {
    showNav: false,
    scrollHide: false,
  },
  "dimension-detail": {
    showNav: false,
    scrollHide: false,
  },
  practice: {
    showNav: false,
    scrollHide: false,
  },
  "practice-history": {
    showNav: false,
    scrollHide: false,
  },

  // === 其他页面 ===
  circle: {
    showNav: false,
    scrollHide: false,
  },
  player: {
    showNav: false,
    scrollHide: false,
  },
  article: {
    showNav: false,
    scrollHide: false,
  },
  podcast: {
    showNav: false,
    scrollHide: false,
  },
  activity: {
    showNav: false,
    scrollHide: false,
  },
  guide: {
    showNav: false,
    scrollHide: false,
  },
  solar: {
    showNav: false,
    scrollHide: false,
  },
  breathing: {
    showNav: false,
    scrollHide: false,
  },
  login: {
    showNav: false,
    scrollHide: false,
  },
  "logo-preview": {
    showNav: false,
    scrollHide: false,
  },
  "book-detail": {
    showNav: false,
    scrollHide: false,
  },
  "chapter-player": {
    showNav: false,
    scrollHide: false,
  },
};

/**
 * 获取页面的导航配置
 */
export function getNavConfig(page: string): NavConfig {
  return (
    PAGE_NAV_CONFIG[page] || {
      showNav: false,
      scrollHide: false,
    }
  );
}
