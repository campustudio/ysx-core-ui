# 工程开发指南

> 快速上手 + 部署指南

---

## 一、项目概览

**元感知**React + Tailwind CSS 开发。

**技术定位**：

- Web 主平台（核心）
- PWA 支持（移动端类原生体验）
- 未来扩展：微信小程序、原生 App

**视觉关键词**：琥珀金 + 鼠尾草绿 + 古纸底色 + 宋体点睛 + 节气时辰

---

## 二、技术栈

| 类别    | 选型                   |
| ------- | ---------------------- |
| 框架    | React 18 + TypeScript  |
| 构建    | Vite 6                 |
| UI 组件 | shadcn/ui + Radix UI   |
| 样式    | TailwindCSS 4          |
| 路由    | React Router 7         |
| 动画    | Motion (Framer Motion) |

---

## 三、项目结构

```
src/app/
├── pages/               # 页面组装层
├── config/              # 配置层（数据与组件分离）
│   ├── calendar.ts      # 节气 + 时辰
│   ├── images.ts        # 图片 URL
│   ├── icons.tsx        # 自绘 SVG 图标
│   ├── home-data.ts     # 首页数据
│   └── styles.ts        # 共享样式常量
├── components/
│   ├── shared/          # 原子组件
│   ├── hero/            # Hero 区组件
│   ├── content/         # 内容区组件
│   └── navigation/      # 导航组件
└── styles/theme.css     # 设计系统 tokens
```

---

## 四、本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 五、阿里云 OSS 部署

### 5.1 前置条件

- ossutil 已安装
- RAM 用户已创建并授权 `AliyunOSSFullAccess`

### 5.2 配置 ossutil

```bash
ossutil64 config
# Endpoint: oss-cn-hangzhou.aliyuncs.com
# AccessKeyID: 你的 AK ID
# AccessKeySecret: 你的 AK Secret
```

### 5.3 部署命令

```bash
# 一键构建并部署
pnpm deploy
```

### 5.4 常用命令

```bash
# 查看 bucket 文件列表
ossutil64 ls oss://metamindpt-com-site/

# 上传整个目录（覆盖）
ossutil64 cp -r deploy/ oss://metamindpt-com-site/ -f
```

---

## 六、开发规范

### 6.1 不要做的事

- ❌ 修改 `/src/app/components/figma/ImageWithFallback.tsx`（受保护）
- ❌ 删除 `/src/app/components/ui/` 下的 shadcn 组件
- ❌ 在组件里硬编码文本/图片（放在 config 层）
- ❌ 使用纯黑色遮罩（用深琥珀色）

### 6.2 设计原则

- 出现 2 次以上 → 做成共享组件
- 用阴影不用边框
- 宋体只用于标题/金句
- 白色文字加三层 text-shadow
- 基于 750px 设计基准

---

## 七、页面架构

### 首页：固定首屏 + 内容上滑覆盖

- Hero 区 `position: fixed` 固定不动
- 内容页从底部自然上滑覆盖 Hero
- Header 吸顶阈值 90vh

### 底部导航

四个自绘 SVG 图标：

1. 首页（湖心亭）
2. 人类手册（古卷轴）
3. 新人生之路（先天八卦）
4. 明镜（太极）

---

## 八、技术踩坑记录

### CSS transform 与 position: fixed

**问题**：CSS `transform` 会创建新的 containing block，导致子元素 `fixed` 失效。

**解决**：PageTransition 只使用 `opacity` 动画，不用 `transform`。

### flex-grow + height: 100%

**问题**：flex-grow 子元素内部 `height: 100%` 在移动端 WebView 不生效。

**解决**：使用 `position: absolute; inset: 0` 替代。

---

_最后更新：2026-03-21_
