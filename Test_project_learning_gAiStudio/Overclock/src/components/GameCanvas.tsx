import React, { useEffect, useRef, useCallback, useState } from 'react';
import { GameEngine } from '../game/systems/GameEngine';
import { MousePointerClick, ShieldCheck, Crosshair } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface GameCanvasProps {
  engine: GameEngine;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Render & Engine Update Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      engine.update(dt);
      engine.render(ctx);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [engine]);

  // Handle Resize and coordinate scaling
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const targetW = Math.max(640, Math.floor(rect.width));
      const targetH = Math.max(480, Math.floor(rect.height));

      canvas.width = targetW;
      canvas.height = targetH;
      engine.arenaWidth = targetW;
      engine.arenaHeight = targetH;
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    handleResize();

    return () => {
      ro.disconnect();
    };
  }, [engine]);

  // Auto-focus container when mounted or when game starts
  useEffect(() => {
    const attemptFocus = () => {
      if (containerRef.current) {
        containerRef.current.focus();
        setIsFocused(document.activeElement === containerRef.current);
      }
    };

    attemptFocus();
    const timer = setTimeout(attemptFocus, 100);
    return () => clearTimeout(timer);
  }, [engine.mode]);

  // Track window focus/blur
  useEffect(() => {
    const onWindowFocus = () => {
      if (containerRef.current) {
        containerRef.current.focus();
        setIsFocused(true);
      }
    };

    const onWindowBlur = () => {
      setIsFocused(false);
      engine.clearKeys();
    };

    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('blur', onWindowBlur);

    return () => {
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, [engine]);

  // Translate client coordinates to Canvas logical pixels
  const updatePointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      engine.handleMouseMove(x, y);
    },
    [engine]
  );

  // Global Pointer Listeners for robust click, drag, and release
  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      updatePointerPosition(e.clientX, e.clientY);
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      engine.handleMouseUp(e.button);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [engine, updatePointerPosition]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.focus();
      setIsFocused(true);
    }
    updatePointerPosition(e.clientX, e.clientY);
    engine.handleMouseDown(e.button);
  };

  const handleFocusExplicit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      containerRef.current.focus();
      setIsFocused(true);
      soundSynth.playUiClick();
    }
  };

  return (
    <div
      ref={containerRef}
      id="game-canvas-container"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black select-none cursor-crosshair outline-none"
    >
      <canvas
        ref={canvasRef}
        id="combat-canvas"
        className="w-full h-full block touch-none"
      />

      {/* TACTICAL INPUT LINK STATUS BADGE */}
      <div
        id="input-focus-status-badge"
        className="absolute bottom-3 left-3 pointer-events-none z-20 flex items-center gap-1.5 px-2 py-1 bg-black/75 border text-[10px] font-mono tracking-widest backdrop-blur-xs"
        style={{
          borderColor: isFocused ? '#00ff9f44' : '#ffaa0088',
          color: isFocused ? '#00ff9f' : '#ffaa00',
        }}
      >
        {isFocused ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-pulse" />
            <ShieldCheck className="w-3 h-3 text-[#00ff9f]" />
            <span>LINK: ENGAGED [DIRECT INPUT]</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <MousePointerClick className="w-3 h-3 text-amber-400" />
            <span>LINK: UNBOUND [CLICK TO RESUME]</span>
          </>
        )}
      </div>

      {/* CLICK-TO-FOCUS OVERLAY (Shown when arena loses focus during active gameplay) */}
      {!isFocused && engine.mode === 'PLAYING' && (
        <div
          id="click-to-focus-overlay"
          onClick={handleFocusExplicit}
          className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
        >
          <div className="border-2 border-[#00ff9f] bg-[#070907]/95 px-8 py-6 max-w-md mx-4 text-center shadow-[0_0_35px_rgba(0,255,159,0.35)] space-y-3 font-mono">
            <div className="flex justify-center">
              <div className="p-3 bg-[#00ff9f]/10 border border-[#00ff9f]/40 rounded-full animate-bounce">
                <Crosshair className="w-8 h-8 text-[#00ff9f]" />
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#00ff9f] mb-1">
                INPUT STREAM DISCONNECTED
              </div>
              <h3 className="text-xl font-black tracking-widest text-white">
                CLICK TO FOCUS CONTROLS
              </h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Click anywhere in the arena to engage controls: Move with <span className="text-[#00ff9f] font-bold">[W][A][S][D]</span>, Fire in any chosen direction with <span className="text-[#00ff9f] font-bold">[ARROWS] / [IJKL]</span>, Cursor fire with <span className="text-[#00ff9f] font-bold">Left Click / [J] / [F]</span>, Dash with <span className="text-[#00ff9f] font-bold">[Space] / Right Click</span>.
            </p>

            <button
              type="button"
              className="mt-2 w-full py-2.5 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_#00ff9f] cursor-pointer"
            >
              <MousePointerClick className="w-4 h-4" />
              ENGAGE TACTICAL LINK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
