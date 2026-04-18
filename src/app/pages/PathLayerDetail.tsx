/**
 * PathLayerDetail - 新人生之路层详情页 (version 1.0)
 *
 * 展示四层架构中每一层的详细内容
 * 基于第五卷深度理解设计
 */

import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronRight,
  MessageCircle,
  User,
  Users,
  MapPin,
  Globe,
} from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { useNavigation } from "../hooks/useNavigation";
import {
  PageHeader,
  PAGE_HEADER_HEIGHT,
} from "../components/shared/PageHeader";

/** 层详情数据 - 基于第五卷 */
const LAYER_DETAILS: Record<
  string,
  {
    title: string;
    subtitle: string;
    quote: string;
    description: string[];
    dimensions: { id: string; title: string; description: string }[];
    practices: { id: string; title: string; hint: string }[];
  }
> = {
  personal: {
    title: "个人路径",
    subtitle: "一个人开始真实活",
    quote: "感知者最重要的日常变化，是他开始重新学会『在』。",
    description: [
      "新文明从『一个人开始真实活』开始。这不是课程，不是打卡，而是重新学会『在』。",
      "在吃饭时真的在，在说话时真的在，在陪伴时真的在，在工作时真的在。",
      "这是一条个人的路径，没有人能替你走。但在这条路上，你不会孤单。",
    ],
    dimensions: [
      {
        id: "body",
        title: "身体",
        description: "重新学习与身体共处，倾听身体在说什么",
      },
      {
        id: "emotion",
        title: "情绪",
        description: "看见情绪，允许情绪，不逃避也不沉溺",
      },
      {
        id: "relation",
        title: "关系",
        description: "从控制/依附转向照见/成全",
      },
      {
        id: "daily",
        title: "日常",
        description: "在吃饭、工作、休息时真正『在』",
      },
      {
        id: "choice",
        title: "选择",
        description: "从『证明自己』到『真实回应』",
      },
    ],
    practices: [
      {
        id: "p1",
        title: "每日状态确认",
        hint: "今天身体感觉如何？情绪状态如何？",
      },
      {
        id: "p2",
        title: "践行提醒",
        hint: "轻轻的提醒：今天，试着在吃饭时真的在",
      },
      { id: "p3", title: "状态记录", hint: "与自己对话的空间，不是作业" },
    ],
  },
  resonance: {
    title: "同频相遇",
    subtitle: "第二个同频者出现",
    quote: "共振的起点，不是为了让自己站到某个阵营里，而是彼此照见与彼此成全。",
    description: [
      "当两个或更多生命都开始真实地在，彼此之间出现了一种可以相互听见、相互照见、相互唤醒的流动。",
      "这就是共振的开始。它不靠观点一致，不靠身份认同，而是靠内在生命的相互激活。",
      "共振让人更靠近真实，而不是更依赖群体。",
    ],
    dimensions: [
      {
        id: "identify",
        title: "同频识别",
        description: "基于生命状态和践行阶段的匹配",
      },
      {
        id: "mirror",
        title: "彼此照见",
        description: "支持真实表达和相互映照",
      },
      {
        id: "remind",
        title: "共振提醒",
        description: "当一方松了，另一方可以轻轻拉回来",
      },
    ],
    practices: [
      { id: "p1", title: "同频匹配", hint: "基于践行阶段，系统辅助识别" },
      {
        id: "p2",
        title: "一对一连接",
        hint: "重点不在次数多少，在每次连接的真实与深度",
      },
      { id: "p3", title: "彼此照见", hint: "共享践行状态，相互提醒" },
    ],
  },
  group: {
    title: "小组践行",
    subtitle: "几个人真实活在一起",
    quote: "小组不是组织，是共振中的临时生命体。",
    description: [
      "新文明的第一现场：几个人真实活在一起。",
      "不靠控制、不靠绑定，群体如何成立？它要靠的是：自愿而不是情感捆绑；真实表达而不是表面维持；清楚边界而不是隐性失责。",
      "共同面对现实而不是逃避复杂；彼此照见与承接而不是互相使用；流动中的位置感而不是固定权力结构。",
    ],
    dimensions: [
      {
        id: "share",
        title: "共享状态",
        description: "共享状态墙，彼此看见当下",
      },
      {
        id: "theme",
        title: "践行主题",
        description: "共同面对某一阶段的践行主题",
      },
      {
        id: "presence",
        title: "共同在场",
        description: "不是传统会议，是真实相处的场",
      },
    ],
    practices: [
      { id: "p1", title: "小组空间", hint: "共享状态墙、践行主题、彼此看见" },
      { id: "p2", title: "共同在场", hint: "定期的视频在场，重点在『在』" },
      { id: "p3", title: "流动边界", hint: "自愿加入/离开，不靠绑定" },
    ],
  },
  offline: {
    title: "连接线下",
    subtitle: "把人送回现实中的真实生长",
    quote:
      "平台的成熟标志不是把人留在线上，而是越来越把人送回现实中的真实生长。",
    description: [
      "元感知平台如果真是新文明线上母体，它的成熟标志恰恰不是『把人一直留在线上』，而是『越来越把人送回现实中的真实生长』。",
      "线上是孕育层，最终要把人送回现实。连接线下是必要功能。",
      "训练营负责火种点亮，节点网络负责线下身体生成，聚落是小组开始扎根现实的形态。",
    ],
    dimensions: [
      {
        id: "camp",
        title: "训练营",
        description: "线下感知训练营，火种点亮的最佳方式",
      },
      { id: "node", title: "节点", description: "线下节点，身体生成的场所" },
      { id: "settlement", title: "聚落", description: "小组扎根现实的形态" },
    ],
    practices: [
      { id: "p1", title: "发现附近", hint: "显示附近的训练营、节点、聚落" },
      { id: "p2", title: "训练营入口", hint: "报名、日程、线上承接" },
      { id: "p3", title: "节点连接", hint: "了解附近节点，申请加入" },
    ],
  },
};

