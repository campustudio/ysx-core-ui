# 组件架构文档

> 元思想平台所有自定义组件的架构说明与使用指南

## 架构概览

```
components/
├── shared/          # 原子级复用组件（跨页面、跨区域复用）
├── hero/            # Hero 区（首屏）复合组件
├── content/         # 内容区复合组件
├── navigation/      # 导航组件
├── breathing/       # 沉浸呼吸页专用组件
├── player/          # 音频播放页专用组件
├── onboarding/      # 引导页专用组件
├── ui/              # shadcn/ui 预生成组件（受保护，项目未使用）
└── figma/           # Figma 导入组件（受保护）

config/              # 配置层（数据与组件分离）
├── calendar.ts      # 24节气 + 十二时辰数据与计算
├── images.ts        # 所有图片 URL
├── icons.tsx        # 自绘 SVG 图标集合
├── home-data.ts     # 首页内容数据
├── articles-data.ts # 文章数据（5篇）
├── podcasts-data.ts # 播客数据（3条）
├── activities-data.ts # 活动数据（3条）
├── breathing-data.ts  # 呼吸页数据（时长/音效/完成语/呼吸节奏）
├── player-data.ts     # 音频播放页数据
├── solar-data.ts      # 太阳系引导数据
├── onboarding-data.ts # 新人引导数据
└── styles.ts        # 共享样式常量 + rpx 工具函数

pages/               # 页面组装层（纯组装，不含数据）
├── Home.tsx         # 首页
├── ArticleReader.tsx  # 文章阅读页
├── PodcastDetail.tsx  # 播客详情页
├── ActivityDetail.tsx # 活动详情页
├── AudioPlayer.tsx    # 音频播放页
├── BreathingSession.tsx # 沉浸呼吸页
├── OnboardingGuide.tsx  # 新人引导页
└── OnboardingSolar.tsx  # 太阳系版引导页
```

---

## 配置层（config/）

配置与组件分离，所有文本、图片、图标集中管理，任何组件都可导入复用。

### calendar.ts

24节气 + 十二时辰数据与计算。

```tsx
import { getSolarTerm, getShichen } from '../config/calendar';
import type { SolarTerm, Shichen } from '../config/calendar';
```

| 导出 | 说明 |
|------|------|
| `SOLAR_TERMS` | 24节气数据数组 |
| `SHICHEN_LIST` | 十二时辰数据数组 |
| `getSolarTerm()` | 获取当前节气 |
| `getShichen()` | 获取当前时辰 |

### images.ts

所有图片 URL 的统一管理。

```tsx
import { HERO_BG, FEATURED_IMG, PLACEHOLDER_IMAGES, DEFAULT_AVATAR } from '../config/images';
```

| 导出 | 说明 |
|------|------|
| `HERO_BG` | Hero 区背景图 |
| `FEATURED_IMG` | 精选推荐卡片背景图 |
| `PLACEHOLDER_IMAGES` | 内容卡片占位图（a/b/c/d） |
| `DEFAULT_AVATAR` | 默认头像 |

### icons.tsx

自绘 SVG 图标集合，统一 `IconProps` 接口。

```tsx
import { SoftCloudIcon, PavilionIcon, ScrollIcon, BaguaIcon, TaijiIcon } from '../config/icons';
import type { IconProps } from '../config/icons';
```

| 图标 | 用途 |
|------|------|
| `SoftCloudIcon` | 「徐」卡片图标 |
| `PavilionIcon` | 底部导航 - 首页（湖心亭） |
| `ScrollIcon` | 底部导航 - 人类手册（古卷轴） |
| `BaguaIcon` | 底部导航 - 新人生之路（先天八卦） |
| `TaijiIcon` | 底部导航 - 明镜（太极） |

### styles.ts

跨组件复用的样式常量 + 工具函数。

```tsx
import { TEXT_SHADOW_HERO, HERO_COLORS, STICKY_COLORS, BG_PARCHMENT, BG_PARCHMENT_END, BG_CONTENT_GRADIENT, GLASS_GRADIENTS, FONT_SERIF, rpx, PAGE_PX } from '../config/styles';
```

| 导出 | 说明 |
|------|------|
| `TEXT_SHADOW_HERO` | Hero 区白色文字三层阴影 |
| `HERO_COLORS` | Hero 模式色彩方案（白色系） |
| `STICKY_COLORS` | 吸顶模式色彩方案（深色系） |
| `BG_PARCHMENT` | 绢轴色 `#F0E4CE` |
| `BG_PARCHMENT_END` | 绢轴渐变终止色 `#F5E8D2` |
| `BG_CONTENT_GRADIENT` | 内容区渐变背景 |
| `GLASS_GRADIENTS` | 三种玻璃卡片渐变（sage/amber/lavender） |
| `FONT_SERIF` | 宋体字族 `'Noto Serif SC', serif` |
| `rpx(v)` | **750px 基准响应式单位**，返回 `calc(var(--rpx) * v)` |
| `PAGE_PX` | 页面两侧内边距 `rpx(48)` |

