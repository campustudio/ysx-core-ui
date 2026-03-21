# 设计原则与决策记录

> 元思想平台的设计决策、原则和注意事项

**创建日期**：2026-02-06
**最后更新**：2026-02-10

---

## 核心设计理念

### 情感定位
- **回归当下**：引导用户停下来、慢下来、静下来
- **温暖引导**：琥珀金色调传递智慧之光
- **自然疗愈**：鼠尾草绿代表自然生长力量
- **纪元感**：古纸底色 + 节气时辰，连接传统与当下

### 视觉风格
- **简约第一**：大量留白，克制装饰
- **暖色柔和**：琥珀金 + 鼠尾草绿 + 古纸底色
- **中国元素点睛**：节气时辰、宋体字已实现；印章标记规划中。不喧宾夺主
- **现代简约**：整体保持现代感，中国元素为调味而非主体

---

## 阅读方向策略

功能与氛围的平衡：
- **功能性元素**（卡片入口、导航栏、按钮）→ 现代左→右方向，优先用户直觉
- **意境性元素**（节气竖排、装饰文字）→ 传统右→左增添古韵
- **循环性元素**（呼吸圆环收/清）→ 无固定方向，通过呼吸动画联动高亮引导认知

### 三卡片顺序
徐（慢下来）→ 止（停下来）→ 定（静下来），左→右排列。
哲学逻辑：由动入静的渐修路径，门槛从低到高。
卡片内部纵向居中布局：宋体单字在上 + 图标在下。

### 呼吸圆环收/清
收（吸气/扩张时高亮）和清（呼气/收缩时高亮）不依赖空间位置，
而是通过动画节奏交替高亮引导用户感知呼吸节奏。
文字容器加反向补偿缩放（`textCompensate`），抵消内圈 scale 变化，
视觉上文字大小始终恒定，只有亮度随呼吸——避免缩放与高亮产生主次错乱。

---

## 设计系统规范

### 1. 色彩使用

#### 主色
- **琥珀金 `#C49A6C`**：品牌标识、竖线装饰、强调元素
- **鼠尾草绿 `#8BAA7D`**：辅助色、自然/疗愈语境

#### 背景色
- **内容区**：绢轴色渐变 `#F0E4CE → #F5E8D2`
- **Hero 区**：自然风景背景图 + 深琥珀色渐变遮罩
- **禁止**：纯黑背景遮罩（应使用 `rgba(30,20,10,...)` 暖色调）

#### 文字色
- **主文字**：`#3A3028`（温暖深棕，非纯黑）
- **次要文字**：`rgba(58, 48, 40, 0.65)`
- **辅助文字**：`rgba(58, 48, 40, 0.45)`
- **反色文字**：Hero 区白色 + 三层 text-shadow

### 2. 立体感与边框

**核心原则**：用阴影营造立体感，不用明显边框。

```css
/* 正确：阴影 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

/* 错误：边框 */
border: 1px solid rgba(255, 255, 255, 0.3);
```

**例外**：Hero 区的弧线装饰（GuideButton）使用细 border 线条是有意为之的设计元素。

### 3. 圆角策略

- **标准内容卡片**：`--radius-lg`（32rpx ≈ 16px）
- **大型特色卡片**（DailyWisdom、Featured）：`--radius-xl`（40rpx ≈ 20px）
- **内容区与 Hero 区过渡**：28rpx 圆角
- **避免**：过大圆角造成"气泡感"

### 4. 字体策略

- **宋体**（`'Noto Serif SC', serif`）：节气名、区块标题、金句语录、品牌文字
- **系统字体**：正文、描述、辅助信息
- **字重克制**：主要使用 300（Light）和 400（Normal），很少用 500+

### 5. 白色文字可读性

Hero 区白色文字在亮色背景图上的三层保障：
1. **渐变遮罩**：深琥珀色 `rgba(30,20,10,0.32)` 顶部压暗
2. **文字阴影**：三层 text-shadow（近距、中距、远距光晕）
3. **遮罩透明度**：从 0.45 降到 0.32，让背景图更亮的同时仍保证文字可读

