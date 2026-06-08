/**
 * useReadingPath - 「我的路径」持久化（本期本地存储，后续接后端）
 *
 * 「阅读建议」一旦生成，就成为用户的**我的路径**（个人、可保存、可调整的阅读路线）。
 * 本期仅保存用户在「找到我的阅读入口」里选择的 optionId；据此用静态映射
 * （`getRecommendation`）还原出当前路径。后台推荐/路径引擎为后续工作（见设计文档 §十四/十七）。
 *
 * 设计原则对齐：路径属于用户、可随时调整（工具归位、人拥有选择），
 * 不是算法黑箱、不做「完成率」驱动。
 */

import { useCallback, useEffect, useState } from "react";
import { getRecommendation } from "../config/handbook-v2-data";
import type { Recommendation } from "../config/handbook-v2-data";

const STORAGE_KEY = "handbook_reading_path_v1";

interface StoredPath {
  optionId: string;
  updatedAt: number;
}

function readStored(): StoredPath | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPath;
    if (parsed && typeof parsed.optionId === "string") return parsed;
    return null;
  } catch {
    return null;
  }
}

export interface ReadingPathState {
  /** 当前路径对应的入口选项 id（无则为 null） */
  optionId: string | null;
  /** 当前路径详情（由 optionId 静态映射还原；无则为 null） */
  path: Recommendation | null;
  /** 是否已生成「我的路径」 */
  hasPath: boolean;
  /** 上次更新时间戳 */
  updatedAt: number | null;
  /** 保存 / 更新「我的路径」（在生成阅读建议时调用） */
  savePath: (optionId: string) => void;
  /** 清空「我的路径」 */
  clearPath: () => void;
}

export function useReadingPath(): ReadingPathState {
  const [stored, setStored] = useState<StoredPath | null>(() => readStored());

  // 跨标签页/多实例同步：监听 storage 事件，保持各处「我的路径」一致
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setStored(readStored());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const savePath = useCallback((optionId: string) => {
    const next: StoredPath = { optionId, updatedAt: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* 忽略写入失败（隐私模式等）；至少内存态可用 */
    }
    setStored(next);
  }, []);

  const clearPath = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setStored(null);
  }, []);

  const path = stored ? (getRecommendation(stored.optionId) ?? null) : null;

  return {
    optionId: stored?.optionId ?? null,
    path,
    hasPath: !!path,
    updatedAt: stored?.updatedAt ?? null,
    savePath,
    clearPath,
  };
}
