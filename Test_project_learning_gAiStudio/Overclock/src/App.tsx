import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GameEngine } from './game/systems/GameEngine';
import { TelemetrySnapshot, UpgradeDef, PowerAllocation, MissionDef } from './game/types';
import { MISSIONS } from './game/data/missions';
import { GameCanvas } from './components/GameCanvas';
import { BootScreen } from './components/BootScreen';
import { MissionSelectModal } from './components/MissionSelectModal';
import { BriefingModal } from './components/BriefingModal';
import { MissionVictoryModal } from './components/MissionVictoryModal';
import { PauseModal } from './components/PauseModal';
import { UpgradeModal } from './components/UpgradeModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { TerminalDrawer } from './components/TerminalDrawer';
import { PowerRouter } from './components/PowerRouter';
import { OnScreenControls } from './components/OnScreenControls';
import { ControlsModal } from './components/ControlsModal';
import { WeaponModModal } from './components/WeaponModModal';
import { HudOverlay } from './components/HudOverlay';
import { AchievementToast } from './components/AchievementToast';
import { AchievementsModal } from './components/AchievementsModal';
import { OperatorProfileModal } from './components/OperatorProfileModal';
import { ProtocolSelectModal } from './components/ProtocolSelectModal';
import { LandingPage } from './components/LandingPage';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { AuthLoadingScreen, AuthGrantedScreen, AuthErrorScreen, UserBadge } from './components/AuthScreen';
import { useAuth } from './game/auth/AuthContext';
import { onboardingSystem } from './game/systems/OnboardingSystem';
import { achievementSystem } from './game/systems/AchievementSystem';
import { AchievementDef } from './game/types';
import {
  Terminal as TermIcon,
  Crosshair,
  Zap,
  Shield,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  Radio,
  HelpCircle,
  Wrench,
  Radiation,
  Coins,
  Pause,
} from 'lucide-react';
import { soundSynth } from './game/audio/SoundSynth';

