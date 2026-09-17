import React from 'react';
import { UpgradeDef, EndlessMutationDef } from '../game/types';
import {
  Zap,
  Snowflake,
  Flame,
  Wind,
  Crosshair,
  Activity,
  Shield,
  Terminal,
  Radio,
  Cpu,
  AlertTriangle,
  Sparkles,
  Droplet,
  EyeOff,
  Sun,
  HeartCrack,
  Disc,
  Users,
  Skull,
  Radiation,
} from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface UpgradeModalProps {
  choices?: UpgradeDef[];
  onSelect?: (upgrade: UpgradeDef) => void;
  mutationChoices?: EndlessMutationDef[];
  onSelectMutation?: (mutation: EndlessMutationDef) => void;
  isEndlessMode?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Snowflake,
  Zap,
  Flame,
  Wind,
  Crosshair,
  Activity,
  Shield,
  Terminal,
  Radio,
  Cpu,
  Sparkles,
  Droplet,
  EyeOff,
  Sun,
  HeartCrack,
  Disc,
  Users,
  AlertTriangle,
  Skull,
  Radiation,
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  choices = [],
  onSelect,
  mutationChoices = [],
  onSelectMutation,
  isEndlessMode = false,
}) => {
  // If Endless Mode mutation selection
  if (isEndlessMode && mutationChoices.length > 0) {
    return (
      <div
        id="mutation-modal-overlay"
        className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 font-mono select-none"
      >
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#ff3e3e] font-bold mb-1">
              <Radiation className="w-4 h-4 text-[#ff3e3e] animate-pulse" />
              <span>ENDLESS WAVE PURGED // SECTOR ANOMALY DETECTED</span>
              <Radiation className="w-4 h-4 text-[#ff3e3e] animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,62,62,0.6)]">
              SELECT SECTOR MUTATION PROTOCOL
            </h2>
            <p className="text-xs text-white/60 mt-1.5 max-w-xl mx-auto">
              Warning: Sector mutations permanently evolve hostile behavior and environmental dynamics. Choose the next operational threat vector.
            </p>
          </div>

          {/* Mutation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mutationChoices.map((mut) => {
              const IconComp = ICON_MAP[mut.icon] || AlertTriangle;
              const typeColor =
                mut.type === 'HOSTILE'
                  ? '#ff3e3e'
                  : mut.type === 'ENVIRONMENTAL'
                  ? '#a855f7'
                  : '#f59e0b';

              return (
                <div
                  key={mut.id}
                  id={`mutation-card-${mut.id}`}
                  className="bg-[#0b0707] border-2 p-5 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(255,62,62,0.3)] transition-all relative overflow-hidden"
                  style={{ borderColor: mut.color || '#ff3e3e' }}
                >
                  <div
                    className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: typeColor, color: '#000' }}
                  >
                    {mut.type.replace('_', ' ')}
                  </div>

                  <div>
                    {/* Code & Hazard Level */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-white/50 mb-3 border-b border-white/10 pb-2 pt-2">
                      <span style={{ color: mut.color || '#ff3e3e' }}>{mut.code}</span>
                      <span className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: mut.hazardLevel }).map((_, i) => (
                          <Skull key={i} className="w-3 h-3 text-[#ff3e3e]" />
                        ))}
                        <span className="ml-1 text-[9px] text-white/60">LV.{mut.hazardLevel}</span>
                      </span>
                    </div>

                    {/* Icon & Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="p-2.5 border"
                        style={{
                          backgroundColor: `${mut.color}15`,
                          borderColor: `${mut.color}60`,
                          color: mut.color,
                        }}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-black text-white leading-tight">
                        {mut.name}
                      </h3>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed mb-4 bg-black/60 p-3 border border-white/10">
                      {mut.description}
                    </p>
                  </div>

                  {/* Accept Mutation Button */}
                  <button
                    id={`btn-accept-mutation-${mut.id}`}
                    onClick={() => {
                      soundSynth.playUpgradeSelected();
                      if (onSelectMutation) onSelectMutation(mut);
                    }}
                    className="mt-4 w-full py-2.5 font-black text-xs tracking-wider border cursor-pointer transition-all shadow-[0_0_15px_rgba(255,62,62,0.3)] flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: mut.color || '#ff3e3e',
                      borderColor: mut.color || '#ff3e3e',
                      color: '#000',
                    }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>ACCEPT MUTATION</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Standard Upgrade Selection
  return (
    <div
      id="upgrade-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-6 font-mono select-none"
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-widest text-[#00ff9f] font-bold mb-1">
            SECTOR CLEARANCE VERIFIED // SYSTEM UPGRADE AVAILABLE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-white drop-shadow-[0_0_20px_rgba(0,255,159,0.5)]">
            SELECT SUB-ROUTINE AUGMENTATION
          </h2>
          <p className="text-xs text-white/60 mt-2 max-w-xl mx-auto">
            Choose an architectural modification for the VX-01 combat rig. Every augmentation introduces specialized tactical advantages and operational trade-offs.
          </p>
        </div>

        {/* Upgrade Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {choices.map((upg) => {
            const IconComp = ICON_MAP[upg.icon] || Zap;
            return (
              <div
                key={upg.id}
                id={`upgrade-card-${upg.id}`}
                className="bg-[#070907] border-2 border-[#00ff9f]/40 p-5 flex flex-col justify-between hover:border-[#00ff9f] hover:shadow-[0_0_25px_rgba(0,255,159,0.25)] transition-all"
              >
                <div>
                  {/* Category & Code */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-white/60 mb-3 border-b border-[#00ff9f]/20 pb-2">
                    <span className="text-[#00ff9f]">{upg.category}</span>
                    <span className="text-white/40">{upg.code}</span>
                  </div>

                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-[#00ff9f]/10 border border-[#00ff9f]/30 text-[#00ff9f]">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-white leading-tight">
                      {upg.name}
                    </h3>
                  </div>

                  <p className="text-xs text-white/60 italic mb-4">
                    "{upg.tagline}"
                  </p>

                  {/* Benefit */}
                  <div className="mb-3 p-2.5 bg-[#0a1a14] border border-[#00ff9f]/30 text-xs text-[#00ff9f]">
                    <div className="font-bold text-[10px] uppercase text-[#00ff9f] mb-1">
                      + BENEFIT
                    </div>
                    {upg.benefit}
                  </div>

                  {/* Drawback */}
                  <div className="p-2.5 bg-[#1a070a] border border-[#ff3e3e]/30 text-xs text-[#ff3e3e]">
                    <div className="font-bold text-[10px] uppercase text-[#ff3e3e] mb-1">
                      - TRADE-OFF
                    </div>
                    {upg.drawback}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  id={`btn-install-upgrade-${upg.id}`}
                  onClick={() => {
                    soundSynth.playUpgradeSelected();
                    if (onSelect) onSelect(upg);
                  }}
                  className="mt-6 w-full py-2.5 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black text-xs tracking-wider border border-[#00ff9f] cursor-pointer transition-colors shadow-[0_0_15px_rgba(0,255,159,0.3)]"
                >
                  INSTALL AUGMENTATION
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
