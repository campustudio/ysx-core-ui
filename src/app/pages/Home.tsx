import { useState, useEffect } from "react";
import { FONT_SERIF } from "../config/styles";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/shared/Toast";
import { Code } from "lucide-react";
import bgLayer1 from "@/assets/images/home/1-menqian.webp";
import bgLayer2 from "@/assets/images/home/2-dingqi.webp";
import bgLayer3 from "@/assets/images/home/3-neidan.webp";
import iconBook from "@/assets/images/home/icon-book.webp";
import iconPath from "@/assets/images/home/icon-path.webp";
import iconMirror from "@/assets/images/home/icon-mirror.webp";
import iconGrid from "@/assets/images/home/icon-grid.webp";

interface HomeProps {
  onNavChange?: (index: number) => void;
  onToggleMode?: () => void;
}

export function Home({ onNavChange, onToggleMode }: HomeProps) {
  const toast = useToast();

  // ================= 视图层逻辑 =================
  const [layer, setLayer] = useState<1 | 2 | 3>(1);
  const [phase1, setPhase1] = useState(0);
  const [phase2, setPhase2] = useState(0);
  const [phase3, setPhase3] = useState(0);

  useEffect(() => {
    if (layer === 1) {
      const t1 = setTimeout(() => setPhase1(1), 800);
      const t2 = setTimeout(() => setPhase1(2), 2500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [layer]);

  useEffect(() => {
    if (layer === 2) {
      const t1 = setTimeout(() => setPhase2(1), 1000);
      const t2 = setTimeout(() => setPhase2(2), 3500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [layer]);

  useEffect(() => {
    if (layer === 3) {
      const t1 = setTimeout(() => setPhase3(1), 1000);
      return () => clearTimeout(t1);
    }
  }, [layer]);

  const handleEnterLayer2 = () => {
    setPhase1(0);
    setTimeout(() => setLayer(2), 1200);
  };

  const handleEnterLayer3 = () => {
    setPhase2(0);
    setTimeout(() => setLayer(3), 1500);
  };

  const handleNavClick = (navIndex: number, title: string) => {
    if (navIndex === 1 || navIndex === 2) {
      onNavChange?.(navIndex);
    } else {
      toast.show(`「${title}」正在精心筹备中，敬请期待`);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#EFEFF2",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* 返回代码版按钮 */}
      {/* <button
        onClick={onToggleMode}
        className="absolute top-5 left-5 z-50 flex items-center justify-center p-2 rounded-full bg-black/10 backdrop-blur-md border border-white/30 text-white/90 hover:bg-black/20 transition-all cursor-pointer active:scale-95"
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        title="返回纯代码版"
      >
        <Code size={20} strokeWidth={1.5} />
      </button> */}

      {/* 三层背景图 */}
      <img
        src={bgLayer1}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-all duration-[3000ms] ease-out pointer-events-none"
        style={{
          opacity: layer === 1 ? 1 : 0,
          filter:
            layer === 1 ? "blur(0px) saturate(1.1)" : "blur(12px) saturate(1)",
          transform: layer === 1 ? "scale(1)" : "scale(1.05)",
        }}
      />
      <img
        src={bgLayer2}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-all duration-[3000ms] ease-out pointer-events-none"
        style={{
          opacity: layer === 2 ? 1 : 0,
          filter:
            layer === 2
              ? "blur(0px) saturate(1.1) brightness(1.0)"
              : layer === 1
                ? "blur(12px) saturate(1)"
                : "blur(10px) saturate(1.1)",
          transform:
            layer === 2
              ? "scale(1)"
              : layer === 1
                ? "scale(0.95)"
                : "scale(1.05)",
        }}
      />
      {/* Layer 3：模糊光源图（与纯代码版完全一致） */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: layer === 3 ? 1 : 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1760891847887-57578cee649d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhlcmVhbCUyMGdvbGRlbiUyMGdsb3dpbmclMjBsaWdodCUyMGFic3RyYWN0JTIwZGFya3xlbnwxfHx8fDE3NzY1MTcwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(9px) saturate(1.2) brightness(0.8)",
          transition: "opacity 3000ms ease-out",
          transitionDelay: layer === 3 ? "1s" : "0s",
        }}
      />
      {/* Layer 3：渐变遮罩（与纯代码版完全一致） */}
      <div
        className="absolute inset-0 transition-all duration-[3000ms] pointer-events-none"
        style={{
          opacity: layer === 3 ? 1 : 0,
          background: `
            radial-gradient(ellipse 70% 50% at 50% 38%, rgba(255,255,253,0.5) 0%, rgba(248,245,240,0.25) 60%, transparent 100%),
            linear-gradient(to bottom, rgba(250,250,247,0.88) 0%, rgba(248,245,238,0.2) 50%, rgba(242,235,220,0.08) 100%),
            linear-gradient(to top, rgba(245,242,235,0.7) 0%, rgba(248,245,240,0.25) 25%, transparent 50%)
          `,
        }}
      />
      {/* Layer 3：自然色点缀 + 水银镜面光（极淡） */}
      <div
        className="absolute inset-0 transition-all duration-[3000ms] pointer-events-none"
        style={{
          opacity: layer === 3 ? 1 : 0,
          background: `
            radial-gradient(circle at 8% 72%, rgba(110,160,105,0.25) 0%, rgba(120,165,110,0.09) 15%, transparent 28%),
            radial-gradient(circle at 92% 65%, rgba(105,155,100,0.18) 0%, rgba(115,160,105,0.06) 12%, transparent 25%),
            radial-gradient(circle at 82% 88%, rgba(120,155,200,0.35) 0%, rgba(130,160,200,0.12) 14%, transparent 25%),
            radial-gradient(circle at 12% 22%, rgba(130,165,210,0.28) 0%, rgba(140,170,210,0.1) 12%, transparent 22%),
            radial-gradient(ellipse 30% 8% at 75% 15%, rgba(255,255,255,0.2) 0%, transparent 80%)
          `,
        }}
      />

      {/* =========== 第一层：门前层 =========== */}
      {layer === 1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 环境光：拱门光源辐射（暖白色调） */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(255,248,235,0.35) 0%, rgba(255,255,255,0) 70%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />

          <div style={{ height: "30vh" }} />
          <div
            style={{
              height: "40vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              top: "-2vh",
            }}
          >
            {/* 文字背光：椭圆柔和白光净化背景 */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -55%)",
                width: "60vw",
                height: "30vh",
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
                filter: "blur(12px)",
                pointerEvents: "none",
              }}
            />
            <h1
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(3.5rem, 12vw, 5rem)",
                fontWeight: 500,
                color: "#1A1A1A",
                letterSpacing: "0.2em",
                margin: 0,
                marginBottom: "4rem",
                opacity: phase1 >= 1 ? 1 : 0,
                filter: phase1 >= 1 ? "blur(0px)" : "blur(12px)",
                transform: phase1 >= 1 ? "scale(1)" : "scale(1.02)",
                transition: "all 3s cubic-bezier(0.16, 1, 0.3, 1)",
                textShadow:
                  "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)",
              }}
            >
              元感知
            </h1>
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                fontWeight: 500,
                color: "#1A1A1A",
                letterSpacing: "0.3em",
                margin: 0,
                opacity: phase1 >= 1 ? 1 : 0,
                filter: phase1 >= 1 ? "blur(0px)" : "blur(8px)",
                transition: "all 3.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                textShadow:
                  "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)",
                textAlign: "center",
                padding: "0 1rem",
              }}
            >
              为人类留下一条清明之路。
            </p>
          </div>
          <div
            style={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              onClick={handleEnterLayer2}
              style={{
                fontFamily: "system-ui",
                fontSize: "1.1rem",
                color: "#444",
                letterSpacing: "0.4em",
                textShadow: "0 1px 1px rgba(255,255,255,0.8)",
                cursor: "pointer",
                opacity: phase1 >= 2 ? 1 : 0,
                transition: "opacity 2s ease",
              }}
            >
              开启
            </span>
          </div>
        </div>
      )}

      {/* =========== 第二层：穿门层 =========== */}
      {layer === 2 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 高频澄澈吸入光斑：绝对弃用黑色！用强光辐射营造极简吸入感 */}
          {/* <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 250, 240, 0.7) 0%, rgba(255, 235, 190, 0.15) 35%, rgba(255, 255, 255, 0.02) 100%)",
              mixBlendMode: "screen",
            }}
          /> */}

          <div
            style={{
              height: "70vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 2rem",
              position: "relative",
            }}
          >
            {/* 文字背光：琥珀金色高斯模糊 */}
            {/* <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "50vw",
                height: "25vh",
                background:
                  "radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, rgba(255,255,255,0) 70%)",
                filter: "blur(16px)",
                pointerEvents: "none",
              }}
            /> */}
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                fontWeight: 500,
                color: "#1A1A1A",
                letterSpacing: "0.2em",
                margin: 0,
                textAlign: "center",
                lineHeight: 2,
                opacity: phase2 >= 1 ? 1 : 0,
                transform: phase2 >= 1 ? "scale(1)" : "scale(0.98)",
                filter: phase2 >= 1 ? "blur(0px)" : "blur(12px)",
                transition: "all 3s cubic-bezier(0.16, 1, 0.3, 1)",
                textShadow:
                  "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1), 0 0 30px rgba(255,255,255,0.6)",
              }}
            >
              在这里，
              <br className="md:hidden" />
              <span
                style={{
                  fontWeight: 900,
                  color: "#1A1A1A",
                  fontSize: "1.15em",
                  letterSpacing: "0.25em",
                  marginRight: "-0.1em",
                  textShadow:
                    "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1), 0 0 40px rgba(212,175,55,0.8)",
                  display: "inline-block",
                  transform: "scale(1.05)",
                  position: "relative",
                }}
              >
                真实
              </span>
              高于一切。
            </h2>
          </div>
          <div
            style={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span
              onClick={handleEnterLayer3}
              style={{
                fontFamily: "system-ui",
                fontSize: "1.1rem",
                color: "#444",
                letterSpacing: "0.4em",
                textShadow: "0 1px 1px rgba(255,255,255,0.8)",
                cursor: "pointer",
                opacity: phase2 >= 2 ? 1 : 0,
                transition: "opacity 2s ease",
              }}
            >
              继续
            </span>
          </div>
        </div>
      )}

      {/* =========== 第三层：内殿层 =========== */}
      {layer === 3 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: phase3 === 0 ? 0 : 1,
            transition: "opacity 1.5s ease",
            padding: "1rem",
          }}
        >
          <div style={{ height: "5vh" }} />

          <div className="flex-1 w-full max-w-4xl flex items-center justify-center pb-[5vh] relative">
            {/* 光斑层：模拟代码版的光场通透效果 */}
            <div
              className="absolute inset-0 pointer-events-none"
              // style={{
              //   background: [
              //     "radial-gradient(ellipse 60% 50% at 30% 35%, rgba(218,195,145,0.3) 0%, transparent 70%)",
              //     "radial-gradient(ellipse 50% 60% at 75% 55%, rgba(200,185,155,0.25) 0%, transparent 70%)",
              //     "radial-gradient(ellipse 80% 40% at 50% 80%, rgba(230,215,180,0.2) 0%, transparent 70%)",
              //     "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(240,230,210,0.2) 0%, transparent 60%)",
              //   ].join(", "),
              //   filter: "blur(25px)",
              // }}
            />
            <div
              className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10 w-full relative z-10"
              style={{
                opacity: phase3 >= 1 ? 1 : 0,
                transform:
                  phase3 >= 1
                    ? "translateY(0) scale(1)"
                    : "translateY(-20px) scale(1.03)",
                filter: phase3 >= 1 ? "blur(0px)" : "blur(16px)",
                transition: "all 3.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {[
                {
                  id: 1,
                  title: "人类手册馆",
                  subtitle: "看见真相，回到生命本身。",
                  iconSrc: iconBook,
                  iconScaleX: 1.0,
                  iconScaleY: 1.1,
                  iconOffsetY: 5,
                  navIndex: 1,
                  whiteAlpha: 0.5,
                },
                {
                  id: 2,
                  title: "新人生之路",
                  subtitle: "从感知开始，重新活这一生。",
                  iconSrc: iconPath,
                  iconScaleX: 1.0,
                  iconScaleY: 0.9,
                  iconOffsetY: 0,
                  navIndex: 2,
                  whiteAlpha: 0.5,
                  glow: "radial-gradient(ellipse 82% 68% at 50% 60%, rgba(223,209,152,0.9) 0%, rgba(221,206,148,0.3) 42%, rgba(220,205,150,0.1) 65%, transparent 82%)",
                },
                {
                  id: 3,
                  title: "明镜源频AI",
                  subtitle: "与你共振，照见真实的自己。",
                  iconSrc: iconMirror,
                  iconScaleX: 1.0,
                  iconScaleY: 1.0,
                  iconOffsetY: 0,
                  navIndex: 3,
                  whiteAlpha: 0.3,
                },
                {
                  id: 4,
                  title: "共感网络",
                  subtitle: "更多入口，持续通往感知文明。",
                  iconSrc: iconGrid,
                  iconScaleX: 0.9,
                  iconScaleY: 0.9,
                  iconOffsetY: 0,
                  navIndex: 4,
                  whiteAlpha: 0.3,
                },
              ].map((box) => (
                <div
                  key={box.id}
                  onClick={() => handleNavClick(box.navIndex, box.title)}
                  className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 aspect-square sm:aspect-auto sm:min-h-[260px] relative overflow-hidden active:scale-[0.97] transition-all duration-300"
                  style={{
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.01) 100%)",
                    // ⚠️ 兼容性风险记录（backdrop-filter 毛玻璃效果）
                    // 风险点：卡片的液态玻璃质感依赖 backdrop-filter / -webkit-backdrop-filter。
                    // 支持情况：iOS Safari 9+（-webkit- 前缀，已加）✓；Android Chrome/WebView 需 76+。
                    // 具体风险：老式国产安卓（自带旧 WebView 或魔改浏览器内核）很可能完全不渲染 backdrop-filter，
                    //          导致卡片失去毛玻璃模糊，降级为接近全透明（仅剩淡 linear-gradient + 边框）。
                    //          后果是背后黄光斑直接穿透、文字压在杂乱光斑上、可读性下降（不会白屏/报错，仅降级显示）。
                    // 解决方案（待实现）：用 @supports not (backdrop-filter: blur(1px)) 检测，
                    //          不支持时给卡片一个半透明实底背景（如 rgba(245,243,238,0.85)）兜底，保证文字可读。
                    backdropFilter: "blur(18px) saturate(1.15)",
                    WebkitBackdropFilter: "blur(18px) saturate(1.15)",
                    borderRadius: "24px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.8)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow:
                      "inset 2px 2px 4px rgba(255,255,255,0.4), inset -3px -3px 6px rgba(0,0,0,0.06), inset 0 0 20px rgba(255,255,255,0.15), 0 15px 35px rgba(0,0,0,0.06), 0 3px 10px rgba(0,0,0,0.05)",
                    transform: "translateZ(0)",
                  }}
                >
                  {/* <div
                    className="absolute inset-x-0 top-0 h-[40%] pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
                      borderRadius: "24px 24px 0 0",
                    }}
                  /> */}
                  {(box as { glow?: string }).glow && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: (box as { glow?: string }).glow,
                        borderRadius: "24px",
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-white/10 opacity-0 active:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  {/* 图标作为卡片背景镶嵌（已注释）
                  <img
                    src={box.iconSrc}
                    alt=""
                    className="absolute pointer-events-none"
                    style={{
                      width: "92%",
                      height: "92%",
                      top: "4%",
                      left: "4%",
                      objectFit: "contain",
                      opacity: 0.4,
                      transform: `scaleX(${box.iconScaleX}) scaleY(${box.iconScaleY}) translateY(${box.iconOffsetY}%)`,
                    }}
                  /> */}
                  {/* 图标放在卡片表面，标题上方居中 */}
                  <img
                    src={box.iconSrc}
                    alt=""
                    className="relative z-10"
                    style={{
                      width: "36px",
                      height: "36px",
                      objectFit: "contain",
                      marginBottom: "0.5rem",
                      opacity: 0.3,
                    }}
                  />
                  <h3
                    className="relative z-10 text-center"
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                      fontWeight: 700,
                      color: "#18181A",
                      letterSpacing: "0.15em",
                      margin: 0,
                      marginBottom: "0.5rem",
                      textShadow: `0px 1.5px 1px rgba(255,255,255,${box.whiteAlpha}), 0px -1px 2px rgba(0,0,0,0.08)`,
                    }}
                  >
                    {box.title}
                  </h3>
                  <p
                    className="relative z-10 text-center"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      color: "#4A4A4C",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      margin: 0,
                      marginBottom: "0.25rem",
                      textShadow: `0px 1px 1px rgba(255,255,255,${box.whiteAlpha}), 0px -0.5px 1px rgba(0,0,0,0.02)`,
                    }}
                  >
                    {box.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
