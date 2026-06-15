/**
 * useDailyActions / useDailyFavorites - 今日一段的「轻功能」状态（本地优先）
 *
 * 对齐《人类手册模块UI进一步优化》§2.3 与「感知高于数据」原则：
 *   - 收藏（这句话我想留下）：按【段落身份】持久保存**整段文字与出处**，可随时取消，
 *     长期保留，并在首页「我的收藏」抽屉里统一查看；
 *   - 已练习（今天我完成了）：按【当天日期】记录，气质是「今天，我回来了一次」，
 *     **不是打卡/积分/排行**，仅给用户一个温和的「今天回来过」的确认，次日自然归零。
 *
 * 故意不做：连续天数、完成率、排行榜——避免制造焦虑。
 */

import { useState, useEffect, useCallback } from "react";

const FAV_KEY = "ysx_handbook_daily_favorites";
const PRACTICED_KEY = "ysx_handbook_daily_practiced";

/** 一条收藏的句子（含原文与出处，便于在收藏列表里直接呈现并回跳章节） */
export interface DailyFavorite {
  /** 段落身份：`${volumeId}:${chapterId}` */
  id: string;
  passage: string;
  volumeId: string;
  chapterId: string;
  volumeTitle: string;
  chapterTitle: string;
  savedAt: number;
}

/** 收藏一段所需的最小信息（id 由 volumeId:chapterId 推导） */
export type DailyFavoriteInput = Omit<DailyFavorite, "id" | "savedAt">;

/** 本地日期键（YYYY-M-D，按本地时区，跨天自然失效） */
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function favIdOf(volumeId: string, chapterId: string) {
  return `${volumeId}:${chapterId}`;
}

function loadFavorites(): DailyFavorite[] {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    // 仅保留结构完整的记录（兼容早期可能写入的脏数据）
    return (arr as DailyFavorite[]).filter(
      (f) => f && typeof f.id === "string" && typeof f.passage === "string",
    );
  } catch {
    return [];
  }
}

function saveFavorites(list: DailyFavorite[]) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
  } catch {
    /* 忽略持久化失败 */
  }
}

function loadPracticed(): string[] {
  try {
    const raw = localStorage.getItem(PRACTICED_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? (arr as string[]) : [];
  } catch {
    return [];
  }
}

function savePracticed(list: string[]) {
  try {
    localStorage.setItem(PRACTICED_KEY, JSON.stringify(list));
  } catch {
    /* 忽略持久化失败 */
  }
}

/**
 * 单段今日一段的三态：收藏 / 已练习（今天）。
 * @param input 当前段落信息；收藏时整段连同出处一并保存。
 */
export function useDailyActions(input: DailyFavoriteInput) {
  const passageId = favIdOf(input.volumeId, input.chapterId);
  const [favorites, setFavorites] = useState<DailyFavorite[]>([]);
  const [practicedKeys, setPracticedKeys] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    setPracticedKeys(loadPracticed());
    setHydrated(true);
  }, []);

  const favorited = favorites.some((f) => f.id === passageId);
  const practiceMark = `${todayKey()}:${passageId}`;
  const practicedToday = practicedKeys.includes(practiceMark);

  const toggleFavorite = useCallback(() => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === passageId);
      const next = exists
        ? prev.filter((f) => f.id !== passageId)
        : [
            { ...input, id: passageId, savedAt: Date.now() },
            ...prev,
          ];
      saveFavorites(next);
      return next;
    });
  }, [passageId, input]);

  const togglePracticedToday = useCallback(() => {
    setPracticedKeys((prev) => {
      const exists = prev.includes(practiceMark);
      // 仅保留近 30 条，避免长期累积膨胀（无需历史统计）
      const next = exists
        ? prev.filter((k) => k !== practiceMark)
        : [...prev, practiceMark].slice(-30);
      savePracticed(next);
      return next;
    });
  }, [practiceMark]);

  return {
    hydrated,
    favorited,
    toggleFavorite,
    practicedToday,
    togglePracticedToday,
  };
}

/**
 * 收藏的句子列表（供首页「我的收藏」抽屉使用）。
 * 提供 reload()，便于抽屉每次打开时从本地读取最新数据。
 */
export function useDailyFavorites() {
  const [favorites, setFavorites] = useState<DailyFavorite[]>([]);

  const reload = useCallback(() => {
    setFavorites(loadFavorites());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      saveFavorites(next);
      return next;
    });
  }, []);

  return { favorites, removeFavorite, reload };
}
