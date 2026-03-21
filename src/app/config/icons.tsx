/**
 * 自绘 SVG 图标集合
 *
 * 统一管理所有自定义 SVG 图标，方便跨组件复用
 *
 * 命名规范：以 Icon 结尾（如 PavilionIcon）
 * 统一 Props 接口：IconProps
 *
 * ─── 当前使用 ───
 * - SoftCloudIcon: 功能卡片「徐」图标
 *
 * ─── 已归档（v1.1 产品反馈 #6） ───
 * 底部导航原版传统元素图标，已切换为 lucide-react 简约图标
 * 代码保留不删除，供后续其他场景复用
 * - PavilionIcon: 湖心亭（原首页导航）
 * - ScrollIcon: 古卷轴（原人类手册导航）
 * - BaguaIcon: 先天八卦（原新人生之路导航）
 * - TaijiIcon: 太极（原明镜导航）
 */
export interface IconProps {
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

// ─── 功能卡片图标 ─────────────────────────────────────

/** 柔和云朵 — 对称弧形，中间高两侧低（用于「徐」卡片） */
export const SoftCloudIcon = ({
  className,
  strokeWidth,
  style,
}: IconProps) => (
  <svg
    className={className}
    style={style}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 16.5 Q4 13 7.5 12.5 Q8 9 12 8.5 Q16 9 16.5 12.5 Q20 13 20 16.5 Q20 18 18 18.5 L6 18.5 Q4 18 4 16.5 Z" />
  </svg>
);

// ─── 底部导航栏图标 ──────────────────────────────────

/** 湖心亭 — 双层弧顶（有间隔层次感）+ 柱子 + 对称水波纹 */
export const PavilionIcon = ({
  className,
  strokeWidth,
  style,
}: IconProps) => (
  <svg
    className={className}
    style={style}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 上层小弧顶 */}
    <path d="M9 5.5 Q12 2 15 5.5" />
    {/* 下层大弧顶（与上层拉开 ~1.5 单位间距） */}
    <path d="M4 11 Q8 7 12 6.5 Q16 7 20 11" />
    {/* 横梁 */}
    <line x1="6" y1="11" x2="18" y2="11" />
    {/* 柱子 */}
    <line x1="8.5" y1="11" x2="8.5" y2="17" />
    <line x1="15.5" y1="11" x2="15.5" y2="17" />
    {/* 台基 */}
    <line x1="6.5" y1="17" x2="17.5" y2="17" />
    {/* 水波纹（严格对称于 x=12） */}
    <path
      d="M3 19.5 Q6 18.5 9 19.5 Q12 20.5 15 19.5 Q18 18.5 21 19.5"
      strokeWidth={(strokeWidth || 1.5) * 0.85}
      opacity="0.5"
    />
    <path
      d="M2 21.5 Q5.5 20.5 9 21.5 Q12 22.5 15 21.5 Q18.5 20.5 22 21.5"
      strokeWidth={(strokeWidth || 1.5) * 0.65}
      opacity="0.3"
    />
  </svg>
);

/** 古卷轴（立轴/画轴） — 天杆地杆等长 + 甲骨文"元"字 */
export const ScrollIcon = ({
  className,
  strokeWidth,
  style,
}: IconProps) => {
  const sw = strokeWidth || 1.5;
  return (
    <svg
      className={className}
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 天杆（顶部横轴） */}
      <line x1="4" y1="3" x2="20" y2="3" strokeWidth={sw * 1.4} />
      {/* 地杆（底部横轴，与天杆等长） */}
      <line x1="4" y1="21" x2="20" y2="21" strokeWidth={sw * 1.4} />
      {/* 卷面左右竖线（起止内缩避免与横杆重叠） */}
      <line x1="6.5" y1="4.5" x2="6.5" y2="19.5" strokeLinecap="butt" strokeWidth={sw * 0.7} />
      <line x1="17.5" y1="4.5" x2="17.5" y2="19.5" strokeLinecap="butt" strokeWidth={sw * 0.7} />
      {/* 甲骨文"元"字（加粗加深，手机可辨） */}
      <g opacity="0.7" strokeWidth="1.1" strokeLinecap="round" fill="none">
        <line x1="9" y1="7.5" x2="15" y2="7.5" />
        <circle cx="12" cy="9.8" r="1.4" />
        <path d="M12 11.2 L9.2 15.5 M12 11.2 L14.8 15.5" />
      </g>
    </svg>
  );
};

/** 先天八卦 — 8组三爻，细线条，无外圈，无中心，空心 */
export const BaguaIcon = ({ className, style }: IconProps) => {
  const trigrams: { angle: number; lines: [boolean, boolean, boolean] }[] = [
    { angle: 0, lines: [true, true, true] },
    { angle: 45, lines: [false, true, true] },
    { angle: 90, lines: [false, true, false] },
    { angle: 135, lines: [false, false, true] },
    { angle: 180, lines: [false, false, false] },
    { angle: 225, lines: [true, false, false] },
    { angle: 270, lines: [true, false, true] },
    { angle: 315, lines: [true, true, false] },
  ];

  const lineYs = [6.5, 4.8, 3.0];
  const x1 = 10.2, x2 = 13.8;
  const bL1 = 10.2, bL2 = 11.4;
  const bR1 = 12.6, bR2 = 13.8;

  return (
    <svg
      className={className}
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.9}
      strokeLinecap="butt"
    >
      {trigrams.map((tri) => (
        <g key={tri.angle} transform={`rotate(${tri.angle}, 12, 12)`}>
          {tri.lines.map((isSolid, i) =>
            isSolid ? (
              <line key={i} x1={x1} y1={lineYs[i]} x2={x2} y2={lineYs[i]} />
            ) : (
              <g key={i}>
                <line x1={bL1} y1={lineYs[i]} x2={bL2} y2={lineYs[i]} />
                <line x1={bR1} y1={lineYs[i]} x2={bR2} y2={lineYs[i]} />
              </g>
            )
          )}
        </g>
      ))}
    </svg>
  );
};

/** 太极 — S曲线 + 阴阳点 */
export const TaijiIcon = ({
  className,
  strokeWidth,
  style,
}: IconProps) => (
  <svg
    className={className}
    style={style}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <clipPath id="taiji-inner">
        <circle cx="12" cy="12" r="9.2" />
      </clipPath>
    </defs>
    <circle cx="12" cy="12" r="10" />
    <g clipPath="url(#taiji-inner)">
      <path
        d="M12 2 A5 5 0 0 1 12 12 A5 5 0 0 0 12 22"
        fill="none"
        strokeLinecap="butt"
      />
    </g>
    <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17" r="1.5" fill="none" />
  </svg>
);