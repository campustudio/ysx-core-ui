/**
 * SolarSystem - 太阳系导航轨道组件
 *
 * 核心机制：
 *   ① CSS 3D perspective + rotateX(62deg)
 *      → 圆形轨道在视觉上变成椭圆（俯瞰太阳系角度）
 *   ② 每颗行星绕中心真实旋转（orbit-spin keyframe）
 *   ③ 行星自身反向旋转 + 反向倾斜（planet-face keyframe）
 *      → 文字始终正对用户，不随轨道转动
 *   ④ preserve-3d 自动处理前后遮挡
 *      → 行星经过"太阳背面"时自然被遮挡
 *   ⑤ 轨道环极淡金色描边 → 隐约可见的运行轨迹
 *
 * 太阳：多层辐射光晕 → 暖金核心 + 柔和外辉
 * 行星：径向渐变球体 + 宋体单字 + 标题
 *
 * Props:
 *   - onPlanetClick: 行星节点点击回调 (planetId, planetTitle)
 */

import {
  SOLAR_PLANETS,
  SUN_GLYPH,
  SUN_SUB,
} from "../../config/solar-data";
import { FONT_SERIF, rpxVw as rpx } from "../../config/styles";

/** 轨道平面倾斜角度（度） */
const TILT = 62;

interface SolarSystemProps {
  /** 点击行星节点回调 */
  onPlanetClick?: (planetId: string, planetTitle: string) => void;
}

