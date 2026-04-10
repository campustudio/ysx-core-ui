import React, { useRef } from "react";
import { MetaLogo, LogoVariant } from "../components/shared/MetaLogo";
import { ArrowLeft, Download } from "lucide-react";

interface LogoPreviewPageProps {
  onBack: () => void;
}

export function LogoPreviewPage({ onBack }: LogoPreviewPageProps) {
  // 导出高清 PNG 的核心逻辑
  const exportToPNG = (variant: LogoVariant, bgColor: string, filename: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. 绘制背景色 (符合 App Store 要求的实心正方形)
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. 获取目标 SVG 元素的 HTML 字符串
    // 为了不依赖 DOM 查询，我们临时动态创建一个 SVG 字符串
    // 将 MetaLogo 的大小放大以适配 1024 画布
    // 注意：需要将 base64 编码的 SVG 作为图片的 src
    const svgString = `
      <svg width="1024" height="1024" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gold-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stop-color="#FFF4D0" />
            <stop offset="30%" stop-color="#F5D061" />
            <stop offset="70%" stop-color="#D4A353" />
            <stop offset="100%" stop-color="#9E762B" />
          </linearGradient>
          <radialGradient id="blue-grad" gradientUnits="userSpaceOnUse" cx="100" cy="100" r="120">
            <stop offset="0%" stop-color="#E0FFFF" />
            <stop offset="40%" stop-color="#00E5FF" />
            <stop offset="80%" stop-color="#007BFF" />
            <stop offset="100%" stop-color="#0A2A5C" />
          </radialGradient>
          <filter id="engrave-light" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="0" dy="1.5" in="SourceAlpha" result="offAlphaWhite"/>
            <feGaussianBlur stdDeviation="0.5" in="offAlphaWhite" result="blurAlphaWhite"/>
            <feFlood flood-color="#FFFFFF" flood-opacity="1" result="colorWhite"/>
            <feComposite operator="in" in="colorWhite" in2="blurAlphaWhite" result="shadowWhite"/>
            <feOffset dx="0" dy="1.5" in="SourceAlpha" result="offAlphaDark"/>
            <feGaussianBlur stdDeviation="1" in="offAlphaDark" result="blurAlphaDark"/>
            <feComposite operator="out" in="SourceGraphic" in2="blurAlphaDark" result="innerShadowMask"/>
            <feFlood flood-color="#B0B0BC" flood-opacity="1" result="colorDark"/>
            <feComposite operator="in" in="colorDark" in2="innerShadowMask" result="innerShadowDark"/>
            <feMerge result="trench">
              <feMergeNode in="shadowWhite"/>
              <feMergeNode in="SourceGraphic"/>
              <feMergeNode in="innerShadowDark"/>
            </feMerge>
          </filter>
          <filter id="engrave-dark" x="-30%" y="-30%" width="160%" height="160%">
            <feOffset dx="1" dy="1" in="SourceAlpha" result="darkOffAlpha1A"/>
            <feGaussianBlur stdDeviation="0.6" in="darkOffAlpha1A" result="darkBlurAlpha1A"/>
            <feComposite operator="out" in="SourceGraphic" in2="darkBlurAlpha1A" result="darkInnerShadowMask1A"/>
            <feFlood flood-color="#000000" flood-opacity="1" result="darkShadowColor1A"/>
            <feComposite operator="in" in="darkShadowColor1A" in2="darkInnerShadowMask1A" result="darkInnerShadow1A"/>
            <feOffset dx="3" dy="3" in="SourceAlpha" result="darkOffAlpha1B"/>
            <feGaussianBlur stdDeviation="2.5" in="darkOffAlpha1B" result="darkBlurAlpha1B"/>
            <feComposite operator="out" in="SourceGraphic" in2="darkBlurAlpha1B" result="darkInnerShadowMask1B"/>
            <feFlood flood-color="#000000" flood-opacity="1" result="darkShadowColor1B"/>
            <feComposite operator="in" in="darkShadowColor1B" in2="darkInnerShadowMask1B" result="darkInnerShadow1B"/>
            <feMerge result="darkTrench">
              <feMergeNode in="SourceGraphic"/>
              <feMergeNode in="darkInnerShadow1B"/>
              <feMergeNode in="darkInnerShadow1A"/>
            </feMerge>
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
        
        <g filter="${variant === 'engraved' ? 'url(#engrave-light)' : 'url(#engrave-dark)'}">
          <g opacity="0.95">
            <ellipse cx="100" cy="100" rx="76" ry="24" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '2.5' : '1.8'}" />
            <ellipse cx="100" cy="100" rx="82" ry="28" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '1' : '0.5'}" opacity="0.6" />
            <g transform="rotate(22 100 100)">
              <ellipse cx="100" cy="100" rx="76" ry="24" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '2.5' : '1.8'}" />
              <ellipse cx="100" cy="100" rx="82" ry="28" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '1' : '0.5'}" opacity="0.6" />
            </g>
            <g transform="rotate(-22 100 100)">
              <ellipse cx="100" cy="100" rx="76" ry="24" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '2.5' : '1.8'}" />
              <ellipse cx="100" cy="100" rx="82" ry="28" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '1' : '0.5'}" opacity="0.6" />
            </g>
          </g>
          <circle cx="100" cy="100" r="22" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '4' : '3'}" fill="none" />
          <circle cx="100" cy="100" r="17" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="0.8" opacity="0.7" />
          <path d="M100 16 L100 78" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '3.5' : '2.5'}" stroke-linecap="round" />
          <path d="M100 122 L100 184" stroke="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" stroke-width="${variant === 'engraved' ? '3.5' : '2.5'}" stroke-linecap="round" />
          <path d="M100 0 Q100 24 116 24 Q100 24 100 48 Q100 24 84 24 Q100 24 100 0 Z" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <path d="M100 152 Q100 176 116 176 Q100 176 100 200 Q100 176 84 176 Q100 176 100 152 Z" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <path d="M34 34 Q40 40 46 34 Q40 40 40 46 Q40 40 34 40 Q40 40 34 34 Z" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <path d="M166 166 Q160 160 154 166 Q160 160 160 154 Q160 160 166 160 Q160 160 166 166 Z" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <path d="M166 34 Q160 40 154 34 Q160 40 160 46 Q160 40 166 40 Q160 40 166 34 Z" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <path d="M34 166 Q40 160 46 166 Q40 160 40 154 Q40 160 34 160 Q40 160 34 166 Z" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <circle cx="68" cy="80" r="1.8" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <circle cx="132" cy="120" r="1.8" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <circle cx="132" cy="80" r="1.8" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
          <circle cx="68" cy="120" r="1.8" fill="${variant === 'engraved' ? '#E5E5EA' : variant === 'gold' ? 'url(#gold-grad)' : 'url(#blue-grad)'}" />
        </g>
      </svg>
    `;

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // 保证图片画在正中央
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);
      
      // 下载
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = filename;
      a.click();
    };
    img.src = url;
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#F5F5F7", 
      padding: "2rem",
      paddingBottom: "6rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* 头部导航 */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "3rem", cursor: "pointer" }} onClick={onBack}>
        <ArrowLeft size={24} color="#333" />
        <span style={{ marginLeft: "8px", fontSize: "18px", fontWeight: 500, color: "#333" }}>返回首页</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "28px", color: "#111", marginBottom: "1rem" }}>Logo 视觉实验室</h1>
        <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
          在这里您可以放大查看 Logo 的每一处细节。
          所有版本均统一应用了“玻璃折射+石刻凹陷”的材质滤镜，并统一固定了“感知星芒”的对称坐标点。
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "5rem", alignItems: "center" }}>
        
        {/* 1. 原始基底版 (同色系石刻) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "800px" }}>
          <h2 style={{ fontSize: "20px", color: "#333", marginBottom: "2rem", letterSpacing: "2px" }}>1. 原始基底版 (同色系石刻)</h2>
          <div style={{ display: "flex", gap: "4rem", flexWrap: "nowrap", justifyContent: "center", padding: "2rem", width: "100%", overflowX: "auto" }}>
            {/* 方形大图 */}
            <div style={{ 
              padding: "40px", 
              backgroundColor: "#F5F5F7", 
              borderRadius: "40px", 
              boxShadow: "inset 8px 8px 20px rgba(0,0,0,0.06), inset -8px -8px 20px rgba(255,255,255,1), 4px 4px 15px rgba(0,0,0,0.05)" 
            }}>
              <MetaLogo size={240} variant="engraved" />
            </div>
            {/* 圆形大图 */}
            <div style={{ 
              padding: "40px", 
              backgroundColor: "#F5F5F7", 
              borderRadius: "50%", 
              boxShadow: "inset 8px 8px 20px rgba(0,0,0,0.06), inset -8px -8px 20px rgba(255,255,255,1), 4px 4px 15px rgba(0,0,0,0.05)" 
            }}>
              <MetaLogo size={240} variant="engraved" />
            </div>
          </div>
          <button 
            onClick={() => exportToPNG("engraved", "#F5F5F7", "Meta-Logo-Engraved-1024.png")}
            style={{ marginTop: "1rem", padding: "12px 24px", backgroundColor: "#fff", border: "1px solid #E5E5EA", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          >
            <Download size={16} /> 导出 1024x1024 上架级 PNG
          </button>
        </div>

        {/* 2. 高维发光金版 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "800px" }}>
          <h2 style={{ fontSize: "20px", color: "#D4A353", marginBottom: "2rem", letterSpacing: "2px" }}>2. 高维能量版 (发光金)</h2>
          <div style={{ display: "flex", gap: "4rem", flexWrap: "nowrap", justifyContent: "center", width: "100%", boxSizing: "border-box", overflowX: "auto" }}>
            {/* 方形大图 - 恢复透亮、通透的玻璃底板感，抛弃向内的凹洞错觉 */}
            <div style={{ 
              padding: "40px", 
              backgroundColor: "#13100A", // 透着微弱金色的极暗玻璃板
              borderRadius: "40px", 
              border: "1px solid rgba(212, 163, 83, 0.15)", // 玻璃边缘的微光反光
              boxShadow: "inset 0 0 40px rgba(212, 163, 83, 0.05), 0 8px 24px rgba(0,0,0,0.06)", // 内部透金光，外部仅保留极其微弱的投影，彻底去除原本黑背景的残留感
              backdropFilter: "blur(20px)"
            }}>
              <MetaLogo size={240} variant="gold" />
            </div>
            {/* 圆形大图 */}
            <div style={{ 
              padding: "40px", 
              backgroundColor: "#13100A", 
              borderRadius: "50%", 
              border: "1px solid rgba(212, 163, 83, 0.15)",
              boxShadow: "inset 0 0 40px rgba(212, 163, 83, 0.05), 0 8px 24px rgba(0,0,0,0.06)",
              backdropFilter: "blur(20px)"
            }}>
              <MetaLogo size={240} variant="gold" />
            </div>
          </div>
          <button 
            onClick={() => exportToPNG("gold", "#13100A", "Meta-Logo-Gold-1024.png")}
            style={{ marginTop: "1rem", padding: "12px 24px", backgroundColor: "#13100A", border: "1px solid rgba(212, 163, 83, 0.3)", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#D4A353", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            <Download size={16} /> 导出 1024x1024 上架级 PNG
          </button>
        </div>

        {/* 3. 科技全息蓝版 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "800px" }}>
          <h2 style={{ fontSize: "20px", color: "#00E5FF", marginBottom: "2rem", letterSpacing: "2px" }}>3. 全息水晶蓝版 (科技宇宙)</h2>
          <div style={{ display: "flex", gap: "4rem", flexWrap: "nowrap", justifyContent: "center", width: "100%", boxSizing: "border-box", overflowX: "auto" }}>
            {/* 方形大图 - 恢复透亮通透的全息蓝玻璃底板 */}
            <div style={{ 
              padding: "40px", 
              backgroundColor: "#050914", // 深邃的星空蓝暗玻璃
              borderRadius: "40px", 
              border: "1px solid rgba(0, 229, 255, 0.15)", // 蓝光玻璃倒角
              boxShadow: "inset 0 0 40px rgba(0, 229, 255, 0.05), 0 8px 24px rgba(0,0,0,0.06)", // 极微弱投影，彻底去除阴影块残留感
              backdropFilter: "blur(20px)"
            }}>
              <MetaLogo size={240} variant="blue" />
            </div>
            {/* 圆形大图 */}
            <div style={{ 
              padding: "40px", 
              backgroundColor: "#050914", 
              borderRadius: "50%", 
              border: "1px solid rgba(0, 229, 255, 0.15)",
              boxShadow: "inset 0 0 40px rgba(0, 229, 255, 0.05), 0 8px 24px rgba(0,0,0,0.06)",
              backdropFilter: "blur(20px)"
            }}>
              <MetaLogo size={240} variant="blue" />
            </div>
          </div>
          <button 
            onClick={() => exportToPNG("blue", "#050914", "Meta-Logo-Blue-1024.png")}
            style={{ marginTop: "1rem", padding: "12px 24px", backgroundColor: "#050914", border: "1px solid rgba(0, 229, 255, 0.3)", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#00E5FF", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            <Download size={16} /> 导出 1024x1024 上架级 PNG
          </button>
        </div>

      </div>
    </div>
  );
}