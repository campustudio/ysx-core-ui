# 人类手册模块 - 开发文档

## 模块定位

「人类手册」是元感知平台的核心学习模块，底部导航第二个 Tab。  
功能定位类似喜马拉雅的听书平台：用户可以浏览音频课程（以"书"的形式呈现），按章节收听，同步文字稿，追踪学习进度。

## 核心功能（MVP v1.0）

### 已实现

- **书籍列表页**（Handbook.tsx）：分类筛选 + 书籍卡片 + 学习进度
- **书籍详情页**（BookDetail.tsx）：封面信息 + 章节列表 + 各章节学习状态
- **章节播放器**（ChapterPlayer.tsx）：封面/文稿双模式 + 播放控制 + 进度条 + 章节切换
- **学习进度追踪**：localStorage 持久化，播放 100% 完毕自动标记完成
- **底部导航互通**：首页 ↔ 人类手册 Tab 切换

### MVP 阶段简化

- 音频播放为**模拟计时器**（每秒 +1），非真实 `<audio>` 播放
- 音频来源 `audioSrc` 为占位路径，正式版替换为 CDN URL
- 无搜索功能（Toast 占位提示）
- 无单曲循环、倍速播放、收藏书签等高级功能
- 进度存储在 localStorage，无云端同步

## 文件结构

```
config/
  handbook-data.ts     — 书籍/章节数据 + 分类 + 进度 CRUD（localStorage）

pages/
  Handbook.tsx         — 书籍列表主页（Tab 页面）
  BookDetail.tsx       — 书籍详情（章节列表）
  ChapterPlayer.tsx    — 章节播放器（封面/文稿模式）
```

## 数据模型

```typescript
Book {
  id, title, author, cover, description, category,
  chapters: Chapter[], totalChapters
}

Chapter {
  id, index, title, subtitle, duration, audioSrc,
  transcript: string[]  // 文稿段落
}

ChapterProgress {
  completed: boolean,
  playedSeconds: number,
  lastStudiedAt: timestamp
}
```

## 路由

| 路由             | 页面       | 入口           |
| ---------------- | ---------- | -------------- |
| `handbook`       | 书籍列表   | 底部导航 Tab 2 |
| `book-detail`    | 书籍详情   | 点击书籍卡片   |
| `chapter-player` | 章节播放器 | 点击章节       |

返回路径：播放器 → 书籍详情 → 手册列表

## 音频升级路径

1. **当前**：`audioSrc` 为 `placeholder://` 占位，使用模拟计时器
2. **第一步**：将真实 mp3 上传到云存储（阿里云 OSS / 腾讯云 COS / 七牛云）
3. **第二步**：将 `audioSrc` 替换为 CDN URL
4. **第三步**：在 ChapterPlayer 中将模拟计时器替换为真实 `<audio>` 播放
5. **TARO 转换**：使用 `wx.createInnerAudioContext()` 替代 `<audio>`

## 后续迭代方向

- [ ] 真实音频播放（`<audio>` 元素）
- [ ] 云端进度同步（Supabase / 自建 API）
- [ ] 搜索功能
- [ ] 倍速播放（0.5x / 1x / 1.5x / 2x）
- [ ] 收藏 / 书签功能
- [ ] 播放列表 / 连续播放
- [ ] 文稿同步高亮（当前播放段落跟随标亮）
- [ ] 下载离线收听
- [ ] 更多书籍/课程内容

## 设计注意事项

- **宇宙星空深色主题**：人类手册模块采用独立的深空蓝配色体系，与首页古纸暖色调形成鲜明对比
  - 背景：深空蓝 `#0B1120 → #111D35`
  - 卡片：`rgba(255,255,255,0.06)` 半透明白
  - 文字：白色系（92% / 60% / 35% 三级透明度）
  - 分类激活色：鼠尾草绿 `#8BAA7D`
  - 进度/控制强调色：琥珀金 `#C49A6C`
  - 封面图带径向光晕装饰，营造宇宙感
- 分类标签按原始设计稿：推荐 / 视频 / 音频 / 电子书 / 图文
- 播放器控制栏（进度条 + 播放按钮）全宽铺满屏幕，不留左右边距
- 章节完成标准为 **100% 播放完毕**，非提前标记
- 宋体（Noto Serif SC）仅用于标题，正文用系统字体
- 所有尺寸使用 `rpx()` 响应式单位
