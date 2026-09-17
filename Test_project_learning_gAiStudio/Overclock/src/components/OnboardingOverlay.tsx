/**
 * OVERCLOCK — Onboarding Overlay
 * Tutorial UI overlay that displays ZIX dialogue, key highlights,
 * and manages the interactive tutorial flow.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onboardingSystem, TutorialStepConfig } from '../game/systems/OnboardingSystem';
import { ZIXCharacter } from './ZIXCharacter';
import { soundSynth } from '../game/audio/SoundSynth';
import { GameEngine } from '../game/systems/GameEngine';
import { SkipForward, Play } from 'lucide-react';

interface OnboardingOverlayProps {
  engine: GameEngine;
  onTutorialComplete: () => void;
  onTutorialSkipped: () => void;
}

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  engine,
  onTutorialComplete,
  onTutorialSkipped,
}) => {
  const [currentStep, setCurrentStep] = useState<TutorialStepConfig | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const [isWaitingForAction, setIsWaitingForAction] = useState(false);
  const [zixMood, setZixMood] = useState<'idle' | 'excited' | 'sarcastic' | 'concerned' | 'celebrating'>('idle');
  const [showActionHint, setShowActionHint] = useState(false);
  const [showCompleteTransition, setShowCompleteTransition] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);

  // Poll onboarding state
  useEffect(() => {
    if (!onboardingSystem.isActive) return;

    const interval = setInterval(() => {
      const step = onboardingSystem.getCurrentStep();
      if (step !== currentStep) {
        setCurrentStep(step);
        setDialogueIndex(0);
        setShowDialogue(true);
        setIsWaitingForAction(false);
        setShowActionHint(false);
        setStepCompleted(false);

        // Set ZIX mood based on step
        if (step?.id === 'OVERCLOCK') setZixMood('sarcastic');
        else if (step?.id === 'COMPLETE') setZixMood('celebrating');
        else if (step?.id === 'COMBAT') setZixMood('excited');
        else if (step?.id === 'DASH' || step?.id === 'HEAT') setZixMood('concerned');
        else setZixMood('idle');
      }

      if (onboardingSystem.showDialogue !== showDialogue) {
        setShowDialogue(onboardingSystem.showDialogue);
      }
      if (onboardingSystem.isWaitingForAction !== isWaitingForAction) {
        setIsWaitingForAction(onboardingSystem.isWaitingForAction);
        if (onboardingSystem.isWaitingForAction) {
          setTimeout(() => setShowActionHint(true), 800);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep, showDialogue, isWaitingForAction]);

  const handleAdvanceDialogue = useCallback(() => {
    soundSynth.playUiClick();
    const complete = onboardingSystem.advanceDialogue();
    setDialogueIndex(onboardingSystem.dialogueIndex);

    if (complete) {
      setShowDialogue(false);
    }
  }, []);

  const handleSkip = useCallback(() => {
    soundSynth.playUiClick();
    onboardingSystem.skipTutorial();
    onTutorialSkipped();
  }, [onTutorialSkipped]);

  // Detect tutorial completion and trigger transition
  useEffect(() => {
    if (!onboardingSystem.isActive && onboardingSystem.tutorialCompleted && !showCompleteTransition) {
      setShowCompleteTransition(true);
      const timer = setTimeout(() => {
        onTutorialComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCompleteTransition, onTutorialComplete]);

  // Setup tutorial spawn enemies when entering a step that requires them
  useEffect(() => {
    if (currentStep?.spawnEnemies && isWaitingForAction) {
      // Queue enemies through the engine's normal spawn mechanism
      for (const spawn of currentStep.spawnEnemies) {
        for (let i = 0; i < spawn.count; i++) {
          engine.enemiesToSpawn.push(spawn.type as any);
        }
      }
      // Reset spawn timer so enemies appear quickly
      engine.waveSpawnTimer = 0.3;
    }
  }, [currentStep?.id, isWaitingForAction]);

  if (!onboardingSystem.isActive || !currentStep) return null;

  // Complete transition screen
  if (showCompleteTransition) {
    return (
      <div className="absolute inset-0 z-50 bg-[#050605] flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-[10px] tracking-[0.3em] text-[#00ff9f]/60 uppercase">
            FACILITY 07
          </div>
          <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
            CAMPAIGN INITIALIZATION
          </div>
          <div className="space-y-2">
            <div className="text-xl font-black tracking-widest text-white">
              MISSION 01
            </div>
            <div className="text-sm text-[#00ff9f] tracking-wider">
              BOOT / TARGET ACQUISITION
            </div>
            <div className="text-xs text-[#00ff9f] tracking-widest">
              UNLOCKED
            </div>
          </div>
          <div className="text-xs text-white/40 animate-pulse">
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  const currentLine = currentStep.dialogue.lines[dialogueIndex] || '';
  const isSystemMessage = currentStep.dialogue.speaker === 'SYSTEM';

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      {/* Darkened overlay during dialogue */}
      {showDialogue && (
        <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={handleAdvanceDialogue} />
      )}

      {/* ZIX Character & Dialogue Box */}
      {showDialogue && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 pointer-events-auto">
          <div
            className="border-2 border-[#00ff9f]/40 bg-[#070907]/95 p-5 shadow-[0_0_30px_rgba(0,255,159,0.15)] cursor-pointer"
            onClick={handleAdvanceDialogue}
          >
            {/* Speaker label */}
            <div className="flex items-center gap-3 mb-3">
              {!isSystemMessage && (
                <ZIXCharacter isSpeaking={true} mood={zixMood} size={48} />
              )}
              <div>
                <span className="text-[10px] tracking-[0.3em] text-[#00ff9f] font-bold">
                  {isSystemMessage ? 'SYSTEM' : 'ZIX'}
                </span>
                <div className="text-[8px] text-white/30 tracking-wider">
                  {currentStep.title}
                </div>
              </div>
            </div>

            {/* Dialogue text */}
            <div className="text-sm text-white/80 leading-relaxed min-h-[40px]">
              <TypewriterText text={currentLine} />
            </div>

            {/* Click to continue hint */}
            <div className="mt-3 text-right">
              <span className="text-[9px] text-white/30 animate-pulse">
                [ CLICK TO CONTINUE ]
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Hint (shown when waiting for player action) */}
      {isWaitingForAction && showActionHint && !showDialogue && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="border border-[#00ff9f]/30 bg-[#070907]/90 px-6 py-3 shadow-[0_0_20px_rgba(0,255,159,0.1)]">
            <div className="flex items-center gap-3">
              <ZIXCharacter isSpeaking={false} mood={zixMood} size={36} />
              <div>
                <div className="text-[10px] text-[#00ff9f] tracking-wider font-bold">
                  {getActionHintText(currentStep)}
                </div>
                {currentStep.highlightKeys && (
                  <div className="flex gap-2 mt-2">
                    {currentStep.highlightKeys.map((keyLabel) => (
                      <KeyHighlight label={keyLabel} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Title Banner */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="text-center">
          <div className="text-[10px] tracking-[0.3em] text-[#00ff9f]/60 uppercase mb-1">
            TRAINING MODULE
          </div>
          <div className="text-xs font-black tracking-widest text-white/80">
            {currentStep.title}
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-48 h-1 bg-[#1a1a1a] border border-[#00ff9f]/20 mx-auto">
            <div
              className="h-full bg-[#00ff9f] transition-all duration-500"
              style={{ width: `${onboardingSystem.getProgress().percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skip Training Button */}
      {currentStep.showSkipButton && (
        <div className="absolute top-6 right-6 pointer-events-auto">
          <button
            onClick={handleSkip}
            className="px-3 py-1.5 bg-black/60 hover:bg-[#ff3e3e]/20 text-white/50 hover:text-[#ff3e3e] border border-white/20 hover:border-[#ff3e3e]/40 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <SkipForward className="w-3 h-3" />
            SKIP TRAINING
          </button>
        </div>
      )}
    </div>
  );
};

// --- Helper components ---

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}<span className="animate-pulse">_</span></span>;
}

function KeyHighlight({ label }: { label: string }) {
  return (
    <div className="px-2 py-1 bg-[#00ff9f]/10 border border-[#00ff9f]/40 text-[#00ff9f] text-[10px] font-bold tracking-wider animate-pulse">
      {label}
    </div>
  );
}

function getActionHintText(step: TutorialStepConfig): string {
  switch (step.actionType) {
    case 'movement': return 'USE WASD TO MOVE';
    case 'aim': return 'MOVE YOUR MOUSE TO AIM';
    case 'fire': return 'LEFT-CLICK TO FIRE';
    case 'weapon_switch': return 'PRESS 1-4 TO SWITCH WEAPONS';
    case 'dash': return 'PRESS SPACE TO DASH';
    case 'heat': return 'KEEP FIRING TO BUILD HEAT';
    case 'cooling': return 'STOP FIRING AND WATCH HEAT DROP';
    case 'overclock': return 'PRESS Q TO ENGAGE OVERCLOCK';
    case 'combat': return 'ELIMINATE ALL HOSTILES';
    default: return '';
  }
}
