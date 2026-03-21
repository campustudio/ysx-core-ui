/**
 * CirclePage - 新人生之路圈子 · 社区
 *
 * 参照小鹅通「新人生之路圈子」的交互体验
 *
 * 布局（上→下）：
 *   ① 顶部栏（返回 + 标题）
 *   ② 圈子信息头部（封面、名称、简介、统计、排行榜入口）
 *   ③ 官方公告条
 *   ④ 功能导航（课程/成员/更多/我的）
 *   ⑤ 内容分类 Tab（全部/精选/圈主/问答/官方通告/闭关·元振动）
 *   ⑥ 帖子列表（Feed 流，含点赞用户名、热门评论、用户等级）
 *   ⑦ 发帖浮动按钮（fixed 不跟随滚动 → 点击弹出底部菜单）
 *
 * 底部菜单选项：
 *   - 发动态：分享你的日常/学习心得/奇思妙想
 *   - 去提问（暂不实现，先隐藏或 Toast）
 *
 * 发表动态页：
 *   文本输入区 + 底部工具栏（# 标签 / 图片 / 视频 / 表情 / 更多）+ 发送按钮
 */

import { useState, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  Users,
  LayoutGrid,
  CircleUser,
  ThumbsUp,
  MessageSquare,
  Share2,
  Pencil,
  Megaphone,
  ChevronRight,
  Hash,
  ImageIcon,
  Film,
  Smile,
  PlusCircle,
  X,
  ChevronDown,
} from "lucide-react";
import {
  CIRCLE_INFO,
  CIRCLE_TABS,
  CIRCLE_NAV,
  CIRCLE_POSTS,
  QA_EXPERTS,
  getPostsByCategory,
  getRoleBadge,
  getRoleBadgeColor,
  type CirclePost,
} from "../config/newlife-data";
import { FONT_SERIF, rpx } from "../config/styles";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";

// ─── 主题 ────────────────────────────────────────────

const THEME = {
  bg: "#FFFFFF",
  surface: "#F9F8F5",
  textPrimary: "#2C2417",
  textSecondary: "#7A7062",
  textTertiary: "#B0A89C",
  accent: "#C49A6C",
  accentLight: "rgba(196,154,108,0.1)",
  sage: "#8BAA7D",
  border: "rgba(196,154,108,0.08)",
  headerBg: "#A07D55",
  link: "#5B8ACF",
} as const;

const NAV_ICONS = {
  FileText,
  Users,
  LayoutGrid,
  CircleUser,
} as Record<
  string,
  React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    style?: React.CSSProperties;
  }>
>;

interface CirclePageProps {
  onBack?: () => void;
}

