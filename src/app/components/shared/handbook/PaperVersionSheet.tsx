/**
 * PaperVersionSheet - 纸质版轻引导卡片（§2.9）
 *
 * 在用户「读完一卷 / 完成一次读后练习」等自然「回」的时刻，温和地递一张小卡片，
 * 引导了解纸质版《人类手册》。
 *
 * 气质铁律（务必遵守）：
 *   - 不推销、不写「立即购买」；按钮用「把这一卷带回现实生活 / 了解纸质版」。
 *   - 文案安静、从容，与平台「柔和舒缓」一致；不打断、不催促。
 *   - 「纸质版接口」当前为占位：onLearnMore 由上层处理（跳转/留资/占位提示），
 *     收费与权益细节见《明镜模块集成规划》商业化章节。
 */

import { BookMarked } from "lucide-react";
import { BottomSheet } from "../BottomSheet";
import { rpx, FONT_SERIF } from "../../../config/styles";

const GOLD = "#B8975A";

interface PaperVersionSheetProps {
  visible: boolean;
  onClose: () => void;
  /** 当前卷名（可选，用于「把这一卷带回现实生活」的语境） */
  volumeTitle?: string;
  /** 「纸质版接口」动作占位：跳转外部/留资/提示，由上层实现 */
  onLearnMore?: () => void;
}

export function PaperVersionSheet({
  visible,
  onClose,
  volumeTitle,
  onLearnMore,
}: PaperVersionSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} background="#FBFAF7">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: `${rpx(12)} ${rpx(16)} ${rpx(8)}`,
        }}
      >
        <span
          style={{
            width: rpx(96),
            height: rpx(96),
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 42%, rgba(255,236,184,0.5), rgba(233,216,166,0.1) 70%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: rpx(24),
          }}
        >
          <BookMarked size={26} color={GOLD} strokeWidth={1.6} />
        </span>
        <h3
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(34),
            fontWeight: 600,
            color: "#1F1F1F",
            margin: `0 0 ${rpx(16)}`,
            letterSpacing: rpx(2),
          }}
        >
          也可以把它带回纸页之间
        </h3>
        <p
          style={{
            fontSize: rpx(25),
            color: "#606266",
            lineHeight: 1.8,
            margin: 0,
            maxWidth: rpx(540),
          }}
        >
          有些文字适合在线上被找到，有些文字适合在纸页之间慢慢安静下来。如果你愿意，也可以把
          {volumeTitle ? `《${volumeTitle}》` : "这一卷"}带回到现实生活里。
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: rpx(14),
            width: "100%",
            marginTop: rpx(36),
          }}
        >
          <button
            type="button"
            onClick={() => {
              onLearnMore?.();
              onClose();
            }}
            style={{
              width: "100%",
              padding: `${rpx(24)} 0`,
              borderRadius: rpx(28),
              border: "none",
              background: "linear-gradient(135deg, #D9B96A, #B8975A)",
              color: "#fff",
              fontFamily: FONT_SERIF,
              fontSize: rpx(27),
              fontWeight: 600,
              letterSpacing: rpx(1),
              cursor: "pointer",
            }}
          >
            把这一卷带回现实生活
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              padding: `${rpx(18)} 0`,
              background: "transparent",
              border: "none",
              color: "#9A8B6E",
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              letterSpacing: rpx(1),
              cursor: "pointer",
            }}
          >
            先继续读
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
