import React from 'react';
import { MissionDef } from '../game/types';
import { Play, ArrowLeft, Shield, AlertTriangle, Crosshair, Award, Zap, Cpu } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface BriefingModalProps {
  mission: MissionDef;
  onLaunch: () => void;
  onBackToSelect: () => void;
  cyberCredits?: number;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  mission,
  onLaunch,
  onBackToSelect,
  cyberCredits = 0,
}) => {
  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'LOW':
        return 'text-[#00ff9f] border-[#00ff9f]/40 bg-[#00ff9f]/10';
      case 'MEDIUM':
        return 'text-[#00f0ff] border-[#00f0ff]/40 bg-[#00f0ff]/10';
      case 'HIGH':
        return 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10';
      case 'EXTREME':
        return 'text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10';
      case 'CRITICAL':
        return 'text-[#ff2a4b] border-[#ff2a4b]/40 bg-[#ff2a4b]/10 animate-pulse';
      default:
        return 'text-[#00f0ff] border-[#00f0ff]/40 bg-[#00f0ff]/10';
    }
  };

  return (
    <div
      id="briefing-modal-overlay"
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-mono select-none overflow-y-auto"
    >
      <div
        id="briefing-modal-card"
        className="w-full max-w-2xl bg-[#060a0f] border-2 border-cyan-500/60 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] relative text-cyan-400"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              id="btn-briefing-back"
              onClick={() => {
                soundSynth.playUiClick();
                onBackToSelect();
              }}
              className="p-1.5 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xs transition-colors cursor-pointer"
              title="Return to Mission Select"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[10px] text-cyan-300/60 tracking-widest uppercase">
                TACTICAL DOSSIER // {mission.code}
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white">
                {mission.title}
              </h2>
            </div>
          </div>

          <div className={`px-2.5 py-1 text-xs font-bold tracking-widest border rounded-xs ${getThreatColor(mission.threatLevel)}`}>
            THREAT: {mission.threatLevel}
          </div>
        </div>

        {/* Tactical Intel & Sector Info */}
        <div className="space-y-4 mb-6 text-xs leading-relaxed text-slate-300">
          <div className="bg-[#09111c] border border-cyan-500/20 p-3.5 rounded-xs">
            <div className="text-[11px] text-cyan-400 font-bold mb-1 flex items-center gap-1.5 uppercase">
              <Cpu className="w-3.5 h-3.5" />
              Operational Objective Briefing
            </div>
            <p className="text-slate-300/90">{mission.contextStory}</p>
          </div>

          {/* Arena & Primary Objective */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#09111c] border border-cyan-500/20 rounded-xs">
              <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1 flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5 text-[#00ff9f]" />
                Primary Directive
              </div>
              <div className="text-white font-bold">{mission.primaryObjective}</div>
            </div>

            <div className="p-3 bg-[#09111c] border border-cyan-500/20 rounded-xs">
              <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Sector Arena
              </div>
              <div className="text-white font-bold">{mission.arena}</div>
            </div>
          </div>

          {/* Secondary Objectives & Intelligence */}
          {mission.secondaryObjectives && mission.secondaryObjectives.length > 0 && (
            <div className="p-3 bg-[#09111c] border border-cyan-500/20 rounded-xs">
              <div className="text-[10px] text-amber-400 font-bold uppercase mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Tactical Parameters & Sub-Directives
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {mission.secondaryObjectives.map((sec, idx) => (
                  <li key={idx}>{sec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Hostiles Intel */}
          {mission.intelligence && mission.intelligence.length > 0 && (
            <div className="p-3 bg-[#09111c] border border-cyan-500/20 rounded-xs">
              <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Facility Intelligence
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {mission.intelligence.map((intel, idx) => (
                  <li key={idx}>{intel}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewards */}
          <div className="p-3 bg-[#0a1a14] border border-[#00ff9f]/30 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#00ff9f] font-bold uppercase">
              <Award className="w-4 h-4" />
              <span>Mission Completion Reward:</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="text-[#00ff9f] font-black">+{mission.rewardCredits} Cyber Credits</span>
              <span className="text-cyan-300 font-black">+{mission.rewardScore.toLocaleString()} Score</span>
              {mission.rewardModule && (
                <span className="px-2 py-0.5 bg-[#00ff9f]/20 border border-[#00ff9f]/50 text-[#00ff9f] text-[10px] font-bold">
                  UNLOCK: {mission.rewardModule}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            id="btn-briefing-launch"
            onClick={() => {
              soundSynth.playUiClick();
              onLaunch();
            }}
            className="flex-1 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] uppercase"
          >
            <Play className="w-4 h-4 fill-current" />
            ENGAGE COMBAT SECTOR
          </button>
          <button
            id="btn-briefing-cancel"
            onClick={() => {
              soundSynth.playUiClick();
              onBackToSelect();
            }}
            className="px-5 py-3.5 bg-[#09111c] hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs tracking-wider border border-cyan-500/40 cursor-pointer transition-colors"
          >
            ABORT
          </button>
        </div>
      </div>
    </div>
  );
};
