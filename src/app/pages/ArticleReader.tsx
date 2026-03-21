/**
 * ArticleReader - 感知文章阅读页模板
 *
 * 承接首页「今日频率指南」和「明镜之声」卡片的点击跳转
 * 古纸色底 + 暖琥珀金点缀 — 沉浸式阅读体验
 *
 * 内容结构（从上到下）：
 *   ① 封面图 + 返回按钮 + 栏目标签（复用 DetailPageShell）
 *   ② 标题 + 作者 · 阅读时长
 *   ③ 正文（多段落类型：text / heading / quote / question / divider）
 *   ④ 文末微练习卡片（鼠尾草绿底）
 *
 * 段落渲染规则：
 *   text     → 正文段落，系统字体
 *   heading  → 小标题，宋体
 *   quote    → 金句/引述，左侧琥珀竖线
 *   question → 陪伴式提问，浅绿底圆角卡片
 *   divider  → 装饰分隔线（三点）
 *
 * Props:
 *   - articleId: 文章 ID（对应 config/articles-data 中的 key）
 *   - onBack: 返回上一页
 */

import { useCallback } from "react";
import { FONT_SERIF, rpx } from "../config/styles";
import { getArticleById } from "../config/articles-data";
import type { ArticleParagraph, MicroPractice } from "../config/articles-data";
import { DetailPageShell } from "../components/shared/DetailPageShell";
import { NotFoundFallback } from "../components/shared/NotFoundFallback";

// ═══════════════════════════════════════════════════
//  子组件
// ═══════════════════════════════════════════════════

/** 段落渲染器 — 按 type 分发不同样式 */
function ParagraphRenderer({ p }: { p: ArticleParagraph }) {
  switch (p.type) {
    /* ── 正文 ── */
    case "text":
      return (
        <p
          style={{
            fontSize: rpx(30),
            fontWeight: 400,
            color: "var(--color-text-primary)",
            lineHeight: 1.9,
            margin: 0,
          }}
        >
          {p.content}
        </p>
      );

    /* ── 小标题（宋体） ── */
    case "heading":
      return (
        <h3
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(34),
            fontWeight: 500,
            color: "var(--color-text-primary)",
            lineHeight: 1.5,
            margin: 0,
            paddingTop: rpx(8),
          }}
        >
          {p.content}
        </h3>
      );

    /* ── 金句/引述 — 左侧琥珀竖线 ── */
    case "quote":
      return (
        <blockquote
          style={{
            margin: 0,
            padding: `${rpx(16)} 0 ${rpx(16)} ${rpx(28)}`,
            borderLeft: `${rpx(4)} solid var(--color-primary)`,
            fontFamily: FONT_SERIF,
            fontSize: rpx(28),
            fontWeight: 400,
            color: "var(--color-primary-dark)",
            lineHeight: 1.8,
          }}
        >
          {p.content}
        </blockquote>
      );

    /* ── 陪伴式提问 — 浅绿底圆角卡片 ── */
    case "question":
      return (
        <div
          style={{
            background: "rgba(139,170,125,0.08)",
            borderRadius: rpx(16),
            padding: `${rpx(24)} ${rpx(28)}`,
            boxShadow: "inset 0 0 0 1px rgba(139,170,125,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(28),
              fontWeight: 400,
              color: "#4A6E42",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {p.content}
          </p>
        </div>
      );

    /* ── 装饰分隔线（三点） ── */
    case "divider":
      return (
        <div
          className="flex items-center justify-center"
          style={{ gap: rpx(12), padding: `${rpx(8)} 0` }}
        >
          <div
            style={{
              width: rpx(40),
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(196,154,108,0.35))",
            }}
          />
          <div
            style={{
              width: rpx(5),
              height: rpx(5),
              borderRadius: "50%",
              background: "rgba(196,154,108,0.4)",
            }}
          />
          <div
            style={{
              width: rpx(40),
              height: "1px",
              background:
                "linear-gradient(to left, transparent, rgba(196,154,108,0.35))",
            }}
          />
        </div>
      );

    default:
      return null;
  }
}

