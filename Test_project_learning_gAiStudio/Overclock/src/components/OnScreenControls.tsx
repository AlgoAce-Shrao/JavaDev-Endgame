import React, { useState } from 'react';
import { GameEngine } from '../game/systems/GameEngine';
import { Crosshair, Zap, Flame, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface OnScreenControlsProps {
  engine: GameEngine;
}

export const OnScreenControls: React.FC<OnScreenControlsProps> = ({ engine }) => {
  const [activeDirections, setActiveDirections] = useState<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const [activeAimDirections, setActiveAimDirections] = useState<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const [isCenterFiring, setIsCenterFiring] = useState(false);

  // Movement D-Pad Handlers
  const updateVirtualDir = (newDirs: { up: boolean; down: boolean; left: boolean; right: boolean }) => {
    let dx = 0;
    let dy = 0;
    if (newDirs.up) dy -= 1;
    if (newDirs.down) dy += 1;
    if (newDirs.left) dx -= 1;
    if (newDirs.right) dx += 1;
    engine.setVirtualInput({ x: dx, y: dy });
  };

  const handleDirStart = (dir: 'up' | 'down' | 'left' | 'right') => {
    setActiveDirections((prev) => {
      const next = { ...prev, [dir]: true };
      updateVirtualDir(next);
      return next;
    });
  };

  const handleDirEnd = (dir: 'up' | 'down' | 'left' | 'right') => {
    setActiveDirections((prev) => {
      const next = { ...prev, [dir]: false };
      updateVirtualDir(next);
      return next;
    });
  };

  // Directional Aim & Fire Pad Handlers
  const updateVirtualAim = (newAim: { up: boolean; down: boolean; left: boolean; right: boolean }) => {
    let dx = 0;
    let dy = 0;
    if (newAim.up) dy -= 1;
    if (newAim.down) dy += 1;
    if (newAim.left) dx -= 1;
    if (newAim.right) dx += 1;

    if (dx !== 0 || dy !== 0) {
      engine.setVirtualAim({ x: dx, y: dy }, true);
    } else {
      engine.setVirtualAim(null, false);
    }
  };

  const handleAimFireStart = (dir: 'up' | 'down' | 'left' | 'right') => {
    setActiveAimDirections((prev) => {
      const next = { ...prev, [dir]: true };
      updateVirtualAim(next);
      return next;
    });
  };

  const handleAimFireEnd = (dir: 'up' | 'down' | 'left' | 'right') => {
    setActiveAimDirections((prev) => {
      const next = { ...prev, [dir]: false };
      updateVirtualAim(next);
      return next;
    });
  };

  const handleCenterFireStart = () => {
    setIsCenterFiring(true);
    engine.triggerFire(true);
  };

  const handleCenterFireEnd = () => {
    setIsCenterFiring(false);
    engine.triggerFire(false);
  };

  const handleDash = () => {
    engine.triggerDash();
  };

  const handleOverclock = () => {
    engine.toggleOverclock();
  };

  return (
    <div
      id="onscreen-controls-layer"
      className="absolute inset-x-0 bottom-3 px-3 flex items-end justify-between pointer-events-none z-30 select-none"
    >
      {/* LEFT: MOVEMENT CLUSTER */}
      <div className="pointer-events-auto flex flex-col items-center gap-1 bg-black/75 p-2 border border-[#00ff9f]/30 backdrop-blur-xs shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        <div className="text-[9px] text-white/50 tracking-wider font-bold">MOVE</div>
        <button
          id="btn-ctrl-up"
          onPointerDown={() => handleDirStart('up')}
          onPointerUp={() => handleDirEnd('up')}
          onPointerLeave={() => handleDirEnd('up')}
          className={`w-10 h-10 border border-[#00ff9f]/50 flex items-center justify-center font-bold text-xs ${
            activeDirections.up ? 'bg-[#00ff9f] text-black' : 'bg-[#070907] text-[#00ff9f]'
          }`}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex gap-1">
          <button
            id="btn-ctrl-left"
            onPointerDown={() => handleDirStart('left')}
            onPointerUp={() => handleDirEnd('left')}
            onPointerLeave={() => handleDirEnd('left')}
            className={`w-10 h-10 border border-[#00ff9f]/50 flex items-center justify-center font-bold text-xs ${
              activeDirections.left ? 'bg-[#00ff9f] text-black' : 'bg-[#070907] text-[#00ff9f]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            id="btn-ctrl-down"
            onPointerDown={() => handleDirStart('down')}
            onPointerUp={() => handleDirEnd('down')}
            onPointerLeave={() => handleDirEnd('down')}
            className={`w-10 h-10 border border-[#00ff9f]/50 flex items-center justify-center font-bold text-xs ${
              activeDirections.down ? 'bg-[#00ff9f] text-black' : 'bg-[#070907] text-[#00ff9f]'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            id="btn-ctrl-right"
            onPointerDown={() => handleDirStart('right')}
            onPointerUp={() => handleDirEnd('right')}
            onPointerLeave={() => handleDirEnd('right')}
            className={`w-10 h-10 border border-[#00ff9f]/50 flex items-center justify-center font-bold text-xs ${
              activeDirections.right ? 'bg-[#00ff9f] text-black' : 'bg-[#070907] text-[#00ff9f]'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT: DIRECTIONAL AIM & FIRE CLUSTER + SPECIAL ACTIONS */}
      <div className="pointer-events-auto flex items-end gap-2">
        {/* Special Actions: Dash & Overclock */}
        <div className="flex flex-col gap-1.5 bg-black/75 p-1.5 border border-[#00ff9f]/30 backdrop-blur-xs">
          <button
            id="btn-ctrl-dash"
            onPointerDown={handleDash}
            className="w-10 h-10 bg-[#070907] active:bg-[#00ff9f] active:text-black border border-[#00ff9f]/60 flex flex-col items-center justify-center text-[9px] font-black text-[#00ff9f] cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>DASH</span>
          </button>

          <button
            id="btn-ctrl-overclock"
            onPointerDown={handleOverclock}
            className="w-10 h-10 bg-[#1a070a] active:bg-[#ff3e3e] active:text-white border border-[#ff3e3e]/80 flex flex-col items-center justify-center text-[9px] font-black text-[#ff3e3e] cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>OVER</span>
          </button>
        </div>

        {/* Directional Aim & Fire 4-Way Pad */}
        <div className="flex flex-col items-center gap-1 bg-black/75 p-2 border border-[#00ff9f]/30 backdrop-blur-xs shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <div className="text-[9px] text-[#00ff9f] tracking-wider font-bold">AIM & FIRE</div>
          <button
            id="btn-aim-fire-up"
            onPointerDown={() => handleAimFireStart('up')}
            onPointerUp={() => handleAimFireEnd('up')}
            onPointerLeave={() => handleAimFireEnd('up')}
            className={`w-10 h-10 border border-[#00ff9f] flex flex-col items-center justify-center font-black text-[9px] ${
              activeAimDirections.up ? 'bg-[#00ff9f] text-black shadow-[0_0_10px_#00ff9f]' : 'bg-[#0a1a14] text-[#00ff9f]'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>UP</span>
          </button>

          <div className="flex gap-1">
            <button
              id="btn-aim-fire-left"
              onPointerDown={() => handleAimFireStart('left')}
              onPointerUp={() => handleAimFireEnd('left')}
              onPointerLeave={() => handleAimFireEnd('left')}
              className={`w-10 h-10 border border-[#00ff9f] flex flex-col items-center justify-center font-black text-[9px] ${
                activeAimDirections.left ? 'bg-[#00ff9f] text-black shadow-[0_0_10px_#00ff9f]' : 'bg-[#0a1a14] text-[#00ff9f]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>LFT</span>
            </button>

            {/* Center Cursor Fire */}
            <button
              id="btn-aim-fire-center"
              onPointerDown={handleCenterFireStart}
              onPointerUp={handleCenterFireEnd}
              onPointerLeave={handleCenterFireEnd}
              className={`w-10 h-10 border-2 border-amber-400 flex flex-col items-center justify-center font-black text-[8px] cursor-pointer ${
                isCenterFiring ? 'bg-amber-400 text-black' : 'bg-[#1a1405] text-amber-400'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>AUTO</span>
            </button>

            <button
              id="btn-aim-fire-right"
              onPointerDown={() => handleAimFireStart('right')}
              onPointerUp={() => handleAimFireEnd('right')}
              onPointerLeave={() => handleAimFireEnd('right')}
              className={`w-10 h-10 border border-[#00ff9f] flex flex-col items-center justify-center font-black text-[9px] ${
                activeAimDirections.right ? 'bg-[#00ff9f] text-black shadow-[0_0_10px_#00ff9f]' : 'bg-[#0a1a14] text-[#00ff9f]'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>RGT</span>
            </button>
          </div>

          <button
            id="btn-aim-fire-down"
            onPointerDown={() => handleAimFireStart('down')}
            onPointerUp={() => handleAimFireEnd('down')}
            onPointerLeave={() => handleAimFireEnd('down')}
            className={`w-10 h-10 border border-[#00ff9f] flex flex-col items-center justify-center font-black text-[9px] ${
              activeAimDirections.down ? 'bg-[#00ff9f] text-black shadow-[0_0_10px_#00ff9f]' : 'bg-[#0a1a14] text-[#00ff9f]'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>DWN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
