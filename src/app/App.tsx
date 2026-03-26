/**
 * 应用入口 - 元思想
 *
 * 简单状态路由：管理页面切换
 */
import { useState, useCallback, useRef } from "react";
import { Home } from "./pages/Home";
import { Handbook } from "./pages/Handbook";
import { BookDetail } from "./pages/BookDetail";
import { ChapterPlayer } from "./pages/ChapterPlayer";
import { NewLifePath } from "./pages/NewLifePath";
import { CirclePage } from "./pages/CirclePage";
import { AudioPlayer } from "./pages/AudioPlayer";
import { ArticleReader } from "./pages/ArticleReader";
import { PodcastDetail } from "./pages/PodcastDetail";
import { ActivityDetail } from "./pages/ActivityDetail";
import { OnboardingGuide } from "./pages/OnboardingGuide";
import { OnboardingSolar } from "./pages/OnboardingSolar";
import { BreathingSession } from "./pages/BreathingSession";
import { LoginPage } from "./pages/LoginPage";
import { PageTransition } from "./components/shared/PageTransition";
import { Toast } from "./components/shared/Toast";
import { useToast } from "./hooks/useToast";
import { useUserStore } from "./hooks/useUserStore";
import { useWxAuth } from "./hooks/useWxAuth";

/** 页面路由状态 */
type PageRoute =
  | { page: "home" }
  | { page: "handbook" }
  | { page: "book-detail"; bookId: string }
  | { page: "chapter-player"; bookId: string; chapterId: string }
  | { page: "newlife" }
  | { page: "circle" }
  | { page: "player"; trackLabel: string }
  | { page: "article"; articleId: string }
  | { page: "podcast"; podcastId: string }
  | { page: "activity"; activityId: string }
  | { page: "guide" }
  | { page: "solar" }
  | { page: "breathing" }
  | { page: "login" };

/** 导航方向：用于决定转场动画 */
type NavDirection = "forward" | "back";