interface PathLayerDetailProps {
  layerId: string;
  onBack?: () => void;
  onNavChange?: (index: number) => void;
  onNavigateToMirror?: () => void;
  onNavigateToDimension?: (layerId: string, dimensionId: string) => void;
  onNavigateToPractice?: (
    practiceId: string,
    layerId?: string,
    dimensionId?: string,
  ) => void;
  onNavigateToPracticeHistory?: () => void;
}

export function PathLayerDetail({
  layerId,
  onBack,
  onNavChange,
  onNavigateToMirror,
  onNavigateToDimension,
  onNavigateToPractice,
  onNavigateToPracticeHistory,
}: PathLayerDetailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const { isHidden } = useNavigation("path-layer");
  const layer = LAYER_DETAILS[layerId];

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = (layerId: string, size: number, color: string) => {
    switch (layerId) {
      case "personal":
        return <User size={size} color={color} strokeWidth={1.5} />;
      case "resonance":
      case "group":
        return <Users size={size} color={color} strokeWidth={1.5} />;
      case "offline":
        return <MapPin size={size} color={color} strokeWidth={1.5} />;
      default:
        return <Globe size={size} color={color} strokeWidth={1.5} />;
    }
  };

  const layerNumber =
    ["personal", "resonance", "group", "offline"].indexOf(layerId) + 1;
  const isActive = layerId === "personal"; // 目前只有第一层开放

  if (!layer) {
    return (
      <div style={{ padding: rpx(40), textAlign: "center", color: "#999" }}>
        路径层不存在
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F2F2F5",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 1s ease",
      }}
    >
      <PageHeader onBack={onBack} />
      <div style={{ paddingTop: PAGE_HEADER_HEIGHT }} />

      {/* 层标题区 */}
      <div
        style={{
          padding: `${rpx(20)} ${rpx(40)} ${rpx(40)}`,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(16),
            marginBottom: rpx(16),
          }}
        >
          {getIcon(layerId, 24, "#555")}
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(18),
              color: "#999",
              letterSpacing: rpx(2),
            }}
          >
            第{["一", "二", "三", "四"][layerNumber - 1]}层
          </span>
          {!isActive && (
            <span
              style={{
                fontSize: rpx(14),
                color: "#AAA",
                background: "rgba(0,0,0,0.03)",
                padding: `${rpx(4)} ${rpx(12)}`,
                borderRadius: rpx(12),
              }}
            >
              即将开放
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(56),
            fontWeight: 600,
            color: "#18181A",
            letterSpacing: rpx(8),
            margin: 0,
            textShadow: "0 1px 1px rgba(255,255,255,1)",
          }}
        >
          {layer.title}
        </h1>

        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(24),
            color: "#888",
            letterSpacing: rpx(4),
            margin: `${rpx(16)} 0 0`,
          }}
        >
          {layer.subtitle}
        </p>

        {/* 金句 */}
        <div
          style={{
            marginTop: rpx(30),
            padding: `${rpx(24)} ${rpx(28)}`,
            background: "rgba(0,0,0,0.02)",
            borderLeft: "3px solid rgba(0,0,0,0.1)",
            borderRadius: `0 ${rpx(8)} ${rpx(8)} 0`,
          }}
        >
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              color: "#555",
              fontStyle: "italic",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            "{layer.quote}"
          </p>
        </div>
      </div>

      {/* 内容区 */}
      <div
        style={{
          flex: 1,
          padding: `${rpx(30)} ${rpx(40)} ${rpx(100)}`,
          overflowY: "auto",
        }}
      >
        {/* 描述 */}
        <div style={{ marginBottom: rpx(40) }}>
          {layer.description.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontSize: rpx(24),
                color: "#555",
                lineHeight: 1.9,
                margin: idx === 0 ? 0 : `${rpx(20)} 0 0`,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* 践行维度 */}
        <div style={{ marginBottom: rpx(40) }}>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(28),
              fontWeight: 600,
              color: "#333",
              letterSpacing: rpx(4),
              margin: `0 0 ${rpx(24)} 0`,
            }}
          >
            践行维度
          </h2>
          {layer.dimensions.map((dim) => (
            <div
              key={dim.id}
              onClick={() => {
                if (onNavigateToDimension) {
                  onNavigateToDimension(layerId, dim.id);
                } else {
                  toast.show(`「${dim.title}」详情筹备中`);
                }
              }}
              style={{
                padding: `${rpx(24)} 0`,
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(28),
                    fontWeight: 500,
                    color: "#333",
                    margin: 0,
                    letterSpacing: rpx(2),
                  }}
                >
                  {dim.title}
                </h3>
                <p
                  style={{
                    fontSize: rpx(22),
                    color: "#777",
                    margin: `${rpx(10)} 0 0`,
                    lineHeight: 1.6,
                  }}
                >
                  {dim.description}
                </p>
              </div>
              <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
            </div>
          ))}
        </div>

        {/* 践行功能 */}
        {isActive && (
          <div style={{ marginBottom: rpx(40) }}>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(28),
                fontWeight: 600,
                color: "#333",
                letterSpacing: rpx(4),
                margin: `0 0 ${rpx(24)} 0`,
              }}
            >
              开始践行
            </h2>
            {layer.practices.map((practice) => (
              <div
                key={practice.id}
                onClick={() => {
                  if (onNavigateToPractice) {
                    onNavigateToPractice(practice.id, layerId);
                  } else {
                    toast.show(`「${practice.title}」功能筹备中`);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: `${rpx(28)} 0`,
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  cursor: "pointer",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(28),
                      fontWeight: 500,
                      color: "#333",
                      margin: 0,
                    }}
                  >
                    {practice.title}
                  </h3>
                  <p
                    style={{
                      fontSize: rpx(20),
                      color: "#999",
                      margin: `${rpx(8)} 0 0`,
                    }}
                  >
                    {practice.hint}
                  </p>
                </div>
                <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        )}

        {/* 践行记录入口 */}
        {isActive && layerId === "personal" && (
          <div
            onClick={() =>
              onNavigateToPracticeHistory && onNavigateToPracticeHistory()
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: rpx(16),
              padding: `${rpx(28)} ${rpx(24)}`,
              background: "rgba(0,0,0,0.02)",
              borderRadius: rpx(12),
              cursor: "pointer",
              marginTop: rpx(20),
            }}
          >
            <Calendar size={24} color="#666" strokeWidth={1.5} />
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(26),
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                查看践行记录
              </span>
              <p
                style={{
                  fontSize: rpx(20),
                  color: "#999",
                  margin: `${rpx(6)} 0 0`,
                }}
              >
                回顾你的成长轨迹
              </p>
            </div>
            <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
          </div>
        )}

        {/* 明镜入口 */}
        {isActive && (
          <div
            onClick={() => {
              if (onNavigateToMirror) {
                onNavigateToMirror();
              } else {
                toast.show("「明镜」正在精心筹备中");
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: rpx(16),
              padding: `${rpx(28)} ${rpx(24)}`,
              background: "rgba(0,0,0,0.02)",
              borderRadius: rpx(12),
              cursor: "pointer",
              marginTop: rpx(20),
            }}
          >
            <MessageCircle size={24} color="#666" strokeWidth={1.5} />
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(26),
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                遇到困惑？问明镜
              </span>
              <p
                style={{
                  fontSize: rpx(20),
                  color: "#999",
                  margin: `${rpx(6)} 0 0`,
                }}
              >
                明镜不给标准答案，而是帮助照见
              </p>
            </div>
            <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <BottomNavigation
        active={2}
        onChange={(index) => {
          if (index === 2) return;
          if (index === 3) {
            toast.show("「明镜」正在精心筹备中，敬请期待");
            return;
          }
          onNavChange?.(index);
        }}
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
