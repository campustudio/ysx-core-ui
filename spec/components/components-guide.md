# 组件架构指南

> 元思想平台组件设计与使用规范

---

## 一、目录结构

```
src/app/
├── config/                # 配置层（数据与样式分离）
│   ├── calendar.ts        # 节气 + 时辰系统
│   ├── images.ts          # 图片 URL 配置
│   ├── icons.tsx          # 自绘 SVG 图标
│   ├── home-data.ts       # 首页数据
│   └── styles.ts          # 共享样式常量 + rpx()
├── components/
│   ├── shared/            # 原子组件（跨页面复用）
│   ├── hero/              # Hero 区组件
│   ├── content/           # 内容区组件
│   ├── navigation/        # 导航组件
│   └── onboarding/        # 引导组件
└── pages/                 # 页面组装层
```

---

## 二、配置层（config/）

### calendar.ts

```typescript
getSolarTerm(date): string        // 获取节气名称
getLunarHour(date): LunarHour     // 获取时辰信息
```

### images.ts

```typescript
export const HOME_IMAGES = {
  hero: 'https://...',
  cards: {...}
};
```

### icons.tsx

```typescript
export const HomeIcon: FC<IconProps>; // 首页（湖心亭）
export const BookIcon: FC<IconProps>; // 人类手册（古卷轴）
export const MapIcon: FC<IconProps>; // 新人生之路（八卦）
export const MirrorIcon: FC<IconProps>; // 明镜（太极）
```

### styles.ts

```typescript
export const COLORS = {...};
export const TYPOGRAPHY = {...};
export const rpx = (value: number) => `calc(var(--rpx) * ${value})`;
```

---

## 三、原子组件（shared/）

### GlassCard

毛玻璃卡片容器。

```typescript
interface Props {
  variant?: "sage" | "amber" | "lavender";
  className?: string;
  children: ReactNode;
}
```

### BreathingCircle

品牌呼吸圆环动画。

```typescript
interface Props {
  size?: number; // rpx 值
  cycleDuration?: number; // 秒，默认 8
}
```

### SectionTitle

区块标题。

```typescript
interface Props {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}
```

---

## 四、Hero 组件（hero/）

### HeroSection

首屏 Hero 区，包含背景图、呼吸圆环、节气时辰、引导按钮。

```typescript
interface Props {
  backgroundImage: string;
  quote: QuoteData;
  showBreathingCircle?: boolean;
}
```

### CalendarDisplay

节气时辰竖排显示。

```typescript
interface Props {
  solarTerm: string;
  lunarHour: LunarHour;
  layout?: "vertical" | "horizontal";
}
```

---

## 五、内容组件（content/）

### PracticeCard

修炼入口卡片（徐/止/定三卡片）。

```typescript
interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  variant: "sage" | "amber" | "lavender";
  onClick?: () => void;
}
```

### DailyWisdom

每日智慧卡片。

```typescript
interface Props {
  quote: string;
  source?: string;
  backgroundImage?: string;
}
```

### FeaturedContent

精选内容卡片列表。

```typescript
interface Props {
  items: ContentItem[];
  layout?: "horizontal" | "grid";
}
```

---

## 六、导航组件（navigation/）

### BottomNav

底部导航栏。

```typescript
interface Props {
  activeTab: "home" | "handbook" | "path" | "mirror";
  onTabChange: (tab: string) => void;
}
```

四个自绘 SVG 图标，与设计稿视觉完全一致。

### Header

吸顶头部。

```typescript
interface Props {
  title?: string;
  showBackButton?: boolean;
  transparent?: boolean;
}
```

---

## 七、引导组件（onboarding/）

### GuideButton

引导按钮（带脉动动画）。

```typescript
interface Props {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}
```

### ScrollHint

下滑提示。

```typescript
interface Props {
  text?: string;
  visible?: boolean;
}
```

---

## 八、组件设计原则

### 8.1 配置与组件分离

```typescript
// ✅ 正确：数据来自 props 或 config
<DailyWisdom quote={HOME_DATA.dailyQuote} />

// ❌ 错误：组件内硬编码
<DailyWisdom quote="大道至简" />  // 除非是默认值
```

### 8.2 复用原则

- 出现 2 次以上 → 抽取为共享组件
- 组件只负责渲染，不负责数据获取
- Props 使用 TypeScript 严格类型

### 8.3 样式原则

- 使用 `config/styles.ts` 的共享常量
- 使用 `rpx()` 函数处理尺寸
- 用 className 接收外部样式覆盖

---

## 九、rpx 使用规范

```typescript
import { rpx } from '../config/styles';

// ✅ 正确用法
<div style={{ padding: rpx(48), fontSize: rpx(32) }}>

// ❌ 错误用法：直接使用 px
<div style={{ padding: '24px' }}>
```

---

## 十、页面路由

| 路径            | 页面       | 状态      |
| --------------- | ---------- | --------- |
| `/`             | 首页       | ✅ 完成   |
| `/handbook`     | 人类手册   | ✅ 完成   |
| `/handbook/:id` | 手册详情   | ✅ 完成   |
| `/path`         | 新人生之路 | 🚧 开发中 |
| `/mirror`       | 明镜空间   | 📋 规划中 |

---

_最后更新：2026-03-21_
