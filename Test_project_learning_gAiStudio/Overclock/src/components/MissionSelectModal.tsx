import React from 'react';
import { MISSIONS } from '../game/data/missions';
import { MissionDef, CampaignSaveState } from '../game/types';
import {
  Shield,
  Play,
  Lock,
  CheckCircle2,
  Trophy,
  Zap,
  Cpu,
  Flame,
  Crosshair,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface MissionSelectModalProps {
  unlockedMissions: number[];
  completedMissions: number[];
  missionRatings: Record<number, 'S' | 'A' | 'B' | 'C'>;
  missionHighScores: Record<number, number>;
  cyberCredits: number;
  endlessUnlocked: boolean;
  endlessHighScore: number;
  endlessBestWave: number;
  onSelectMission: (missionIndex: number) => void;
  onStartEndless: () => void;
  onOpenMods: () => void;
  onOpenControls: () => void;
}

export const MissionSelectModal: React.FC<MissionSelectModalProps> = ({
  unlockedMissions = [1],
  completedMissions = [],
  missionRatings = {},
  missionHighScores = {},
  cyberCredits = 0,
  endlessUnlocked = false,
  endlessHighScore = 0,
  endlessBestWave = 1,
  onSelectMission,
  onStartEndless,
  onOpenMods,
  onOpenControls,
}) => {
  const getRatingBadge = (rating?: 'S' | 'A' | 'B' | 'C') => {
    if (!rating) return null;
    let col = 'text-slate-400 border-slate-600 bg-slate-800/40';
    if (rating === 'S') col = 'text-[#00ff9f] border-[#00ff9f] bg-[#00ff9f]/20 shadow-[0_0_10px_#00ff9f] font-black';
    else if (rating === 'A') col = 'text-cyan-400 border-cyan-400 bg-cyan-400/20 font-bold';
    else if (rating === 'B') col = 'text-amber-400 border-amber-400 bg-amber-400/20';
    return (
      <span className={`px-2 py-0.5 border text-xs tracking-wider rounded-xs ${col}`}>
        GRADE: {rating}
      </span>
    );
  };

  const getThreatBadge = (threat: string) => {
    let col = 'text-cyan-400 border-cyan-400/30';
    if (threat === 'HIGH') col = 'text-amber-400 border-amber-400/40';
    else if (threat === 'EXTREME') col = 'text-orange-500 border-orange-500/40';
    else if (threat === 'CRITICAL') col = 'text-red-500 border-red-500/50 animate-pulse';
    else if (threat === 'LOW') col = 'text-[#00ff9f] border-[#00ff9f]/30';
    return (
      <span className={`px-1.5 py-0.5 border text-[10px] uppercase font-bold rounded-xs ${col}`}>
        {threat}
      </span>
    );
  };

  return (
    <div
      id="mission-select-overlay"
      className="absolute inset-0 z-50 bg-[#05080c]/95 backdrop-blur-md flex flex-col p-4 sm:p-8 font-mono select-none overflow-y-auto"
    >
      {/* Header Bar */}
      <div className="w-full max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/30 pb-4 mb-6">
        <div>
          <div className="text-xs text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            FACILITY RECONNAISSANCE // CAMPAIGN GRID
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white">
            SECTOR OPERATIONS
          </h1>
        </div>

        {/* Global Stats / Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 bg-[#09111c] border border-cyan-500/30 text-xs flex items-center gap-2">
            <span className="text-cyan-400/70">CREDITS:</span>
            <span className="text-lg font-black text-[#00ff9f]">
              {cyberCredits.toLocaleString()} ⬡
            </span>
          </div>

          <button
            id="btn-mission-select-mods"
            onClick={() => {
              soundSynth.playUiClick();
              onOpenMods();
            }}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-xs font-bold tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Wrench className="w-4 h-4" />
            WEAPON MOD MATRIX [U]
          </button>

          <button
            id="btn-mission-select-controls"
            onClick={() => {
              soundSynth.playUiClick();
              onOpenControls();
            }}
            className="p-2 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border border-slate-600 text-xs rounded-xs cursor-pointer transition-colors"
            title="Controls & Keybindings"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Campaign Mission Cards Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {MISSIONS.map((mission, idx) => {
          const isUnlocked = unlockedMissions.includes(mission.id);
          const isCompleted = completedMissions.includes(mission.id);
          const rating = missionRatings[mission.id];
          const highScore = missionHighScores[mission.id];

          return (
            <div
              key={mission.id}
              id={`mission-card-${mission.id}`}
              onClick={() => {
                if (isUnlocked) {
                  soundSynth.playUiClick();
                  onSelectMission(idx);
                }
              }}
              className={`relative border-2 p-5 flex flex-col justify-between transition-all duration-200 ${
                isUnlocked
                  ? 'bg-[#080d14]/90 border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] cursor-pointer'
                  : 'bg-[#06080a]/60 border-slate-800/80 opacity-50 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Top card bar */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400 tracking-wider">
                      {mission.code}
                    </span>
                    {getThreatBadge(mission.threatLevel)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[#00ff9f] text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        CLEARED
                      </span>
                    )}
                    {getRatingBadge(rating)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center justify-between">
                  <span>{mission.title}</span>
                  {!isUnlocked && <Lock className="w-4 h-4 text-slate-500" />}
                </h3>

                {/* Subtitle / Objective */}
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {mission.primaryObjective}
                </p>

                {/* Sector Meta */}
                <div className="text-[11px] space-y-1 text-slate-300/80 mb-4 bg-black/40 p-2.5 border border-slate-800 rounded-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">SECTOR:</span>
                    <span className="text-cyan-300">{mission.arena}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">WAVES:</span>
                    <span className="text-white">{mission.waves.length} Combat Wave{mission.waves.length > 1 ? 's' : ''}</span>
                  </div>
                  {highScore && highScore > 0 ? (
                    <div className="flex justify-between">
                      <span className="text-slate-500">BEST SCORE:</span>
                      <span className="text-[#00ff9f] font-bold">{highScore.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-[#00ff9f] font-bold">
                  +{mission.rewardCredits} Credits
                </div>
                {isUnlocked ? (
                  <button
                    className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black tracking-wider flex items-center gap-1.5 transition-colors uppercase rounded-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    BRIEFING
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    LOCKED (Complete Mission 0{mission.id - 1})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Endless Overdrive Special Sector Banner */}
      <div className="w-full max-w-6xl mx-auto">
        <div
          id="endless-sector-card"
          className={`border-2 p-6 transition-all ${
            endlessUnlocked
              ? 'bg-radial from-[#150a08] to-[#0a0505] border-[#ff2a4b]/60 hover:border-[#ff2a4b] shadow-[0_0_30px_rgba(255,42,75,0.2)]'
              : 'bg-[#080505]/40 border-slate-800/80 opacity-50'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#ff2a4b] font-bold">
                <Flame className="w-4 h-4 text-[#ff2a4b] animate-pulse" />
                <span>SPECIAL SIMULATION // UNRESTRICTED COMBAT</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-wider">
                ENDLESS OVERDRIVE // RECURSIVE SECTOR
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl">
                Infinite escalating waves with cumulative sector mutations, hostile swarm hyper-density, and relentless AI aggression.
              </p>
            </div>

            <div className="flex items-center gap-6">
              {endlessUnlocked && endlessHighScore > 0 && (
                <div className="text-right text-xs">
                  <div className="text-slate-400">RECORD SCORE</div>
                  <div className="text-lg font-black text-[#ff2a4b]">
                    {endlessHighScore.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-400">BEST WAVE: {endlessBestWave}</div>
                </div>
              )}

              {endlessUnlocked ? (
                <button
                  id="btn-launch-endless"
                  onClick={() => {
                    soundSynth.playUiClick();
                    onStartEndless();
                  }}
                  className="px-6 py-3.5 bg-[#ff2a4b] hover:bg-[#ff2a4b]/80 text-white font-black text-xs tracking-widest flex items-center gap-2 shadow-[0_0_20px_#ff2a4b] cursor-pointer transition-colors uppercase"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  LAUNCH ENDLESS
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-500 border border-slate-800 px-4 py-2">
                  <Lock className="w-4 h-4" />
                  <span>COMPLETE MISSION 06 TO UNLOCK</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
