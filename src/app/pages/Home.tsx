/**
 * 首页 v5.0 - 元思想
 *
 * 「首页像镜」— 文明入口，纯净穿透
 *
 * 动画逻辑（全部仅用透明度，无位移）：
 *   1. 品牌阶段：标题 + 横线 + 副标题 + 过渡暗示同时柔和淡入
 *   2. 3s后无缝交叉淡变到主轴阶段
 *   3. 五大主轴一屏呈现，十字布局（2-1-2），不需滚动
 *
 * 品牌区与主轴区用绝对定位堆叠，实现无缝交叉淡变。
 */

import { useState, useCallback, useEffect } from "react";
import { rpx, FONT_SERIF } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

/* ═══ 五大主轴数据 ═══ */
const MAIN_AXES = [
  {
    id: "handbook",
    title: "人类手册",
    subtitle: "重新认识生命的底层逻辑",
    navIndex: 1,
  },
  {
    id: "newlife",
    title: "新人生之路",
    subtitle: "从现状出发，一步步走向真实",
    navIndex: 2,
  },
  {
    id: "bootcamp",
    title: "感知训练营",
    subtitle: "在实践中唤醒生命觉知",
    navIndex: -1,
  },
  {
    id: "mirror_center",
    title: "元镜中心",
    subtitle: "照见自我，校准生命频率",
    navIndex: -1,
  },
  {
    id: "bright_mirror",
    title: "明镜",
    subtitle: "澄澈通透的智慧映照",
    navIndex: 3,
  },
];

/**
 * 【归位之镜】设计规范：极简、透明、镜面风格，竖向立轴式排列。
 * 禁止使用任何普通卡片风、宫格风。
 */

/* ═══ 组件 ═══ */

interface HomeProps {
  onNavigateToPlayer?: (trackLabel: string) => void;
  onNavigateToArticle?: (articleId: string) => void;
  onNavigateToPodcast?: (podcastId: string) => void;
  onNavigateToActivity?: (activityId: string) => void;
  onNavigateToGuide?: () => void;
  onNavigateToBreathing?: () => void;
  onNavigateToLogin?: () => void;
  onNavChange?: (index: number) => void;
  restoreScrollY?: number;
  isLoggedIn?: boolean;
  userInfo?: { name: string; avatar: string; days: number };
  onLogout?: () => void;
}

