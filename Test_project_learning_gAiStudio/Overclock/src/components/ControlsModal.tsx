import React from 'react';
import { X, Crosshair, Zap, Shield, Flame, Terminal, HelpCircle, Keyboard, MousePointer, Pause } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="controls-modal-overlay"
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-mono select-none overflow-y-auto"
    >
      <div
        id="controls-modal-card"
        className="w-full max-w-3xl bg-[#060a0f] border-2 border-cyan-500/80 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.3)] relative text-cyan-400"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white">
                TACTICAL CONTROLS & KEYBINDINGS
              </h2>
              <div className="text-xs text-cyan-400/60">
                VX-01 EXPERIMENTAL COMBAT RIG FLIGHT DIRECTIVES
              </div>
            </div>
          </div>
          <button
            id="btn-close-controls"
            onClick={() => {
              soundSynth.playUiClick();
              onClose();
            }}
            className="p-1.5 hover:bg-cyan-500/20 text-cyan-400 hover:text-white border border-cyan-500/40 rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 text-xs text-slate-300">
          {/* Column 1: Core Combat & Movement */}
          <div className="space-y-4">
            <div className="bg-[#09111c] border border-cyan-500/20 p-3.5 rounded-xs space-y-2.5">
              <div className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5 border-b border-cyan-500/20 pb-1.5">
                <MousePointer className="w-4 h-4 text-cyan-400" />
                Movement & Kinetic Thrusters
              </div>
              <div className="flex justify-between items-center">
                <span>Vector Movement</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  W, A, S, D
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kinetic Dash (I-Frames)</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  Right Click / SPACE / SHIFT / E / K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Touch / Mobile Stick</span>
                <span className="text-slate-400">On-screen D-Pad</span>
              </div>
            </div>

            <div className="bg-[#09111c] border border-cyan-500/20 p-3.5 rounded-xs space-y-2.5">
              <div className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5 border-b border-cyan-500/20 pb-1.5">
                <Crosshair className="w-4 h-4 text-[#00ff9f]" />
                Weapon Fire & Aiming Alternatives
              </div>
              <div className="flex justify-between items-center">
                <span>Primary Fire (Cursor Aim)</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  Left Click / J / F / ENTER / NUM 0
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Directional Fire (Twin-Stick)</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  ARROW KEYS / I J K L / NUM 8 4 6 2
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Weapon Fast-Select</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  1, 2, 3, 4, 5, 6
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Systems, Power, & Pause */}
          <div className="space-y-4">
            <div className="bg-[#09111c] border border-cyan-500/20 p-3.5 rounded-xs space-y-2.5">
              <div className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5 border-b border-cyan-500/20 pb-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Reactor & Overclock Mechanics
              </div>
              <div className="flex justify-between items-center">
                <span>Engage / Cancel Overclock</span>
                <span className="px-2 py-0.5 bg-black/60 border border-rose-500/50 text-rose-400 font-bold">
                  Q Key
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Supercritical Plasma Cascade</span>
                <span className="text-amber-400 text-[11px]">Overclock at 95-99% Heat</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Passive Thermal Venting</span>
                <span className="text-slate-400 text-[11px]">Cease Firing / Route to Cooling</span>
              </div>
            </div>

            <div className="bg-[#09111c] border border-cyan-500/20 p-3.5 rounded-xs space-y-2.5">
              <div className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5 border-b border-cyan-500/20 pb-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                Power Routing & Modding Matrices
              </div>
              <div className="flex justify-between items-center">
                <span>Power Presets</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  Z (Bal), X (Atk), C (Eva), V (Def)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Power Distribution Matrix</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  R Key
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Weapon Mods Fabrication</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  U Key
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tactical Terminal Console</span>
                <span className="px-2 py-0.5 bg-black/60 border border-cyan-500/40 text-cyan-300 font-bold">
                  ` (Backtick) / ~
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Centralized Pause / Resume</span>
                <span className="px-2 py-0.5 bg-black/60 border border-[#00ff9f]/50 text-[#00ff9f] font-bold">
                  ESC / P
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-cyan-500/30">
          <button
            id="btn-close-controls-ack"
            onClick={() => {
              soundSynth.playUiClick();
              onClose();
            }}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs tracking-wider uppercase cursor-pointer transition-colors"
          >
            ACKNOWLEDGE DIRECTIVES
          </button>
        </div>
      </div>
    </div>
  );
};
