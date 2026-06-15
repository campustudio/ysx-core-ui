/**
 * useDailyActions / useDailyFavorites - 今日一段的「轻功能」状态（本地优先）
 *
 * 对齐《人类手册模块UI进一步优化》§2.3 与「感知高于数据」原则：
 *   - 收藏（这句话我想留下）：按【段落身份】持久保存**整段文字与出处**，可随时取消，
 *     长期保留，并在首页「我的收藏」抽屉里统一查看；
 *   - 已练习（今天我完成了）：按【段落身份】**持久记录练习日期**，可撤销；
 *     气质是「今天，我回来了一次」。日后回看同一段时仍能确认「练过 + 哪天练的」。
 *
 * 「感知高于数据」的边界（见 human-manual-module.md §15.4 / 第八卷 / §18.1）：
 *   禁止的是**会制造焦虑的数据**——连续打卡天数、完成率百分比、倒计时、排行积分。
 *   而「我练过这一段 / 哪天练的」是**用户需要、且不制造焦虑**的记录，应当持久保留。
 *   故此处只存「是否练过 + 练习时间」，**不做**天数/完成率/排行。
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

/** 一条练习记录（持久；仅「是否练过 + 何时练的」，无天数/完成率） */
export interface PracticeRecord {
  /** 段落身份：`${volumeId}:${chapterId}` */
  id: string;
  practicedAt: number;
}

function favIdOf(volumeId: string, chapterId: string) {
  return `${volumeId}:${chapterId}`;
}

/** 练习日期的轻量展示：「6月15日」（同年省略年份，跨年才带上） */
export function formatPracticedDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const md = `${d.getMonth() + 1}月${d.getDate()}日`;
  return d.getFullYear() === now.getFullYear() ? md : `${d.getFullYear()}年${md}`;
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

function loadPracticed(): PracticeRecord[] {
  try {
    const raw = localStorage.getItem(PRACTICED_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return (arr as PracticeRecord[]).filter(
      (r) => r && typeof r.id === "string" && typeof r.practicedAt === "number",
    );
  } catch {
    return [];
  }
}

function savePracticed(list: PracticeRecord[]) {
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
  const [practiced, setPracticed] = useState<PracticeRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    setPracticed(loadPracticed());
    setHydrated(true);
  }, []);

  const favorited = favorites.some((f) => f.id === passageId);
  const practicedRecord = practiced.find((r) => r.id === passageId);
  const isPracticed = !!practicedRecord;
  const practicedAt = practicedRecord?.practicedAt;

  const toggleFavorite = useCallback(() => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === passageId);
      const next = exists
        ? prev.filter((f) => f.id !== passageId)
        : [{ ...input, id: passageId, savedAt: Date.now() }, ...prev];
      saveFavorites(next);
      return next;
    });
  }, [passageId, input]);

  // 持久切换「已练习」：记录练习时间，可撤销（无天数/完成率，仅留下「练过 + 何时」）
  const togglePracticed = useCallback(() => {
    setPracticed((prev) => {
      const exists = prev.some((r) => r.id === passageId);
      const next = exists
        ? prev.filter((r) => r.id !== passageId)
        : [{ id: passageId, practicedAt: Date.now() }, ...prev];
      savePracticed(next);
      return next;
    });
  }, [passageId]);

  return {
    hydrated,
    favorited,
    toggleFavorite,
    isPracticed,
    practicedAt,
    togglePracticed,
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
