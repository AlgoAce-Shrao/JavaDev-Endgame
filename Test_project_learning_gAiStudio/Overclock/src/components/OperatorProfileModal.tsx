import React from 'react';
import { User, X, Cpu, Flame, Zap, Shield, Skull, Award, Crosshair, Terminal, Activity, HelpCircle } from 'lucide-react';
import { operatorProfileSystem } from '../game/systems/OperatorProfileSystem';
import { saveSystem } from '../game/systems/SaveSystem';
import { soundSynth } from '../game/audio/SoundSynth';

interface OperatorProfileModalProps {
  onClose: () => void;
}

export const OperatorProfileModal: React.FC<OperatorProfileModalProps> = ({ onClose }) => {
  const stats = operatorProfileSystem.getStats();
  const archetypeInfo = operatorProfileSystem.determineArchetype();
  const aiAssessment = operatorProfileSystem.getAIAssessment();
  const saved = saveSystem.getState();
  const discoveredSecretsCount = (saved.discoveredSecrets || []).length;

  const handleClose = () => {
    soundSynth.playUiClick();
    onClose();
  };

  return (
    <div
      id="operator-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none"
    >
      <div
        id="operator-profile-modal-card"
        className="w-full max-w-3xl max-h-[90vh] bg-[#070907]/95 border-2 border-[#00ff9f]/40 p-6 flex flex-col shadow-[0_0_50px_rgba(0,255,159,0.15)] relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00ff9f]/10 border border-[#00ff9f]/30">
              <User className="w-6 h-6 text-[#00ff9f]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-widest">
                OPERATOR PROFILE // VX-01
              </h2>
              <div className="text-xs text-[#00ff9f]/70">
                NEURAL TELEMETRY & BEHAVIORAL LOGS
              </div>
            </div>
          </div>
          <button
            id="btn-close-profile"
            onClick={handleClose}
            className="p-2 text-white/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/10 transition-colors border border-transparent hover:border-[#00ff9f]/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
          {/* Archetype & Evaluation Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/60 border border-[#00ff9f]/30 flex flex-col justify-between md:col-span-1">
              <div>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">
                  TACTICAL ARCHETYPE
                </span>
                <div
                  className="text-lg font-black tracking-wider"
                  style={{ color: archetypeInfo.color }}
                >
                  {archetypeInfo.title}
                </div>
                <p className="text-xs text-white/70 mt-2">
                  {archetypeInfo.description}
                </p>
              </div>
            </div>

            <div className="p-4 bg-black/60 border border-[#00ff9f]/30 md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Cpu className="w-4 h-4 text-[#00ff9f]" />
                  <span className="text-[10px] font-bold text-[#00ff9f] uppercase tracking-widest">
                    AI OPERATOR PSYCHOLOGICAL ASSESSMENT
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed italic">
                  "{aiAssessment}"
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#00ff9f]/20 flex items-center justify-between text-[10px] text-white/50">
                <span>NEURAL LINK: STABLE</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* Lifetime Statistics Grid */}
          <div>
            <h3 className="text-xs font-bold text-[#00ff9f] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              LIFETIME COMBAT TELEMETRY
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">TOTAL DEPLOYMENTS</span>
                <span className="text-lg font-black text-white">{stats.totalRuns}</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">TARGETS ELIMINATED</span>
                <span className="text-lg font-black text-[#00ff9f]">{stats.totalKills}</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">CORE MELTDOWNS</span>
                <span className="text-lg font-black text-[#ff3e3e]">{stats.totalMeltdowns}</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">OVERCLOCK TIME</span>
                <span className="text-lg font-black text-[#ff9f00]">{Math.round(stats.totalOverclockTimeSec)}s</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">PEAK HEAT RECORDED</span>
                <span className="text-lg font-black text-[#ff3e3e]">{Math.round(stats.highestHeatReached)}%</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">MAX COMBO STREAK</span>
                <span className="text-lg font-black text-[#38bdf8]">{stats.bestCombo}x</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">HIGHEST SCORE</span>
                <span className="text-lg font-black text-amber-400">{stats.bestScore.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 uppercase block">FAVORITE WEAPON</span>
                <span className="text-sm font-bold text-white truncate">{stats.favoriteWeapon}</span>
              </div>
            </div>
          </div>

          {/* Secondary Parameters */}
          <div className="p-4 bg-black/50 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-white/50 uppercase block">NEAR-MELTDOWN ESCAPES</span>
              <span className="text-base font-bold text-[#ff9f00]">{stats.nearMeltdownSurvivals} times</span>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase block">SUPERCRITICAL HARMONICS</span>
              <span className="text-base font-bold text-[#39ff14]">{stats.supercriticalTriggers} surges</span>
            </div>
            <div>
              <span className="text-[10px] text-white/50 uppercase block">HIDDEN SECRETS FOUND</span>
              <span className="text-base font-bold text-[#d946ef]">{discoveredSecretsCount} / 5 DISCOVERED</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#00ff9f]/20 flex justify-end">
          <button
            id="btn-profile-return"
            onClick={handleClose}
            className="px-6 py-2.5 bg-[#00ff9f]/20 hover:bg-[#00ff9f]/30 text-[#00ff9f] font-bold text-xs border border-[#00ff9f]/40 cursor-pointer transition-colors"
          >
            CONFIRM & RETURN
          </button>
        </div>
      </div>
    </div>
  );
};
