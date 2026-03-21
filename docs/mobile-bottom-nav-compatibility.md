# 移动端底部导航栏兼容性方案

> 本文档记录移动端底部固定元素（导航栏、按钮等）在不同设备和环境下的兼容性问题及解决方案。

## 目录

1. [问题概述](#问题概述)
2. [涉及的环境](#涉及的环境)
3. [核心概念](#核心概念)
4. [问题详解与解决方案](#问题详解与解决方案)
5. [最终代码实现](#最终代码实现)
6. [注意事项与踩坑记录](#注意事项与踩坑记录)
7. [待处理问题](#待处理问题)

---

## 问题概述

移动端底部固定元素需要处理以下兼容性问题：

1. **iOS 安全区（Safe Area）**：iPhone X 及以上机型底部有圆角和 Home Indicator，需要留出安全区
2. **安卓虚拟导航栏**：部分安卓手机底部有虚拟导航栏（返回键、Home键、多任务键）
3. **WebView 安全区动态变化**：在微信等 APP 的 WebView 中，安全区会随用户滑动动态变化
4. **键盘弹出**：键盘弹出时对底部固定元素的影响

---

## 涉及的环境

| 环境                 | 安全区行为                                            | 特殊问题           |
| -------------------- | ----------------------------------------------------- | ------------------ |
| iOS Safari           | `env()` 实时更新                                      | 无                 |
| iOS Chrome           | `env()` 实时更新                                      | 无                 |
| iOS 微信 WebView     | `env()` 只在安全区完全消失/出现时更新，中间过渡不更新 | 导航栏与安全区分离 |
| iOS 其他 APP WebView | 同微信，使用 WKWebView                                | 同上               |
| 安卓浏览器           | `env()` 支持程度取决于浏览器和系统版本                | 虚拟导航栏适配     |
| 安卓 WebView         | 行为不一致                                            | 键盘弹出时可能异常 |

---

## 核心概念

### CSS 安全区环境变量

```css
/* 需要在 HTML 中设置 viewport-fit=cover */
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

/* CSS 中使用 */
padding-bottom: env(safe-area-inset-bottom, 0px);
padding-top: env(safe-area-inset-top, 0px);
```

### 安全区高度参考值

| 设备                  | safe-area-inset-bottom |
| --------------------- | ---------------------- |
| iPhone X/XS/11 Pro    | 34px                   |
| iPhone XR/11/12/13/14 | 34px                   |
| iPhone 14 Pro/15      | 34px                   |
| 无安全区设备          | 0px                    |
| 安卓虚拟导航栏        | 约 48px（因设备而异）  |

---

## 问题详解与解决方案

### 问题1：基础安全区适配

**现象**：底部导航栏被 iPhone 底部圆角/Home Indicator 遮挡

**解决方案**：

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: rgba(50, 43, 32, 0.55);
}
```

**关键点**：

- 导航栏 `bottom: 0` 贴着屏幕最底部
- 使用 `padding-bottom` 而非 `bottom` 来处理安全区
- 背景色会延伸到安全区，视觉上是一个整体

---

### 问题2：iOS 微信 WebView 底部白色区域导致分离

**现象**：

- 用户在 iOS 微信中打开页面，往上慢速滑动
- 微信底部白色区域（手势导航指示条）逐渐下降
- 但灰色导航栏位置不变，中间出现空隙（割裂）

**原因**：

- 微信底部白色区域**不是标准的 safe-area**
- CSS `env(safe-area-inset-bottom)` 返回 0
- 这是微信自己的 UI 元素，无法通过标准 API 获取高度
- 只有通过 `visualViewport.pageTop` 和 `innerHeight` 变化间接推算

**关键数据（实测）**：

| 属性                     | 初始值 | 白色区域消失后 | 说明                    |
| ------------------------ | ------ | -------------- | ----------------------- |
| `innerHeight`            | 671    | 754            | 差值 83 = 白色区域高度  |
| `visualViewport.pageTop` | 0      | 123            | 白色区域完全消失时的值  |
| `visualViewport.height`  | 671    | 754            | 随 innerHeight 同步变化 |

**解决方案**：使用 `translateY` 让导航栏跟随白色区域移动

> ⚠️ 只需要处理 **iOS 微信**，安卓微信没有这个问题

```typescript
// 判断是否为 iOS 微信 WebView
const isIOSWeChatWebView = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const isWeChat = ua.includes("micromessenger");
  const isIOS = /iphone|ipad|ipod/.test(ua);
  return isWeChat && isIOS;
};

useEffect(() => {
  if (!isIOSWeChatWebView()) return;

  // iOS 微信默认估算值（基于实测数据）
  const DEFAULT_SAFE_AREA = 83;
  const DEFAULT_MAX_PAGE_TOP = 123;
  const DEFAULT_FACTOR = DEFAULT_SAFE_AREA / DEFAULT_MAX_PAGE_TOP; // ≈ 0.675

  const initialInnerHeight = window.innerHeight;
  let safeAreaHeight = DEFAULT_SAFE_AREA;
  let maxPageTop = DEFAULT_MAX_PAGE_TOP;
  let factor = DEFAULT_FACTOR;
  let learned = false;

  let rafId: number;
  let lastTranslateY = 0;

  const updatePosition = () => {
    const vv = window.visualViewport;
    if (!vv) {
      rafId = requestAnimationFrame(updatePosition);
      return;
    }

    const pageTop = vv.pageTop;
    const currentInnerHeight = window.innerHeight;

    // 动态学习：当 innerHeight 突然变大时，用实际值校准
    if (currentInnerHeight > initialInnerHeight && !learned) {
      safeAreaHeight = currentInnerHeight - initialInnerHeight;
      maxPageTop = pageTop;
      factor = safeAreaHeight / maxPageTop;
      learned = true;
    }

    // 计算偏移量
    const offset = Math.min(pageTop * factor, safeAreaHeight);

    if (offset !== lastTranslateY) {
      lastTranslateY = offset;
      setTranslateY(offset); // 更新导航栏的 translateY
    }

    rafId = requestAnimationFrame(updatePosition);
  };

  rafId = requestAnimationFrame(updatePosition);
  return () => cancelAnimationFrame(rafId);
}, []);
```

**方案原理**：

1. **默认估算值**：使用实测数据 `83/123` 作为初始值，第一次滑动就能跟随
2. **动态学习**：当 `innerHeight` 变大时，用实际差值校准参数
3. **计算偏移**：`offset = pageTop × factor`，导航栏向下移动 offset 像素
4. **应用变换**：`transform: translateY(${translateY}px)`

**为什么用 translateY 而不是改 paddingBottom**：

- `paddingBottom` 方案会改变导航栏高度，可能引起布局抖动
- `translateY` 只移动位置，不改变元素大小
- 配合导航栏下方的安全区背景层，视觉上是一个整体移动

---

### 问题3：首页内容被底部导航栏遮挡

**现象**：首页底部的"觉知"区域被导航栏和安全区遮挡

**原因**：首页高度没有考虑导航栏和安全区

**解决方案**：首页容器高度减去导航栏和安全区

```tsx
<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    // 关键：底部留出导航栏 + 安全区的空间
    bottom: "calc(var(--nav-height) + env(safe-area-inset-bottom, 0px))",
  }}
>
  {/* 首页内容 */}
</div>
```

---

## 最终代码实现

### BottomNavigation.tsx

```tsx
import { useState, useEffect } from "react";

const isWeChatWebView = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
};

export function BottomNavigation({ active = 0, onChange }) {
  const [safeAreaBottom, setSafeAreaBottom] = useState<number | null>(null);

  useEffect(() => {
    // 只在微信 WebView 中使用 JS 计算
    if (!isWeChatWebView()) return;

    let rafId: number;
    let lastValue = -1;

    const updateSafeArea = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const viewportOffsetTop = window.visualViewport.offsetTop;
        const windowHeight = window.innerHeight;

        // 计算底部被遮挡的区域（安全区）
        const bottomOffset = windowHeight - viewportHeight - viewportOffsetTop;

        // 只在合理范围内更新（0-50px），避免键盘弹出时误判
        if (
          bottomOffset >= 0 &&
          bottomOffset < 50 &&
          bottomOffset !== lastValue
        ) {
          lastValue = bottomOffset;
          setSafeAreaBottom(bottomOffset);
        }
      }

      // 持续轮询
      rafId = requestAnimationFrame(updateSafeArea);
    };

    // 启动轮询
    rafId = requestAnimationFrame(updateSafeArea);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(50, 43, 32, 0.55)",
        // 微信用 JS 值，其他环境用 CSS env()
        paddingBottom:
          safeAreaBottom !== null
            ? `${safeAreaBottom}px`
            : "env(safe-area-inset-bottom, 0px)",
        zIndex: 100,
      }}
    >
      {/* 导航栏内容 */}
    </div>
  );
}
```

### index.html

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```