---

## 技术规范

### 1. 750px 设计基准

所有尺寸基于 750px 设计稿，使用 `--rpx` 响应式单位：
```css
--rpx: calc(100vw / 750);
/* 使用方式：calc(var(--rpx) * 设计稿px值) */
```

详见 `/RESPONSIVE_SYSTEM.md`

### 2. 滚动条隐藏

全局隐藏滚动条，保持视觉简洁。已在 `theme.css` 中全局设置：
```css
* { scrollbar-width: none; }
*::-webkit-scrollbar { display: none; }
```

### 3. 毛玻璃效果

- 谨慎使用，小程序兼容性有限
- 底部导航栏已改用纯半透明背景 `rgba(50, 43, 32, 0.55)`
- Hero 区玻璃卡片使用 `backdrop-blur-md`（12px）
- 呼吸圆环使用 `backdrop-blur-2xl`（40px）

### 4. 动画

- 呼吸动画使用 `inset: 0; margin: auto` 居中，避免 transform 与动画冲突
- 所有 @keyframes 定义在对应组件内（非全局）
- 动画要克制、自然
- Header 吸顶过渡阈值 90vh（内容页顶部接近 Header 区域时触发）

### 5. 配置与组件分离

- 文本、图片 URL、图标、样式常量 → `config/` 目录
- 组件内不硬编码配置数据
- 方便跨组件复用，方便对接 API

---

## 组件设计原则

### 组件化标准
- 出现 **2次及以上** → 抽离为共享组件
- 有明确**独立功能** → 抽离为组件
- 可通过 **Props 定制** → 支持灵活配置

### 组件层级
1. **原子组件**（shared/）：SectionTitle、Avatar、GlassCard 等
2. **复合组件**（hero/、content/）：由原子组件组合而成
3. **页面组件**（pages/）：纯组装层，只导入组件和配置

### 不过度封装
- 只用一次的特殊布局不必抽组件
- 过于简单的元素（单个 div）不必抽组件
- 封装粒度要在"复用价值"和"理解成本"之间平衡

---

## 设计决策记录

### 为什么用暖琥珀色而非冷蓝紫？
早期使用冷色调（蓝紫 `#8B9FDE`），后调整为暖琥珀金 `#C49A6C`，因为：
1. 暖色更符合"回归、温暖、智慧之光"的情感定位
2. 与古纸底色 `#F0E4CE` 和谐统一
3. 与中国传统美学（琥珀、金石）更呼应

### 为什么背景遮罩用深琥珀色而非纯黑？
遮罩颜色从 `rgba(0,0,0,...)` 改为 `rgba(30,20,10,...)`：
1. 纯黑遮罩让画面发灰、冷调
2. 深琥珀色遮罩保持暖色调统一
3. 降低透明度（0.45→0.32）让背景图更亮

### 为什么底部导航不用 backdrop-filter？
从毛玻璃改为纯半透明背景 `rgba(50, 43, 32, 0.55)`：
1. 小程序中 backdrop-filter 兼容性差
2. 减少渲染压力
3. 视觉效果差异不大

### 为什么不用"抽屉"交互？
早期设计使用底部抽屉（向上滑出），后改为「固定首屏 + 内容上滑覆盖」架构：
1. Hero 固定不动，内容页自然上滑覆盖，比抽屉更简洁
2. 内容页圆角透出背景图，保留"卡片浮在风景上"的视觉
3. Header 在内容页接近顶部时自然过渡为吸顶样式，与内容融为一体
4. 小程序环境下实现更简单，无需复杂手势管理

### 为什么 BreathingCircle 用 inset+margin 而非 translate 居中？
CSS animation 的 `transform: scale()` 会覆盖 inline `transform: translate()`：
1. 改用 `inset: 0; margin: auto` 居中
2. 将 `transform` 完全留给动画使用
3. 三层圆环各自独立动画互不干扰

---

## 检查清单

