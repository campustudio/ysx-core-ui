/**
 * usePracticeJournal - 写下自照（本地草稿，交互演示期）
 */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ysx_practice_journal";

function journalKey(volumeId: string, chapterId: string) {
  return `${volumeId}:${chapterId}`;
}

function loadAll(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function usePracticeJournal(volumeId: string, chapterId: string) {
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const all = loadAll();
    setText(all[journalKey(volumeId, chapterId)] ?? "");
    setHydrated(true);
  }, [volumeId, chapterId]);

  const save = useCallback(
    (value: string) => {
      setText(value);
      const all = loadAll();
      const key = journalKey(volumeId, chapterId);
      if (value.trim()) {
        all[key] = value;
      } else {
        delete all[key];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    },
    [volumeId, chapterId],
  );

  return { text, setText: save, hydrated };
}
