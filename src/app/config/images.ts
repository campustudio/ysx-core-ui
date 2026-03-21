/**
 * 图片资源配置
 *
 * 统一管理所有图片 URL，方便跨组件复用和集中维护
 * 来源：Unsplash（正式上线需替换为 CDN 地址）
 */

/** Hero 区背景图 - 绿色大地+河谷高空俯瞰（立春） */
export const HERO_BG =
  "https://images.unsplash.com/photo-1765200135122-6e0e9e14da76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjB2aWV3JTIwZ3JlZW4lMjByaXZlciUyMHZhbGxleSUyMHZhc3QlMjB0ZXJyYWluJTIwYnJpZ2h0JTIwd2FybSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzA1MzExNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/** 精选推荐卡片背景图 - 干净草坪+晨光 */
export const FEATURED_IMG =
  "https://images.unsplash.com/photo-1713120153988-63ebab7e1d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9vdGglMjBncmVlbiUyMGxhd24lMjBtb3JuaW5nJTIwbGlnaHQlMjBlbXB0eSUyMGNsZWFuJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcwNTM1MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/** 内容卡片占位图（正式上线替换为真实课程封面） */
export const PLACEHOLDER_IMAGES = {
  a: "https://images.unsplash.com/photo-1581845912101-b79003f1b71e?w=400",
  b: "https://images.unsplash.com/photo-1587362869854-3898f1e5c2ac?w=400",
  c: "https://images.unsplash.com/photo-1767844075709-457613db5747?w=400",
  d: "https://images.unsplash.com/photo-1755375640763-7095bc784ec6?w=400",
} as const;

/** 默认头像 */
export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1587362869854-3898f1e5c2ac?w=100&h=100&fit=crop";
