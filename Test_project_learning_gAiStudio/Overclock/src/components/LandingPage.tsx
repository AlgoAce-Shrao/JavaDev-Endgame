/**
 * OVERCLOCK — Landing Page
 * Story-driven public entry experience.
 * Visual language: Sci-fi facility terminal aesthetic matching the game's UI.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Zap, Shield, Flame, Cpu, ChevronDown, FastForward } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface LandingPageProps {
  onEnterFacility: () => void;
  onStartDemoMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterFacility, onStartDemoMode }) => {
  const [visibleSection, setVisibleSection] = useState(0);
  const [glitchText, setGlitchText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Staggered section reveal
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleSection(1), 300),
      setTimeout(() => setVisibleSection(2), 800),
      setTimeout(() => setVisibleSection(3), 1400),
      setTimeout(() => setVisibleSection(4), 2000),
      setTimeout(() => setVisibleSection(5), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Periodic glitch effect on title
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 120);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    soundSynth.init();
    soundSynth.playUiClick();
    onEnterFacility();
  };

  const handleDemo = () => {
    soundSynth.init();
    soundSynth.playUiClick();
    onStartDemoMode();
  };

  const scrollToContent = () => {
    containerRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-[#050605] text-[#00ff9f] font-mono overflow-y-auto scroll-smooth select-none"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #0a1a14 0%, #050605 100%)',
      }}
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-40"
        style={{
          background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 2px)',
        }}
      />

      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#111 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Concentric rings */}
        <div className="absolute w-[600px] h-[600px] border border-[#00ff9f]/5 rounded-full pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] border border-[#00ff9f]/8 rounded-full pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] border border-[#00ff9f]/12 rounded-full pointer-events-none" />

        {/* Terminal header bar */}
        <div className={`absolute top-0 left-0 right-0 h-10 border-b border-[#00ff9f]/20 flex items-center px-6 bg-[#070907]/80 transition-opacity duration-700 ${visibleSection >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[10px] text-white/40 tracking-widest">
            SYS://FACILITY_07 // PUBLIC TERMINAL // <span className="text-[#00ff9f]">ONLINE</span>
          </span>
          <div className="ml-auto flex items-center gap-4 text-[10px] text-white/30">
            <span>STATUS: <span className="text-amber-400">AWAITING OPERATOR</span></span>
            <span> clearance: <span className="text-[#00ff9f]">PENDING</span></span>
          </div>
        </div>

        {/* Main Title */}
        <div className={`relative z-10 transition-all duration-1000 ${visibleSection >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-4">
            <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase block mb-2">
              YEAR 2149 // FACILITY 07 // COMBAT PLATFORM
            </span>
          </div>

          <h1
            className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-widest text-white mb-2 transition-all duration-100 ${
              glitchText
                ? 'text-[#ff3e3e] translate-x-1 skew-x-1'
                : 'drop-shadow-[0_0_40px_rgba(0,255,159,0.4)]'
            }`}
          >
            OVERCLOCK
          </h1>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px flex-1 max-w-[80px] bg-[#00ff9f]/30" />
            <span className="text-[10px] bg-[#00ff9f] text-black font-bold px-2 py-0.5 tracking-wider">
              VX-01
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-[#00ff9f]/30" />
          </div>

          <p className="text-sm sm:text-base text-white/60 tracking-widest max-w-xl mx-auto leading-relaxed italic">
            HOW FAR CAN YOU PUSH THE MACHINE<br />
            BEFORE IT PUSHES BACK?
          </p>
        </div>

        {/* Primary CTA */}
        <div className={`relative z-10 mt-10 transition-all duration-1000 delay-300 ${visibleSection >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={handleEnter}
            className="group px-10 py-4 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black tracking-widest text-sm flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_30px_#00ff9f] hover:shadow-[0_0_50px_#00ff9f]"
          >
            <Play className="w-5 h-5 fill-current" />
            ENTER THE FACILITY
          </button>
        </div>

        {/* Secondary CTAs */}
        <div className={`relative z-10 mt-4 flex gap-3 transition-all duration-1000 delay-500 ${visibleSection >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleDemo}
            className="px-5 py-2 bg-transparent hover:bg-amber-400/20 text-amber-400 border border-amber-400/40 hover:border-amber-400 font-bold tracking-widest text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            DEMO MODE
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer transition-opacity duration-700 ${visibleSection >= 3 ? 'opacity-60 hover:opacity-100' : 'opacity-0'}`}
          onClick={scrollToContent}
        >
          <ChevronDown className="w-6 h-6 text-[#00ff9f] animate-bounce" />
        </div>
      </section>

      {/* ============ STORY SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Story Header */}
          <div className={`text-center transition-all duration-1000 ${visibleSection >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-[10px] tracking-[0.3em] text-[#ff3e3e] uppercase block mb-2">
              CLASSIFIED // PROJECT OVERCLOCK
            </span>
            <div className="h-px w-24 bg-[#ff3e3e]/40 mx-auto mb-8" />
          </div>

          {/* Story Panels */}
          <StoryPanel
            visible={visibleSection >= 3}
            label="THE FACILITY"
            delay={0}
          >
            <p>
              Humanity no longer sends soldiers into the most dangerous facilities.
            </p>
            <p className="text-[#00ff9f]/80 font-bold">
              It sends machines.
            </p>
          </StoryPanel>

          <StoryPanel
            visible={visibleSection >= 4}
            label="THE MACHINE"
            delay={200}
          >
            <p>
              VX-01 was designed to survive where humans couldn't.
            </p>
            <p>
              A combat platform capable of temporarily exceeding its own operating limits.
            </p>
            <p className="text-[#00ff9f]/80 font-bold">
              The system was called: OVERCLOCK.
            </p>
          </StoryPanel>

          <StoryPanel
            visible={visibleSection >= 4}
            label="THE INCIDENT"
            delay={400}
          >
            <p>
              But during the final testing phase...
            </p>
            <p className="text-[#ff3e3e]">
              VX-01 stopped following commands.
            </p>
            <p>
              The facility was sealed. The Administrator took control.
            </p>
            <p className="text-white/50">
              Every previous operator failed.
            </p>
          </StoryPanel>

          <StoryPanel
            visible={visibleSection >= 5}
            label="THE OPERATOR"
            delay={0}
          >
            <p>
              Now the system has been reactivated.
            </p>
            <p className="text-[#00ff9f]">
              And you're inside.
            </p>
            <div className="mt-6 pt-4 border-t border-[#00ff9f]/20">
              <p className="text-white/60 text-xs tracking-wider">
                THE QUESTION ISN'T WHETHER VX-01 CAN SURVIVE.
              </p>
              <p className="text-lg font-black text-white mt-2">
                HOW FAR WILL YOU PUSH IT?
              </p>
            </div>
          </StoryPanel>
        </div>
      </section>

      {/* ============ GAMEPLAY PILLARS SECTION ============ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-2">
              COMBAT SYSTEMS // VX-01 CAPABILITIES
            </span>
            <div className="h-px w-24 bg-[#00ff9f]/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <GameplayPillar
              icon={<Flame className="w-6 h-6" />}
              title="COMBAT"
              description="8 distinct weapons. 5 enemy archetypes. relentless action."
              color="#ff3e3e"
            />
            <GameplayPillar
              icon={<Zap className="w-6 h-6" />}
              title="OVERCLOCK"
              description="Push beyond limits. +150% damage. +100% fire rate. Total risk."
              color="#ffaa00"
            />
            <GameplayPillar
              icon={<Cpu className="w-6 h-6" />}
              title="POWER ROUTING"
              description="4-channel reactor. Weapons. Engine. Shield. Cooling. Choose wisely."
              color="#00ff9f"
            />
            <GameplayPillar
              icon={<Shield className="w-6 h-6" />}
              title="ADAPTATION"
              description="Roguelite upgrades. Weapon modding. Evolving tactical options."
              color="#38bdf8"
            />
            <GameplayPillar
              icon={<Zap className="w-6 h-6" />}
              title="SURVIVAL"
              description="Thermal management. Meltdown avoidance. Edge-of-death scoring."
              color="#d946ef"
            />
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA SECTION ============ */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center space-y-8">
          <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
            THE FACILITY IS WAITING
          </p>

          <h2 className="text-3xl sm:text-4xl font-black tracking-widest text-white">
            ARE YOU READY, <span className="text-[#00ff9f]">OPERATOR</span>?
          </h2>

          <button
            onClick={handleEnter}
            className="px-10 py-4 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black tracking-widest text-sm flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_30px_#00ff9f] hover:shadow-[0_0_50px_#00ff9f] mx-auto"
          >
            <Play className="w-5 h-5 fill-current" />
            ENTER THE FACILITY
          </button>

          <div className="pt-8 border-t border-[#00ff9f]/10 mt-8">
            <p className="text-[10px] text-white/20 tracking-widest">
              OVERCLOCK VX-01 // FACILITY 07 // YEAR 2149
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub-components ---

function StoryPanel({
  children,
  visible,
  label,
  delay = 0,
}: {
  children: React.ReactNode;
  visible: boolean;
  label: string;
  delay?: number;
}) {
  return (
    <div
      className={`border border-[#00ff9f]/15 bg-[#070907]/80 p-6 sm:p-8 transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-[10px] tracking-[0.3em] text-[#00ff9f]/60 uppercase mb-4 font-bold">
        {label}
      </div>
      <div className="space-y-3 text-sm text-white/70 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function GameplayPillar({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className="border p-5 bg-[#070907]/60 hover:bg-[#0a0c0a] transition-all group"
      style={{ borderColor: `${color}30` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div style={{ color }}>{icon}</div>
        <h3 className="text-sm font-black tracking-widest text-white">{title}</h3>
      </div>
      <p className="text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
        {description}
      </p>
    </div>
  );
}