---

## 注意事项与踩坑记录

### 踩坑0：使用事件监听而非轮询

**错误做法**：

```javascript
// ❌ 使用事件监听
window.visualViewport?.addEventListener("resize", updateSafeArea);
window.visualViewport?.addEventListener("scroll", updateSafeArea);
```

**问题**：微信 WebView 中安全区变化时，`visualViewport` 的 `resize/scroll` 事件**不会触发**

**正确做法**：

```javascript
// ✅ 使用 requestAnimationFrame 轮询
const updateSafeArea = () => {
  // 计算安全区...
  rafId = requestAnimationFrame(updateSafeArea); // 持续轮询
};
rafId = requestAnimationFrame(updateSafeArea);
```

---

### 踩坑1：背景层和内容层分离

#### 什么是背景层和内容层？

```
错误做法：分成两个独立的 div

┌─────────────────────────┐
│  内容层 (bottom: 34px)  │ ← 图标在这里，跟随安全区移动
│      🏠 📜 ☯️ 🔮        │
└─────────────────────────┘
         ↑ 空隙出现在这里！
┌─────────────────────────┐
│  背景层 (bottom: 0)     │ ← 灰色背景，固定不动
│  height: 200px          │
└─────────────────────────┘ ← 屏幕底部
```

**错误做法**：

