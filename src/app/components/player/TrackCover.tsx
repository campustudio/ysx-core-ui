/**
 * TrackCover - 圆形曲目封面
 *
 * 播放页核心视觉元素，呼应呼吸圆环的圆形语言
 * 外围带柔和琥珀金光晕环，播放时缓慢旋转
 *
 * 三层结构：
 *   外层光晕环 — 琥珀金渐变，播放时缓转（60s一圈）
 *   中层容器  — overflow:hidden 裁切为圆形
 *   内层图片  — object-cover 填充
 *
 * Props:
 * - src: 封面图 URL
 * - size: 尺寸（rpx 值），默认 360
 * - isPlaying: 是否播放中（控制旋转动画）
 */

interface TrackCoverProps {
  /** 封面图 URL */
  src: string;
  /** 尺寸（rpx 值），默认 360 */
  size?: number;
  /** 是否播放中（播放时光晕环缓转） */
  isPlaying?: boolean;
}

export function TrackCover({
  src,
  size = 360,
  isPlaying = false,
}: TrackCoverProps) {
  const outerSize = `calc(var(--rpx) * ${size})`;
  const innerSize = `calc(var(--rpx) * ${size - 24})`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: outerSize, height: outerSize }}
    >
      {/* 外层光晕环 — 播放时缓慢旋转 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(196,154,108,0.3), rgba(196,154,108,0.05), rgba(196,154,108,0.2), rgba(196,154,108,0.05), rgba(196,154,108,0.3))",
          animation: isPlaying ? "coverGlow 60s linear infinite" : "none",
          opacity: isPlaying ? 1 : 0.5,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* 柔和光晕散射 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: isPlaying
            ? "0 0 60px rgba(196,154,108,0.2), 0 0 120px rgba(196,154,108,0.08)"
            : "0 0 40px rgba(196,154,108,0.1)",
          transition: "box-shadow 0.8s ease",
        }}
      />

      {/* 圆形封面图 */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: innerSize,
          height: innerSize,
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <img
          src={src}
          alt="Track cover"
          className="w-full h-full object-cover"
          style={{
            transform: "scale(1.05)",
          }}
        />
        {/* 内侧渐变遮罩 — 让图片边缘柔和过渡 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "inset 0 0 30px rgba(30,20,10,0.15)",
          }}
        />
      </div>

      {/* 光晕旋转动画 */}
      <style>{`
        @keyframes coverGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
