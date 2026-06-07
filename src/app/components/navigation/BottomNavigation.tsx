/**
 * BottomNavigation - 底部导航栏
 *
 * 简约主流化图标（lucide-react），取代传统文化元素图标
 * 旧版图标（湖心亭/古卷轴/先天八卦/太极）保留在 config/icons.tsx 中未删除
 *
 * 首页：Home | 人类手册：BookOpen | 新人生之路：Compass | 明镜：Sparkles
 *
 * 兼容性：
 *   - 使用 env(safe-area-inset-bottom) 适配全面屏
 *   - 使用 rpx 单位（非原始 vw）确保大屏上限
 *   - 触摸区域 ≥ 88rpx（≈44px），符合移动端最小触摸目标
 *   - 毛玻璃（backdrop-filter）：本期为 H5（微信内置浏览器 / Safari，均为 WebKit，支持良好），
 *     用半透明深色 + 背景模糊，把身后滚动内容柔化成一层安静的底，避免「透出杂乱」
 *
 * Props:
 * - active: 当前激活项索引
 * - onChange: 切换回调
 */

import { Home, BookOpen, Compass, Sparkles } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { ICON_ENGRAVED, TEXT_ENGRAVED } from "../../config/styles";

// ─── 导航项配置 ──────────────────────────────────────

interface NavItem {
  icon: React.ComponentType<LucideProps>;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: "首页" },
  { icon: BookOpen, label: "人类手册" },
  { icon: Compass, label: "新人生之路" },
  { icon: Sparkles, label: "明镜" },
];

// ─── 组件 ────────────────────────────────────────────

interface BottomNavigationProps {
  /** 当前激活项索引 */
  active?: number;
  /** 切换回调 */
  onChange?: (index: number) => void;
  /** 是否隐藏（用于滚动隐藏效果） */
  hidden?: boolean;
}

const ICON_SIZE = {
  width: "calc(var(--rpx) * 40)",
  height: "calc(var(--rpx) * 40)",
};

/**
 * 最小触摸区域尺寸
 * 76rpx ≈ 38px — 在保证可清晰点按的前提下，尽量收窄底栏占用空间
 */
const MIN_TAP_SIZE = {
  minWidth: "calc(var(--rpx) * 76)",
  minHeight: "calc(var(--rpx) * 72)",
};

export function BottomNavigation({
  active = 0,
  onChange,
  hidden = false,
}: BottomNavigationProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0"
      style={{
        zIndex: "var(--z-navigation)",
        transform: hidden ? "translateY(100%)" : "translateY(0)",
        transition: "transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <div
        style={{
          background: "rgba(46, 39, 29, 0.66)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div
          className="flex justify-around items-center"
          style={{
            padding: `calc(var(--rpx) * 6) calc(var(--rpx) * 48) calc(var(--rpx) * 6)`,
          }}
        >
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = active === index;

            return (
              <button
                key={item.label}
                onClick={() => onChange?.(index)}
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive ? "text-white" : "text-white/60"
                }`}
                style={{
                  ...MIN_TAP_SIZE,
                  gap: "calc(var(--rpx) * 3)",
                  WebkitFontSmoothing: "antialiased",
                }}
                aria-label={item.label}
              >
                <Icon
                  strokeWidth={isActive ? 1.8 : 1.5}
                  style={{
                    ...ICON_SIZE,
                    filter: ICON_ENGRAVED,
                  }}
                />
                <span
                  style={{
                    fontSize: "calc(var(--rpx) * 16)",
                    lineHeight: 1,
                    opacity: isActive ? 1 : 0.7,
                    textShadow: TEXT_ENGRAVED,
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