### 内容数据文件

| 文件 | 导出 | 说明 |
|------|------|------|
| `home-data.ts` | `DAILY_WISDOM, FEATURED, HOME_SECTIONS, ANNOUNCEMENT` | 首页所有区块数据 |
| `articles-data.ts` | `ARTICLES, getArticleById(), hasArticle()` | 文章内容（5篇），段落类型系统 |
| `podcasts-data.ts` | `PODCASTS, getPodcastById(), hasPodcast()` | 播客数据（3条），含章节+金句 |
| `activities-data.ts` | `ACTIVITIES, getActivityById(), hasActivity()` | 活动数据（3条），含日程+亮点 |
| `breathing-data.ts` | `DURATION_OPTIONS, AMBIENT_SOUNDS, COMPLETION_MESSAGES, BREATH_CYCLE` | 呼吸页配置（时长/音效/完成语/呼吸节奏） |
| `audio-sources.ts` | `AMBIENT_SCENE_IMAGES` | 音频资源指南（推荐来源/搜索词/替换步骤/环境音效意境图） |

---

## 原子组件（shared/）

跨页面、跨区域复用的基础组件。

### SectionTitle — 琥珀竖线区块标题

**路径**：`/src/app/components/shared/SectionTitle.tsx`

品牌辨识度组件，用于所有内容区块的标题行。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| title | string | — | 主标题 |
| subtitle | string | — | 副标题（可选） |
| showArrow | boolean | true | 是否显示右侧箭头 |
| onMore | () => void | — | 点击整行回调（标题+箭头整行可点击，非仅箭头） |

**点击行为**：当 `showArrow=true` 且 `onMore` 有值时，整个标题行（标题文字+箭头）均可点击，而非仅箭头图标本身。已添加 `role="button"` 和键盘支持。

### Avatar — 头像按钮

**路径**：`/src/app/components/shared/Avatar.tsx`

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| src | string | DEFAULT_AVATAR | 头像图片 URL |
| size | 'sm' \| 'md' \| 'lg' | 'sm' | 尺寸 |
| variant | 'light' \| 'dark' | 'light' | 视觉模式 |
| onClick | () => void | — | 点击回调 |

### GlassCard — 毛玻璃卡片

**路径**：`/src/app/components/shared/GlassCard.tsx`

Hero 区功能入口卡片（徐/止/定）。纵向居中布局：宋体单字在上 + 图标在下。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| icon | ComponentType\<IconProps\> | — | 图标组件 |
| label | string | — | 卡片标签（单字） |
| gradient | string | — | 背景渐变 CSS |
| onClick | () => void | — | 点击回调 |

### GuideButton — 问道按钮

**路径**：`/src/app/components/shared/GuideButton.tsx`

竖排文字 + 右上/左下弧线包裹 + 呼吸动画。

### ScrollHint — 滚动提示

**路径**：`/src/app/components/shared/ScrollHint.tsx`

竖排文字 + 向下箭头动画。

### DetailPageShell — 详情页通用外壳

**路径**：`/src/app/components/shared/DetailPageShell.tsx`

抽离文章/播客/活动详情页的通用结构：封面图 + 返回按钮 + 栏目标签 + 内容区。

**复用场景**：ArticleReader、PodcastDetail、ActivityDetail（三个详情页全部使用）。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| coverImage | string | — | 封面图 URL |
| coverAlt | string | '' | 图片 alt |
| category | string | — | 栏目名称 |
| categoryColor | 'amber' \| 'sage' | — | 标签色调 |
| bgColor | string | '#F0E4CE' | 背景起始色 |
| bgColorEnd | string | '#F5E8D2' | 背景终止色 |
| coverHeight | number | 500 | 封面高度（rpx） |
| onBack | () => void | — | 返回回调 |
| children | ReactNode | — | 内容区 |

**内置功能**：
- 进入页面自动 scrollTo(0, 0)
- 返回按钮适配 safe-area-inset-top
- 底部渐变遮罩用深琥珀色（非纯黑）
- 内容区自带底部留白

### NotFoundFallback — 内容不存在降级 UI

**路径**：`/src/app/components/shared/NotFoundFallback.tsx`

全屏居中显示提示文案 + 返回链接。古纸色背景 + 宋体字。

**复用场景**：ArticleReader、PodcastDetail、ActivityDetail 的 404 降级。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| message | string | '内容正在路上' | 提示文案 |
| onBack | () => void | — | 返回回调 |

### PageTransition — 页面转场动画包装器

**路径**：`/src/app/components/shared/PageTransition.tsx`

