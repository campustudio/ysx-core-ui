# 元感知

> 融合现代简约与中国传统美学的身心成长应用

---

## 项目定位

**元感知**核心体验是通过"感知练习"引导用户回到当下。设计语言以"古卷展开"为视觉隐喻，融合节气时辰、宋体字等中国元素点睛。

**技术定位**：

- Web 主平台（核心）
- PWA 支持（移动端类原生体验）
- 未来扩展：微信小程序、原生 App

## 技术栈

| 类别    | 选型                   |
| ------- | ---------------------- |
| 框架    | React 18 + TypeScript  |
| 构建    | Vite 6                 |
| UI 组件 | shadcn/ui + Radix UI   |
| 样式    | TailwindCSS 4          |
| 路由    | React Router 7         |
| 动画    | Motion (Framer Motion) |

## 视觉关键词

**琥珀金** `#C49A6C` + **鼠尾草绿** `#8BAA7D` + **古纸底色** `#F0E4CE` + **宋体点睛** + **节气时辰**

## 项目结构

```
src/app/
├── pages/               # 页面组装层
├── config/              # 配置层（数据与组件分离）
├── components/
│   ├── shared/          # 原子组件
│   ├── hero/            # Hero 区组件
│   ├── content/         # 内容区组件
│   └── navigation/      # 导航组件
└── styles/theme.css     # 设计系统 tokens
```

## 快速开始

```bash
pnpm install
pnpm dev
```

## 文档索引

| 文档                                                                             | 说明         |
| -------------------------------------------------------------------------------- | ------------ |
| [spec/design/ui-design-system.md](spec/design/ui-design-system.md)               | UI 设计系统  |
| [spec/engineering/development-guide.md](spec/engineering/development-guide.md)   | 工程开发指南 |
| [spec/components/components-guide.md](spec/components/components-guide.md)       | 组件架构指南 |
| [spec/overall-technical-roadmap-plan.md](spec/overall-technical-roadmap-plan.md) | 技术路线规划 |

---

**最后更新**：2026-03-21
