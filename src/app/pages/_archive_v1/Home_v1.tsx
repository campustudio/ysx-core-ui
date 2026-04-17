/**
 * [归档] 首页 v1 - 元感知
 *
 * 归档日期：2026-03-25
 * 归档原因：v2.0 UI 重构 - 从「疗愈空间」转向「归位之镜/文明入口」
 *
 * 原文件路径：/src/app/pages/Home.tsx
 * 对应文档：/src/imports/version-2.0.md
 *
 * 此文件保留完整代码供参考，不再被 App.tsx 引用。
 */

/**
 * 「固定首屏 + 内容上滑覆盖」架构：
 *   Hero 区 position:fixed 固定不动
 *   内容页从底部自然上滑覆盖 Hero
 *   Header 在内容页接近顶部时过渡为吸顶样式
 *
 * 滚动行为（用户手指向上滑动）：
 *   1. Hero 不动，内容页从屏幕底部上滑
 *   2. 内容页圆角透出 Hero 背景图，呈现「卡片浮在风景上」
 *   3. 内容页顶部接近 Header 区域时，Header 过渡为绢轴色吸顶
 *   4. 继续滑动浏览内容
 *   5. 向下滑动回退时，内容页下移，Header 恢复透明 Hero 样式
 *
 * 页面仅负责组装组件 + 管理滚动状态
 * 所有数据来自 config 层，所有 UI 来自组件层
 *
 * 导航映射：
 *   今日之光语录        → 文章阅读页（wisdom-today）
 *   精选推荐卡片        → 沉浸呼吸页
 *   今日频率指南/明镜之声 → 文章阅读页
 *   放松入门            → 音频播放页
 *   同行者的声音        → 播客详情页
 *   正在发生的光点      → 活动详情页
 *
 * 未实现入口 Toast 提示（统一温柔语气）：
 *   头像              → 「登录」功能正在用心打磨中
 *   区块标题箭头(>)    → 「{区块名}」的更多内容正在用心打磨中
 *   公告卡片           → 公告详情页正在用心打磨中
 *   底部导航(非首页)   → 「{页面名}」正在用心打磨中
 */

import { useState, useEffect, useCallback } from "react";
import { getSolarTerm, getShichen } from "../config/calendar";
import { HERO_BG } from "../config/images";
import { FEATURED, HOME_SECTIONS, ANNOUNCEMENT } from "../config/home-data";
import { hasArticle } from "../config/articles-data";
import { hasPodcast } from "../config/podcasts-data";
import { hasActivity } from "../config/activities-data";
import { BG_PARCHMENT, BG_CONTENT_GRADIENT } from "../config/styles";

// ─── Hero 组件 ───────────────────────────────────────
import { HeroBackground } from "../components/hero/HeroBackground";
import { HeroHeader } from "../components/hero/HeroHeader";
import { BreathingCircle } from "../components/hero/BreathingCircle";
import { JourneyCards } from "../components/hero/JourneyCards";
import { ScrollHint } from "../components/shared/ScrollHint";

// ─── 内容区组件 ──────────────────────────────────────
import { DailyQuoteCalendar } from "../components/content/DailyQuoteCalendar";
import { FeaturedCard } from "../components/content/FeaturedCard";
import { SectionBlock } from "../components/content/SectionBlock";
import { AnnouncementCard } from "../components/content/AnnouncementCard";

// ─── 导航组件 ────────────────────────────────────────
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { UserDrawer } from "../components/auth/UserDrawer";

/** 底部导航项标签（与 BottomNavigation 内部顺序一致） */
const NAV_LABELS = ["首页", "人类手册", "新人生之路", "明镜"];

