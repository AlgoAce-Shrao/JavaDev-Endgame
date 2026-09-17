import React, { useState } from 'react';
import { ShieldAlert, X, Flame, Zap, Clock, Activity, Skull, Check, Play } from 'lucide-react';
import { EXPERIMENTAL_PROTOCOLS } from '../game/data/protocols';
import { ExperimentalProtocolDef } from '../game/types';
import { saveSystem } from '../game/systems/SaveSystem';
import { soundSynth } from '../game/audio/SoundSynth';

interface ProtocolSelectModalProps {
  onClose: () => void;
  onLaunchWithProtocols: (protocolIds: string[]) => void;
}

const getProtocolIcon = (iconName: string) => {
  switch (iconName) {
    case 'Flame': return <Flame className="w-5 h-5 text-[#ff3e3e]" />;
    case 'Zap': return <Zap className="w-5 h-5 text-[#ff9f00]" />;
    case 'Clock': return <Clock className="w-5 h-5 text-amber-400" />;
    case 'Activity': return <Activity className="w-5 h-5 text-[#38bdf8]" />;
    case 'Skull': return <Skull className="w-5 h-5 text-[#d946ef]" />;
    default: return <ShieldAlert className="w-5 h-5 text-[#00ff9f]" />;
  }
};

export const ProtocolSelectModal: React.FC<ProtocolSelectModalProps> = ({
  onClose,
  onLaunchWithProtocols,
}) => {
  const saved = saveSystem.getState();
  const [selectedIds, setSelectedIds] = useState<string[]>(saved.activeProtocols || ['MELTDOWN_PROTOCOL']);

  const toggleProtocol = (id: string) => {
    soundSynth.playUiClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const calculateTotalMultiplier = () => {
    let mult = 1.0;
    for (const id of selectedIds) {
      const p = EXPERIMENTAL_PROTOCOLS.find((prot) => prot.id === id);
      if (p) mult *= p.scoreMultiplier;
    }
    return Math.round(mult * 100) / 100;
  };

  const handleLaunch = () => {
    soundSynth.playPowerRoute();
    saveSystem.updateActiveProtocols(selectedIds);
    onLaunchWithProtocols(selectedIds);
  };

  const handleClose = () => {
    soundSynth.playUiClick();
    onClose();
  };

  return (
    <div
      id="protocol-select-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none"
    >
      <div
        id="protocol-select-modal-card"
        className="w-full max-w-3xl max-h-[90vh] bg-[#070907]/95 border-2 border-[#00ff9f]/40 p-6 flex flex-col shadow-[0_0_50px_rgba(0,255,159,0.15)] relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#ff3e3e]/10 border border-[#ff3e3e]/30">
              <ShieldAlert className="w-6 h-6 text-[#ff3e3e]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-widest">
                EXPERIMENTAL PROTOCOLS
              </h2>
              <div className="text-xs text-[#00ff9f]/70">
                POST-CAMPAIGN MODIFIERS & RISK/REWARD MULTIPLIERS
              </div>
            </div>
          </div>
          <button
            id="btn-close-protocols"
            onClick={handleClose}
            className="p-2 text-white/60 hover:text-[#00ff9f] hover:bg-[#00ff9f]/10 transition-colors border border-transparent hover:border-[#00ff9f]/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multiplier Info */}
        <div className="mb-4 p-3 bg-black/60 border border-[#00ff9f]/30 flex items-center justify-between">
          <div className="text-xs text-white/80">
            ACTIVE PROTOCOLS: <span className="font-bold text-[#00ff9f]">{selectedIds.length} SELECTED</span>
          </div>
          <div className="text-xs font-black text-white">
            TOTAL SCORE MULTIPLIER: <span className="text-amber-400 text-sm">{calculateTotalMultiplier()}x</span>
          </div>
        </div>

        {/* Protocols List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {EXPERIMENTAL_PROTOCOLS.map((protocol) => {
            const isSelected = selectedIds.includes(protocol.id);
            return (
              <div
                key={protocol.id}
                id={`protocol-card-${protocol.id}`}
                onClick={() => toggleProtocol(protocol.id)}
                className={`p-4 border transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? 'bg-[#00ff9f]/10 border-[#00ff9f] shadow-[0_0_20px_rgba(0,255,159,0.2)]'
                    : 'bg-black/40 border-white/10 hover:border-white/30'
                }`}
              >
                <div
                  className={`p-3 border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#00ff9f]/20 border-[#00ff9f]'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {getProtocolIcon(protocol.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#00ff9f]/80">
                        {protocol.code}
                      </span>
                      <span className="text-sm font-black text-white tracking-wide">
                        {protocol.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-amber-400 bg-black/60 px-2 py-0.5 border border-amber-400/30">
                      +{Math.round((protocol.scoreMultiplier - 1) * 100)}% SCORE
                    </span>
                  </div>

                  <p className="text-xs text-white/70 mt-1">
                    {protocol.description}
                  </p>

                  <div className="mt-2 text-xs font-bold text-[#00ff9f] bg-black/40 p-2 border border-white/5">
                    {protocol.riskRewardDesc}
                  </div>
                </div>

                <div className="pt-1">
                  <div
                    className={`w-6 h-6 border flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#00ff9f] border-[#00ff9f] text-black'
                        : 'border-white/30 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#00ff9f]/20 flex items-center justify-between">
          <button
            id="btn-cancel-protocols"
            onClick={handleClose}
            className="px-4 py-2 text-xs text-white/60 hover:text-white border border-transparent hover:border-white/20 cursor-pointer"
          >
            CANCEL
          </button>
          <button
            id="btn-launch-protocols"
            onClick={handleLaunch}
            className="px-6 py-2.5 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black text-xs flex items-center gap-2 border border-[#00ff9f] cursor-pointer shadow-[0_0_20px_#00ff9f] transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            ENGAGE OVERCLOCK SIMULATION ({calculateTotalMultiplier()}x SCORE)
          </button>
        </div>
      </div>
    </div>
  );
};
