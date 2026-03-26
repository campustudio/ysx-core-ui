# 元思想平台 2.0 版本规划

> 更新日期：2026年3月25日
> 核心目标：**优先开发"新人生之路"模块，替代小鹅通（鹅圈子）**

---

## 一、核心指示（来自先明老师 2026.3.23）

重点开发**新人生之路**主线，让学员能在此平台学习内容：

- 必须比小鹅通更高级、更丝滑、更好用
- 体验满意后向学员开放，同时下架小鹅通
- **人类手册等其他板块暂缓，不着急**

---

## 二、优先级规划

### P0 - 立即执行：微信公众号集成调研 ✅ 已完成

**目标**：确认技术可行性，打通用户身份

- [x] 获取微信公众号管理后台操作权限（已获取）
- [x] 调研将元思想网站H5页面集成到公众号菜单的流程（见第六章）
- [x] 调研微信用户身份同步方案（见第六章）：
  - 公众号内打开H5时通过OAuth授权获取用户身份
  - 需要配置网页授权域名
  - OAuth授权流程已明确
- [x] 用户痛点问卷已发放（200+回复收集中）
- [x] 汇报文档已发群

---

### P1 - 最小闭环MVP

**目标**：最快速落地可用产品，用户能正常学习

#### 核心功能

1. **用户模块**
   - 微信身份同步登录（公众号内免登录）
   - 基本用户信息展示

2. **课程模块**
   - 后台上传课程（音频为主）
   - 课程列表展示
   - 音频播放功能
   - **学习状态与进度记录**
   - 下次进入时显示上次学习位置，支持继续学习

#### 开发原则

> "最小闭环 → 线上可用 → 迭代扩展"
> 先搭建基础设施上线，再逐步加东西、改东西、优化

---

### P2 - 小鹅通调研与痛点改善

#### 调研步骤（海龙规划）

1. 研究小鹅通的设计与交互，总结功能点
2. 收集用户使用痛点（调查问卷/微信群询问）
3. 列出问题点及对应改善方案
4. 加入自身平台特色功能与风格

#### 已知用户痛点（来自小芳）

| 问题         | 描述                           | 改善方向                              |
| ------------ | ------------------------------ | ------------------------------------- |
| 自动播放失效 | 顺序播放设置后实际不跳转下一节 | 实现可靠的章节自动连播                |
| 标签内容过多 | 年龄大的用户看不清、分不清     | 后台可配置重点/弱化显示，视觉层级区分 |

#### 用户群体特征

- **年龄分布**：40-60岁，50岁左右占多数
- **设备分布**：安卓手机为主（华为、小米、OPPO、vivo），苹果较少
- **技术要求**：尽量少用新语法特性，以传统语法为主（尤其CSS）

#### 痛点收集方式

- 新人生之路目前有5个微信班级群
- 待定：调查问卷 vs 群内直接询问（需与倪明讨论）

---

### P3 - 功能扩展（后续迭代）

在MVP基础上逐步扩展：

- 课程分类与子菜单
- 内容Tab分类
- 圈子功能
- 动态模块
- 消息模块
- 商城模块（注意微信支付H5支持度）
- 人类手册（后续再开发）

---

## 三、管理后台初步设计

### 数据模块

| 模块     | 功能                                       |
| -------- | ------------------------------------------ |
| 用户模块 | 微信身份绑定、用户信息管理                 |
| 课程模块 | 课程基础数据、音频/视频上传、学习状态/进度 |
| 动态模块 | 用户动态管理                               |
| 消息模块 | 系统消息、通知管理                         |
| 商城模块 | 订单管理、支付集成                         |

### 待调研

- 小鹅通H5管理后台系统（需获取账号查看分析）

---

## 四、执行计划

> **原则**：先完成H5网站MVP，再集成公众号；先用测试号验证，再接入正式服务号

### 阶段1：MVP-v0.1 用户模块（最小闭环，优先落地）

**目标**：跑通「公众号菜单 → H5页面 → 微信授权 → 用户身份记录」全流程

```
1.1 后端开发
    ├─ 用户表设计（openid、昵称、头像、创建时间等）
    ├─ OAuth接口：code换取openid
    └─ 用户信息接口：获取/更新用户信息
       ↓
1.2 前端开发
    ├─ 授权回调处理（获取code、调用后端接口）
    ├─ 用户信息展示页面
    └─ "平台开发中，敬请期待"提示页面
       ↓
1.3 测试号验证
    └─ 完整流程：关注测试号 → 点菜单 → 授权 → 显示用户信息
```

**v0.1交付物**：

- 用户进入后能看到自己的微信头像、昵称
- 页面提示"元思想学习平台开发中，敬请期待"
- 后台数据库已记录用户openid

---

### 阶段1.5：MVP-v0.2 课程模块（核心功能）

**目标**：用户能播放音频课程、记录学习进度

```
1.5.1 云存储
    └─ 音频文件上传到云平台（阿里云OSS/腾讯云COS）
       ↓
1.5.2 管理后台
    ├─ 课程创建/编辑（标题、封面、描述）
    ├─ 章节管理（音频上传、排序）
    └─ 课程发布/下架
       ↓
1.5.3 后端开发
    ├─ 课程表、章节表设计
    ├─ 学习进度表（用户+章节+播放位置+完成状态）
    ├─ 课程列表/详情接口
    └─ 学习进度记录/恢复接口
       ↓
1.5.4 前端开发
    ├─ 课程列表页
    ├─ 课程详情页（章节列表）
    ├─ 音频播放器（进度条、倍速、上下章）
    └─ 继续学习入口
       ↓
1.5.5 测试验证
    └─ 用户能正常播放 → 退出 → 再进入继续播放
```

### 阶段2：正式服务号集成

```
2.1 获取正式服务号权限
    ├─ AppID、AppSecret
    └─ 管理后台访问权限
       ↓
2.2 配置正式环境
    ├─ 网页授权域名配置
    └─ 部署域名验证文件
       ↓
2.3 菜单配置（不发布）
    └─ 添加菜单项，仅内部可见
       ↓
2.4 白名单测试
    └─ 指定测试用户先行验证
       ↓
2.5 MVP-v0.1上线
    └─ 发布菜单，用户可访问"开发中"页面
       ↓
2.6 MVP-v0.2上线
    └─ 课程模块完成后更新，用户可正常学习
```