```tsx
// ❌ 背景层和内容层分开
// 背景层：只负责显示灰色背景
<div style={{ bottom: 0, height: "200px", background: "灰色" }} />
// 内容层：导航图标，跟随安全区移动
<div style={{ bottom: "env(safe-area-inset-bottom)" }}>🏠 📜 ☯️ 🔮</div>
```

**问题**：安全区变化时，内容层（图标）移动但背景层不动，中间出现空隙

**正确做法**：

```
正确做法：一个整体 div

┌─────────────────────────┐
│      🏠 📜 ☯️ 🔮        │ ← 导航图标
├─────────────────────────┤
│      paddingBottom      │ ← 安全区填充（背景色延伸到这里）
│   (safe-area-inset)     │
└─────────────────────────┘ ← 屏幕底部
    整体是一个 div，背景色覆盖全部
```

```tsx
// ✅ 作为一个整体
<div
  style={{
    bottom: 0,
    paddingBottom: "env(safe-area-inset-bottom)",
    background: "灰色",
  }}
>
  🏠 📜 ☯️ 🔮
</div>
```

---

### 踩坑2：使用 height 而非 paddingBottom

#### 为什么用 paddingBottom 而不是 height？

```
paddingBottom 的作用：

┌─────────────────────────┐
│      导航栏内容         │ ← 图标按钮（nav-height 高度，如 70px）
│    🏠 📜 ☯️ 🔮          │
├─────────────────────────┤
│      paddingBottom      │ ← 这块是安全区填充（如 34px）
│                         │   背景色自动延伸到这里
└─────────────────────────┘ ← 屏幕物理底部

总高度 = 内容撑开的高度 + paddingBottom
      = 70px + 34px = 104px
```

**错误做法**：

```tsx
// ❌ 用 height 指定总高度
<div
  style={{
    bottom: 0,
    height: "calc(70px + env(safe-area-inset-bottom))", // 依赖 env() 计算
  }}
/>
```

**问题**：在微信中 `env()` 不实时更新，高度变化不同步

**正确做法**：

```tsx
// ✅ 用 paddingBottom，可以用 JS 动态设置像素值
<div
  style={{
    bottom: 0,
    paddingBottom: safeAreaBottom !== null ? `${safeAreaBottom}px` : "env(...)",
  }}
/>
```

---

### 踩坑3：innerHeight vs screen.height

#### 两者的区别

```
screen.height = 844px（iPhone 屏幕物理高度，永远不变）

innerHeight = 会变化！
┌─────────────────────────┐
│     Safari 地址栏       │ ← 显示时占用空间
├─────────────────────────┤
│                         │
│     innerHeight         │ ← 这部分的高度
│     (可用区域)          │
│                         │
├─────────────────────────┤
│     Safari 工具栏       │ ← 显示/隐藏会影响 innerHeight
└─────────────────────────┘

工具栏显示时：innerHeight = 780px
工具栏隐藏时：innerHeight = 812px
```

**错误做法**：

```javascript
// ❌ 使用 innerHeight
const safeArea = window.innerHeight - window.visualViewport.height;
// 工具栏显示/隐藏时，计算结果会变化，不稳定
```

**正确做法**：

```javascript
// ✅ 使用 screen.height（固定值）
const safeArea =
  window.screen.height - // 屏幕物理高度（固定）
  window.visualViewport.height - // 可视视口高度
  window.visualViewport.offsetTop; // 视口顶部偏移
```

---

### 踩坑4：没有限制安全区计算值范围

#### 为什么要限制在 0-50px？

```
正常情况：
screen.height = 844px
visualViewport.height = 810px
offsetTop = 0px
safeArea = 844 - 810 - 0 = 34px ✓ 这是正确的安全区高度

键盘弹出时：
screen.height = 844px
visualViewport.height = 500px（键盘占用了空间）
offsetTop = 0px
safeArea = 844 - 500 - 0 = 344px ✗ 这不是安全区！

如果不限制，导航栏 paddingBottom 会变成 344px，整个导航栏会变得很高！
```

