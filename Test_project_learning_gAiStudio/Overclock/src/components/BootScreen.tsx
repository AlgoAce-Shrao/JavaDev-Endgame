import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Zap, Flame, Cpu, Play, Award, User, ShieldAlert, BookOpen, FastForward, RotateCcw } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';
import { saveSystem } from '../game/systems/SaveSystem';

interface BootScreenProps {
  onInitialize: () => void;
  onStartDemoMode: () => void;
  onOpenProfile: () => void;
  onOpenAchievements: () => void;
  onOpenProtocols: () => void;
  onOpenControls: () => void;
  onRunCommand: (cmd: string) => { success: boolean; message: string };
  onReplayTutorial?: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({
  onInitialize,
  onStartDemoMode,
  onOpenProfile,
  onOpenAchievements,
  onOpenProtocols,
  onOpenControls,
  onRunCommand,
  onReplayTutorial,
}) => {
  const [bootStep, setBootStep] = useState<number>(0);
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const hasSeenBoot = saveSystem.isBootSequenceSeen();

  useEffect(() => {
    if (hasSeenBoot) {
      setBootStep(6);
      return;
    }

    const timers = [
      setTimeout(() => { setBootStep(1); soundSynth.playUiClick(); }, 250),
      setTimeout(() => { setBootStep(2); soundSynth.playUiClick(); }, 600),
      setTimeout(() => { setBootStep(3); soundSynth.playUiClick(); }, 950),
      setTimeout(() => { setBootStep(4); soundSynth.playUiClick(); }, 1300),
      setTimeout(() => { setBootStep(5); soundSynth.playPowerRoute(); }, 1650),
      setTimeout(() => {
        setBootStep(6);
        saveSystem.setBootSequenceSeen(true);
      }, 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [hasSeenBoot]);

  const handleFastSkip = () => {
    soundSynth.playUiClick();
    setBootStep(6);
    saveSystem.setBootSequenceSeen(true);
  };

  const handleStartCampaign = () => {
    soundSynth.init();
    soundSynth.playUiClick();
    onInitialize();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const res = onRunCommand(commandInput);
    setTerminalLogs((prev) => [...prev, `> ${commandInput}`, res.message]);
    setCommandInput('');
  };

  return (
    <div
      id="boot-screen-container"
      className="absolute inset-0 z-50 bg-[#050605] text-[#00ff9f] font-mono flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #0a1a14 0%, #050605 100%)',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 2px)',
        }}
      />

      {/* Skip Button during initial sequence */}
      {bootStep < 6 && (
        <button
          id="btn-fast-boot-skip"
          onClick={handleFastSkip}
          className="absolute top-6 right-6 z-30 px-3 py-1.5 bg-black/60 hover:bg-[#00ff9f]/20 text-[#00ff9f] border border-[#00ff9f]/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <FastForward className="w-3.5 h-3.5" />
          FAST BOOT [ SKIP ]
        </button>
      )}

      {/* Main Terminal Frame */}
      <div
        id="boot-terminal-card"
        className="relative z-20 w-full max-w-2xl border-2 border-[#00ff9f]/40 bg-[#070907]/95 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,255,159,0.15)]"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00ff9f]" />
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00ff9f]">
              VX-01 COMBAT RIG // BOOT SEQUENCE v1.2.0-POLISH
            </span>
          </div>
          <span className="text-xs text-amber-400 animate-pulse font-bold tracking-wider">
            SYSTEM STANDBY
          </span>
        </div>

        {/* Diagnostic Checklist */}
        <div className="space-y-2.5 mb-6 text-xs sm:text-sm">
          {bootStep >= 1 && (
            <div className="flex items-center justify-between text-white/80">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00ff9f]" />
                NEURAL CORE INTERFACE
              </span>
              <span className="text-[#00ff9f] font-bold tracking-widest">ONLINE [100%]</span>
            </div>
          )}
          {bootStep >= 2 && (
            <div className="flex items-center justify-between text-white/80">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00ff9f]" />
                ION PROPULSION & THRUSTERS
              </span>
              <span className="text-[#00ff9f] font-bold tracking-widest">CALIBRATED</span>
            </div>
          )}
          {bootStep >= 3 && (
            <div className="flex items-center justify-between text-white/80">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00ff9f]" />
                WEAPON MODULAR CAPACITORS
              </span>
              <span className="text-[#00ff9f] font-bold tracking-widest">ARMED</span>
            </div>
          )}
          {bootStep >= 4 && (
            <div className="flex items-center justify-between text-white/80">
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ff3e3e]" />
                THERMAL DISSIPATION MANIFOLD
              </span>
              <span className="text-[#ff3e3e] font-bold tracking-widest animate-pulse">
                UNREGULATED [MANUAL COOLING REQUIRED]
              </span>
            </div>
          )}
          {bootStep >= 5 && (
            <div className="pt-2 border-t border-[#00ff9f]/20 text-xs text-white/60 flex items-center justify-between">
              <span>OPERATOR STATUS: <span className="text-[#00ff9f] font-bold">RECOGNISED</span></span>
              <span>TACTICAL AI: <span className="text-[#00ff9f] font-bold">ACTIVE</span></span>
            </div>
          )}
        </div>

        {/* Central Title & Prompt */}
        <div className="text-center py-2 mb-5">
          <h1 className="text-4xl sm:text-5xl font-black tracking-widest text-white drop-shadow-[0_0_25px_rgba(0,255,159,0.5)] mb-1">
            OVERCLOCK
          </h1>
          <p className="text-xs uppercase tracking-widest text-white/60 italic">
            "How far can you push the machine before it pushes back?"
          </p>
        </div>

        {/* Main Action Hub */}
        {bootStep >= 6 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="btn-initialize-campaign"
                onClick={handleStartCampaign}
                className="py-3.5 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black tracking-widest text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_0_25px_#00ff9f]"
              >
                <Play className="w-4 h-4 fill-current" />
                INITIALIZE CAMPAIGN
              </button>

              <button
                id="btn-start-demo-showcase"
                onClick={() => {
                  soundSynth.init();
                  soundSynth.playUiClick();
                  onStartDemoMode();
                }}
                className="py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black tracking-widest text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[0_0_25px_rgba(251,191,36,0.5)]"
              >
                <FastForward className="w-4 h-4 fill-current" />
                DEMO MODE [ JUDGE SHOWCASE ]
              </button>
            </div>

            {/* Sub-Actions Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              <button
                id="btn-open-profile-menu"
                onClick={() => {
                  soundSynth.playUiClick();
                  onOpenProfile();
                }}
                className="p-2 bg-black/60 hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-white hover:text-[#00ff9f] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#00ff9f]" />
                PROFILE
              </button>

              <button
                id="btn-open-achievements-menu"
                onClick={() => {
                  soundSynth.playUiClick();
                  onOpenAchievements();
                }}
                className="p-2 bg-black/60 hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-white hover:text-[#00ff9f] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                ACHIEVEMENTS
              </button>

              <button
                id="btn-open-protocols-menu"
                onClick={() => {
                  soundSynth.playUiClick();
                  onOpenProtocols();
                }}
                className="p-2 bg-black/60 hover:bg-[#ff3e3e]/20 border border-[#ff3e3e]/30 text-white hover:text-[#ff3e3e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff3e3e]" />
                PROTOCOLS
              </button>

              <button
                id="btn-open-controls-menu"
                onClick={() => {
                  soundSynth.playUiClick();
                  onOpenControls();
                }}
                className="p-2 bg-black/60 hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-white hover:text-[#00ff9f] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#38bdf8]" />
                MANUAL
              </button>

              {onReplayTutorial && (
                <button
                  id="btn-replay-tutorial"
                  onClick={() => {
                    soundSynth.playUiClick();
                    onReplayTutorial();
                  }}
                  className="p-2 bg-black/60 hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-white hover:text-[#00ff9f] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#00ff9f]" />
                  REPLAY TUTORIAL
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hidden Console Log Feed */}
        {terminalLogs.length > 0 && (
          <div className="mt-4 p-3 bg-black/80 border border-[#00ff9f]/20 text-xs max-h-24 overflow-y-auto space-y-1 text-white/80">
            {terminalLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        )}

        {/* Boot Terminal Input */}
        <form onSubmit={handleCommandSubmit} className="mt-4 flex gap-2">
          <span className="text-xs text-[#00ff9f] font-bold py-1.5">{'>'}</span>
          <input
            id="boot-terminal-input"
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="sys.status (try 'sudo overclock --unsafe', 'ai.opinion', 'help')"
            className="flex-1 bg-black/60 border border-[#00ff9f]/30 px-3 py-1.5 text-xs text-[#00ff9f] placeholder-[#00ff9f]/30 focus:outline-none focus:border-[#00ff9f]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#00ff9f]/20 hover:bg-[#00ff9f]/40 text-[#00ff9f] text-xs font-bold border border-[#00ff9f]/40 cursor-pointer transition-colors"
          >
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};
