# 元感知平台 2.1 版本 - 技术架构规划

> 创建日期：2026年4月3日
> 状态：规划中

---

## 一、明镜系统迁移计划

### 1.1 背景

明镜系统目前的部署状态：

| 组件      | 当前部署位置              | 目标部署位置                      | 状态      |
| --------- | ------------------------- | --------------------------------- | --------- |
| **后端**  | Vercel + 阿里云轻量服务器 | 阿里云轻量服务器                  | ✅ 已迁移 |
| **前端**  | Vercel                    | 阿里云 OSS (mingjingasi-com-site) | 🔄 待迁移 |
| **HTTPS** | -                         | 阿里云                            | ⏳ 待配置 |

**相关项目**：

| 项目                     | 说明                                 | 仓库路径                                         |
| ------------------------ | ------------------------------------ | ------------------------------------------------ |
| `mingjing-fastapi-proxy` | 明镜后端服务                         | `/Users/chrisdu/Metalife/mingjing-fastapi-proxy` |
| `mingjing-ai-prototype`  | 明镜前端项目                         | `/Users/chrisdu/Metalife/mingjing-ai-prototype`  |
| `ysx-core-ui`            | 元感知核心前端（已集成调用明镜后端） | `/Users/chrisdu/ysx-core-ui`                     |

**相关域名和服务器**：

| 域名/服务                    | 说明                           |
| ---------------------------- | ------------------------------ |
| https://www.mingjingasi.com/ | 明镜域名服务器（阿里云 OSS）   |
| https://www.metamindpt.com/  | 元感知域名服务器（阿里云 OSS） |
| api.xxx（待确认）            | 阿里云轻量服务器 API 域名      |

---

### 1.2 迁移目标

1. **明镜前端**：从 Vercel 迁移到阿里云 OSS，通过 https://www.mingjingasi.com/ 访问
2. **明镜后端**：配置 HTTPS，确保前端可安全调用
3. **前端调用后端**：改为调用阿里云后端服务，保留 Vercel 配置作为开关备用
4. **系统集成**：将明镜系统集成到元感知的明镜模块
5. **UI 对齐**：明镜 UI 风格与主题对齐元感知最新标准

---

## 二、实施步骤

### Phase 1：明镜前端迁移到阿里云

#### 2.1 前端项目打包配置

**目标**：将 `mingjing-ai-prototype` 打包成静态文件，部署到阿里云 OSS

**参考**：与 `ysx-core-ui` 部署方式相同（打包成静态文件，手动上传到 OSS）

**步骤**：

1. **检查当前构建配置**
   - 确认 `mingjing-ai-prototype` 的构建命令和输出目录
   - 确认是否有 Vercel 特定配置需要调整

2. **调整构建配置**
   - 确保构建输出为纯静态文件
   - 配置正确的 `base` 路径（如果需要）
   - 处理路由配置（SPA 需要 404.html 回退）

3. **构建项目**

   ```bash
   npm run build
   # 或
   yarn build
   ```

4. **上传到阿里云 OSS**
   - OSS Bucket: `mingjingasi-com-site`（华东1-杭州）
   - 将构建输出文件上传到 Bucket 根目录
   - 配置 index.html 和 404.html

---

#### 2.2 前端调用后端的改造

**目标**：前端改为调用阿里云后端服务，保留 Vercel 配置作为开关

**原则**：

- ⚠️ **不删除** Vercel 的配置
- 通过**环境变量或开关**控制调用哪个后端
- 默认调用阿里云后端

**实施方案**：

```typescript
// 环境变量配置示例
// .env.production（阿里云）
VITE_API_BASE_URL=https://api.mingjingasi.com  // 阿里云后端
VITE_USE_ALIYUN_BACKEND=true

// .env.vercel（Vercel 备用）
VITE_API_BASE_URL=https://xxx.vercel.app
VITE_USE_ALIYUN_BACKEND=false
```

```typescript
// API 配置示例（保留开关）
const API_CONFIG = {
  aliyun: {
    baseUrl:
      import.meta.env.VITE_ALIYUN_API_URL || "https://api.mingjingasi.com",
  },
  vercel: {
    baseUrl: import.meta.env.VITE_VERCEL_API_URL || "https://xxx.vercel.app",
  },
};

// 通过开关控制
const useAliyun = import.meta.env.VITE_USE_ALIYUN_BACKEND !== "false";
export const API_BASE_URL = useAliyun
  ? API_CONFIG.aliyun.baseUrl
  : API_CONFIG.vercel.baseUrl;
```

**注意**：

- Core UI 项目已经在调用阿里云的明镜后端服务
- 可参考 Core UI 中的调用方式

---

### Phase 2：明镜后端 HTTPS 配置

