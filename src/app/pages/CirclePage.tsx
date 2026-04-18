/**
 * CirclePage - 感知圈 · 同频相遇
 *
 * 基于第五卷第二章"当第二个同频者出现"设计
 *
 * 核心理念：
 * - 同频识别：基于生命状态/践行阶段的同频者匹配
 * - 彼此照见：支持真实表达和相互映照
 * - 共振 vs 抱团：基于生命质量的相认，不是观点一致
 *
 * 设计原则：
 * - "在"优先于"做"
 * - "照见"优先于"教导"
 * - "送回现实"优先于"留在线上"
 */

import { useState, useEffect } from "react";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import {
  PageHeader,
  PAGE_HEADER_HEIGHT,
} from "../components/shared/PageHeader";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

// ─── 主题（透明镜碑 · 纯净冷白 · 冷琥珀点缀） ────────────────────────────────────────────
// 基于ui-implementation-plan.md：
// - 透明镜碑的视觉隐喻
// - 纯净冷白 + 极少量冷琥珀色点缀
// - 碑面刻字感的排版
const THEME = {
  bg: "#FAFAFA", // 纯净冷白
  surface: "#FFFFFF",
  textPrimary: "#1A1A1A", // 碑刻黑
  textSecondary: "#666666",
  textTertiary: "#999999",
  accent: "#8B7355", // 冷琥珀色（偏灰冷调，区别于暖琥珀金#C49A6C）
  border: "rgba(0,0,0,0.06)",
} as const;

// ─── 同频者数据（基于践行阶段匹配） ────────────────────────────────────────────
interface ResonantSoul {
  id: string;
  name: string;
  stage: string; // 践行阶段
  resonancePoint: string; // 共振点
  isConnected?: boolean;
}

const RESONANT_SOULS: ResonantSoul[] = [
  {
    id: "rs1",
    name: "静观者",
    stage: "阶段二 · 内在深层",
    resonancePoint: "正在探索：与身体重新连接",
  },
  {
    id: "rs2",
    name: "觉醒之光",
    stage: "阶段二 · 内在深层",
    resonancePoint: "正在探索：看见念头与情绪的源层",
  },
];

// ─── 附近活动数据 ────────────────────────────────────────────
interface NearbyEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  participants: number;
  description: string;
}

const NEARBY_EVENTS: NearbyEvent[] = [
  {
    id: "evt1",
    title: "晨间冥想共修",
    location: "杭州西湖 · 曲院风荷",
    date: "4月20日",
    time: "06:30",
    participants: 8,
    description: "在湖畔晨光中，一起进入当下的宁静。",
  },
  {
    id: "evt2",
    title: "感知日记分享会",
    location: "上海静安 · 茶语空间",
    date: "4月22日",
    time: "14:00",
    participants: 12,
    description: "分享你的感知日记片段，聆听他人的内在旅程。",
  },
];

interface CirclePageProps {
  onBack?: () => void;
}