根据导航方向播放不同速度的淡入动画。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| direction | 'forward' \| 'back' | 'forward' | 导航方向 |
| children | ReactNode | — | 页面内容 |

**关键约束**：
- **禁止使用 transform**！transform 会创建新的 containing block，导致子组件中 position:fixed 的元素（底部导航栏、吸顶 Header）失效。
- 仅使用 opacity 动画
- 前进 0.38s / 返回 0.3s
- mounted 后将 willChange 重置为 auto

### Toast — 轻量提示组件

**路径**：`/src/app/components/shared/Toast.tsx`

温柔浮现的底部提示，自动消失。位于底部导航栏上方。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| message | string | — | 提示文案 |
| visible | boolean | — | 是否显示 |
| duration | number | 2000 | 显示时长（ms） |
| onDismiss | () => void | — | 消失回调 |

**动画**：淡入上浮 → 持续显示 → 淡出下沉，退出动画 280ms。

**使用范围**：
- Home — 底部导航未开发页面、头像（登录）、区块箭头（查看更多）、公告卡片
- PodcastDetail — 播放按钮、章节跳转
- ActivityDetail — 报名按钮
- OnboardingSolar — 行星节点点击

**提示文案风格**：`「{功能名}」正在用心打磨中，敬请期待`（统一温柔语气）

---

## Hero 组件（hero/）

### HeroBackground — 背景图层

全屏背景图 + 深琥珀色渐变遮罩。

### HeroHeader — 顶部栏（支持吸顶）

组合 SolarTermDisplay + Avatar。fixed 定位，`isSticky` 切换两种模式。
阈值：滚动 > 90vh 时触发吸顶。

### SolarTermDisplay — 节气时辰显示

支持竖排（古卷）和横排（现代）两种布局。

### BreathingCircle — 呼吸引导圆环

三层呼吸动画（外圈/中圈/内圈），品牌标志性交互元素。
文字加反向补偿缩放（textCompensate），视觉大小始终恒定。

### JourneyCards — 三卡片入口

左→右排列：徐→止→定（由动入静的渐修路径）。

---

## 内容组件（content/）

### DailyWisdomCard — 每日智慧语录
### FeaturedCard — 精选推荐大卡片
### SectionBlock — 内容区块（SectionTitle + 卡片列表）
### ContentCard — 内容小卡片（SectionBlock 的子组件）
### AnnouncementCard — 官方公告

---

## 导航组件（navigation/）

### BottomNavigation — 底部导航栏

四个自绘 SVG 图标。纯半透明深色背景（不使用 backdrop-filter）。

**兼容性设计**：
- `env(safe-area-inset-bottom)` 适配全面屏
- 使用 rpx 单位（非原始 vw）确保大屏有上限
- 触摸区域 ≥ 88rpx（≈44px），符合移动端最小触摸目标规范
- 当前仅首页 tab 可用，其余弹出 Toast 提示

---

## 引导组件（onboarding/）

### SolarSystem — 太阳系七境轨道

**路径**：`/src/app/components/onboarding/SolarSystem.tsx`

CSS 3D 透视 + 行星公转动画。「元」为太阳，七境为行星。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| onPlanetClick | (planetId: string, planetTitle: string) => void | — | 行星节点点击回调 |

**机制**：
- `perspective` + `rotateX(62deg)` → 圆形轨道变椭圆（俯瞰角度）
- 行星反向旋转 `planet-face` → 文字始终正对用户
- `preserve-3d` 自动处理前后遮挡

### StarConstellation — 北斗七星版引导

**路径**：`/src/app/components/onboarding/StarConstellation.tsx`

北斗七星连线布局，真实星云背景图。

| Props | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| onStarClick | (starId: string, starTitle: string) => void | — | 星体节点点击回调 |

---

## 页面路由系统（App.tsx）

### 路由状态

```typescript
type PageRoute =
  | { page: "home" }
  | { page: "player"; trackLabel: string }
  | { page: "article"; articleId: string }
  | { page: "podcast"; podcastId: string }
  | { page: "activity"; activityId: string }
  | { page: "guide" }
  | { page: "solar" }
  | { page: "breathing" };
```

### 转场策略

- **前进**（home → 详情）：淡入（0.38s），通过 PageTransition
- **返回**（详情 → home）：快速淡入（0.3s），恢复滚动位置
- **关键机制**：routeKeyRef 递增 → 强制重新挂载 PageTransition → 重新播放入场动画

### 滚动位置恢复

离开首页前通过 `homeScrollYRef` 保存 scrollY，返回时通过双重 `requestAnimationFrame` 恢复：
```typescript
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.scrollTo(0, restoreScrollY);
  });
});
```
双重 rAF 确保 React DOM 提交后、浏览器完成布局/绘制后再滚动。

### 首页导航分发