export default function App() {
  const toast = useToast();
  const [route, setRoute] = useState<PageRoute>({ page: "home" });
  /** 导航方向，驱动 PageTransition 选择动画 */
  const [navDirection, setNavDirection] = useState<NavDirection>("forward");
  /** 用户状态管理 */
  const { isLoggedIn, userInfo, loading, setUser, logout } = useUserStore();
  const { login: wxLogin } = useWxAuth();

  /**
   * 路由切换计数器，作为 PageTransition 的 key
   * 每次路由变化 key 递增 → 强制重新挂载 → 重新播放入场动画
   */
  const routeKeyRef = useRef(0);

  /**
   * 首页滚动位置记忆
   * 离开首页前保存 scrollY，返回时恢复
   * 用 ref 而非 state，避免触发不必要的重渲染
   */
  const homeScrollYRef = useRef(0);

  /** 离开首页前保存当前滚动位置 */
  const saveHomeScroll = useCallback(() => {
    homeScrollYRef.current = window.scrollY;
  }, []);

  /** 前进导航（首页 → 详情页） */
  const navigateForward = useCallback(
    (newRoute: PageRoute) => {
      saveHomeScroll();
      routeKeyRef.current += 1;
      setNavDirection("forward");
      setRoute(newRoute);
    },
    [saveHomeScroll],
  );

  /** 从首页进入播放页 */
  const navigateToPlayer = useCallback(
    (trackLabel: string) => {
      navigateForward({ page: "player", trackLabel });
    },
    [navigateForward],
  );

  /** 从首页进入文章阅读页 */
  const navigateToArticle = useCallback(
    (articleId: string) => {
      navigateForward({ page: "article", articleId });
    },
    [navigateForward],
  );

  /** 从首页进入播客详情页 */
  const navigateToPodcast = useCallback(
    (podcastId: string) => {
      navigateForward({ page: "podcast", podcastId });
    },
    [navigateForward],
  );

  /** 从首页进入活动详情页 */
  const navigateToActivity = useCallback(
    (activityId: string) => {
      navigateForward({ page: "activity", activityId });
    },
    [navigateForward],
  );

  /** 进入新人引导页 */
  const navigateToGuide = useCallback(() => {
    navigateForward({ page: "guide" });
  }, [navigateForward]);

  /** 进入太阳系版引导页 */
  const navigateToSolar = useCallback(() => {
    navigateForward({ page: "solar" });
  }, [navigateForward]);

  /** 进入沉浸呼吸页 */
  const navigateToBreathing = useCallback(() => {
    navigateForward({ page: "breathing" });
  }, [navigateForward]);

  /** 进入登录页 */
  const navigateToLogin = useCallback(() => {
    navigateForward({ page: "login" });
  }, [navigateForward]);

  /** 进入人类手册 */
  const navigateToHandbook = useCallback(() => {
    routeKeyRef.current += 1;
    setNavDirection("back"); // Tab 切换用淡入
    setRoute({ page: "handbook" });
  }, []);

  /** 进入新人生之路 */
  const navigateToNewLife = useCallback(() => {
    routeKeyRef.current += 1;
    setNavDirection("back");
    setRoute({ page: "newlife" });
  }, []);

  /** 进入圈子社区 */
  const navigateToCircle = useCallback(() => {
    routeKeyRef.current += 1;
    setNavDirection("forward");
    setRoute({ page: "circle" });
  }, []);

  /** 从圈子返回新人生之路 */
  const navigateBackToNewLife = useCallback(() => {
    routeKeyRef.current += 1;
    setNavDirection("back");
    setRoute({ page: "newlife" });
  }, []);

  /** 从手册进入书籍详情 */
  const navigateToBookDetail = useCallback(
    (bookId: string) => {
      navigateForward({ page: "book-detail", bookId });
    },
    [navigateForward],
  );

  /** 从书籍详情进入章节播放器 */
  const navigateToChapterPlayer = useCallback(
    (bookId: string, chapterId: string) => {
      navigateForward({ page: "chapter-player", bookId, chapterId });
    },
    [navigateForward],
  );

  /** 返回手册主页（从书籍详情/播放器） */
  const navigateBackToHandbook = useCallback(() => {
    routeKeyRef.current += 1;
    setNavDirection("back");
    setRoute({ page: "handbook" });
  }, []);

  /** 返回书籍详情（从播放器） */
  const navigateBackToBookDetail = useCallback((bookId: string) => {
    routeKeyRef.current += 1;
    setNavDirection("back");
    setRoute({ page: "book-detail", bookId });
  }, []);

  /** 底部导航统一处理（从任意页面切换 Tab） */
  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 0) {
        routeKeyRef.current += 1;
        setNavDirection("back");
        setRoute({ page: "home" });
      } else if (index === 1) {
        navigateToHandbook();
      } else if (index === 2) {
        navigateToNewLife();
      } else if (index === 3) {
        toast.show("「明镜」正在精心筹备中，敬请期待");
      }
    },
    [navigateToHandbook, navigateToNewLife, toast],
  );

  /** 返回首页 */
  const navigateToHome = useCallback(() => {
    routeKeyRef.current += 1;
    setNavDirection("back");
    setRoute({ page: "home" });
  }, []);

  // 初始化完成前不渲染任何内容，避免首页闪烁
  if (loading) {
    return null;
  }

  /** 渲染当前页面内容 */
  const renderPage = () => {
    switch (route.page) {
      case "handbook":
        return (
          <Handbook
            onSelectBook={navigateToBookDetail}
            onNavChange={handleNavChange}
          />
        );
      case "book-detail":
        return (
          <BookDetail
            bookId={route.bookId}
            onBack={navigateBackToHandbook}
            onSelectChapter={navigateToChapterPlayer}
          />
        );
      case "chapter-player":
        return (
          <ChapterPlayer
            bookId={route.bookId}
            chapterId={route.chapterId}
            onBack={() => navigateBackToBookDetail(route.bookId)}
          />
        );
      case "newlife":
        return (
          <NewLifePath
            onNavChange={handleNavChange}
            onNavigateToCircle={navigateToCircle}
          />
        );
      case "circle":
        return <CirclePage onBack={navigateBackToNewLife} />;
      case "player":
        return (
          <AudioPlayer trackLabel={route.trackLabel} onBack={navigateToHome} />
        );
      case "article":
        return (
          <ArticleReader articleId={route.articleId} onBack={navigateToHome} />
        );
      case "podcast":
        return (
          <PodcastDetail podcastId={route.podcastId} onBack={navigateToHome} />
        );
      case "activity":
        return (
          <ActivityDetail
            activityId={route.activityId}
            onBack={navigateToHome}
          />
        );
      case "guide":
        return <OnboardingGuide onBack={navigateToHome} />;
      case "solar":
        return <OnboardingSolar onBack={navigateToHome} />;
      case "breathing":
        return <BreathingSession onBack={navigateToHome} />;
      case "login":
        return (
          <LoginPage
            onBack={navigateToHome}
            onLoginSuccess={(info) => {
              setUser(info);
              navigateToHome();
            }}
          />
        );
      case "home":
      default:
        return (
          <Home
            onNavChange={handleNavChange}
            isLoggedIn={isLoggedIn}
            userInfo={
              userInfo
                ? {
                    name: userInfo.nickname,
                    avatar: userInfo.avatar,
                    days: userInfo.days,
                  }
                : undefined
            }
            onLogout={logout}
            onNavigateToLogin={wxLogin}
          />
        );
    }
  };

  return (
    <>
      <PageTransition key={routeKeyRef.current} direction={navDirection}>
        {renderPage()}
      </PageTransition>
      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={toast.duration}
        onDismiss={toast.dismiss}
      />
    </>
  );
}
