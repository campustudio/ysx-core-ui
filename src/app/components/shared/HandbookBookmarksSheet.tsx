/**
 * HandbookBookmarksSheet - 收藏夹底部抽屉
 *
 * 展示用户收藏的章节列表，支持点击跳转和删除。
 * 样式与阅读器目录弹层一致（底部抽屉·圆角·白色背景）。
 */

import { Bookmark, Quote, X, Trash2 } from "lucide-react";
import { rpx, FONT_SERIF } from "../../config/styles";
import type { Bookmark as BookmarkType } from "../../hooks/useReadingProgress";
import { formatLastReadTime } from "../../hooks/useReadingProgress";
import type { DailyFavorite } from "../../hooks/useDailyActions";
import { BottomSheet } from "./BottomSheet";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookBookmarksSheetProps {
  visible: boolean;
  bookmarks: BookmarkType[];
  /** 收藏的句子（今日一段「收藏」），与章节收藏统一展示 */
  passages?: DailyFavorite[];
  onClose: () => void;
  onNavigateToChapter: (volumeId: string, chapterId: string) => void;
  onRemoveBookmark: (id: string) => void;
  onRemovePassage?: (id: string) => void;
}

/** 小节标题 */
function SectionLabel({ icon, text }: { icon: typeof Bookmark; text: string }) {
  const Icon = icon;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: rpx(8),
        margin: `${rpx(8)} 0 ${rpx(12)}`,
      }}
    >
      <Icon size={15} color={GOLD} strokeWidth={1.6} />
      <span
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(22),
          color: SUB,
          letterSpacing: rpx(1),
        }}
      >
        {text}
      </span>
    </div>
  );
}

export function HandbookBookmarksSheet({
  visible,
  bookmarks,
  passages = [],
  onClose,
  onNavigateToChapter,
  onRemoveBookmark,
  onRemovePassage,
}: HandbookBookmarksSheetProps) {
  const total = bookmarks.length + passages.length;
  const hasBoth = bookmarks.length > 0 && passages.length > 0;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {/* 标题栏 */}
      <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: rpx(24),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: rpx(8) }}>
            <Bookmark size={18} color={GOLD} strokeWidth={1.5} />
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(32),
                fontWeight: 600,
                color: INK,
              }}
            >
              我的收藏
            </span>
            <span
              style={{
                fontSize: rpx(20),
                color: SUB,
                marginLeft: rpx(4),
              }}
            >
              ({total})
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <X size={20} color={SUB} strokeWidth={1.6} />
          </button>
        </div>

        {total === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: `${rpx(60)} 0`,
              color: SUB,
              fontSize: rpx(24),
            }}
          >
            暂无收藏
          </div>
        ) : (
          <>
            {/* 收藏的句子（今日一段） */}
            {passages.length > 0 && (
              <>
                {hasBoth && <SectionLabel icon={Quote} text="收藏的句子" />}
                {passages.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: rpx(12),
                      padding: `${rpx(20)} 0`,
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onNavigateToChapter(p.volumeId, p.chapterId);
                      }}
                      style={{ flex: 1, cursor: "pointer", minWidth: 0 }}
                    >
                      <p
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(24),
                          color: INK,
                          margin: 0,
                          lineHeight: 1.55,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.passage}
                      </p>
                      <p
                        style={{
                          fontSize: rpx(18),
                          color: SUB,
                          margin: `${rpx(6)} 0 0`,
                        }}
                      >
                        《{p.volumeTitle}》· {p.chapterTitle}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePassage?.(p.id);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: rpx(8),
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={18} color={SUB} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* 收藏的章节 */}
            {bookmarks.length > 0 && (
              <>
                {hasBoth && <SectionLabel icon={Bookmark} text="收藏的章节" />}
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: `${rpx(20)} 0`,
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onNavigateToChapter(
                          bookmark.volumeId,
                          bookmark.chapterId,
                        );
                      }}
                      style={{ flex: 1, cursor: "pointer" }}
                    >
                      <p
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(24),
                          color: INK,
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {bookmark.title}
                      </p>
                      <p
                        style={{
                          fontSize: rpx(18),
                          color: SUB,
                          margin: `${rpx(4)} 0 0`,
                        }}
                      >
                        {formatLastReadTime(bookmark.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(bookmark.id);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: rpx(8),
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Trash2 size={18} color={SUB} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
    </BottomSheet>
  );
}
