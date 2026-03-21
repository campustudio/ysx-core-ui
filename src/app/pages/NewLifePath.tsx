/**
 * NewLifePath - 新人生之路 · 主页
 *
 * 底部导航第三个 Tab
 * 融合课程学习 + 社区互动的综合页面
 *
 * 布局（上→下）：
 *   ① 顶部标题栏
 *   ② 分类 Tab（推荐 / 课程 / 练习 / 互动）
 *   ③ 内容区：
 *      推荐 — 继续学习卡片 + 全部课程列表
 *      课程 — 按子分类分组的课程列表
 *      练习 — 练习类课程列表
 *      互动 — 进入圈子社区入口
 *
 * 配色：清新现代白底，暖琥珀金强调色
 * 与首页古纸色、人类手册深空蓝形成差异化
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { Search, Play, ChevronRight, Users, MessageCircle } from "lucide-react";
import {
  NEWLIFE_TABS,
  COURSES,
  getCoursesByCategory,
  CIRCLE_INFO,
  type Course,
} from "../config/newlife-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

// ─── 主题色 ──────────────────────────────────────────

const THEME = {
  bg: "#FAFAF7",
  surface: "#FFFFFF",
  textPrimary: "#2C2417",
  textSecondary: "#7A7062",
  textTertiary: "#B0A89C",
  accent: "#C49A6C",
  accentLight: "rgba(196,154,108,0.1)",
  sage: "#8BAA7D",
  sageLight: "rgba(139,170,125,0.1)",
  border: "rgba(196,154,108,0.08)",
  heroBanner:
    "https://images.unsplash.com/photo-1627745537419-7fda207a0a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjBncmVlbiUyMG1lYWRvdyUyMHN1bmxpZ2h0JTIwZnJlc2glMjBuYXR1cmV8ZW58MXx8fHwxNzcxMDYxODM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
} as const;

interface NewLifePathProps {
  onNavChange?: (index: number) => void;
  onNavigateToCircle?: () => void;
}

const NAV_LABELS = ["首页", "人类手册", "新人生之路", "明镜"];

export function NewLifePath({ onNavChange, onNavigateToCircle }: NewLifePathProps) {
  const [activeTab, setActiveTab] = useState("recommend");
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    if (tabId === "interact") {
      // 互动 Tab → 跳转到圈子页
      onNavigateToCircle?.();
      return;
    }
    setActiveTab(tabId);
    setCourses(getCoursesByCategory(tabId));
  }, [onNavigateToCircle]);

  const handleSearch = useCallback(() => {
    toast.show("搜索功能正在用心打磨中，敬请期待");
  }, [toast]);

  const handleCourseClick = useCallback(
    (_courseId: string) => {
      toast.show("课程详情正在用心打磨中，敬请期待");
    },
    [toast]
  );

  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 2) return; // 当前页
      if (index === 0 || index === 1) {
        onNavChange?.(index);
        return;
      }
      toast.show(`「${NAV_LABELS[index]}」正在用心打磨中，敬请期待`);
    },
    [onNavChange, toast]
  );

  // 继续学习的课程
  const lastStudied = useMemo(
    () => COURSES.find((c) => c.status === "in-progress"),
    []
  );

  // 按子分类分组
  const groupedCourses = useMemo(() => {
    const groups: Record<string, Course[]> = {};
    courses.forEach((c) => {
      const key = c.subCategory || "其他";
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }, [courses]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: THEME.bg,
      }}
    >
      {/* ═══ Banner 区 ═══ */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          height: rpx(360),
        }}
      >
        <ImageWithFallback
          src={THEME.heroBanner}
          alt="新人生之路"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* 底部渐变融合 */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(30,20,10,0.15) 0%, 
              transparent 40%,
              ${THEME.bg}CC 80%, 
              ${THEME.bg} 100%)`,
          }}
        />
        {/* 顶部安全区 + 标题 */}
        <div
          className="absolute left-0 right-0 flex items-center justify-between"
          style={{
            top: 0,
            paddingTop: `max(${rpx(24)}, env(safe-area-inset-top))`,
            padding: `max(${rpx(24)}, env(safe-area-inset-top)) ${rpx(36)} 0`,
          }}
        >
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "var(--font-size-2xl)",
              color: "#fff",
              margin: 0,
              letterSpacing: rpx(2),
              textShadow:
                "0 1px 3px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            新人生之路
          </h1>
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(64),
              height: rpx(64),
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              border: "none",
            }}
            onClick={handleSearch}
          >
            <Search size={18} strokeWidth={1.5} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>

      {/* ═══ Tab 栏 ═══ */}
      <div
        style={{
          padding: `${rpx(4)} ${rpx(36)} ${rpx(16)}`,
          background: THEME.bg,
        }}
      >
        <div className="flex" style={{ gap: rpx(32) }}>
          {NEWLIFE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className="cursor-pointer relative"
                style={{
                  padding: `${rpx(12)} 0`,
                  border: "none",
                  background: "none",
                  fontSize: "var(--font-size-sm)",
                  color: isActive ? THEME.accent : THEME.textSecondary,
                  fontFamily: isActive ? FONT_SERIF : undefined,
                  transition: "color 0.2s ease",
                }}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
                {isActive && (
                  <div
                    className="absolute"
                    style={{
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: rpx(32),
                      height: rpx(4),
                      borderRadius: rpx(2),
                      background: THEME.accent,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 内容区 ═══ */}
      <div
        style={{
          padding: `0 ${rpx(36)}`,
          paddingBottom: "calc(var(--nav-height) + var(--spacing-xl))",
        }}
      >
        {/* ── 继续学习卡片（推荐 Tab） ── */}
        {activeTab === "recommend" && lastStudied && (
          <div
            className="cursor-pointer overflow-hidden relative"
            style={{
              borderRadius: rpx(16),
              marginBottom: rpx(28),
              boxShadow:
                "0 4px 20px rgba(30,20,10,0.08), 0 1px 4px rgba(30,20,10,0.04)",
            }}
            onClick={() => handleCourseClick(lastStudied.id)}
          >
            <div
              style={{
                width: "100%",
                height: rpx(280),
                position: "relative",
              }}
            >
              <ImageWithFallback
                src={lastStudied.cover}
                alt={lastStudied.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
                }}
              />
              {/* 上次学到标签 */}
              <div
                className="absolute"
                style={{
                  top: rpx(16),
                  left: rpx(16),
                  padding: `${rpx(6)} ${rpx(16)}`,
                  borderRadius: rpx(16),
                  background: THEME.accent,
                  fontSize: rpx(20),
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: rpx(6),
                }}
              >
                <Play size={10} strokeWidth={2.5} fill="#fff" />
                上次学到
              </div>
              {/* 底部信息 */}
              <div
                className="absolute"
                style={{
                  bottom: rpx(16),
                  left: rpx(16),
                  right: rpx(16),
                }}
              >
                <p
                  style={{
                    fontSize: rpx(20),
                    color: "rgba(255,255,255,0.7)",
                    margin: 0,
                  }}
                >
                  {lastStudied.type === "video" ? "视频" : "音频"} ·{" "}
                  {lastStudied.title}
                </p>
                <div
                  className="flex items-center justify-between"
                  style={{ marginTop: rpx(8) }}
                >
                  <span
                    style={{
                      fontSize: rpx(22),
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {lastStudied.lastStudied || ""}
                  </span>
                  <div
                    style={{
                      padding: `${rpx(6)} ${rpx(20)}`,
                      borderRadius: rpx(20),
                      background: THEME.accent,
                      fontSize: rpx(22),
                      color: "#fff",
                    }}
                  >
                    继续学习
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 圈子入口（推荐 Tab） ── */}
        {activeTab === "recommend" && (
          <div
            className="cursor-pointer flex items-center"
            style={{
              padding: rpx(20),
              borderRadius: rpx(16),
              background: THEME.surface,
              boxShadow:
                "0 2px 12px rgba(30,20,10,0.04), 0 1px 3px rgba(30,20,10,0.02)",
              gap: rpx(16),
              marginBottom: rpx(28),
            }}
            onClick={() => onNavigateToCircle?.()}
          >
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{
                width: rpx(80),
                height: rpx(80),
                borderRadius: rpx(12),
              }}
            >
              <ImageWithFallback
                src={CIRCLE_INFO.cover}
                alt={CIRCLE_INFO.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="flex-1" style={{ minWidth: 0 }}>
              <p
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "var(--font-size-sm)",
                  color: THEME.textPrimary,
                  margin: 0,
                }}
              >
                {CIRCLE_INFO.name}
              </p>
              <div
                className="flex items-center"
                style={{
                  gap: rpx(12),
                  marginTop: rpx(6),
                }}
              >
                <span
                  className="flex items-center"
                  style={{
                    gap: rpx(4),
                    fontSize: rpx(20),
                    color: THEME.textTertiary,
                  }}
                >
                  <MessageCircle size={11} strokeWidth={1.5} />
                  {CIRCLE_INFO.postCount} 动态
                </span>
                <span
                  className="flex items-center"
                  style={{
                    gap: rpx(4),
                    fontSize: rpx(20),
                    color: THEME.textTertiary,
                  }}
                >
                  <Users size={11} strokeWidth={1.5} />
                  {CIRCLE_INFO.memberCount} 成员
                </span>
              </div>
            </div>
            <ChevronRight
              size={16}
              strokeWidth={1.5}
              style={{ color: THEME.textTertiary, flexShrink: 0 }}
            />
          </div>
        )}

        {/* ── 课程列表 ── */}
        {Object.entries(groupedCourses).map(([group, items]) => (
          <div key={group} style={{ marginBottom: rpx(28) }}>
            {/* 子分类标题 */}
            <div
              className="flex items-baseline"
              style={{
                gap: rpx(12),
                marginBottom: rpx(16),
              }}
            >
              <h3
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: "var(--font-size-sm)",
                  color: THEME.textPrimary,
                  margin: 0,
                }}
              >
                {group}
              </h3>
            </div>

            {/* 课程卡片 */}
            {items.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 底部导航 */}
      <BottomNavigation active={2} onChange={handleNavChange} />

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={toast.duration}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}

// ─── 课程卡片子组件 ──────────────────────────────────

function CourseCard({
  course,
  onClick,
}: {
  course: Course;
  onClick: () => void;
}) {
  const statusInfo = {
    "not-started": { label: "未学习", color: THEME.textTertiary, bg: "rgba(176,168,156,0.08)" },
    "in-progress": { label: "学习中", color: THEME.accent, bg: THEME.accentLight },
    completed: { label: "已完成", color: THEME.sage, bg: THEME.sageLight },
  };
  const s = statusInfo[course.status];

  return (
    <div
      className="cursor-pointer flex"
      style={{
        gap: rpx(20),
        padding: `${rpx(16)} 0`,
        borderBottom: `1px solid ${THEME.border}`,
      }}
      onClick={onClick}
    >
      {/* 封面 */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{
          width: rpx(140),
          height: rpx(100),
          borderRadius: rpx(10),
          boxShadow: "0 2px 8px rgba(30,20,10,0.06)",
        }}
      >
        <ImageWithFallback
          src={course.cover}
          alt={course.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 信息 */}
      <div
        className="flex-1 flex flex-col justify-between"
        style={{ minWidth: 0 }}
      >
        <div>
          <p
            style={{
              fontSize: "var(--font-size-sm)",
              color: THEME.textPrimary,
              margin: 0,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course.title}
          </p>
          <p
            style={{
              fontSize: rpx(20),
              color: THEME.textTertiary,
              margin: `${rpx(4)} 0 0`,
            }}
          >
            {course.taskCount}个任务
            {course.lastStudied && ` · ${course.lastStudied}`}
          </p>
        </div>

        {/* 状态标签 */}
        <div
          style={{
            alignSelf: "flex-start",
            padding: `${rpx(4)} ${rpx(14)}`,
            borderRadius: rpx(12),
            background: s.bg,
            fontSize: rpx(20),
            color: s.color,
            marginTop: rpx(6),
          }}
        >
          {s.label}
        </div>
      </div>
    </div>
  );
}