### 微信测试环境说明

| 方案       | 用途     | 说明                          |
| ---------- | -------- | ----------------------------- |
| 测试号     | 开发阶段 | 无需认证，可测试OAuth全部接口 |
| 菜单不发布 | 集成阶段 | 配置好但不发布，仅开发者可见  |
| 白名单     | 上线前   | 指定微信号先行测试            |

---

## 五、微信公众号集成技术方案

### 集成方式

在服务号管理后台「自定义菜单」中添加菜单项，类型选择「跳转网页」，填入H5链接。

**前置条件**：

- 必须是**已认证的服务号**
- 链接必须是**HTTPS**（当前网站 https://www.metamindpt.com 已满足）

### 微信用户身份同步（OAuth授权）

#### 两种授权方式

| 方式                | scope             | 用户体验         | 获取信息         |
| ------------------- | ----------------- | ---------------- | ---------------- |
| 静默授权（推荐MVP） | `snsapi_base`     | 无感知，自动跳转 | 仅openid         |
| 用户授权            | `snsapi_userinfo` | 弹出确认页面     | openid+昵称+头像 |

#### 技术流程

```
用户点击服务号菜单
       ↓
跳转授权URL（带redirect_uri）
       ↓
微信回调到H5，带code参数
       ↓
后端用code换取access_token和openid
       ↓
用openid标识用户身份，存入数据库
```

#### 菜单链接格式

```
https://open.weixin.qq.com/connect/oauth2/authorize
  ?appid=您的服务号APPID
  &redirect_uri=https://www.metamindpt.com/app/index.html
  &response_type=code
  &scope=snsapi_base
  &state=STATE
  #wechat_redirect
```

### 配置Checklist

| 条件         | 说明                                                   |
| ------------ | ------------------------------------------------------ |
| 认证服务号   | 必须是已认证的服务号，订阅号不支持OAuth                |
| 网页授权域名 | 在公众号后台「设置」→「功能设置」→「网页授权域名」添加 |
| 域名验证文件 | 下载txt文件放到网站根目录验证                          |
| 后端接口     | 需开发code换取openid的接口                             |

### 微信公众号测试号（不是小程序测试号）

> ⚠️ 注意：小程序测试号与公众号测试号是两种不同的东西，我们需要的是**公众号测试号**

#### 申请方式

**直接入口**（推荐）：

```
https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index
```

用微信扫码即可申请，无需依赖任何已有公众号。

**备用方式**：

1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入「开发」→「开发者工具」菜单
3. 选择「公众平台测试账号」

#### 测试号管理页面说明

申请成功后会看到以下模块：

| 模块               | 说明              | 是否需要配置                        |
| ------------------ | ----------------- | ----------------------------------- |
| **测试号信息**     | appID + appsecret | ✅ 记录保存，开发时使用             |
| **接口配置信息**   | URL + Token       | ❌ 暂不需要（用于接收微信消息推送） |
| **JS接口安全域名** | 域名配置          | ❌ 暂不需要（用于调用JSSDK）        |
| **测试号二维码**   | 扫码关注测试号    | ✅ 需要扫码关注才能测试             |
| **模板消息接口**   | 模板消息配置      | ❌ 暂不需要                         |
| **体验接口权限表** | 各接口权限列表    | 📖 仅供参考，无需操作               |

#### 我们需要用到的接口

从「体验接口权限表」中，我们主要用到：

| 接口                         | 用途                        | 调用限制  |
| ---------------------------- | --------------------------- | --------- |
| **网页授权获取用户基本信息** | OAuth获取openid、头像、昵称 | 无上限    |
| **获取access_token**         | 调用其他接口的凭证          | 2000次/日 |
| **自定义菜单**               | 配置底部菜单跳转H5          | 详情查看  |

#### 配置网页授权域名（关键步骤）

在「体验接口权限表」→「网页服务」→「网页授权获取用户基本信息」右侧点击「修改」：

1. 填写授权回调域名（不带http://）
2. 测试号支持IP地址，如：`192.168.1.100:3000`
3. 正式环境必须用已备案域名

**我们的域名**：`www.metamindpt.com`

#### 测试号与正式服务号的区别

| 对比项   | 测试号       | 正式服务号     |
| -------- | ------------ | -------------- |
| 申请门槛 | 微信扫码即可 | 需企业认证     |
| 域名要求 | 支持IP地址   | 必须已备案域名 |
| 接口权限 | 完整         | 完整           |
| 用户关注 | 最多20人     | 无限制         |
| 用途     | 开发测试     | 正式上线       |

#### 开发测试流程

```
1. 扫码关注测试号（测试号二维码）
2. 配置网页授权域名
3. 开发OAuth接口（使用测试号的appID和appsecret）
4. 在测试号内点击菜单或链接触发授权
5. 验证获取用户信息流程
6. 测试通过后，切换为正式服务号配置上线
```

---

## 六、用户痛点调查问卷

### 问卷平台

**腾讯问卷**（https://wj.qq.com）

- 类型选择：**调查**
- 完全免费，无条数限制
- 微信内可直接打开
- 后台数据统计图表完善
- 支持导出Excel

### 问卷设计原则

针对**50岁左右用户**：

- 题目不超过8-10题
- 以**选择题为主**，减少填空
- 字体大、选项清晰
- 问题直白，避免专业术语
- 选项尽量多，减少用户输入

### 问卷内容

