/**
 * AmbientSoundPicker - 环境音效选择器（白绿生命力系）
 *
 * 呼吸页准备阶段的音效选择 UI
 * 横排展示：静默 / 细雨 / 海浪 / 山林 / 清风
 *
 * 设计（白绿底适配）：
 *   - 选中项圆形背景绿色点亮 + 深苔绿文字
 *   - 未选中项低透明度
 *   - 不用 border，用阴影营造立体感
 *
 * Props:
 *   - selectedId: 当前选中音效 id
 *   - onChange: 选中变更回调
 */

import { VolumeX, CloudRain, Waves, TreePine, Wind } from "lucide-react";
import { FONT_SERIF, rpx } from "../../config/styles";
import type { AmbientSound } from "../../config/breathing-data";
import { AMBIENT_SOUNDS } from "../../config/breathing-data";

/** 图标映射 */
const ICON_MAP: Record<AmbientSound["icon"], React.ElementType> = {
  "volume-x": VolumeX,
  "cloud-rain": CloudRain,
  waves: Waves,
  trees: TreePine,
  wind: Wind,
};

interface Props {
  selectedId: string;
  onChange: (id: string) => void;
}

export function AmbientSoundPicker({ selectedId, onChange }: Props) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ gap: rpx(24) }}
    >
      {AMBIENT_SOUNDS.map((sound) => {
        const isSelected = sound.id === selectedId;
        const IconComp = ICON_MAP[sound.icon];
        return (
          <div
            key={sound.id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onChange(sound.id)}
            style={{
              gap: rpx(8),
              transition: "all 0.3s ease",
            }}
          >
            {/* 圆形图标 */}
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: rpx(56),
                height: rpx(56),
                background: isSelected
                  ? "rgba(139,170,125,0.2)"
                  : "rgba(139,170,125,0.06)",
                boxShadow: isSelected
                  ? "0 2px 12px rgba(139,170,125,0.12), inset 0 1px 0 rgba(255,255,255,0.4)"
                  : "none",
                transition: "all 0.3s ease",
              }}
            >
              <IconComp
                style={{
                  width: rpx(24),
                  height: rpx(24),
                  color: isSelected
                    ? "#5A7A52"
                    : "rgba(58,74,56,0.22)",
                  transition: "color 0.3s ease",
                }}
                strokeWidth={1.5}
              />
            </div>
            {/* 文字标签 */}
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(18),
                fontWeight: 400,
                color: isSelected
                  ? "rgba(58,74,56,0.7)"
                  : "rgba(58,74,56,0.25)",
                letterSpacing: rpx(1),
                lineHeight: 1,
                transition: "color 0.3s ease",
              }}
            >
              {sound.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}