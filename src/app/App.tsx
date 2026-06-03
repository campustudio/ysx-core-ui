/**
 * 应用入口 - 元感知
 *
 * 简单状态路由：管理页面切换
 */
import { useState, useCallback, useRef } from "react";
import { Home } from "./pages/Home";
import { Handbook } from "./pages/Handbook";
import { VolumeDetail } from "./pages/VolumeDetail";
import { ChapterDetail } from "./pages/ChapterDetail";
import { BookDetail } from "./pages/BookDetail";
import { ChapterPlayer } from "./pages/ChapterPlayer";
import { HandbookHome } from "./pages/HandbookHome";
import { HandbookShelf } from "./pages/HandbookShelf";
import { HandbookReadingEntry } from "./pages/HandbookReadingEntry";
import { HandbookRecommend } from "./pages/HandbookRecommend";
import { HandbookVolume } from "./pages/HandbookVolume";
import { HandbookReader } from "./pages/HandbookReader";
import { HandbookPractice } from "./pages/HandbookPractice";
import { HandbookDaily } from "./pages/HandbookDaily";
import { NewLifePath } from "./pages/NewLifePath";
import { PathLayerDetail } from "./pages/PathLayerDetail";
import { DimensionDetail } from "./pages/DimensionDetail";
import { PracticePage } from "./pages/PracticePage";
import { PracticeHistory } from "./pages/PracticeHistory";
import { CirclePage } from "./pages/CirclePage";
import { AudioPlayer } from "./pages/AudioPlayer";
import { ArticleReader } from "./pages/ArticleReader";
import { PodcastDetail } from "./pages/PodcastDetail";
import { ActivityDetail } from "./pages/ActivityDetail";
import { OnboardingGuide } from "./pages/OnboardingGuide";
import { OnboardingSolar } from "./pages/OnboardingSolar";
import { BreathingSession } from "./pages/BreathingSession";
import { LoginPage } from "./pages/LoginPage";
import { LogoPreviewPage } from "./pages/LogoPreviewPage";
import { PageTransition } from "./components/shared/PageTransition";
import { Toast } from "./components/shared/Toast";
import { useToast } from "./hooks/useToast";

/** 用户信息（模拟） */
interface UserInfo {
  name: string;
  avatar: string;
  days: number;
}

/** 页面路由状态 */
type PageRoute =
  | { page: "home" }
  | { page: "handbook" }
  | { page: "handbook-home" }
  | { page: "hb-shelf" }
  | { page: "hb-entry" }
  | { page: "hb-recommend"; optionId: string }
  | { page: "hb-volume"; volumeId: string }
  | { page: "hb-reader"; volumeId: string; chapterId: string }
  | {
      page: "hb-practice";
      volumeId: string;
      chapterId: string;
      mode?: "reading" | "recommend";
    }
  | { page: "hb-daily" }
  | { page: "volume-detail"; volumeId: string }
  | { page: "chapter-detail"; volumeId: string; chapterId: string }
  | { page: "book-detail"; bookId: string }
  | { page: "chapter-player"; bookId: string; chapterId: string }
  | { page: "newlife" }
  | { page: "path-layer"; layerId: string }
  | { page: "dimension-detail"; layerId: string; dimensionId: string }
  | {
      page: "practice";
      practiceId: string;
      fromLayerId?: string;
      fromDimensionId?: string;
    }
  | { page: "practice-history" }
  | { page: "circle" }
  | { page: "player"; trackLabel: string }
  | { page: "article"; articleId: string }
  | { page: "podcast"; podcastId: string }
  | { page: "activity"; activityId: string }
  | { page: "guide" }
  | { page: "solar" }
  | { page: "breathing" }
  | { page: "login" }
  | { page: "logo-preview" };

/** 导航方向：用于决定转场动画 */
type NavDirection = "forward" | "back";

