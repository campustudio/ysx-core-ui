/**
 * useReadingProgress - 阅读进度管理 Hook
 *
 * 用于保存和恢复用户的阅读进度
 * 支持：
 * - 自动保存最后阅读位置
 * - 手动添加多个书签
 * - 书签管理（添加、删除、查看）
 * - 章节滚动进度与完成态（见 handbook-v2-data）
 */

import { useState, useEffect, useCallback } from "react";
import {
  loadAllChapterProgress,
  updateChapterScrollPercent,
  markChapterComplete,
  type StoredChapterProgress,
} from "../config/handbook-v2-data";

const STORAGE_KEY = "ysx_reading_progress";
const BOOKMARKS_KEY = "ysx_bookmarks";

export interface ReadingProgress {
  volumeId: string;
  chapterId: string;
  scrollPosition: number;
  lastReadAt: number;
  title?: string;
}

export interface Bookmark {
  id: string;
  volumeId: string;
  chapterId: string;
  title: string;
  note?: string;
  createdAt: number;
}

export type ChapterProgress = StoredChapterProgress;

interface UseReadingProgressReturn {
  /** 获取最后阅读位置 */
  lastProgress: ReadingProgress | null;
  /** 保存当前阅读位置 */
  saveProgress: (progress: Omit<ReadingProgress, "lastReadAt">) => void;
  /** 清除阅读进度 */
  clearProgress: () => void;
  /** 是否有保存的进度 */
  hasProgress: boolean;
  /** 所有书签 */
  bookmarks: Bookmark[];
  /** 添加书签 */
  addBookmark: (bookmark: Omit<Bookmark, "id" | "createdAt">) => boolean;
  /** 删除书签 */
  removeBookmark: (id: string) => void;
  /** 检查是否已收藏 */
  isBookmarked: (volumeId: string, chapterId: string) => boolean;
  /** 章节进度变更计数（用于触发依赖方重渲染） */
  progressRevision: number;
  /** 获取章节进度 */
  getChapterProgress: (chapterId: string) => ChapterProgress | null;
  /** 更新章节滚动进度（只增不减） */
  updateChapterScrollProgress: (chapterId: string, percent: number) => number;
  /** 标记章节完成 */
  markChapterAsComplete: (chapterId: string) => void;
}

export function useReadingProgress(): UseReadingProgressReturn {
  const [lastProgress, setLastProgress] = useState<ReadingProgress | null>(
    null,
  );
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [progressRevision, setProgressRevision] = useState(0);

  const bumpProgressRevision = useCallback(() => {
    setProgressRevision((n) => n + 1);
  }, []);

  // 从 localStorage 加载进度和书签
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress = JSON.parse(saved) as ReadingProgress;
        setLastProgress(progress);
      }

      const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (savedBookmarks) {
        const parsed = JSON.parse(savedBookmarks) as Bookmark[];
        setBookmarks(parsed);
      }
    } catch (e) {
      console.warn("Failed to load reading progress:", e);
    }
  }, []);

  // 保存进度
  const saveProgress = useCallback(
    (progress: Omit<ReadingProgress, "lastReadAt">) => {
      const fullProgress: ReadingProgress = {
        ...progress,
        lastReadAt: Date.now(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProgress));
        setLastProgress(fullProgress);
      } catch (e) {
        console.warn("Failed to save reading progress:", e);
      }
    },
    [],
  );

  // 清除进度
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastProgress(null);
    } catch (e) {
      console.warn("Failed to clear reading progress:", e);
    }
  }, []);

  // 添加书签
  const addBookmark = useCallback(
    (bookmark: Omit<Bookmark, "id" | "createdAt">): boolean => {
      const exists = bookmarks.some(
        (b) =>
          b.volumeId === bookmark.volumeId &&
          b.chapterId === bookmark.chapterId,
      );
      if (exists) return false;

      const newBookmark: Bookmark = {
        ...bookmark,
        id: `bm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };

      const updated = [newBookmark, ...bookmarks];
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
        setBookmarks(updated);
        return true;
      } catch (e) {
        console.warn("Failed to save bookmark:", e);
        return false;
      }
    },
    [bookmarks],
  );

  // 删除书签
  const removeBookmark = useCallback(
    (id: string) => {
      const updated = bookmarks.filter((b) => b.id !== id);
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
        setBookmarks(updated);
      } catch (e) {
        console.warn("Failed to remove bookmark:", e);
      }
    },
    [bookmarks],
  );

  // 检查是否已收藏
  const isBookmarked = useCallback(
    (volumeId: string, chapterId: string): boolean => {
      return bookmarks.some(
        (b) => b.volumeId === volumeId && b.chapterId === chapterId,
      );
    },
    [bookmarks],
  );

  const getChapterProgress = useCallback(
    (chapterId: string): ChapterProgress | null => {
      const all = loadAllChapterProgress();
      return all[chapterId] || null;
    },
    [progressRevision],
  );

  const updateChapterScrollProgress = useCallback(
    (chapterId: string, percent: number): number => {
      const newMax = updateChapterScrollPercent(chapterId, percent);
      bumpProgressRevision();
      return newMax;
    },
    [bumpProgressRevision],
  );

  const markChapterAsComplete = useCallback(
    (chapterId: string) => {
      markChapterComplete(chapterId);
      bumpProgressRevision();
    },
    [bumpProgressRevision],
  );

  return {
    lastProgress,
    saveProgress,
    clearProgress,
    hasProgress: lastProgress !== null,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    progressRevision,
    getChapterProgress,
    updateChapterScrollProgress,
    markChapterAsComplete,
  };
}

/**
 * 格式化最后阅读时间
 */
export function formatLastReadTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
