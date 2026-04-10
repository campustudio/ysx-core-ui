/**
 * NewLifePath - 新人生之路 · 活的道路 (version 2.2 - 极致极简版)
 *
 * 核心定位：
 * - 活的道路，文明级路径的雏形
 * - 聚集、践行、共振
 * - 纯净冷白底色（#F2F2F5），极简文字排版，无图片
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { Search, Play, ChevronRight, Users, MessageCircle, Navigation, Layers } from "lucide-react";
import {
  NEWLIFE_TABS,
  COURSES,
  getCoursesByCategory,
  CIRCLE_INFO,
  type Course,
} from "../config/newlife-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

interface NewLifePathProps {
  onNavChange?: (index: number) => void;
  onNavigateToCircle?: () => void;
}

export function NewLifePath({ onNavChange, onNavigateToCircle }: NewLifePathProps) {
  const [activeTab, setActiveTab] = useState("recommend");
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setCourses(getCoursesByCategory(tabId));
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
    [onNavChange, toast]
  );

  const { lastStudied, groupedCourses } = useMemo(() => {
    const last = courses.find((c) => c.status === "in-progress" && c.lastStudied);
    const grouped = courses.reduce((acc, c) => {
      const g = c.group || "其他";
      if (!acc[g]) acc[g] = [];
      acc[g].push(c);
      return acc;
    }, {} as Record<string, Course[]>);
    return { lastStudied: last, groupedCourses: grouped };
  }, [courses]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F2F2F5", // 与首页一致的冷灰白
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    >
      {/* 极简顶部标题 */}
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
            新人生
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
            活的道路
          </p>
        </div>

        <div style={{ display: "flex", gap: rpx(16) }}>
          <button
            onClick={() => toast.show("搜索功能筹备中")}
            style={{
              background: "transparent",
              border: "none",
              padding: rpx(16),
              cursor: "pointer",
            }}
          >
            <Search size={22} strokeWidth={1.5} color="#555" />
          </button>
        </div>
      </div>

      {/* 圈子入口 - 极简文字版 */}
      <div style={{ padding: `0 ${rpx(40)} ${rpx(40)}` }}>
        <div
          onClick={() => {
            if (onNavigateToCircle) onNavigateToCircle();
            else toast.show("圈子社区加载中");
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${rpx(32)} 0`,
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: rpx(16) }}>
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(36),
                fontWeight: 600,
                color: "#111",
                letterSpacing: rpx(4),
              }}
            >
              感知圈子
            </span>
            <span
              style={{
                fontSize: rpx(20),
                color: "#999",
                background: "rgba(0,0,0,0.03)",
                padding: `${rpx(4)} ${rpx(12)}`,
                borderRadius: rpx(20),
              }}
            >
              {CIRCLE_INFO.memberCount.toLocaleString()} 觉醒者
            </span>
          </div>
          <ChevronRight size={20} color="#999" strokeWidth={1.5} />
        </div>
      </div>

      {/* 分类导航 - 纯文字极简版 */}
      <div
        style={{
          display: "flex",
          gap: rpx(40),
          padding: `0 ${rpx(40)} ${rpx(20)}`,
          overflowX: "auto",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {NEWLIFE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                padding: `${rpx(10)} 0`,
                position: "relative",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: FONT_SERIF,
                fontSize: rpx(28),
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#111" : "#A1A1A1",
                letterSpacing: rpx(4),
                transition: "color 0.3s ease",
              }}
            >
              {tab.name}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: rpx(-20),
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: "#111",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 课程内容列表 */}
      <div
        style={{
          flex: 1,
          padding: `${rpx(40)} ${rpx(40)} ${rpx(160)}`,
          overflowY: "auto",
        }}
      >
        {/* 上次学习 - 极简排版 */}
        {lastStudied && (
          <div style={{ marginBottom: rpx(60) }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: `${rpx(40)} 0`,
                borderBottom: "2px solid #111", // 加粗底线区分“继续”
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: rpx(16) }}>
                <span
                  style={{
                    fontSize: rpx(20),
                    color: "#111",
                    letterSpacing: rpx(2),
                    fontWeight: 600,
                  }}
                >
                  继续前行
                </span>
                <span style={{ fontSize: rpx(20), color: "#888" }}>
                  {lastStudied.lastStudied}
                </span>
              </div>

              <p style={{ fontFamily: FONT_SERIF, fontSize: rpx(48), color: "#111", margin: 0, letterSpacing: rpx(4), fontWeight: 600 }}>
                {lastStudied.title}
              </p>
              
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: rpx(24) }}>
                <div
                  style={{
                    width: rpx(64),
                    height: rpx(64),
                    borderRadius: "50%",
                    border: "1px solid #111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Play size={20} fill="#111" color="#111" style={{ marginLeft: 2 }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 课程列表分组 - 纯文字块 */}
        {Object.entries(groupedCourses).map(([group, items]) => (
          <div key={group} style={{ marginBottom: rpx(60) }}>
            <h3
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(32),
                color: "#111",
                margin: `0 0 ${rpx(32)} 0`,
                letterSpacing: rpx(6),
                fontWeight: 600,
              }}
            >
              {group}
            </h3>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {items.map((course, idx) => (
                <div
                  key={course.id}
                  onClick={() => toast.show("详情筹备中")}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    padding: `${rpx(32)} 0`,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: rpx(24) }}>
                    <span
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: rpx(24),
                        color: "#CCC",
                        fontWeight: 300,
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: rpx(32),
                        color: "#222",
                        margin: 0,
                        letterSpacing: rpx(2),
                        fontWeight: 400,
                      }}
                    >
                      {course.title}
                    </p>
                  </div>

                  <span
                    style={{
                      fontSize: rpx(20),
                      color: course.status === "completed" ? "#111" : course.status === "in-progress" ? "#666" : "#A1A1A1",
                      letterSpacing: rpx(2),
                    }}
                  >
                    {course.status === "completed" ? "已走过" : course.status === "in-progress" ? "跋涉中" : "未涉足"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {courses.length === 0 && (
          <div
            style={{
              padding: `${rpx(160)} 0`,
              textAlign: "center",
              color: "#A1A1A1",
              fontSize: rpx(24),
              letterSpacing: rpx(4),
              fontFamily: FONT_SERIF,
            }}
          >
            前方道路尚未显现
          </div>
        )}
      </div>

      <BottomNavigation active={2} onChange={handleNavChange} />

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}