`handleContentCardClick` 按优先级分发：
```
hasArticle(id) → ArticleReader
hasPodcast(id) → PodcastDetail
hasActivity(id) → ActivityDetail
fallback → AudioPlayer
```

---

## 数据规范

- **标题**：写完整文本，不硬编码省略号。截断由 CSS `line-clamp` 自动处理
- **副标题分隔符**：用中圆点（`·`）而非全角方括号（`【】`）
- **中文引号**：统一使用角引号`「」`，避免与 JS 字符串定界符冲突
- **示例**：`subtitle: "人生十字·周末生活的情感"`（正确）

---

## rpx 工具函数使用规范

### 标准版（绝大多数组件使用）

```tsx
import { rpx } from '../config/styles';
// rpx(48) → "calc(var(--rpx) * 48)"
// >750px 屏幕上 --rpx 固定为 1px（由 theme.css @media 控制）
```

### Onboarding 专用版（仅限沉浸体验页面）

```tsx
// 直接使用 vw，不受 750px 上限约束
const rpx = (v: number) => `${v * (100 / 750)}vw`;
```

使用场景：StarConstellation、SolarSystem、OnboardingGuide、OnboardingSolar

---

## 组件复用原则

### 何时创建新组件？
- 元素出现 **2次及以上**
- 具有明确的**独立功能**
- 通过 Props 可以**灵活配置**

### 何时不创建组件？
- 只使用 1 次的特殊布局
- 过于简单（如单个 div）
- 过度封装导致理解成本增加

---

## TARO 转换注意

1. **毛玻璃效果**：`backdrop-blur` 需替代为半透明纯色
2. **竖排文字**：`writing-mode: vertical-rl` 需测试小程序兼容性
3. **图标**：自绘 SVG 可直接转为小程序 SVG 组件
4. **动画**：CSS @keyframes 需转为小程序 animation API 或 CSS
5. **图片**：ImageWithFallback → TARO `<Image>` 组件
6. **事件**：onClick → onTap
7. **rpx 函数**：`rpx(48)` → 直接写 `48rpx`（SCSS）
8. **env(safe-area-inset-*)**：小程序有对应 API
9. **PageTransition**：TARO 有内置页面转场，此组件可去掉
10. **Toast**：可替换为 TARO 内置 `wx.showToast`

---

## 音频合成系统（utils/）

### audio-generator.ts — Web Audio API 音频合成器

**路径**：`/src/app/utils/audio-generator.ts`

使用 OfflineAudioContext 在浏览器中合成音频，返回 Blob URL。

**核心 API**：

| 函数 | 说明 |
|------|------|
| `getAudioUrl(type)` | 获取指定类型音频的 Blob URL（带缓存） |
| `resolveAudioUrl(src)` | 解析占位路径 → 合成 Blob URL，CDN URL → 原样透传 |

**支持的音频类型**（AudioType）：

| 类型 | 场景 | 合成技术 | 时长 |
|------|------|---------|------|
| `rain` | 呼吸页 · 细雨 | 带通噪音 4000Hz + 高通 800Hz + LFO 调制 | 15s |
| `ocean` | 呼吸页 · 海浪 | 低通 600Hz + 带通 1500Hz + 正弦调制 0.1Hz | 20s |
| `forest` | 呼吸页 · 山林 | 带通 2500Hz + 随机高频脉冲（鸟鸣暗示） | 20s |
| `wind` | 呼吸页 · 清风 | 带通 500Hz + 低通 1200Hz + 极慢 LFO | 15s |
| `xu` | 感知引导 · 徐 | 174Hz 索尔菲吉奥 + 纯五度 + 高八度泛音 | 30s |
| `zhi` | 感知引导 · 止 | 136.1Hz OM + 大三度 + 纯五度 + 高八度 | 30s |
| `ding` | 感知引导 · 定 | 111Hz 双耳节拍（左右声道差 1Hz → Alpha 波） | 30s |

**使用方式**：
```tsx
import { getAudioUrl, resolveAudioUrl } from '../utils/audio-generator';

// 直接获取
const url = await getAudioUrl('rain');
const audio = new Audio(url);
audio.loop = true;
audio.play();

// 或通过路径解析（兼容占位路径和真实 URL）
const resolved = await resolveAudioUrl('/audio/ambient-rain.mp3');
```

**升级为真实音频**：将 config 中 `audioSrc` 改为 CDN URL 即可。`resolveAudioUrl()` 对非占位路径原样透传。

**TARO 转换**：Web Audio API 在小程序不可用，需替换为预录制 mp3 + `wx.createInnerAudioContext()`。

---

**最后更新**：2026-02-10
**组件总数**：8 原子组件 + 5 Hero 组件 + 5 内容组件 + 1 导航组件 + 3 呼吸组件 + 3 播放器组件 + 2 引导组件 = 27 个自定义组件