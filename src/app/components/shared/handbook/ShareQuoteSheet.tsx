/**
 * ShareQuoteSheet - 结缘分享 · 金句卡
 *
 * 把书里触动你的一段，做成一张安静的卡片，递给一个人。
 * 定位是「结缘」（让文字安静地流动），不是社交流量 / 点赞 / 人设表演
 * —— 对齐第八卷「元感知平台·文明入口」与「不宜社交表演」。
 *
 * 提供：保存图片（canvas 绘制 → 分享/下载）/ 复制文字。无依赖、纯前端。
 */

import { Quote, ImageDown, Copy } from "lucide-react";
import { BottomSheet } from "../BottomSheet";
import { rpx, FONT_SERIF } from "../../../config/styles";

const GOLD = "#B8975A";
const SIGNATURE = "元感知 · 人类手册";
/**
 * 分享链接：正式上线后由后端为该章生成「免登录公开只读」短链，
 * 收件人点开/扫码即可完整阅读整章正文（详见 spec/design/ui-design-system.md §十四）。
 * 当前数据层尚未就绪，UI 先按最终形态呈现（链接 + 二维码占位）。
 */
const READ_FULL_HINT = "扫码或打开链接 · 阅读整章全文";

interface ShareQuoteSheetProps {
  visible: boolean;
  onClose: () => void;
  quote: string;
  source: string;
  /** 该章「免登录只读」全文链接；缺省表示数据未就绪，按占位形态展示 */
  shareUrl?: string;
  onCopied?: () => void;
  onSaved?: () => void;
}

/** 二维码占位（含三枚定位角，明显是二维码形态；非真实可扫，待链接就绪后替换） */
function QrPlaceholder({ size = 96 }: { size?: number }) {
  const cell = size / 7;
  const finder = (x: number, y: number) => (
    <g>
      <rect
        x={x}
        y={y}
        width={cell * 2}
        height={cell * 2}
        rx={cell * 0.4}
        fill="none"
        stroke="#2A2620"
        strokeWidth={cell * 0.34}
      />
      <rect
        x={x + cell * 0.7}
        y={y + cell * 0.7}
        width={cell * 0.6}
        height={cell * 0.6}
        rx={cell * 0.15}
        fill="#2A2620"
      />
    </g>
  );
  // 少量装饰性模块，营造二维码质感
  const dots = [
    [4, 0],
    [5, 1],
    [6, 2],
    [4, 4],
    [6, 4],
    [5, 5],
    [4, 6],
    [3, 3],
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        background: "#fff",
        borderRadius: rpx(12),
        padding: rpx(8),
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {finder(0, 0)}
      {finder(cell * 5, 0)}
      {finder(0, cell * 5)}
      {dots.map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx * cell + cell * 0.15}
          y={cy * cell + cell * 0.15}
          width={cell * 0.7}
          height={cell * 0.7}
          rx={cell * 0.18}
          fill="#2A2620"
        />
      ))}
    </svg>
  );
}

/** 在 canvas 上绘制二维码占位（与 DOM 版 QrPlaceholder 一致的形态） */
function drawQrPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.fillStyle = "#fff";
  const r = size * 0.12;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, size, size, r);
  } else {
    ctx.rect(x, y, size, size);
  }
  ctx.fill();
  const pad = size * 0.1;
  const inner = size - pad * 2;
  const cell = inner / 7;
  const ox = x + pad;
  const oy = y + pad;
  ctx.fillStyle = "#2A2620";
  const finder = (fx: number, fy: number) => {
    ctx.lineWidth = cell * 0.34;
    ctx.strokeStyle = "#2A2620";
    ctx.strokeRect(
      ox + fx + cell * 0.17,
      oy + fy + cell * 0.17,
      cell * 2 - cell * 0.34,
      cell * 2 - cell * 0.34,
    );
    ctx.fillRect(ox + fx + cell * 0.7, oy + fy + cell * 0.7, cell * 0.6, cell * 0.6);
  };
  finder(0, 0);
  finder(cell * 5, 0);
  finder(0, cell * 5);
  const dots = [
    [4, 0],
    [5, 1],
    [6, 2],
    [4, 4],
    [6, 4],
    [5, 5],
    [4, 6],
    [3, 3],
  ];
  for (const [cx, cy] of dots) {
    ctx.fillRect(
      ox + cx * cell + cell * 0.15,
      oy + cy * cell + cell * 0.15,
      cell * 0.7,
      cell * 0.7,
    );
  }
  ctx.restore();
}

