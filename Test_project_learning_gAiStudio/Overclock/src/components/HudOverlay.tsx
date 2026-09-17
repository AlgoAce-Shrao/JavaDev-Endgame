import React from 'react';
import { TelemetrySnapshot, WeaponDef } from '../game/types';
import {
  Shield,
  Zap,
  Flame,
  Terminal as TermIcon,
  Crosshair,
  Pause,
  HelpCircle,
  Wrench,
  Activity,
  Radiation,
  CheckCircle2,
} from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface HudOverlayProps {
  telemetry: TelemetrySnapshot;
  onSelectWeapon: (idx: number) => void;
  onToggleOverclock: () => void;
  onOpenTerminal: () => void;
  onOpenPowerRouter: () => void;
  onOpenWeaponMods: () => void;
  onOpenControls: () => void;
  onTogglePause: () => void;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  telemetry,
  onSelectWeapon,
  onToggleOverclock,
  onOpenTerminal,
  onOpenPowerRouter,
  onOpenWeaponMods,
  onOpenControls,
  onTogglePause,
}) => {
  const {
    core,
    maxCore,
    shield,
    maxShield,
    energy,
    maxEnergy,
    heat,
    heatState,
    isOverclocked,
    overclockTimeLeft,
    overclockDuration,
    isSupercritical,
    isHacked,
    hackDurationLeft,
    score,
    comboMultiplier,
    combo,
    missionCode,
    missionName,
    missionWave,
    totalWaves,
    primaryObjectiveText,
    objectiveProgress,
    activeWeapon,
    availableWeapons,
    activeWeaponCalculatedStats,
    cyberCredits,
    power,
    bossHp,
    isEndlessMode,
    endlessWaveNumber,
    activeMutations,
    currentMode,
  } = telemetry;

  // Heat Bar Color calculation
  let heatBg = 'bg-cyan-500';
  let heatText = 'text-cyan-400';
  let heatBorder = 'border-cyan-500/40';

  if (heatState === 'MELTDOWN' || heatState === 'MELTDOWN_IMMINENT') {
    heatBg = 'bg-rose-600 animate-pulse';
    heatText = 'text-rose-400 font-black';
    heatBorder = 'border-rose-500';
  } else if (heatState === 'CRITICAL') {
    heatBg = 'bg-red-500';
    heatText = 'text-red-400 font-bold';
    heatBorder = 'border-red-500/80';
  } else if (heatState === 'WARNING') {
    heatBg = 'bg-amber-500';
    heatText = 'text-amber-400';
    heatBorder = 'border-amber-500/80';
  }

  const isObjectiveComplete = currentMode === 'OBJECTIVE_COMPLETE' || currentMode === 'MISSION_COMPLETE' || currentMode === 'CAMPAIGN_VICTORY';

  return (
    <div
      id="hud-overlay-root"
      className="pointer-events-none absolute inset-0 z-30 font-mono flex flex-col justify-between p-3 sm:p-4 select-none overflow-hidden"
    >
      {/* Top Header Bar */}
      <div className="flex items-start justify-between gap-3">
        {/* Top-Left: Machine Core, Shield & Heat */}
        <div
          id="hud-vitals-panel"
          className="pointer-events-auto bg-[#070d14]/90 border border-cyan-500/30 p-2.5 sm:p-3 min-w-[210px] sm:min-w-[250px] shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          {/* Core HP */}
          <div className="mb-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-0.5">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                CORE ARMOR
              </span>
              <span className={core < 30 ? 'text-red-400 font-black animate-pulse' : 'text-cyan-400'}>
                {Math.round(core)} / {maxCore}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 border border-slate-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ${
                  core < 30 ? 'bg-red-500' : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.max(0, (core / maxCore) * 100)}%` }}
              />
            </div>
          </div>

          {/* Shield */}
          <div className="mb-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-0.5">
              <span className="flex items-center gap-1.5 text-sky-300">
                <Shield className="w-3 h-3" />
                SHIELDS
              </span>
              <span className="text-sky-400">
                {Math.round(shield)} / {maxShield}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 border border-slate-700 overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-75"
                style={{ width: `${Math.max(0, (shield / maxShield) * 100)}%` }}
              />
            </div>
          </div>

          {/* Energy */}
          <div className="mb-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-0.5">
              <span className="flex items-center gap-1.5 text-yellow-300">
                <Zap className="w-3 h-3" />
                ENERGY
              </span>
              <span className="text-yellow-400">{Math.round(energy)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 border border-slate-700 overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-75"
                style={{ width: `${Math.max(0, (energy / maxEnergy) * 100)}%` }}
              />
            </div>
          </div>

          {/* Thermal Load & Overclock Indicator */}
          <div>
            <div className="flex justify-between text-[11px] font-bold mb-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Flame className="w-3 h-3 text-rose-500" />
                THERMAL CORE
              </span>
              <span className={heatText}>
                {Math.round(heat)}°C [{heatState}]
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 border border-slate-700 overflow-hidden relative">
              {/* 95% Supercritical marker */}
              <div className="absolute left-[95%] top-0 bottom-0 w-0.5 bg-amber-400 z-10" />
              <div
                className={`h-full transition-all duration-75 ${heatBg}`}
                style={{ width: `${Math.min(100, Math.max(0, heat))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top-Center: Tactical Objective Tracker & Sector Header */}
        <div
          id="hud-objective-tracker"
          className="pointer-events-auto flex flex-col items-center max-w-sm sm:max-w-md w-full"
        >
          {/* Demo Mode Showcase Banner */}
          {telemetry.isDemoActive && telemetry.demoStep && (
            <div className="bg-amber-500/20 border-2 border-amber-400 p-2 text-center w-full shadow-[0_0_20px_rgba(251,191,36,0.3)] mb-1">
              <div className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                DEMO SHOWCASE // STEP {telemetry.demoStep.stepNumber} OF {telemetry.demoStep.totalSteps}
              </div>
              <div className="text-xs font-bold text-white">
                {telemetry.demoStep.title}
              </div>
              <div className="text-[11px] font-black text-[#00ff9f] mt-0.5 bg-black/60 px-2 py-0.5 border border-[#00ff9f]/30">
                {telemetry.demoStep.actionPrompt}
              </div>
            </div>
          )}

          {/* Mission & Wave Header */}
          {!telemetry.isDemoActive && (
            <div className="bg-[#070d14]/90 border border-cyan-500/30 px-3 py-1.5 text-center w-full shadow-[0_0_15px_rgba(0,0,0,0.5)] mb-1">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-cyan-300/80 uppercase font-bold">
                <span>{isEndlessMode ? 'ENDLESS SIMULATION' : `${missionCode}`}</span>
                <span className="text-[#00ff9f]">
                  {isEndlessMode ? `WAVE ${endlessWaveNumber}` : `WAVE ${missionWave}/${totalWaves}`}
                </span>
              </div>

              {/* Objective Title */}
              <div className="text-xs sm:text-sm font-black text-white truncate">
                {isEndlessMode ? 'SURVIVE ESCALATING MUTATION SECTOR' : missionName}
              </div>

              {/* Objective Progress Bar */}
              {objectiveProgress && (
                <div className="mt-1.5 pt-1.5 border-t border-cyan-500/20 text-left">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 mb-0.5">
                    <span className="text-cyan-400 flex items-center gap-1 uppercase">
                      <Crosshair className="w-3 h-3 text-[#00ff9f]" />
                      {objectiveProgress.label}
                    </span>
                    <span className="text-[#00ff9f]">
                      {isObjectiveComplete ? (
                        <span className="text-[#00ff9f] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> COMPLETE
                        </span>
                      ) : (
                        `${objectiveProgress.current} / ${objectiveProgress.total}`
                      )}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 border border-slate-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-150 ${
                        isObjectiveComplete ? 'bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]' : 'bg-cyan-400'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, (objectiveProgress.current / (objectiveProgress.total || 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Objective Complete Banner Animation */}
          {isObjectiveComplete && (
            <div className="bg-[#00ff9f]/20 border border-[#00ff9f] px-3 py-1 text-center text-[#00ff9f] font-black text-xs tracking-widest uppercase animate-pulse shadow-[0_0_20px_#00ff9f] w-full">
              OBJECTIVE COMPLETE // DATA SECURED
            </div>
          )}

          {/* Endless Active Mutations Chips Row */}
          {isEndlessMode && activeMutations && activeMutations.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mt-1">
              {activeMutations.map((m) => (
                <span
                  key={m.id}
                  className="px-1.5 py-0.5 bg-[#ff2a4b]/20 border border-[#ff2a4b]/50 text-[#ff2a4b] text-[9px] font-bold rounded-xs flex items-center gap-1"
                >
                  <Radiation className="w-2.5 h-2.5" />
                  {m.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Top-Right: Score, Pause, & Action Buttons */}
        <div
          id="hud-actions-panel"
          className="pointer-events-auto flex flex-col items-end gap-2"
        >
          {/* Score & Combo Multiplier */}
          <div className="bg-[#070d14]/90 border border-cyan-500/30 p-2 text-right min-w-[140px] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="text-[10px] text-slate-400">SCORE</div>
            <div className="text-base sm:text-lg font-black text-white">
              {score.toLocaleString()}
            </div>
            {comboMultiplier > 1.0 && (
              <div className="text-[10px] font-black text-amber-400 animate-pulse">
                COMBO {comboMultiplier.toFixed(1)}x ({combo} hits)
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-hud-pause"
              onClick={() => {
                soundSynth.playUiClick();
                onTogglePause();
              }}
              className="px-2 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/50 text-[10px] sm:text-xs font-bold tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              title="Pause Simulation (ESC or P)"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE [ESC]</span>
            </button>

            <button
              id="btn-hud-mods"
              onClick={() => {
                soundSynth.playUiClick();
                onOpenWeaponMods();
              }}
              className="p-1.5 bg-[#070d14]/90 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs cursor-pointer transition-colors"
              title="Weapon Mod Matrix (U)"
            >
              <Wrench className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-hud-power"
              onClick={() => {
                soundSynth.playUiClick();
                onOpenPowerRouter();
              }}
              className="p-1.5 bg-[#070d14]/90 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs cursor-pointer transition-colors"
              title="Power Router (R)"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-hud-terminal"
              onClick={() => {
                soundSynth.playUiClick();
                onOpenTerminal();
              }}
              className="p-1.5 bg-[#070d14]/90 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs cursor-pointer transition-colors"
              title="Terminal Console (`)"
            >
              <TermIcon className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-hud-controls"
              onClick={() => {
                soundSynth.playUiClick();
                onOpenControls();
              }}
              className="p-1.5 bg-[#070d14]/90 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs cursor-pointer transition-colors"
              title="Controls Reference (?)"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Boss Health Bar (Mission 6) */}
      {bossHp && (
        <div
          id="hud-boss-bar-container"
          className="pointer-events-auto w-full max-w-xl mx-auto bg-[#070d14]/95 border-2 border-red-500 p-2.5 shadow-[0_0_30px_rgba(255,42,75,0.4)] my-2"
        >
          <div className="flex justify-between items-center text-xs font-bold text-red-400 mb-1">
            <span className="flex items-center gap-1.5 animate-pulse">
              <Radiation className="w-4 h-4 text-red-500" />
              FACILITY ADMINISTRATOR // {bossHp.phase}
            </span>
            <span>
              {Math.max(0, Math.round(bossHp.current))} / {bossHp.max}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-900 border border-slate-700 overflow-hidden mb-1.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-75"
              style={{ width: `${Math.max(0, (bossHp.current / bossHp.max) * 100)}%` }}
            />
          </div>

          {/* Boss Subsystems */}
          {bossHp.subsystems && bossHp.subsystems.length > 0 && (
            <div className="flex justify-between gap-1 text-[10px]">
              {bossHp.subsystems.map((sub, i) => (
                <div
                  key={i}
                  className={`flex-1 px-1 py-0.5 text-center font-bold border rounded-xs ${
                    sub.destroyed
                      ? 'bg-slate-800 text-slate-500 border-slate-700 line-through'
                      : 'bg-red-500/20 text-red-300 border-red-500/50'
                  }`}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Row: Weapons Select & Overclock Engage */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        {/* Weapon Selection Bar */}
        <div
          id="hud-weapons-selector"
          className="pointer-events-auto bg-[#070d14]/90 border border-cyan-500/30 p-2 flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          {availableWeapons.map((wpn, idx) => {
            const isSelected = activeWeapon?.id === wpn.id;
            return (
              <button
                key={wpn.id}
                id={`btn-weapon-${wpn.id}`}
                onClick={() => {
                  soundSynth.playUiClick();
                  onSelectWeapon(idx);
                }}
                className={`px-2.5 py-1.5 border text-xs font-bold transition-all cursor-pointer flex flex-col items-start ${
                  isSelected
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.6)] font-black'
                    : 'bg-[#09111c] text-cyan-300/80 border-cyan-500/30 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="opacity-60">[{idx + 1}]</span>
                  <span>{wpn.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Overclock Button */}
        <div className="pointer-events-auto">
          <button
            id="btn-hud-overclock"
            onClick={() => {
              soundSynth.playUiClick();
              onToggleOverclock();
            }}
            className={`px-4 py-2.5 sm:px-6 sm:py-3 border-2 font-black text-xs sm:text-sm tracking-widest cursor-pointer transition-all uppercase flex items-center gap-2 ${
              isSupercritical
                ? 'bg-[#39ff14] text-black border-[#39ff14] shadow-[0_0_30px_#39ff14] animate-pulse'
                : isOverclocked
                ? 'bg-[#ff2a4b] text-white border-[#ff2a4b] shadow-[0_0_25px_#ff2a4b] animate-pulse'
                : 'bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(255,42,75,0.2)]'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            {isSupercritical ? (
              <span>SUPERCRITICAL [{Math.ceil(overclockTimeLeft)}s]</span>
            ) : isOverclocked ? (
              <span>OVERCLOCK ACTIVE [{Math.ceil(overclockTimeLeft)}s]</span>
            ) : (
              <span>ENGAGE OVERCLOCK [Q]</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