```
【元思想学习平台体验调研】

亲爱的学员，您好！
我们正在开发新的学习平台，希望听到您的真实反馈，帮助我们做得更好。

━━━━━━━━━━━━━━━━━━━━━━

1. 您使用小鹅通（鹅圈子）学习时，遇到过哪些问题？【多选】
   □ 课程播放完不会自动跳到下一节
   □ 需要手动点击才能播放下一课
   □ 页面内容太多，看不清重点
   □ 字太小，看不清楚
   □ 找不到上次学习的位置
   □ 不知道自己学到哪里了
   □ 播放卡顿或加载慢
   □ 操作复杂，不知道怎么用
   □ 搜索功能不好用
   □ 消息通知太多或太少
   □ 没有遇到问题
   □ 其他（请具体描述您遇到的问题）：______________

2. 您最希望改进的有哪些？【多选】
   □ 能自动连续播放课程
   □ 页面更简洁清晰
   □ 字体更大更清楚
   □ 方便找到上次学到的地方
   □ 播放更流畅不卡顿
   □ 操作更简单易懂
   □ 课程分类更清晰
   □ 能看到学习进度
   □ 提醒功能更贴心
   □ 其他（请描述您的期望）：______________

3. 您平时主要学习哪些课程？【多选】
   □ 新人生之路
   □ 人类手册
   □ 感知践行手册
   □ 感知的生活十堂践行课
   □ 生命的真相
   □ 新宇宙观
   □ 王先明老师直播回放
   □ 冥想/觉知冥想
   □ 其他（请填写课程名称）：______________

4. 您目前使用的手机品牌是？【单选】
   □ 华为
   □ 小米
   □ OPPO
   □ vivo
   □ 荣耀
   □ 苹果(iPhone)
   □ 三星
   □ 其他（请填写品牌名称）：______________

5. 您的手机型号是？【选填，尽量填写，您的善举可以帮助平台更好地提升用户使用体验】
   （例如：华为Mate60、小米14、iPhone15等，
   可在手机"设置-关于手机"中查看）
   ______________________________________________

6. 您对新平台有什么期待或建议？【选填】
   （欢迎写下您的任何想法）
   ______________________________________________
   ______________________________________________
   ______________________________________________

━━━━━━━━━━━━━━━━━━━━━━
感谢您的反馈！🙏
```

### 问卷使用方式

1. **微信群直接发问卷链接**
2. **集成到MVP-v0.1**：在"开发中"页面加按钮"帮我们做得更好→填写问卷"

---

## 七、用户模块设计（明镜后端融合方案）

> 更新日期：2026年3月25日
> 后端项目：`/Users/chrisdu/Metalife/mingjing-fastapi-proxy`

### 明镜后端现有架构分析

#### 技术栈

| 组件   | 技术选型                |
| ------ | ----------------------- |
| 框架   | FastAPI (Python)        |
| 数据库 | MongoDB (motor异步驱动) |
| 认证   | JWT (python-jose)       |
| 部署   | Vercel / Docker         |

#### 现有数据库集合

```
mingjing_db/
├── users         # 用户表
├── sessions      # 会话表
├── messages      # 消息表
└── memories      # 记忆表
```

#### 现有users表结构

```python
{
    "_id": ObjectId,
    "username": str,           # 用户名（明镜登录用）
    "username_lower": str,     # 小写用户名（唯一索引）
    "created_at": datetime,    # 创建时间
    "last_login_at": datetime, # 最后登录时间
    "auth_method": "quick",    # 认证方式
}
```

#### 现有认证方式

| 方式              | 说明                              |
| ----------------- | --------------------------------- |
| **quick_login**   | 用户名登录，自动创建用户，返回JWT |
| **PURE_AUTH模式** | 不依赖数据库，直接签发临时令牌    |
| **JWT**           | 7天有效期，包含user_id和username  |

#### 现有API端点

| 端点                       | 说明             |
| -------------------------- | ---------------- |
| `POST /auth/quick_login`   | 用户名登录       |
| `GET /v1/sessions`         | 获取用户会话列表 |
| `POST /v1/sessions`        | 创建会话         |
| `GET /v1/chat/completions` | AI对话           |

---

### 元思想用户模块需求

| 功能              | 说明                           |
| ----------------- | ------------------------------ |
| **微信OAuth登录** | 通过openid识别用户             |
| **微信用户信息**  | 获取头像、昵称                 |
| **用户身份统一**  | 同一用户在明镜和元思想共享身份 |

---

### 融合方案：扩展现有users表

**原则**：在现有用户表基础上增加微信相关字段，不破坏明镜已有功能

#### 扩展后的users表结构

```python
{
    "_id": ObjectId,

    # === 明镜原有字段（保持不变）===
    "username": str,           # 用户名
    "username_lower": str,     # 小写用户名（唯一索引）
    "created_at": datetime,    # 创建时间
    "last_login_at": datetime, # 最后登录时间
    "auth_method": str,        # "quick" | "wechat"

    # === 元思想新增字段 ===
    "wx_openid": str,          # 微信openid（服务号维度，唯一索引）
    "wx_unionid": str,         # 微信unionid（可选，跨平台统一身份）
    "wx_nickname": str,        # 微信昵称
    "wx_avatar_url": str,      # 微信头像URL
    "wx_auth_at": datetime,    # 微信首次授权时间
    "wx_last_auth_at": datetime, # 最近一次授权时间
}
```

#### 新增索引

```python
# core/db_mongo.py 中添加
await _create_index_safe(database["users"], [("wx_openid", 1)],
                         name="wx_openid_unique", unique=True, sparse=True)
```

**说明**：`sparse=True` 表示仅对有值的文档建立索引，明镜用户没有wx_openid不会冲突

---

### 新增API端点设计

#### `POST /auth/wechat_login`

微信OAuth登录接口

**请求**：

```json
{
  "code": "微信授权code"
}
```

**处理流程**：

```
1. 用code换取access_token和openid（调用微信API）
2. 用access_token获取用户信息（昵称、头像）
3. 查找是否已有该openid的用户
   - 有：更新用户信息，更新last_login_at
   - 无：创建新用户
4. 生成JWT返回
```

**响应**：

```json
{
  "access_token": "JWT令牌",
  "token_type": "bearer",
  "user_id": "用户ID",
  "nickname": "微信昵称",
  "avatar_url": "头像URL",
  "is_new_user": true
}
```

#### `GET /v1/user/profile`

获取当前用户信息

**响应**：

```json
{
  "user_id": "...",
  "nickname": "微信昵称",
  "avatar_url": "头像URL",
  "auth_method": "wechat",
  "created_at": "2026-03-25T12:00:00Z"
}
```

---

### 用户身份统一策略

| 场景                       | 处理方式                         |
| -------------------------- | -------------------------------- |
| **新用户（微信首次登录）** | 创建新用户，auth_method="wechat" |
| **老用户（明镜已有账号）** | 可后续支持账号绑定功能           |
| **同一用户多端登录**       | JWT统一身份，session独立         |

---

### 实现文件清单