/** 在 canvas 上绘制金句卡，返回 canvas */
function drawCard(
  quote: string,
  source: string,
  shareUrl?: string,
): HTMLCanvasElement {
  const W = 1080;
  const H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 暖象牙白渐变底
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#FBF8F1");
  g.addColorStop(1, "#F2E8D2");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // 柔金光晕
  const glow = ctx.createRadialGradient(W / 2, 360, 60, W / 2, 360, 520);
  glow.addColorStop(0, "rgba(255,236,184,0.5)");
  glow.addColorStop(1, "rgba(255,236,184,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 760);

  // 金色引号
  ctx.fillStyle = GOLD;
  ctx.font = '700 160px Georgia, "Noto Serif SC", serif';
  ctx.textBaseline = "alphabetic";
  ctx.fillText("\u201C", 120, 380);

  // 正文（CJK 逐字换行）
  const fontSize = 60;
  const lineHeight = 100;
  const maxWidth = W - 240;
  ctx.fillStyle = "#2A2620";
  ctx.font = `600 ${fontSize}px "Noto Serif SC", serif`;
  const lines: string[] = [];
  let line = "";
  for (const ch of quote) {
    if (ch === "\n") {
      lines.push(line);
      line = "";
      continue;
    }
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const blockH = lines.length * lineHeight;
  let y = Math.max(440, H / 2 - blockH / 2);
  for (const l of lines) {
    ctx.fillText(l, 120, y);
    y += lineHeight;
  }

  // 出处
  ctx.fillStyle = "#8A7B55";
  ctx.font = '400 36px "Noto Serif SC", serif';
  ctx.fillText(`— ${source}`, 120, y + 60);

  // 底部：二维码占位 + 「读全文」引导 + 署名
  const qrSize = 176;
  const qrX = 120;
  const qrY = H - qrSize - 130;
  drawQrPlaceholder(ctx, qrX, qrY, qrSize);

  const textX = qrX + qrSize + 40;
  ctx.textAlign = "left";
  ctx.fillStyle = "#2A2620";
  ctx.font = '600 38px "Noto Serif SC", serif';
  ctx.fillText("扫码 · 读整章全文", textX, qrY + 60);
  ctx.fillStyle = "#9A8B62";
  ctx.font = '400 30px "Noto Serif SC", serif';
  ctx.fillText(shareUrl || "完整章节链接即将开放", textX, qrY + 112);
  ctx.fillStyle = GOLD;
  ctx.font = '500 30px "Noto Serif SC", serif';
  ctx.fillText(SIGNATURE, textX, qrY + 160);

  return canvas;
}

export function ShareQuoteSheet({
  visible,
  onClose,
  quote,
  source,
  shareUrl,
  onCopied,
  onSaved,
}: ShareQuoteSheetProps) {
  const linkLine = shareUrl
    ? `阅读整章全文 ▸ ${shareUrl}`
    : "完整章节链接即将开放";
  const shareText = `${quote}\n\n— ${source}\n${SIGNATURE}\n${linkLine}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        // 降级：非安全上下文 / 旧环境，用临时 textarea + execCommand
        const ta = document.createElement("textarea");
        ta.value = shareText;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      onCopied?.();
    } catch {
      onCopied?.();
    }
  };

  const handleSave = () => {
    const canvas = drawCard(quote, source, shareUrl);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "yuanganzhi-quote.png", {
        type: "image/png",
      });
      const nav = navigator as Navigator & {
        canShare?: (data?: unknown) => boolean;
        share?: (data?: unknown) => Promise<void>;
      };
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        nav
          .share({ files: [file] })
          .then(() => onSaved?.())
          .catch(() => {
            /* 用户取消 */
          });
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "yuanganzhi-quote.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      onSaved?.();
    }, "image/png");
  };

  const btn = (filled = false) =>
    ({
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: rpx(10),
      padding: `${rpx(22)} 0`,
      borderRadius: rpx(28),
      border: filled ? "none" : `1.5px solid rgba(184,151,90,0.5)`,
      background: filled
        ? "linear-gradient(135deg, #D9B96A, #B8975A)"
        : "transparent",
      color: filled ? "#fff" : GOLD,
      fontFamily: FONT_SERIF,
      fontSize: rpx(25),
      fontWeight: 600,
      cursor: "pointer",
    }) as const;

  return (
    <BottomSheet visible={visible} onClose={onClose} background="#FBFAF7">
      {/* 卡片预览 */}
      <div
        style={{
          borderRadius: rpx(28),
          background: "linear-gradient(135deg, #FBF8F1, #F2E8D2)",
          padding: `${rpx(48)} ${rpx(44)}`,
          boxShadow: "0 10px 30px rgba(120,96,40,0.12)",
          marginBottom: rpx(32),
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Quote size={34} color={GOLD} strokeWidth={1.3} />
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(36),
            fontWeight: 600,
            color: "#2A2620",
            lineHeight: 1.8,
            letterSpacing: rpx(1),
            margin: `${rpx(16)} 0 0`,
            whiteSpace: "pre-wrap",
          }}
        >
          {quote}
        </p>
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(22),
            color: "#8A7B55",
            margin: `${rpx(28)} 0 0`,
          }}
        >
          — {source}
        </p>
        {/* 读全文：二维码 + 链接（贴近最终形态；链接数据未就绪时显示占位） */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(20),
            marginTop: rpx(36),
            paddingTop: rpx(28),
            borderTop: "1px solid rgba(138,123,85,0.18)",
          }}
        >
          <QrPlaceholder size={84} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(22),
                fontWeight: 600,
                color: "#2A2620",
                margin: 0,
              }}
            >
              {READ_FULL_HINT}
            </p>
            <p
              style={{
                fontSize: rpx(19),
                color: shareUrl ? GOLD : "#A99B73",
                margin: `${rpx(8)} 0 0`,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {shareUrl || "完整章节链接即将开放"}
            </p>
            <p
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(18),
                color: GOLD,
                margin: `${rpx(10)} 0 0`,
                letterSpacing: rpx(1),
              }}
            >
              {SIGNATURE}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: rpx(16) }}>
        <button onClick={handleCopy} style={btn(false)}>
          <Copy size={18} strokeWidth={1.8} />
          复制文字
        </button>
        <button onClick={handleSave} style={btn(true)}>
          <ImageDown size={18} strokeWidth={1.8} />
          保存图片
        </button>
      </div>
    </BottomSheet>
  );
}
