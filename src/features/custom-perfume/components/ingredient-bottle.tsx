import {useId, type CSSProperties} from 'react';
import {getIngredientLiquidLevel, liquidBounds} from './ingredient-liquid';
import styles from './ingredient-preview.module.css';

type IngredientBottleProps = {
  selectedCount: number;
  animationKey: number;
  hasNewDrop: boolean;
  complete: boolean;
};

export function IngredientBottle({
  selectedCount,
  animationKey,
  hasNewDrop,
  complete
}: IngredientBottleProps) {
  const clipId = useId();
  const gradientId = useId();
  const {offset, surfaceY} = getIngredientLiquidLevel(selectedCount);
  const liquidStyle: CSSProperties & Record<'--liquid-offset' | '--drop-distance', string> = {
    '--liquid-offset': `${offset}px`,
    '--drop-distance': `${surfaceY - 41}px`
  };

  return (
    <div className={styles.bottleStage} data-active={selectedCount > 0} style={liquidStyle}>
      <svg viewBox="0 0 320 360" className={styles.bottle} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId}>
            <rect x="80" y={liquidBounds.top} width="160" height={liquidBounds.height} rx="22" />
          </clipPath>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.14" />
          </linearGradient>
        </defs>
        <circle cx="160" cy="208" r="127" fill="none" stroke="var(--primary)" strokeOpacity="0.1" />
        <circle
          cx="160"
          cy="208"
          r="108"
          fill="none"
          stroke="var(--primary)"
          strokeOpacity="0.08"
          strokeDasharray="2 10"
        />
        <ellipse cx="160" cy="326" rx="82" ry="9" fill="var(--overlay)" opacity="0.6" />
        <rect
          x="105"
          y="66"
          width="110"
          height="39"
          rx="5"
          fill="var(--secondary)"
          stroke="var(--primary)"
          strokeOpacity="0.5"
        />
        {[118, 130, 142, 154, 166, 178, 190, 202].map((x) => (
          <path key={x} d={`M${x} 72v27`} stroke="var(--primary)" strokeOpacity="0.15" />
        ))}
        <rect
          x="132"
          y="105"
          width="56"
          height="26"
          rx="3"
          fill="var(--primary)"
          fillOpacity="0.25"
          stroke="var(--primary)"
          strokeOpacity="0.5"
        />
        <rect
          x="74"
          y="130"
          width="172"
          height="184"
          rx="27"
          fill="var(--foreground)"
          fillOpacity="0.025"
          stroke="var(--primary)"
          strokeOpacity="0.65"
        />
        <g clipPath={`url(#${clipId})`}>
          <g className={styles.liquidLevel}>
            <rect
              x="80"
              y={liquidBounds.top}
              width="160"
              height={liquidBounds.height + 10}
              fill={`url(#${gradientId})`}
            />
            <path
              className={styles.wave}
              d={`M40 ${liquidBounds.top}q30-8 60 0t60 0t60 0t60 0v190H40Z`}
              fill="var(--primary)"
              fillOpacity="0.18"
            />
          </g>
        </g>
        <path
          d="M88 154v128q0 17 12 20M231 154v89"
          fill="none"
          stroke="var(--foreground)"
          strokeOpacity="0.15"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="103"
          y="173"
          width="114"
          height="77"
          rx="2"
          fill="var(--background)"
          fillOpacity="0.9"
          stroke="var(--primary)"
          strokeOpacity="0.4"
        />
        <text x="160" y="205" textAnchor="middle" className={styles.bottleWordmark}>
          PERFUME.
        </text>
        <text x="160" y="222" textAnchor="middle" className={styles.bottleCaption}>
          YOUR SCENT STORY
        </text>
        {[140, 160, 180].map((x, index) => (
          <circle
            key={x}
            cx={x}
            cy="236"
            r="3"
            fill="var(--primary)"
            opacity={index < selectedCount ? 1 : 0.15}
          />
        ))}
        {hasNewDrop && (
          <g key={animationKey}>
            <path
              className={styles.drop}
              d="M160 26c0 0-8 10-8 15a8 8 0 0 0 16 0c0-5-8-15-8-15Z"
              fill="var(--primary)"
            />
            <ellipse
              className={styles.ripple}
              cx="160"
              cy={surfaceY}
              rx="39"
              ry="9"
              fill="none"
              stroke="var(--primary)"
            />
            {complete && (
              <circle
                className={styles.finishHalo}
                cx="160"
                cy="210"
                r="115"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