/** 微练习卡片 */
function PracticeCard({ practice }: { practice: MicroPractice }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, rgba(139,170,125,0.1) 0%, rgba(139,170,125,0.04) 100%)",
        borderRadius: rpx(20),
        padding: `${rpx(32)} ${rpx(28)}`,
        boxShadow:
          "0 2px 16px rgba(139,170,125,0.06), inset 0 0 0 1px rgba(139,170,125,0.08)",
      }}
    >
      {/* 标签 + 时长 */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: rpx(20) }}
      >
        <div
          className="flex items-center"
          style={{ gap: rpx(10) }}
        >
          {/* 绿色小圆点 */}
          <div
            style={{
              width: rpx(8),
              height: rpx(8),
              borderRadius: "50%",
              background: "var(--color-secondary)",
            }}
          />
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(26),
              fontWeight: 500,
              color: "#4A6E42",
              lineHeight: 1,
            }}
          >
            微练习
          </span>
        </div>
        <span
          style={{
            fontSize: rpx(22),
            fontWeight: 400,
            color: "rgba(74,110,66,0.55)",
            lineHeight: 1,
          }}
        >
          {practice.duration}
        </span>
      </div>

      {/* 练习标题 */}
      <h4
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(30),
          fontWeight: 500,
          color: "var(--color-text-primary)",
          lineHeight: 1.4,
          margin: `0 0 ${rpx(20)} 0`,
        }}
      >
        {practice.title}
      </h4>

      {/* 步骤 */}
      <div className="flex flex-col" style={{ gap: rpx(14) }}>
        {practice.steps.map((step, i) => (
          <div
            key={i}
            className="flex items-start"
            style={{ gap: rpx(12) }}
          >
            {/* 步骤序号 */}
            <span
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: rpx(32),
                height: rpx(32),
                borderRadius: "50%",
                background: "rgba(139,170,125,0.12)",
                fontFamily: FONT_SERIF,
                fontSize: rpx(20),
                fontWeight: 500,
                color: "#5E8A52",
                lineHeight: 1,
                marginTop: rpx(6),
              }}
            >
              {i + 1}
            </span>
            <p
              style={{
                fontSize: rpx(26),
                fontWeight: 400,
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  主组件
// ═══════════════════════════════════════════════════

interface Props {
  /** 文章 ID */
  articleId: string;
  /** 返回上一页 */
  onBack?: () => void;
}

export function ArticleReader({ articleId, onBack }: Props) {
  const article = getArticleById(articleId);

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  /* ── 文章不存在 → 降级（复用 NotFoundFallback） ── */
  if (!article) {
    return <NotFoundFallback message="文章正在路上" onBack={handleBack} />;
  }

  return (
    <DetailPageShell
      coverImage={article.coverImage}
      coverAlt={article.title}
      category={article.category}
      categoryColor={article.categoryColor}
      onBack={handleBack}
    >
      {/* 标题 */}
      <h1
        style={{
          fontFamily: FONT_SERIF,
          fontSize: rpx(42),
          fontWeight: 500,
          color: "var(--color-text-primary)",
          lineHeight: 1.45,
          letterSpacing: rpx(1),
          margin: 0,
        }}
      >
        {article.title}
      </h1>

      {/* 作者 · 阅读时长 */}
      <div
        className="flex items-center"
        style={{
          gap: rpx(8),
          marginTop: rpx(16),
          marginBottom: rpx(40),
        }}
      >
        <span
          style={{
            fontSize: rpx(24),
            fontWeight: 400,
            color: "var(--color-text-tertiary)",
            lineHeight: 1,
          }}
        >
          {article.author.name}
        </span>
        <span
          style={{
            fontSize: rpx(24),
            color: "var(--color-text-tertiary)",
            lineHeight: 1,
          }}
        >
          ·
        </span>
        <span
          style={{
            fontSize: rpx(24),
            fontWeight: 400,
            color: "var(--color-text-tertiary)",
            lineHeight: 1,
          }}
        >
          {article.readTime}
        </span>
      </div>

      {/* ── 正文段落 ── */}
      <div className="flex flex-col" style={{ gap: rpx(28) }}>
        {article.paragraphs.map((p, i) => (
          <ParagraphRenderer key={i} p={p} />
        ))}
      </div>

      {/* ── 微练习 ── */}
      {article.practice && (
        <div style={{ marginTop: rpx(48) }}>
          <PracticeCard practice={article.practice} />
        </div>
      )}
    </DetailPageShell>
  );
}