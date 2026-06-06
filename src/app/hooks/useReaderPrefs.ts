/**
 * useReaderPrefs - 阅读器偏好（字号 / 行距 / 主题 / 正文字体）
 *
 * 本地持久化（localStorage）。对齐第八卷「工具归位·人拥有选择」：
 * 阅读体验由读者自己掌控，可随时调整、随时恢复，不被系统替读者决定。
 * 后续可平滑迁移到账号维度多端同步。
 */

import { useState, useEffect, useCallback } from "react";

export type ReaderTheme = "day" | "sepia" | "night";

export interface ReaderPrefs {
  /** 字号档位，索引 READER_FONT_SCALES */
  fontIdx: number;
  /** 行距档位，索引 READER_LINE_HEIGHTS */
  lineIdx: number;
  /** 阅读主题 */
  theme: ReaderTheme;
  /** 正文是否用宋体（false=黑体；标题恒宋体） */
  serifBody: boolean;
}

/** 正文字号（rpx）：小 / 中 / 大 / 特大 */
export const READER_FONT_SCALES = [28, 32, 36, 40] as const;
/** 行距：紧凑 / 适中 / 疏朗 */
export const READER_LINE_HEIGHTS = [1.5, 1.7, 1.9] as const;

export const READER_FONT_LABELS = ["小", "中", "大", "特大"] as const;
export const READER_LINE_LABELS = ["紧凑", "适中", "疏朗"] as const;

const STORAGE_KEY = "ysx_reader_prefs";

const DEFAULT_PREFS: ReaderPrefs = {
  fontIdx: 1,
  lineIdx: 1,
  theme: "day",
  serifBody: false,
};

function loadPrefs(): ReaderPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<ReaderPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<ReaderPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* 忽略持久化失败（隐私模式等） */
      }
      return next;
    });
  }, []);

  return { prefs, update, hydrated };
}
