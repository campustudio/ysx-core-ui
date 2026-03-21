/**
 * PodcastDetail - 播客/故事详情页
 *
 * 承接首页「同行者的声音」卡片的点击跳转
 * 古纸色底 + 温暖排版 — 用户真实故事展示
 *
 * 内容结构：
 *   ① 封面图 + 返回 + 栏目标签（复用 DetailPageShell）
 *   ② 标题 + 分享者信息 + 时长
 *   ③ 简介
 *   ④ 章节列表（可点击，Toast 提示章节跳转未实现）
 *   ⑤ 金句摘录
 *
 * 交互状态：
 *   播放按钮 → Toast「播放功能正在用心打磨中」
 *   章节条目 → Toast「章节跳转功能正在用心打磨中」
 *
 * Props：
 *   - podcastId: 播客 ID（对应 config/podcasts-data 中的 key）
 *   - onBack: 返回上一页
 */

import { useCallback } from "react";
import { Play, Clock, Headphones, User } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import { getPodcastById } from "../config/podcasts-data";
import { DetailPageShell } from "../components/shared/DetailPageShell";
import { NotFoundFallback } from "../components/shared/NotFoundFallback";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

interface Props {
  podcastId: string;
  onBack?: () => void;
}

export function PodcastDetail({ podcastId, onBack }: Props) {
  const podcast = getPodcastById(podcastId);
  const toast = useToast();

  const handleBack = useCallback(() => onBack?.(), [onBack]);

  if (!podcast) {
    return <NotFoundFallback message="内容正在路上" onBack={handleBack} />;
  }

  return (
    <DetailPageShell
      coverImage={podcast.coverImage}
      coverAlt={podcast.title}
      category={podcast.category}
      categoryColor="sage"
      onBack={handleBack}
    >
      {/* ── 标题 ── */}
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
        {podcast.title}
      </h1>

      {/* ── 分享者信息 ── */}
      <div className="flex items-center" style={{ gap: rpx(12), marginTop: rpx(16) }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: rpx(40),
            height: rpx(40),
            borderRadius: "50%",
            background: "rgba(139,170,125,0.12)",
          }}
        >
          <User style={{ width: rpx(20), height: rpx(20), color: "#5E8A52" }} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontSize: rpx(26), fontWeight: 500, color: "var(--color-text-primary)", margin: 0, lineHeight: 1.3 }}>
            {podcast.author.name}
          </p>
          <p style={{ fontSize: rpx(22), fontWeight: 400, color: "var(--color-text-tertiary)", margin: 0, lineHeight: 1.3 }}>
            {podcast.author.role}
          </p>
        </div>
      </div>

      {/* ── 时长 + 类型标签 ── */}
      <div className="flex items-center" style={{ gap: rpx(16), marginTop: rpx(20), marginBottom: rpx(32) }}>
        <div className="flex items-center" style={{ gap: rpx(6) }}>
          <Clock style={{ width: rpx(24), height: rpx(24), color: "var(--color-text-tertiary)" }} strokeWidth={1.5} />
          <span style={{ fontSize: rpx(24), fontWeight: 400, color: "var(--color-text-tertiary)", lineHeight: 1 }}>
            {podcast.duration}
          </span>
        </div>
        <div className="flex items-center" style={{ gap: rpx(6) }}>
          <Headphones style={{ width: rpx(24), height: rpx(24), color: "var(--color-text-tertiary)" }} strokeWidth={1.5} />
          <span style={{ fontSize: rpx(24), fontWeight: 400, color: "var(--color-text-tertiary)", lineHeight: 1 }}>
            音频故事
          </span>
        </div>
      </div>

      {/* ── 播放按钮（预留） ── */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => toast.show("播放功能正在用心打磨中，敬请期待")}
        style={{
          width: "100%",
          height: rpx(88),
          borderRadius: rpx(20),
          background: "linear-gradient(135deg, #6B8F63 0%, #8BAA7D 100%)",
          boxShadow: "0 4px 20px rgba(107,143,99,0.25)",
          gap: rpx(12),
          marginBottom: rpx(36),
        }}
      >
        <Play style={{ width: rpx(28), height: rpx(28), color: "white", fill: "white" }} />
        <span style={{ fontSize: rpx(28), fontWeight: 500, color: "white", letterSpacing: rpx(2), lineHeight: 1 }}>
          播放
        </span>
      </div>

      {/* ── 简介 ── */}
      <p
        style={{
          fontSize: rpx(28),
          fontWeight: 400,
          color: "var(--color-text-secondary)",
          lineHeight: 1.9,
          margin: `0 0 ${rpx(36)} 0`,
        }}
      >
        {podcast.description}
      </p>

      {/* ── 章节列表 ── */}
      <div style={{ marginBottom: rpx(36) }}>
        <h3
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(32),
            fontWeight: 500,
            color: "var(--color-text-primary)",
            margin: `0 0 ${rpx(20)} 0`,
            lineHeight: 1.4,
          }}
        >
          章节
        </h3>
        <div className="flex flex-col" style={{ gap: rpx(4) }}>
          {podcast.chapters.map((ch, i) => (
            <div
              key={i}
              className="flex items-center cursor-pointer"
              onClick={() => toast.show("章节跳转功能正在用心打磨中，敬请期待")}
              style={{
                padding: `${rpx(18)} ${rpx(20)}`,
                borderRadius: rpx(12),
                background: i === 0 ? "rgba(139,170,125,0.06)" : "transparent",
                gap: rpx(16),
              }}
            >
              <span
                style={{
                  fontSize: rpx(22),
                  fontWeight: 400,
                  color: "var(--color-text-tertiary)",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: rpx(80),
                  lineHeight: 1,
                }}
              >
                {ch.time}
              </span>
              <span
                style={{
                  fontSize: rpx(26),
                  fontWeight: 400,
                  color: i === 0 ? "#5E8A52" : "var(--color-text-primary)",
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {ch.title}
              </span>
              {i === 0 && (
                <Play
                  style={{
                    width: rpx(20),
                    height: rpx(20),
                    color: "#5E8A52",
                    fill: "#5E8A52",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 金句摘录 ── */}
      {podcast.highlights.length > 0 && (
        <div>
          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(32),
              fontWeight: 500,
              color: "var(--color-text-primary)",
              margin: `0 0 ${rpx(20)} 0`,
              lineHeight: 1.4,
            }}
          >
            金句摘录
          </h3>
          <div className="flex flex-col" style={{ gap: rpx(20) }}>
            {podcast.highlights.map((h, i) => (
              <blockquote
                key={i}
                style={{
                  margin: 0,
                  padding: `${rpx(16)} 0 ${rpx(16)} ${rpx(28)}`,
                  borderLeft: `${rpx(4)} solid var(--color-secondary)`,
                  fontFamily: FONT_SERIF,
                  fontSize: rpx(26),
                  fontWeight: 400,
                  color: "#4A6E42",
                  lineHeight: 1.8,
                }}
              >
                {h}
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Toast 温柔提示 */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={toast.duration}
        onDismiss={toast.dismiss}
      />
    </DetailPageShell>
  );
}