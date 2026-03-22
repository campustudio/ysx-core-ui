/**
 * 图片资源配置
 *
 * 统一管理所有图片 URL，方便跨组件复用和集中维护
 * 来源：Unsplash（正式上线需替换为 CDN 地址）
 */

/** Hero 区背景图 - 绿色大地+河谷高空俯瞰（立春） */
export const HERO_BG =
  "/images/img-176520013512.jpg";

/** 精选推荐卡片背景图 - 干净草坪+晨光 */
export const FEATURED_IMG =
  "/images/img-171312015398.jpg";

/** 内容卡片占位图（正式上线替换为真实课程封面） */
export const PLACEHOLDER_IMAGES = {
  a: "/images/img-158184591210.jpg",
  b: "/images/img-158736286985.jpg",
  c: "/images/img-176784407570.jpg",
  d: "/images/img-175537564076.jpg",
} as const;

/** 默认头像 */
export const DEFAULT_AVATAR =
  "/images/img-158736286985.jpg";
