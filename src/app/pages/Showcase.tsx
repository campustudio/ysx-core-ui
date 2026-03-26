/**
 * Showcase - 元思想官网首页 Landing Page
 *
 * 面向公众的产品介绍落地页
 * 包含：品牌介绍、产品体验、核心理念、功能空间、设计语言、品牌视觉
 *
 * 部署方式：同步导出为独立 HTML 文件，部署到 metamindpt.com
 */

import { useState, useEffect, useRef } from "react";
import { HERO_BG, FEATURED_IMG, PLACEHOLDER_IMAGES } from "../config/images";
import {
  PavilionIcon,
  ScrollIcon,
  BaguaIcon,
  TaijiIcon,
  SoftCloudIcon,
} from "../config/icons";
import { Leaf, Moon, ChevronDown, ChevronRight } from "lucide-react";

// ─── 常量 ─────────────────────────────────────────────

const BRAND_DARK = "#1E140A";
const BRAND_WARM = "#2A1F14";
const AMBER = "#C49A6C";
const SAGE = "#8BAA7D";
const PARCHMENT = "#F0E4CE";

const SERIF = "'Noto Serif SC', serif";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', sans-serif";

// ─── 色板数据 ─────────────────────────────────────────

const COLOR_PALETTE = [
  {
    name: "琥珀金",
    hex: "#C49A6C",
    desc: "智慧之光 · 主色调",
    textDark: false,
  },
  {
    name: "鼠尾草绿",
    hex: "#8BAA7D",
    desc: "自然生长 · 辅助色",
    textDark: false,
  },
  {
    name: "绢轴底色",
    hex: "#F0E4CE",
    desc: "古纸温暖 · 背景色",
    textDark: true,
  },
  {
    name: "暖棕文字",
    hex: "#3A3028",
    desc: "温和可读 · 正文色",
    textDark: false,
  },
  {
    name: "薰衣草",
    hex: "#B4A0C8",
    desc: "宁静安定 · 点缀色",
    textDark: false,
  },
  { name: "奶油白", hex: "#FAF7F2", desc: "柔和包容 · 底色", textDark: true },
];

// ─── 设计理念数据 ─────────────────────────────────────

const PHILOSOPHY = [
  {
    char: "徐",
    title: "慢下来",
    desc: "清风徐来，在快节奏的世界中找到自己的节奏",
    color: AMBER,
  },
  {
    char: "止",
    title: "停下来",
    desc: "知止而后有定，停下脚步才能看清方向",
    color: SAGE,
  },
  {
    char: "定",
    title: "静下来",
    desc: "定而后能静，在安定中找到自己",
    color: "#B4A0C8",
  },
];

// ─── 设计愿景 ─────────────────────────────────────────

const DESIGN_VISIONS = [
  {
    title: "古卷展开的沉浸感",
    desc: "首页如同一幅古卷徐徐展开——远山河谷定住视线，向上滑动时内容页自然覆盖，绢轴底色渐入，营造「从远方回到此刻」的视觉叙事",
  },
  {
    title: "呼吸即是引导",
    desc: "三层圆环以不同节奏脉动，「收」与「清」的亮度随呼吸交替，无需文字说明——看到它的瞬间，你已开始跟随呼吸",
  },
  {
    title: "中国元素的克制运用",
    desc: "节气时辰以竖排宋体呈现、自绘文化图标点缀其间——不是堆砌符号，而是让传统韵味自然生长于现代界面中",
  },
  {
    title: "温暖而非冰冷",
    desc: "琥珀金代替科技蓝、古纸底色代替纯白、阴影营造立体感而非线条切割——每一处视觉选择都指向同一个方向：温暖引导、回归自我",
  },
];

// ─── 四大功能空间 ─────────────────────────────────────

const FOUR_SPACES = [
  {
    icon: PavilionIcon,
    name: "湖心亭",
    title: "首页 · 回到此刻",
    desc: "以呼吸引导为核心，三层圆环以不同节奏脉动。配合24节气与十二时辰，让每次打开都是一次回到当下的邀请",
    color: AMBER,
  },
  {
    icon: ScrollIcon,
    name: "古卷轴",
    title: "人类手册 · 认识自己",
    desc: "身心成长的知识宝库，汇集关于自我认知、情绪管理、个人成长的精华内容",
    color: SAGE,
  },
  {
    icon: BaguaIcon,
    name: "先天八卦",
    title: "新人生之路 · 探索可能",
    desc: "基于东方哲学的自我探索工具，帮助你理解自身模式，发现新的人生方向与可能性",
    color: "#B4A0C8",
  },
  {
    icon: TaijiIcon,
    name: "太极",
    title: "明镜 · 清晰洞察",
    desc: "如同一面清澈的镜子，帮你看清自己。通过练习与自我对话，培养专注力与内心宁静",
    color: AMBER,
  },
];

// ─── 产品特色 ─────────────────────────────────────────

