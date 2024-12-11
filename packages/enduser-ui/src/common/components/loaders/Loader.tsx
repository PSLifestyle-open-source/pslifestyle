import { cos, sin } from "mathjs";

const BASE = 16; // 16px = 1rem
const REM = (n: number) => n * BASE;
const SIDE = REM(4);
const RADIUS = REM(0.5);
const CENTER_RADIUS = REM(1);

// Pi is confusing, use Tau.
const TAU = 2 * Math.PI;

// Divide full circle to 5 parts
const ANGLES = [0, 1, 2, 3, 4].map((n) => (n * TAU) / 5);

// Origin of our coordinates
const CENTER = SIDE / 2;

// Transform polar coordinates to cartesian coordinates
const POINTS = ANGLES.map((a) => ({
  x: CENTER + cos(a) * CENTER_RADIUS,
  y: CENTER + sin(a) * CENTER_RADIUS,
}));

const ANIMATION_DURATION = 750;

const THEMES = [
  "fill-yellow-100",
  "fill-orange-100",
  "fill-green-100",
  "fill-pink-100",
  "fill-cyan-100",
];

export const Loader = () => (
  <svg width={SIDE} height={SIDE} className="fill-transparent rotate-90">
    {POINTS.map(({ x, y }, i) => (
      <circle
        key={`${x}${y}`}
        cx={x}
        cy={y}
        r={RADIUS}
        className={`${THEMES[i]} animate-pulse`}
        style={{
          animationDelay: `${i * (ANIMATION_DURATION / 5)}ms`,
          animationDuration: `${ANIMATION_DURATION}ms`,
        }}
      />
    ))}
  </svg>
);