export function CirclePage({ onBack }: CirclePageProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<CirclePost[]>(CIRCLE_POSTS);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeTag, setComposeTag] = useState("");
  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setPosts(getPostsByCategory(tabId));
  }, []);

  const handleNavItem = useCallback(
    (navId: string) => {
      const labels: Record<string, string> = {
        course: "课程",
        members: "成员",
        more: "更多",
        mine: "我的",
      };
      toast.show(`「${labels[navId]}」功能正在用心打磨中，敬请期待`);
    },
    [toast]
  );

  const handleFloatingClick = useCallback(() => {
    setShowPostMenu(true);
  }, []);

  const handleComposeOpen = useCallback(() => {
    setShowPostMenu(false);
    setShowCompose(true);
  }, []);

  const handleComposeClose = useCallback(() => {
    setShowCompose(false);
    setComposeText("");
    setComposeTag("");
  }, []);

  const handleComposeSend = useCallback(() => {
    if (!composeText.trim()) {
      toast.show("请输入内容");
      return;
    }
    toast.show("动态已发送（模拟）");
    setShowCompose(false);
    setComposeText("");
    setComposeTag("");
  }, [composeText, toast]);

  const handlePostAction = useCallback(
    (action: string) => {
      toast.show(`${action}功能正在用心打磨中`);
    },
    [toast]
  );

  // 问答 Tab 的答主列表
  const showQAExperts = activeTab === "qa";

  // ── 发表动态全屏页 ──
  if (showCompose) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: THEME.bg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 顶部栏 */}
        <div
          className="flex-shrink-0 flex items-center justify-between"
          style={{
            paddingTop: `max(${rpx(24)}, env(safe-area-inset-top))`,
            padding: `max(${rpx(24)}, env(safe-area-inset-top)) ${rpx(28)} ${rpx(8)}`,
          }}
        >
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(64),
              height: rpx(64),
              border: "none",
              background: "transparent",
            }}
            onClick={handleComposeClose}
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              style={{ color: THEME.textPrimary }}
            />
          </button>
          <span
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "var(--font-size-lg)",
              color: THEME.textPrimary,
            }}
          >
            发表动态
          </span>
          <div style={{ width: rpx(64) }} />
        </div>

        {/* 输入区 */}
        <div className="flex-1" style={{ padding: `0 ${rpx(36)}` }}>
          <textarea
            placeholder="说点什么"
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "var(--font-size-base)",
              color: THEME.textPrimary,
              lineHeight: 1.8,
              background: "transparent",
            }}
          />
        </div>

        {/* 底部工具栏 */}
        <div
          className="flex-shrink-0"
          style={{
            borderTop: `1px solid ${THEME.border}`,
            paddingBottom: `max(${rpx(16)}, env(safe-area-inset-bottom))`,
          }}
        >
          {/* 标签输入行 */}
          {composeTag ? (
            <div
              className="flex items-center"
              style={{
                padding: `${rpx(12)} ${rpx(36)}`,
                gap: rpx(8),
              }}
            >
              <span
                style={{ fontSize: rpx(24), color: THEME.link }}
              >
                #{composeTag}
              </span>
              <button
                className="cursor-pointer"
                style={{ border: "none", background: "none" }}
                onClick={() => setComposeTag("")}
              >
                <X
                  size={14}
                  strokeWidth={1.5}
                  style={{ color: THEME.textTertiary }}
                />
              </button>
            </div>
          ) : (
            <button
              className="cursor-pointer flex items-center"
              style={{
                padding: `${rpx(12)} ${rpx(36)}`,
                gap: rpx(6),
                border: "none",
                background: "none",
                fontSize: rpx(24),
                color: THEME.textTertiary,
              }}
              onClick={() => setComposeTag("元振动分享")}
            >
              <Hash size={14} strokeWidth={1.5} />
              添加标签
            </button>
          )}

          {/* 工具图标行 */}
          <div
            className="flex items-center justify-between"
            style={{ padding: `${rpx(8)} ${rpx(36)}` }}
          >
            <div className="flex items-center" style={{ gap: rpx(28) }}>
              {[
                { icon: ImageIcon, label: "图片" },
                { icon: Film, label: "视频" },
                { icon: Smile, label: "表情" },
                { icon: PlusCircle, label: "更多" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="cursor-pointer"
                  style={{ border: "none", background: "none" }}
                  onClick={() => toast.show(`${label}功能正在用心打磨中`)}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.3}
                    style={{ color: THEME.textSecondary }}
                  />
                </button>
              ))}
            </div>

            <button
              className="cursor-pointer"
              style={{
                padding: `${rpx(10)} ${rpx(32)}`,
                borderRadius: rpx(20),
                border: "none",
                background:
                  composeText.trim() ? THEME.accent : THEME.border,
                color: composeText.trim() ? "#fff" : THEME.textTertiary,
                fontSize: "var(--font-size-xs)",
              }}
              onClick={handleComposeSend}
            >
              发送
            </button>
          </div>
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

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: THEME.surface,
      }}
    >
      {/* ═══ 顶部栏 ═══ */}
      <div
        style={{
          background: THEME.bg,
          paddingTop: `max(${rpx(24)}, env(safe-area-inset-top))`,
        }}
      >
        <div
          className="flex items-center"
          style={{
            padding: `${rpx(16)} ${rpx(28)}`,
            gap: rpx(16),
          }}
        >
          <button
            className="cursor-pointer flex items-center justify-center"
            style={{
              width: rpx(64),
              height: rpx(64),
              borderRadius: "50%",
              background: "transparent",
              border: "none",
            }}
            onClick={onBack}
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              style={{ color: THEME.textPrimary }}
            />
          </button>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: "var(--font-size-lg)",
              color: THEME.textPrimary,
              margin: 0,
              flex: 1,
              textAlign: "center",
            }}
          >
            新人生之路圈子
          </h1>
          <div style={{ width: rpx(64) }} />
        </div>
      </div>

      {/* ═══ 圈子信息头部 ═══ */}
      <div
        style={{
          background: THEME.headerBg,
          padding: `${rpx(24)} ${rpx(36)} ${rpx(20)}`,
        }}
      >
        <div className="flex" style={{ gap: rpx(16) }}>
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{
              width: rpx(100),
              height: rpx(100),
              borderRadius: rpx(12),
              boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <ImageWithFallback
              src={CIRCLE_INFO.cover}
              alt={CIRCLE_INFO.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <h2
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "var(--font-size-lg)",
                color: "#fff",
                margin: 0,
              }}
            >
              {CIRCLE_INFO.name}
            </h2>
            <p
              style={{
                fontSize: rpx(22),
                color: "rgba(255,255,255,0.75)",
                margin: `${rpx(6)} 0 0`,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {CIRCLE_INFO.description}
            </p>
            {/* 统计 + 排行榜入口 */}
            <div
              className="flex items-center justify-between"
              style={{
                marginTop: rpx(10),
              }}
            >
              <div
                className="flex items-center"
                style={{
                  gap: rpx(12),
                  fontSize: rpx(22),
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <span>{CIRCLE_INFO.postCount} 动态</span>
                <span>|</span>
                <span
                  className="cursor-pointer flex items-center"
                  style={{ gap: rpx(4) }}
                  onClick={() =>
                    toast.show("成员列表正在用心打磨中，敬请期待")
                  }
                >
                  {CIRCLE_INFO.memberCount} 成员
                  <ChevronRight size={12} strokeWidth={1.5} />
                </span>
              </div>
              <div
                className="cursor-pointer flex items-center"
                style={{
                  gap: rpx(4),
                  fontSize: rpx(22),
                  color: "rgba(255,255,255,0.8)",
                }}
                onClick={() =>
                  toast.show("排行榜正在用心打磨中，敬请期待")
                }
              >
                排行榜
                <ChevronRight size={12} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 官方公告条 ═══ */}
      <div
        style={{
          background: THEME.headerBg,
          padding: `0 ${rpx(36)} ${rpx(20)}`,
        }}
      >
        <div
          className="flex items-center"
          style={{
            padding: `${rpx(12)} ${rpx(20)}`,
            borderRadius: rpx(12),
            background: "rgba(255,255,255,0.12)",
            gap: rpx(8),
          }}
        >
          <Megaphone
            size={14}
            strokeWidth={1.5}
            style={{
              color: "rgba(255,255,255,0.8)",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: rpx(22),
              color: "rgba(255,255,255,0.85)",
              margin: 0,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            #官方公告 {CIRCLE_INFO.announcement}
          </p>
        </div>
      </div>

      {/* ═══ 功能导航 ═══ */}
      <div
        style={{
          background: THEME.bg,
          padding: `${rpx(20)} ${rpx(36)}`,
          borderBottom: `1px solid ${THEME.border}`,
        }}
      >
        <div className="flex justify-around">
          {CIRCLE_NAV.map((nav) => {
            const Icon = NAV_ICONS[nav.icon];
            return (
              <button
                key={nav.id}
                className="cursor-pointer flex flex-col items-center"
                style={{
                  border: "none",
                  background: "none",
                  gap: rpx(6),
                }}
                onClick={() => handleNavItem(nav.id)}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: rpx(56),
                    height: rpx(56),
                    borderRadius: "50%",
                    background: THEME.accentLight,
                  }}
                >
                  {Icon && (
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      style={{ color: THEME.accent }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: rpx(20),
                    color: THEME.textSecondary,
                  }}
                >
                  {nav.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 内容分类 Tab ═══ */}
      <div
        style={{
          background: THEME.bg,
          padding: `${rpx(4)} ${rpx(24)}`,
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: `1px solid ${THEME.border}`,
        }}
      >
        <div
          className="flex"
          style={{
            gap: rpx(4),
            overflowX: "auto",
          }}
        >
          {CIRCLE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className="cursor-pointer flex-shrink-0"
                style={{
                  padding: `${rpx(14)} ${rpx(14)}`,
                  border: "none",
                  background: "none",
                  fontSize: "var(--font-size-xs)",
                  color: isActive ? THEME.textPrimary : THEME.textTertiary,
                  position: "relative",
                  transition: "color 0.2s ease",
                }}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
                {isActive && (
                  <div
                    className="absolute"
                    style={{
                      bottom: rpx(2),
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: rpx(24),
                      height: rpx(3),
                      borderRadius: rpx(2),
                      background: THEME.textPrimary,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 问答答主（仅问答 Tab） ═══ */}
      {showQAExperts && (
        <div
          style={{
            background: THEME.bg,
            padding: `${rpx(20)} ${rpx(36)}`,
            borderBottom: `1px solid ${THEME.border}`,
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: rpx(12) }}
          >
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: THEME.accent,
              }}
            >
              向TA提问
            </span>
          </div>
          {QA_EXPERTS.map((expert) => {
            const badge = getRoleBadge(expert.role);
            const badgeColor = getRoleBadgeColor(expert.role);
            return (
              <div
                key={expert.name}
                className="flex items-center"
                style={{
                  padding: rpx(16),
                  borderRadius: rpx(12),
                  background: THEME.surface,
                  gap: rpx(12),
                }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: rpx(56),
                    height: rpx(56),
                    borderRadius: "50%",
                    background: THEME.accentLight,
                    fontFamily: FONT_SERIF,
                    fontSize: rpx(24),
                    color: THEME.accent,
                  }}
                >
                  {expert.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div
                    className="flex items-center"
                    style={{ gap: rpx(8) }}
                  >
                    <span
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: THEME.textPrimary,
                      }}
                    >
                      {expert.name}
                    </span>
                    {badge && (
                      <span
                        style={{
                          fontSize: rpx(18),
                          padding: `${rpx(2)} ${rpx(10)}`,
                          borderRadius: rpx(8),
                          background: badgeColor.bg,
                          color: badgeColor.text,
                        }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: rpx(22),
                      color: THEME.textTertiary,
                      margin: `${rpx(4)} 0 0`,
                    }}
                  >
                    {expert.intro}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ 帖子列表 ═══ */}
      <div style={{ padding: `0 0 ${rpx(120)}` }}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onAction={handlePostAction}
          />
        ))}

        {posts.length === 0 && (
          <div
            className="flex items-center justify-center"
            style={{
              padding: `${rpx(80)} 0`,
              color: THEME.textTertiary,
              fontSize: "var(--font-size-sm)",
            }}
          >
            暂无内容
          </div>
        )}
      </div>

      {/* ═══ 发帖浮动按钮（fixed） ═══ */}
      <button
        className="cursor-pointer flex items-center justify-center"
        style={{
          position: "fixed",
          bottom: `calc(var(--nav-height) + ${rpx(24)})`,
          right: rpx(36),
          width: rpx(96),
          height: rpx(96),
          borderRadius: "50%",
          background: THEME.link,
          border: "none",
          boxShadow: "0 4px 20px rgba(91,138,207,0.35)",
          zIndex: 20,
        }}
        onClick={handleFloatingClick}
      >
        <Pencil size={22} strokeWidth={1.8} style={{ color: "#fff" }} />
      </button>

      {/* ═══ 发帖底部弹窗 ═══ */}
      {showPostMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
            }}
            onClick={() => setShowPostMenu(false)}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: THEME.bg,
              borderRadius: `${rpx(28)} ${rpx(28)} 0 0`,
              boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
              paddingBottom: `max(${rpx(24)}, env(safe-area-inset-bottom))`,
            }}
          >
            {/* 拖拽手柄 */}
            <div
              className="flex justify-center"
              style={{ padding: `${rpx(12)} 0 ${rpx(8)}` }}
            >
              <div
                style={{
                  width: rpx(60),
                  height: rpx(6),
                  borderRadius: rpx(3),
                  background: THEME.border,
                }}
              />
            </div>

            {/* 发动态 */}
            <div
              className="cursor-pointer flex items-center"
              style={{
                padding: `${rpx(24)} ${rpx(36)}`,
                gap: rpx(20),
              }}
              onClick={handleComposeOpen}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: rpx(72),
                  height: rpx(72),
                  borderRadius: rpx(16),
                  background: "rgba(91,138,207,0.1)",
                }}
              >
                <Pencil
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: THEME.link }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: THEME.textPrimary,
                    margin: 0,
                  }}
                >
                  发动态
                </p>
                <p
                  style={{
                    fontSize: rpx(22),
                    color: THEME.textTertiary,
                    margin: `${rpx(4)} 0 0`,
                  }}
                >
                  分享你的日常/学习心得/奇思妙想
                </p>
              </div>
              <ChevronRight
                size={16}
                strokeWidth={1.5}
                style={{
                  color: THEME.textTertiary,
                  marginLeft: "auto",
                }}
              />
            </div>

            {/* 分割线 */}
            <div
              style={{
                height: 1,
                margin: `0 ${rpx(36)}`,
                background: THEME.border,
              }}
            />

            {/* 去提问 */}
            <div
              className="cursor-pointer flex items-center"
              style={{
                padding: `${rpx(24)} ${rpx(36)}`,
                gap: rpx(20),
              }}
              onClick={() => {
                setShowPostMenu(false);
                toast.show("提问功能正在用心打磨中，敬请期待");
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: rpx(72),
                  height: rpx(72),
                  borderRadius: rpx(16),
                  background: "rgba(196,154,108,0.1)",
                }}
              >
                <MessageSquare
                  size={22}
                  strokeWidth={1.5}
                  style={{ color: THEME.accent }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: THEME.textPrimary,
                    margin: 0,
                  }}
                >
                  去提问
                </p>
                <p
                  style={{
                    fontSize: rpx(22),
                    color: THEME.textTertiary,
                    margin: `${rpx(4)} 0 0`,
                  }}
                >
                  大胆发问，开启探索知识的大门
                </p>
              </div>
              <ChevronRight
                size={16}
                strokeWidth={1.5}
                style={{
                  color: THEME.textTertiary,
                  marginLeft: "auto",
                }}
              />
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

// ─── 帖子卡片子组件 ──────────────────────────────────

function PostCard({
  post,
  onAction,
}: {
  post: CirclePost;
  onAction: (action: string) => void;
}) {
  const badge = getRoleBadge(post.role);
  const badgeColor = getRoleBadgeColor(post.role);

  return (
    <div
      style={{
        background: THEME.bg,
        padding: `${rpx(24)} ${rpx(36)}`,
        borderBottom: `${rpx(12)} solid ${THEME.surface}`,
      }}
    >
      {/* 作者信息行 */}
      <div
        className="flex items-center"
        style={{ gap: rpx(12), marginBottom: rpx(16) }}
      >
        {/* 头像 */}
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: rpx(64),
            height: rpx(64),
            borderRadius: "50%",
            background:
              post.role === "owner"
                ? "rgba(196,154,108,0.15)"
                : post.role === "guest"
                  ? "rgba(139,170,125,0.15)"
                  : "rgba(176,168,156,0.12)",
            fontFamily: FONT_SERIF,
            fontSize: rpx(26),
            color:
              post.role === "owner"
                ? THEME.accent
                : post.role === "guest"
                  ? THEME.sage
                  : THEME.textSecondary,
          }}
        >
          {post.authorName.charAt(0)}
        </div>

        <div className="flex-1">
          <div className="flex items-center" style={{ gap: rpx(8) }}>
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: THEME.textPrimary,
              }}
            >
              {post.authorName}
            </span>
            {badge && (
              <span
                style={{
                  fontSize: rpx(18),
                  padding: `${rpx(2)} ${rpx(10)}`,
                  borderRadius: rpx(8),
                  background: badgeColor.bg,
                  color: badgeColor.text,
                }}
              >
                {badge}
              </span>
            )}
            {/* 用户等级 */}
            {post.level && (
              <span
                style={{
                  fontSize: rpx(16),
                  padding: `${rpx(1)} ${rpx(8)}`,
                  borderRadius: rpx(6),
                  background:
                    post.level >= 5
                      ? "rgba(91,138,207,0.12)"
                      : "rgba(176,168,156,0.1)",
                  color:
                    post.level >= 5 ? THEME.link : THEME.textTertiary,
                }}
              >
                Lv{post.level}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: rpx(20),
              color: THEME.textTertiary,
              margin: `${rpx(2)} 0 0`,
            }}
          >
            {post.publishedAt}
          </p>
        </div>

        {/* 右侧下拉箭头 + 精选标签 */}
        <div className="flex items-center" style={{ gap: rpx(8) }}>
          {post.isFeatured && (
            <span
              style={{
                padding: `${rpx(4)} ${rpx(14)}`,
                borderRadius: rpx(8),
                background: "rgba(196,154,108,0.1)",
                fontSize: rpx(20),
                color: THEME.accent,
              }}
            >
              精选
            </span>
          )}
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            style={{ color: THEME.textTertiary }}
          />
        </div>
      </div>

      {/* 话题标签 */}
      {post.hashtag && (
        <p
          style={{
            fontSize: rpx(24),
            color: THEME.link,
            margin: `0 0 ${rpx(8)}`,
          }}
        >
          {post.hashtag}
        </p>
      )}

      {/* 内容 */}
      <div
        style={{
          fontSize: "var(--font-size-sm)",
          color: THEME.textPrimary,
          lineHeight: 1.8,
          whiteSpace: "pre-line",
        }}
      >
        {post.content}
      </div>

      {/* 点赞用户名 */}
      {post.likedBy && post.likedBy.length > 0 && (
        <div
          className="flex items-start"
          style={{
            marginTop: rpx(16),
            gap: rpx(6),
            padding: `${rpx(10)} ${rpx(14)}`,
            borderRadius: rpx(8),
            background: THEME.surface,
          }}
        >
          <ThumbsUp
            size={13}
            strokeWidth={1.5}
            style={{
              color: THEME.textTertiary,
              marginTop: rpx(3),
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: rpx(22),
              color: THEME.textSecondary,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {post.likedBy.join("，")}
            {post.likes > post.likedBy.length && "等"}
            觉得很赞
          </p>
        </div>
      )}

      {/* 热门评论 */}
      {post.topComments && post.topComments.length > 0 && (
        <div
          style={{
            marginTop: rpx(8),
            padding: `${rpx(8)} ${rpx(14)}`,
            borderRadius: rpx(8),
            background: THEME.surface,
          }}
        >
          {post.topComments.map((comment, i) => (
            <p
              key={i}
              style={{
                fontSize: rpx(22),
                color: THEME.textSecondary,
                margin: i > 0 ? `${rpx(4)} 0 0` : 0,
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: THEME.textPrimary }}>
                {comment.name}
              </span>
              ：{comment.content}
            </p>
          ))}
        </div>
      )}

      {/* 互动栏 */}
      <div
        className="flex items-center"
        style={{
          marginTop: rpx(16),
          gap: rpx(0),
        }}
      >
        <button
          className="cursor-pointer flex items-center flex-1 justify-center"
          style={{
            border: "none",
            background: "none",
            gap: rpx(6),
            fontSize: rpx(22),
            color: THEME.textTertiary,
            padding: `${rpx(8)} 0`,
          }}
          onClick={() => onAction("点赞")}
        >
          <ThumbsUp size={15} strokeWidth={1.3} />
          {post.likes > 0 && post.likes}
        </button>
        <button
          className="cursor-pointer flex items-center flex-1 justify-center"
          style={{
            border: "none",
            background: "none",
            gap: rpx(6),
            fontSize: rpx(22),
            color: THEME.textTertiary,
            padding: `${rpx(8)} 0`,
          }}
          onClick={() => onAction("评论")}
        >
          <MessageSquare size={15} strokeWidth={1.3} />
          {post.comments > 0 && post.comments}
        </button>
        <button
          className="cursor-pointer flex items-center flex-1 justify-center"
          style={{
            border: "none",
            background: "none",
            gap: rpx(6),
            fontSize: rpx(22),
            color: THEME.textTertiary,
            padding: `${rpx(8)} 0`,
          }}
          onClick={() => onAction("分享")}
        >
          <Share2 size={15} strokeWidth={1.3} />
          {(post.shares ?? 0) > 0 && post.shares}
        </button>
      </div>
    </div>
  );
}
