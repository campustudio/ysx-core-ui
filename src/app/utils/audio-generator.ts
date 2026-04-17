/**
 * 音频合成器 - 元感知
 *
 * 使用 Web Audio API（OfflineAudioContext）在浏览器中合成音频。
 * 生成的音频以 Blob URL 形式返回，可直接用于 <audio> 或 new Audio(url)。
 *
 * 适用场景：
 *   ① 沉浸呼吸页 — 4 种环境音效（细雨/海浪/山林/清风）
 *   ② 放松引导页 — 3 首沉浸放松音频（徐/止/定）
 *
 * 优势：
 *   - 零外部依赖，无需 CDN/服务器托管音频文件
 *   - 无版权风险 — 代码生成，非采样素材
 *   - 离线可用 — 浏览器内合成
 *   - 循环无缝 — 首尾衔接平滑
 *
 * 技术细节：
 *   - OfflineAudioContext 渲染 → AudioBuffer → WAV Blob → URL
 *   - 合成短循环片段（10-30 秒），由播放器 loop=true 循环播放
 *   - 内置缓存：同类型音频仅合成一次
 *
 * 音频资源升级路径：
 *   当需要替换为真实录制的高品质音频时：
 *   - 修改对应配置文件中的 audioSrc / src 为 CDN URL
 *   - resolveAudioUrl() 检测到非占位路径，会原样透传（跳过合成）
 *   - 推荐免费商用音频来源详见 /src/app/config/audio-sources.ts
 *
 * ⚠️ TARO 转换注意：
 *   Web Audio API 在小程序中不可用，需替换为:
 *   - 预录制的 mp3 文件 + wx.createInnerAudioContext()
 *   - 或使用微信小程序的音频 API
 */

// ─── 缓存 ──────────────────────────────────────────────

const audioCache: Record<string, string> = {};

// ─── WAV 编码 ──────────────────────────────────────────

/**
 * AudioBuffer → WAV Blob URL
 * 将 Web Audio API 渲染的 AudioBuffer 编码为标准 16-bit PCM WAV
 */
function audioBufferToWavUrl(buffer: AudioBuffer): string {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const wav = new ArrayBuffer(totalSize);
  const view = new DataView(wav);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, "WAVE");

  // fmt chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channels and write samples
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true,
      );
      offset += 2;
    }
  }

  const blob = new Blob([wav], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// ─── 噪音生成工具 ─────────────────────────────────────

/** 创建白噪音 Buffer（单声道） */
function createNoiseBuffer(
  ctx: OfflineAudioContext,
  duration: number,
): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/** 首尾淡入淡出（避免循环时的咔哒声） */
function applyFadeInOut(buffer: AudioBuffer, fadeSec: number) {
  const fadeLen = Math.floor(buffer.sampleRate * fadeSec);
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < fadeLen && i < data.length; i++) {
      const ratio = i / fadeLen;
      data[i] *= ratio;
      data[data.length - 1 - i] *= ratio;
    }
  }
}

// ═══════════════════════════════════════════════════════
//  环境音效合成（呼吸页）
// ═══════════════════════════════════════════════════════

/**
 * 细雨 — 高频为主的过滤噪音 + 微弱的随机振幅调制
 * 模拟效果：细密雨丝打在树叶上的沙沙声
 */
async function synthesizeRain(duration = 15): Promise<AudioBuffer> {
  const sr = 22050; // 足够的采样率（雨声不需要超高频）
  const ctx = new OfflineAudioContext(2, sr * duration, sr);

  // 白噪音源
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, duration);
  noise.loop = true;

  // 带通滤波 — 模拟雨滴频率特征
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 4000;
  bp.Q.value = 0.3;

  // 高通滤波 — 去除低频隆隆声
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 800;
  hp.Q.value = 0.5;

  // 音量控制
  const gain = ctx.createGain();
  gain.gain.value = 0.25;

  // 轻微的振幅调制（雨声的自然起伏）
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15; // 很慢的起伏
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.08;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  noise.connect(bp);
  bp.connect(hp);
  hp.connect(gain);
  gain.connect(ctx.destination);
  noise.start();

  return ctx.startRendering();
}

/**
 * 海浪 — 低频为主 + 缓慢正弦振幅调制
 * 模拟效果：海浪一涨一退的节奏（约 8-10 秒一个周期）
 */