export default function App() {
  // Auth context
  const auth = useAuth();

  // Landing page state
  const [showLanding, setShowLanding] = useState(true);
  const [showAuthGranted, setShowAuthGranted] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  // Handle OAuth callback redirect — AuthContext already cleans the URL.
  // We just need to detect the auth=success param to trigger the granted transition.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authResult = params.get('auth');
    if (authResult === 'success' && showLanding) {
      setShowLanding(false);
      setShowAuthGranted(true);
      setTimeout(() => {
        setShowAuthGranted(false);
        setGameReady(true);
      }, 1500);
    } else if (authResult === 'error' && showLanding) {
      // AuthContext handles the error state — just stay on landing
    }
  }, [showLanding]);

  // When auth state changes, handle transitions
  useEffect(() => {
    if (auth.state === 'authenticated' && showLanding) {
      setShowLanding(false);
      setShowAuthGranted(true);
      setTimeout(() => {
        setShowAuthGranted(false);
        setGameReady(true);
      }, 1500);
    }
  }, [auth.state, showLanding]);

  // When logged out, return to landing page
  useEffect(() => {
    if (auth.state === 'unauthenticated' && gameReady && !showLanding) {
      setGameReady(false);
      setShowLanding(true);
      onboardingSystem.skipTutorial();
    }
  }, [auth.state, gameReady, showLanding]);

  // Reference to persistent engine instance
  const engineRef = useRef<GameEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new GameEngine((snap) => {
      setTelemetry({ ...snap });
    });
  }

  const engine = engineRef.current;

  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>(() => engine.getTelemetrySnapshot());
  const [isMuted, setIsMuted] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isPowerRouterOpen, setIsPowerRouterOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isWeaponModOpen, setIsWeaponModOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isProtocolsOpen, setIsProtocolsOpen] = useState(false);
  const [activeToastAchievement, setActiveToastAchievement] = useState<AchievementDef | null>(null);

  // Achievement unlock subscription
  useEffect(() => {
    achievementSystem.onUnlock((ach) => {
      setActiveToastAchievement(ach);
    });
  }, []);

  // Auto-pause when modal overlays open
  useEffect(() => {
    if (
      isPowerRouterOpen ||
      isControlsOpen ||
      isWeaponModOpen ||
      isTerminalOpen ||
      isProfileOpen ||
      isAchievementsOpen ||
      isProtocolsOpen
    ) {
      if (engine.mode === 'PLAYING') {
        engine.pause();
      }
    }
  }, [
    isPowerRouterOpen,
    isControlsOpen,
    isWeaponModOpen,
    isTerminalOpen,
    isProfileOpen,
    isAchievementsOpen,
    isProtocolsOpen,
    engine,
  ]);

  // Global Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      // Prevent default page scroll on arrow keys & spacebar
      if (
        ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code) ||
        [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Escape / P toggles Pause or closes open drawers
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isTerminalOpen) {
          setIsTerminalOpen(false);
          return;
        }
        if (isPowerRouterOpen) {
          setIsPowerRouterOpen(false);
          return;
        }
        if (isControlsOpen) {
          setIsControlsOpen(false);
          return;
        }
        if (isWeaponModOpen) {
          setIsWeaponModOpen(false);
          return;
        }

        if (engine.mode === 'PLAYING' || engine.mode === 'PAUSED') {
          engine.togglePause();
          return;
        }
      }

      if (e.code === 'Backquote' || e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
        soundSynth.playUiClick();
        return;
      }

      if (e.code === 'KeyP' || e.key === 'p' || e.key === 'P') {
        if (engine.mode === 'PLAYING' || engine.mode === 'PAUSED') {
          engine.togglePause();
          return;
        }
      }

      if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
        setIsPowerRouterOpen((prev) => !prev);
        soundSynth.playUiClick();
        return;
      }

      if (e.code === 'KeyU' || e.key === 'u' || e.key === 'U') {
        setIsWeaponModOpen((prev) => !prev);
        soundSynth.playUiClick();
        return;
      }

      if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        const nextMuted = soundSynth.toggleMute();
        setIsMuted(nextMuted);
        return;
      }

      if (e.code === 'KeyH' || e.key === 'h' || e.key === 'H' || e.key === '?') {
        setIsControlsOpen((prev) => !prev);
        soundSynth.playUiClick();
        return;
      }

      engine.handleKeyDown(e.code, e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      engine.handleKeyUp(e.code, e.key);
    };

    const handleBlur = () => {
      engine.clearKeys();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleBlur);
    };
  }, [engine, isTerminalOpen, isPowerRouterOpen, isControlsOpen, isWeaponModOpen]);

  // --- Onboarding State ---
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if tutorial should show on game ready
  useEffect(() => {
    if (gameReady && onboardingSystem.shouldShowTutorial()) {
      setShowOnboarding(true);
      onboardingSystem.startTutorial();
      // Initialize tutorial arena using the engine's dedicated method
      engine.startTutorialArena();
    }
  }, [gameReady]);

  const handleTutorialComplete = useCallback(() => {
    setShowOnboarding(false);
    onboardingSystem.completeTutorial();
    engine.openMissionSelect();
    setTelemetry(engine.getTelemetrySnapshot());
  }, [engine]);

  const handleTutorialSkipped = useCallback(() => {
    setShowOnboarding(false);
    onboardingSystem.skipTutorial();
    engine.openMissionSelect();
    setTelemetry(engine.getTelemetrySnapshot());
  }, [engine]);

  // --- Landing Page Handlers ---
  const handleEnterFacility = () => {
    soundSynth.init();
    auth.login();
  };

  const handleStartDemoFromLanding = () => {
    soundSynth.init();
    setShowLanding(false);
    setGameReady(true);
    // Demo mode starts after engine is ready
    setTimeout(() => {
      engine.startDemoMode();
      setTelemetry(engine.getTelemetrySnapshot());
    }, 100);
  };

  // Action Dispatchers
  const handleStartFromBoot = () => {
    soundSynth.init();
    engine.openMissionSelect();
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleSelectMissionIndex = (idx: number) => {
    engine.openBriefing(idx);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleLaunchCurrentMission = () => {
    engine.launchCurrentMission();
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleReturnToMissionSelect = () => {
    engine.openMissionSelect();
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleStartEndless = () => {
    engine.startEndlessMode();
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleSelectWeapon = (idx: number) => {
    engine.selectWeapon(idx);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleToggleOverclock = () => {
    engine.toggleOverclock();
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handlePowerChange = (channel: keyof PowerAllocation, val: number) => {
    engine.powerSystem.setChannel(channel, val);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handlePowerPreset = (preset: 'BALANCED' | 'ATTACK' | 'EVASION' | 'DEFENSE' | 'COOLING') => {
    engine.powerSystem.applyPreset(preset);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleSelectUpgrade = (upg: UpgradeDef) => {
    engine.selectUpgrade(upg);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleSelectMutation = (mutation: any) => {
    engine.selectEndlessMutation(mutation);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleUnlockModSlot = (weaponId: any, slotType: any) => {
    engine.unlockModSlot(weaponId, slotType);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleEquipMod = (weaponId: any, slotType: any, modId?: string) => {
    engine.equipMod(weaponId, slotType, modId);
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleRestartMission = () => {
    engine.restartMission();
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleNextMission = () => {
    engine.proceedToNextMission();
    setTelemetry(engine.getTelemetrySnapshot());
  };

  const handleRunCommand = (cmd: string) => {
    const res = engine.executeTerminalCommand(cmd);
    setTelemetry(engine.getTelemetrySnapshot());
    return res;
  };

  const toggleMuteAudio = () => {
    const nextMuted = soundSynth.toggleMute();
    setIsMuted(nextMuted);
  };

  // Current Active Mode from Telemetry
  const currentMode = telemetry?.currentMode || engine.mode;

  // Format mission clock: 00:14:22:89
  const formattedClock = useMemo(() => {
    if (!telemetry) return '00:00:00:00';
    const totalSec = telemetry.gameTimeSec || 0;
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    const millis = Math.floor((totalSec % 1) * 100);
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${millis
      .toString()
      .padStart(2, '0')}`;
  }, [telemetry?.gameTimeSec]);

  // Thermal Gauge computation
  const heat = telemetry?.heat ?? 0;
  const isMeltdownImminent = heat >= 95 || telemetry?.heatState === 'MELTDOWN';
  const isCriticalHeat = heat >= 85;
  const isWarningHeat = heat >= 70;

  // Energy & Core calculations
  const corePct = telemetry ? Math.max(0, Math.min(100, (telemetry.core / telemetry.maxCore) * 100)) : 100;
  const energyVal = telemetry ? Math.round(telemetry.energy) : 100;
  const maxEnergyVal = telemetry ? telemetry.maxEnergy : 100;

  const currentMissionDef = MISSIONS[engine.currentMissionIndex] || MISSIONS[0];

  // --- RENDER ---

  // LANDING PAGE (unauthenticated, entry point)
  if (showLanding && auth.state !== 'authenticated') {
    return (
      <LandingPage
        onEnterFacility={handleEnterFacility}
        onStartDemoMode={handleStartDemoFromLanding}
      />
    );
  }

  // AUTH LOADING
  if (auth.state === 'loading' && !showAuthGranted && !gameReady) {
    return <AuthLoadingScreen />;
  }

  // AUTH ERROR
  if (auth.state === 'error' && auth.error) {
    return (
      <AuthErrorScreen
        error={auth.error}
        onRetry={() => {
          auth.refreshAuth();
          setShowLanding(true);
        }}
      />
    );
  }

  // AUTH GRANTED TRANSITION
  if (showAuthGranted) {
    return <AuthGrantedScreen />;
  }

  // GAME NOT READY YET (waiting for auth)
  if (!gameReady && auth.state !== 'authenticated' && !showLanding) {
    return <AuthLoadingScreen />;
  }

  return (
    <div
      id="app-root-container"
      className="w-screen h-screen bg-[#050605] text-[#00ff9f] font-mono flex flex-col overflow-hidden select-none relative"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #0a1a14 0%, #050605 100%)',
        border: '4px solid #1a1a1a',
      }}
    >
      {/* SCANLINE & RETRO OVERLAY */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-40"
        style={{
          background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 2px)',
        }}
      />

      {/* ONBOARDING OVERLAY (First-time tutorial) */}
      {showOnboarding && (
        <OnboardingOverlay
          engine={engine}
          onTutorialComplete={handleTutorialComplete}
          onTutorialSkipped={handleTutorialSkipped}
        />
      )}

      {/* TOP NAV / SYSTEM BAR */}
      <header
        id="cockpit-top-bar"
        className="h-12 border-b border-[#00ff9f]/30 flex items-center justify-between px-4 sm:px-6 bg-[#0a0c0a] z-30 shrink-0"
      >
        {/* Left Branding & Mission Code */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => {
              soundSynth.playUiClick();
              engine.openMissionSelect();
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="Return to Mission Select"
          >
            <span className="text-base sm:text-lg font-black tracking-widest text-white">
              OVERCLOCK{' '}
              <span className="text-[10px] bg-[#00ff9f] text-black font-bold px-1 py-0.5 ml-1">
                VX-01
              </span>
            </span>
          </button>

          <div className="hidden sm:flex gap-4 text-[11px] opacity-80">
            <span>
              MISSION:{' '}
              <span className="text-[#00ff9f] font-bold">
                {telemetry?.missionCode || 'M-01'}
              </span>
            </span>
            <span>
              WAVE:{' '}
              <span className="text-[#00ff9f] font-bold">
                {telemetry?.missionWave || 1} / {telemetry?.totalWaves || 3}
              </span>
            </span>
          </div>
        </div>

        {/* Center Sector Progress / Objective / Endless Mutations */}
        <div className="text-center hidden md:flex items-center gap-3">
          {telemetry?.isEndlessMode ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] text-[#ff3e3e] font-black flex items-center gap-1 bg-[#1a070a] px-2.5 py-1 border border-[#ff3e3e]/40">
                <Radiation className="w-3.5 h-3.5 text-[#ff3e3e] animate-pulse" />
                <span>ENDLESS SECTOR // WAVE {telemetry.endlessWaveNumber}</span>
              </span>
              {(telemetry.activeMutations || []).length > 0 && (
                <span className="text-[9px] bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 font-bold">
                  {telemetry.activeMutations.length} MUTATION{telemetry.activeMutations.length > 1 ? 'S' : ''} ACTIVE
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px] tracking-[0.2em] text-white/70">
              DIRECTIVE:{' '}
              <span className="text-[#00ff9f] font-bold text-xs">
                {telemetry?.primaryObjectiveText || 'SECURE SECTOR'}
              </span>
            </span>
          )}
        </div>

        {/* Right System Clock & Score Multiplier & Credits */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* User Badge (when authenticated) */}
          {auth.state === 'authenticated' && auth.user && (
            <UserBadge />
          )}
          {/* Cyber Credits */}
          <div className="flex items-center gap-1.5 bg-[#0a1a14] border border-[#00ff9f]/30 px-2.5 py-1 text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-white/50">CREDITS:</span>
            <span className="font-bold text-[#00ff9f]">
              {(telemetry?.cyberCredits || 0).toLocaleString()} ⬡
            </span>
          </div>

          <div className="text-right hidden lg:block">
            <div className="text-[9px] text-white/50 uppercase tracking-wider">System Clock</div>
            <div className="text-xs text-[#00ff9f] font-bold">{formattedClock}</div>
          </div>

          <div className="text-right">
            <div className="text-[9px] text-white/50 uppercase tracking-wider">Multiplier / Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-amber-400">
                x{(telemetry?.comboMultiplier ?? 1.0).toFixed(1)}
              </span>
              <span className="text-sm font-black text-white">
                {(telemetry?.score ?? 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 border-l border-[#00ff9f]/20 pl-2 sm:pl-3">
            <button
              id="btn-nav-pause"
              onClick={() => engine.togglePause()}
              title="Pause Simulation (ESC or P)"
              className="p-1.5 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-[#00ff9f] border border-[#00ff9f]/30 cursor-pointer text-xs font-bold flex items-center gap-1"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-nav-weapon-mods"
              onClick={() => setIsWeaponModOpen(true)}
              title="Armament Modding Matrix (U)"
              className="px-2 py-1 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-[#00ff9f] border border-[#00ff9f]/40 cursor-pointer text-xs font-bold hidden sm:flex items-center gap-1 shadow-[0_0_8px_rgba(0,255,159,0.2)]"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>MODS [U]</span>
            </button>
            <button
              id="btn-nav-controls"
              onClick={() => setIsControlsOpen(true)}
              title="Controls & Keybindings Guide (H or ?)"
              className="p-1.5 bg-[#0a1a14] hover:bg-[#00ff9f]/20 text-[#00ff9f] border border-[#00ff9f]/30 cursor-pointer text-xs font-bold flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-nav-mute"
              onClick={toggleMuteAudio}
              title="Toggle Audio (M)"
              className="p-1.5 hover:bg-[#00ff9f]/20 text-[#00ff9f] border border-transparent hover:border-[#00ff9f]/30 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#ff3e3e]" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-nav-terminal"
              onClick={() => setIsTerminalOpen(true)}
              title="Open Terminal (`)"
              className="p-1.5 hover:bg-[#00ff9f]/20 text-[#00ff9f] border border-[#00ff9f]/30 cursor-pointer text-xs font-bold hidden sm:flex items-center gap-1"
            >
              <TermIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN BODY COCKPIT AREA: LEFT SIDEBAR + ARENA + RIGHT SIDEBAR */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT SIDEBAR: POWER ROUTING & CORE INTEGRITY */}
        <aside
          id="cockpit-left-sidebar"
          className="w-64 border-r border-[#00ff9f]/20 p-4 flex flex-col justify-between bg-[#070907] shrink-0 overflow-y-auto hidden md:flex"
        >
          {/* Section: Power Allocation */}
          <div>
            <div className="flex items-center justify-between border-b border-[#00ff9f]/20 pb-1 mb-3">
              <h3 className="text-[10px] uppercase tracking-wider text-white/70 font-bold">
                Power Allocation
              </h3>
              <button
                onClick={() => setIsPowerRouterOpen(true)}
                className="text-[9px] text-[#00ff9f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                ROUTER [R]
              </button>
            </div>

            <div className="space-y-3.5">
              {/* WEAPONS */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/80">WEAPONS</span>
                  <span className="text-[#00ff9f] font-bold">
                    {telemetry?.power.weapons ?? 25}%
                  </span>
                </div>
                <div className="h-2 bg-[#1a1a1a] border border-[#00ff9f]/30 p-[1px]">
                  <div
                    className="h-full bg-[#00ff9f] shadow-[0_0_8px_#00ff9f] transition-all duration-100"
                    style={{ width: `${telemetry?.power.weapons ?? 25}%` }}
                  />
                </div>
              </div>

              {/* ENGINE */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/80">ENGINE</span>
                  <span className="text-[#00ff9f] font-bold">
                    {telemetry?.power.engine ?? 25}%
                  </span>
                </div>
                <div className="h-2 bg-[#1a1a1a] border border-[#00ff9f]/30 p-[1px]">
                  <div
                    className="h-full bg-[#00ff9f] transition-all duration-100"
                    style={{ width: `${telemetry?.power.engine ?? 25}%` }}
                  />
                </div>
              </div>

              {/* SHIELD */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/80">SHIELD</span>
                  <span className="text-[#00ff9f] font-bold">
                    {telemetry?.power.shield ?? 25}%
                  </span>
                </div>
                <div className="h-2 bg-[#1a1a1a] border border-[#00ff9f]/30 p-[1px]">
                  <div
                    className="h-full bg-[#00ff9f] transition-all duration-100"
                    style={{ width: `${telemetry?.power.shield ?? 25}%` }}
                  />
                </div>
              </div>

              {/* COOLING */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-[#ff3e3e]">
                  <span>COOLING</span>
                  <span>{telemetry?.power.cooling ?? 25}%</span>
                </div>
                <div className="h-2 bg-[#1a1a1a] border border-[#ff3e3e]/50 p-[1px]">
                  <div
                    className="h-full bg-[#ff3e3e] transition-all duration-100"
                    style={{ width: `${telemetry?.power.cooling ?? 25}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-4 pt-3 border-t border-[#00ff9f]/20">
              <div className="text-[9px] text-white/50 uppercase mb-1.5">Power Presets (Key)</div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  onClick={() => handlePowerPreset('BALANCED')}
                  className="px-2 py-1 bg-[#0a1a14] hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-[#00ff9f] text-left cursor-pointer transition-colors"
                >
                  [Z] BALANCED
                </button>
                <button
                  onClick={() => handlePowerPreset('ATTACK')}
                  className="px-2 py-1 bg-[#0a1a14] hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-[#00ff9f] text-left cursor-pointer transition-colors"
                >
                  [X] ATTACK
                </button>
                <button
                  onClick={() => handlePowerPreset('EVASION')}
                  className="px-2 py-1 bg-[#0a1a14] hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-[#00ff9f] text-left cursor-pointer transition-colors"
                >
                  [C] EVASION
                </button>
                <button
                  onClick={() => handlePowerPreset('DEFENSE')}
                  className="px-2 py-1 bg-[#0a1a14] hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-[#00ff9f] text-left cursor-pointer transition-colors"
                >
                  [V] DEFENSE
                </button>
              </div>
            </div>
          </div>

          {/* Section: Core Integrity Segmented Block Readout */}
          <div
            id="panel-core-integrity"
            className="border border-[#00ff9f]/20 p-3 bg-black/40 mt-4 shadow-inner"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[10px] uppercase text-white/60 font-bold">CORE INTEGRITY</h3>
              <span className="text-[10px] text-sky-400 font-bold">
                SHD: {Math.round(telemetry?.shield ?? 50)} SP
              </span>
            </div>

            {/* Segmented Core Health Bars */}
            <div className="flex items-end gap-1 h-10">
              {Array.from({ length: 8 }).map((_, i) => {
                const threshold = (i + 1) * 12.5;
                const isLit = corePct >= threshold - 6;
                const isWarning = corePct < 35;
                return (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-75 ${
                      isLit
                        ? isWarning
                          ? 'bg-[#ff3e3e] shadow-[0_0_6px_#ff3e3e]'
                          : 'bg-[#00ff9f] shadow-[0_0_6px_#00ff9f]'
                        : 'bg-[#1a1a1a]'
                    }`}
                    style={{ height: `${Math.min(100, (i + 1) * 13)}%` }}
                  />
                );
              })}
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div
                className={`text-2xl font-black ${
                  corePct < 30 ? 'text-[#ff3e3e] animate-pulse' : 'text-white'
                }`}
              >
                {corePct.toFixed(1)}%
              </div>
              <div className="text-[9px] text-white/50">
                MAX: {telemetry?.maxCore ?? 100} HP
              </div>
            </div>
          </div>

          {/* Section: Keyboard & Mouse Control Matrix */}
          <div
            id="panel-controls-matrix"
            className="border border-[#00ff9f]/20 p-2.5 bg-black/50 mt-3 text-[10px] space-y-1.5 font-mono"
          >
            <div className="text-[9px] uppercase tracking-wider text-white/60 font-bold border-b border-[#00ff9f]/20 pb-1 flex justify-between items-center">
              <span>INPUT KEYMAP</span>
              <span className="text-[#00ff9f] text-[8px]">TWIN-STICK READY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">MOVE:</span>
              <span className="text-[#00ff9f] font-bold">[W][A][S][D]</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">DIR FIRE:</span>
              <span className="text-[#00ff9f] font-bold">[ARROWS] / [IJKL]</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">CURSOR FIRE:</span>
              <span className="text-[#00ff9f] font-bold">[J] / [F] / L-CLICK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">DASH:</span>
              <span className="text-[#00ff9f] font-bold">[SPACE] / R-CLICK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">OVERCLOCK:</span>
              <span className="text-[#00ff9f] font-bold">[Q]</span>
            </div>
          </div>
        </aside>

        {/* MAIN COMBAT ARENA (CENTER) */}
        <main
          id="cockpit-arena-center"
          className="flex-1 relative bg-black flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(#111 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        >
          {/* RETICLE RADAR RINGS IN BACKGROUND */}
          <div className="absolute w-[520px] h-[520px] border border-[#00ff9f]/5 rounded-full pointer-events-none" />
          <div className="absolute w-[320px] h-[320px] border border-[#00ff9f]/10 rounded-full pointer-events-none" />
          <div className="absolute w-[160px] h-[160px] border border-[#00ff9f]/15 rounded-full pointer-events-none" />

          {/* OVERCLOCK CRITICAL WARNING BORDER OVERLAY */}
          {telemetry?.isOverclocked && (
            <div
              className={`absolute inset-0 pointer-events-none border-[16px] mix-blend-overlay z-20 animate-pulse ${
                telemetry.isSupercritical
                  ? 'border-[#00ff9f]/25 shadow-[inset_0_0_50px_rgba(0,255,159,0.3)]'
                  : 'border-[#ff3e3e]/20 shadow-[inset_0_0_50px_rgba(255,62,62,0.3)]'
              }`}
            />
          )}

          {/* CANVAS COMPONENT */}
          <GameCanvas engine={engine} />

          {/* ON-SCREEN / MOBILE TOUCH CONTROLS */}
          {(engine.mode === 'PLAYING' || engine.mode === 'OBJECTIVE_COMPLETE') && (
            <OnScreenControls engine={engine} />
          )}
        </main>

        {/* RIGHT SIDEBAR: THERMAL SYNC & ENERGY BUFFER */}
        <aside
          id="cockpit-right-sidebar"
          className="w-64 border-l border-[#00ff9f]/20 p-4 flex flex-col justify-between bg-[#070907] shrink-0 overflow-y-auto hidden md:flex"
        >
          {/* Top Section: Thermal Sync Vertical Column */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <h3 className="text-[10px] uppercase tracking-wider text-white/70 mb-3 border-b border-[#00ff9f]/20 pb-1 font-bold">
              Thermal Sync
            </h3>

            {/* Big Vertical Gauge */}
            <div className="flex-1 bg-[#1a1a1a] w-full relative overflow-hidden border border-[#ff3e3e]/30 shadow-inner">
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#ff3e3e] to-[#ffaa00] transition-all duration-100 ${
                  isMeltdownImminent ? 'animate-pulse shadow-[0_0_25px_#ff3e3e]' : 'shadow-[0_0_15px_#ff3e3e]'
                }`}
                style={{ height: `${Math.min(100, Math.max(0, heat))}%` }}
              />

              {/* Scanlines inside gauge */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px)',
                }}
              />

              {/* 85% Critical Line & Label */}
              <div className="absolute top-[15%] left-0 right-0 h-[1px] bg-white animate-pulse" />
              <div className="absolute top-[15%] right-2 text-[#ff3e3e] text-[10px] font-black animate-pulse">
                CRITICAL
              </div>

              {/* 70% Warning Line */}
              <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-amber-400/60" />
              <div className="absolute top-[30%] right-2 text-amber-400 text-[9px] font-bold">
                WARN
              </div>
            </div>

            {/* Readout below gauge */}
            <div className="mt-2 flex justify-between items-baseline">
              <span
                className={`text-3xl font-black ${
                  isMeltdownImminent
                    ? 'text-rose-500 animate-pulse'
                    : isCriticalHeat
                    ? 'text-[#ff3e3e]'
                    : isWarningHeat
                    ? 'text-amber-400'
                    : 'text-[#00ff9f]'
                }`}
              >
                {heat.toFixed(1)}°C
              </span>
              <span className="text-[10px] text-white/50">LIMIT: 100°C</span>
            </div>
          </div>

          {/* Bottom Section: Energy Buffer */}
          <div className="border-t border-[#00ff9f]/20 pt-4 mt-4">
            <h3 className="text-[10px] uppercase text-white/70 mb-2 font-bold">ENERGY BUFFER</h3>

            {/* Segmented Energy Blocks */}
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const chunkPct = (idx + 1) * 20;
                const isLit = (energyVal / maxEnergyVal) * 100 >= chunkPct - 10;
                return (
                  <div
                    key={idx}
                    className={`h-7 transition-all duration-75 ${
                      isLit
                        ? 'bg-[#00ff9f] shadow-[0_0_8px_#00ff9f]'
                        : 'bg-[#1a1a1a]'
                    }`}
                  />
                );
              })}
            </div>

            <div className="mt-2 flex justify-between items-baseline">
              <span className="text-lg font-bold text-white">
                {energyVal} / {maxEnergyVal} J
              </span>
              <span className="text-[9px] text-[#00ff9f]">
                {Math.round((energyVal / maxEnergyVal) * 100)}%
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER: WEAPONS & TACTICAL LOG & OVERCLOCK TRIGGER */}
      <footer
        id="cockpit-bottom-deck"
        className="h-40 border-t border-[#00ff9f]/30 flex p-3 gap-3 bg-[#0a0c0a] z-30 shrink-0"
      >
        {/* Left: Weapons Selection Dock */}
        <div className="w-1/3 min-w-[240px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-white/50 border-b border-[#00ff9f]/20 pb-1 mb-1">
            <span>ARMAMENT DECK</span>
            <div className="flex items-center gap-2">
              <button
                id="btn-open-mod-matrix"
                onClick={() => setIsWeaponModOpen(true)}
                className="text-[9px] text-[#00ff9f] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <Wrench className="w-3 h-3" />
                MOD MATRIX [U]
              </button>
              <span>[1-6]</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 h-full overflow-y-auto">
            {(telemetry?.availableWeapons ?? []).map((wpn, idx) => {
              const isSelected = telemetry?.activeWeapon?.id === wpn.id;
              return (
                <button
                  key={wpn.id}
                  id={`btn-weapon-dock-${idx}`}
                  onClick={() => handleSelectWeapon(idx)}
                  className={`p-2 flex flex-col justify-between text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-[#00ff9f] bg-[#00ff9f]/10 shadow-[0_0_12px_rgba(0,255,159,0.3)]'
                      : 'border border-[#00ff9f]/30 bg-black/40 hover:border-[#00ff9f]/60 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="text-[9px] text-white/60">
                    WEAPON_0{idx + 1}
                  </div>
                  <div className="text-xs font-bold uppercase text-white truncate">
                    {wpn.name}
                  </div>
                  <div className="text-[9px] text-[#00ff9f] flex justify-between">
                    <span>DMG: {wpn.damage}</span>
                    <span>+{wpn.heatPerShot}% H</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Tactical AI Command Log */}
        <div className="flex-1 bg-black/60 border border-[#00ff9f]/20 p-2.5 font-mono text-[10px] overflow-hidden flex flex-col justify-between leading-relaxed">
          <div className="flex items-center justify-between text-[9px] text-white/50 border-b border-[#00ff9f]/20 pb-1">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#00ff9f] animate-pulse" />
              TACTICAL_AI // OPERATOR FEED
            </span>
            <span className="text-[#00ff9f]">LOGS OK</span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-24 pr-1">
            {(telemetry?.tacticalLog ?? []).slice(0, 4).map((msg) => (
              <div
                key={msg.id}
                className={`truncate ${
                  msg.level === 'CRIT'
                    ? 'text-[#ff3e3e] font-bold animate-pulse'
                    : msg.level === 'WARN'
                    ? 'text-[#ffaa00]'
                    : msg.level === 'SECRET'
                    ? 'text-emerald-300 font-bold'
                    : 'text-[#00ff9f]/70'
                }`}
              >
                &gt; {msg.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Overclock Command Unit [Q] */}
        <div
          id="cockpit-overclock-node"
          className={`w-1/4 min-w-[200px] flex flex-col justify-center items-center border p-2 text-center transition-all ${
            telemetry?.isOverclocked
              ? telemetry.isSupercritical
                ? 'border-[#00ff9f] bg-[#00ff9f]/10 shadow-[0_0_20px_#00ff9f]'
                : 'border-[#ff3e3e] bg-[#ff3e3e]/10 shadow-[0_0_20px_#ff3e3e]'
              : 'border-[#00ff9f]/40 bg-[#070907]'
          }`}
        >
          <div className="text-[10px] tracking-[0.2em] mb-0.5 text-white/60">OVERCLOCK [Q]</div>
          <button
            id="btn-footer-overclock"
            onClick={handleToggleOverclock}
            className={`w-full py-1 text-2xl md:text-3xl font-black cursor-pointer transition-all ${
              telemetry?.isOverclocked
                ? telemetry.isSupercritical
                  ? 'text-[#00ff9f] animate-pulse'
                  : 'text-white animate-pulse'
                : 'text-[#00ff9f] hover:text-white'
            }`}
          >
            {telemetry?.isOverclocked
              ? telemetry.isSupercritical
                ? 'SUPERCRIT'
                : 'ACTIVE'
              : 'ENGAGE'}
          </button>
          <div
            className={`text-[10px] mt-0.5 font-bold ${
              telemetry?.isOverclocked ? 'text-[#ff3e3e] animate-pulse' : 'text-white/50'
            }`}
          >
            {telemetry?.isOverclocked
              ? `${(telemetry?.overclockTimeLeft ?? 0).toFixed(1)}s REMAINING`
              : 'PRESS Q OR CLICK'}
          </div>
        </div>
      </footer>

      {/* 1. Boot Screen */}
      {currentMode === 'BOOT' && (
        <BootScreen
          onInitialize={handleStartFromBoot}
          onStartDemoMode={() => engine.startDemoMode()}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenProtocols={() => setIsProtocolsOpen(true)}
          onOpenControls={() => setIsControlsOpen(true)}
          onRunCommand={handleRunCommand}
          onReplayTutorial={() => {
            onboardingSystem.replayTutorial();
            setShowOnboarding(true);
          }}
        />
      )}

      {/* 2. Campaign Mission Selector Screen */}
      {currentMode === 'MISSION_SELECT' && (
        <MissionSelectModal
          unlockedMissions={telemetry.unlockedMissions || engine.unlockedMissions}
          completedMissions={telemetry.completedMissions || engine.completedMissions}
          missionRatings={telemetry.missionRatings || engine.missionRatings}
          missionHighScores={telemetry.missionHighScores || engine.missionHighScores}
          cyberCredits={telemetry.cyberCredits ?? engine.cyberCredits}
          endlessUnlocked={telemetry.endlessUnlocked ?? engine.endlessUnlocked}
          endlessHighScore={telemetry.endlessHighScore ?? engine.endlessHighScore}
          endlessBestWave={telemetry.endlessBestWave ?? engine.endlessBestWave}
          onSelectMission={handleSelectMissionIndex}
          onStartEndless={handleStartEndless}
          onOpenMods={() => setIsWeaponModOpen(true)}
          onOpenControls={() => setIsControlsOpen(true)}
        />
      )}

      {/* 3. Mission Tactical Dossier & Briefing */}
      {currentMode === 'BRIEFING' && (
        <BriefingModal
          mission={currentMissionDef}
          onLaunch={handleLaunchCurrentMission}
          onBackToSelect={handleReturnToMissionSelect}
          cyberCredits={telemetry.cyberCredits ?? engine.cyberCredits}
        />
      )}

      {/* 4. Centralized Pause Overlay */}
      {currentMode === 'PAUSED' && telemetry && (
        <PauseModal
          telemetry={telemetry}
          onResume={() => engine.resume()}
          onRestartMission={handleRestartMission}
          onReturnToSelect={handleReturnToMissionSelect}
          onOpenControls={() => setIsControlsOpen(true)}
          isMuted={isMuted}
          onToggleMute={toggleMuteAudio}
          onLogout={auth.state === 'authenticated' ? auth.logout : undefined}
        />
      )}

      {/* 5. Mission Victory / Sector Secured Overlay */}
      {currentMode === 'MISSION_COMPLETE' && (engine.lastMissionStats || telemetry.lastMissionStats) && (
        <MissionVictoryModal
          stats={engine.lastMissionStats || telemetry.lastMissionStats!}
          onProceedToUpgrades={() => engine.proceedToUpgrades()}
          onNextMission={handleNextMission}
          onRetry={handleRestartMission}
          onReturnToSelect={handleReturnToMissionSelect}
          hasNextMission={engine.currentMissionIndex < MISSIONS.length - 1}
        />
      )}

      {/* 6. Upgrade Selection Modal */}
      {currentMode === 'UPGRADE_SELECT' && (
        <UpgradeModal
          choices={engine.currentUpgradeChoices}
          onSelect={handleSelectUpgrade}
          mutationChoices={engine.currentMutationChoices}
          onSelectMutation={handleSelectMutation}
          isEndlessMode={engine.isEndlessMode}
        />
      )}

      {/* 7. Game Over Screen */}
      {currentMode === 'GAME_OVER' && telemetry && (
        <GameOverModal
          telemetry={telemetry}
          onRestart={handleRestartMission}
          onReturnToSelect={handleReturnToMissionSelect}
        />
      )}

      {/* 8. Full Campaign Victory (Post-Mission 06 Boss) */}
      {currentMode === 'CAMPAIGN_VICTORY' && telemetry && (
        <VictoryModal
          telemetry={telemetry}
          onRestart={() => engine.startMission(0)}
          onStartEndless={handleStartEndless}
          onReturnToSelect={handleReturnToMissionSelect}
        />
      )}

      {/* 9. Terminal Console Drawer */}
      <TerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onRunCommand={handleRunCommand}
      />

      {/* 10. Power Router Modal */}
      {isPowerRouterOpen && telemetry && (
        <PowerRouter
          power={telemetry.power}
          onSetChannel={handlePowerChange}
          onApplyPreset={handlePowerPreset}
          onClose={() => setIsPowerRouterOpen(false)}
        />
      )}

      {/* 11. Controls & Keybindings Reference Modal */}
      {isControlsOpen && (
        <ControlsModal
          isOpen={isControlsOpen}
          onClose={() => setIsControlsOpen(false)}
        />
      )}

      {/* 12. Weapon Modding Matrix Modal */}
      {isWeaponModOpen && (
        <WeaponModModal
          isOpen={isWeaponModOpen}
          onClose={() => setIsWeaponModOpen(false)}
          telemetry={telemetry}
          onUnlockSlot={handleUnlockModSlot}
          onEquipMod={handleEquipMod}
          onSelectWeapon={handleSelectWeapon}
          calculateStats={(wDef) => engine.calculateEffectiveWeaponStats(wDef)}
        />
      )}

      {/* 13. Operator Profile Modal */}
      {isProfileOpen && (
        <OperatorProfileModal onClose={() => setIsProfileOpen(false)} />
      )}

      {/* 14. Achievements Registry Modal */}
      {isAchievementsOpen && (
        <AchievementsModal onClose={() => setIsAchievementsOpen(false)} />
      )}

      {/* 15. Experimental Protocols Selection Modal */}
      {isProtocolsOpen && (
        <ProtocolSelectModal
          onClose={() => setIsProtocolsOpen(false)}
          onLaunchWithProtocols={(protocolIds) => {
            engine.activeProtocols = protocolIds;
            setIsProtocolsOpen(false);
            engine.startMission(0);
          }}
        />
      )}

      {/* 16. In-game Non-intrusive Achievement Toast Notification */}
      <AchievementToast
        achievement={activeToastAchievement}
        onDismiss={() => setActiveToastAchievement(null)}
      />
    </div>
  );
}
