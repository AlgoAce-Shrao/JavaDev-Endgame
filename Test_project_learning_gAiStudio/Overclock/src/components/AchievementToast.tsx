import React, { useEffect, useState } from 'react';
import { Award, Sparkles, Flame, Shield, Target, Clock, Zap, CheckCircle, Skull, Terminal, Infinity } from 'lucide-react';
import { AchievementDef } from '../game/types';

interface AchievementToastProps {
  achievement: AchievementDef | null;
  onDismiss: () => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Flame': return <Flame className="w-5 h-5 text-[#ff3e3e]" />;
    case 'Zap': return <Zap className="w-5 h-5 text-[#ff9f00]" />;
    case 'Shield': return <Shield className="w-5 h-5 text-[#00ff9f]" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#38bdf8]" />;
    case 'Skull': return <Skull className="w-5 h-5 text-[#ff2a4b]" />;
    case 'Clock': return <Clock className="w-5 h-5 text-amber-400" />;
    case 'CheckCircle': return <CheckCircle className="w-5 h-5 text-[#00ff9f]" />;
    case 'Terminal': return <Terminal className="w-5 h-5 text-[#39ff14]" />;
    case 'Infinity': return <Infinity className="w-5 h-5 text-[#d946ef]" />;
    default: return <Target className="w-5 h-5 text-[#00ff9f]" />;
  }
};

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 400);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      id="achievement-toast"
      className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 bg-[#070907]/95 border-2 border-[#00ff9f] p-4 shadow-[0_0_30px_rgba(0,255,159,0.3)] max-w-md font-mono">
        <div className="p-2.5 bg-[#00ff9f]/10 border border-[#00ff9f]/40 flex items-center justify-center shrink-0">
          {getIcon(achievement.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#00ff9f]">
              ACHIEVEMENT UNLOCKED // {achievement.code}
            </span>
            <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#00ff9f]/20 text-[#00ff9f] font-bold border border-[#00ff9f]/30">
              {achievement.rarity}
            </span>
          </div>
          <div className="text-sm font-black text-white tracking-wide truncate">
            {achievement.title}
          </div>
          <div className="text-xs text-white/70 line-clamp-1 mt-0.5">
            {achievement.description}
          </div>
        </div>
      </div>
    </div>
  );
};