export function SolarSystem({ onPlanetClick }: SolarSystemProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /* 禁止溢出裁剪（行星标题可能略超边界） */
        overflow: "visible",
      }}
    >
      {/* ═══ keyframes ═══ */}
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes planet-face {
          from { transform: rotateZ(0deg) rotateX(-${TILT}deg); }
          to   { transform: rotateZ(-360deg) rotateX(-${TILT}deg); }
        }
        @keyframes sun-breathe {
          0%, 100% { transform: translate(-50%, -50%) rotateX(-${TILT}deg) scale(1); }
          50%      { transform: translate(-50%, -50%) rotateX(-${TILT}deg) scale(1.04); }
        }
        @keyframes sun-glow-pulse {
          0%, 100% { opacity: 0.35; transform: translate(-50%, -50%) rotateX(-${TILT}deg) scale(1); }
          50%      { opacity: 0.5;  transform: translate(-50%, -50%) rotateX(-${TILT}deg) scale(1.08); }
        }
      `}</style>

      {/* ═══ 透视容器 ═══ */}
      <div
        style={{
          position: "relative",
          width: rpx(720),
          height: rpx(720),
          perspective: rpx(1400),
          perspectiveOrigin: "50% 42%",
        }}
      >
        {/* ═══ 倾斜轨道平面 ═══ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `rotateX(${TILT}deg)`,
            transformOrigin: "center center",
          }}
        >
          {/* ─── 太阳（多层光晕）─── */}
          {/* 最外层辐射 */}
          <div
            style={{
              position: "absolute",
              left: "50%", top: "50%",
              width: rpx(260), height: rpx(260),
              transform: `translate(-50%, -50%) rotateX(-${TILT}deg)`,
              borderRadius: "50%",
              background: `radial-gradient(circle,
                rgba(255,235,180,0.1) 0%,
                rgba(220,180,100,0.04) 40%,
                transparent 70%)`,
              animation: `sun-glow-pulse 6s ease-in-out infinite`,
              pointerEvents: "none",
            }}
          />
          {/* 中层光晕 */}
          <div
            style={{
              position: "absolute",
              left: "50%", top: "50%",
              width: rpx(160), height: rpx(160),
              transform: `translate(-50%, -50%) rotateX(-${TILT}deg)`,
              borderRadius: "50%",
              background: `radial-gradient(circle,
                rgba(255,240,200,0.25) 0%,
                rgba(230,195,130,0.1) 50%,
                transparent 100%)`,
              pointerEvents: "none",
            }}
          />
          {/* 核心太阳 */}
          <div
            style={{
              position: "absolute",
              left: "50%", top: "50%",
              width: rpx(88), height: rpx(88),
              borderRadius: "50%",
              background: `radial-gradient(circle at 38% 36%,
                rgba(255,252,240,0.98) 0%,
                rgba(255,240,210,0.92) 25%,
                rgba(240,210,155,0.8) 50%,
                rgba(210,170,110,0.55) 75%,
                rgba(196,154,108,0.2) 100%)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              animation: `sun-breathe 5s ease-in-out infinite`,
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(32),
                fontWeight: 700,
                color: "rgba(120,85,40,0.9)",
                lineHeight: 1,
              }}
            >
              {SUN_GLYPH}
            </span>
            <span
              style={{
                fontFamily: FONT_SERIF,
                fontSize: rpx(14),
                fontWeight: 500,
                color: "rgba(140,100,50,0.6)",
                lineHeight: 1,
                marginTop: rpx(2),
                letterSpacing: rpx(2),
              }}
            >
              {SUN_SUB}
            </span>
          </div>

          {/* ─── 轨道环 + 行星 ─── */}
          {SOLAR_PLANETS.map((planet) => {
            const r = planet.radius;
            const delay = -(planet.startDeg / 360) * planet.period;
            const [cR, cG, cB] = planet.color;

            return (
              <div key={planet.id}>
                {/* 轨道环（静态视觉，不旋转） */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%", top: "50%",
                    width: rpx(r * 2), height: rpx(r * 2),
                    marginLeft: rpx(-r), marginTop: rpx(-r),
                    borderRadius: "50%",
                    border: `1px solid rgba(196,154,108,0.07)`,
                    pointerEvents: "none",
                  }}
                />

                {/* 旋转载体（带动行星公转） */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%", top: "50%",
                    width: rpx(r * 2), height: rpx(r * 2),
                    marginLeft: rpx(-r), marginTop: rpx(-r),
                    borderRadius: "50%",
                    animation: `orbit-spin ${planet.period}s linear ${delay}s infinite`,
                    transformStyle: "preserve-3d",
                    pointerEvents: "none",
                  }}
                >
                  {/* 行星本体（反转以面向用户） */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, left: "50%",
                      width: rpx(planet.size),
                      height: rpx(planet.size),
                      marginLeft: rpx(-planet.size / 2),
                      marginTop: rpx(-planet.size / 2),
                      animation: `planet-face ${planet.period}s linear ${delay}s infinite`,
                      transformStyle: "preserve-3d",
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                    onClick={() => onPlanetClick?.(planet.id, planet.title)}
                  >
                    {/* 行星光晕 */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%", top: "50%",
                        width: rpx(planet.size * 1.8),
                        height: rpx(planet.size * 1.8),
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        background: `radial-gradient(circle,
                          rgba(${cR},${cG},${cB},0.15) 0%,
                          rgba(${cR},${cG},${cB},0.04) 50%,
                          transparent 100%)`,
                        pointerEvents: "none",
                      }}
                    />
                    {/* 行星球体 */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: `radial-gradient(circle at 36% 34%,
                          rgba(${Math.min(cR + 15, 255)},${Math.min(cG + 15, 255)},${Math.min(cB + 10, 255)},0.95) 0%,
                          rgba(${cR},${cG},${cB},0.82) 35%,
                          rgba(${Math.max(cR - 30, 0)},${Math.max(cG - 30, 0)},${Math.max(cB - 20, 0)},0.6) 70%,
                          rgba(${Math.max(cR - 60, 0)},${Math.max(cG - 60, 0)},${Math.max(cB - 40, 0)},0.3) 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(26),
                          fontWeight: 600,
                          color: `rgba(${Math.max(cR - 140, 40)},${Math.max(cG - 140, 30)},${Math.max(cB - 130, 20)},0.88)`,
                          lineHeight: 1,
                        }}
                      >
                        {planet.glyph}
                      </span>
                    </div>
                    {/* 行星标题（球体下方） */}
                    <div
                      style={{
                        position: "absolute",
                        top: `calc(100% + ${rpx(6)})`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: FONT_SERIF,
                          fontSize: rpx(17),
                          fontWeight: 500,
                          color: "rgba(232,213,184,0.55)",
                          lineHeight: 1.2,
                          textShadow:
                            "0 0 6px rgba(4,6,14,0.9), 0 1px 2px rgba(4,6,14,0.7)",
                        }}
                      >
                        {planet.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}