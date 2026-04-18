/**
 * Handbook - 人类手册 · 知识殿堂 (version 2.3 - 五卷体系版)
 *
 * 核心定位：
 * - 五卷体系：真相启示录 → 感知新文明序典 → 感知科学全书 → 问答录 → 践行录
 * - 极致极简、纯净、透明、深刻的碑感文字排版
 * - "不是简单的电子书，是鲜活的学习体验"
 */

import { useState, useCallback, useEffect } from "react";
import { Search, ChevronRight, Bookmark, X } from "lucide-react";
import { FIVE_VOLUMES, type Volume } from "../config/handbook-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { useNavigation } from "../hooks/useNavigation";
import {
  useReadingProgress,
  formatLastReadTime,
} from "../hooks/useReadingProgress";

interface HandbookProps {
  onSelectBook?: (bookId: string) => void;
  onSelectVolume?: (volumeId: string) => void;
  onNavChange?: (index: number) => void;
  onNavigateToChapter?: (volumeId: string, chapterId: string) => void;
}

export function Handbook({
  onSelectVolume,
  onNavChange,
  onNavigateToChapter,
}: HandbookProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const { isHidden } = useNavigation("handbook");
  const { lastProgress, hasProgress, bookmarks, removeBookmark } =
    useReadingProgress();
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 1) return;
      if (index === 3) {
        toast.show("「明镜」正在精心筹备中，敬请期待");
        return;
      }
      onNavChange?.(index);
    },
    [onNavChange, toast],
  );

  const handleVolumeClick = useCallback(
    (volume: Volume) => {
      if (onSelectVolume) {
        onSelectVolume(volume.id);
      } else {
        toast.show(`《${volume.title}》详情页筹备中`);
      }
    },
    [onSelectVolume, toast],
  );

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
            文明母本
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
            知识的殿堂
          </p>
        </div>

        <button
          onClick={() => toast.show("搜索功能正在精心筹备中")}
          style={{
            background: "transparent",
            border: "none",
            padding: rpx(16),
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Search size={22} strokeWidth={1.5} color="#555" />
        </button>
      </div>

      {/* 核心金句 */}
      <div
        style={{
          padding: `0 ${rpx(40)} ${rpx(40)}`,
          borderBottom: "1px solid rgba(0,0,0,0.05)",
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
          "感知是宇宙诞生的源头，维度不是地方，维度是你的频率。"
        </p>
      </div>

      {/* 继续阅读 */}
      {hasProgress && lastProgress && (
        <div
          onClick={() => {
            if (onNavigateToChapter) {
              onNavigateToChapter(
                lastProgress.volumeId,
                lastProgress.chapterId,
              );
            }
          }}
          style={{
            margin: `0 ${rpx(40)} ${rpx(20)}`,
            padding: `${rpx(20)} ${rpx(24)}`,
            background:
              "linear-gradient(135deg, rgba(139,115,85,0.08) 0%, rgba(139,115,85,0.04) 100%)",
            borderRadius: rpx(16),
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontSize: rpx(18), color: "#999", margin: 0 }}>
              继续阅读 · {formatLastReadTime(lastProgress.lastReadAt)}
            </p>
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(24),
                fontWeight: 500,
                color: "#333",
                margin: `${rpx(6)} 0 0`,
              }}
            >
              {lastProgress.title || "上次阅读位置"}
            </p>
          </div>
          <ChevronRight size={20} color="#8B7355" strokeWidth={1.5} />
        </div>
      )}

      {/* 书签列表 */}
      {bookmarks.length > 0 && (
        <div style={{ margin: `0 ${rpx(40)} ${rpx(20)}` }}>
          <div
            onClick={() => setShowBookmarks(!showBookmarks)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `${rpx(16)} 0`,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: rpx(8) }}>
              <Bookmark size={18} color="#8B7355" strokeWidth={1.5} />
              <span style={{ fontSize: rpx(20), color: "#666" }}>
                我的书签 ({bookmarks.length})
              </span>
            </div>
            <ChevronRight
              size={18}
              color="#999"
              strokeWidth={1.5}
              style={{
                transform: showBookmarks ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </div>

          <div
            style={{
              background: "rgba(0,0,0,0.02)",
              borderRadius: rpx(12),
              overflow: "hidden",
              maxHeight: showBookmarks ? rpx(500) : 0,
              opacity: showBookmarks ? 1 : 0,
              transition: "max-height 0.5s ease, opacity 0.4s ease",
            }}
          >
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: `${rpx(16)} ${rpx(20)}`,
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <div
                  onClick={() => {
                    if (onNavigateToChapter) {
                      onNavigateToChapter(
                        bookmark.volumeId,
                        bookmark.chapterId,
                      );
                    }
                  }}
                  style={{ flex: 1, cursor: "pointer" }}
                >
                  <p
                    style={{
                      fontFamily: FONT_SERIF,
                      fontSize: rpx(22),
                      color: "#333",
                      margin: 0,
                    }}
                  >
                    {bookmark.title}
                  </p>
                  <p
                    style={{
                      fontSize: rpx(16),
                      color: "#999",
                      margin: `${rpx(4)} 0 0`,
                    }}
                  >
                    {formatLastReadTime(bookmark.createdAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(bookmark.id);
                    toast.show("已删除书签");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: rpx(8),
                    cursor: "pointer",
                  }}
                >
                  <X size={16} color="#999" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 五卷体系列表 */}
      <div
        style={{
          flex: 1,
          padding: `${rpx(20)} ${rpx(40)} ${rpx(160)}`,
          overflowY: "auto",
        }}
      >
        {FIVE_VOLUMES.map((volume) => (
          <div
            key={volume.id}
            onClick={() => handleVolumeClick(volume)}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: `${rpx(40)} 0`,
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {/* 背景卷序号 */}
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
              {volume.volumeNumber}
            </div>

            {/* 卷标题 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(16),
                marginBottom: rpx(12),
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(20),
                  color: "#999",
                  letterSpacing: rpx(2),
                }}
              >
                第{["一", "二", "三", "四", "五"][volume.volumeNumber - 1]}卷
              </span>
              <span
                style={{
                  fontSize: rpx(16),
                  color: "#AAA",
                  background: "rgba(0,0,0,0.03)",
                  padding: `${rpx(4)} ${rpx(12)}`,
                  borderRadius: rpx(20),
                }}
              >
                {volume.coreTheme}
              </span>
            </div>

            <h3
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(44),
                fontWeight: 600,
                color: "#222",
                margin: 0,
                lineHeight: 1.3,
                letterSpacing: rpx(6),
                zIndex: 1,
              }}
            >
              {volume.title}
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
              {volume.subtitle}
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
              {volume.description}
            </p>

            {/* 底部信息 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 1,
              }}
            >
              <div style={{ display: "flex", gap: rpx(12), flexWrap: "wrap" }}>
                {volume.keywords.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    style={{
                      fontSize: rpx(18),
                      color: "#999",
                      background: "rgba(0,0,0,0.02)",
                      padding: `${rpx(6)} ${rpx(14)}`,
                      borderRadius: rpx(16),
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <ChevronRight size={20} color="#CCC" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation
        active={1}
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