async function synthesizeOcean(duration = 20): Promise<AudioBuffer> {
  const sr = 22050;
  const ctx = new OfflineAudioContext(2, sr * duration, sr);

  // 噪音源
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, duration);
  noise.loop = true;

  // 低通滤波 — 海浪的低沉质感
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 600;
  lp.Q.value = 0.7;

  // 带通 — 加一点中频的浪花白沫声
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1500;
  bp.Q.value = 0.4;

  const lpGain = ctx.createGain();
  lpGain.gain.value = 0.35;

  const bpGain = ctx.createGain();
  bpGain.gain.value = 0.12;

  // 海浪节奏 — 缓慢正弦调制（0.1 Hz ≈ 10 秒一个浪）
  const waveLfo = ctx.createOscillator();
  waveLfo.frequency.value = 0.1;
  const waveLfoGain = ctx.createGain();
  waveLfoGain.gain.value = 0.2;
  waveLfo.connect(waveLfoGain);
  waveLfoGain.connect(lpGain.gain);
  waveLfo.start();

  // 浪花调制 — 稍快的起伏
  const foamLfo = ctx.createOscillator();
  foamLfo.frequency.value = 0.12;
  const foamLfoGain = ctx.createGain();
  foamLfoGain.gain.value = 0.06;
  foamLfo.connect(foamLfoGain);
  foamLfoGain.connect(bpGain.gain);
  foamLfo.start();

  // 低频路径
  const noise2 = ctx.createBufferSource();
  noise2.buffer = createNoiseBuffer(ctx, duration);
  noise2.loop = true;

  noise.connect(lp);
  lp.connect(lpGain);
  lpGain.connect(ctx.destination);

  noise2.connect(bp);
  bp.connect(bpGain);
  bpGain.connect(ctx.destination);

  noise.start();
  noise2.start();

  return ctx.startRendering();
}

/**
 * 山林 — 柔和粉噪 + 微弱高频闪烁（远处鸟鸣暗示）
 * 模拟效果：安静森林中树叶沙沙、远处虫鸟隐约
 */
async function synthesizeForest(duration = 20): Promise<AudioBuffer> {
  const sr = 22050;
  const ctx = new OfflineAudioContext(2, sr * duration, sr);

  // 基底：柔和的噪音（树叶沙沙）
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, duration);
  noise.loop = true;

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2500;
  bp.Q.value = 0.2;

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  // 缓慢振幅变化（风吹树叶的起伏）
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.04;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  noise.connect(bp);
  bp.connect(gain);
  gain.connect(ctx.destination);
  noise.start();

  // 远处鸟鸣暗示 — 高频正弦波短脉冲
  for (let i = 0; i < 6; i++) {
    const t = 2 + Math.random() * (duration - 4);
    const bird = ctx.createOscillator();
    bird.type = "sine";
    bird.frequency.value = 2000 + Math.random() * 2000;

    const birdGain = ctx.createGain();
    birdGain.gain.setValueAtTime(0, t);
    birdGain.gain.linearRampToValueAtTime(0.015, t + 0.05);
    birdGain.gain.linearRampToValueAtTime(0.02, t + 0.1);
    birdGain.gain.linearRampToValueAtTime(0, t + 0.25);

    bird.connect(birdGain);
    birdGain.connect(ctx.destination);
    bird.start(t);
    bird.stop(t + 0.3);
  }

  return ctx.startRendering();
}

/**
 * 清风 — 低频过滤噪音 + 极慢的调制
 * 模拟效果：和缓的微风从耳边轻轻拂过
 */
async function synthesizeWind(duration = 15): Promise<AudioBuffer> {
  const sr = 22050;
  const ctx = new OfflineAudioContext(2, sr * duration, sr);

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, duration);
  noise.loop = true;

  // 带通 — 风的特征频率
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 500;
  bp.Q.value = 0.3;

  // 低通 — 柔化
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1200;

  const gain = ctx.createGain();
  gain.gain.value = 0.2;

  // 缓慢的风速变化
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06; // 非常缓慢
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.12;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  // 滤波器频率也随风速变化
  const lfo2 = ctx.createOscillator();
  lfo2.frequency.value = 0.04;
  const lfo2Gain = ctx.createGain();
  lfo2Gain.gain.value = 200;
  lfo2.connect(lfo2Gain);
  lfo2Gain.connect(bp.frequency);
  lfo2.start();

  noise.connect(bp);
  bp.connect(lp);
  lp.connect(gain);
  gain.connect(ctx.destination);
  noise.start();

  return ctx.startRendering();
}

