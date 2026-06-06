/**
 * useChapterNote - 章节笔记（本地优先）
 *
 * 「笔记」是针对【章节内容本身】的自由记录，与练习里的「自照」相互独立：
 *   - 笔记：读这一章时，对这一章内容的想法 / 摘录 / 批注，进入该章即可查看与续写；
 *   - 自照：在该章配套练习里，对【练习】的自我观照。
 *
 * 数据模型：每个章节最多一条笔记（覆盖式），本地 localStorage 存储，后续可平滑迁移到账号维度。
 * 字数上限 CHAPTER_NOTE_MAX：避免 UI / 存储无限膨胀，同时足够写下数百字的长记录。
 */

import { useState, useEffect, useCallback } from "react";

export interface ChapterNote {
  text: string;
  updatedAt: number;
}

/** 单条章节笔记字数上限 */
export const CHAPTER_NOTE_MAX = 1000;

type NoteMap = Record<string, ChapterNote>;

const STORAGE_KEY = "ysx_handbook_chapter_notes";

function mapKey(volumeId: string, chapterId: string) {
  return `${volumeId}:${chapterId}`;
}

function loadAll(): NoteMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NoteMap) : {};
  } catch {
    return {};
  }
}

export function useChapterNote() {
  const [map, setMap] = useState<NoteMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMap(loadAll());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: NoteMap) => {
    setMap(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* 忽略持久化失败 */
    }
  }, []);

  const getNote = useCallback(
    (volumeId: string, chapterId: string): ChapterNote | null =>
      map[mapKey(volumeId, chapterId)] ?? null,
    [map],
  );

  /** 该章是否已有非空笔记（用于在 UI 上区分「记过 / 没记过」） */
  const hasNote = useCallback(
    (volumeId: string, chapterId: string): boolean => {
      const n = map[mapKey(volumeId, chapterId)];
      return !!n && n.text.trim().length > 0;
    },
    [map],
  );

  /** 保存/更新章节笔记；文本为空则视为清除该章笔记 */
  const saveNote = useCallback(
    (volumeId: string, chapterId: string, text: string) => {
      const key = mapKey(volumeId, chapterId);
      const trimmed = text.slice(0, CHAPTER_NOTE_MAX);
      const next = { ...map };
      if (trimmed.trim().length === 0) {
        delete next[key];
      } else {
        next[key] = { text: trimmed, updatedAt: Date.now() };
      }
      persist(next);
    },
    [map, persist],
  );

  return { getNote, hasNote, saveNote, hydrated };
}
