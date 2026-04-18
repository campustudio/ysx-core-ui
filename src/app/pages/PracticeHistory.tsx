/**
 * PracticeHistory - 践行足迹 (version 2.0)
 *
 * 基于第五卷设计原则：
 * - 不是任务打卡记录，而是"状态见证"
 * - 不强调数量和连续性，而是真实的在场时刻
 * - 每一条都是生命的一个片段，值得被温柔对待
 */

import { useEffect, useState } from "react";
import { Feather } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import {
  PageHeader,
  PAGE_HEADER_HEIGHT,
} from "../components/shared/PageHeader";

/** 从 localStorage 读取践行记录 */
interface PracticeRecord {
  id: string;
  practiceId: string;
  title: string;
  timestamp: string;
  type: string;
  note?: string;
}

function loadPracticeRecords(): PracticeRecord[] {
  try {
    return JSON.parse(localStorage.getItem("practice_records") || "[]");
  } catch {
    return [];
  }
}

interface PracticeHistoryProps {
  onBack?: () => void;
}

export function PracticeHistory({ onBack }: PracticeHistoryProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [records, setRecords] = useState<PracticeRecord[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setRecords(loadPracticeRecords());
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FAFAFA",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <PageHeader onBack={onBack} />

      {/* 主标题 */}
      <div style={{ paddingTop: PAGE_HEADER_HEIGHT }} />
      <div
        style={{
          padding: `${rpx(20)} ${rpx(48)} ${rpx(40)}`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(40),
            fontWeight: 600,
            color: "#18181A",
            letterSpacing: rpx(4),
            margin: 0,
          }}
        >
          践行足迹
        </h1>
        <p
          style={{
            fontSize: rpx(22),
            color: "#888",
            marginTop: rpx(16),
            lineHeight: 1.8,
          }}
        >
          每一个在场的时刻，
          <br />
          都是生命的见证。
        </p>
      </div>

      {/* 时刻列表 */}
      <div style={{ padding: `0 ${rpx(40)} ${rpx(100)}` }}>
        {records.map((record, index) => {
          const date = new Date(record.timestamp);
          return (
            <div
              key={record.id}
              style={{
                position: "relative",
                paddingLeft: rpx(32),
                paddingBottom: rpx(32),
                borderLeft:
                  index < records.length - 1
                    ? `1px solid rgba(0,0,0,0.08)`
                    : "none",
                marginLeft: rpx(8),
              }}
            >
              {/* 时间线圆点 */}
              <div
                style={{
                  position: "absolute",
                  left: rpx(-5),
                  top: rpx(4),
                  width: rpx(10),
                  height: rpx(10),
                  borderRadius: "50%",
                  background: record.note ? "#5B8B7A" : "#DDD",
                }}
              />

              {/* 日期时间 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: rpx(12),
                  marginBottom: rpx(12),
                }}
              >
                <span style={{ fontSize: rpx(20), color: "#999" }}>
                  {formatDate(date.toISOString().split("T")[0])}
                </span>
                <span style={{ fontSize: rpx(18), color: "#BBB" }}>
                  {date.toTimeString().slice(0, 5)}
                </span>
              </div>

              {/* 内容 */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: rpx(16),
                  padding: rpx(24),
                }}
              >
                <p
                  style={{
                    fontSize: rpx(20),
                    color: "#666",
                    margin: 0,
                    marginBottom: record.note ? rpx(12) : 0,
                  }}
                >
                  {record.title}
                </p>
                {record.note && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: rpx(12),
                    }}
                  >
                    <Feather
                      size={16}
                      color="#5B8B7A"
                      strokeWidth={1.5}
                      style={{ marginTop: rpx(4), flexShrink: 0 }}
                    />
                    <p
                      style={{
                        fontSize: rpx(24),
                        color: "#444",
                        lineHeight: 1.8,
                        margin: 0,
                      }}
                    >
                      {record.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {records.length === 0 && (
          <div style={{ textAlign: "center", padding: `${rpx(80)} 0` }}>
            <p
              style={{
                fontSize: rpx(24),
                color: "#999",
                lineHeight: 1.8,
              }}
            >
              还没有记录
            </p>
            <p
              style={{
                fontSize: rpx(20),
                color: "#CCC",
                marginTop: rpx(12),
              }}
            >
              当你开始觉察，
              <br />
              就会有值得记录的时刻。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