const FEATURES = [
  {
    num: "01",
    title: "放松练习",
    desc: "从5分钟呼吸引导开始，循序渐进地培养对当下的专注力。不需要经验，不需要技巧——只需要回到此刻",
  },
  {
    num: "02",
    title: "节气时辰",
    desc: "融合24节气与十二时辰的中国传统时间智慧，让你在每个时刻都能感受到天地自然的节律",
  },
  {
    num: "03",
    title: "内容引导",
    desc: '精心策划的文章、音频与练习指南，从"为什么焦虑"到"如何回到当下"，陪伴你走过每一步',
  },
  {
    num: "04",
    title: "温暖社区",
    desc: "同行者的声音汇聚于此。分享你的练习体验，听见他人的共鸣，在成长的路上你并不孤单",
  },
];

// ─── 动画入场 Hook ────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ─── 区块标题组件 ─────────────────────────────────────

function ShowcaseSection({
  title,
  subtitle,
  children,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const { ref, isVisible } = useInView();
  const textColor = dark ? "#FFFBF5" : "#3A3028";
  const subColor = dark ? "rgba(255,251,245,0.6)" : "rgba(58,48,40,0.5)";

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "80px 40px",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <h2
          style={{
            fontFamily: SERIF,
            fontSize: 36,
            fontWeight: 400,
            color: textColor,
            letterSpacing: 4,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              fontWeight: 300,
              color: subColor,
              marginTop: 12,
              letterSpacing: 1,
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        )}
        <div
          style={{
            width: 40,
            height: 2,
            background: AMBER,
            margin: "24px auto 0",
            borderRadius: 1,
          }}
        />
      </div>
      {children}
    </div>
  );
}

// ─── 全局动画 keyframes ──────────────────────────────

function MockupStyles() {
  // textCompensate 反向补偿值与实际代码一致
  const comp097 = (1 / 0.97).toFixed(4); // ≈ 1.0309
  const comp103 = (1 / 1.03).toFixed(4); // ≈ 0.9709

  return (
    <style>{`
      @keyframes mockBreathOuter {
        0%, 100% { transform: scale(0.92); opacity: 0.45; }
        50% { transform: scale(1.08); opacity: 1; }
      }
      @keyframes mockBreathMid {
        0%, 100% { transform: scale(0.95); opacity: 0.55; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      @keyframes mockBreathInner {
        0%, 100% { transform: scale(0.97); opacity: 0.8; }
        50% { transform: scale(1.03); opacity: 1; }
      }
      /* 文字反向补偿 — 抵消内圈 scale，保持文字大小恒定 */
      @keyframes mockTextCompensate {
        0%, 100% { transform: scale(${comp097}); }
        50% { transform: scale(${comp103}); }
      }
      /* 收 — 吸气(扩张 50%)时高亮 */
      @keyframes mockHighlightIn {
        0%, 100% { color: rgba(255,255,255,0.3); }
        45%, 55% { color: rgba(255,255,255,1); }
      }
      /* 清 — 呼气(收缩 0%/100%)时高亮 */
      @keyframes mockHighlightOut {
        0%, 100% { color: rgba(255,255,255,1); }
        45%, 55% { color: rgba(255,255,255,0.3); }
      }
      @keyframes mockGuideBreath {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 1; }
      }
      @keyframes mockScrollHint {
        0%, 100% { transform: translateY(0); opacity: 0.5; }
        50% { transform: translateY(3px); opacity: 1; }
      }
    `}</style>
  );
}

// ─── 手机 Mockup — Hero 页面（精确还原） ──────────────

