# 元思想 - 身心成长平台

> 一个以中国哲学时间体系为灵感的身心成长应用。React + Tailwind CSS 开发，目标转换为 TARO 框架适配微信小程序和 H5。

## 项目定位

**元思想**是一个身心成长平台，核心体验是通过"感知练习"引导用户回到当下。设计语言融合现代简约与中国传统美学，以"古卷展开"为视觉隐喻。

## 视觉风格

- **色彩体系**：暖琥珀金 `#C49A6C` + 鼠尾草绿 `#8BAA7D`
- **底色**：绢轴/古纸色 `#F0E4CE → #F5E8D2`（营造纪元感）
- **字体**：思源宋体（标题/金句）+ 系统无衬线字体（正文）
- **中国元素**："两处点睛 + 一处规划" —— 节气时辰、宋体字已实现；印章标记规划中

## 首页架构

单页垂直滚动，隐喻"向下滚动 = 向内探索"：

1. **Hero 区（首屏）**：全屏背景图（固定不动）+ 24节气十二时辰 + 呼吸引导圆环（收/清联动高亮）+ 三卡片入口（徐/止/定，左→右递进，纵向布局：文字在上图标在下）
2. **内容页**：上滑覆盖 Hero，圆角透出背景图；包含语录、推荐、内容区块、公告
3. **交互**：向上滑动揭开内容页，内容页接近顶部时 Header 过渡为吸顶样式与内容融为一体

## 项目结构

```
src/app/
├── App.tsx                          # 应用入口
├── pages/
│   └── Home.tsx                     # 首页（纯组装层，含交互入口预留）
├── config/                          # 配置层（数据与组件分离）
│   ├── calendar.ts                  # 24节气 + 十二时辰数据与计算
│   ├── images.ts                    # 所有图片 URL
│   ├── icons.tsx                    # 自绘 SVG 图标集合
│   ├── home-data.ts                 # 首页内容数据
│   └── styles.ts                    # 共享样式常量
├── components/
│   ├── shared/                      # 原子级复用组件
│   │   ├── SectionTitle.tsx         # 琥珀竖线区块标题
│   │   ├── Avatar.tsx               # 头像按钮
│   │   ├── GlassCard.tsx            # 毛玻璃卡片
│   │   ├── GuideButton.tsx          # 问道按钮（弧线+呼吸动画）
│   │   └── ScrollHint.tsx           # 滚动提示（觉知+箭头）
│   ├── hero/                        # Hero 区组件组
│   │   ├── HeroBackground.tsx       # 背景图层+渐变遮罩
│   │   ├── HeroHeader.tsx           # 顶部栏（吸顶切换）
│   │   ├── SolarTermDisplay.tsx     # 节气时辰显示（竖排/横排）
│   │   ├── BreathingCircle.tsx      # 呼吸引导圆环（三层动画）
│   │   └── JourneyCards.tsx         # 三卡片入口（止/徐/定）
│   ├── content/                     # 内容区组件组
│   │   ├── DailyWisdomCard.tsx      # 每日智慧语录
│   │   ├── FeaturedCard.tsx         # 精选推荐大卡片
│   │   ├── SectionBlock.tsx         # 区块（标题+卡片网格/滚动）
│   │   ├── ContentCard.tsx          # 内容小卡片（图片+标题）
│   │   └── AnnouncementCard.tsx     # 官方公告
│   ├── navigation/
│   │   └── BottomNavigation.tsx     # 底部导航栏（4个自绘图标）
│   ├── ui/                          # shadcn/ui 预生成组件（受保护）
│   └── figma/                       # Figma 导入组件（受保护）
└── styles/
    ├── theme.css                    # 设计系统 tokens（CSS 变量）
    ├── fonts.css                    # 字体导入
    ├── index.css                    # 入口样式
    └── tailwind.css                 # Tailwind 配置
```

## 技术栈

| 当前开发环境 | 目标环境 |
|-------------|---------|
| React 18.3.1 | TARO 框架 |
| Tailwind CSS v4 | SCSS |
| Lucide React（图标） | 自绘 SVG / iconfont |
| CSS 变量（rpx 响应式） | 微信小程序 + H5 |

## 设计系统

所有 tokens 定义在 `/src/styles/theme.css`，基于 750px 设计基准。

详细文档：
- `/DESIGN_SYSTEM.md` — 设计系统完整规范
- `/DESIGN_PRINCIPLES.md` — 设计原则与决策记录
- `/COMPONENTS.md` — 组件架构与使用指南
- `/RESPONSIVE_SYSTEM.md` — 750px 响应式系统说明

## 底部导航

四个自绘 SVG 图标（不使用 lucide）：
1. **首页**：湖心亭（双层弧顶+水波纹）
2. **人类手册**：古卷轴（天杆地杆+甲骨文"元"字）
3. **新人生之路**：先天八卦（8组三爻）
4. **明镜**：太极（S曲线+阴阳点）

## TARO 转换注意

1. `backdrop-filter: blur()` → 小程序需用半透明纯色替代
2. `lucide-react` → 已大量使用自绘 SVG，迁移成本低
3. CSS 变量 `--rpx` → SCSS 变量 + rpx 单位
4. `writing-mode: vertical-rl` → 小程序兼容性需测试
5. 所有配置数据已抽离到 `config/` 目录，便于对接 API

---

**最后更新**：2026-02-10
**当前版本**：v2.1