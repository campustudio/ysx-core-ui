/**
 * DimensionDetail - 新人生之路维度详情页 (version 1.0)
 *
 * 展示每个践行维度的详细内容和指引
 */

import { useEffect, useState } from "react";
import { ChevronRight, MessageCircle } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import {
  PageHeader,
  PAGE_HEADER_HEIGHT,
} from "../components/shared/PageHeader";

/** 维度详情数据 */
const DIMENSION_CONTENT: Record<
  string,
  {
    layerTitle: string;
    title: string;
    subtitle: string;
    description: string[];
    practices: { id: string; title: string; description: string }[];
    insights: string[];
    question: string;
  }
> = {
  body: {
    layerTitle: "个人路径",
    title: "身体",
    subtitle: "重新学习与身体共处",
    description: [
      "身体是你在这个世界上的家。但大多数人并不真正住在自己的身体里——我们住在头脑里，把身体当作一个工具或负担。",
      "重新与身体建立连接，是感知修行的基础。身体一直在向你发送信号，问题是你是否在听。",
      "当你开始真正倾听身体，你会发现它有着惊人的智慧。它知道什么时候该休息，什么时候该行动，什么是真正适合你的。",
    ],
    practices: [
      {
        id: "body-1",
        title: "身体扫描",
        description: "每天花5分钟，从头到脚感受身体的每个部位",
      },
      {
        id: "body-2",
        title: "饮食觉察",
        description: "吃饭时放下手机，感受食物的味道和身体的饱腹感",
      },
      {
        id: "body-3",
        title: "运动感知",
        description: "不是为了燃烧卡路里，而是为了感受身体的活力",
      },
    ],
    insights: [
      "身体的紧张往往反映内心的紧张",
      "疾病常常是身体在表达它长期被忽视的需求",
      "真正的健康是身心合一的状态",
    ],
    question: "此刻，你的身体有什么感觉？哪里紧张？哪里放松？",
  },
  emotion: {
    layerTitle: "个人路径",
    title: "情绪",
    subtitle: "看见情绪，允许情绪",
    description: [
      "情绪不是问题，对情绪的抗拒才是问题。我们从小被教导要控制情绪、压抑情绪，结果情绪变成了我们害怕面对的东西。",
      "真正的情绪智慧不是没有情绪，而是能够允许情绪流动。情绪像天气，来了又去，你不需要抓住它，也不需要推开它。",
      "当你开始允许情绪存在，不评判、不压抑、不沉溺，你会发现情绪其实是很好的信使——它在告诉你一些重要的事情。",
    ],
    practices: [
      {
        id: "emotion-1",
        title: "情绪命名",
        description: "当情绪升起时，试着给它命名：我感到愤怒/悲伤/焦虑",
      },
      {
        id: "emotion-2",
        title: "身体定位",
        description: "感受情绪在身体的哪个位置，它是什么形状、什么温度",
      },
      {
        id: "emotion-3",
        title: "允许存在",
        description: "不试图改变情绪，只是让它在那里，看着它自然流动",
      },
    ],
    insights: [
      "被压抑的情绪不会消失，只会以其他形式出现",
      "情绪没有好坏，只有我们对它的评判",
      "真正面对情绪反而会让它更快地流动过去",
    ],
    question: "有没有一种情绪是你长期在逃避的？",
  },
  relation: {
    layerTitle: "个人路径",
    title: "关系",
    subtitle: "从控制依附转向照见成全",
    description: [
      "关系是我们最重要的修行场。在关系中，我们所有的模式、恐惧、执着都会浮现出来。",
      "旧模式的关系建立在控制和依附上：我需要你满足我的需求，你需要符合我的期待。这种关系注定是痛苦的。",
      "新的关系是两个完整的人的相遇。不是为了填补彼此的空缺，而是为了彼此照见、彼此成全。在这样的关系中，你变得更自由，而不是更受限。",
    ],
    practices: [
      {
        id: "relation-1",
        title: "觉察期待",
        description: "在关系中，你对对方有什么隐藏的期待？",
      },
      {
        id: "relation-2",
        title: "真实表达",
        description: "试着表达真实的感受，而不是你认为对方想听的",
      },
      {
        id: "relation-3",
        title: "边界觉察",
        description: "你的边界在哪里？你是否在维护它？",
      },
    ],
    insights: [
      "你在关系中的问题，往往反映的是你与自己的关系",
      "真正的亲密需要两个人都愿意真实",
      "健康的关系让双方都更接近真实的自己",
    ],
    question: "在你最重要的关系中，你是否在做真实的自己？",
  },
  daily: {
    layerTitle: "个人路径",
    title: "日常",
    subtitle: "在日常中真正地『在』",
    description: [
      "修行不是在特殊的时刻发生的，修行就在日常的每一刻中。吃饭、走路、工作、休息——每一个平凡的时刻都是修行的机会。",
      "问题是，我们大部分时间都不在当下。身体在这里，心却在别处——想着过去，担心未来，评判现在。",
      "重新学会『在』，就是在做每一件事情的时候，真的在做那件事情。吃饭时真的在吃饭，说话时真的在说话，陪伴时真的在陪伴。",
    ],
    practices: [
      {
        id: "daily-1",
        title: "一件事原则",
        description: "吃饭时只吃饭，不看手机、不看电视",
      },
      {
        id: "daily-2",
        title: "时间停顿",
        description: "每天设定几个提醒，提醒自己：我现在在吗？",
      },
      {
        id: "daily-3",
        title: "睡前回顾",
        description: "睡前回顾：今天有哪些时刻我是真正在的？",
      },
    ],
    insights: [
      "你不需要去哪里寻找当下，当下就在这里",
      "注意力在哪里，生命就在哪里",
      "平凡的时刻充分经历，就不再平凡",
    ],
    question: "今天，有哪个时刻你是完全在场的？",
  },
  choice: {
    layerTitle: "个人路径",
    title: "选择",
    subtitle: "从证明自己到真实回应",
    description: [
      "我们每天都在做无数的选择。但很多选择并不是真正的选择——它们是被恐惧、被习惯、被他人的期待驱动的自动反应。",
      "旧的选择模式是『证明自己』：我选择这个是为了证明我足够好、足够成功、足够被认可。这种选择的背后是匮乏感。",
      "新的选择模式是『真实回应』：在这个情境中，什么是最真实的回应？什么是真正来自内心的声音？这种选择来自完整，而不是匮乏。",
    ],
    practices: [
      {
        id: "choice-1",
        title: "选择觉察",
        description: "做选择前停一下，问：这个选择是来自恐惧还是来自真实？",
      },
      {
        id: "choice-2",
        title: "身体智慧",
        description: "感受身体对不同选择的反应，紧缩还是开放？",
      },
      {
        id: "choice-3",
        title: "长期视角",
        description: "这个选择会让我更接近还是更远离真实的自己？",
      },
    ],
    insights: [
      "最好的选择往往不是最舒服的选择",
      "真正的选择需要你愿意承担后果",
      "你总是有选择，即使看起来没有",
    ],
    question: "最近有什么选择是你一直在逃避的？",
  },
};