### 新建组件时
- [ ] 是否使用 `config/styles.ts` 中的共享常量？
- [ ] 文本/图片是否放在 config 层而非硬编码？
- [ ] 圆角是否使用 CSS 变量（`--radius-*`）？
- [ ] 是否用阴影而非边框？
- [ ] 注释是否清晰（用途、Props、使用场景）？

### 新建页面时
- [ ] 是否基于 750px 设计基准？
- [ ] 页面是否只负责组装，不含硬编码数据？
- [ ] 是否考虑 TARO 转换兼容性？
- [ ] 宋体字是否只用于标题/金句？

---

## 音频系统设计

### 当前策略：Web Audio API 合成

项目采用**零外部依赖**的音频方案：
- 环境音效（细雨/海浪/山林/清风）和冥想音频（徐/止/定）均由 Web Audio API 在浏览器中实时合成
- 合成短循环片段（10-30秒），由 `loop=true` 循环播放
- 首次合成后缓存 Blob URL，后续调用直接返回

### 音频来源替换路径

配置文件中的音频路径设计为**双模式**：
- 占位路径（`/audio/ambient-rain.mp3` `resolveAudioUrl()` 自动映射为合成音频
- 真实 CDN URL（`https://...`）→ 原样透传，跳过合成器

推荐免费商用音频来源（按优先级排序）：
1. **Pixabay Music** — CC0 协议，无需署名，品质高
2. **Mixkit** — 免费商用，分类清晰
3. **Freesound.org** — 部分 CC0，环境音效丰富

详见 `/src/app/config/audio-sources.ts`。

### 播客音频的特殊性

播客/故事音频为用户原创人声内容，无法用通用音乐库替代，需自行录制或委托创作。

### TARO 转换

Web Audio API 在小程序中不可用，必须使用预录制 mp3 文件 + `wx.createInnerAudioContext()`。

---

## 技术踩坑记录

### CSS transform 与 position: fixed

**问题**：CSS `transform`（包括动画中的）会创建新的 containing block，导致子元素 `position: fixed` 失效。

**影响组件**：PageTransition — 原本使用上滑动画 `translateY`，会导致底部导航栏和吸顶 Header 的 `fixed` 定位失效。

**解决方案**：PageTransition 只使用 `opacity` 淡入动画，完全不用 `transform` 类动画。

### 页面转场规则

- 前进（home → 详情）：opacity 淡入 0.38s
- 返回（详情 → home）：opacity 淡入 0.3s（更快，手感轻盈）
- 通过 `routeKeyRef` 递增强制重新挂载 PageTransition 组件
- 滚动位置恢复使用双重 `requestAnimationFrame` 确保 DOM 就绪

### 触摸区域标准

底部导航栏触摸区域 ≥ 88rpx（约 44px），符合 Apple HIG 和 Material Design 的最小触摸目标规范。

### Toast 提示规范

- 位于底部导航栏上方
- 自动消失（默认 2000ms）
- 淡入上浮 → 持续 → 淡出下沉
- 退出动画 280ms
- 文案风格：`「{功能名}」正在用心打磨中，敬请期待`（统一温柔语气）
- 使用范围已扩展到全部页面：Home（4 个入口）、PodcastDetail（2）、ActivityDetail（1）、OnboardingSolar（1）、OnboardingGuide（1）
- 各页面独立管理 `toastVisible` / `toastMessage` 状态（后续可考虑升级为全局 Toast 管理器）
- **长文本自动换行**：`maxWidth: 85vw` + `wordBreak: break-word`，不使用 `whiteSpace: nowrap`

### BREATH_CYCLE 配置陷阱

**问题**：`BREATH_CYCLE` 是对象 `{ inhale: 4, exhale: 4 }`，但 `ImmersiveBreathingCircle` 组件直接将其当数字用于 CSS 动画时长默认值，生成无效的 `"[object Object]s"` 字符串，导致所有圆环脉动和文字交替动画静止。

**修复**：使用 `BREATH_CYCLE.inhale + BREATH_CYCLE.exhale` 计算完整周期时长。

