import { useState, useEffect } from "react";
import { FONT_SERIF } from "../config/styles";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/shared/Toast";
import { Book, Compass, Orbit, Grid, ImageIcon } from "lucide-react";
import { HomeImageVersion } from "./HomeImageVersion";

interface HomeProps {
  onNavChange?: (index: number) => void;
  onNavigateToLogoPreview?: () => void;
  isLoggedIn?: boolean;
  userInfo?: { name: string; avatar: string; days: number };
}

export function Home({ onNavChange }: HomeProps) {
  const [showImageVersion, setShowImageVersion] = useState(false);

  if (showImageVersion) {
    return (
      <HomeImageVersion
        onNavChange={onNavChange}
        onToggleMode={() => setShowImageVersion(false)}
      />
    );
  }

  return (
    <HomeCodeVersion
      onNavChange={onNavChange}
      onToggleMode={() => setShowImageVersion(true)}
    />
  );
}

function HomeCodeVersion({
  onNavChange,
  onToggleMode,
}: {
  onNavChange?: (index: number) => void;
  onToggleMode: () => void;
}) {
  const toast = useToast();
  // 1 = 门前, 2 = 穿门, 3 = 内殿
  const [layer, setLayer] = useState<1 | 2 | 3>(1);
  const [phase1, setPhase1] = useState(0); // Layer 1 animations
  const [phase2, setPhase2] = useState(0); // Layer 2 animations
  const [phase3, setPhase3] = useState(0); // Layer 3 animations

  // Layer 1 Init
  useEffect(() => {
    if (layer === 1) {
      const t1 = setTimeout(() => setPhase1(1), 800); // 浮现主文字
      const t2 = setTimeout(() => setPhase1(2), 2500); // 浮现"进入"
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [layer]);

  // Layer 2 Init
  useEffect(() => {
    if (layer === 2) {
      const t1 = setTimeout(() => setPhase2(1), 1000); // 浮现中心句
      const t2 = setTimeout(() => setPhase2(2), 3500); // 2.5s后浮现"继续"
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [layer]);

  // Layer 3 Init
  useEffect(() => {
    if (layer === 3) {
      const t1 = setTimeout(() => setPhase3(1), 1000); // 浮现四个入口
      return () => clearTimeout(t1);
    }
  }, [layer]);

  const handleEnterLayer2 = () => {
    setPhase1(0); // Fade out Layer 1
    setTimeout(() => {
      setLayer(2);
    }, 1200);
  };

  const handleEnterLayer3 = () => {
    setPhase2(0); // Fade out Layer 2
    setTimeout(() => {
      setLayer(3);
    }, 1500);
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
        backgroundColor: "#EFEFF2", // 统一极简冷白底色，主要依靠全局背景图片定调
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* 切换到图片版按钮 */}
      <button
        onClick={onToggleMode}
        className="absolute top-5 left-5 z-50 flex items-center justify-center p-2 rounded-full bg-black/10 backdrop-blur-md border border-white/30 text-gray-500 hover:bg-black/20 transition-all cursor-pointer active:scale-95"
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        title="切换到图片版"
      >
        <ImageIcon size={20} strokeWidth={1.5} />
      </button>

      {/* 贯穿全剧的高级通透光场图片 (满足你对 1、2 层也要有通透立体感的要求) */}
      <div
        className="absolute inset-0 transition-all duration-[3000ms] ease-out pointer-events-none"
        style={{
          opacity: 1, // 全局显示！
          backgroundImage: `url('https://images.unsplash.com/photo-1760891847887-57578cee649d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhlcmVhbCUyMGdvbGRlbiUyMGdsb3dpbmclMjBsaWdodCUyMGFic3RyYWN0JTIwZGFya3xlbnwxfHx8fDE3NzY1MTcwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // 随着层级递进，画面从"极度朦胧深邃"逐渐变清晰，产生穿梭感
          filter:
            layer === 1
              ? "blur(60px) saturate(0.8)"
              : layer === 2
                ? "blur(40px) saturate(1)"
                : "blur(20px) saturate(1.2)",
          transform:
            layer === 1
              ? "scale(1.2)"
              : layer === 2
                ? "scale(1.1)"
                : "scale(1)",
        }}
      />

      {/* 极简冷白/古纸的渐变遮罩 - 动态压暗底图，防止五颜六色 */}
      <div
        className="absolute inset-0 transition-all duration-[3000ms] pointer-events-none"
        style={{
          background:
            layer === 1
              ? "linear-gradient(to bottom, rgba(250,250,247,0.95) 0%, rgba(240,228,206,0.85) 100%)" // 门前：极简干净，隐约透出背景
              : layer === 2
                ? "linear-gradient(to bottom, rgba(235,235,232,0.9) 0%, rgba(225,213,191,0.8) 100%)" // 穿门：稍暗，凸显文字
                : "linear-gradient(to bottom, rgba(250,250,247,0.85) 0%, rgba(240,228,206,0.4) 100%)", // 内殿：最高透
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
            opacity: phase1 === 0 ? 0 : 1,
            transition: "opacity 1.2s ease",
          }}
        >
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
            <h1
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(3.5rem, 12vw, 5rem)",
                fontWeight: 500,
                color: "#18181A",
                letterSpacing: "0.2em",
                margin: 0,
                marginBottom: "4rem", // 门与路的距离感
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
                color: "#3A3A3C",
                letterSpacing: "0.3em",
                margin: 0,
                opacity: phase1 >= 1 ? 1 : 0,
                filter: phase1 >= 1 ? "blur(0px)" : "blur(8px)",
                transition: "all 3.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                textShadow:
                  "0px 1px 1px rgba(255,255,255,1), 0px -0.5px 1px rgba(0,0,0,0.05)",
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
                color: "#999",
                letterSpacing: "0.4em",
                cursor: "pointer",
                opacity: phase1 >= 2 ? 1 : 0,
                transition: "opacity 2s ease",
              }}
            >
              进入
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
            opacity: phase2 === 0 ? 0 : 1,
            transition: "opacity 1.5s ease",
          }}
        >
          <div
            style={{
              height: "70vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 2rem",
            }}
          >
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                fontWeight: 500,
                color: "#1C1C1E",
                letterSpacing: "0.2em",
                margin: 0,
                textAlign: "center",
                lineHeight: 2,
                opacity: phase2 >= 1 ? 1 : 0,
                transform: phase2 >= 1 ? "scale(1)" : "scale(0.98)",
                filter: phase2 >= 1 ? "blur(0px)" : "blur(12px)", // 增强失焦沉降
                transition: "all 3s cubic-bezier(0.16, 1, 0.3, 1)",
                textShadow:
                  "0px 1px 1px rgba(255,255,255,0.8), 0px -1px 1px rgba(0,0,0,0.05), 0 0 40px rgba(255,255,255,0.5)", // 让这句话自己带着光场
              }}
            >
              在这里，
              <br className="md:hidden" />
              <span
                style={{
                  fontWeight: 900,
                  color: "#18181A",
                  fontSize: "1.15em",
                  letterSpacing: "0.25em",
                  marginRight: "-0.1em",
                  textShadow:
                    "0px 2px 2px rgba(255,255,255,1), 0px -2px 3px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.8)",
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
                color: "#999",
                letterSpacing: "0.4em",
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

          <div className="flex-1 w-full max-w-4xl flex items-center justify-center pb-[5vh]">
            <div
              className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10 w-full"
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
                  icon: <Book size={36} strokeWidth={1.5} color="#A27D51" />,
                  navIndex: 1,
                },
                {
                  id: 2,
                  title: "新人生之路",
                  subtitle: "把感知，真正活进现实人生。",
                  icon: <Compass size={36} strokeWidth={1.5} color="#68815F" />,
                  navIndex: 2,
                },
                {
                  id: 3,
                  title: "明镜源频AI",
                  subtitle: "与你共振，照见更真实的自己。",
                  icon: <Orbit size={36} strokeWidth={1.5} color="#556F88" />,
                  navIndex: 3,
                },
                {
                  id: 4,
                  title: "平台其他板块",
                  subtitle: "更多入口，持续通往共感文明。",
                  icon: <Grid size={36} strokeWidth={1.5} color="#948074" />,
                  navIndex: 4,
                },
              ].map((box) => (
                <div
                  key={box.id}
                  onClick={() => handleNavClick(box.navIndex, box.title)}
                  className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 aspect-square sm:aspect-auto sm:min-h-[260px] relative overflow-hidden active:scale-[0.97] transition-all duration-300"
                  style={{
                    cursor: "pointer",
                    // 【颠覆性的移动端优雅降级方案：纯渐变透明玻璃】
                    // 我们不再用死板的纯白色打底！而是用透明度极低的白色渐变。
                    // 即使老安卓机不支持 blur，它看到的依然是一块带着高光切边、极高通透度的"透明亚克力板"，仍然非常立体且晶莹剔透！
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    borderRadius: "24px",
                    borderTop: "1.5px solid rgba(255, 255, 255, 0.9)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.6)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow:
                      "inset 0 0 30px rgba(255,255,255,0.4), 0 10px 30px -10px rgba(0,0,0,0.05)",
                    transform: "translateZ(0)",
                  }}
                >
                  {/* 触摸反馈光效 (专为移动端打造，代替 PC 的 hover) */}
                  <div className="absolute inset-0 bg-white/20 opacity-0 active:opacity-100 transition-opacity duration-200 pointer-events-none" />

                  {/* 极简图标 */}
                  <div
                    className="relative z-10 mb-3 md:mb-5"
                    style={{
                      filter:
                        "drop-shadow(0px 1.5px 1px rgba(255,255,255,0.9)) drop-shadow(0px -1px 1px rgba(0,0,0,0.1))",
                    }}
                  >
                    {box.icon}
                  </div>

                  <h3
                    className="relative z-10 text-center"
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                      fontWeight: 700,
                      color: "#18181A",
                      letterSpacing: "0.15em",
                      margin: 0,
                      marginBottom: "0.75rem",
                      textShadow:
                        "0px 1.5px 1px rgba(255,255,255,0.9), 0px -1px 2px rgba(0,0,0,0.08)",
                    }}
                  >
                    {box.title}
                  </h3>

                  <p
                    className="relative z-10 text-center"
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "clamp(0.85rem, 2vw, 1rem)",
                      fontWeight: 500,
                      color: "#4A4A4C",
                      letterSpacing: "0.1em",
                      margin: 0,
                      marginBottom: "1.5rem",
                      textShadow:
                        "0px 1px 1px rgba(255,255,255,0.9), 0px -0.5px 1px rgba(0,0,0,0.02)",
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