// ═══════════════════════════════════════════════════════
//  沉浸放松音频合成（放松引导页）
// ═══════════════════════════════════════════════════════

/**
 * 徐（慢下来）— 温暖的泛音 Drone + 轻柔高频泛音
 * 基频 174 Hz（放松基频 — 身心舒缓）
 * 意境：晚霞中的金色暖流
 */
async function synthesizeXu(duration = 30): Promise<AudioBuffer> {
  const sr = 44100;
  const ctx = new OfflineAudioContext(2, sr * duration, sr);
  const fundamental = 174;

  // 基频
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = fundamental;
  const g1 = ctx.createGain();
  g1.gain.value = 0.12;

  // 纯五度泛音
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = fundamental * 1.5;
  const g2 = ctx.createGain();
  g2.gain.value = 0.06;

  // 高八度
  const osc3 = ctx.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = fundamental * 2;
  const g3 = ctx.createGain();
  g3.gain.value = 0.04;

  // 轻微颤动（类似古琴余韵）
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 0.3;
  const vGain = ctx.createGain();
  vGain.gain.value = 1.5;
  vibrato.connect(vGain);
  vGain.connect(osc1.frequency);
  vGain.connect(osc2.frequency);

  // 呼吸般的音量起伏
  const breathLfo = ctx.createOscillator();
  breathLfo.frequency.value = 0.125; // 8 秒周期，与呼吸圆环一致
  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.03;
  breathLfo.connect(breathGain);
  breathGain.connect(g1.gain);

  osc1.connect(g1);
  osc2.connect(g2);
  osc3.connect(g3);
  g1.connect(ctx.destination);
  g2.connect(ctx.destination);
  g3.connect(ctx.destination);

  osc1.start();
  osc2.start();
  osc3.start();
  vibrato.start();
  breathLfo.start();

  return ctx.startRendering();
}

/**
 * 止（停下来）— OM 频率 Drone + 泛音
 * 基频 136.1 Hz（放松基频 — 宁静归一）
 * 意境：晨光草地上的露珠折射
 */
async function synthesizeZhi(duration = 30): Promise<AudioBuffer> {
  const sr = 44100;
  const ctx = new OfflineAudioContext(2, sr * duration, sr);
  const fundamental = 136.1;

  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = fundamental;
  const g1 = ctx.createGain();
  g1.gain.value = 0.13;

  // 大三度泛音 — 温暖和弦感
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = fundamental * 1.25;
  const g2 = ctx.createGain();
  g2.gain.value = 0.05;

  // 纯五度
  const osc3 = ctx.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = fundamental * 1.5;
  const g3 = ctx.createGain();
  g3.gain.value = 0.04;

  // 高八度（若隐若现）
  const osc4 = ctx.createOscillator();
  osc4.type = "sine";
  osc4.frequency.value = fundamental * 2;
  const g4 = ctx.createGain();
  g4.gain.value = 0.02;

  // 极轻微的颤动
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 0.2;
  const vGain = ctx.createGain();
  vGain.gain.value = 0.8;
  vibrato.connect(vGain);
  vGain.connect(osc1.frequency);

  // 缓慢的呼吸起伏
  const breathLfo = ctx.createOscillator();
  breathLfo.frequency.value = 0.125;
  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.025;
  breathLfo.connect(breathGain);
  breathGain.connect(g1.gain);

  [osc1, osc2, osc3, osc4].forEach((o) =>
    o.connect(o === osc1 ? g1 : o === osc2 ? g2 : o === osc3 ? g3 : g4),
  );
  [g1, g2, g3, g4].forEach((g) => g.connect(ctx.destination));
  [osc1, osc2, osc3, osc4, vibrato, breathLfo].forEach((o) => o.start());

  return ctx.startRendering();
}

/**
 * 定（静下来）— 深沉 Drone + 双耳微差拍
 * 基频 111 Hz（深度放松共振频率）
 * 左右声道微差 1 Hz → 产生双耳节拍（Binaural Beat），深度放松
 * 意境：花田暮色中的寂静
 */
