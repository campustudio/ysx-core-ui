/**
 * NewLifePath - 新人生之路 · 活的道路 (version 2.3 - 四层架构版)
 *
 * 核心定位（基于第五卷深度理解）：
 * - 承接个体进入新文明的路径
 * - 四层架构：个人路径 → 同频相遇 → 小组践行 → 连接线下
 * - “这本书结束的地方，正是新文明开始的地方”
 */

import { useState, useCallback, useEffect } from "react";
import { User, Users, Globe, MapPin, ChevronRight } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { useNavigation } from "../hooks/useNavigation";

/** 四层架构数据 - 基于第五卷 */
const PATH_LAYERS = [
  {
    id: "personal",
    layer: 1,
    title: "个人路径",
    subtitle: "一个人开始真实活",
    description:
      "重新学会“在”：在吃饭时真的在，在说话时真的在，在陡伴时真的在。",
    icon: "User",
    status: "active",
    dimensions: ["身体", "情绪", "关系", "日常", "选择"],
  },
  {
    id: "resonance",
    layer: 2,
    title: "同频相遇",
    subtitle: "第二个同频者出现",
    description:
      "共振的起点，是彼此照见与彼此成全。基于生命质量的相认，而非观点一致。",
    icon: "Users",
    status: "coming",
    dimensions: ["同频识别", "彼此照见", "共振提醒"],
  },
  {
    id: "group",
    layer: 3,
    title: "小组践行",
    subtitle: "几个人真实活在一起",
    description:
      "小组不是组织，是共振中的临时生命体。自愿而非情感捆绑，真实表达而非表面维持。",
    icon: "Users",
    status: "coming",
    dimensions: ["共享状态", "践行主题", "彼此看见"],
  },
  {
    id: "offline",
    layer: 4,
    title: "连接线下",
    subtitle: "把人送回现实中的真实生长",
    description: "平台的成熟标志不是把人留在线上，而是越来越把人送回现实。",
    icon: "MapPin",
    status: "coming",
    dimensions: ["训练营", "节点", "聚落"],
  },
];

interface NewLifePathProps {
  onNavChange?: (index: number) => void;
  onNavigateToCircle?: () => void;
  onNavigateToLayer?: (layerId: string) => void;
}

