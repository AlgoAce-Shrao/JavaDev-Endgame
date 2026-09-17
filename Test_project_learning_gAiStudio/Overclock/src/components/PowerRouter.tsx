import React from 'react';
import { PowerAllocation } from '../game/types';
import { Crosshair, Zap, Shield, Flame, X } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface PowerRouterProps {
  power: PowerAllocation;
  onSetChannel: (channel: keyof PowerAllocation, value: number) => void;
  onApplyPreset: (preset: 'BALANCED' | 'ATTACK' | 'EVASION' | 'DEFENSE' | 'COOLING') => void;
  onClose: () => void;
}

export const PowerRouter: React.FC<PowerRouterProps> = ({
  power,
  onSetChannel,
  onApplyPreset,
  onClose,
}) => {
  return (
    <div
      id="power-router-dialog"
      className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-mono select-none"
    >
      <div className="w-full max-w-xl bg-[#070907] border-2 border-[#00ff9f]/40 p-6 shadow-[0_0_40px_rgba(0,255,159,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-3 mb-6">
          <div className="flex items-center gap-2 text-[#00ff9f] font-black text-sm tracking-wider">
            <Zap className="w-4 h-4 text-[#00ff9f]" />
            <span>REACTOR POWER DISTRIBUTION // 100% POOL</span>
          </div>
          <button
            onClick={() => {
              soundSynth.playUiClick();
              onClose();
            }}
            className="text-white/60 hover:text-[#00ff9f] cursor-pointer p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-5 mb-6">
          {/* WEAPONS */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white/80 mb-1">
              <span className="flex items-center gap-2 text-[#00ff9f]">
                <Crosshair className="w-4 h-4" />
                WEAPONS ROUTING
              </span>
              <span className="text-[#00ff9f] font-bold">{power.weapons}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={power.weapons}
              onChange={(e) => onSetChannel('weapons', Number(e.target.value))}
              className="w-full h-2 bg-[#1a1a1a] accent-[#00ff9f] cursor-pointer"
            />
            <div className="text-[11px] text-white/50 mt-1">
              Boosts projectile damage (+0% to +50%) and fire rate. Increases heat per shot (+0% to +45%).
            </div>
          </div>

          {/* ENGINE */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white/80 mb-1">
              <span className="flex items-center gap-2 text-[#00ff9f]">
                <Zap className="w-4 h-4" />
                ENGINE / THRUSTERS
              </span>
              <span className="text-[#00ff9f] font-bold">{power.engine}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={power.engine}
              onChange={(e) => onSetChannel('engine', Number(e.target.value))}
              className="w-full h-2 bg-[#1a1a1a] accent-[#00ff9f] cursor-pointer"
            />
            <div className="text-[11px] text-white/50 mt-1">
              Boosts movement speed (+0% to +50%) and reduces Dash cooldown (1.2s down to 0.4s).
            </div>
          </div>

          {/* SHIELD */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white/80 mb-1">
              <span className="flex items-center gap-2 text-[#00ff9f]">
                <Shield className="w-4 h-4" />
                SHIELD REGENERATION
              </span>
              <span className="text-[#00ff9f] font-bold">{power.shield}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={power.shield}
              onChange={(e) => onSetChannel('shield', Number(e.target.value))}
              className="w-full h-2 bg-[#1a1a1a] accent-[#00ff9f] cursor-pointer"
            />
            <div className="text-[11px] text-white/50 mt-1">
              Accelerates shield recharge rate from 1.8 SP/s up to 15.0 SP/s when out of combat.
            </div>
          </div>

          {/* COOLING */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white/80 mb-1">
              <span className="flex items-center gap-2 text-[#ff3e3e]">
                <Flame className="w-4 h-4" />
                THERMAL COOLING
              </span>
              <span className="text-[#ff3e3e] font-bold">{power.cooling}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={power.cooling}
              onChange={(e) => onSetChannel('cooling', Number(e.target.value))}
              className="w-full h-2 bg-[#1a1a1a] accent-[#ff3e3e] cursor-pointer"
            />
            <div className="text-[11px] text-white/50 mt-1">
              Multiplies passive thermal dissipation rate by up to 2.6x to prevent meltdown.
            </div>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[#00ff9f]/20">
          <button
            onClick={() => {
              onApplyPreset('BALANCED');
              soundSynth.playUiClick();
            }}
            className="flex-1 py-2 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-xs font-bold text-[#00ff9f] border border-[#00ff9f]/30 cursor-pointer transition-colors"
          >
            [Z] BALANCED
          </button>
          <button
            onClick={() => {
              onApplyPreset('ATTACK');
              soundSynth.playUiClick();
            }}
            className="flex-1 py-2 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-xs font-bold text-[#00ff9f] border border-[#00ff9f]/30 cursor-pointer transition-colors"
          >
            [X] ATTACK
          </button>
          <button
            onClick={() => {
              onApplyPreset('EVASION');
              soundSynth.playUiClick();
            }}
            className="flex-1 py-2 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-xs font-bold text-[#00ff9f] border border-[#00ff9f]/30 cursor-pointer transition-colors"
          >
            [C] EVASION
          </button>
          <button
            onClick={() => {
              onApplyPreset('DEFENSE');
              soundSynth.playUiClick();
            }}
            className="flex-1 py-2 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-xs font-bold text-[#00ff9f] border border-[#00ff9f]/30 cursor-pointer transition-colors"
          >
            [V] DEFENSE
          </button>
        </div>
      </div>
    </div>
  );
};
