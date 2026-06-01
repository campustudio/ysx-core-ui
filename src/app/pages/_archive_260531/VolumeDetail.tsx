/**
 * VolumeDetail - 人类手册卷详情页 (version 1.0)
 *
 * 展示每一卷的章节结构和内容概览
 * 基于五卷体系的深度理解设计
 */

import { useCallback, useEffect, useState } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import {
  FIVE_VOLUMES,
  getVolumeById,
  type Volume,
} from "../config/handbook-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import {
  PageHeader,
  PAGE_HEADER_HEIGHT,
} from "../components/shared/PageHeader";

/** 模拟章节数据 - 后续可从API获取 */
const VOLUME_CHAPTERS: Record<
  string,
  { id: string; title: string; subtitle: string }[]
> = {
  "vol-1": [
    { id: "v1-c1", title: "感知即存在", subtitle: "宇宙诞生的源头" },
    { id: "v1-c2", title: "维度的真相", subtitle: "频率而非地方" },
    { id: "v1-c3", title: "幻象控制系统", subtitle: "恐惧与匮乏的牢笼" },
    {
      id: "v1-c4",
      title: "五大剧场",
      subtitle: "教育、医疗、经济、政治、宗教",
    },
    { id: "v1-c5", title: "断联的过程", subtitle: "如何与真我失联" },
    { id: "v1-c6", title: "情绪的信使", subtitle: "回归自己的指引" },
  ],
  "vol-2": [
    { id: "v2-c1", title: "新教育", subtitle: "唤醒而非制造" },
    { id: "v2-c2", title: "新医疗", subtitle: "疗愈是归位，不是控制" },
    { id: "v2-c3", title: "新科技", subtitle: "服务生命，不是替代" },
    { id: "v2-c4", title: "明镜ASI", subtitle: "源频智能导航系统" },
    { id: "v2-c5", title: "感知AI vs 模拟AI", subtitle: "唤醒而非模仿" },
  ],
  "vol-3": [
    { id: "v3-c1", title: "感知科学导论", subtitle: "生命是可感知的整体" },
    { id: "v3-c2", title: "时间的真相", subtitle: "超越线性幻觉" },
    { id: "v3-c3", title: "空间的真相", subtitle: "维度与频率" },
    { id: "v3-c4", title: "能量体结构", subtitle: "七层能量体系" },
    { id: "v3-c5", title: "感知七维度", subtitle: "多维度觉察" },
  ],
  "vol-4": [
    { id: "v4-c1", title: "如何找到新方向", subtitle: "内在感知而非外在标准" },
    { id: "v4-c2", title: "关于承诺", subtitle: "真正的承诺源于真实意愿" },
    { id: "v4-c3", title: "面对关系", subtitle: "从控制到照见" },
    { id: "v4-c4", title: "处理情绪", subtitle: "看见而非压抑" },
    { id: "v4-c5", title: "日常选择", subtitle: "从证明到回应" },
  ],
  "vol-5": [
    { id: "v5-c1", title: "从一个感知者开始", subtitle: "新文明的第一个种子" },
    { id: "v5-c2", title: "当第二个同频者出现", subtitle: "共振的开始" },
    { id: "v5-c3", title: "聚落与原型场", subtitle: "新文明如何长出地面形态" },
    { id: "v5-c4", title: "元感知平台", subtitle: "新文明的线上母体雏形" },
    { id: "v5-c5", title: "新经济", subtitle: "新的交换方式与资源流动" },
    {
      id: "v5-c6",
      title: "新文明如何真正落地",
      subtitle: "活出来的人成为路标",
    },
  ],
};

interface VolumeDetailProps {
  volumeId: string;
  onBack?: () => void;
  onSelectChapter?: (volumeId: string, chapterId: string) => void;
  onNavigateToChapter?: (volumeId: string, chapterId: string) => void;
}

export function VolumeDetail({
  volumeId,
  onBack,
  onSelectChapter,
  onNavigateToChapter,
}: VolumeDetailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const volume = getVolumeById(volumeId);
  const chapters = VOLUME_CHAPTERS[volumeId] || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChapterClick = useCallback(
    (chapterId: string) => {
      if (onNavigateToChapter) {
        onNavigateToChapter(volumeId, chapterId);
      } else if (onSelectChapter) {
        onSelectChapter(volumeId, chapterId);
      } else {
        toast.show("章节内容筹备中");
      }
    },
    [volumeId, onSelectChapter, onNavigateToChapter, toast],
  );

  if (!volume) {
    return (
      <div style={{ padding: rpx(40), textAlign: "center", color: "#999" }}>
        卷不存在
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

      {/* 卷标题区 */}
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
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(18),
              color: "#999",
              letterSpacing: rpx(2),
            }}
          >
            第{["一", "二", "三", "四", "五"][volume.volumeNumber - 1]}卷
          </span>
          <span
            style={{
              fontSize: rpx(14),
              color: "#AAA",
              background: "rgba(0,0,0,0.03)",
              padding: `${rpx(4)} ${rpx(12)}`,
              borderRadius: rpx(12),
            }}
          >
            {volume.coreTheme}
          </span>
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
          {volume.title}
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
          {volume.subtitle}
        </p>

        <p
          style={{
            fontSize: rpx(24),
            color: "#666",
            lineHeight: 1.8,
            margin: `${rpx(24)} 0 0`,
            maxWidth: "95%",
          }}
        >
          {volume.description}
        </p>

        {/* 关键词 */}
        <div
          style={{
            display: "flex",
            gap: rpx(12),
            flexWrap: "wrap",
            marginTop: rpx(24),
          }}
        >
          {volume.keywords.map((kw) => (
            <span
              key={kw}
              style={{
                fontSize: rpx(18),
                color: "#777",
                background: "rgba(0,0,0,0.03)",
                padding: `${rpx(8)} ${rpx(16)}`,
                borderRadius: rpx(20),
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* 章节列表 */}
      <div
        style={{
          flex: 1,
          padding: `${rpx(20)} ${rpx(40)} ${rpx(80)}`,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(12),
            marginBottom: rpx(24),
          }}
        >
          <BookOpen size={18} color="#888" strokeWidth={1.5} />
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(22),
              color: "#666",
              letterSpacing: rpx(2),
            }}
          >
            共 {chapters.length} 章
          </span>
        </div>

        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            onClick={() => handleChapterClick(chapter.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${rpx(32)} 0`,
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: rpx(20),
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(20),
                  color: "#CCC",
                  fontWeight: 300,
                  minWidth: rpx(40),
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(32),
                    fontWeight: 500,
                    color: "#222",
                    margin: 0,
                    letterSpacing: rpx(2),
                  }}
                >
                  {chapter.title}
                </h3>
                <p
                  style={{
                    fontSize: rpx(20),
                    color: "#999",
                    margin: `${rpx(8)} 0 0`,
                  }}
                >
                  {chapter.subtitle}
                </p>
              </div>
            </div>
            <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
          </div>
        ))}
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