/** 获取默认内容 */
function getDefaultContent(dimensionId: string) {
  return {
    layerTitle: "个人路径",
    title: "维度",
    subtitle: "正在筹备中",
    description: ["本维度内容正在精心筹备中，敬请期待。"],
    practices: [],
    insights: ["内容即将更新"],
    question: "保持觉察，期待更新。",
  };
}

interface DimensionDetailProps {
  layerId: string;
  dimensionId: string;
  onBack?: () => void;
  onStartPractice?: (
    practiceId: string,
    layerId: string,
    dimensionId: string,
  ) => void;
  onAskMirror?: () => void;
}

export function DimensionDetail({
  layerId,
  dimensionId,
  onBack,
  onStartPractice,
  onAskMirror,
}: DimensionDetailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();

  const content =
    DIMENSION_CONTENT[dimensionId] || getDefaultContent(dimensionId);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [dimensionId]);

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
        transition: "opacity 0.8s ease",
      }}
    >
      <PageHeader onBack={onBack} title={`${content.layerTitle} · 践行维度`} />
      <div style={{ paddingTop: PAGE_HEADER_HEIGHT }} />

      {/* 标题区 */}
      <div
        style={{
          padding: `${rpx(20)} ${rpx(40)} ${rpx(40)}`,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(56),
            fontWeight: 600,
            color: "#18181A",
            letterSpacing: rpx(8),
            margin: 0,
          }}
        >
          {content.title}
        </h1>
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(24),
            color: "#888",
            letterSpacing: rpx(4),
            marginTop: rpx(16),
          }}
        >
          {content.subtitle}
        </p>
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
          {content.description.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontSize: rpx(26),
                color: "#444",
                lineHeight: 1.9,
                margin: idx === 0 ? 0 : `${rpx(24)} 0 0`,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* 践行方法 */}
        {content.practices.length > 0 && (
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
              践行方法
            </h2>
            {content.practices.map((practice) => (
              <div
                key={practice.id}
                onClick={() => {
                  if (onStartPractice)
                    onStartPractice(practice.id, layerId, dimensionId);
                  else toast.show("践行功能筹备中");
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
                    }}
                  >
                    {practice.title}
                  </h3>
                  <p
                    style={{
                      fontSize: rpx(22),
                      color: "#777",
                      margin: `${rpx(8)} 0 0`,
                      lineHeight: 1.6,
                    }}
                  >
                    {practice.description}
                  </p>
                </div>
                <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        )}

        {/* 觉察要点 */}
        <div
          style={{
            padding: `${rpx(28)} ${rpx(24)}`,
            background: "rgba(0,0,0,0.02)",
            borderRadius: rpx(12),
            marginBottom: rpx(40),
          }}
        >
          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              fontWeight: 600,
              color: "#444",
              margin: `0 0 ${rpx(16)} 0`,
            }}
          >
            觉察要点
          </h3>
          {content.insights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: rpx(12),
                marginTop: idx === 0 ? 0 : rpx(12),
              }}
            >
              <span style={{ color: "#888", fontSize: rpx(18) }}>•</span>
              <span
                style={{ fontSize: rpx(22), color: "#555", lineHeight: 1.6 }}
              >
                {insight}
              </span>
            </div>
          ))}
        </div>

        {/* 反思提问 */}
        <div
          style={{
            padding: `${rpx(24)} ${rpx(24)}`,
            borderLeft: "3px solid rgba(0,0,0,0.1)",
            background: "rgba(0,0,0,0.01)",
            marginBottom: rpx(40),
          }}
        >
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              color: "#666",
              fontStyle: "italic",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            💭 {content.question}
          </p>
        </div>

        {/* 问明镜 */}
        <div
          onClick={() => {
            if (onAskMirror) onAskMirror();
            else toast.show("明镜正在筹备中");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(16),
            padding: `${rpx(24)} ${rpx(20)}`,
            background: "rgba(0,0,0,0.02)",
            borderRadius: rpx(12),
            cursor: "pointer",
          }}
        >
          <MessageCircle size={22} color="#666" strokeWidth={1.5} />
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(24),
                fontWeight: 500,
                color: "#333",
              }}
            >
              遇到困惑？问明镜
            </span>
            <p
              style={{
                fontSize: rpx(18),
                color: "#999",
                margin: `${rpx(4)} 0 0`,
              }}
            >
              明镜帮助照见，而不是给标准答案
            </p>
          </div>
          <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
        </div>
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