| 文件                   | 修改内容                   |
| ---------------------- | -------------------------- |
| `core/db_mongo.py`     | 添加wx_openid索引          |
| `auth_routes.py`       | 新增wechat_login端点       |
| `core/wechat_oauth.py` | 新建，微信OAuth工具函数    |
| `main.py`              | 新增/v1/user/profile端点   |
| `.env`                 | 添加WX_APPID、WX_APPSECRET |

---

### 环境变量新增

```bash
# 微信公众号配置
WX_APPID=wx61079aa3f7c3bd14        # 测试号AppID
WX_APPSECRET=bcd7cf4323a9bbeb...   # 测试号AppSecret

# 正式环境切换为服务号配置
# WX_APPID=正式服务号AppID
# WX_APPSECRET=正式服务号AppSecret
```

---

## 八、后端阿里云部署方案

> 更新日期：2026年3月25日

### 📊 部署进度（2026-03-25 21:41 更新）

| 阶段  | 内容                                            | 状态      |
| ----- | ----------------------------------------------- | --------- |
| 阶段0 | 准备工作（SSH/域名解析/防火墙）                 | ✅ 完成   |
| 阶段1 | 环境配置（Python3.11/Nginx/Git/Certbot）        | ✅ 完成   |
| 阶段2 | 项目部署（代码上传/依赖安装/环境变量/测试启动） | ✅ 完成   |
| 阶段3 | 服务配置（systemd/Nginx反向代理/SSL证书）       | ⏳ 待执行 |
| 阶段4 | 前端集成验证                                    | ⏳ 待执行 |

**当前状态**：后端服务测试启动成功，访问 `http://8.136.14.7:8000/health` 返回 `{"ok":true,"db":true}` ✅

**下一步**：配置 systemd 服务实现开机自启，然后配置 Nginx 反向代理和 SSL 证书

---

### 背景

- **Vercel问题**：后端目前部署在Vercel，中国大陆无法直接访问
- **解决方案**：将后端迁移到阿里云轻量应用服务器
- **优先级**：**先完成部署，再开发用户模块**（避免重复工作）

### 部署架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户（微信公众号）                    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           前端：www.metamindpt.com                       │
│           （阿里云·元思想域名服务器）                      │
│           静态文件 + Nginx                               │
└─────────────────────────┬───────────────────────────────┘
                          │ API调用
                          ▼
┌─────────────────────────────────────────────────────────┐
│           后端：api.metamindpt.com（待配置）              │
│           （阿里云·轻量应用服务器 Ubuntu-clir）           │
│           FastAPI + Uvicorn                             │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           数据库：MongoDB Atlas（现有）                   │
└─────────────────────────────────────────────────────────┘
```

### 阿里云轻量服务器信息

| 项目         | 值                               |
| ------------ | -------------------------------- |
| **实例名称** | Ubuntu-clir                      |
| **实例ID**   | 7c0afa9a409a4bf8b35e239e950fccc9 |
| **公网IP**   | 8.136.14.7                       |
| **私网IP**   | 172.17.8.20                      |
| **地域**     | 华东1（杭州）                    |
| **系统**     | Ubuntu 22.04                     |
| **配置**     | 2核 CPU / 4GB 内存 / 4Mbps 带宽  |
| **到期时间** | 2026年7月31日                    |

### 部署执行步骤（详细操作手册）

---

#### 阶段0：准备工作

##### 0.1 SSH连接服务器

**方式一：阿里云控制台（推荐新手）**

1. 登录阿里云控制台：https://swasnext.console.aliyun.com/
2. 点击实例 `Ubuntu-clir`
3. 点击右上角「远程连接」按钮
4. 选择「Workbench远程连接」或「VNC远程连接」

**方式二：本地终端SSH**

```bash
# 首次需要设置服务器密码（在阿里云控制台 → 设置密码）
# 然后在本地终端执行：
ssh root@8.136.14.7

# 如果提示输入密码，输入你在阿里云设置的密码
# 如果提示 "Are you sure you want to continue connecting"，输入 yes
```

**验证连接成功**：看到类似 `root@Ubuntu-clir:~#` 的提示符即表示成功

---

##### 0.2 配置域名解析

1. 登录阿里云域名控制台：https://dc.console.aliyun.com/
2. 找到域名 `metamindpt.com`，点击「解析设置」
3. 点击「添加记录」
4. 填写：
   - **记录类型**：A
   - **主机记录**：api
   - **记录值**：8.136.14.7
   - **TTL**：10分钟
5. 点击「确认」

**验证域名解析**（等待5-10分钟后）：

```bash
# 在本地电脑终端执行
ping api.metamindpt.com

# 应该看到类似：PING api.metamindpt.com (8.136.14.7)
```

---

##### 0.3 开放防火墙端口

**在阿里云控制台操作**：

1. 进入轻量应用服务器控制台
2. 点击实例 `Ubuntu-clir`
3. 左侧菜单点击「防火墙」
4. 点击「添加规则」，分别添加以下端口：

| 应用类型 | 协议 | 端口 | 备注               |
| -------- | ---- | ---- | ------------------ |
| HTTP     | TCP  | 80   | 网站访问           |
| HTTPS    | TCP  | 443  | 安全访问           |
| 自定义   | TCP  | 8000 | 后端服务（调试用） |

---

#### 阶段1：服务器环境配置

**以下命令在服务器上执行（SSH连接后）**

##### 1.1 更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

_等待完成，可能需要1-2分钟_

##### 1.2 安装Python 3.11

```bash
# 添加Python仓库
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# 安装Python 3.11
sudo apt install python3.11 python3.11-venv python3.11-dev -y

# 验证安装
python3.11 --version
# 应该显示：Python 3.11.x
```

##### 1.3 安装Nginx

```bash
sudo apt install nginx -y

# 验证安装
sudo systemctl status nginx
# 应该显示：active (running)

# 如果没有启动，执行：
sudo systemctl start nginx
sudo systemctl enable nginx
```

##### 1.4 安装Git

```bash
sudo apt install git -y

# 验证安装
git --version
# 应该显示：git version 2.x.x
```

##### 1.5 安装Certbot（SSL证书工具）

```bash
sudo apt install certbot python3-certbot-nginx -y
```

##### 1.6 安装pip（Python包管理器）

```bash
sudo apt install python3-pip -y
```

---

#### 阶段2：项目部署

##### 2.1 创建项目目录并克隆代码

