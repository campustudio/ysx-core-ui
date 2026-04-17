# 前端整体技术路线规划

> 本文档定义 `ysx-core-ui` 项目的技术定位、扩展策略及 PWA 实施计划。

---

## 一、项目定位

### 1.1 核心定位

`ysx-core-ui` 是平台的**核心前端项目**，承担以下职责：

- **Web 主平台**：部署到阿里云，作为可全球访问的网站
- **移动端优先**：主要面向手机端用户，响应式设计优先考虑移动设备
- **PWA 应用**：支持用户将网站添加到手机桌面，提供类原生 App 体验
- **复用基座**：作为其他端（小程序、原生 App）的页面复用源

### 1.2 技术栈

| 类别    | 技术选型               |
| ------- | ---------------------- |
| 框架    | React 18 + TypeScript  |
| 构建    | Vite 6                 |
| UI 组件 | shadcn/ui + Radix UI   |
| 样式    | TailwindCSS 4          |
| 路由    | React Router 7         |
| 动画    | Motion (Framer Motion) |

---

## 二、多端扩展策略

### 2.1 复用原则

```
┌─────────────────────────────────────────────────────┐
│                  ysx-core-ui (核心)                  │
│         Web 页面 / 组件 / 业务逻辑 / 样式            │
└─────────────────────────────────────────────────────┘
          │              │              │
          ▼              ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │   PWA   │    │ 小程序  │    │原生 App │
    │  (壳)   │    │ (壳)    │    │  (壳)   │
    └─────────┘    └─────────┘    └─────────┘
```

### 2.2 各端职责分工

| 端             | 复用策略                 | 独立开发范围                     |
| -------------- | ------------------------ | -------------------------------- |
| **PWA**        | 完全复用 ysx-core-ui     | Service Worker、Manifest 配置    |
| **微信小程序** | WebView 嵌入核心页面     | 小程序特有 API、分享、支付等     |
| **原生 App**   | Hybrid 模式嵌入 Web 页面 | 需要原生性能的模块（如相机、AR） |

### 2.3 独立开发的场景

以下场景需要在各端单独开发：

- **小程序特有功能**：微信登录、分享卡片、小程序支付
- **原生 App 特有功能**：推送通知、系统权限、端侧 AI 模型
- **高性能要求模块**：复杂动画、实时音视频、AR/VR 交互

---

## 三、PWA 实施计划

### 3.1 PWA 核心能力

| 能力       | 说明                         | 优先级 |
| ---------- | ---------------------------- | ------ |
| 添加到桌面 | 用户可将网站添加到手机桌面   | P0     |
| 全屏启动   | 隐藏浏览器 UI，类原生体验    | P0     |
| 离线访问   | 缓存静态资源，支持离线浏览   | P1     |
| 推送通知   | 系统级消息推送（需用户授权） | P2     |
| 后台同步   | 网络恢复后自动同步数据       | P3     |

### 3.2 当前缺失项

基于当前项目结构，实现 PWA 还需要：

| 缺失项          | 说明                              | 状态          |
| --------------- | --------------------------------- | ------------- |
| `manifest.json` | Web App 清单文件                  | ❌ 缺失       |
| Service Worker  | 离线缓存和推送支持                | ❌ 缺失       |
| App 图标        | 多尺寸图标（192x192, 512x512 等） | ❌ 缺失       |
| HTTPS           | PWA 必须在 HTTPS 下运行           | ⚠️ 部署时配置 |
| Meta 标签       | iOS 兼容性标签                    | ❌ 缺失       |

### 3.3 实施步骤

#### 阶段一：基础配置（1-2 天）

**Step 1: 创建 Web App Manifest**

创建 `public/manifest.json`：

```json
{
  "name": "元感知平台",
  "short_name": "元感知",
  "description": "元感知 × 明镜智慧平台",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

**Step 2: 更新 index.html**

在 `<head>` 中添加：

```html
<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json" />

<!-- iOS 兼容性 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
<meta name="apple-mobile-web-app-title" content="元感知" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

<!-- 主题色 -->
<meta name="theme-color" content="#000000" />
```

**Step 3: 准备应用图标**

创建 `public/icons/` 目录，包含：

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

#### 阶段二：Service Worker（2-3 天）

**Step 4: 安装 Vite PWA 插件**

```bash
pnpm add -D vite-plugin-pwa
```

**Step 5: 配置 vite.config.ts**

```typescript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    // ... 其他插件
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png"],
      manifest: {
        // 可以在这里配置，或使用外部 manifest.json
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24小时
              },
            },
          },
        ],
      },
    }),
  ],
});
```

#### 阶段三：部署与验证（1 天）

**Step 6: 阿里云部署配置**

- 配置 HTTPS 证书（必须）
- 配置 CDN 缓存策略
- 设置正确的 MIME 类型

**Step 7: PWA 验证**

使用 Chrome DevTools > Application > Manifest 验证：

- ✅ Manifest 正确加载
- ✅ Service Worker 已注册
- ✅ 图标正确显示
- ✅ "添加到主屏幕" 可用

使用 Lighthouse 进行 PWA 审计，确保评分达标。

### 3.4 iOS 特殊处理

iOS Safari 对 PWA 支持有限，需要额外处理：

```html
<!-- iOS 启动画面 -->
<link
  rel="apple-touch-startup-image"
  href="/splash/splash-640x1136.png"
  media="(device-width: 320px) and (device-height: 568px)"
/>
<!-- 更多尺寸... -->

<!-- 隐藏 Safari UI -->
<meta name="apple-mobile-web-app-capable" content="yes" />
```

### 3.5 时间线

| 阶段     | 内容                        | 预计时间   |
| -------- | --------------------------- | ---------- |
| 阶段一   | Manifest + Meta 标签 + 图标 | 1-2 天     |
| 阶段二   | Service Worker + 离线缓存   | 2-3 天     |
| 阶段三   | 部署验证 + iOS 兼容         | 1 天       |
| **总计** |                             | **4-6 天** |

---

## 四、部署策略

### 4.1 阿里云部署架构

```
用户请求 → CDN（阿里云） → OSS（静态资源） → API（后端服务）
```

### 4.2 域名规划

| 用途     | 域名示例                 |
| -------- | ------------------------ |
| Web 主站 | `app.yuansixiang.com`    |
| API 服务 | `api.yuansixiang.com`    |
| 静态资源 | `static.yuansixiang.com` |

---

## 五、后续扩展

### 5.1 小程序集成（Phase 2）

- 使用 WebView 嵌入核心页面
- 小程序原生壳处理登录、分享、支付

### 5.2 原生 App 集成（Phase 3）

- React Native 或 Capacitor 封装
- 原生模块处理系统级功能

---

_最后更新：2026-03-21_