function PhoneMockup() {
  return (
    <div
      style={{ position: "relative", width: 320, height: 650, flexShrink: 0 }}
    >
      <MockupStyles />
      {/* 手机外框 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          background: "#1a1a1a",
          boxShadow: `
            0 0 0 2px #333,
            0 20px 60px rgba(0,0,0,0.5),
            0 0 120px rgba(196,154,108,0.08)
          `,
        }}
      >
        {/* 刘海 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 28,
            background: "#1a1a1a",
            borderRadius: "0 0 18px 18px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 5,
              background: "#333",
              borderRadius: 3,
            }}
          />
        </div>

        {/* ── 屏幕 ── */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            right: 4,
            bottom: 4,
            borderRadius: 40,
            overflow: "hidden",
            background: PARCHMENT,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* 背景图 — objectPosition 与实际一致（center center, cover） */}
            <img
              src={HERO_BG}
              alt="Background"
              style={{
                width: "100%",
                height: "105%",
                objectFit: "cover",
                objectPosition: "center 40%",
              }}
            />
            {/* 遮罩 — 深琥珀色 rgba(30,20,10,...) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, 
                  rgba(30,20,10,0.32) 0%, 
                  rgba(30,20,10,0.15) 10%,
                  rgba(30,20,10,0.04) 25%,
                  transparent 40%,
                  transparent 75%,
                  rgba(30,20,10,0.06) 90%,
                  rgba(30,20,10,0.15) 100%
                )`,
              }}
            />

            {/* ── Header：左头像 + 右竖排节气（三列从右往左读） ── */}
            <div
              style={{
                position: "absolute",
                top: 36,
                left: 20,
                right: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {/* 头像 */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.35)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, rgba(196,154,108,0.5), rgba(139,170,125,0.4))",
                  }}
                />
              </div>
              {/* 节气竖排三列：右→左 = 节气名 | 时辰 | 描述 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  gap: 4,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    writingMode: "vertical-rl",
                    fontFamily: SERIF,
                    fontSize: 16,
                    fontWeight: 400,
                    color: "white",
                    letterSpacing: 3,
                    textShadow:
                      "0 1px 4px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.15)",
                  }}
                >
                  立春
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      fontFamily: SERIF,
                      fontSize: 8,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.5)",
                      textShadow:
                        "0 1px 4px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.15)",
                      letterSpacing: 1.5,
                    }}
                  >
                    辰时
                  </span>
                  <span
                    style={{
                      width: 1.5,
                      height: 1.5,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      fontFamily: SERIF,
                      fontSize: 8,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.5)",
                      textShadow:
                        "0 1px 4px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.15)",
                      letterSpacing: 1.5,
                      opacity: 0.8,
                    }}
                  >
                    食时
                  </span>
                </div>
                <span
                  style={{
                    writingMode: "vertical-rl",
                    fontFamily: SERIF,
                    fontSize: 7,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.65)",
                    textShadow:
                      "0 1px 4px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.15)",
                    letterSpacing: 1.5,
                  }}
                >
                  春到人间草木知
                </span>
              </div>
            </div>

            {/* ── 呼吸圆环 — 与源码完全一致：flex居中 + 三层同级absolute + inset:0/margin:auto ── */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: "12%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 140,
                  height: 140,
                }}
              >
                {/* 外圈光晕 — absolute inset:0，填满父容器 */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(196,154,108,0.18) 0%, rgba(196,154,108,0.06) 50%, transparent 70%)",
                    animation: "mockBreathOuter 8s ease-in-out infinite",
                    willChange: "transform, opacity",
                  }}
                />
                {/* 中圈 — absolute inset:0 margin:auto */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(255,252,245,0.28) 0%, rgba(255,252,245,0.1) 60%, transparent 100%)",
                    animation: "mockBreathMid 8s ease-in-out infinite 0.5s",
                    willChange: "transform, opacity",
                  }}
                />
                {/* 内圈 — absolute inset:0 margin:auto */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(255,248,235,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "mockBreathInner 8s ease-in-out infinite",
                    willChange: "transform, opacity",
                  }}
                >
                  {/* 文字容器 — 反向补偿缩放，文字大小视觉恒定 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      animation: "mockTextCompensate 8s ease-in-out infinite",
                      willChange: "transform",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 14,
                        fontWeight: 400,
                        textShadow:
                          "0 1px 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.2)",
                        animation: "mockHighlightIn 8s ease-in-out infinite",
                        lineHeight: 1,
                      }}
                    >
                      收
                    </span>
                    <span
                      style={{
                        width: 1,
                        height: 9,
                        background: "rgba(255,255,255,0.3)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: SERIF,
                        fontSize: 14,
                        fontWeight: 400,
                        textShadow:
                          "0 1px 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.2)",
                        animation: "mockHighlightOut 8s ease-in-out infinite",
                        lineHeight: 1,
                      }}
                    >
                      清
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 底部区域：探索 + 三卡片 + 箭头 ── */}
            <div
              style={{
                position: "absolute",
                bottom: 50,
                left: 20,
                right: 20,
              }}
            >
              {/* 探索 — 竖排 + 右上/左下弧线 + 呼吸动画 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    animation: "mockGuideBreath 3.5s ease-in-out infinite",
                  }}
                >
                  {/* 右上弧线 */}
                  <span
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -6,
                      width: 8,
                      height: 8,
                      borderTop: "1px solid rgba(255,255,255,0.55)",
                      borderRight: "1px solid rgba(255,255,255,0.55)",
                      borderTopRightRadius: 4,
                      pointerEvents: "none",
                    }}
                  />
                  {/* 左下弧线 */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: -3,
                      left: -6,
                      width: 8,
                      height: 8,
                      borderBottom: "1px solid rgba(255,255,255,0.55)",
                      borderLeft: "1px solid rgba(255,255,255,0.55)",
                      borderBottomLeftRadius: 4,
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      writingMode: "vertical-rl",
                      display: "block",
                      fontFamily: SERIF,
                      fontSize: 10,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.88)",
                      letterSpacing: 3,
                      textShadow:
                        "0 1px 4px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    探索
                  </span>
                </div>
              </div>

              {/* 三张玻璃卡片 — 竖排单字 + 图标 */}
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  {
                    label: "徐",
                    bg: "linear-gradient(135deg, rgba(196,154,108,0.25), rgba(212,176,138,0.1))",
                    icon: "cloud",
                  },
                  {
                    label: "止",
                    bg: "linear-gradient(135deg, rgba(139,170,125,0.28), rgba(168,192,157,0.12))",
                    icon: "leaf",
                  },
                  {
                    label: "定",
                    bg: "linear-gradient(135deg, rgba(180,160,200,0.22), rgba(200,185,215,0.1))",
                    icon: "moon",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    style={{
                      flex: 1,
                      height: 64,
                      borderRadius: 12,
                      background: card.bg,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 3,
                      boxShadow:
                        "0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.12)",
                    }}
                  >
                    <span
                      style={{
                        writingMode: "vertical-rl",
                        fontFamily: SERIF,
                        fontSize: 9,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: 1.5,
                        textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {card.label}
                    </span>
                    {card.icon === "cloud" && (
                      <SoftCloudIcon
                        style={{
                          width: 13,
                          height: 13,
                          color: "rgba(255,255,255,0.8)",
                          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))",
                        }}
                        strokeWidth={1.3}
                      />
                    )}
                    {card.icon === "leaf" && (
                      <Leaf
                        size={13}
                        strokeWidth={1.3}
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))",
                        }}
                      />
                    )}
                    {card.icon === "moon" && (
                      <Moon
                        size={13}
                        strokeWidth={1.3}
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.2))",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 向下箭头引导 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    animation: "mockScrollHint 2s ease-in-out infinite",
                    filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.6))",
                  }}
                />
              </div>
            </div>

            {/* ── 底部导航栏 ── */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(50,43,32,0.55)",
                padding: "8px 24px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                borderRadius: "0 0 40px 40px",
              }}
            >
              {[PavilionIcon, ScrollIcon, BaguaIcon, TaijiIcon].map(
                (Icon, i) => (
                  <Icon
                    key={i}
                    style={{
                      width: 20,
                      height: 20,
                      color: i === 0 ? "white" : "rgba(255,255,255,0.6)",
                      filter: "drop-shadow(0 0 0.3px currentColor)",
                    }}
                    strokeWidth={i === 0 ? 1.8 : 1.5}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 内容页手机 Mockup（精确还原） ────────────────────

function PhoneMockupContent() {
  return (
    <div
      style={{ position: "relative", width: 320, height: 650, flexShrink: 0 }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          background: "#1a1a1a",
          boxShadow: `
            0 0 0 2px #333,
            0 20px 60px rgba(0,0,0,0.5),
            0 0 120px rgba(196,154,108,0.08)
          `,
        }}
      >
        {/* 刘海 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 28,
            background: "#1a1a1a",
            borderRadius: "0 0 18px 18px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 60,
              height: 5,
              background: "#333",
              borderRadius: 3,
            }}
          />
        </div>

        {/* ── 屏幕 — 内容页 ── */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            right: 4,
            bottom: 4,
            borderRadius: 40,
            overflow: "hidden",
            background: `linear-gradient(to bottom, ${PARCHMENT}, #F5E8D2)`,
            textAlign: "left",
          }}
        >
          {/* ── 吸顶 Header — 横排模式（精确还原 SolarTermDisplay horizontal） ── */}
          <div
            style={{
              padding: "32px 20px 10px",
              background: PARCHMENT,
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {/* 左侧：节气横排 — 与实际代码结构一致 */}
              <div style={{ textAlign: "left" }}>
                {/* 第一行：节气名 ｜ 时辰 */}
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 16,
                      fontWeight: 400,
                      color: "#3D3428",
                      letterSpacing: 2,
                    }}
                  >
                    立春
                  </span>
                  <span
                    style={{
                      width: 1,
                      height: 8,
                      background: "rgba(61,52,40,0.15)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 300,
                      color: "rgba(61,52,40,0.4)",
                      fontFamily: SERIF,
                      letterSpacing: 1,
                    }}
                  >
                    辰时
                    <span style={{ margin: "0 3px", opacity: 0.5 }}>·</span>
                    食时
                  </span>
                </div>
                {/* 第二行：描述 — 左对齐，与上方节气名对齐 */}
                <p
                  style={{
                    fontSize: 7,
                    fontWeight: 300,
                    color: "rgba(61,52,40,0.7)",
                    fontFamily: SERIF,
                    marginTop: 4,
                    marginBottom: 0,
                    marginLeft: 0,
                    letterSpacing: 1,
                    textAlign: "left",
                  }}
                >
                  春到人间草木知
                </p>
              </div>
              {/* 右侧：头像 */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(61,52,40,0.08)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg, rgba(196,154,108,0.4), rgba(139,170,125,0.3))",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── 内容区 ── */}
          <div style={{ padding: "10px 16px", textAlign: "left" }}>
            {/* 今日之光 — 渐变卡片 */}
            <div
              style={{
                position: "relative",
                borderRadius: 14,
                padding: "14px 12px",
                background:
                  "linear-gradient(135deg, rgba(196,154,108,0.25) 0%, rgba(139,170,125,0.12) 50%, rgba(212,176,138,0.1) 100%)",
                marginBottom: 12,
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(196,154,108,0.08)",
              }}
            >
              {/* 装饰光点 */}
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  right: -16,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(196,154,108,0.15) 0%, transparent 70%)",
                }}
              />
              <div
                style={{
                  fontSize: 7,
                  fontFamily: SERIF,
                  fontWeight: 400,
                  color: AMBER,
                  letterSpacing: 2,
                  marginBottom: 5,
                }}
              >
                今日之光
              </div>
              <p
                style={{
                  fontFamily: SERIF,
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#3A3028",
                  lineHeight: 1.8,
                  marginTop: 0,
                  marginBottom: 5,
                }}
              >
                当你回到自己，世界便回到了它本来的样子
              </p>
              <p
                style={{
                  fontSize: 7,
                  fontWeight: 300,
                  color: "rgba(58,48,40,0.45)",
                  fontFamily: SERIF,
                  margin: 0,
                }}
              >
                —— 元思想 · 感知笔记
              </p>
            </div>

            {/* 精选推荐 — 图片叠层 */}
            <div
              style={{
                borderRadius: 14,
                height: 95,
                overflow: "hidden",
                position: "relative",
                marginBottom: 14,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <img
                src={FEATURED_IMG}
                alt="Featured"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(30,25,18,0.5) 0%, rgba(30,25,18,0.1) 40%, transparent 65%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "0 12px 10px",
                }}
              >
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.92)",
                    letterSpacing: 1,
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  回到此刻，感知呼吸
                </span>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.65)",
                    marginTop: 3,
                  }}
                >
                  5分钟 · 放松引导
                </span>
              </div>
            </div>

            {/* ── 今日频率指南 ── */}
            <div style={{ marginBottom: 14 }}>
              {/* 区块标题行 — 琥珀竖线 + 标题 + 右箭头 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      width: 2,
                      height: 11,
                      borderRadius: 1,
                      background: AMBER,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#3A3028",
                    }}
                  >
                    今日频率指南
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                  style={{ color: AMBER }}
                />
              </div>
              <p
                style={{
                  fontSize: 7,
                  fontWeight: 300,
                  color: "rgba(58,48,40,0.45)",
                  marginTop: 0,
                  marginBottom: 6,
                }}
              >
                给自己一段安静的时间
              </p>
              {/* 两列卡片 — 与 ContentCard 实际结构一致：图片 + 下方文字（无背景框） */}
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  {
                    title: "为什么越努力反而越焦虑",
                    sub: "【人生十字】周末生活的情感探索",
                    img: PLACEHOLDER_IMAGES.a,
                  },
                  {
                    title: "为什么你总感觉不够好",
                    sub: "【暇思空间】把理想追求当作锚点",
                    img: PLACEHOLDER_IMAGES.b,
                  },
                ].map((card, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    {/* 图片 — 16:9 宽幅 */}
                    <div
                      style={{
                        aspectRatio: "16/9",
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        marginBottom: 4,
                      }}
                    >
                      <img
                        src={card.img}
                        alt={card.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    {/* 文字 — 左对齐，自然换行 */}
                    <div
                      style={{
                        fontSize: 8,
                        fontWeight: 400,
                        color: "#3A3028",
                        marginBottom: 1,
                        textAlign: "left",
                        lineHeight: 1.4,
                      }}
                    >
                      {card.title}
                    </div>
                    <div
                      style={{
                        fontSize: 6,
                        color: "rgba(58,48,40,0.45)",
                        textAlign: "left",
                        lineHeight: 1.3,
                      }}
                    >
                      {card.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 放松入门 ── */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      width: 2,
                      height: 11,
                      borderRadius: 1,
                      background: AMBER,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#3A3028",
                    }}
                  >
                    放松入门
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                  style={{ color: AMBER }}
                />
              </div>
              <p
                style={{
                  fontSize: 7,
                  fontWeight: 300,
                  color: "rgba(58,48,40,0.45)",
                  marginTop: 0,
                  marginBottom: 6,
                }}
              >
                从当下这一刻开始练习
              </p>
              {/* 三列卡片 — 正方形 + 下方文字 */}
              <div style={{ display: "flex", gap: 5 }}>
                {[
                  { t: "感知此刻", img: PLACEHOLDER_IMAGES.c },
                  { t: "感知此刻", img: PLACEHOLDER_IMAGES.d },
                  { t: "感知此刻", img: PLACEHOLDER_IMAGES.a },
                ].map((card, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div
                      style={{
                        aspectRatio: "1/1",
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        marginBottom: 4,
                      }}
                    >
                      <img
                        src={card.img}
                        alt={card.t}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 7,
                        fontWeight: 400,
                        color: "#3A3028",
                        marginBottom: 1,
                        textAlign: "left",
                      }}
                    >
                      {card.t}
                    </div>
                    <div
                      style={{
                        fontSize: 5,
                        color: "rgba(58,48,40,0.45)",
                        textAlign: "left",
                      }}
                    >
                      {i === 0
                        ? "5分钟·呼吸引导"
                        : i === 1
                          ? "5-10分钟·聚焦感"
                          : "5分钟"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 底部导航 ── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(50,43,32,0.55)",
              padding: "8px 24px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: "0 0 40px 40px",
            }}
          >
            {[PavilionIcon, ScrollIcon, BaguaIcon, TaijiIcon].map((Icon, i) => (
              <Icon
                key={i}
                style={{
                  width: 20,
                  height: 20,
                  color: i === 0 ? "white" : "rgba(255,255,255,0.6)",
                  filter: "drop-shadow(0 0 0.3px currentColor)",
                }}
                strokeWidth={i === 0 ? 1.8 : 1.5}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  Showcase 主组件
// ═══════════════════════════════════════════════════════

export function Showcase() {
  const { ref: heroRef, isVisible: heroVisible } = useInView(0.05);

  return (
    <div
      style={{
        fontFamily: SANS,
        color: "#3A3028",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ═══ 1. Hero 区 ═══ */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(145deg, ${BRAND_DARK} 0%, ${BRAND_WARM} 40%, #2D2318 100%)`,
          overflow: "hidden",
        }}
      >
        {/* 装饰光斑 */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,154,108,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,170,125,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            padding: "60px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 80,
            flexWrap: "wrap",
          }}
        >
          {/* 左侧品牌 */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: 560,
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s ease 0.2s",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 48,
                  background: `linear-gradient(to bottom, ${AMBER}, ${SAGE})`,
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 14,
                  fontWeight: 300,
                  color: "rgba(255,251,245,0.4)",
                  letterSpacing: 6,
                }}
              >
                META MIND
              </span>
            </div>

            <h1
              style={{
                fontFamily: SERIF,
                fontSize: 64,
                fontWeight: 400,
                color: "#FFFBF5",
                letterSpacing: 8,
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              元思想
            </h1>

            {/* <p
              style={{
                fontFamily: SERIF,
                fontSize: 22,
                fontWeight: 300,
                color: "rgba(255,251,245,0.65)",
                letterSpacing: 3,
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              身心成长平台
            </p> */}

            <p
              style={{
                fontSize: 15,
                fontWeight: 300,
                color: "rgba(255,251,245,0.4)",
                marginTop: 32,
                lineHeight: 1.8,
                maxWidth: 420,
                letterSpacing: 0.5,
              }}
            >
              在快节奏的世界中，我们需要一个回到自己的入口。
              元思想以东方智慧为底色，用温暖的方式陪伴你慢下来、停下来、静下来。
            </p>

            <div
              style={{
                marginTop: 48,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: AMBER,
                  boxShadow: `0 0 12px ${AMBER}`,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: "rgba(255,251,245,0.35)",
                  letterSpacing: 1,
                }}
              >
                产品内测中 · 即将上线
              </span>
            </div>
          </div>

          {/* 右侧手机 */}
          <div
            style={{
              flex: "0 0 auto",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(50px)",
              transition: "all 1.2s ease 0.5s",
            }}
          >
            <PhoneMockup />
          </div>
        </div>

        {/* 底部过渡 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: `linear-gradient(to bottom, transparent, ${PARCHMENT})`,
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ═══ 2. 双屏展示 ═══ */}
      <section style={{ background: PARCHMENT }}>
        <ShowcaseSection
          title="沉浸式交互体验"
          subtitle="远山呼吸 · 古卷展开 · 两种阅读模式无缝切换"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 48,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <PhoneMockup />
              <p
                style={{
                  marginTop: 24,
                  fontFamily: SERIF,
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#3A3028",
                  letterSpacing: 2,
                }}
              >
                呼吸引导
              </p>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 300,
                  color: "rgba(58,48,40,0.4)",
                  marginTop: 6,
                }}
              >
                竖排节气 · 三层呼吸圆环 · 感知入口
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <PhoneMockupContent />
              <p
                style={{
                  marginTop: 24,
                  fontFamily: SERIF,
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#3A3028",
                  letterSpacing: 2,
                }}
              >
                内容浏览
              </p>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 300,
                  color: "rgba(58,48,40,0.4)",
                  marginTop: 6,
                }}
              >
                语录卡片 · 精选推荐 · 内容导航
              </p>
            </div>
          </div>
        </ShowcaseSection>
      </section>

      {/* ═══ 3. 核心理念 ═══ */}
      <section
        style={{
          background: `linear-gradient(180deg, ${PARCHMENT} 0%, #FAF7F2 100%)`,
        }}
      >
        <ShowcaseSection
          title="由动入静的渐进之路"
          subtitle="源自《大学》—— 知止而后有定，定而后能静"
        >
          <div
            style={{
              display: "flex",
              gap: 32,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {PHILOSOPHY.map((item, i) => (
              <div
                key={item.char}
                style={{
                  flex: "1 1 280px",
                  maxWidth: 340,
                  padding: "48px 32px",
                  borderRadius: 24,
                  background: "rgba(255,252,245,0.7)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                  textAlign: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(0,0,0,0.04)";
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 56,
                    fontWeight: 300,
                    color: item.color,
                    lineHeight: 1,
                    marginBottom: 20,
                  }}
                >
                  {item.char}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 20,
                    fontWeight: 400,
                    color: "#3A3028",
                    marginBottom: 16,
                    letterSpacing: 2,
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 300,
                    color: "rgba(58,48,40,0.55)",
                    lineHeight: 1.7,
                    letterSpacing: 0.5,
                  }}
                >
                  {item.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    marginTop: 28,
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <div
                      key={dot}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background:
                          dot === i ? item.color : "rgba(58,48,40,0.12)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ShowcaseSection>
      </section>

      {/* ═══ 4. 四大功能空间 ═══ */}
      <section style={{ background: "#FAF7F2" }}>
        <ShowcaseSection
          title="四大功能空间"
          subtitle="每一个入口，都是一段自我成长的旅程"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24,
            }}
          >
            {FOUR_SPACES.map((space) => {
              const Icon = space.icon;
              return (
                <div
                  key={space.name}
                  style={{
                    padding: "40px 28px",
                    borderRadius: 24,
                    background: "rgba(255,252,245,0.7)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                    textAlign: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(0,0,0,0.04)";
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      background: `linear-gradient(135deg, ${space.color}15, ${space.color}08)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      color: space.color,
                    }}
                  >
                    <Icon style={{ width: 32, height: 32 }} strokeWidth={1.3} />
                  </div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 13,
                      fontWeight: 300,
                      color: space.color,
                      letterSpacing: 2,
                      marginBottom: 8,
                    }}
                  >
                    {space.name}
                  </div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 18,
                      fontWeight: 400,
                      color: "#3A3028",
                      marginBottom: 14,
                      letterSpacing: 1,
                    }}
                  >
                    {space.title}
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 300,
                      color: "rgba(58,48,40,0.55)",
                      lineHeight: 1.75,
                      letterSpacing: 0.3,
                    }}
                  >
                    {space.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </ShowcaseSection>
      </section>

      {/* ═══ 5. 金句横幅 ═══ */}
      <section
        style={{
          position: "relative",
          padding: "100px 40px",
          background: `linear-gradient(145deg, ${BRAND_DARK} 0%, ${BRAND_WARM} 100%)`,
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* 装饰光斑 */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            left: "20%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,154,108,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: 40,
              height: 2,
              background: `linear-gradient(to right, ${AMBER}, ${SAGE})`,
              margin: "0 auto 40px",
              borderRadius: 1,
            }}
          />
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 28,
              fontWeight: 300,
              color: "rgba(255,251,245,0.75)",
              lineHeight: 1.8,
              letterSpacing: 3,
            }}
          >
            当你回到自己，
            <br />
            世界便回到了它本来的样子
          </p>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 13,
              fontWeight: 300,
              color: "rgba(255,251,245,0.25)",
              marginTop: 32,
              letterSpacing: 2,
            }}
          >
            —— 元思想 · 感知笔记
          </p>
          <div
            style={{
              width: 40,
              height: 2,
              background: `linear-gradient(to right, ${SAGE}, ${AMBER})`,
              margin: "40px auto 0",
              borderRadius: 1,
            }}
          />
        </div>
      </section>

      {/* ═══ 6. 产品特色 ═══ */}
      <section style={{ background: PARCHMENT }}>
        <ShowcaseSection
          title="你将获得"
          subtitle="从呼吸开始，找到回到自己的路"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {FEATURES.map((feat) => (
              <div
                key={feat.num}
                style={{
                  padding: "36px 28px",
                  borderRadius: 20,
                  background: "rgba(255,252,245,0.6)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  transition: "transform 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 32,
                    fontWeight: 300,
                    color: "rgba(196,154,108,0.2)",
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {feat.num}
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#3A3028",
                    marginBottom: 12,
                    letterSpacing: 1,
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(58,48,40,0.55)",
                    lineHeight: 1.75,
                    letterSpacing: 0.3,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </ShowcaseSection>
      </section>

      {/* ═══ 7. 设计语言 ═══ */}
      <section
        style={{
          background: `linear-gradient(180deg, ${PARCHMENT} 0%, #FAF7F2 100%)`,
        }}
      >
        <ShowcaseSection
          title="设计语言"
          subtitle="每一处视觉选择都指向同一个方向——温暖引导、回归自我"
        >
          {/* 设计愿景 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              marginBottom: 60,
            }}
          >
            {DESIGN_VISIONS.map((vision, i) => (
              <div
                key={vision.title}
                style={{
                  padding: "36px 28px",
                  borderRadius: 20,
                  background: "rgba(255,252,245,0.6)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  transition: "transform 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 32,
                    fontWeight: 300,
                    color: "rgba(196,154,108,0.2)",
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#3A3028",
                    marginBottom: 12,
                    letterSpacing: 1,
                  }}
                >
                  {vision.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(58,48,40,0.55)",
                    lineHeight: 1.75,
                    letterSpacing: 0.3,
                  }}
                >
                  {vision.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 色彩与图标 */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 22,
                fontWeight: 400,
                color: "#3A3028",
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              色彩与文化图标
            </h3>
            <p
              style={{
                fontSize: 14,
                fontWeight: 300,
                color: "rgba(58,48,40,0.45)",
                letterSpacing: 0.5,
              }}
            >
              琥珀金的智慧之光 · 鼠尾草绿的自然生长 · 传统意象的现代表达
            </p>
          </div>

          {/* 色板 — 紧凑横排 */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 48,
            }}
          >
            {COLOR_PALETTE.map((color) => (
              <div
                key={color.hex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: color.hex,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                />
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 11,
                    fontWeight: 400,
                    color: "#3A3028",
                    textAlign: "center",
                  }}
                >
                  {color.name}
                </div>
              </div>
            ))}
          </div>

          {/* 文化图标 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: PavilionIcon, name: "湖心亭" },
              { icon: ScrollIcon, name: "古卷轴" },
              { icon: BaguaIcon, name: "先天八卦" },
              { icon: TaijiIcon, name: "太极" },
              { icon: SoftCloudIcon, name: "柔和云朵" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      background: "rgba(255,252,245,0.8)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3A3028",
                    }}
                  >
                    <Icon style={{ width: 32, height: 32 }} strokeWidth={1.3} />
                  </div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#3A3028",
                      letterSpacing: 1,
                    }}
                  >
                    {item.name}
                  </div>
                </div>
              );
            })}
          </div>
        </ShowcaseSection>
      </section>

      {/* ═══ 8. CTA — 内测邀请 ═══ */}
      <section
        style={{
          position: "relative",
          padding: "80px 40px",
          background: `linear-gradient(145deg, ${BRAND_DARK} 0%, #2D2318 100%)`,
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(196,154,108,0.06) 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 36,
              fontWeight: 300,
              color: "rgba(255,251,245,0.65)",
              letterSpacing: 4,
              marginBottom: 20,
              lineHeight: 1.4,
            }}
          >
            元思想内测进行中
          </div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: "rgba(255,251,245,0.35)",
              lineHeight: 1.8,
              letterSpacing: 0.5,
              marginBottom: 36,
            }}
          >
            我们正在用心打磨每一个细节。
            <br />
            如果你也相信「慢下来才能看见自己」，期待与你在元思想相遇。
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: SAGE,
                boxShadow: `0 0 12px ${SAGE}`,
              }}
            />
            <span
              style={{
                fontFamily: SERIF,
                fontSize: 14,
                fontWeight: 300,
                color: "rgba(255,251,245,0.4)",
                letterSpacing: 2,
              }}
            >
              即将上线 · 敬请期待
            </span>
          </div>
        </div>
      </section>

      {/* ═══ 9. 页脚 ═══ */}
      <footer
        style={{
          background: BRAND_DARK,
          padding: "48px 40px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 24,
            fontWeight: 300,
            color: "rgba(255,251,245,0.15)",
            letterSpacing: 6,
            marginBottom: 8,
          }}
        >
          元思想
        </div>
        <p
          style={{
            fontSize: 12,
            fontWeight: 300,
            color: "rgba(255,251,245,0.1)",
            letterSpacing: 1,
            lineHeight: 1.8,
          }}
        >
          温暖引导 · 回归自我
        </p>
        <div
          style={{
            width: 40,
            height: 1,
            background: "rgba(196,154,108,0.12)",
            margin: "28px auto",
          }}
        />
        {/* 备案信息 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            fontSize: 11,
            fontWeight: 300,
            color: "rgba(255,251,245,0.2)",
            letterSpacing: 0.3,
          }}
        >
          <span>&copy; 2025 元思想（北京）文化传播有限公司</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <img
            src="https://beian.mps.gov.cn/img/head-logo2.4d29d9b1.png"
            width={14}
            height={14}
            alt="公安备案"
            style={{ opacity: 0.35, verticalAlign: "middle" }}
          />
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=51015602001384"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(255,251,245,0.25)",
              textDecoration: "none",
              borderBottom: "1px dotted rgba(196,154,108,0.2)",
            }}
          >
            川公网安备51015602001384号
          </a>
          <span style={{ opacity: 0.4 }}>·</span>
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(255,251,245,0.25)",
              textDecoration: "none",
              borderBottom: "1px dotted rgba(196,154,108,0.2)",
            }}
          >
            京ICP备2025142983号-1
          </a>
        </div>
      </footer>
    </div>
  );
}
