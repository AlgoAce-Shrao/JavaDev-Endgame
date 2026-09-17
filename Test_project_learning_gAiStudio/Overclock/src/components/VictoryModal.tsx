import React from 'react';
import { TelemetrySnapshot } from '../game/types';
import { Trophy, Award, Zap, RotateCcw, LayoutGrid } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface VictoryModalProps {
  telemetry: TelemetrySnapshot;
  onRestart: () => void;
  onStartEndless: () => void;
  onReturnToSelect?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  telemetry,
  onRestart,
  onStartEndless,
  onReturnToSelect,
}) => {
  const { score, kills, overclockKills, gameTimeSec, secretsUnlocked } = telemetry;

  return (
    <div
      id="victory-modal-overlay"
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-6 font-mono select-none"
    >
      <div className="w-full max-w-lg bg-[#070907] border-2 border-[#00ff9f] p-8 shadow-[0_0_50px_rgba(0,255,159,0.3)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#00ff9f]/40 pb-3 mb-6">
          <Trophy className="w-6 h-6 text-[#00ff9f]" />
          <h2 className="text-xl font-black tracking-widest text-[#00ff9f]">
            FACILITY PURGED // ADMINISTRATOR DESTROYED
          </h2>
        </div>

        <div className="text-xs text-white/80 mb-6 leading-relaxed">
          The VX-01 experimental rig successfully overwhelmed the central facility AI. By deliberately exceeding safe thermal limits, operator combat effectiveness reached 340% of baseline projections.
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className="p-3 bg-[#0a0c0a] border border-[#1a1a1a]">
            <div className="text-white/50">FINAL SCORE</div>
            <div className="text-lg font-black text-[#00ff9f]">{score.toLocaleString()}</div>
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
            <div className="text-white/50">OVERCLOCK ELIMINATIONS</div>
            <div className="text-lg font-black text-amber-400">{overclockKills}</div>
          </div>
        </div>

        {/* Secrets Found */}
        {secretsUnlocked.length > 0 && (
          <div className="mb-6 p-3 bg-[#0a1a14] border border-[#00ff9f]/30 text-xs text-[#00ff9f]">
            <div className="flex items-center gap-1.5 font-bold uppercase mb-1">
              <Award className="w-4 h-4" />
              SECRETS DISCOVERED ({secretsUnlocked.length})
            </div>
            <div className="text-white/80">{secretsUnlocked.join(', ')}</div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="btn-victory-endless"
            onClick={() => {
              soundSynth.playUiClick();
              onStartEndless();
            }}
            className="w-full py-3 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-[0_0_20px_#00ff9f]"
          >
            <Zap className="w-4 h-4 fill-current" />
            ENTER ENDLESS OVERDRIVE SIMULATION
          </button>

          {onReturnToSelect && (
            <button
              id="btn-victory-select"
              onClick={() => {
                soundSynth.playUiClick();
                onReturnToSelect();
              }}
              className="w-full py-2.5 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-[#00ff9f] font-bold text-xs tracking-wider border border-[#00ff9f]/40 cursor-pointer flex items-center justify-center gap-2 transition-colors uppercase"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              MISSION SELECTOR GRID
            </button>
          )}

          <button
            id="btn-victory-restart"
            onClick={() => {
              soundSynth.playUiClick();
              onRestart();
            }}
            className="w-full py-2.5 bg-[#0a0c0a] hover:bg-white/10 text-white font-bold text-xs tracking-wider border border-[#00ff9f]/30 cursor-pointer flex items-center justify-center gap-2 transition-colors uppercase"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESTART CAMPAIGN
          </button>
        </div>
      </div>
    </div>
  );
};
