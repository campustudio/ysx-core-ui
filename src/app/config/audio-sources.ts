/**
 * 音频资源指南 - 元思想
 *
 * 本文件集中记录项目中所有需要音频的场景、当前状态、
 * 以及推荐的免费商用音频来源和搜索关键词。
 *
 * ═══════════════════════════════════════════════════════
 *  项目音频需求总览
 * ═══════════════════════════════════════════════════════
 *
 * 一、放松引导音频（AudioPlayer 页面，3 首）
 *    入口：首页三卡片 徐/止/定 → 全屏沉浸播放页
 *    场景：5-10 分钟的放松引导背景音乐
 *    当前状态：Web Audio API 合成的 Drone 音频（零依赖），可循环
 *    配置位置：/src/app/config/player-data.ts
 *
 *    ┌─────┬──────────────┬───────────┬──────────────────────────┐
 *    │ ID  │ 标题         │ 推荐时长  │ 推荐搜索词                │
 *    ├─────┼──────────────┼───────────┼──────────────────────────┤
 *    │ 徐  │ 慢下来       │ 5 分钟    │ meditation ambient warm  │
 *    │     │              │           │ healing frequency drone  │
 *    ├─────┼──────────────┼───────────┼──────────────────────────┤
 *    │ 止  │ 停下来       │ 8 分钟    │ om chanting meditation   │
 *    │     │              │           │ peaceful ambient calm    │
 *    ├─────┼──────────────┼───────────┼──────────────────────────┤
 *    │ 定  │ 静下来       │ 10 分钟   │ deep meditation binaural │
 *    │     │              │           │ alpha wave relaxation    │
 *    └─────┴──────────────┴───────────┴──────────────────────────┘
 *
 * 二、环境音效（BreathingSession 页面，4 种）
 *    入口：首页呼吸圆环 → 沉浸呼吸页 → 环境音效选择
 *    场景：呼吸练习时的背景音效，循环播放
 *    当前状态：Web Audio API 合成（零依赖），可循环
 *    配置位置：/src/app/config/breathing-data.ts
 *
 *    ┌──────┬───────────┬──────────────────────────────┐
 *    │ 音效 │ 推荐时长  │ 推荐搜索词                    │
 *    ├──────┼───────────┼──────────────────────────────┤
 *    │ 细雨 │ 2-5 分钟  │ rain ambient gentle soft     │
 *    │ 海浪 │ 2-5 分钟  │ ocean waves calm shore       │
 *    │ 山林 │ 2-5 分钟  │ forest birds nature ambient  │
 *    │ 清风 │ 2-5 分钟  │ wind gentle breeze soft      │
 *    └──────┴───────────┴──────────────────────────────┘
 *
 * 三、播客/故事音频（PodcastDetail 页面，3 条）
 *    入口：首页「同行者的声音」→ 播客详情页
 *    场景：用户真实分享的音频故事（人声为主）
 *    当前状态：尚未接入音频，播放按钮为预留状态
 *    配置位置：/src/app/config/podcasts-data.ts
 *
 *    注意：播客音频为用户原创的人声内容，
 *    无法用通用音乐库替代。需自行录制或委托创作。
 *    可临时使用放松引导音频作为占位。
 *
 * ═══════════════════════════════════════════════════════
 *  推荐免费商用音频来源（按推荐优先级排序）
 * ═══════════════════════════════════════════════════════
 *
 * 1. Pixabay Music & Sound Effects
 *    网址：https://pixabay.com/music/ | https://pixabay.com/sound-effects/
 *    许可：Pixabay Content License（免费商用，无需署名）
 *    优点：品质高、数量多、无需注册即可下载
 *    搜索建议：使用英文关键词，可按时长筛选
 *    典型 URL 格式：https://cdn.pixabay.com/audio/2024/...
 *
 * 2. Mixkit
 *    网址：https://mixkit.co/free-sound-effects/
 *    许可：Mixkit License（免费商用，无需署名）
 *    优点：分类清晰，有专门的 "Meditation" 和 "Nature" 分类
 *
 * 3. Freesound.org
 *    网址：https://freesound.org/
 *    许可：部分 CC0，部分 CC-BY（需筛选许可证类型）
 *    优点：社区贡献，环境音效特别丰富
 *    注意：下载需注册，务必确认每个文件的许可证
 *
 * 4. Free Music Archive (FMA)
 *    网址：https://freemusicarchive.org/
 *    许可：多种 CC 许可证，需逐一确认
 *    优点：长音频（完整曲目）较多
 *
 * 5. Uppbeat
 *    网址：https://uppbeat.io/
 *    许可：免费版每月 10 首，商用需署名
 *    优点：专业品质，有放松/舒缓分类
 *
 * ═══════════════════════════════════════════════════════
 *  替换音频的操作步骤
 * ═══════════════════════════════════════════════════════
 *
 * Step 1: 从上述平台下载合适的 mp3 文件
 * Step 2: 上传到 CDN（如 Cloudflare R2、阿里云 OSS）
 * Step 3: 获取 CDN URL（https://your-cdn.com/audio/xxx.mp3）
 * Step 4: 替换对应配置文件中的 audioSrc / src 字段
 *
 * 示例（player-data.ts 中的徐）：
 *   修改前: audioSrc: ""  (使用 Web Audio API 合成)
 *   修改后: audioSrc: "https://your-cdn.com/audio/xu-meditation.mp3"
 *
 * 示例（breathing-data.ts 中的细雨）：
 *   修改前: src: "/audio/ambient-rain.mp3"  (合成器占位路径)
 *   修改后: src: "https://your-cdn.com/audio/rain-ambient.mp3"
 *
 * 替换后 resolveAudioUrl() 会自动识别为真实 URL 并原样透传，
 * Web Audio 合成器不会被调用。
 *
 * ═══════════════════════════════════════════════════════
 *  TARO 转换注意事项
 * ═══════════════════════════════════════════════════════
 *
 * 小程序中 Web Audio API 不可用，必须使用真实 mp3 文件：
 *   - 将 mp3 上传到 CDN 或微信云存储
 *   - 使用 wx.createInnerAudioContext() 播放
 *   - 音频文件大小建议控制在 5MB 以内
 *   - 需要预加载机制避免播放延迟
 */

// ─── 环境音效背景图（呼吸页可选用） ─────────────────

/**
 * 各环境音效对应的意境图片（Unsplash License，允许商用）
 * 可用于呼吸页准备阶段的视觉氛围增强（预留）
 */
export const AMBIENT_SCENE_IMAGES = {
  /** 细雨 — 雨滴窗前，宁静惬意 */
  rain: "/images/img-171497259346.jpg",
  /** 海浪 — 金色日落海面，波光粼粼 */
  ocean: "/images/img-162239334690.jpg",
  /** 山林 — 晨光穿林，薄雾弥漫 */
  forest: "/images/img-1558641445-7.jpg",
  /** 清风 — 金色草地微风拂过 */
  wind: "/images/img-176700756690.jpg",
} as const;