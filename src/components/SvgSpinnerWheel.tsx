import React, { useRef, useEffect } from 'react';

interface Segment {
  label: string;
  color: string;
}

interface SvgSpinnerWheelProps {
  segments: Segment[];
  winnerIndex: number | null;
  spinning: boolean;
  onSpinEnd?: (winnerIndex: number) => void;
}

const WHEEL_SIZE = 340;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = CENTER - 10;
const FONT_SIZE = 16;
const SPIN_DURATION = 4000; // ms

function getRotation(winnerIndex: number, segments: number) {
  // The wheel should stop with the winner at the top (0deg)
  const anglePerSegment = 360 / segments;
  // Offset so the winner is at the pointer (top)
  return 360 * 5 + (360 - winnerIndex * anglePerSegment - anglePerSegment / 2);
}

export const SvgSpinnerWheel: React.FC<SvgSpinnerWheelProps> = ({
  segments,
  winnerIndex,
  spinning,
  onSpinEnd,
}) => {
  const [rotation, setRotation] = React.useState(0);
  const [isSpinning, setIsSpinning] = React.useState(false);

  // Reset rotation to 0 and isSpinning to false before each spin, then start spin after a short delay
  useEffect(() => {
    if (spinning && winnerIndex !== null) {
      setIsSpinning(false);
      setRotation(0);
      const spinTimeout = setTimeout(() => {
        setIsSpinning(true);
        const finalRotation = getRotation(winnerIndex, segments.length);
        setRotation(finalRotation);
        setTimeout(() => {
          setIsSpinning(false);
          if (onSpinEnd) onSpinEnd(winnerIndex);
        }, SPIN_DURATION);
      }, 50); // 50ms delay to ensure reset is rendered
      return () => clearTimeout(spinTimeout);
    }
    // eslint-disable-next-line
  }, [spinning, winnerIndex, segments.length, onSpinEnd]);

  // Draw pie slices
  const paths = segments.map((seg, i) => {
    const angle = (2 * Math.PI) / segments.length;
    const startAngle = i * angle - Math.PI / 2;
    const endAngle = startAngle + angle;
    const x1 = CENTER + RADIUS * Math.cos(startAngle);
    const y1 = CENTER + RADIUS * Math.sin(startAngle);
    const x2 = CENTER + RADIUS * Math.cos(endAngle);
    const y2 = CENTER + RADIUS * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = [
      `M ${CENTER} ${CENTER}`,
      `L ${x1} ${y1}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
    return (
      <path key={i} d={d} fill={seg.color} stroke="#fff" strokeWidth={2} />
    );
  });

  // Draw labels
  const labels = segments.map((seg, i) => {
    const angle = (2 * Math.PI) / segments.length;
    const theta = i * angle + angle / 2 - Math.PI / 2;
    const x = CENTER + (RADIUS - 40) * Math.cos(theta);
    const y = CENTER + (RADIUS - 40) * Math.sin(theta);
    return (
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={FONT_SIZE}
        fill="#fff"
        fontWeight="bold"
        style={{
          textShadow: '1px 1px 4px #000',
          pointerEvents: 'none',
        }}
      >
        {seg.label}
      </text>
    );
  });

  return (
    <div className="relative w-[340px] h-[340px] mx-auto">
      <svg
        width={WHEEL_SIZE}
        height={WHEEL_SIZE}
        style={{
          transition: isSpinning ? `transform ${SPIN_DURATION}ms cubic-bezier(0.33,1,0.68,1)` : undefined,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {paths}
        {labels}
        {/* Center circle */}
        <circle cx={CENTER} cy={CENTER} r={40} fill="#fff" stroke="#ccc" strokeWidth={4} />
      </svg>
      {/* Pointer */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderBottom: '32px solid #e74c3c' }}
      />
    </div>
  );
}; 