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
