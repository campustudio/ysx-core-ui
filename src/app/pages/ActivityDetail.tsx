/**
 * ActivityDetail - 活动详情页
 *
 * 承接首页「正在发生的光点」卡片的点击跳转
 * 古纸色底 + 琥珀金点缀 — 活动信息展示
 *
 * 内容结构：
 *   ① 封面图 + 返回 + 栏目标签（复用 DetailPageShell）
 *   ② 标题 + 状态标签
 *   ③ 活动信息卡片（类型 / 地点 / 时间 / 费用）
 *   ④ 简介
 *   ⑤ 活动亮点
 *   ⑥ 日程安排
 *   ⑦ 报名按钮（Toast 提示报名功能未实现）
 *
 * Props：
 *   - activityId: 活动 ID（对应 config/activities-data 中的 key）
 *   - onBack: 返回上一页
 */

import { useCallback } from "react";
import { MapPin, Calendar, Users, Ticket, Sparkles } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import { getActivityById } from "../config/activities-data";
import { DetailPageShell } from "../components/shared/DetailPageShell";
import { NotFoundFallback } from "../components/shared/NotFoundFallback";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

/** 状态标签色系 */
const STATUS_COLORS = {
  ongoing: { bg: "rgba(139,170,125,0.15)", text: "#4A6E42" },
  upcoming: { bg: "rgba(196,154,108,0.15)", text: "#A07D55" },
  ended: { bg: "rgba(58,48,40,0.08)", text: "var(--color-text-tertiary)" },
} as const;

/**
 * InfoRow - 活动信息行
 * 提取到模块级避免每次渲染创建新组件引用
 */
function InfoRow({ icon: Icon, label, value }: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start" style={{ gap: rpx(14) }}>
      <Icon
        style={{
          width: rpx(28),
          height: rpx(28),
          color: "var(--color-primary)",
          marginTop: rpx(2),
          flexShrink: 0,
        }}
        strokeWidth={1.5}
      />
      <div>
        <p style={{ fontSize: rpx(22), fontWeight: 400, color: "var(--color-text-tertiary)", margin: 0, lineHeight: 1.2 }}>
          {label}
        </p>
        <p style={{ fontSize: rpx(26), fontWeight: 400, color: "var(--color-text-primary)", margin: `${rpx(4)} 0 0 0`, lineHeight: 1.5 }}>
          {value}
        </p>
      </div>
    </div>
  );
}

interface Props {
  activityId: string;
  onBack?: () => void;
}

export function ActivityDetail({ activityId, onBack }: Props) {
  const activity = getActivityById(activityId);
  const toast = useToast();

  const handleBack = useCallback(() => onBack?.(), [onBack]);

  if (!activity) {
    return <NotFoundFallback message="活动正在筹备中" onBack={handleBack} />;
  }

  const statusStyle = STATUS_COLORS[activity.status];

  return (
    <DetailPageShell
      coverImage={activity.coverImage}
      coverAlt={activity.title}
      category="正在发生的光点"
      categoryColor="amber"
      onBack={handleBack}
    >
      {/* ── 标题 + 状态 ── */}
      <div className="flex items-start justify-between" style={{ gap: rpx(12) }}>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(42),
            fontWeight: 500,
            color: "var(--color-text-primary)",
            lineHeight: 1.45,
            letterSpacing: rpx(1),
            margin: 0,
            flex: 1,
          }}
        >
          {activity.title}
        </h1>
        <div
          style={{
            padding: `${rpx(6)} ${rpx(16)}`,
            borderRadius: rpx(16),
            background: statusStyle.bg,
            flexShrink: 0,
            marginTop: rpx(6),
          }}
        >
          <span style={{ fontSize: rpx(22), fontWeight: 500, color: statusStyle.text, lineHeight: 1 }}>
            {activity.statusLabel}
          </span>
        </div>
      </div>

      {/* ── 活动类型 ── */}
      <p
        style={{
          fontSize: rpx(24),
          fontWeight: 400,
          color: "var(--color-text-tertiary)",
          margin: `${rpx(8)} 0 ${rpx(28)} 0`,
          lineHeight: 1,
        }}
      >
        {activity.type}
      </p>

      {/* ── 信息卡片 ── */}
      <div
        style={{
          background: "rgba(196,154,108,0.06)",
          borderRadius: rpx(20),
          padding: `${rpx(24)} ${rpx(24)}`,
          marginBottom: rpx(32),
          boxShadow: "inset 0 0 0 1px rgba(196,154,108,0.08)",
        }}
      >
        <div className="flex flex-col" style={{ gap: rpx(20) }}>
          <InfoRow icon={MapPin} label="地点" value={activity.location} />
          <InfoRow icon={Calendar} label="时间" value={activity.date} />
          <InfoRow icon={Ticket} label="费用" value={activity.price} />
          <InfoRow icon={Users} label="名额" value={activity.participants} />
        </div>
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
        {activity.description}
      </p>

      {/* ── 活动亮点 ── */}
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
          活动亮点
        </h3>
        <div className="flex flex-col" style={{ gap: rpx(14) }}>
          {activity.highlights.map((h, i) => (
            <div key={i} className="flex items-start" style={{ gap: rpx(12) }}>
              <Sparkles
                style={{
                  width: rpx(22),
                  height: rpx(22),
                  color: "var(--color-primary)",
                  marginTop: rpx(4),
                  flexShrink: 0,
                }}
                strokeWidth={1.5}
              />
              <p
                style={{
                  fontSize: rpx(26),
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 日程安排 ── */}
      <div style={{ marginBottom: rpx(40) }}>
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
          日程安排
        </h3>
        <div className="flex flex-col" style={{ gap: rpx(4) }}>
          {activity.schedule.map((s, i) => (
            <div
              key={i}
              className="flex items-start"
              style={{
                padding: `${rpx(16)} ${rpx(20)}`,
                borderRadius: rpx(12),
                background: i % 2 === 0 ? "rgba(196,154,108,0.04)" : "transparent",
                gap: rpx(16),
              }}
            >
              <span
                style={{
                  fontSize: rpx(22),
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  minWidth: rpx(140),
                  lineHeight: 1.6,
                  flexShrink: 0,
                }}
              >
                {s.time}
              </span>
              <span
                style={{
                  fontSize: rpx(26),
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {s.content}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 报名按钮 ── */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => {
          toast.show("报名功能正在用心打磨中，敬请期待");
        }}
        style={{
          width: "100%",
          height: rpx(96),
          borderRadius: rpx(24),
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
          boxShadow: "0 4px 20px rgba(196,154,108,0.3)",
        }}
      >
        <span
          style={{
            fontSize: rpx(30),
            fontWeight: 500,
            color: "white",
            letterSpacing: rpx(4),
            lineHeight: 1,
          }}
        >
          {activity.ctaText}
        </span>
      </div>

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