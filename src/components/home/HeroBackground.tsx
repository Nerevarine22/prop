'use client';

import React from 'react';

export function HeroBackground() {
  // Micro-fractal trading path: exact macro wave from user sketch + fine sub-angle zigzags
  const detailedPoints = [
    // Leg 1: (20, 430) -> (110, 270)
    { x: 20,   y: 430 },
    { x: 45,   y: 390 },
    { x: 60,   y: 398 },
    { x: 85,   y: 335 },
    { x: 95,   y: 342 },
    { x: 110,  y: 270 }, // Peak 1

    // Leg 2: (110, 270) -> (190, 360)
    { x: 135,  y: 305 },
    { x: 148,  y: 298 },
    { x: 170,  y: 340 },
    { x: 180,  y: 332 },
    { x: 190,  y: 360 }, // Valley 1

    // Leg 3: (190, 360) -> (260, 210)
    { x: 210,  y: 320 },
    { x: 222,  y: 328 },
    { x: 240,  y: 255 },
    { x: 250,  y: 262 },
    { x: 260,  y: 210 }, // Peak 2

    // Leg 4: (260, 210) -> (330, 330)
    { x: 280,  y: 250 },
    { x: 292,  y: 242 },
    { x: 312,  y: 300 },
    { x: 320,  y: 292 },
    { x: 330,  y: 330 }, // Valley 2

    // Leg 5: (330, 330) -> (470, 110)
    { x: 360,  y: 280 },
    { x: 375,  y: 288 },
    { x: 410,  y: 205 },
    { x: 425,  y: 215 },
    { x: 450,  y: 140 },
    { x: 470,  y: 110 }, // MAJOR HIGH PEAK

    // Leg 6: (470, 110) -> (620, 330)
    { x: 500,  y: 160 },
    { x: 515,  y: 152 },
    { x: 545,  y: 230 },
    { x: 560,  y: 222 },
    { x: 595,  y: 295 },
    { x: 620,  y: 330 }, // Deep Correction Valley

    // Leg 7: (620, 330) -> (740, 140)
    { x: 650,  y: 280 },
    { x: 665,  y: 288 },
    { x: 695,  y: 200 },
    { x: 710,  y: 208 },
    { x: 740,  y: 140 }, // Shoulder Peak

    // Leg 8: (740, 140) -> (840, 290)
    { x: 765,  y: 185 },
    { x: 778,  y: 178 },
    { x: 805,  y: 245 },
    { x: 818,  y: 238 },
    { x: 840,  y: 290 }, // Valley

    // Leg 9: (840, 290) -> (940, 200)
    { x: 865,  y: 260 },
    { x: 878,  y: 268 },
    { x: 910,  y: 220 },
    { x: 922,  y: 226 },
    { x: 940,  y: 200 }, // Swing Peak

    // Leg 10: (940, 200) -> (1010, 240)
    { x: 960,  y: 215 },
    { x: 972,  y: 208 },
    { x: 995,  y: 232 },
    { x: 1010, y: 240 }, // Small Valley

    // Leg 11: (1010, 240) -> (1170, 30)
    { x: 1040, y: 190 },
    { x: 1055, y: 198 },
    { x: 1088, y: 130 },
    { x: 1102, y: 138 },
    { x: 1140, y: 65 },
    { x: 1170, y: 30 },  // Final Breakout Peak
  ];

  // Construct fine polyline path
  const pathD = detailedPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Render ONLY the main key candles at key breakout points & turning pivots
  const mainCandleIndices = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  const mainCandlesticks = mainCandleIndices.map((idx) => {
    const pt = detailedPoints[Math.min(idx, detailedPoints.length - 1)];
    const isBull = idx % 2 === 0;
    const bodyHeight = 16 + (idx % 3) * 4;
    const top = isBull ? pt.y - 2 : pt.y - bodyHeight + 2;
    const width = 10;
    const wickLen = 10;
    const high = top - wickLen;
    const low = top + bodyHeight + wickLen;

    return { x: pt.x, top, bodyHeight, width, high, low, isBull };
  });

  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none z-0">
      {/* Abstract Pure Grey Trading Chart - Lowered Opacity by ~5% to 0.19 */}
      <div className="absolute inset-0 w-full h-full opacity-[0.19] transform-gpu">
        <svg
          viewBox="0 0 1200 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Polyline Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.85"
          />

          {/* ONLY Main Key Candlesticks at Turning Pivots */}
          {mainCandlesticks.map((candle, i) => (
            <g key={i}>
              <line
                x1={candle.x}
                y1={candle.high}
                x2={candle.x}
                y2={candle.low}
                stroke="#a1a1aa"
                strokeWidth="1.3"
                strokeOpacity="0.85"
              />
              <rect
                x={candle.x - candle.width / 2}
                y={candle.top}
                width={candle.width}
                height={candle.bodyHeight}
                rx="1"
                fill={candle.isBull ? '#a1a1aa' : 'none'}
                fillOpacity={candle.isBull ? '0.45' : '0'}
                stroke="#a1a1aa"
                strokeWidth="1.3"
                strokeOpacity="0.85"
              />
            </g>
          ))}

          {/* End Terminal Marker Dot */}
          <circle cx="1170" cy="30" r="3.5" fill="#a1a1aa" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}
