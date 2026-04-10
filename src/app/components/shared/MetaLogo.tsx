import React from "react";

export type LogoVariant = "engraved" | "gold" | "blue" | "default";

interface MetaLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: LogoVariant;
  color?: string; // used only if variant is "default"
}

export function MetaLogo({ size = 120, variant = "default", color = "currentColor", style, ...props }: MetaLogoProps) {
  // === Colors & Gradients Setup ===
  const isEngraved = variant === "engraved";
  const isGold = variant === "gold";
  const isBlue = variant === "blue";

  // 💡 修复刻画感：不再使用深黑色（像画上去的），而是使用“与底板相近，但微暗一点”的材质色。
          // 石刻版：采用经典的“活版印刷 (Letterpress)”视觉原理，使用比背景略深的纯平灰色，拒绝任何复杂的多重阴影
  // 金色版/蓝色版：使用渐变色填充凹槽，通过强烈内阴影表现凹陷
  const baseColor = isGold ? "url(#gold-grad)" : isBlue ? "url(#blue-grad)" : isEngraved ? "#E5E5EA" : color;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible", ...style }}
      {...props}
    >
      <defs>
        {/* 💡 修复垂直中轴线消失 Bug：
            渐变必须使用 gradientUnits="userSpaceOnUse"，
            否则宽度为0的垂直直线 (x1="100" x2="100") 无法计算相对渐变范围，导致整条线隐身！*/}
        <linearGradient id="gold-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stopColor="#FFF4D0" />
          <stop offset="30%" stopColor="#F5D061" />
          <stop offset="70%" stopColor="#D4A353" />
          <stop offset="100%" stopColor="#9E762B" />
        </linearGradient>

        <radialGradient id="blue-grad" gradientUnits="userSpaceOnUse" cx="100" cy="100" r="120">
          <stop offset="0%" stopColor="#E0FFFF" />
          <stop offset="40%" stopColor="#00E5FF" />
          <stop offset="80%" stopColor="#007BFF" />
          <stop offset="100%" stopColor="#0A2A5C" />
        </radialGradient>

        {/* === 滤镜 1：针对亮色底板的【活版印刷深深刻字滤镜】 (Engraved) === */}
        {/* 放弃之前复杂的模拟自然光多层阴影，改用 Apple iOS 经典的“Letterpress (活版印刷)”物理压刻效果：
            一条比底色深的纯平线条，在它的下边缘加上极细的白色高光，上边缘加上极细的黑色内阴影。
            这是人类视觉在平面屏幕上唯一 100% 不会看成凸起的“凹刻”处理方式。*/}
        <filter id="engrave-light" x="-20%" y="-20%" width="140%" height="140%">
          
          {/* 1. 外部底部的白边反光 (模拟刻痕下沿迎光面) */}
          <feOffset dx="0" dy="1.5" in="SourceAlpha" result="offAlphaWhite"/>
          <feGaussianBlur stdDeviation="0.5" in="offAlphaWhite" result="blurAlphaWhite"/>
          <feFlood floodColor="#FFFFFF" floodOpacity="1" result="colorWhite"/>
          <feComposite operator="in" in="colorWhite" in2="blurAlphaWhite" result="shadowWhite"/>

          {/* 2. 内部上方的深灰内阴影 (模拟刻痕上沿背光面) */}
          <feOffset dx="0" dy="1.5" in="SourceAlpha" result="offAlphaDark"/>
          <feGaussianBlur stdDeviation="1" in="offAlphaDark" result="blurAlphaDark"/>
          <feComposite operator="out" in="SourceGraphic" in2="blurAlphaDark" result="innerShadowMask"/>
          <feFlood floodColor="#B0B0BC" floodOpacity="1" result="colorDark"/>
          <feComposite operator="in" in="colorDark" in2="innerShadowMask" result="innerShadowDark"/>

          {/* 严格按顺序合并：白底反光 -> 本体形状 -> 顶部黑内阴影。产生完美的平面冲压感 */}
          <feMerge result="trench">
            <feMergeNode in="shadowWhite"/>
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="innerShadowDark"/>
          </feMerge>
        </filter>

        {/* === 滤镜 2：针对暗色底板的【发光沟槽滤镜】 (Gold/Blue) === */}
        {/* 加入两层内阴影：紧贴边缘的小号(压住细光环/星芒)，以及覆盖整个刻槽的大号(压住中轴/粗环) */}
        <filter id="engrave-dark" x="-30%" y="-30%" width="160%" height="160%">
          {/* 1A. 小号极黑内阴影 (专治细线和星芒，因为 dx=3 的内阴影根本抓不到 strokeWidth=1 的细线，导致它看起来像平面的) */}
          <feOffset dx="1" dy="1" in="SourceAlpha" result="darkOffAlpha1A"/>
          <feGaussianBlur stdDeviation="0.6" in="darkOffAlpha1A" result="darkBlurAlpha1A"/>
          <feComposite operator="out" in="SourceGraphic" in2="darkBlurAlpha1A" result="darkInnerShadowMask1A"/>
          <feFlood floodColor="#000000" floodOpacity="1" result="darkShadowColor1A"/>
          <feComposite operator="in" in="darkShadowColor1A" in2="darkInnerShadowMask1A" result="darkInnerShadow1A"/>

          {/* 1B. 大号极黑内阴影 (给粗壮的中心环和中轴线施加深渊感) */}
          <feOffset dx="3" dy="3" in="SourceAlpha" result="darkOffAlpha1B"/>
          <feGaussianBlur stdDeviation="2.5" in="darkOffAlpha1B" result="darkBlurAlpha1B"/>
          <feComposite operator="out" in="SourceGraphic" in2="darkBlurAlpha1B" result="darkInnerShadowMask1B"/>
          <feFlood floodColor="#000000" floodOpacity="1" result="darkShadowColor1B"/>
          <feComposite operator="in" in="darkShadowColor1B" in2="darkInnerShadowMask1B" result="darkInnerShadow1B"/>

          <feMerge result="darkTrench">
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="darkInnerShadow1B"/>
            <feMergeNode in="darkInnerShadow1A"/>
          </feMerge>

          {/* 2. 沟槽光向外的弥散感 */}
          <feGaussianBlur stdDeviation="8" in="SourceGraphic" result="glowBlur" />
          <feComponentTransfer in="glowBlur" result="glowBoost">
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>

          <feMerge>
            <feMergeNode in="glowBoost" />
            <feMergeNode in="darkTrench" />
          </feMerge>
        </filter>
      </defs>

      {/* 应用材质滤镜 */}
      <g filter={isEngraved ? "url(#engrave-light)" : (isGold || isBlue) ? "url(#engrave-dark)" : undefined}>
        
        {/* ══ 1. 外围双层共感交织轨道 (频率波纹) ══ */}
        <g opacity="0.95">
          {/* 水平环轨 */}
          <ellipse cx="100" cy="100" rx="76" ry="24" stroke={baseColor} strokeWidth={isEngraved ? "2.5" : "1.8"} />
          <ellipse cx="100" cy="100" rx="82" ry="28" stroke={baseColor} strokeWidth={isEngraved ? "1" : "0.5"} opacity="0.6" />
          
          {/* 倾斜环轨 - 左上至右下 */}
          <g transform="rotate(22 100 100)">
            <ellipse cx="100" cy="100" rx="76" ry="24" stroke={baseColor} strokeWidth={isEngraved ? "2.5" : "1.8"} />
            <ellipse cx="100" cy="100" rx="82" ry="28" stroke={baseColor} strokeWidth={isEngraved ? "1" : "0.5"} opacity="0.6" />
          </g>
          
          {/* 倾斜环轨 - 右上至左下 */}
          <g transform="rotate(-22 100 100)">
            <ellipse cx="100" cy="100" rx="76" ry="24" stroke={baseColor} strokeWidth={isEngraved ? "2.5" : "1.8"} />
            <ellipse cx="100" cy="100" rx="82" ry="28" stroke={baseColor} strokeWidth={isEngraved ? "1" : "0.5"} opacity="0.6" />
          </g>
        </g>

        {/* ══ 2. 核心：空性明环 (明镜系统/感知原点) ══ */}
        {/* 修复：绝对保持中心空性通透，不能有任何底层填充物遮蔽，无论是任何变体 */}
        <circle cx="100" cy="100" r="22" stroke={baseColor} strokeWidth={isEngraved ? "4" : "3"} fill="none" />
        {/* 内层极细光晕圈 (增强玻璃/明镜质感) */}
        <circle cx="100" cy="100" r="17" stroke={baseColor} strokeWidth="0.8" opacity="0.7" />

        {/* ══ 3. 天地贯通的中轴 (源频降落，已修复渐变隐身Bug) ══ */}
        {/* 为了保证在 userSpaceOnUse 渐变下依然能产生足够的 bounding box 计算面积，将 line 改为极窄的 rect 或 path */}
        <path d="M100 16 L100 78" stroke={baseColor} strokeWidth={isEngraved ? "3.5" : "2.5"} strokeLinecap="round" />
        <path d="M100 122 L100 184" stroke={baseColor} strokeWidth={isEngraved ? "3.5" : "2.5"} strokeLinecap="round" />

        {/* ══ 4. 上下火种 (天地两极的锚点) ══ */}
        <path d="M100 0 Q100 24 116 24 Q100 24 100 48 Q100 24 84 24 Q100 24 100 0 Z" fill={baseColor} />
        <path d="M100 152 Q100 176 116 176 Q100 176 100 200 Q100 176 84 176 Q100 176 100 152 Z" fill={baseColor} />

        {/* ══ 5. 严格且精确的 8 颗对称感知星芒 (已修正数量与位置，清理了多余的点) ══ */}
        {/* 外围对角线上的 4 颗微型菱形星芒（固定在宇宙四隅） */}
        <path d="M34 34 Q40 40 46 34 Q40 40 40 46 Q40 40 34 40 Q40 40 34 34 Z" fill={baseColor} />
        <path d="M166 166 Q160 160 154 166 Q160 160 160 154 Q160 160 166 160 Q160 160 166 166 Z" fill={baseColor} />
        <path d="M166 34 Q160 40 154 34 Q160 40 160 46 Q160 40 166 40 Q160 40 166 34 Z" fill={baseColor} />
        <path d="M34 166 Q40 160 46 166 Q40 160 40 154 Q40 160 34 160 Q40 160 34 166 Z" fill={baseColor} />

        {/* 内环轨道交织处的 4 颗共鸣节点（固定在量子能量场中心附近） */}
        <circle cx="68" cy="80" r="1.8" fill={baseColor} />
        <circle cx="132" cy="120" r="1.8" fill={baseColor} />
        <circle cx="132" cy="80" r="1.8" fill={baseColor} />
        <circle cx="68" cy="120" r="1.8" fill={baseColor} />
      </g>
    </svg>
  );
}