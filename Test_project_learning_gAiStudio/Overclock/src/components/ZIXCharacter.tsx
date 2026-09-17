/**
 * OVERCLOCK — ZIX Character Component
 * A small holographic alien maintenance creature rendered as a compact SVG avatar.
 * Personality: curious, energetic, slightly sarcastic, friendly, helpful, weird.
 */

import React, { useState, useEffect } from 'react';

interface ZIXCharacterProps {
  isSpeaking?: boolean;
  mood?: 'idle' | 'excited' | 'sarcastic' | 'concerned' | 'celebrating';
  size?: number;
}

export const ZIXCharacter: React.FC<ZIXCharacterProps> = ({
  isSpeaking = false,
  mood = 'idle',
  size = 80,
}) => {
  const [blinkTimer, setBlinkTimer] = useState(false);
  const [hoverBounce, setHoverBounce] = useState(false);

  // Random blink
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setBlinkTimer(true);
        setTimeout(() => setBlinkTimer(false), 150);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Speaking bounce
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setHoverBounce((prev) => !prev);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  // Eye color based on mood
  const eyeColor = mood === 'excited' ? '#39ff14'
    : mood === 'sarcastic' ? '#ffaa00'
    : mood === 'concerned' ? '#ff3e3e'
    : mood === 'celebrating' ? '#00ff9f'
    : '#00f0ff';

  const bodyColor = mood === 'excited' ? '#39ff14' : '#00f0ff';

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 8px ${bodyColor}40)`,
        transform: hoverBounce ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 0.15s ease',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="select-none"
      >
        {/* Holographic scan lines */}
        <defs>
          <linearGradient id="holoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={bodyColor} stopOpacity="0.3" />
            <stop offset="50%" stopColor={bodyColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={bodyColor} stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Holographic base circle */}
        <circle
          cx="50" cy="55" r="30"
          fill="url(#holoGrad)"
          stroke={bodyColor}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Body - small alien shape */}
        <ellipse
          cx="50" cy="52" rx="18" ry="22"
          fill="#0a1a14"
          stroke={bodyColor}
          strokeWidth="1.5"
          filter="url(#glow)"
        />

        {/* Antenna */}
        <line
          x1="50" y1="30" x2="50" y2="18"
          stroke={bodyColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="50" cy="16" r="3"
          fill={isSpeaking ? eyeColor : bodyColor}
          opacity={isSpeaking ? 1 : 0.6}
        >
          {isSpeaking && (
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="0.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Eyes */}
        <g>
          {/* Left eye */}
          <ellipse
            cx="43" cy="48"
            rx={blinkTimer ? 4 : 4}
            ry={blinkTimer ? 0.5 : 5}
            fill={eyeColor}
            filter="url(#glow)"
          />
          {/* Right eye */}
          <ellipse
            cx="57" cy="48"
            rx={blinkTimer ? 4 : 4}
            ry={blinkTimer ? 0.5 : 5}
            fill={eyeColor}
            filter="url(#glow)"
          />
          {/* Eye highlights */}
          {!blinkTimer && (
            <>
              <circle cx="44" cy="46" r="1.5" fill="white" opacity="0.6" />
              <circle cx="58" cy="46" r="1.5" fill="white" opacity="0.6" />
            </>
          )}
        </g>

        {/* Mouth - changes with mood */}
        {mood === 'excited' || mood === 'celebrating' ? (
          <path
            d="M 42 58 Q 50 66 58 58"
            fill="none"
            stroke={eyeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ) : mood === 'sarcastic' ? (
          <path
            d="M 44 60 L 56 58"
            fill="none"
            stroke={eyeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ) : mood === 'concerned' ? (
          <path
            d="M 44 62 Q 50 58 56 62"
            fill="none"
            stroke="#ff3e3e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 44 60 Q 50 63 56 60"
            fill="none"
            stroke={eyeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}

        {/* Arms - small appendages */}
        <line
          x1="32" y1="50" x2="24" y2="55"
          stroke={bodyColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="68" y1="50" x2="76" y2="55"
          stroke={bodyColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Holographic shimmer effect */}
        <rect
          x="30" y="30" width="40" height="40"
          fill="none"
          stroke={bodyColor}
          strokeWidth="0.5"
          strokeOpacity="0.2"
          strokeDasharray="2 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0;24"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>

      {/* Holographic label */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold tracking-widest whitespace-nowrap"
        style={{ color: bodyColor }}
      >
        ZIX
      </div>
    </div>
  );
};