export function NewLifePath({
  onNavChange,
  onNavigateToCircle,
  onNavigateToLayer,
}: NewLifePathProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const { isHidden } = useNavigation("newlife");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 2) return;
      if (index === 3) {
        toast.show("「明镜」正在精心筹备中，敬请期待");
        return;
      }
      onNavChange?.(index);
    },
    [onNavChange, toast],
  );

  const handleLayerClick = useCallback(
    (layer: (typeof PATH_LAYERS)[0]) => {
      if (layer.status === "active") {
        if (onNavigateToLayer) {
          onNavigateToLayer(layer.id);
        } else {
          toast.show(`「${layer.title}」详情页筹备中`);
        }
      } else {
        toast.show(`「${layer.title}」即将开放`);
      }
    },
    [onNavigateToLayer, toast],
  );

  const getIcon = (iconName: string, size: number, color: string) => {
    switch (iconName) {
      case "User":
        return <User size={size} color={color} strokeWidth={1.5} />;
      case "Users":
        return <Users size={size} color={color} strokeWidth={1.5} />;
      case "MapPin":
        return <MapPin size={size} color={color} strokeWidth={1.5} />;
      default:
        return <Globe size={size} color={color} strokeWidth={1.5} />;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F2F2F5",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    >
      {/* 顶部标题区 */}
      <div
        style={{
          padding: `calc(env(safe-area-inset-top) + ${rpx(60)}) ${rpx(40)} ${rpx(40)}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(64),
              fontWeight: 600,
              color: "#18181A",
              letterSpacing: rpx(10),
              margin: 0,
              textShadow: "0 1px 1px rgba(255,255,255,1)",
            }}
          >
            新人生之路
          </h1>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(22),
              color: "#888",
              letterSpacing: rpx(8),
              marginTop: rpx(16),
            }}
          >
            承接个体进入新文明的路径
          </p>
        </div>
      </div>

      {/* 核心金句 */}
      <div
        style={{
          padding: `0 ${rpx(40)} ${rpx(32)}`,
        }}
      >
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(24),
            color: "#666",
            letterSpacing: rpx(4),
            lineHeight: 1.8,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          "这本书结束的地方，正是新文明开始的地方。"
        </p>
      </div>

      {/* 感知圈子入口 - 紧凑样式 */}
      <div
        onClick={() => {
          if (onNavigateToCircle) onNavigateToCircle();
          else toast.show("感知圈子筹备中");
        }}
        style={{
          margin: `0 ${rpx(40)} ${rpx(16)}`,
          padding: `${rpx(14)} ${rpx(20)}`,
          background: "rgba(91,139,122,0.06)",
          borderRadius: rpx(12),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: rpx(10) }}>
          <Users size={16} color="#5B8B7A" strokeWidth={1.5} />
          <span
            style={{
              fontSize: rpx(22),
              color: "#444",
            }}
          >
            感知圈子
          </span>
          <span style={{ fontSize: rpx(16), color: "#999" }}>同频相遇</span>
        </div>
        <ChevronRight size={16} color="#999" strokeWidth={1.5} />
      </div>

      <div
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          margin: `0 ${rpx(40)}`,
        }}
      />

      {/* 四层架构路径 */}
      <div
        style={{
          flex: 1,
          padding: `${rpx(20)} ${rpx(40)} ${rpx(160)}`,
          overflowY: "auto",
        }}
      >
        {/* 生长路径示意 */}
        <div
          style={{
            padding: `${rpx(30)} 0`,
            marginBottom: rpx(20),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: rpx(12),
          }}
        >
          {["个人", "同频", "小组", "线下"].map((step, idx) => (
            <div
              key={step}
              style={{ display: "flex", alignItems: "center", gap: rpx(12) }}
            >
              <span
                style={{
                  fontSize: rpx(18),
                  color: idx === 0 ? "#222" : "#BBB",
                  fontWeight: idx === 0 ? 600 : 400,
                }}
              >
                {step}
              </span>
              {idx < 3 && (
                <span style={{ color: "#DDD", fontSize: rpx(16) }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* 四层卡片 */}
        {PATH_LAYERS.map((layer) => (
          <div
            key={layer.id}
            onClick={() => handleLayerClick(layer)}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: `${rpx(40)} 0`,
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              cursor: "pointer",
              position: "relative",
              opacity: layer.status === "active" ? 1 : 0.6,
            }}
          >
            {/* 背景层序号 */}
            <div
              style={{
                position: "absolute",
                top: rpx(30),
                right: rpx(0),
                fontFamily: FONT_SERIF,
                fontSize: rpx(120),
                fontWeight: 200,
                color: "rgba(0,0,0,0.03)",
                pointerEvents: "none",
                lineHeight: 1,
              }}
            >
              {layer.layer}
            </div>

            {/* 层标题 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(16),
                marginBottom: rpx(12),
                zIndex: 1,
              }}
            >
              {getIcon(
                layer.icon,
                20,
                layer.status === "active" ? "#333" : "#999",
              )}
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(20),
                  color: "#999",
                  letterSpacing: rpx(2),
                }}
              >
                第{["一", "二", "三", "四"][layer.layer - 1]}层
              </span>
              {layer.status === "coming" && (
                <span
                  style={{
                    fontSize: rpx(14),
                    color: "#AAA",
                    background: "rgba(0,0,0,0.03)",
                    padding: `${rpx(4)} ${rpx(10)}`,
                    borderRadius: rpx(12),
                  }}
                >
                  即将开放
                </span>
              )}
            </div>

            <h3
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(44),
                fontWeight: 600,
                color: layer.status === "active" ? "#222" : "#666",
                margin: 0,
                lineHeight: 1.3,
                letterSpacing: rpx(6),
                zIndex: 1,
              }}
            >
              {layer.title}
            </h3>

            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(22),
                color: "#888",
                margin: `${rpx(12)} 0 0`,
                letterSpacing: rpx(4),
                zIndex: 1,
              }}
            >
              {layer.subtitle}
            </p>

            {/* 简介 */}
            <p
              style={{
                fontSize: rpx(24),
                color: "#666",
                margin: `${rpx(20)} 0 ${rpx(20)}`,
                lineHeight: 1.8,
                fontWeight: 300,
                zIndex: 1,
                maxWidth: "90%",
              }}
            >
              {layer.description}
            </p>

            {/* 维度标签 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 1,
              }}
            >
              <div style={{ display: "flex", gap: rpx(12), flexWrap: "wrap" }}>
                {layer.dimensions.map((dim) => (
                  <span
                    key={dim}
                    style={{
                      fontSize: rpx(18),
                      color: "#999",
                      background: "rgba(0,0,0,0.02)",
                      padding: `${rpx(6)} ${rpx(14)}`,
                      borderRadius: rpx(16),
                    }}
                  >
                    {dim}
                  </span>
                ))}
              </div>
              <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation
        active={2}
        onChange={handleNavChange}
        hidden={isHidden}
      />

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