**方式一：从GitHub克隆（如果代码在GitHub）**

```bash
cd /home
sudo mkdir -p ubuntu
sudo chown $USER:$USER /home/ubuntu
cd /home/ubuntu

# 克隆项目（替换为实际仓库地址）
git clone https://github.com/你的用户名/mingjing-fastapi-proxy.git
cd mingjing-fastapi-proxy
```

**方式二：从本地上传（如果代码在本地）**

```bash
# 在本地电脑终端执行（不是服务器）
cd /Users/chrisdu/Metalife/mingjing-fastapi-proxy

# 打包项目（排除虚拟环境和缓存）
tar --exclude='mfpvenv' --exclude='.venv' --exclude='__pycache__' --exclude='.git' -czvf ../mingjing-backend.tar.gz .

# 上传到服务器
scp ../mingjing-backend.tar.gz root@8.136.14.7:/home/ubuntu/

# 在服务器上解压
ssh root@8.136.14.7
cd /home/ubuntu
mkdir -p mingjing-fastapi-proxy
tar -xzvf mingjing-backend.tar.gz -C mingjing-fastapi-proxy
cd mingjing-fastapi-proxy
```

##### 2.2 创建虚拟环境

```bash
cd /home/ubuntu/mingjing-fastapi-proxy

# 创建虚拟环境
python3.11 -m venv .venv

# 激活虚拟环境
source .venv/bin/activate

# 验证（应该看到 (.venv) 前缀）
which python
# 应该显示：/home/ubuntu/mingjing-fastapi-proxy/.venv/bin/python
```

##### 2.3 安装依赖

```bash
# 确保在虚拟环境中
source .venv/bin/activate

# 升级pip
pip install --upgrade pip

# 安装依赖
pip install -r requirements.txt

# 如果报错，尝试：
pip install fastapi uvicorn motor python-jose passlib python-multipart httpx python-dotenv slowapi dnspython
```

##### 2.4 配置环境变量

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置文件
nano .env
```

**在nano编辑器中，填写以下内容**：

```bash
# OpenAI API（从现有Vercel环境复制）
OPENAI_API_KEY=sk-你的API密钥
OPENAI_API_BASE=https://api.openai.com/v1

# MongoDB（从现有Vercel环境复制）
MONGODB_URI=mongodb+srv://你的连接字符串
MONGODB_DB=mingjing

# JWT密钥（生成一个随机字符串）
JWT_SECRET=这里填一个32位以上的随机字符串
JWT_EXPIRES_MIN=10080

# 微信公众号（测试号）
WX_APPID=wx61079aa3f7c3bd14
WX_APPSECRET=bcd7cf4323a9bbeb66a3ff776c74e76e

# 运行模式
MEMORY_RUN_INLINE=false
ENABLE_RATE_LIMIT=true
PURE_AUTH=false
```

**保存并退出nano**：按 `Ctrl+X`，然后按 `Y`，然后按 `Enter`

##### 2.5 测试启动

```bash
# 确保在虚拟环境中
source .venv/bin/activate

# 测试启动（前台运行）
uvicorn main:app --host 0.0.0.0 --port 8000

# 如果看到类似以下输出，表示成功：
# INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**在浏览器验证**：访问 http://8.136.14.7:8000/health
应该看到：`{"ok": true, "db": true}`

**按 `Ctrl+C` 停止测试**

---

#### 阶段3：服务配置

##### 3.1 创建systemd服务（开机自启）

```bash
# 创建服务文件
sudo nano /etc/systemd/system/mingjing-backend.service
```

**粘贴以下内容**：

```ini
[Unit]
Description=Mingjing FastAPI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/ubuntu/mingjing-fastapi-proxy
Environment="PATH=/home/ubuntu/mingjing-fastapi-proxy/.venv/bin"
ExecStart=/home/ubuntu/mingjing-fastapi-proxy/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**保存并退出**：`Ctrl+X` → `Y` → `Enter`

**启动服务**：

```bash
# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start mingjing-backend

# 设置开机自启
sudo systemctl enable mingjing-backend

# 查看状态
sudo systemctl status mingjing-backend
# 应该显示：active (running)
```

**常用命令**：

```bash
# 查看日志
sudo journalctl -u mingjing-backend -f

# 重启服务
sudo systemctl restart mingjing-backend