**问题**：键盘弹出时 `visualViewport.height` 变小，计算出很大的"安全区"值

**解决**：限制在合理范围内（0-50px，因为安全区最大约 34px）

```javascript
if (safeArea >= 0 && safeArea < 50) {
  setSafeAreaBottom(safeArea); // 只有在合理范围内才更新
}
// 超过 50px 说明可能是键盘弹出，不更新，保持原值
```

---

## 跨平台测试结果（2026-02-10）

在 iOS 设备上测试了不同 APP 的 WebView 表现：

| 平台     | CSS env() 值 | 底部白色区域       | 问题表现                             | 需要处理  |
| -------- | ------------ | ------------------ | ------------------------------------ | --------- |
| **微信** | 0            | 有（慢滑时割裂）   | 导航栏与白色区域分离，中间出现空隙   | ✅ 需要   |
| 企业微信 | 34           | 无                 | 底部菜单栏会自动调整高度，无割裂问题 | ❌ 不需要 |
| QQ       | 34           | 有（往下滑时出现） | 白色区域会遮挡菜单栏，但不割裂       | ⚠️ 可选   |
| 支付宝   | 0            | 无                 | 始终正常，无任何问题                 | ❌ 不需要 |

### 关键发现

1. **微信底部白色区域不是标准 safe-area**
   - CSS `env(safe-area-inset-bottom)` 返回 0
   - 这是微信自己的"手势导航指示条"UI
   - 需要通过 `innerHeight` 变化间接推算高度

2. **CSS env() 能拿到值不代表没问题**
   - 企业微信能拿到 34px，但没有白色区域问题
   - QQ 能拿到 34px，但有白色区域遮挡问题

3. **CSS env() 拿不到值不代表有问题**
   - 支付宝 env() 返回 0，但完全没有问题

4. **问题的本质**
   - 只有微信会出现"导航栏与底部白色区域分离"的问题
   - 这是微信 WebView 的特殊行为

---

## 待处理问题

### iOS QQ WebView 白色区域遮挡问题

**现象**：

- 往上滑时白色区域消失，正常
- 往下滑时白色区域突然冒出，遮挡底部菜单栏

**优先级**：低（用户在 QQ 中打开概率不大）

**状态**：已记录，暂不处理

---

### 安卓键盘弹出问题

**现象**：

- 安卓 WebView 中键盘弹出时，底部固定元素位置可能异常
- 曾遇到：底部固定按钮距离底部的空隙高度等于按钮本身高度

**可能的解决方案**：

1. 检测键盘弹出状态，动态调整元素位置
2. 在有输入框的页面隐藏底部导航栏
3. 使用 `position: sticky` 替代 `position: fixed`

**检测键盘弹出**：

```javascript
// 安卓键盘弹出时 innerHeight 会变化
let initialHeight = window.innerHeight;

window.addEventListener("resize", () => {
  const currentHeight = window.innerHeight;
  const isKeyboardOpen = currentHeight < initialHeight * 0.75;

  if (isKeyboardOpen) {
    // 键盘弹出，隐藏或调整底部导航栏
  }
});
```

**状态**：待安卓测试后根据实际情况处理

---

## 兼容性检查清单

在发布前，请在以下环境测试底部导航栏：

- [ ] iOS Safari
- [ ] iOS Chrome
- [ ] iOS 微信 WebView（慢速滑动测试）
- [ ] iOS 其他 APP WebView
- [ ] 安卓浏览器
- [ ] 安卓微信 WebView
- [ ] 安卓虚拟导航栏设备
- [ ] 有输入框的页面（键盘弹出测试）

---

## 设计原则

### 商业化优先原则

1. **只处理主流平台**：优先处理微信（用户最可能访问的渠道）
2. **极端 case 记录不处理**：慢速滑动是极端场景，不值得花大量时间完美解决
3. **跨平台兼容成本高**：不同平台、不同系统、不同版本的表现都不同，逐一适配不现实
4. **记录问题供日后参考**：发现的问题先记录，有需求时再处理

### 技术选型原则

1. **CSS 优先**：能用 CSS 解决的不用 JS
2. **渐进增强**：基础功能用 CSS，特殊情况用 JS 增强
3. **平台隔离**：不同平台的特殊处理用 UA 检测隔离，避免互相影响
4. **默认值兜底**：无法动态获取时使用合理的默认估算值

---

## 更新记录

| 日期       | 更新内容                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 2026-02-10 | 初始版本，记录 iOS 微信 WebView 安全区动态变化问题及解决方案                                                                    |
| 2026-02-10 | 添加跨平台测试结果（企业微信、QQ、支付宝）；更新解决方案为 translateY + 默认估算值 + 动态学习；记录 QQ 待处理问题；添加设计原则 |
