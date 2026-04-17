# 元感知 - AI 协作指南

## 项目身份

这是**元感知**，不是冥想应用，不是"潮汐风格"。
视觉语言：暖琥珀金 `#C49A6C` + 鼠尾草绿 `#8BAA7D` + 古纸底色 `#F0E4CE`。
中国元素"两处点睛 + 一处规划"：节气时辰、宋体字已实现；印章标记规划中。

## 配色策略（按模块区分）

- **首页 / 文章阅读页**：古纸暖色调（`#F0E4CE → #F5E8D2`），宣纸质感
- **人类手册模块**（书籍列表/详情/播放器）：宇宙星空深色主题（`#0B1120 → #111D35`），营造沉浸学习氛围
- **新人生之路模块**（课程列表/圈子社区）：清新现代白底（`#FAFAF7`），圈子头部温暖棕色（`#A07D55`）
- **沉浸呼吸页**：白→浅鼠尾草绿渐变（`#FAFCF9 → #E6F0E2 → #F4F8F2`）
- 不同模块配色差异化，避免全站单调

## 核心规则

- 基于 750px 设计稿标准，使用 `--rpx` 响应式单位
- 用阴影（box-shadow）营造立体感，不用明显 border
- 宋体（`'Noto Serif SC', serif`）只用于标题和金句
- 配置数据（calendar, images, icons, styles, home-data）放在 `config/` 目录，不硬编码在组件中
- 出现 2 次以上的 UI 元素必须抽离为共享组件
- 组件注释要清晰完整，方便其他 AI 理解和转换
- 内容数据中标题不硬编码省略号（`...`），截断由 CSS `line-clamp` 自动处理
- 副标题分隔符用中圆点（`·`），不用全角方括号（`【】`），避免 CJK 标点左对齐偏移

## 文件结构

- 页面组件 → `pages/`（纯组装层）
- 配置数据 → `config/`（calendar, images, icons, styles, home-data）
- 原子组件 → `components/shared/`
- 区域组件 → `components/hero/`, `components/content/`, `components/navigation/`
- 设计 tokens → `styles/theme.css`

## 受保护文件

- `/src/app/components/figma/ImageWithFallback.tsx` — 不可修改
- `/src/app/components/ui/` 下的 shadcn 预生成组件 — 不可删除
- 不要创建 `tailwind.config.js`（使用 Tailwind v4）

## 设计约束

- Hero 区 `position: fixed` 固定不动，内容页从底部上滑覆盖
- Header 吸顶阈值 90vh（内容页接近顶部时触发），与内容页背景融为一体
- Hero 区白色文字必须加三层 text-shadow
- 背景遮罩用深琥珀色 `rgba(30,20,10,...)` 而非纯黑
- 底部导航不使用 backdrop-filter（小程序兼容）
- 动画要克制自然，呼吸动画是品牌标志性交互
- 呼吸圆环用 `inset:0; margin:auto` 居中，不用 translate
- 呼吸圆环文字（收/清）与呼吸动画联动高亮：扩张→收亮，收缩→清亮
- 呼吸圆环文字加反向补偿缩放（textCompensate），视觉上文字大小恒定，只有亮度随呼吸

## 阅读方向策略

- **功能性元素**（卡片入口、导航栏、按钮）→ 现代左→右方向
- **意境性元素**（节气竖排、装饰文字）→ 传统右→左增添古韵
- **循环性元素**（呼吸圆环的收/清）→ 无方向，用动画节奏引导认知
- 三卡片按哲学递进排列：左 徐（慢下来）→ 中 止（停下来）→ 右 定（静下来）

## TARO 转换意识

- `backdrop-filter: blur()` → 小程序用半透明纯色替代
- `writing-mode: vertical-rl` → 需测试小程序兼容性
- CSS 变量 `--rpx` → SCSS 变量 + rpx 单位
- 自绘 SVG 图标 → 可直接转小程序 SVG 组件
- Web Audio API → 小程序不可用，需替换为预录制 mp3 + wx.createInnerAudioContext()

## 音频系统

- 使用 Web Audio API 合成音频（`/src/app/utils/audio-generator.ts`），零外部依赖
- `rpx` 工具函数已集中到 `config/styles.ts`，组件统一 import
- 环境音效（细雨/海浪/山林/清风）和冥想音频（徐/止/定）均为代码合成
- 配置文件中 `audioSrc` 保持占位路径，运行时由 `resolveAudioUrl()` 自动替换为合成 Blob URL
- 升级为真实音频时，将 `audioSrc` 改为 CDN URL 即可，resolveAudioUrl() 原样透传
- 播客音频（人声内容）需单独录制，当前保持为预留状态

## 元感知 2.0 极简美学升级 (冷白主题)

- **排版哲学（阴刻 vs 阳刻）**：全站核心标题、副标题、核心按钮的文字必须统一采用 **"深雕凹陷 (Debossed / 阴刻)"** 质感，摒弃悬浮凸出的阳刻感。实现方案为：深色文字搭配极细的下方白色亮边（模拟下沿受光），如 `text-shadow: 0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)`。
- **材质哲学（高透玻璃）**：核心承载模块（如首页的三块碑）使用类似苹果系统锁屏的极高透毛玻璃质感（Glassmorphism）。背景透明度需极低（如 `rgba(255,255,255,0.1)` 以下），依靠高强度模糊 `blur(30px)+` 和物理切边高光 `border` 来定义体积边界，避免泛白呈现出廉价的"瓷白/亚克力"感。
- **动效哲学（沉降凝结）**：核心元素的入场动画必须带有**"冲击力与厚重感"**。摒弃轻飘飘的向上浮现（ translateY(-10px) ），改为带有失焦到聚焦的"沉降凝结"效果（从稍微放大、带有 `blur` 滤镜的状态向下沉降进入最终位置），动画曲线采用 `cubic-bezier(0.16, 1, 0.3, 1)`。