export function CirclePage({ onBack }: CirclePageProps) {
  const [souls, setSouls] = useState(RESONANT_SOULS);
  const [selectedEvent, setSelectedEvent] = useState<NearbyEvent | null>(null);
  const [showConnectDialog, setShowConnectDialog] =
    useState<ResonantSoul | null>(null);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 发起连接
  const handleConnect = (soul: ResonantSoul) => {
    setShowConnectDialog(soul);
  };

  // 确认连接
  const confirmConnect = () => {
    if (showConnectDialog) {
      setSouls((prev) =>
        prev.map((s) =>
          s.id === showConnectDialog.id ? { ...s, isConnected: true } : s,
        ),
      );
      toast.show("连接已发送，等待对方回应");
      setShowConnectDialog(null);
    }
  };

  // ── 活动详情视图 ──
  if (selectedEvent) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: THEME.bg }}>
        <PageHeader onBack={() => setSelectedEvent(null)} />
        <div style={{ paddingTop: PAGE_HEADER_HEIGHT }} />

        <div style={{ padding: `${rpx(24)} ${rpx(40)}` }}>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(36),
              fontWeight: 500,
              color: THEME.textPrimary,
              margin: 0,
              letterSpacing: rpx(2),
            }}
          >
            {selectedEvent.title}
          </h1>

          <div style={{ marginTop: rpx(32) }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(12),
                marginBottom: rpx(16),
              }}
            >
              <Calendar
                size={16}
                color={THEME.textSecondary}
                strokeWidth={1.5}
              />
              <span style={{ fontSize: rpx(22), color: THEME.textSecondary }}>
                {selectedEvent.date} · {selectedEvent.time}
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: rpx(12) }}
            >
              <MapPin size={16} color={THEME.textSecondary} strokeWidth={1.5} />
              <span style={{ fontSize: rpx(22), color: THEME.textSecondary }}>
                {selectedEvent.location}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: rpx(40),
              paddingTop: rpx(32),
              borderTop: `1px solid ${THEME.border}`,
            }}
          >
            <p
              style={{
                fontSize: rpx(24),
                color: THEME.textPrimary,
                lineHeight: 1.8,
              }}
            >
              {selectedEvent.description}
            </p>
          </div>

          <div
            style={{
              marginTop: rpx(32),
              color: THEME.textTertiary,
              fontSize: rpx(20),
            }}
          >
            {selectedEvent.participants} 人已报名
          </div>

          <button
            style={{
              width: "100%",
              padding: `${rpx(18)} 0`,
              marginTop: rpx(48),
              background: THEME.accent,
              color: "#fff",
              fontSize: rpx(22),
              fontWeight: 500,
              border: "none",
              borderRadius: rpx(8),
              cursor: "pointer",
              letterSpacing: rpx(4),
            }}
            onClick={() => toast.show("报名功能即将开放")}
          >
            我要参加
          </button>
        </div>

        <Toast
          message={toast.message}
          visible={toast.visible}
          duration={toast.duration}
          onDismiss={toast.dismiss}
        />
      </div>
    );
  }

  // ── 主页面 ──
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: THEME.bg }}>
      <PageHeader onBack={onBack} />
      <div style={{ paddingTop: PAGE_HEADER_HEIGHT }} />

      {/* 页面标题 */}
      <div style={{ padding: `${rpx(24)} ${rpx(40)} ${rpx(40)}` }}>
        <h1
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(44),
            fontWeight: 500,
            color: THEME.textPrimary,
            margin: 0,
            letterSpacing: rpx(6),
          }}
        >
          感知圈
        </h1>
        <p
          style={{
            fontSize: rpx(20),
            color: THEME.textTertiary,
            marginTop: rpx(12),
            letterSpacing: rpx(2),
          }}
        >
          在践行中相遇，彼此照见
        </p>
      </div>

      {/* ═══ 同频者 ═══ */}
      <div style={{ padding: `0 ${rpx(40)} ${rpx(40)}` }}>
        <h2
          style={{
            fontSize: rpx(20),
            fontWeight: 500,
            color: THEME.textTertiary,
            margin: `0 0 ${rpx(20)}`,
            letterSpacing: rpx(4),
          }}
        >
          同频者
        </h2>

        {souls.map((soul) => (
          <div
            key={soul.id}
            style={{
              background: THEME.surface,
              borderRadius: rpx(12),
              padding: rpx(24),
              marginBottom: rpx(16),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: rpx(12) }}
              >
                <span
                  style={{
                    fontSize: rpx(26),
                    fontWeight: 500,
                    color: THEME.textPrimary,
                    letterSpacing: rpx(2),
                  }}
                >
                  {soul.name}
                </span>
                <span
                  style={{
                    fontSize: rpx(16),
                    color: THEME.textTertiary,
                    padding: `${rpx(4)} ${rpx(10)}`,
                    background: "rgba(0,0,0,0.03)",
                    borderRadius: rpx(4),
                  }}
                >
                  {soul.stage}
                </span>
              </div>
              <p
                style={{
                  fontSize: rpx(20),
                  color: THEME.textSecondary,
                  margin: `${rpx(10)} 0 0`,
                }}
              >
                {soul.resonancePoint}
              </p>
            </div>

            <button
              style={{
                padding: `${rpx(12)} ${rpx(24)}`,
                background: soul.isConnected ? "transparent" : THEME.accent,
                color: soul.isConnected ? THEME.textTertiary : "#fff",
                fontSize: rpx(20),
                border: soul.isConnected ? `1px solid ${THEME.border}` : "none",
                borderRadius: rpx(6),
                cursor: soul.isConnected ? "default" : "pointer",
                letterSpacing: rpx(2),
              }}
              onClick={() => !soul.isConnected && handleConnect(soul)}
              disabled={soul.isConnected}
            >
              {soul.isConnected ? "已发送" : "连接"}
            </button>
          </div>
        ))}
      </div>

      {/* ═══ 附近 ═══ */}
      <div style={{ padding: `0 ${rpx(40)} ${rpx(60)}` }}>
        <h2
          style={{
            fontSize: rpx(20),
            fontWeight: 500,
            color: THEME.textTertiary,
            margin: `0 0 ${rpx(20)}`,
            letterSpacing: rpx(4),
          }}
        >
          附近
        </h2>

        {NEARBY_EVENTS.map((event) => (
          <div
            key={event.id}
            style={{
              background: THEME.surface,
              borderRadius: rpx(12),
              padding: rpx(24),
              marginBottom: rpx(16),
              cursor: "pointer",
            }}
            onClick={() => setSelectedEvent(event)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  fontSize: rpx(24),
                  fontWeight: 500,
                  color: THEME.textPrimary,
                  margin: 0,
                  letterSpacing: rpx(1),
                }}
              >
                {event.title}
              </h3>
              <ChevronRight
                size={18}
                color={THEME.textTertiary}
                strokeWidth={1.5}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: rpx(16),
                marginTop: rpx(14),
                color: THEME.textTertiary,
                fontSize: rpx(18),
              }}
            >
              <span>
                {event.date} · {event.time}
              </span>
              <span>·</span>
              <span>{event.location}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 连接确认弹框 ═══ */}
      {showConnectDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: rpx(40),
          }}
          onClick={() => setShowConnectDialog(null)}
        >
          <div
            style={{
              background: THEME.surface,
              borderRadius: rpx(16),
              padding: rpx(36),
              width: "100%",
              maxWidth: rpx(500),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(28),
                fontWeight: 500,
                color: THEME.textPrimary,
                margin: 0,
                textAlign: "center",
                letterSpacing: rpx(2),
              }}
            >
              发起连接
            </h3>
            <p
              style={{
                fontSize: rpx(22),
                color: THEME.textSecondary,
                marginTop: rpx(20),
                textAlign: "center",
                lineHeight: 1.8,
              }}
            >
              向「{showConnectDialog.name}」发起连接邀请？
              <br />
              <span style={{ fontSize: rpx(18), color: THEME.textTertiary }}>
                连接后，你们可以在践行中彼此照见
              </span>
            </p>

            <div style={{ display: "flex", gap: rpx(16), marginTop: rpx(32) }}>
              <button
                style={{
                  flex: 1,
                  padding: `${rpx(16)} 0`,
                  background: "transparent",
                  color: THEME.textSecondary,
                  fontSize: rpx(22),
                  border: `1px solid ${THEME.border}`,
                  borderRadius: rpx(8),
                  cursor: "pointer",
                }}
                onClick={() => setShowConnectDialog(null)}
              >
                再想想
              </button>
              <button
                style={{
                  flex: 1,
                  padding: `${rpx(16)} 0`,
                  background: THEME.accent,
                  color: "#fff",
                  fontSize: rpx(22),
                  border: "none",
                  borderRadius: rpx(8),
                  cursor: "pointer",
                  letterSpacing: rpx(2),
                }}
                onClick={confirmConnect}
              >
                连接
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={toast.duration}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
