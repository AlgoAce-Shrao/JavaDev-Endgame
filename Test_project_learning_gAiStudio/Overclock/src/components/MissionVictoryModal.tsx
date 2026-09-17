import React from 'react';
import { MissionStats } from '../game/types';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Clock,
  Crosshair,
  ArrowRight,
  RotateCcw,
  LayoutGrid,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface MissionVictoryModalProps {
  stats: MissionStats;
  onProceedToUpgrades: () => void;
  onNextMission: () => void;
  onRetry: () => void;
  onReturnToSelect: () => void;
  hasNextMission: boolean;
}

export const MissionVictoryModal: React.FC<MissionVictoryModalProps> = ({
  stats,
  onProceedToUpgrades,
  onNextMission,
  onRetry,
  onReturnToSelect,
  hasNextMission,
}) => {
  const {
    missionCode,
    missionTitle,
    timeSec,
    kills,
    damageDealt,
    maxCombo,
    maxHeat,
    overclockUsage,
    rating,
    creditsEarned,
    scoreEarned,
    unlockedWeapon,
  } = stats;

  const getRatingColor = (r: 'S' | 'A' | 'B' | 'C') => {
    switch (r) {
      case 'S':
        return 'text-[#00ff9f] border-[#00ff9f] bg-[#00ff9f]/20 shadow-[0_0_30px_rgba(0,255,159,0.5)]';
      case 'A':
        return 'text-cyan-400 border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(0,240,255,0.4)]';
      case 'B':
        return 'text-amber-400 border-amber-400 bg-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
      case 'C':
        return 'text-slate-300 border-slate-500 bg-slate-800/40';
    }
  };

  return (
    <div
      id="mission-victory-overlay"
      className="absolute inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono select-none overflow-y-auto"
    >
      <div
        id="mission-victory-card"
        className="w-full max-w-xl bg-[#060a0e] border-2 border-[#00ff9f] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,255,159,0.3)] relative text-white"
      >
        {/* Celebration Stamp / Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#00ff9f] font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#00ff9f]" />
              <span>OPERATION SUCCESSFUL // SECTOR SECURED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white">
              {missionCode}: {missionTitle}
            </h2>
          </div>

          {/* Grade Stamp */}
          <div className="text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
              RATING
            </div>
            <div
              className={`w-14 h-14 rounded-xs border-2 flex items-center justify-center text-3xl font-black tracking-tighter ${getRatingColor(
                rating
              )}`}
            >
              {rating}
            </div>
          </div>
        </div>

        {/* Combat Performance Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 text-xs">
          <div className="p-3 bg-[#08111a] border border-slate-800 rounded-xs">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              TIME
            </div>
            <div className="text-base font-black text-cyan-300">{timeSec.toFixed(1)}s</div>
          </div>

          <div className="p-3 bg-[#08111a] border border-slate-800 rounded-xs">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Crosshair className="w-3.5 h-3.5 text-[#00ff9f]" />
              HOSTILES
            </div>
            <div className="text-base font-black text-white">{kills}</div>
          </div>

          <div className="p-3 bg-[#08111a] border border-slate-800 rounded-xs">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              MAX COMBO
            </div>
            <div className="text-base font-black text-yellow-400">{maxCombo}x</div>
          </div>

          <div className="p-3 bg-[#08111a] border border-slate-800 rounded-xs">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              PEAK HEAT
            </div>
            <div className={`text-base font-black ${maxHeat >= 90 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {Math.round(maxHeat)}°C
            </div>
          </div>

          <div className="p-3 bg-[#08111a] border border-slate-800 rounded-xs">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              OVERCLOCKS
            </div>
            <div className="text-base font-black text-amber-400">{overclockUsage}</div>
          </div>

          <div className="p-3 bg-[#08111a] border border-slate-800 rounded-xs">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5 text-[#00ff9f]" />
              SCORE
            </div>
            <div className="text-base font-black text-[#00ff9f]">+{scoreEarned.toLocaleString()}</div>
          </div>
        </div>

        {/* Rewards / Blueprint Unlock Banner */}
        <div className="p-3.5 bg-[#091f14] border border-[#00ff9f]/40 rounded-xs mb-6 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#00ff9f]" />
            <span className="text-slate-300 font-bold uppercase">MISSION BOUNTY EARNED:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-[#00ff9f]">+{creditsEarned} CYBER CREDITS</span>
            {unlockedWeapon && (
              <span className="px-2 py-0.5 bg-[#00ff9f]/20 border border-[#00ff9f]/50 text-[#00ff9f] text-[10px] font-bold">
                WEAPON: {unlockedWeapon}
              </span>
            )}
          </div>
        </div>

        {/* Next Step Action Buttons */}
        <div className="space-y-3">
          <button
            id="btn-victory-upgrades"
            onClick={() => {
              soundSynth.playUiClick();
              onProceedToUpgrades();
            }}
            className="w-full py-3.5 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_#00ff9f] uppercase rounded-xs"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            SELECT COMBAT RIG UPGRADE
          </button>

          <div className="grid grid-cols-2 gap-3">
            {hasNextMission ? (
              <button
                id="btn-victory-next-mission"
                onClick={() => {
                  soundSynth.playUiClick();
                  onNextMission();
                }}
                className="py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors rounded-xs uppercase"
              >
                <span>NEXT BRIEFING</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            <button
              id="btn-victory-mission-select"
              onClick={() => {
                soundSynth.playUiClick();
                onReturnToSelect();
              }}
              className="py-2.5 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border border-slate-700 text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors rounded-xs uppercase"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>SECTOR GRID</span>
            </button>

            <button
              id="btn-victory-retry"
              onClick={() => {
                soundSynth.playUiClick();
                onRetry();
              }}
              className="py-2.5 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border border-slate-700 text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors rounded-xs uppercase"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REPLAY MISSION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
