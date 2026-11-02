import React from 'react';

interface GreekMeanderProps {
  color?: string;
  glow?: boolean;
  className?: string;
  height?: number;
}

/**
 * Authentic Hellenic Meander (Greek Key) fretwork SVG pattern.
 * Symbolizes infinity, triumph, and eternal glory.
 */
export const GreekMeander: React.FC<GreekMeanderProps> = ({
  color = '#00f0ff',
  glow = true,
  className = '',
  height = 14
}) => {
  return (
    <div
      className={`w-full overflow-hidden flex items-center select-none ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg
        className="w-full h-full"
        style={{
          filter: glow ? `drop-shadow(0 0 6px ${color}88)` : undefined
        }}
        preserveAspectRatio="repeat-x"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`meander-pat-${color.replace('#', '')}`}
            width="28"
            height={height}
            patternUnits="userSpaceOnUse"
          >
            {/* Classic Greek Key Fret path */}
            <path
              d="M0 1 h26 v12 h-8 v-8 h-8 v4 h4 v-2 h-2"
              fill="none"
              stroke={color}
              strokeWidth="1.6"
              strokeLinecap="square"
              strokeLinejoin="miter"
              opacity="0.85"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#meander-pat-${color.replace('#', '')})`}
        />
      </svg>
    </div>
  );
};