interface HomeProps {
  /** 导航到音频播放页（传入曲目标签：徐/止/定） */
  onNavigateToPlayer?: (trackLabel: string) => void;
  /** 导航到文章阅读页（传入文章 ID） */
  onNavigateToArticle?: (articleId: string) => void;
  /** 导航到播客详情页 */
  onNavigateToPodcast?: (podcastId: string) => void;
  /** 导航到活动详情页 */
  onNavigateToActivity?: (activityId: string) => void;
  /** 导航到新人引导页 */
  onNavigateToGuide?: () => void;
  /** 导航到沉浸呼吸页 */
  onNavigateToBreathing?: () => void;
  /** 导航到登录页 */
  onNavigateToLogin?: () => void;
  /** 底部导航切换（委托给 App.tsx 统一处理） */
  onNavChange?: (index: number) => void;
  /**
   * 返回首页时需要恢复的滚动位置
   * 由 App.tsx 在离开首页前保存，返回时传入
   * 用 ref 而非 state，避免触发不必要的重渲染
   */
  restoreScrollY?: number;
  /** 是否已登录 */
  isLoggedIn?: boolean;
  /** 用户信息 */
  userInfo?: { name: string; avatar: string; days: number };
  /** 退出登录 */
  onLogout?: () => void;
}