async function synthesizeDing(duration = 30): Promise<AudioBuffer> {
  const sr = 44100;
  const ctx = new OfflineAudioContext(2, sr * duration, sr);
  const fundamental = 111;

  // 左声道基频
  const oscL = ctx.createOscillator();
  oscL.type = "sine";
  oscL.frequency.value = fundamental;
  const gL = ctx.createGain();
  gL.gain.value = 0.12;

  // 右声道基频 — 微差 1 Hz（Alpha 波双耳节拍）
  const oscR = ctx.createOscillator();
  oscR.type = "sine";
  oscR.frequency.value = fundamental + 1;
  const gR = ctx.createGain();
  gR.gain.value = 0.12;

  // 创建立体声合并器
  const merger = ctx.createChannelMerger(2);
  gL.connect(merger, 0, 0); // 左声道
  gR.connect(merger, 0, 1); // 右声道

  // 极高八度泛音（若有若无）
  const osc3 = ctx.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = fundamental * 3;
  const g3 = ctx.createGain();
  g3.gain.value = 0.015;

  // 呼吸般的音量缓动
  const breathLfo = ctx.createOscillator();
  breathLfo.frequency.value = 0.125;
  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.02;
  breathLfo.connect(breathGain);
  breathGain.connect(gL.gain);
  breathGain.connect(gR.gain);

  oscL.connect(gL);
  oscR.connect(gR);
  osc3.connect(g3);
  merger.connect(ctx.destination);
  g3.connect(ctx.destination);

  oscL.start();
  oscR.start();
  osc3.start();
  breathLfo.start();

  return ctx.startRendering();
}

// ═══════════════════════════════════════════════════════
//  公共 API — 带缓存的音频获取
// ═══════════════════════════════════════════════════════

/** 所有可合成的音频类型 */
export type AudioType =
  | "rain"
  | "ocean"
  | "forest"
  | "wind"
  | "xu"
  | "zhi"
  | "ding";

/** 各类型对应的合成函数 */
const SYNTHESIZERS: Record<AudioType, () => Promise<AudioBuffer>> = {
  rain: () => synthesizeRain(15),
  ocean: () => synthesizeOcean(20),
  forest: () => synthesizeForest(20),
  wind: () => synthesizeWind(15),
  xu: () => synthesizeXu(30),
  zhi: () => synthesizeZhi(30),
  ding: () => synthesizeDing(30),
};

/**
 * 获取指定类型的音频 Blob URL
 *
 * 首次调用时合成音频并缓存，后续调用直接返回缓存的 URL。
 * 合成过程在 OfflineAudioContext 中完成，不阻塞主线程渲染。
 *
 * @param type - 音频类型标识
 * @returns Blob URL（可直接用于 <audio src> 或 new Audio(url)）
 *
 * @example
 * const url = await getAudioUrl('rain');
 * const audio = new Audio(url);
 * audio.loop = true;
 * audio.play();
 */
export async function getAudioUrl(type: AudioType): Promise<string> {
  if (audioCache[type]) return audioCache[type];

  const synth = SYNTHESIZERS[type];
  if (!synth) {
    console.warn(`[audio-generator] 未知音频类型: ${type}`);
    return "";
  }

  try {
    const buffer = await synth();
    applyFadeInOut(buffer, 0.5); // 0.5 秒淡入淡出，确保循环无缝
    const url = audioBufferToWavUrl(buffer);
    audioCache[type] = url;
    return url;
  } catch (e) {
    console.warn(`[audio-generator] 合成失败 (${type}):`, e);
    return "";
  }
}

/**
 * 解析音频路径 — 如果是占位路径，自动替换为合成音频
 *
 * 路径映射规则：
 *   /audio/ambient-rain.mp3   → 合成雨声
 *   /audio/ambient-ocean.mp3  → 合成海浪
 *   /audio/ambient-forest.mp3 → 合成山林
 *   /audio/ambient-wind.mp3   → 合成清风
 *   /assets/audios/guzheng-relaxing.mp3 → 合成沉浸 Drone（徐/定）
 *   /assets/audios/relaxing-music.mp3   → 合成沉浸 Drone（止）
 *
 * 如果路径不匹配已知占位符，原样返回（支持未来替换为真实 CDN URL）。
 */
const PATH_MAP: Record<string, AudioType> = {
  "/audio/ambient-rain.mp3": "rain",
  "/audio/ambient-ocean.mp3": "ocean",
  "/audio/ambient-forest.mp3": "forest",
  "/audio/ambient-wind.mp3": "wind",
};

export async function resolveAudioUrl(src: string): Promise<string> {
  if (!src) return "";
  if (src.startsWith("blob:")) return src;

  const mapped = PATH_MAP[src];
  if (mapped) return getAudioUrl(mapped);

  // 未知路径，原样返回（可能是真实 CDN URL）
  return src;
}