**教训**：配置对象被解构使用时，必须检查取值路径是否正确。TypeScript 类型检查在模板字面量 `${value}s` 中不会报错（因为 `toString()` 会返回 `"[object Object]"`），需人工或运行时验证。

### 微练习步骤序号对齐

**问题**：PracticeCard 中数字圆圈（rpx(32)）与步骤文字（fontSize rpx(26), lineHeight 1.7）未垂直居中。

**修复**：父容器改为 `items-start`，圆圈添加 `marginTop: rpx(6)` 使圆心与首行文字中心对齐。计算公式：`textLineCenter = fontSize × lineHeight / 2 ≈ rpx(22.1)`，`circleCenter = marginTop + height/2 = rpx(6) + rpx(16) = rpx(22)`。

### SectionTitle 点击区域

**问题**：原实现中 `onMore` 回调绑定在箭头 `<button>` 上，点击区域仅为箭头图标本身（约 40rpx × 40rpx），实际用户会点击整行标题期望触发。

**修复**：将 `onClick` 移至标题行容器 `<div>`，箭头改为 `<span>`（纯展示），整行可点击。同时添加 `role="button"` + `tabIndex` + `onKeyDown` 键盘支持。

### HeroHeader 头像位置

**问题**：Hero 模式下 header 左右内边距均为 48rpx，头像距左边缘偏大，与顶部距离（24rpx）不对称。

**修复**：Hero 模式下左内边距从 48rpx 缩小为 28rpx，吸顶模式保持 48rpx 不变。过渡动画 `padding-left 0.35s ease` 平滑切换。

### flex-grow 子元素的 height: 100% 陷阱

**问题**：StarConstellation 星图容器使用 `flex: 1 1 0` 撑高，内部透视包装层使用 `width: 100%; height: 100%` 继承高度。本地 Chrome DevTools 设备模拟正常，但打包部署到阿里云后在真机 WebView 中星图布局全部挤在一起。

**原因**：CSS 规范中 `height: 100%` 要求父元素有**显式 `height` 属性**才能正确解析。`flex-grow` 撑高的元素没有显式 `height`，Chrome 桌面端的 Flexbox 实现做了兼容处理能正确解析，但部分移动端 WebKit 内核（微信 WebView、系统浏览器等）不会，`height: 100%` 解析为 0 或极小值，导致所有百分比定位的子元素坐标压缩。

**修复**：将 `width: 100%; height: 100%` 替换为 `position: absolute; inset: 0`，父元素添加 `position: relative`。绝对定位子元素基于父元素的**实际渲染尺寸**填充，不依赖 `height` 属性链，跨浏览器兼容性可靠。

**对比**：SolarSystem 太阳系页面未触发此问题，因为其核心容器使用了显式尺寸 `rpx(720) × rpx(720)`，不依赖 `height: 100%` 链。

**规则**：flex-grow 子元素内部需要撑满高度时，**始终使用 `position: absolute; inset: 0`，不用 `height: 100%`**。

---

**更新记录**：
- 2026-02-06：初始创建
- 2026-02-08：全面更新，对齐当前设计语言和组件架构
- 2026-02-09：GlassCard 布局从横排改为纵向居中（文字上+图标下）；数据规范：标题不硬编码省略号，副标题分隔符用中圆点替代全角方括号
- 2026-02-10：新增音频系统设计决策；新增 transform 踩坑记录；新增页面转场规则和触摸区域标准
- 2026-02-10：修复 BREATH_CYCLE 对象误当数字使用的动画 bug；Toast 提示覆盖全部未实现交互入口（头像/箭头/播放/报名/行星节点）；修复微练习步骤序号垂直对齐
- 2026-02-10：SectionTitle 点击区域从箭头扩展为整行；Toast 长文本自动换行（移除 nowrap）；StarConstellation 新增 onStarClick 回调；HeroHeader 头像左移（Hero 模式 paddingLeft 48→28rpx）
- 2026-02-10：修复星图部署后布局错乱（flex-grow + height:100% 在移动端 WebView 不兼容），改用 position:absolute+inset:0；新增踩坑记录