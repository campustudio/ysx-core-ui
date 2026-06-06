/**
 * ComingSoonSheet - 「即将开放」安静说明（替代 toast 噪音）
 *
 * 对齐文档 §15.4 / §16.5：未完成能力**静默置灰**，点按时给一段**安静、从容**的说明，
 * 而非频繁弹 toast。语气不急不催，呼应平台「柔和舒缓」定位。
 */

import { Lock } from "lucide-react";
import { BottomSheet } from "../BottomSheet";
import { rpx, FONT_SERIF } from "../../../config/styles";

const GOLD = "#B8975A";

interface ComingSoonSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** 一段从容的说明文字 */
  message: string;
  /** 阶段提示（如「第二阶段开放」），可选 */
  phase?: string;
}

export function ComingSoonSheet({
  visible,
  onClose,
  title,
  message,
  phase,
}: ComingSoonSheetProps) {
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
              "radial-gradient(circle at 50% 42%, rgba(255,236,184,0.55), rgba(233,216,166,0.12) 70%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: rpx(24),
          }}
        >
          <Lock size={26} color={GOLD} strokeWidth={1.6} />
        </span>
        <h3
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(34),
            fontWeight: 600,
            color: "#1F1F1F",
            margin: `0 0 ${rpx(8)}`,
            letterSpacing: rpx(2),
          }}
        >
          {title}
        </h3>
        {phase && (
          <span
            style={{
              fontSize: rpx(20),
              color: GOLD,
              letterSpacing: rpx(1),
              marginBottom: rpx(18),
            }}
          >
            {phase}
          </span>
        )}
        <p
          style={{
            fontSize: rpx(25),
            color: "#606266",
            lineHeight: 1.75,
            margin: 0,
            maxWidth: rpx(520),
          }}
        >
          {message}
        </p>
      </div>
    </BottomSheet>
  );
}
