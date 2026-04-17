/**
 * 登录流程 - 配置数据
 *
 * 包含登录面板菜单项、登录方式、隐私协议等静态文案
 * 当前为 UI 外壳阶段，交互逻辑为模拟状态
 */

// ─── 个人面板菜单 ──────────────────────────────────────

export interface DrawerMenuItem {
  id: string;
  label: string;
  /** lucide-react 图标名（组件内映射） */
  icon: string;
  /** 是否需要登录才能使用 */
  requiresAuth: boolean;
}

export const DRAWER_MENU_ITEMS: DrawerMenuItem[] = [
  { id: "my-meta", label: "我的元感知", icon: "heart", requiresAuth: true },
  {
    id: "my-collection",
    label: "我的收藏",
    icon: "bookmark",
    requiresAuth: true,
  },
  { id: "my-history", label: "最近浏览", icon: "clock", requiresAuth: true },
  { id: "settings", label: "设置", icon: "settings", requiresAuth: false },
  { id: "about", label: "关于元感知", icon: "info", requiresAuth: false },
];

// ─── 登录方式 ──────────────────────────────────────────

export interface LoginMethod {
  id: string;
  label: string;
  /** lucide-react 图标名 */
  icon: string;
  /** 按钮样式类型 */
  variant: "primary" | "secondary" | "outline";
  /** 按钮背景色（primary 类型使用） */
  bgColor?: string;
  /** 按钮文字色 */
  textColor?: string;
}

export const LOGIN_METHODS: LoginMethod[] = [
  {
    id: "wechat",
    label: "微信登录",
    icon: "message-circle",
    variant: "primary",
    bgColor: "#07C160",
    textColor: "#ffffff",
  },
  {
    id: "phone",
    label: "手机号登录",
    icon: "smartphone",
    variant: "secondary",
  },
  {
    id: "apple",
    label: "Apple 登录",
    icon: "apple",
    variant: "outline",
  },
];

// ─── 文案 ──────────────────────────────────────────────

export const AUTH_COPY = {
  /** 登录面板 - 未登录提示 */
  drawerTitle: "登录元感知",
  drawerSubtitle: "登录后解锁全部功能",
  /** 登录页 */
  loginWelcome: "欢迎来到",
  loginBrand: "元感知",
  loginSubtitle: "在忙碌中找回自己的节奏",
  /** 隐私协议 */
  privacyTitle: "服务条款与隐私协议",
  privacyContent:
    "在使用元感知前，请你仔细阅读并同意《服务条款》和《隐私协议》。我们将依法保护你的个人信息安全。",
  privacyCheckLabel: "我已阅读并同意",
  privacyTerms: "《服务条款》",
  privacyPolicy: "《隐私协议》",
  /** 已登录状态 */
  loggedInGreeting: "你好",
  usageDaysLabel: "已陪伴你",
  usageDaysSuffix: "天",
} as const;

/** 登录页背景图 */
export const LOGIN_BG_IMAGE =
  "https://images.unsplash.com/photo-1708640577106-c2cf6523840b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG1vdW50YWluJTIwbGFrZSUyMG1vcm5pbmclMjBtaXN0JTIwd2FybSUyMGdvbGRlbnxlbnwxfHx8fDE3NzEwNTE1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
