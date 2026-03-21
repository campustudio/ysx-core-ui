# 设计系统文档

> 元思想平台设计系统 — 温暖引导、回归真我

## 设计理念

### 核心价值
- **回归** — 回到当下，回到自己
- **温暖** — 琥珀金的智慧之光，给予温暖引导
- **自然** — 鼠尾草绿的自然生长，疗愈力量
- **沉浸** — 全屏背景 + 呼吸动画，创造沉浸体验
- **纪元感** — 古纸底色 + 节气时辰 + 宋体字，古卷展开的时间质感

### 中国元素点睛策略
1. **节气时辰** — 中国哲学时间体系替代现代日期 ✅ 已实现
2. **宋体字** — Noto Serif SC 用于标题和金句 ✅ 已实现
3. **印章标记** — 品牌视觉识别 📋 规划中

**原则**：中国元素为点睛之笔，不喧宾夺主，整体保持现代简约。

### 阅读方向策略
- **功能性元素**（卡片入口、导航栏）→ 现代左→右方向
- **意境性元素**（节气竖排、装饰文字）→ 传统右→左增添古韵
- **循环性元素**（呼吸圆环收/清）→ 无方向，用动画节奏引导

---

## 颜色系统

### 主色调
```css
/* 暖琥珀金 — 智慧之光、温暖引导 */
--color-primary: #C49A6C;
--color-primary-light: #D4B08A;
--color-primary-dark: #A67C4A;

/* 鼠尾草绿 — 自然生长、疗愈 */
--color-secondary: #8BAA7D;
--color-secondary-light: #A8C09D;
```

### 背景色
```css
/* 绢轴/古纸色 — "古卷展开"的纪元感 */
背景渐变: #F0E4CE → #F5E8D2

/* 表面色（毛玻璃用） */
--color-surface: rgba(255, 252, 245, 0.5);
--color-surface-light: rgba(255, 252, 245, 0.25);
--color-surface-dark: rgba(255, 248, 235, 0.12);  /* 深色背景上 */
```

### 文字颜色
```css
/* 温暖深棕系 */
--color-text-primary: #3A3028;
--color-text-secondary: rgba(58, 48, 40, 0.65);
--color-text-tertiary: rgba(58, 48, 40, 0.45);

/* 反色（用于深色/图片背景） */
--color-text-inverse: #FFFBF5;
```

### Hero 区白色文字
Hero 区文字在亮色背景图上需要三层 text-shadow 保证可读：
```css
text-shadow: 0 1px 4px rgba(0,0,0,0.6),
             0 2px 12px rgba(0,0,0,0.35),
             0 0 24px rgba(0,0,0,0.15);
```

### Hero 背景遮罩
深琥珀色渐变遮罩（配合暖色体系，非纯黑）：
```css
background: linear-gradient(to bottom,
  rgba(30,20,10,0.32) 0%,    /* 顶部轻压暗 */
  rgba(30,20,10,0.15) 10%,
  transparent 40%,
  transparent 75%,
  rgba(30,20,10,0.15) 100%);
```

---

## 字体系统

### 字族
- **标题/金句**：`'Noto Serif SC', serif`（思源宋体）
- **正文**：系统字体栈 `-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif`

### 字号（基于 750px 设计稿）
| 名称 | rpx 值 | 约等效 px | 使用场景 |
|------|--------|----------|---------|
| xs | 24rpx | 12px | 辅助文字、标签 |
| sm | 28rpx | 14px | 正文小字、描述 |
| base | 32rpx | 16px | 正文、按钮文字 |
| lg | 36rpx | 18px | 小标题、语录 |
| xl | 40rpx | 20px | 区块标题 |
| 2xl | 48rpx | 24px | 节气名、大标题 |
| 3xl | 60rpx | 30px | 特大标题 |
| 4xl | 72rpx | 36px | 超大标题 |

### 字重
- **300（Light）**：描述、辅助文字、节气诗句
- **400（Normal）**：标题、正文、宋体金句
- **500（Medium）**：强调文字

---

## 间距系统（基于 750px 设计稿）

| 名称 | rpx 值 | 约等效 px | 使用场景 |
|------|--------|----------|---------|
| xs | 16rpx | 8px | 元素内小间距 |
| sm | 24rpx | 12px | 紧凑元素间距 |
| md | 32rpx | 16px | 标准间距 |
| lg | 48rpx | 24px | 大间距、卡片内边距 |
| xl | 64rpx | 32px | 模块间距 |
| 2xl | 80rpx | 40px | 大模块间距 |

---

## 圆角系统

| 名称 | rpx 值 | 约等效 px | 使用场景 |
|------|--------|----------|---------|
| xs | 12rpx | 6px | 小标签 |
| sm | 16rpx | 8px | 小按钮 |
| md | 24rpx | 12px | 标准卡片 |
| lg | 32rpx | 16px | 大卡片、内容卡片图片 |
| xl | 40rpx | 20px | 特大卡片（DailyWisdom、Featured） |
| full | 9999px | — | 圆形头像、胶囊 |

**特殊圆角**：内容区顶部 28rpx 圆角向上叠入背景图。

---

## 阴影系统

```css
--shadow-xs: 0 1px 4px rgba(0, 0, 0, 0.06);   /* 微阴影 */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);   /* 标准卡片 */
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);  /* hover 状态 */
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);  /* 浮起效果 */
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.18); /* 模态框 */
```

**原则**：用阴影营造立体感，不用明显边框。

---

## 毛玻璃效果

```css
--blur-light: blur(12px);
--blur-medium: blur(20px);
--blur-heavy: blur(32px);
--blur-extra: blur(40px);
```

**小程序兼容注意**：
- `backdrop-filter` 在小程序中支持有限
- 底部导航栏已改用纯半透明背景替代 backdrop-filter
- 其他毛玻璃区域转换时用半透明纯色替代

---

## 动画原则

### 过渡时间
| 名称 | 时长 | 使用场景 |
|------|------|---------|
| fast | 150ms | 按钮 hover |
| normal | 250ms | 标准过渡 |
| slow | 400ms | 大元素过渡 |

### 呼吸动画
- **BreathingCircle**：8秒周期（4秒吸+4秒呼），三层独立 scale + opacity
- **GuideButton**：3.5秒周期 opacity 脉动
- **ScrollHint**：2秒周期 translateY + opacity

### 动画原则
- 动画要克制，不过度
- 所有动画感觉"自然"、"柔和"
- 呼吸动画是品牌标志性交互

---

## 玻璃卡片渐变

三种预定义渐变用于不同语境（卡片内部纵向居中布局：文字在上 + 图标在下）：

```css
/* 鼠尾草绿（止） */
sage: linear-gradient(135deg, rgba(139,170,125,0.28), rgba(168,192,157,0.12));

/* 琥珀金（徐） */
amber: linear-gradient(135deg, rgba(196,154,108,0.25), rgba(212,176,138,0.1));

/* 薰衣草紫（定） */
lavender: linear-gradient(135deg, rgba(180,160,200,0.22), rgba(200,185,215,0.1));
```

---

## 响应式系统

详见 `/RESPONSIVE_SYSTEM.md`

- **设计基准**：750px
- **核心变量**：`--rpx: calc(100vw / 750)`
- **大屏限制**：> 750px 时 `--rpx: 1px`
- **容器约束**：`.app-container { max-width: 750px; margin: 0 auto; }`

---

**最后更新**：2026-02-09
**版本**：2.0