export function Home({
  onNavigateToPlayer,
  onNavigateToArticle,
  onNavigateToPodcast,
  onNavigateToActivity,
  onNavigateToGuide,
  onNavigateToBreathing,
  onNavigateToLogin,
  onNavChange,
  restoreScrollY,
  isLoggedIn = false,
  userInfo,
  onLogout,
}: HomeProps) {
  const [activeNav, setActiveNav] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();
  const solarTerm = getSolarTerm();
  const shichen = getShichen();

  /**
   * 恢复滚动位置
   * 从详情页返回时，还原离开前的 scrollY
   * 使用双重 rAF 确保 DOM 完全渲染后再滚动
   */
  useEffect(() => {
    if (restoreScrollY != null && restoreScrollY > 0) {
      // 第一帧：React 完成 DOM 提交
      // 第二帧：浏览器完成布局与绘制
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, restoreScrollY);
        });
      });
    }
  }, []); // 仅挂载时执行一次

  /**
   * 监听滚动，切换 Header 吸顶状态
   * 阈值 ≈ 90vh 滚动量（内容页顶部在 10vh 处）
   */
  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.9;
      setIsHeaderSticky(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── 交互入口回调 ────────────────────────────────────

  /** 点击头像 → 打开用户面板 */
  const handleAvatarClick = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  /** 点击呼吸圆环（收/清）→ 沉浸呼吸页 */
  const handleBreathingClick = useCallback(() => {
    onNavigateToBreathing?.();
  }, [onNavigateToBreathing]);

  /** 点击「探索」→ 新人指引页面 */
  const handleGuideClick = useCallback(() => {
    onNavigateToGuide?.();
  }, [onNavigateToGuide]);

  /** 点击徐/止/定卡片 → 对应练习 */
  const handleJourneyCardClick = useCallback(
    (label: string) => {
      onNavigateToPlayer?.(label);
    },
    [onNavigateToPlayer],
  );

  /** 点击今日智慧语录 → 文章阅读页 */
  const handleWisdomClick = useCallback(() => {
    onNavigateToArticle?.("wisdom-today");
  }, [onNavigateToArticle]);

  /** 点击精选推荐卡片 → 沉浸呼吸页 */
  const handleFeaturedClick = useCallback(() => {
    onNavigateToBreathing?.();
  }, [onNavigateToBreathing]);

  /**
   * 点击内容区卡片 → 根据 cardId 分发到不同页面
   * 优先级：文章 > 播客 > 活动 > 播放器（兜底）
   */
  const handleContentCardClick = useCallback(
    (cardId: string) => {
      if (hasArticle(cardId)) {
        onNavigateToArticle?.(cardId);
      } else if (hasPodcast(cardId)) {
        onNavigateToPodcast?.(cardId);
      } else if (hasActivity(cardId)) {
        onNavigateToActivity?.(cardId);
      } else {
        onNavigateToPlayer?.(cardId);
      }
    },
    [
      onNavigateToArticle,
      onNavigateToPodcast,
      onNavigateToActivity,
      onNavigateToPlayer,
    ],
  );

  /** 点击区块标题"更多"箭头 */
  const handleSectionMore = useCallback(
    (sectionId: string, sectionTitle?: string) => {
      const label = sectionTitle || sectionId;
      toast.show(`「${label}」的更多内容正在用心打磨中，敬请期待`);
    },
    [toast],
  );

  /** 点击公告卡片 */
  const handleAnnouncementClick = useCallback(() => {
    toast.show("公告详情页正在用心打磨中，敬请期待");
  }, [toast]);

  /** 底部导航切换 */
  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 0) {
        // 已在首页，滚动回顶部
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (index === 1 || index === 2) {
        // 人类手册 / 新人生之路 → 委托给 App.tsx
        onNavChange?.(index);
        return;
      }
      // 其余页面正在开发中，展示温柔提示
      toast.show(`「${NAV_LABELS[index]}」正在用心打磨中，敬请期待`);
    },
    [toast, onNavChange],
  );

  return (
    <div className="relative w-full" style={{ background: BG_PARCHMENT }}>
      {/* ═══ Hero 定层：不随滚动移动 ═══ */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: "calc(var(--nav-height) + env(safe-area-inset-bottom, 0px))",
          zIndex: 0,
          overflow: "visible",
        }}
      >
        <HeroBackground src={HERO_BG} />

        <div className="relative flex flex-col h-full app-container">
          <div
            style={{
              paddingTop:
                "max(calc(var(--rpx) * 24), env(safe-area-inset-top))",
              height: `calc(max(calc(var(--rpx) * 24), env(safe-area-inset-top)) + ${72 * (100 / 750)}vw)`,
            }}
          />

          <div className="flex-1 flex items-center justify-center">
            <BreathingCircle onClick={handleBreathingClick} />
          </div>

          <div
            style={{
              paddingBottom: "var(--spacing-sm)",
              zIndex: "var(--z-base)",
            }}
          >
            <JourneyCards
              onGuideClick={handleGuideClick}
              onCardClick={handleJourneyCardClick}
            />
            <ScrollHint />
          </div>
        </div>
      </div>

      {/* ═══ Hero 占位符 ═══ */}
      <div style={{ height: "100vh" }} aria-hidden="true" />

      {/* ═══ 吸顶 Header ═══ */}
      <HeroHeader
        solarTerm={solarTerm}
        shichen={shichen}
        isSticky={isHeaderSticky}
        avatarUrl={isLoggedIn && userInfo ? userInfo.avatar : undefined}
        onAvatarClick={handleAvatarClick}
      />

      {/* ═══ 内容页：上滑覆盖 Hero ═══ */}
      <section
        className="relative"
        style={{
          background: BG_CONTENT_GRADIENT,
          paddingBottom: "calc(var(--nav-height) + var(--spacing-xl))",
          borderRadius: "calc(var(--rpx) * 28) calc(var(--rpx) * 28) 0 0",
          zIndex: 1,
        }}
      >
        <div
          className="app-container"
          style={{ padding: "var(--spacing-xl) var(--spacing-lg)" }}
        >
          <DailyQuoteCalendar onClick={handleWisdomClick} />

          <FeaturedCard
            image={FEATURED.image}
            title={FEATURED.title}
            subtitle={FEATURED.subtitle}
            onClick={handleFeaturedClick}
          />

          {HOME_SECTIONS.map((section) => (
            <SectionBlock
              key={section.id}
              title={section.title}
              subtitle={section.subtitle}
              columns={section.columns}
              aspectRatio={section.aspectRatio}
              cards={section.cards}
              onMore={() => handleSectionMore(section.id, section.title)}
              onCardClick={handleContentCardClick}
            />
          ))}

          <AnnouncementCard
            sectionTitle={ANNOUNCEMENT.sectionTitle}
            title={ANNOUNCEMENT.title}
            description={ANNOUNCEMENT.description}
            onClick={handleAnnouncementClick}
          />
        </div>
      </section>

      {/* 底部导航栏 */}
      <BottomNavigation active={activeNav} onChange={handleNavChange} />

      {/* 用户面板抽屉 */}
      <UserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onLoginClick={() => {
          setDrawerOpen(false);
          onNavigateToLogin?.();
        }}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        onLogout={onLogout}
      />

      {/* 「开发中」温柔提示 */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2200}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
