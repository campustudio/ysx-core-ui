# 750px 响应式系统说明

## 概述

本项目基于 **750px 设计稿标准** 的响应式系统，方便后续转换为 TARO 小程序。

## 设计基准

- **设计稿宽度**：750px（微信小程序标准）
- **换算关系**：在 750px 设计稿中，1px ≈ 2rpx
- **Web 端实现**：使用 CSS 变量 `--rpx` 实现响应式适配

## 核心 CSS 变量

### 响应式单位
```css
--rpx: calc(100vw / 750);  /* 小屏使用 vw */
/* 大屏（>750px）时固定为 1px，防止元素过大 */
```

### 使用方式

#### 1. 间距系统（Spacing）
```css
--spacing-xs: calc(var(--rpx) * 16);     /* 16rpx ≈ 8px */
--spacing-sm: calc(var(--rpx) * 24);     /* 24rpx ≈ 12px */
--spacing-md: calc(var(--rpx) * 32);     /* 32rpx ≈ 16px */
--spacing-lg: calc(var(--rpx) * 48);     /* 48rpx ≈ 24px */
--spacing-xl: calc(var(--rpx) * 64);     /* 64rpx ≈ 32px */
```

```tsx
<div style={{ padding: 'var(--spacing-lg)' }}>
  内容区域
</div>
```

#### 2. 字体系统（Typography）
```css
--font-size-xs: calc(var(--rpx) * 24);      /* 24rpx ≈ 12px */
--font-size-sm: calc(var(--rpx) * 28);      /* 28rpx ≈ 14px */
--font-size-base: calc(var(--rpx) * 32);    /* 32rpx ≈ 16px */
--font-size-lg: calc(var(--rpx) * 36);      /* 36rpx ≈ 18px */
--font-size-xl: calc(var(--rpx) * 40);      /* 40rpx ≈ 20px */
--font-size-2xl: calc(var(--rpx) * 48);     /* 48rpx ≈ 24px */
```

```tsx
<h1 style={{ fontSize: 'var(--font-size-2xl)' }}>
  标题
</h1>
```

#### 3. 组件尺寸（Sizing）
```css
/* 头像 */
--avatar-sm: calc(var(--rpx) * 64);         /* 64rpx ≈ 32px */
--avatar-md: calc(var(--rpx) * 96);         /* 96rpx ≈ 48px */

/* 导航栏 */
--nav-height: calc(var(--rpx) * 140);       /* 140rpx ≈ 70px */
```

#### 4. 圆角系统（Border Radius）
```css
--radius-xs: calc(var(--rpx) * 12);  /* 12rpx ≈ 6px */
--radius-sm: calc(var(--rpx) * 16);  /* 16rpx ≈ 8px */
--radius-md: calc(var(--rpx) * 24);  /* 24rpx ≈ 12px */
--radius-lg: calc(var(--rpx) * 32);  /* 32rpx ≈ 16px */
--radius-xl: calc(var(--rpx) * 40);  /* 40rpx ≈ 20px */
```

#### 5. 自定义尺寸

如果需要使用设计稿上的特定尺寸：

```tsx
// 方式1：直接使用 --rpx 计算（推荐）
<div style={{ width: 'calc(var(--rpx) * 200)' }}>
  {/* 200rpx ≈ 100px */}
</div>

// 方式2：内联 vw 计算
<div style={{ padding: `0 ${48 * (100 / 750)}vw` }}>
  {/* 48px 的 padding */}
</div>
```

## 最大宽度限制

使用 `app-container` 类来限制最大宽度：

```tsx
<div className="app-container">
  {/* 内容自动限制在 750px 内，大屏居中显示 */}
</div>
```

## 转换为 TARO 指南

### 1. CSS 变量 → SCSS 变量
```scss
// theme.scss
$spacing-lg: 48rpx;
$font-size-base: 32rpx;
$radius-lg: 32rpx;
```

### 2. 尺寸单位转换
```tsx
// React（当前）
style={{ padding: 'var(--spacing-lg)' }}

// TARO
style={{ padding: '48rpx' }}
```

### 3. 组件标签转换
```tsx
// React（当前）
<div className="flex items-center">

// TARO
<View className="flex items-center">
```

### 4. Tailwind → SCSS
```scss
.card {
  display: flex;
  border-radius: 32rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

## 优势

- **设计还原度高**：基于 750px 设计稿，与设计师协作顺畅
- **响应式适配**：自动适配不同屏幕尺寸
- **易于转换**：保持 rpx 思维，方便后续转 TARO
- **大屏限制**：超过 750px 自动使用固定 px，防止元素过大

## 注意事项

1. **避免使用固定 px**：除非是边框、阴影等装饰性样式
2. **优先使用 CSS 变量**：保持代码一致性
3. **安全区域适配**：使用 `env(safe-area-inset-*)` 处理刘海屏
4. **大屏测试**：确保在 >750px 屏幕上显示正常

## 参考文件

- `/src/styles/theme.css` — 所有 CSS 变量定义
- `/src/app/pages/Home.tsx` — 首页组件（组装示例）
- `/src/app/components/hero/HeroHeader.tsx` — 吸顶 Header 组件示例
- `/src/app/components/navigation/BottomNavigation.tsx` — 导航栏组件示例
- `/src/app/config/styles.ts` — 共享样式常量

---

**最后更新**：2026-02-08
