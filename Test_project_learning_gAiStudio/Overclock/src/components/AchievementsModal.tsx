import React from 'react';
import { Award, X, Sparkles, Flame, Shield, Target, Clock, Zap, CheckCircle, Skull, Terminal, Infinity, Lock } from 'lucide-react';
import { achievementSystem } from '../game/systems/AchievementSystem';
import { soundSynth } from '../game/audio/SoundSynth';

interface AchievementsModalProps {
  onClose: () => void;
}

const getIcon = (iconName: string, unlocked: boolean) => {
  const colorClass = unlocked ? 'text-[#00ff9f]' : 'text-white/30';
  switch (iconName) {
    case 'Flame': return <Flame className={`w-5 h-5 ${unlocked ? 'text-[#ff3e3e]' : colorClass}`} />;
    case 'Zap': return <Zap className={`w-5 h-5 ${unlocked ? 'text-[#ff9f00]' : colorClass}`} />;
    case 'Shield': return <Shield className={`w-5 h-5 ${colorClass}`} />;
    case 'Sparkles': return <Sparkles className={`w-5 h-5 ${unlocked ? 'text-[#38bdf8]' : colorClass}`} />;
    case 'Skull': return <Skull className={`w-5 h-5 ${unlocked ? 'text-[#ff2a4b]' : colorClass}`} />;
    case 'Clock': return <Clock className={`w-5 h-5 ${unlocked ? 'text-amber-400' : colorClass}`} />;
    case 'CheckCircle': return <CheckCircle className={`w-5 h-5 ${colorClass}`} />;
    case 'Terminal': return <Terminal className={`w-5 h-5 ${unlocked ? 'text-[#39ff14]' : colorClass}`} />;
    case 'Infinity': return <Infinity className={`w-5 h-5 ${unlocked ? 'text-[#d946ef]' : colorClass}`} />;
    default: return <Target className={`w-5 h-5 ${colorClass}`} />;
  }
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose }) => {
  const allAchievements = achievementSystem.getAll();
  const progress = achievementSystem.getProgress();

  const handleClose = () => {
    soundSynth.playUiClick();
    onClose();
  };

  return (
    <div
      id="achievements-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none"
    >
      <div
        id="achievements-modal-card"
        className="w-full max-w-3xl max-h-[85vh] bg-[#070907]/95 border-2 border-[#00ff9f]/40 p-6 flex flex-col shadow-[0_0_50px_rgba(0,255,159,0.15)] relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00ff9f]/10 border border-[#00ff9f]/30">
              <Award className="w-6 h-6 text-[#00ff9f]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-widest">
                OPERATIONAL ACHIEVEMENTS
              </h2>
              <div className="text-xs text-[#00ff9f]/70">
                SYSTEM CLEARANCE PROTOCOLS & MILESTONES
              </div>
            </div>
          </div>
          <button
            id="btn-close-achievements"
            onClick={handleClose}
            className="p-2 text-white/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/10 transition-colors border border-transparent hover:border-[#00ff9f]/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-black/60 border border-[#00ff9f]/20">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-white/80">TOTAL UNLOCKED MILESTONES</span>
            <span className="text-[#00ff9f]">
              {progress.unlocked} / {progress.total} ({progress.percentage}%)
            </span>
          </div>
          <div className="w-full h-2 bg-black border border-[#00ff9f]/30 overflow-hidden">
            <div
              className="h-full bg-[#00ff9f] transition-all duration-500 shadow-[0_0_10px_#00ff9f]"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {allAchievements.map((ach) => {
            const unlocked = achievementSystem.isUnlocked(ach.id);
            return (
              <div
                key={ach.id}
                id={`achievement-card-${ach.id}`}
                className={`p-3.5 border transition-all flex items-start gap-4 ${
                  unlocked
                    ? 'bg-[#00ff9f]/5 border-[#00ff9f]/40 hover:border-[#00ff9f]'
                    : 'bg-black/40 border-white/10 opacity-60'
                }`}
              >
                <div
                  className={`p-2.5 border flex items-center justify-center shrink-0 ${
                    unlocked
                      ? 'bg-[#00ff9f]/10 border-[#00ff9f]/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {unlocked ? getIcon(ach.icon, true) : <Lock className="w-5 h-5 text-white/30" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider text-[#00ff9f]/80">
                        {ach.code}
                      </span>
                      <span className="text-sm font-black text-white tracking-wide">
                        {ach.secret && !unlocked ? 'CLASSIFIED DIRECTIVE' : ach.title}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 font-bold border ${
                        unlocked
                          ? 'bg-[#00ff9f]/20 text-[#00ff9f] border-[#00ff9f]/40'
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      {ach.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-white/70 mt-1">
                    {ach.secret && !unlocked
                      ? 'Execute hidden root parameters to reveal parameters.'
                      : ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#00ff9f]/20 flex justify-end">
          <button
            id="btn-achievements-return"
            onClick={handleClose}
            className="px-6 py-2.5 bg-[#00ff9f]/20 hover:bg-[#00ff9f]/30 text-[#00ff9f] font-bold text-xs border border-[#00ff9f]/40 cursor-pointer transition-colors"
          >
            RETURN TO OPERATING SYSTEM
          </button>
        </div>
      </div>
    </div>
  );
};
