/**
 * 首页 v7.0 - 元感知 (version 2.2)
 *
 * 核心定位：
 * - 深刻、厚重、大气、未来感、立体透明（苹果锁屏厚玻璃质感）
 * - 纯净冷白底色（#F5F5F7 -> 升级为带极微弱环境光的空间灰白，以支持折射）
 * - 动画追求冲击感与沉浸体验，依靠极简艺术和高级材质（Glassmorphism）呈现
 * - “三尊未来透明碑”提供厚重感、立体感和清透感
 */
import { useState, useCallback, useEffect } from "react";
import { rpx, FONT_SERIF } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { MetaLogo } from "../components/shared/MetaLogo";

/* ═══ 三大核心支柱数据 ═══ */
const MAIN_AXES = [
  { id: "handbook", title: "人类手册", subtitle: "知识", navIndex: 1 },
  { id: "newlife", title: "新人生之路", subtitle: "践行", navIndex: 2 },
  { id: "bright_mirror", title: "明镜", subtitle: "引导", navIndex: 3 },
];

interface HomeProps {
  onNavChange?: (index: number) => void;
  onNavigateToLogoPreview?: () => void;
  isLoggedIn?: boolean;
  userInfo?: { name: string; avatar: string; days: number };
}

export function Home({
  onNavChange,
  onNavigateToLogoPreview,
  isLoggedIn = true,
  userInfo = {
    name: "感知者",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    days: 1,
  },
}: HomeProps) {
  const toast = useToast();
  // 动画阶段状态：0(空白) -> 1(Logo凝结) -> 2(平台名) -> 3(主标语) -> 4(副标语) -> 5(三大支柱+头像)
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const t1 = setTimeout(() => setPhase(1), 400); // Logo 率先在虚空中凝结
    const t2 = setTimeout(() => setPhase(2), 2200); // 平台名沉降
    const t3 = setTimeout(() => setPhase(3), 3500); // 主标语
    const t4 = setTimeout(() => setPhase(4), 4800); // 副标语
    const t5 = setTimeout(() => setPhase(5), 6200); // 三大透明碑

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleClick = useCallback(
    (axis: (typeof MAIN_AXES)[number]) => {
      if (axis.navIndex === 3) {
        toast.show("「明镜」正在精心筹备中，敬请期待");
      } else {
        onNavChange?.(axis.navIndex);
      }
    },
    [onNavChange, toast],
  );

  return (
    <div
      style={{
        height: "100vh",
        background: "#F2F2F5", // 从纯平冷白升级为稍微深一点的冷灰色，以便透明玻璃有对比度
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 环境光场 (为高透玻璃提供折射源，强化苹果式玻璃质感) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: rpx(800),
          height: rpx(800),
          background:
            "radial-gradient(circle, rgba(139,170,125,0.15) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "10%",
          width: rpx(900),
          height: rpx(900),
          background:
            "radial-gradient(circle, rgba(196,154,108,0.12) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "40%",
          width: rpx(600),
          height: rpx(600),
          background:
            "radial-gradient(circle, rgba(150,150,155,0.08) 0%, transparent 65%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* 核心三句话 (极强阴刻感、厚重) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: rpx(80),
          zIndex: 2,
        }}
      >
        {/* Logo 从虚无中凝结出绝对理性的实体，不需要Y轴位移，表现出“它原本就在那里” */}
        {/* 
        <div
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transition: "opacity 4s ease, transform 4s cubic-bezier(0.16, 1, 0.3, 1), filter 4s ease",
            marginBottom: rpx(40),
            transform: phase >= 1 ? "scale(1)" : "scale(1.15)",
            filter: phase >= 1 ? "blur(0px)" : "blur(20px)",
          }}
        >
          <MetaLogo size={140} variant="engraved" />
        </div>
        */}

        {/* 元感知 - 深刻、厚重、阴刻感 (Debossed) */}
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(96),
            fontWeight: 800,
            color: "#1C1C1E", // 极深的冷灰黑
            margin: 0,
            letterSpacing: rpx(20),
            // 物理级厚重阴刻 (Debossed)：上方受光所以内部产生暗影，下方内壁受光产生极细高光
            textShadow: `
              0px 1px 1px rgba(255,255,255,0.9), 
              0px -1px 2px rgba(0,0,0,0.15),
              0px 4px 12px rgba(0,0,0,0.06)
            `,
            opacity: phase >= 2 ? 1 : 0,
            transition: "all 3.5s cubic-bezier(0.16, 1, 0.3, 1)",
            transform:
              phase >= 2
                ? "translateY(0) scale(1)"
                : "translateY(-15px) scale(1.03)",
            filter: phase >= 2 ? "blur(0px)" : "blur(16px)",
            marginBottom: rpx(60),
          }}
        >
          元感知
        </h1>

        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(32),
            fontWeight: 600,
            color: "#2C2C2E",
            letterSpacing: rpx(10),
            margin: 0,
            marginBottom: rpx(24),
            // 阴刻阴影
            textShadow:
              "0px 1px 1px rgba(255,255,255,1), 0px -1px 1px rgba(0,0,0,0.1)",
            opacity: phase >= 3 ? 1 : 0,
            transition: "all 3s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: phase >= 3 ? "translateY(0)" : "translateY(-10px)",
            filter: phase >= 3 ? "blur(0px)" : "blur(8px)",
            textAlign: "center",
          }}
        >
          为人类打开一条清明之路。
        </p>

        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(22),
            fontWeight: 500,
            color: "#666666",
            letterSpacing: rpx(8),
            margin: 0,
            // 极细的阴刻感
            textShadow:
              "0px 1px 1px rgba(255,255,255,1), 0px -0.5px 1px rgba(0,0,0,0.05)",
            opacity: phase >= 4 ? 1 : 0,
            transition: "all 3s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: phase >= 4 ? "translateY(0)" : "translateY(-8px)",
            filter: phase >= 4 ? "blur(0px)" : "blur(8px)",
            textAlign: "center",
          }}
        >
          在这里，真实高于一切。
        </p>
      </div>

      {/* 三大核心支柱 (极简、高透玻璃碑、无位移出现) */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: rpx(750),
          padding: `0 ${rpx(32)}`,
          boxSizing: "border-box",
          gap: rpx(20),
          opacity: phase >= 5 ? 1 : 0,
          transition: "all 3.5s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: phase >= 5 ? "translateY(0)" : "translateY(15px)",
          filter: phase >= 5 ? "blur(0px)" : "blur(12px)",
          pointerEvents: phase >= 5 ? "auto" : "none",
          zIndex: 2,
        }}
      >
        {MAIN_AXES.map((axis) => (
          <div
            key={axis.id}
            onClick={() => handleClick(axis)}
            style={{
              flex: 1, // 自适应宽度，避免横向撑爆
              height: rpx(440),
              // 苹果级极透毛玻璃：极低的白底透明度，完全靠折射和边框定义形状
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 100%)",
              borderRadius: rpx(20),
              // 物理级玻璃切边高光
              borderTop: "1px solid rgba(255,255,255,0.7)",
              borderLeft: "1px solid rgba(255,255,255,0.4)",
              borderRight: "1px solid rgba(0,0,0,0.02)",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
              // 物理投影：去除厚重的底边黑影，改用清透的发光与极柔投影
              boxShadow: `
                inset 1px 1px 2px rgba(255,255,255,0.5), 
                inset -1px -1px 2px rgba(0,0,0,0.02), 
                0 20px 40px -10px rgba(0,0,0,0.05)
              `,
              // 强劲的毛玻璃滤镜（这是苹果透明感的灵魂）
              backdropFilter: "blur(32px) saturate(1.5)",
              WebkitBackdropFilter: "blur(32px) saturate(1.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${rpx(60)} 0 ${rpx(50)}`,
              cursor: "pointer",
              transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onPointerEnter={(e) => {
              // 悬浮时，玻璃内折射光增强，变亮一点
              e.currentTarget.style.background =
                "linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 100%)";
              e.currentTarget.style.boxShadow = `
                inset 1px 1px 4px rgba(255,255,255,0.8), 
                0 30px 50px -10px rgba(0,0,0,0.08)
              `;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 100%)";
              e.currentTarget.style.boxShadow = `
                inset 1px 1px 2px rgba(255,255,255,0.5), 
                inset -1px -1px 2px rgba(0,0,0,0.02), 
                0 20px 40px -10px rgba(0,0,0,0.05)
              `;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(32), // 统一字号，保证三大支柱视觉一致
                fontWeight: 600,
                color: "#18181A",
                letterSpacing: rpx(6),
                // 碑文：深刻的阴刻效果，字陷在玻璃里
                textShadow:
                  "0px 1px 1px rgba(255,255,255,0.9), 0px -1px 1px rgba(0,0,0,0.1)",
                textAlign: "center",
                width: "100%",
                transform: "scaleY(1.05)", // 增加宋体修长感
              }}
            >
              {axis.title}
            </span>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: rpx(20),
              }}
            >
              {/* 装饰线 - 强化刻线感 */}
              <div
                style={{
                  width: rpx(20),
                  height: "1.5px",
                  background: "rgba(0,0,0,0.12)",
                  boxShadow: "0 1px 1px rgba(255,255,255,0.6)",
                }}
              />
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(16),
                  fontWeight: 500,
                  color: "#555",
                  letterSpacing: rpx(6),
                  // 副标题极轻阴刻
                  textShadow: "0 1px 1px rgba(255,255,255,0.9)",
                }}
              >
                {axis.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Logo 实验室入口（厚玻璃质感） ═══ */}
      <div
        onClick={onNavigateToLogoPreview}
        style={{
          position: "fixed",
          top: rpx(48),
          left: rpx(48),
          display: "flex",
          alignItems: "center",
          gap: rpx(10),
          padding: `${rpx(10)} ${rpx(20)}`,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.8)",
          borderLeft: "1px solid rgba(255,255,255,0.6)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          borderRight: "1px solid rgba(0,0,0,0.05)",
          borderRadius: rpx(40),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "inset 1px 1px 2px rgba(255,255,255,0.8), 0 8px 24px rgba(0,0,0,0.06)",
          cursor: "pointer",
          zIndex: 10,
          opacity: phase >= 5 ? 1 : 0,
          transition: "all 2.5s ease",
        }}
      >
        <MetaLogo size={18} variant="engraved" />
        <span
          style={{
            fontSize: rpx(13),
            fontWeight: 600,
            color: "#222",
            letterSpacing: "1px",
            textShadow:
              "0px 1px 1px rgba(255,255,255,0.9), 0px -0.5px 1px rgba(0,0,0,0.05)",
          }}
        >
          Logo 实验室
        </span>
      </div>

      {/* ═══ 用户身份区（厚玻璃质感） ═══ */}
      {isLoggedIn && userInfo && (
        <div
          onClick={() => {
            toast.show("明镜台正在精心筹备中");
          }}
          style={{
            position: "fixed",
            top: rpx(48),
            right: rpx(48),
            display: "flex",
            alignItems: "center",
            gap: rpx(12),
            padding: `${rpx(8)} ${rpx(20)} ${rpx(8)} ${rpx(8)}`,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
            borderTop: "1px solid rgba(255,255,255,0.8)",
            borderLeft: "1px solid rgba(255,255,255,0.6)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            borderRight: "1px solid rgba(0,0,0,0.05)",
            borderRadius: rpx(40),
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "inset 1px 1px 2px rgba(255,255,255,0.8), 0 8px 24px rgba(0,0,0,0.06)",
            opacity: phase >= 5 ? 1 : 0,
            transition: "all 2.5s ease",
            cursor: "pointer",
            pointerEvents: phase >= 5 ? "auto" : "none",
            zIndex: 10,
          }}
        >
          <img
            src={userInfo.avatar}
            alt="User"
            style={{
              width: rpx(36),
              height: rpx(36),
              borderRadius: "50%",
              objectFit: "cover",
              filter: "grayscale(100%) contrast(1.2) opacity(0.9)",
              border: "1.5px solid rgba(255,255,255,0.9)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "filter 0.4s ease",
            }}
          />
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: rpx(15),
              fontWeight: 600,
              color: "#222",
              letterSpacing: rpx(1),
              textShadow:
                "0px 1px 1px rgba(255,255,255,0.9), 0px -0.5px 1px rgba(0,0,0,0.05)",
            }}
          >
            {userInfo.name}
          </span>
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