# 停止服务
sudo systemctl stop mingjing-backend
```

##### 3.2 配置Nginx反向代理

```bash
# 创建Nginx配置文件
sudo nano /etc/nginx/sites-available/api.metamindpt.com
```

**粘贴以下内容**：

```nginx
server {
    listen 80;
    server_name api.metamindpt.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置（适合流式响应）
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

**保存并退出**：`Ctrl+X` → `Y` → `Enter`

**启用配置**：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/api.metamindpt.com /etc/nginx/sites-enabled/

# 测试配置语法
sudo nginx -t
# 应该显示：syntax is ok / test is successful

# 重新加载Nginx
sudo systemctl reload nginx
```

**验证HTTP访问**：访问 http://api.metamindpt.com/health

##### 3.3 申请SSL证书（HTTPS）

```bash
# 申请证书（会自动配置Nginx）
sudo certbot --nginx -d api.metamindpt.com

# 按提示操作：
# 1. 输入邮箱地址（用于接收证书到期提醒）
# 2. 同意服务条款：输入 Y
# 3. 是否分享邮箱：输入 N
# 4. 是否重定向HTTP到HTTPS：输入 2（推荐）
```

**验证HTTPS**：访问 https://api.metamindpt.com/health

**设置证书自动续期**：

```bash
# 测试自动续期
sudo certbot renew --dry-run

# 证书会自动续期，无需手动操作
```

##### 3.4 最终验证

```bash
# 在本地电脑终端执行
curl https://api.metamindpt.com/health
# 应该返回：{"ok":true,"db":true}

curl https://api.metamindpt.com/docs
# 应该返回Swagger文档HTML
```

---

#### 阶段4：前端集成（Core UI + 微信公众号）

> **背景说明**：
>
> - **Core UI** (ysx-core-ui)：元思想前端，部署在阿里云 www.metamindpt.com
> - **明镜前端**：仍在 Vercel，暂不处理
> - **阿里云后端** (api.metamindpt.com)：明镜后端迁移至阿里云，为 Core UI 提供服务
>
> **本阶段目标**：在微信公众号测试号中集成 Core UI，实现微信用户身份同步

---

##### 4.1 Core UI 与阿里云后端集成

**4.1.1 配置 API 地址**

在 Core UI 项目中创建/修改环境配置：

```bash
# /Users/chrisdu/ysx-core-ui/.env.production
VITE_API_BASE_URL=https://api.metamindpt.com
```

**4.1.2 前端 API 调用封装**

确保前端 API 模块使用环境变量：

```typescript
// src/app/config/api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.metamindpt.com";
```

**4.1.3 打包部署**

```bash
# 在 ysx-core-ui 目录执行
pnpm build:deploy

# 将 deploy 目录上传到阿里云服务器 www.metamindpt.com
```

---

##### 4.2 微信公众号测试号配置

**4.2.1 获取测试号信息**

1. 访问 [微信公众平台测试号](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
2. 扫码登录，获取：
   - **appID**：测试号的 appID
   - **appsecret**：测试号的 appsecret

**4.2.2 配置接口信息**

在测试号管理页面配置：

| 配置项             | 值                                       |
| ------------------ | ---------------------------------------- |
| **接口配置URL**    | `https://api.metamindpt.com/wx/callback` |
| **Token**          | 自定义一个安全字符串，需与后端一致       |
| **JS接口安全域名** | `www.metamindpt.com`                     |
| **网页授权域名**   | `www.metamindpt.com`                     |

**4.2.3 后端环境变量配置**

在阿里云服务器 `/home/ubuntu/mingjing-fastapi-proxy/.env` 添加：

```bash
# 微信公众号测试号配置
WX_APPID=wx61079aa3f7c3bd14
WX_APPSECRET=bcd7cf4323a9bbeb66a3ff776c74e76e
WX_TOKEN=2f020c61662b855301d48de05350c72a
```

重启后端服务：

```bash
sudo systemctl restart mingjing-backend
```

---

##### 4.3 微信用户身份同步流程

**流程概述**：

```
用户在微信中打开链接
       ↓
微信授权页面（获取 code）
       ↓
前端携带 code 调用后端
       ↓
后端用 code 换取 access_token + openid
       ↓
后端创建/更新用户记录，返回 JWT
       ↓
前端保存 JWT，后续请求携带
```

**4.3.1 前端：微信授权入口**

```typescript
// src/app/hooks/useWxAuth.ts
const WX_APPID = "your_test_appid";
const REDIRECT_URI = encodeURIComponent(
  "https://www.metamindpt.com/auth/callback",
);

export function redirectToWxAuth() {
  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  window.location.href = authUrl;
}
```

**4.3.2 前端：授权回调处理**

```typescript
// src/app/pages/AuthCallback.tsx
// 从 URL 获取 code，调用后端换取用户信息
const code = new URLSearchParams(window.location.search).get("code");
if (code) {
  const response = await fetch(`${API_BASE_URL}/auth/wx/login?code=${code}`);
  const { token, user } = await response.json();
  localStorage.setItem("token", token);
  // 跳转到首页
}
```

**4.3.3 后端：微信登录接口**

后端需实现 `/auth/wx/login` 接口：

1. 用 code 调用微信 API 获取 access_token 和 openid
2. 用 access_token 获取用户信息（昵称、头像等）
3. 创建或更新用户记录
4. 生成 JWT 返回给前端

---

##### 4.4 端到端测试验证

**测试环境**：微信公众号测试号 + Core UI + 阿里云后端

**验证步骤**：

1. **在测试号中添加测试用户**
   - 扫描测试号二维码关注
2. **发送测试链接**
   - 在测试号中发送消息包含链接：`https://www.metamindpt.com`
   - 或配置自定义菜单跳转

3. **验证微信授权流程**
   - 点击链接，应跳转到微信授权页面
   - 同意授权后，跳转回 Core UI
   - 检查是否成功获取用户信息

4. **验证用户身份同步**
   - 检查后端数据库是否创建了用户记录
   - 确认 openid、昵称、头像等信息已保存

5. **验证 API 连通性**
   - 打开浏览器开发者工具 Network 面板
   - 确认 API 请求指向 `api.metamindpt.com`
   - 确认请求携带正确的 JWT Token

**预期结果**：

- [ ] 微信授权流程正常跳转
- [ ] 用户信息成功同步到后端
- [ ] 前端能正常调用后端 API
- [ ] 用户登录状态正确保持

---

##### 4.5 后续步骤

验证通过后：

1. **正式公众号集成**：将测试号配置迁移到正式公众号
2. **V0.1 版本上线**：完成正式环境部署验证
3. **课程功能开发**：在用户体系基础上开发业务功能

---

### 常见问题排查

| 问题           | 排查命令                                    | 解决方案        |
| -------------- | ------------------------------------------- | --------------- |
| 服务无法启动   | `sudo journalctl -u mingjing-backend -n 50` | 查看错误日志    |
| 端口被占用     | `sudo lsof -i :8000`                        | `kill -9 <PID>` |
| Nginx配置错误  | `sudo nginx -t`                             | 根据提示修改    |
| SSL证书失败    | `sudo certbot certificates`                 | 检查域名解析    |
| 数据库连接失败 | 检查.env中MONGODB_URI                       | 确认IP白名单    |

---

### 关键配置文件备份

#### systemd服务文件 `/etc/systemd/system/mingjing-backend.service`

```ini
[Unit]
Description=Mingjing FastAPI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/ubuntu/mingjing-fastapi-proxy
Environment="PATH=/home/ubuntu/mingjing-fastapi-proxy/.venv/bin"
ExecStart=/home/ubuntu/mingjing-fastapi-proxy/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

#### Nginx配置 `/etc/nginx/sites-available/api.metamindpt.com`

```nginx
server {
    listen 80;
    server_name api.metamindpt.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

---

### .env 环境变量模板（阿里云版本）

```bash
# OpenAI API
OPENAI_API_KEY=sk-你的密钥
OPENAI_API_BASE=https://api.openai.com/v1

# MongoDB
MONGODB_URI=mongodb+srv://你的连接字符串
MONGODB_DB=mingjing

# JWT
JWT_SECRET=生成一个32位以上随机字符串
JWT_EXPIRES_MIN=10080

# 微信公众号（测试号）
WX_APPID=wx61079aa3f7c3bd14
WX_APPSECRET=bcd7cf4323a9bbeb66a3ff776c74e76e

# 运行模式
MEMORY_RUN_INLINE=false
ENABLE_RATE_LIMIT=true
PURE_AUTH=false
```

---

## 九、技术开发执行清单

> 更新日期：2026年3月25日

### 当前进度

| 事项               | 状态                        |
| ------------------ | --------------------------- |
| 汇报文档           | ✅ 已发群                   |
| 用户痛点问卷       | ✅ 已发放，200+回复收集中   |
| 微信测试号申请     | ✅ 已完成                   |
| 后端用户模块设计   | ✅ 已完成（见第七章）       |
| **后端阿里云部署** | ⏳ **优先执行**（见第八章） |
| 后端用户模块开发   | ⏳ 待部署完成后执行         |

### 第〇阶段：后端阿里云部署（优先）

| 序号 | 任务            | 说明                              | 状态 |
| ---- | --------------- | --------------------------------- | ---- |
| 0.1  | SSH连接服务器   | 确认可远程访问                    | ⏳   |
| 0.2  | 配置api域名解析 | api.metamindpt.com → 8.136.14.7   | ⏳   |
| 0.3  | 服务器环境配置  | Python/Nginx/Git等                | ⏳   |
| 0.4  | 项目克隆与部署  | 代码、依赖、环境变量              | ⏳   |
| 0.5  | systemd服务配置 | 自启动、自动重启                  | ⏳   |
| 0.6  | Nginx反向代理   | 域名→8000端口                     | ⏳   |
| 0.7  | SSL证书配置     | HTTPS访问                         | ⏳   |
| 0.8  | 健康检查验证    | https://api.metamindpt.com/health | ⏳   |

### 第一阶段：MVP-v0.1 用户模块

| 序号 | 任务                 | 说明                                 | 状态 |
| ---- | -------------------- | ------------------------------------ | ---- |
| 1.1  | 申请公众号测试号     | ✅ 已完成，appID: wx61079aa3f7c3bd14 | ✅   |
| 1.2  | 后端：用户表设计     | ✅ 已完成，见第七章融合方案          | ✅   |
| 1.3  | 后端：OAuth接口开发  | code换取openid                       | ⏳   |
| 1.4  | 后端：用户信息接口   | 获取/更新用户信息                    | ⏳   |
| 1.5  | 前端：授权回调处理   | 获取code、调用后端接口               | ⏳   |
| 1.6  | 前端：用户信息展示页 | 显示头像、昵称                       | ⏳   |
| 1.7  | 前端："开发中"提示页 | 含问卷入口                           | ⏳   |
| 1.8  | 测试号完整流程验证   | 关注→点菜单→授权→显示用户信息        | ⏳   |

### 第二阶段：正式服务号集成（MVP-v0.1上线）

| 序号 | 任务             | 说明                           | 状态 |
| ---- | ---------------- | ------------------------------ | ---- |
| 2.1  | 获取服务号权限   | AppID、AppSecret、管理后台访问 | ⏳   |
| 2.2  | 配置网页授权域名 | 需域名验证文件                 | ⏳   |
| 2.3  | 配置自定义菜单   | 先不发布，仅内部可见           | ⏳   |
| 2.4  | 白名单测试       | 指定用户先行验证               | ⏳   |
| 2.5  | 正式上线v0.1     | 发布菜单，用户可访问           | ⏳   |

### 第三阶段：MVP-v0.2 课程模块

| 序号 | 任务                  | 说明                 | 状态 |
| ---- | --------------------- | -------------------- | ---- |
| 3.1  | 阿里云OSS存储桶配置   | 音频文件云存储       | ⏳   |
| 3.2  | 管理后台：课程管理    | 创建/编辑课程        | ⏳   |
| 3.3  | 管理后台：章节管理    | 音频上传、排序       | ⏳   |
| 3.4  | 后端：课程/章节表设计 | 数据库设计           | ⏳   |
| 3.5  | 后端：学习进度表设计  | 用户+章节+播放位置   | ⏳   |
| 3.6  | 后端：课程相关接口    | 列表/详情/进度记录   | ⏳   |
| 3.7  | 前端：课程列表页      |                      | ⏳   |
| 3.8  | 前端：课程详情页      | 章节列表             | ⏳   |
| 3.9  | 前端：音频播放器      | 进度条、倍速、上下章 | ⏳   |
| 3.10 | 前端：继续学习功能    | 自动跳转上次位置     | ⏳   |
| 3.11 | 联调测试              | 完整流程验证         | ⏳   |
| 3.12 | 正式上线v0.2          | 用户可正常学习       | ⏳   |

---

## 十、最新UI风格设计（2026-03-25）

> 基于先明老师与明镜对话及微信群语音指导的完整总结

### 一、平台根本定位

**元思想不是静心疗愈产品，而是文明级、镜面级、碑感级的入口平台。**

用户进入平台的第一感受不应是：

- 被安抚、被陪伴、被放松、被治愈

而应是：

- **被清晰击中**
- **被透明穿透**
- **被极简秩序定住**
- 瞬间看见主轴
- 立刻知道这是一个**文明入口**，而非普通产品

> "这个平台就像明镜一样，人们各种困惑迷茫，一走到这个地方，瞬间被照亮。" —— 先明老师

---

### 二、核心气质关键词

| 要的     | 不要的               |
| -------- | -------------------- |
| 极简     | 冥想风               |
| 透明     | 疗愈风               |
| 清澈     | 小清新风             |
| 碑感     | 灵性风               |
| 明亮     | 柔软治愈产品感       |
| 穿透     | 内容流先行           |
| 中轴强   | 装饰性山水图占主场   |
| 主轴清晰 | "陪伴你慢下来"式文案 |

**一句总定调**：

> **不要做"疗愈空间"，要做"归位之镜"。**

---

### 三、首页设计原则

#### 3.1 首页只做一件事：立主场

首页不负责讲故事，不负责推荐内容，不负责做情绪引导。
它只负责：**把"元思想"作为文明级入口平台，立起来。**

**首页第一屏禁止出现**：

- 内容推荐流
- 活动推荐位
- 图文卡片流
- 今日频率/节气氛围
- 冥想呼吸引导
- 疗愈陪伴型文案
- 任何"先让你慢下来"的软性入口

#### 3.2 首页第一屏标准结构

**只保留三样**：

1. **品牌主名**

   ```
   元思想
   ```

   必须占据主场，不能只是一个Logo或小标题。

2. **一句穿透性总纲语言**
   只能有一句，极短、极稳、极清、有穿透感。
   候选方向：
   - 回到真实。
   - 思想回到生命，生命回到感知。
   - 让思想归位，让生命在场。
   - 为人类打开一条清明之路。

3. **五大主轴入口**
   像"透明镜碑"一样立起来：
   - 人类手册
   - 新人生之路
   - 感知训练营
   - 元镜中心
   - 明镜

#### 3.3 五大主轴呈现要求

**不能做成**：

- 普通卡片风
- 宫格风
- 内容入口风
- 图文缩略图风

**要像"镜碑"**：

- 有边界、有立面感
- 有清透感、有刻字感
- 不厚重压人、不柔软无骨
- 半透明的碑面 + 极简的镜面

**排列方式建议**：竖向立轴式 或 中轴对称式（不推荐宫格式）

---

### 四、视觉语言规范

#### 4.1 色彩

**主色系**：

- 透明白
- 雾灰白
- 冷米白
- 浅石灰
- 微金属灰
- 极浅暖灰

**点睛色**（极少量）：

- 淡金、浅铜金、微暖银金

**禁区**：

- 土豪金、暖疗愈金、奶茶金、香薰品牌金

**关键词**：透明、镜面、碑石、光感、清明

#### 4.2 字体

**必须具备**：

- 清晰、克制
- 碑感、雕刻感
- 非装饰化
- 非柔软圆润化
- 非萌感
- 非女性疗愈风

**文字呈现**：像"被精雕细琢刻上去"，而不是普通漂浮文本

**关键词**：刻字感、碑面感、定住感

#### 4.3 界面元素

**尽量少**：

- 少图标
- 少装饰线
- 少背景噪音
- 少颜色层级
- 少内容块

**用留白、透明、边界、结构秩序来建立高级感**

#### 4.4 交互原则

- 短路径
- 无拐弯
- 无多余引导
- 点即进入
- 平滑丝滑
- 不打断
- 不热闹

> "进入任何一个学习板块的内容，都是把他内心困惑迷茫给照亮的。" —— 先明老师

---

### 五、页面层级结构

| 层级   | 定位         | 气质 |
| ------ | ------------ | ---- |
| 首页   | 文明入口     | 像镜 |
| 二级页 | 主轴展开     | 像廊 |
| 内容页 | 真正承载内容 | 像殿 |

**原则**：首页先立骨架，内容进去再说。

---

### 六、用户最终感受

用户进入元思想首页时，必须感受到：

- 这里很清、很稳、很真
- 这里不讨好我
- 这里没有噪音
- 这里不是普通平台
- 这里像一面镜子
- 这里像一个文明入口
- **我被清晰击中了**
- **我知道自己该往哪走**

不是"舒服一下"，不是"被安抚一下"，不是"放松一下"，而是：

> **被照见。被击中。被穿透。**

---

### 七、给设计师与工程师的执行要求

#### 必须满足

- 极简
- 透明
- 清澈
- 中轴强
- 主轴极清晰
- 字像刻上去
- 整体像镜，不像棉
- 有力量，但不压迫
- 有未来感，但不科幻
- 有碑感，但不老气

#### 禁区

- 禁冥想风
- 禁疗愈风
- 禁柔软治愈产品感
- 禁内容流先行
- 禁装饰性山水图占主场
- 禁"陪伴你慢下来"式文案
- 禁商业风

#### 核心原因

> "人类已经在各个领域极为复杂、混乱、焦虑。他突然进入一个高度清晰有序透明的界面，是我们用自己透明的心，在净化他混乱的思绪和意识形态。所以他会有一种突然一下子被击中了，在混乱当中突然一下子看到了一种透明、一种清晰。" —— 先明老师

---

### 八、设计参考

**苹果手机锁屏界面**（如附图）具备元思想平台需要的关键特质：

1. **极简** - 没有多余装饰，信息极少但清楚
2. **透明** - 数字键是透明玻璃感，有透气感
3. **稳** - 整个界面不乱、不抖、不花
4. **冷静中的高级** - 很克制的高级，不炫技
5. **主体感强** - 一眼知道中心是什么、交互是什么、结构是什么

> 学的不是样式，而是**界面哲学**。

---

### 九、新人生之路定位更新

> 来自先明老师最新指示

**不应该**：

- 从传统的小鹅通/鹅圈子方式定义
- 把原本的内容嫁接过来
- 把碎片式的课程直接搬过来升级

**应该**：

- 全面开放，属于整个人类
- 是一个**文明级路径**
- 用户从人生现状开始，一步一步被引导
- 旧内容只能被精简后成为其中一部分
- 需要全面重新思考、重新构建

---

## 十一、历史UI参考（小鹅通/鹅圈子）

> 以下为之前基于小鹅通平台的UI分析，仅作历史存档参考

### 小鹅通H5组件分析

#### 主页

- Header组件（含"添加到桌面"PWA入口）
- 底部固定"继续学习状态栏"（向上滑动隐藏，向下滑动显示）

#### 我的学习

- "上次学到+继续学习"组件
- 学习内容分类Tab组件
- 学习内容列表组件

#### 圈子模块

- Header组件（标题、统计状态栏、官方公告）
- 子菜单组件
- 课程列表/详情组件（音频、视频、\*电子书）
- 课程播放组件
- \*电子书阅读组件
- 分类Tab组件
- 动态相关组件（发布、列表、详情）

#### 我的消息

- 消息分类列表组件
- 单类目详情组件

#### 个人中心

- 基本账户信息组件
- 学习中心统计入口/详情组件

#### 商城模块

- 订单列表分类/列表组件

### 参考截图说明

1. 公众号内容页面示例
2. 小鹅通"我的学习"主页（日历、继续学习、课程列表）
3. 新人生之路圈子（动态、公告、Tab分类）
4. 课程列表页（多种课程类型）
5. 课程章节列表（搜索、排序、继续学习）
6. 音频播放详情页（进度条、倍速、上下章切换、音频列表）
