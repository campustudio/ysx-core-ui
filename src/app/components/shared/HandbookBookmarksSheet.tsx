/**
 * HandbookBookmarksSheet - 收藏夹底部抽屉
 *
 * 展示用户收藏的章节列表，支持点击跳转和删除。
 * 样式与阅读器目录弹层一致（底部抽屉·圆角·白色背景）。
 */

import { Bookmark, X, Trash2 } from "lucide-react";
import { rpx, FONT_SERIF } from "../../config/styles";
import type { Bookmark as BookmarkType } from "../../hooks/useReadingProgress";
import { formatLastReadTime } from "../../hooks/useReadingProgress";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

const GOLD = "#B8975A";
const INK = "#1F1F1F";
const SUB = "#606266";

interface HandbookBookmarksSheetProps {
  visible: boolean;
  bookmarks: BookmarkType[];
  onClose: () => void;
  onNavigateToChapter: (volumeId: string, chapterId: string) => void;
  onRemoveBookmark: (id: string) => void;
}

export function HandbookBookmarksSheet({
  visible,
  bookmarks,
  onClose,
  onNavigateToChapter,
  onRemoveBookmark,
}: HandbookBookmarksSheetProps) {
  useBodyScrollLock(visible);

  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "70vh",
          background: "#fff",
          borderRadius: `${rpx(32)} ${rpx(32)} 0 0`,
          padding: `${rpx(32)} ${rpx(40)} calc(env(safe-area-inset-bottom) + ${rpx(40)})`,
          overflowY: "auto",
        }}
      >
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
              ({bookmarks.length})
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

        {/* 收藏列表 */}
        {bookmarks.length === 0 ? (
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
          bookmarks.map((bookmark) => (
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
                  onNavigateToChapter(bookmark.volumeId, bookmark.chapterId);
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
          ))
        )}
      </div>
    </div>
  );
}