#### 2.3 阿里云轻量服务器 HTTPS 配置

**背景**：明镜后端已部署到阿里云轻量服务器，但 HTTPS 尚未配置

**步骤**：

1. **申请 SSL 证书**
   - 阿里云免费 SSL 证书（DV 单域名）
   - 或购买付费证书

2. **配置域名解析**
   - 将 API 域名（如 api.mingjingasi.com）解析到轻量服务器

3. **服务器配置 SSL**
   - Nginx 配置 SSL 证书
   - 配置 HTTPS 重定向

4. **验证**
   - 确保 https://api.mingjingasi.com 可正常访问
   - 确保 CORS 配置正确

---

### Phase 3：系统集成

#### 2.4 明镜集成到元感知

**前提条件**：

- ✅ 明镜前端部署到阿里云 OSS
- ✅ 明镜前端调用阿里云后端
- ✅ 明镜后端 HTTPS 配置完成

**集成方式**：

在元感知系统中进入明镜模块时，调用明镜系统

**方案选择**：

| 方案   | 说明                       | 优点           | 缺点         |
| ------ | -------------------------- | -------------- | ------------ |
| iframe | 通过 iframe 嵌入明镜前端   | 简单、隔离性好 | 通信复杂     |
| 微前端 | 使用 qiankun 等微前端框架  | 更好的集成体验 | 配置复杂     |
| 组件化 | 将明镜核心组件抽取到共享库 | 最佳体验       | 改造工作量大 |
| 跳转   | 从元感知跳转到明镜独立站点 | 最简单         | 体验割裂     |

**建议**：先采用 iframe 或跳转方案快速实现，后续再优化

---

### Phase 4：UI 风格对齐

#### 2.5 明镜 UI 改造

**时机**：在明镜与元感知集成完成后

**目标**：明镜 UI 风格与主题对齐元感知最新标准

**对齐内容**：

| 项目     | 说明                   |
| -------- | ---------------------- |
| 色彩     | 对齐元感知色彩规范     |
| 字体     | 对齐元感知字体规范     |
| 组件风格 | 对齐元感知组件设计规范 |
| 交互     | 对齐元感知交互规范     |

---

## 三、阿里云 OSS 部署说明

### 3.1 元感知 OSS Bucket

- **Bucket**: `metamindpt-com-site`
- **域名**: https://www.metamindpt.com/
- **部署方式**: 静态文件手动上传

### 3.2 明镜 OSS Bucket

- **Bucket**: `mingjingasi-com-site`（华东1-杭州）
- **域名**: https://www.mingjingasi.com/
- **当前文件**: `404.html`, `index.html`
- **部署方式**: 静态文件手动上传（与元感知相同）

### 3.3 静态文件部署流程

```bash
# 1. 构建项目
npm run build

# 2. 上传到 OSS
# 方式一：阿里云控制台手动上传
# 方式二：ossutil 命令行工具
ossutil cp -r ./dist/ oss://mingjingasi-com-site/ --update

# 3. 配置默认首页和 404 页面
# 在 OSS 控制台 -> 基础设置 -> 静态页面 中配置
```

---

## 四、待确认事项

| 事项                        | 状态   | 说明                                      |
| --------------------------- | ------ | ----------------------------------------- |
| 阿里云 API 域名具体是什么？ | 待确认 | 需要确认轻量服务器的 API 域名             |
| 明镜前端项目的构建配置      | 待检查 | 需要检查 mingjing-ai-prototype 的构建配置 |
| 明镜前端当前调用后端的方式  | 待检查 | 需要检查当前的 API 调用配置               |
| SSL 证书申请方式            | 待确认 | 免费证书还是付费证书                      |

---

## 五、任务清单

### 5.1 明镜前端迁移

- [ ] 检查 `mingjing-ai-prototype` 构建配置
- [ ] 调整构建配置适配阿里云 OSS 部署
- [ ] 添加后端调用开关（Vercel/阿里云）
- [ ] 默认配置为调用阿里云后端
- [ ] 构建并上传到 OSS

### 5.2 HTTPS 配置

- [ ] 申请 SSL 证书
- [ ] 配置 API 域名解析
- [ ] 服务器配置 SSL
- [ ] 验证 HTTPS 访问

### 5.3 系统集成

- [ ] 确定集成方案（iframe/跳转/微前端）
- [ ] 在元感知明镜模块实现集成
- [ ] 测试集成效果

### 5.4 UI 对齐

- [ ] 分析元感知最新 UI 规范
- [ ] 明镜 UI 改造计划
- [ ] 实施 UI 改造

---

_文档版本：v1.0_
_创建日期：2026年4月3日_
_状态：规划中_
