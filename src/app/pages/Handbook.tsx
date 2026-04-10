/**
 * Handbook - 人类手册 · 知识殿堂 (version 2.2 - 极致极简版)
 *
 * 核心定位：
 * - 极致极简、无图片、零视觉噪音
 * - 纯净、透明、深刻的碑感文字排版
 * - 以字传神，字即是碑
 */

import { useState, useCallback, useEffect } from "react";
import { Search, BookOpen, Headphones } from "lucide-react";
import {
  HANDBOOK_CATEGORIES,
  BOOKS,
  getBooksByCategory,
  calcBookPercent,
  type Book,
} from "../config/handbook-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { BottomNavigation } from "../components/navigation/BottomNavigation";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

interface HandbookProps {
  onSelectBook?: (bookId: string) => void;
  onNavChange?: (index: number) => void;
}

export function Handbook({ onSelectBook, onNavChange }: HandbookProps) {
  const [activeCategory, setActiveCategory] = useState("recommend");
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = useCallback((catId: string) => {
    setActiveCategory(catId);
    setBooks(getBooksByCategory(catId));
  }, []);

  const handleNavChange = useCallback(
    (index: number) => {
      if (index === 1) return; // 当前页
      if (index === 3) {
        toast.show("「明镜」正在精心筹备中，敬请期待");
        return;
      }
      onNavChange?.(index);
    },
    [onNavChange, toast]
  );

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F2F2F5", // 维持与首页一致的极简浅灰白底色
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    >
      {/* 极简顶部区域 */}
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
              fontSize: rpx(64), // 放大标题，形成重量感
              fontWeight: 600,
              color: "#18181A",
              letterSpacing: rpx(10),
              margin: 0,
              textShadow: "0 1px 1px rgba(255,255,255,1)",
            }}
          >
            人类手册
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

      {/* 极简分类导航 (纯文字) */}
      <div
        style={{
          display: "flex",
          gap: rpx(40),
          padding: `0 ${rpx(40)} ${rpx(20)}`,
          overflowX: "auto",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {HANDBOOK_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                background: "transparent",
                border: "none",
                padding: `${rpx(10)} 0`,
                position: "relative",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: FONT_SERIF,
                fontSize: rpx(28),
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#111" : "#A1A1A1",
                letterSpacing: rpx(4),
                transition: "color 0.3s ease",
              }}
            >
              {cat.name}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: rpx(-20),
                    left: 0,
                    width: "100%",
                    height: "1px",
                    background: "#111",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 纯文字书籍列表 (去图片化，回归本质) */}
      <div
        style={{
          flex: 1,
          padding: `${rpx(40)} ${rpx(40)} ${rpx(160)}`, // 底部留出导航栏空间
          overflowY: "auto",
        }}
      >
        {books.map((book, index) => {
          const percent = calcBookPercent(book);
          return (
            <div
              key={book.id}
              onClick={() => onSelectBook?.(book.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: `${rpx(40)} 0`,
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* 背景修饰：超大序列号，代替封面图 */}
              <div
                style={{
                  position: "absolute",
                  top: rpx(20),
                  right: rpx(0),
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(100),
                  fontWeight: 300,
                  color: "rgba(0,0,0,0.02)",
                  pointerEvents: "none",
                  letterSpacing: rpx(-4),
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* 书名与作者 */}
              <div style={{ marginBottom: rpx(16), zIndex: 1 }}>
                <h3
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(40), // 放大书名
                    fontWeight: 600,
                    color: "#222",
                    margin: 0,
                    lineHeight: 1.4,
                    letterSpacing: rpx(4),
                  }}
                >
                  {book.title}
                </h3>
                <p
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(20),
                    color: "#999",
                    margin: `${rpx(12)} 0 0`,
                    letterSpacing: rpx(2),
                  }}
                >
                  {book.author}
                </p>
              </div>

              {/* 简介 */}
              <p
                style={{
                  fontSize: rpx(26),
                  color: "#666",
                  margin: `${rpx(10)} 0 ${rpx(24)}`,
                  lineHeight: 1.8,
                  fontWeight: 300,
                  zIndex: 1,
                  maxWidth: "90%",
                }}
              >
                {book.description}
              </p>

              {/* 阅读进度 */}
              <div style={{ display: "flex", alignItems: "center", gap: rpx(24), zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: rpx(16) }}>
                  <BookOpen size={16} color="#A1A1A1" strokeWidth={1.5} />
                  <Headphones size={16} color="#A1A1A1" strokeWidth={1.5} />
                </div>
                
                {/* 极简进度条 */}
                <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.05)", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${percent}%`,
                      background: "#222",
                    }}
                  />
                </div>
                
                <span
                  style={{
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(20),
                    color: percent > 0 ? "#222" : "#A1A1A1",
                    letterSpacing: rpx(2),
                  }}
                >
                  {percent > 0 ? `已感知 ${percent}%` : "未翻阅"}
                </span>
              </div>
            </div>
          );
        })}

        {books.length === 0 && (
          <div
            style={{
              padding: `${rpx(160)} 0`,
              textAlign: "center",
              color: "#A1A1A1",
              fontSize: rpx(24),
              letterSpacing: rpx(4),
              fontFamily: FONT_SERIF,
            }}
          >
            无形之书，尚未落笔。
          </div>
        )}
      </div>

      <BottomNavigation active={1} onChange={handleNavChange} />

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}