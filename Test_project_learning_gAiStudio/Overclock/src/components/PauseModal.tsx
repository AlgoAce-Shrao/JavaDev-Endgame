import React from 'react';
import {
  Play,
  RotateCcw,
  LayoutGrid,
  Volume2,
  VolumeX,
  HelpCircle,
  Shield,
  Zap,
  Flame,
  Crosshair,
  LogOut,
} from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';
import { TelemetrySnapshot } from '../game/types';

interface PauseModalProps {
  telemetry: TelemetrySnapshot;
  onResume: () => void;
  onRestartMission: () => void;
  onReturnToSelect: () => void;
  onOpenControls: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onLogout?: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  telemetry,
  onResume,
  onRestartMission,
  onReturnToSelect,
  onOpenControls,
  isMuted,
  onToggleMute,
  onLogout,
}) => {
  const {
    missionCode,
    missionName,
    missionWave,
    totalWaves,
    primaryObjectiveText,
    score,
    cyberCredits,
    isEndlessMode,
    endlessWaveNumber,
  } = telemetry;

  return (
    <div
      id="pause-modal-overlay"
      className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-mono select-none overflow-y-auto"
    >
      <div
        id="pause-modal-card"
        className="w-full max-w-lg bg-[#060a0f] border-2 border-cyan-500/80 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.3)] relative text-cyan-400"
      >
        {/* Top Status */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-6">
          <div>
            <div className="text-[10px] text-cyan-400/60 tracking-widest uppercase">
              SIMULATION FROZEN // MANUAL OVERRIDE
            </div>
            <h2 className="text-2xl font-black tracking-wider text-white">
              OPERATION PAUSED
            </h2>
          </div>
          <div className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wider">
            [ESC / P]
          </div>
        </div>

        {/* Current Mission Context */}
        <div className="bg-[#09111c] border border-cyan-500/20 p-4 rounded-xs mb-6 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-500">ACTIVE SECTOR:</span>
            <span className="font-bold text-white">
              {isEndlessMode ? `ENDLESS SECTOR (WAVE ${endlessWaveNumber})` : `${missionCode}: ${missionName}`}
            </span>
          </div>

          {!isEndlessMode && (
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">SECTOR WAVE:</span>
              <span className="text-cyan-300 font-bold">
                {missionWave} / {totalWaves}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-300">
            <span className="text-slate-500">PRIMARY DIRECTIVE:</span>
            <span className="text-[#00ff9f] font-bold text-right max-w-[260px] truncate">
              {primaryObjectiveText}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-500">CURRENT CREDITS:</span>
            <span className="text-[#00ff9f] font-black">{cyberCredits.toLocaleString()} ⬡</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            id="btn-pause-resume"
            onClick={() => {
              soundSynth.playUiClick();
              onResume();
            }}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] uppercase rounded-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            RESUME OPERATION [ESC]
          </button>

          <button
            id="btn-pause-restart"
            onClick={() => {
              soundSynth.playUiClick();
              onRestartMission();
            }}
            className="w-full py-2.5 bg-[#09111c] hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-xs uppercase"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESTART MISSION
          </button>

          <button
            id="btn-pause-select"
            onClick={() => {
              soundSynth.playUiClick();
              onReturnToSelect();
            }}
            className="w-full py-2.5 bg-[#09111c] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-xs uppercase"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            MISSION SELECTOR GRID
          </button>
        </div>

        {/* Quick Utilities / Keybindings Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20 text-xs">
          <button
            id="btn-pause-mute"
            onClick={() => {
              soundSynth.playUiClick();
              onToggleMute();
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>{isMuted ? 'AUDIO MUTED' : 'AUDIO ACTIVE'}</span>
          </button>

          <button
            id="btn-pause-controls"
            onClick={() => {
              soundSynth.playUiClick();
              onOpenControls();
            }}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>FULL CONTROLS [?]</span>
          </button>

          {onLogout && (
            <button
              id="btn-pause-logout"
              onClick={() => {
                soundSynth.playUiClick();
                onLogout();
              }}
              className="flex items-center gap-1.5 text-red-400/60 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
