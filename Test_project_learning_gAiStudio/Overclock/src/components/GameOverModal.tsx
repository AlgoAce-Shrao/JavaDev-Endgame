import React from 'react';
import { TelemetrySnapshot } from '../game/types';
import { RotateCcw, AlertTriangle, LayoutGrid } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface GameOverModalProps {
  telemetry: TelemetrySnapshot;
  onRestart: () => void;
  onReturnToSelect?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  telemetry,
  onRestart,
  onReturnToSelect,
}) => {
  const { score, kills, overclockKills, gameTimeSec, heat, heatState, missionCode, missionName, isEndlessMode, endlessWaveNumber } = telemetry;
  const isMeltdown = heatState === 'MELTDOWN' || heat >= 100;

  return (
    <div
      id="game-over-modal-overlay"
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-6 font-mono select-none"
    >
      <div className="w-full max-w-lg bg-[#070907] border-2 border-[#ff3e3e] p-8 shadow-[0_0_50px_rgba(255,62,62,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ff3e3e]/40 pb-3 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#ff3e3e] animate-pulse" />
            <div>
              <h2 className="text-xl font-black tracking-widest text-[#ff3e3e]">
                SYSTEM CRITICAL FAILURE
              </h2>
              <div className="text-xs text-slate-400">
                {isEndlessMode ? `ENDLESS SECTOR (WAVE ${endlessWaveNumber})` : `${missionCode}: ${missionName}`}
              </div>
            </div>
          </div>
        </div>

        {/* Machine Autopsy Diagnosis */}
        <div className="bg-black/80 border border-[#ff3e3e]/30 p-4 mb-6 text-xs space-y-2 text-white/80">
          <div className="flex justify-between">
            <span className="text-white/60">CORE TEMPERATURE AT TERMINATION:</span>
            <span className="text-[#ff3e3e] font-bold">{Math.round(heat)}°C</span>
          </div>

          <div className="pt-2 border-t border-[#ff3e3e]/20">
            <div className="text-white/60 mb-1">AUTOPSY LOG:</div>
            {isMeltdown ? (
              <div className="text-[#ff3e3e] italic">
                "CAUSE: OPERATOR DELIBERATELY PUSHED THE REACTOR BEYOND THERMAL EQUILIBRIUM INTO FULL CORE DETONATION."
              </div>
            ) : (
              <div className="text-amber-400 italic">
                "CAUSE: STRUCTURAL INTEGRITY LOSS FROM HOSTILE KINETIC IMPACTS. SHIELDS EXHAUSTED."
              </div>
            )}
          </div>
        </div>

        {/* Combat Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className="p-3 bg-[#0a0c0a] border border-[#1a1a1a]">
            <div className="text-white/50">FINAL SCORE</div>
            <div className="text-lg font-black text-[#ff3e3e]">{score.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-[#0a0c0a] border border-[#1a1a1a]">
            <div className="text-white/50">TIME ELAPSED</div>
            <div className="text-lg font-black text-white">{gameTimeSec.toFixed(1)}s</div>
          </div>
          <div className="p-3 bg-[#0a0c0a] border border-[#1a1a1a]">
            <div className="text-white/50">HOSTILES ELIMINATED</div>
            <div className="text-lg font-black text-white">{kills}</div>
          </div>
          <div className="p-3 bg-[#0a0c0a] border border-[#1a1a1a]">
            <div className="text-white/50">OVERCLOCK KILLS</div>
            <div className="text-lg font-black text-amber-400">{overclockKills}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            id="btn-reboot-game"
            onClick={() => {
              soundSynth.playUiClick();
              onRestart();
            }}
            className="w-full py-3.5 bg-[#ff3e3e] hover:bg-[#ff3e3e]/80 text-white font-black tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-[0_0_20px_#ff3e3e]"
          >
            <RotateCcw className="w-4 h-4" />
            RESTART MISSION
          </button>

          {onReturnToSelect && (
            <button
              id="btn-gameover-select"
              onClick={() => {
                soundSynth.playUiClick();
                onReturnToSelect();
              }}
              className="w-full py-2.5 bg-[#09111c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors uppercase"
            >
              <LayoutGrid className="w-4 h-4" />
              RETURN TO MISSION SELECT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
