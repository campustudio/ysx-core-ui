/**
 * HeroBackground - 首页背景图层
 *
 * 提升到父容器层级，高度略超一屏（100vh + 60rpx），
 * 使圆角缝隙透出背景图本身，实现「卡片浮在风景上」的效果。
 */

interface HeroBackgroundProps {
  /** 背景图 URL */
  src: string;
  /** 图片 alt 文字 */
  alt?: string;
}

export function HeroBackground({
  src,
  alt = "Background",
}: HeroBackgroundProps) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-0"
      style={{ height: "calc(100vh + var(--rpx) * 60)" }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {/* 渐变遮罩 - 顶部轻暖压暗保证文字可读，主要靠text-shadow兜底，尽量保留背景图亮度 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(30,20,10,0.32) 0%, 
              rgba(30,20,10,0.15) 10%, 
              rgba(30,20,10,0.04) 25%, 
              transparent 40%, 
              transparent 75%, 
              rgba(30,20,10,0.06) 90%, 
              rgba(30,20,10,0.15) 100%
            )
          `,
        }}
      />
    </div>
  );
}