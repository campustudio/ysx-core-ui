/**
 * SolarTermDisplay - 节气时辰显示组件
 *
 * 展示当前节气名 + 时辰 + 诗句描述
 * 两种布局模式：
 *   - vertical（古卷竖排，用于 Hero 模式）
 *   - horizontal（现代横排，用于吸顶模式）
 *
 * Props:
 * - solarTerm: 当前节气数据
 * - shichen: 当前时辰数据
 * - layout: 布局模式
 * - colors: 色彩方案（白色/深色）
 */

import type { SolarTerm, Shichen } from "../../config/calendar";
import type { HeaderColorScheme } from "../../config/styles";
import { FONT_SERIF } from "../../config/styles";

interface SolarTermDisplayProps {
  /** 当前节气 */
  solarTerm: SolarTerm;
  /** 当前时辰 */
  shichen: Shichen;
  /** 布局模式 */
  layout: "vertical" | "horizontal";
  /** 色彩方案 */
  colors: HeaderColorScheme;
}

/** 竖排模式 — 古卷风格，三列从右往左读 */
function VerticalLayout({
  solarTerm,
  shichen,
  colors,
}: Omit<SolarTermDisplayProps, "layout">) {
  return (
    <div
      className="flex flex-row-reverse"
      style={{
        gap: "calc(var(--rpx) * 8)",
        alignItems: "flex-start",
      }}
    >
      {/* 第一列（最右）：节气名 */}
      <h1
        style={{
          writingMode: "vertical-rl",
          fontSize: "var(--font-size-2xl)",
          fontFamily: FONT_SERIF,
          fontWeight: 400,
          color: colors.title,
          letterSpacing: "calc(var(--rpx) * 6)",
          textShadow: colors.textShadow,
          margin: 0,
          padding: 0,
        }}
      >
        {solarTerm.name}
      </h1>

      {/* 第二列：时辰小注（圆点分隔） */}
      <div
        className="flex flex-col items-center"
        style={{ gap: "calc(var(--rpx) * 6)" }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            fontSize: "var(--font-size-xs)",
            fontFamily: FONT_SERIF,
            fontWeight: 300,
            color: colors.time,
            textShadow: colors.textShadow,
            letterSpacing: "calc(var(--rpx) * 3)",
          }}
        >
          {shichen.name}
        </span>
        <span
          style={{
            width: "calc(var(--rpx) * 3)",
            height: "calc(var(--rpx) * 3)",
            borderRadius: "50%",
            background: colors.divider,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            writingMode: "vertical-rl",
            fontSize: "var(--font-size-xs)",
            fontFamily: FONT_SERIF,
            fontWeight: 300,
            color: colors.time,
            textShadow: colors.textShadow,
            letterSpacing: "calc(var(--rpx) * 3)",
            opacity: 0.8,
          }}
        >
          {shichen.alias}
        </span>
      </div>

      {/* 第三列（最左）：节气描述 */}
      <span
        style={{
          writingMode: "vertical-rl",
          fontSize: "calc(var(--rpx) * 20)",
          fontFamily: FONT_SERIF,
          fontWeight: 300,
          color: colors.subtitle,
          textShadow: colors.textShadow,
          letterSpacing: "calc(var(--rpx) * 3)",
        }}
      >
        {solarTerm.desc}
      </span>
    </div>
  );
}

/** 横排模式 — 现代风格，节气 ｜ 时辰 + 描述 */
function HorizontalLayout({
  solarTerm,
  shichen,
  colors,
}: Omit<SolarTermDisplayProps, "layout">) {
  return (
    <div>
      {/* 第一行：节气 ｜ 时辰 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "calc(var(--rpx) * 10)",
        }}
      >
        <span
          style={{
            fontSize: "var(--font-size-2xl)",
            fontFamily: FONT_SERIF,
            fontWeight: 400,
            color: colors.title,
            letterSpacing: "calc(var(--rpx) * 4)",
          }}
        >
          {solarTerm.name}
        </span>
        {/* 竖线分隔 */}
        <span
          style={{
            width: "1px",
            height: "calc(var(--rpx) * 16)",
            background: colors.divider,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "var(--font-size-xs)",
            fontFamily: FONT_SERIF,
            fontWeight: 300,
            color: colors.time,
            letterSpacing: "calc(var(--rpx) * 2)",
          }}
        >
          {shichen.name}
          <span
            style={{
              margin: "0 calc(var(--rpx) * 6)",
              opacity: 0.5,
            }}
          >
            ·
          </span>
          {shichen.alias}
        </span>
      </div>
      {/* 第二行：描述 */}
      <p
        style={{
          fontSize: "var(--font-size-xs)",
          fontFamily: FONT_SERIF,
          fontWeight: 300,
          color: colors.subtitle,
          marginTop: "calc(var(--rpx) * 8)",
          letterSpacing: "calc(var(--rpx) * 2)",
        }}
      >
        {solarTerm.desc}
      </p>
    </div>
  );
}

export function SolarTermDisplay({
  solarTerm,
  shichen,
  layout,
  colors,
}: SolarTermDisplayProps) {
  if (layout === "vertical") {
    return (
      <VerticalLayout
        solarTerm={solarTerm}
        shichen={shichen}
        colors={colors}
      />
    );
  }
  return (
    <HorizontalLayout
      solarTerm={solarTerm}
      shichen={shichen}
      colors={colors}
    />
  );
}