export function Home({
  onNavChange,
  // 真实登录状态由 App.tsx 通过 useUserStore 传入
  // 未登录时 isLoggedIn=false，不显示用户头像区域
  isLoggedIn = false,
  userInfo,
  onLogout,
  onNavigateToLogin,
}: HomeProps) {
  const toast = useToast();
  const [phase, setPhase] = useState<"brand" | "axes">("brand");
  const [mounted, setMounted] = useState(false);
  const [axesRevealed, setAxesRevealed] = useState(false);

  /* 品牌阶段初始化 */
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    const t1 = setTimeout(() => setMounted(true), 50);
    return () => {
      clearTimeout(t1);
    };
  }, []);

  /* 3s后切换到主轴阶段 */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("axes"), 3000);
    const t2 = setTimeout(() => setAxesRevealed(true), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleClick = useCallback(
    (axis: (typeof MAIN_AXES)[number]) => {
      if (axis.navIndex >= 0) {
        onNavChange?.(axis.navIndex);
      } else {
        toast.show(`「${axis.title}」正在精心筹备中，敬请期待`);
      }
    },
    [onNavChange, toast],
  );

  const isAxes = phase === "axes";

  return (
    <div
      style={{
        height: "100vh",
        background:
          "radial-gradient(circle at 50% 30%, #FFFFFF 0%, #F5F5F7 50%, #EAEBEF 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes hint-breathe {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 0.7; }
        }
        .axis-slab {
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          background: transparent;
          transition: background 0.5s ease;
        }
        .axis-slab:active {
          background: rgba(255,255,255,0.5) !important;
        }
        .axis-slab::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }
        .axis-slab:hover::after {
          opacity: 1;
        }
      `}</style>

      {/* 中轴光线 - 恢复最早期极细的 1px 状态，取消多余光晕 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "100vh",
          background:
            "linear-gradient(180deg, transparent 5%, rgba(196,178,148,0.06) 30%, rgba(196,178,148,0.12) 50%, rgba(196,178,148,0.06) 70%, transparent 95%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ═══ 品牌区域（绝对定位，覆盖全屏） ═══ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: isAxes ? 0 : 2,
          opacity: isAxes ? 0 : 1,
          transition: "opacity 1.2s ease",
          pointerEvents: isAxes ? "none" : "auto",
        }}
      >
        {/* 标题 */}
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(88),
            fontWeight: 300,
            color: "#1A1918",
            margin: 0,
            lineHeight: 1,
            letterSpacing: rpx(14),
            textShadow:
              "0 1px 0 rgba(255,255,255,0.7), 0 -0.5px 0 rgba(0,0,0,0.04)",
            opacity: mounted ? 1 : 0,
            transition: "opacity 2s ease",
          }}
        >
          元思想
        </h1>

        {/* 横线 */}
        <div
          style={{
            width: rpx(70),
            height: "1px",
            margin: `${rpx(28)} 0`,
            background:
              "linear-gradient(90deg, transparent, rgba(186,170,140,0.3), transparent)",
            opacity: mounted ? 1 : 0,
            transition: "opacity 2s ease",
          }}
        />

        {/* 副标题 */}
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(26),
            fontWeight: 300,
            letterSpacing: rpx(5),
            color: "rgba(26,25,24,0.3)",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.8,
            textShadow: "0 1px 0 rgba(255,255,255,0.5)",
            opacity: mounted ? 1 : 0,
            transition: "opacity 2s ease",
          }}
        >
          思想回到生命，生命回到感知
        </p>

        {/* 过渡暗示 */}
        <div
          style={{
            marginTop: rpx(60),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: rpx(20),
            pointerEvents: "none",
            opacity: mounted ? 1 : 0,
            transition: "opacity 2s ease",
          }}
        >
          <div
            style={{
              width: rpx(200),
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(180,160,130,0.35), transparent)",
              animation: mounted
                ? "hint-breathe 2.8s ease-in-out infinite"
                : "none",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: rpx(16),
            }}
          >
            {[0, 0.5, 1.0].map((delay, idx) => (
              <div
                key={idx}
                style={{
                  width: rpx(8 - idx * 1.5),
                  height: rpx(8 - idx * 1.5),
                  borderRadius: "50%",
                  background: `rgba(180,160,130,${0.5 - idx * 0.12})`,
                  animation: mounted
                    ? `hint-breathe 2.8s ${delay}s ease-in-out infinite`
                    : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 五大主轴区域 — 竖向立轴碑面，一屏呈现 ═══ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: isAxes ? 1 : 0,
          transition: "opacity 1.2s ease",
          pointerEvents: isAxes ? "auto" : "none",
          zIndex: 1,
        }}
      >
        {/* 透明碑面容器 - 强化“厚玻璃/水晶”的立体感 */}
        <div
          style={{
            position: "relative",
            width: rpx(640), // 稍微加宽容纳内部阴影
            background:
              "linear-gradient(150deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 100%)",
            borderTop: "1.5px solid rgba(255,255,255,0.9)", // 顶部迎光面极亮边缘
            borderLeft: "1.5px solid rgba(255,255,255,0.7)", // 左侧迎光边缘
            borderRight: "1px solid rgba(255,255,255,0.1)", // 右侧背光
            borderBottom: "1px solid rgba(255,255,255,0.05)", // 底部背光
            borderRadius: rpx(16), // 微圆角带来高级抛光感
            // 核心：多层阴影堆叠形成立体“厚度”
            // 1,2 层：悬浮感与环境光投影
            // 3,4 层：玻璃内部的折射高光与暗角，形成物理厚度感
            // 5 层：整体内部的磨砂微光
            boxShadow: `
              16px 32px 64px -10px rgba(0,0,0,0.08),
              0 12px 32px rgba(196,178,148,0.08),
              inset 3px 3px 6px rgba(255,255,255,0.8),
              inset -3px -3px 8px rgba(0,0,0,0.04),
              inset 0 0 30px rgba(255,255,255,0.4)
            `,
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // 边缘裁���，保持完美圆角
          }}
        >
          {MAIN_AXES.map((axis, i) => (
            <AxisSlab
              key={axis.id}
              axis={axis}
              revealed={axesRevealed}
              delay={i * 0.12}
              isLast={i === MAIN_AXES.length - 1}
              onClick={() => handleClick(axis)}
            />
          ))}
        </div>

        {/* 底部引导语 */}
        <p
          style={{
            marginTop: rpx(48),
            fontFamily: FONT_SERIF,
            fontSize: rpx(20),
            fontWeight: 300,
            letterSpacing: rpx(4),
            color: "rgba(26,25,24,0.12)",
            textAlign: "center",
            opacity: axesRevealed ? 1 : 0,
            transition: "opacity 1.2s 0.8s ease",
          }}
        >
          让思想归位，让生命在场
        </p>
      </div>

      {/* ═══ 用户身份区（右上角浮窗） ═══ */}
      {isLoggedIn && userInfo && (
        <div
          style={{
            position: "fixed",
            top: rpx(48),
            right: rpx(48),
            display: "flex",
            alignItems: "center",
            gap: rpx(10),
            padding: `${rpx(6)} ${rpx(20)} ${rpx(6)} ${rpx(6)}`,
            // 材质上与中间的“厚水晶碑”呼应，但更轻薄悬浮
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.03), inset 0 1px 2px rgba(255,255,255,0.8)",
            borderRadius: rpx(40),
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            opacity: axesRevealed ? 1 : 0, // 与主轴同步淡入，不打扰前3秒的品牌展示
            transition: "opacity 1.2s 0.8s ease, transform 0.3s ease",
            zIndex: 10,
            cursor: "pointer",
            pointerEvents: axesRevealed ? "auto" : "none",
          }}
          onClick={() => {
            // “个人中心”独立于5大主轴和底部4大导航
            toast.show("个人中心正在精心筹备中");
          }}
          onPointerEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%)";
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)";
          }}
        >
          {/* 头像：带有微白边光环，融入整体的镜面质感 */}
          <img
            src={userInfo.avatar}
            alt="User Avatar"
            style={{
              width: rpx(36),
              height: rpx(36),
              borderRadius: "50%",
              objectFit: "cover",
              border: "1.5px solid rgba(255,255,255,0.9)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          />
          {/* 名字：延续阴刻宋体字 */}
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(16),
              fontWeight: 400,
              color: "#1A1512",
              letterSpacing: rpx(2),
              textShadow: "0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {userInfo.name}
          </span>
        </div>
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2200}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}

/* ═══ 主轴横向刻石（Slab）组件 ═══ */
function AxisSlab({
  axis,
  revealed,
  delay,
  isLast,
  onClick,
}: {
  axis: (typeof MAIN_AXES)[number];
  revealed: boolean;
  delay: number;
  isLast: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="axis-slab"
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{
        height: rpx(160),
        position: "relative",
        opacity: revealed ? 1 : 0,
        transition: `opacity 0.8s ${delay}s ease, background 0.4s ease`,
      }}
      onPointerEnter={(e) => {
        const el = e.currentTarget;
        el.style.background =
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)";
      }}
      onPointerLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "transparent";
      }}
    >
      {/* 标题 - 强化冷峻的阴刻字感 */}
      <span
        style={{
          display: "block",
          fontFamily: FONT_SERIF,
          fontSize: rpx(34),
          fontWeight: 400,
          color: "#1A1512", // 加深刻字对比度，体现冷峻
          letterSpacing: rpx(10), // 更具碑文排布感
          textAlign: "center",
          textShadow: "0 1px 0 rgba(255,255,255,0.8), 0 0 1px rgba(0,0,0,0.1)", // 上方���暗，下方高亮，形成雕刻凹陷
          lineHeight: 1.2,
        }}
      >
        {axis.title}
      </span>

      {/* 副标题 */}
      <span
        style={{
          display: "block",
          marginTop: rpx(12),
          fontSize: rpx(16),
          fontWeight: 300,
          color: "rgba(26,21,18,0.4)",
          letterSpacing: rpx(3),
          textAlign: "center",
          lineHeight: 1.5,
          textShadow: "0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {axis.subtitle}
      </span>

      {/* 隐式蚀刻分隔线 - 极简淡化，两端渐隐融入镜面 */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "15%",
            width: "70%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(170,150,120,0.15) 30%, rgba(170,150,120,0.15) 70%, transparent)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.5)", // 底部白光描边，形成刻痕的高光
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