export default function App() {
  const toast = useToast();
  /** 路由历史栈：栈顶为当前页面，返回即出栈到真正的上一页 */
  const [history, setHistory] = useState<PageRoute[]>([{ page: "home" }]);
  const route = history[history.length - 1];
  /** 导航方向，驱动 PageTransition 选择动画 */
  const [navDirection, setNavDirection] = useState<NavDirection>("forward");
  /** 用户登录状态（模拟） */
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
      setHistory((h) => [...h, newRoute]);
    },
    [saveHomeScroll],
  );

  /** 原地替换栈顶（如阅读器内切章，不加深历史） */
  const replaceTop = useCallback((newRoute: PageRoute) => {
    routeKeyRef.current += 1;
    setNavDirection("forward");
    setHistory((h) => [...h.slice(0, -1), newRoute]);
  }, []);

  /** 重置为某个 Tab 根页面（底部导航切换，清空历史栈） */
  const resetTo = useCallback(
    (newRoute: PageRoute) => {
      saveHomeScroll();
      routeKeyRef.current += 1;
      setNavDirection("back");
      setHistory([newRoute]);
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

  /** 进入 Logo 预览页 */
  const navigateToLogoPreview = useCallback(() => {
    navigateForward({ page: "logo-preview" });
  }, [navigateForward]);

  /** 进入人类手册（新版手册馆首页） */
  const navigateToHandbook = useCallback(() => {
    resetTo({ page: "handbook-home" });
  }, [resetTo]);

  /** 返回上一页：出栈到真正的上一个页面 */
  const goBack = useCallback(() => {
    routeKeyRef.current += 1;
    setNavDirection("back");
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }, []);

  /** 进入新人生之路 */
  const navigateToNewLife = useCallback(() => {
    resetTo({ page: "newlife" });
  }, [resetTo]);

  /** 进入圈子社区 */
  const navigateToCircle = useCallback(() => {
    navigateForward({ page: "circle" });
  }, [navigateForward]);

  /** 从新人生之路进入层详情 */
  const navigateToPathLayer = useCallback(
    (layerId: string) => {
      navigateForward({ page: "path-layer", layerId });
    },
    [navigateForward],
  );

  /** 从手册进入卷详情 */
  const navigateToVolumeDetail = useCallback(
    (volumeId: string) => {
      navigateForward({ page: "volume-detail", volumeId });
    },
    [navigateForward],
  );

  /** 从卷详情进入章节详情 */
  const navigateToChapterDetail = useCallback(
    (volumeId: string, chapterId: string) => {
      navigateForward({ page: "chapter-detail", volumeId, chapterId });
    },
    [navigateForward],
  );

  /** 从路径层进入维度详情 */
  const navigateToDimensionDetail = useCallback(
    (layerId: string, dimensionId: string) => {
      navigateForward({ page: "dimension-detail", layerId, dimensionId });
    },
    [navigateForward],
  );

  /** 从路径层/维度进入践行功能 */
  const navigateToPracticePage = useCallback(
    (practiceId: string, fromLayerId?: string, fromDimensionId?: string) => {
      navigateForward({
        page: "practice",
        practiceId,
        fromLayerId,
        fromDimensionId,
      });
    },
    [navigateForward],
  );

  /** 进入践行记录历史 */
  const navigateToPracticeHistory = useCallback(() => {
    navigateForward({ page: "practice-history" });
  }, [navigateForward]);

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

  /** 底部导航统一处理（从任意页面切换 Tab） */
  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 0) {
        resetTo({ page: "home" });
      } else if (index === 1) {
        navigateToHandbook();
      } else if (index === 2) {
        navigateToNewLife();
      } else if (index === 3) {
        toast.show("「明镜」正在精心筹备中，敬请期待");
      }
    },
    [resetTo, navigateToHandbook, navigateToNewLife, toast],
  );

  /** 返回首页（Tab 根） */
  const navigateToHome = useCallback(() => {
    resetTo({ page: "home" });
  }, [resetTo]);

  /** 渲染当前页面内容 */
  const renderPage = () => {
    switch (route.page) {
      case "handbook":
        return (
          <Handbook
            onSelectVolume={navigateToVolumeDetail}
            onNavChange={handleNavChange}
            onNavigateToChapter={navigateToChapterDetail}
          />
        );
      case "volume-detail":
        return (
          <VolumeDetail
            volumeId={route.volumeId}
            onBack={goBack}
            onNavigateToChapter={navigateToChapterDetail}
          />
        );
      case "chapter-detail":
        return (
          <ChapterDetail
            volumeId={route.volumeId}
            chapterId={route.chapterId}
            onBack={goBack}
            onNavigateToChapter={navigateToChapterDetail}
          />
        );
      case "book-detail":
        return (
          <BookDetail
            bookId={route.bookId}
            onBack={goBack}
            onSelectChapter={navigateToChapterPlayer}
          />
        );
      case "chapter-player":
        return (
          <ChapterPlayer
            bookId={route.bookId}
            chapterId={route.chapterId}
            onBack={goBack}
          />
        );
      case "newlife":
        return (
          <NewLifePath
            onNavChange={handleNavChange}
            onNavigateToCircle={navigateToCircle}
            onNavigateToLayer={navigateToPathLayer}
          />
        );
      case "path-layer":
        return (
          <PathLayerDetail
            layerId={route.layerId}
            onBack={goBack}
            onNavChange={handleNavChange}
            onNavigateToDimension={navigateToDimensionDetail}
            onNavigateToPractice={navigateToPracticePage}
            onNavigateToPracticeHistory={navigateToPracticeHistory}
          />
        );
      case "dimension-detail":
        return (
          <DimensionDetail
            layerId={route.layerId}
            dimensionId={route.dimensionId}
            onBack={goBack}
            onStartPractice={(practiceId, layerId, dimensionId) =>
              navigateToPracticePage(practiceId, layerId, dimensionId)
            }
          />
        );
      case "practice":
        return <PracticePage practiceId={route.practiceId} onBack={goBack} />;
      case "practice-history":
        return <PracticeHistory onBack={goBack} />;
      case "circle":
        return <CirclePage onBack={goBack} />;
      case "player":
        return <AudioPlayer trackLabel={route.trackLabel} onBack={goBack} />;
      case "article":
        return <ArticleReader articleId={route.articleId} onBack={goBack} />;
      case "podcast":
        return <PodcastDetail podcastId={route.podcastId} onBack={goBack} />;
      case "activity":
        return <ActivityDetail activityId={route.activityId} onBack={goBack} />;
      case "guide":
        return <OnboardingGuide onBack={goBack} />;
      case "solar":
        return <OnboardingSolar onBack={goBack} />;
      case "breathing":
        return <BreathingSession onBack={goBack} />;
      case "login":
        return (
          <LoginPage
            onBack={goBack}
            onLoginSuccess={(info) => {
              setUserInfo(info);
              navigateToHome();
            }}
          />
        );
      case "logo-preview":
        return <LogoPreviewPage onBack={goBack} />;
      case "handbook-home":
        return (
          <HandbookHome
            onNavChange={handleNavChange}
            onOpenShelf={() => navigateForward({ page: "hb-shelf" })}
            onOpenReadingEntry={() => navigateForward({ page: "hb-entry" })}
            onOpenDaily={() => navigateForward({ page: "hb-daily" })}
            onOpenVolume={(volumeId) =>
              navigateForward({ page: "hb-volume", volumeId })
            }
            onOpenPractice={(volumeId, chapterId) =>
              navigateForward({ page: "hb-practice", volumeId, chapterId })
            }
            onContinueReading={(volumeId, chapterId) =>
              navigateForward({ page: "hb-reader", volumeId, chapterId })
            }
          />
        );
      case "hb-shelf":
        return (
          <HandbookShelf
            onBack={goBack}
            onOpenVolume={(volumeId) =>
              navigateForward({ page: "hb-volume", volumeId })
            }
          />
        );
      case "hb-entry":
        return (
          <HandbookReadingEntry
            onBack={goBack}
            onGenerate={(optionId) =>
              navigateForward({ page: "hb-recommend", optionId })
            }
          />
        );
      case "hb-recommend":
        return (
          <HandbookRecommend
            optionId={route.optionId}
            onBack={goBack}
            onStartReading={(volumeId, chapterId) =>
              chapterId
                ? navigateForward({ page: "hb-reader", volumeId, chapterId })
                : navigateForward({ page: "hb-volume", volumeId })
            }
            onOpenVolume={(volumeId) =>
              navigateForward({ page: "hb-volume", volumeId })
            }
            onOpenPractice={(volumeId, chapterId) =>
              navigateForward({
                page: "hb-practice",
                volumeId,
                chapterId,
                mode: "recommend",
              })
            }
          />
        );
      case "hb-volume":
        return (
          <HandbookVolume
            volumeId={route.volumeId}
            onBack={goBack}
            onSelectChapter={(volumeId, chapterId) =>
              navigateForward({ page: "hb-reader", volumeId, chapterId })
            }
          />
        );
      case "hb-reader":
        return (
          <HandbookReader
            volumeId={route.volumeId}
            chapterId={route.chapterId}
            onBack={goBack}
            onSelectChapter={(volumeId, chapterId) =>
              replaceTop({ page: "hb-reader", volumeId, chapterId })
            }
            onFinish={(volumeId, chapterId) =>
              navigateForward({ page: "hb-practice", volumeId, chapterId })
            }
            onGoHome={() => navigateForward({ page: "handbook-home" })}
            onGoShelf={() => navigateForward({ page: "hb-shelf" })}
          />
        );
      case "hb-practice":
        return (
          <HandbookPractice
            volumeId={route.volumeId}
            chapterId={route.chapterId}
            mode={route.mode}
            onBack={goBack}
            onNextChapter={(volumeId, chapterId) =>
              navigateForward({ page: "hb-reader", volumeId, chapterId })
            }
            onFinishVolume={(volumeId) =>
              navigateForward({ page: "hb-volume", volumeId })
            }
          />
        );
      case "hb-daily":
        return (
          <HandbookDaily
            onBack={goBack}
            onReadChapter={(volumeId, chapterId) =>
              navigateForward({ page: "hb-reader", volumeId, chapterId })
            }
          />
        );
      case "home":
      default:
        return (
          <Home
            onNavChange={handleNavChange}
            onNavigateToLogoPreview={navigateToLogoPreview}
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
