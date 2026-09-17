/**
 * OVERCLOCK — Onboarding System
 * Manages the first-time player tutorial flow with ZIX as guide.
 * Uses real gameplay systems — no duplicate implementations.
 */

export type TutorialStep =
  | 'INTRODUCTION'
  | 'MOVEMENT'
  | 'AIMING'
  | 'SHOOTING'
  | 'WEAPON_SWITCH'
  | 'DASH'
  | 'HEAT'
  | 'COOLING'
  | 'OVERCLOCK'
  | 'COMBAT'
  | 'COMPLETE';

export interface TutorialDialogue {
  speaker: 'ZIX' | 'SYSTEM';
  lines: string[];
}

export interface TutorialStepConfig {
  id: TutorialStep;
  title: string;
  dialogue: TutorialDialogue;
  highlightKeys?: string[];
  highlightUI?: string;
  actionType: 'movement' | 'aim' | 'fire' | 'weapon_switch' | 'dash' | 'heat' | 'cooling' | 'overclock' | 'combat' | 'none';
  targetCount?: number;
  spawnEnemies?: { type: string; count: number }[];
  showSkipButton?: boolean;
}

export const TUTORIAL_STEPS: TutorialStepConfig[] = [
  {
    id: 'INTRODUCTION',
    title: 'SYSTEM INITIALIZATION',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'OH.',
        "You're awake.",
        "That's... probably good.",
        'Welcome to Facility 07.',
        "I'll show you how not to explode.",
      ],
    },
    actionType: 'none',
    showSkipButton: true,
  },
  {
    id: 'MOVEMENT',
    title: 'MOVEMENT CALIBRATION',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        "Let's see if you can move.",
      ],
    },
    highlightKeys: ['W', 'A', 'S', 'D'],
    actionType: 'movement',
    showSkipButton: true,
  },
  {
    id: 'AIMING',
    title: 'TARGET ACQUISITION',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'Point that weapon at the training drone.',
      ],
    },
    actionType: 'aim',
    highlightUI: 'crosshair',
    showSkipButton: true,
  },
  {
    id: 'SHOOTING',
    title: 'WEAPON DISCHARGE',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'Now shoot it.',
      ],
    },
    actionType: 'fire',
    targetCount: 1,
    spawnEnemies: [{ type: 'drone', count: 1 }],
    showSkipButton: true,
  },
  {
    id: 'WEAPON_SWITCH',
    title: 'ARMAMENT SWITCHING',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'Different weapons.',
        'Different problems.',
      ],
    },
    highlightKeys: ['1', '2', '3', '4'],
    actionType: 'weapon_switch',
    showSkipButton: true,
  },
  {
    id: 'DASH',
    title: 'EVASIVE MANEUVER',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'That drone is about to attack.',
        'Move.',
      ],
    },
    highlightKeys: ['SPACE'],
    actionType: 'dash',
    spawnEnemies: [{ type: 'drone', count: 1 }],
    showSkipButton: true,
  },
  {
    id: 'HEAT',
    title: 'THERMAL MONITORING',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'That red bar is important.',
        'Very important.',
      ],
    },
    highlightUI: 'heat_meter',
    actionType: 'heat',
    showSkipButton: true,
  },
  {
    id: 'COOLING',
    title: 'PASSIVE DISSIPATION',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'Machines need breathing room too.',
        'Stop firing. Watch the heat drop.',
      ],
    },
    highlightUI: 'heat_meter',
    actionType: 'cooling',
    showSkipButton: true,
  },
  {
    id: 'OVERCLOCK',
    title: 'OVERCLOCK PROTOCOL',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'Now...',
        "I probably shouldn't show you this yet.",
        'Pause.',
        "But...",
        "You're going to use it anyway.",
      ],
    },
    highlightKeys: ['Q'],
    actionType: 'overclock',
    showSkipButton: true,
  },
  {
    id: 'COMBAT',
    title: 'COMBAT ASSESSMENT',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'Show me everything.',
        'Movement. Shooting. Dash.',
        'And that beautiful Overclock.',
      ],
    },
    actionType: 'combat',
    targetCount: 3,
    spawnEnemies: [
      { type: 'drone', count: 2 },
      { type: 'charger', count: 1 },
    ],
    showSkipButton: true,
  },
  {
    id: 'COMPLETE',
    title: 'TRAINING COMPLETE',
    dialogue: {
      speaker: 'ZIX',
      lines: [
        'Okay.',
        "You're ready.",
        'Pause.',
        'Probably.',
      ],
    },
    actionType: 'none',
  },
];

export class OnboardingSystem {
  private static instance: OnboardingSystem;

  public currentStepIndex: number = 0;
  public isActive: boolean = false;
  public stepProgress: number = 0;
  public dialogueIndex: number = 0;
  public showDialogue: boolean = false;
  public isWaitingForAction: boolean = false;

  // Action tracking
  public hasMoved: boolean = false;
  public hasAimed: boolean = false;
  public hasFired: boolean = false;
  public hasSwitchedWeapon: boolean = false;
  public hasDashed: boolean = false;
  public hasReachedHeat: boolean = false;
  public hasCooled: boolean = false;
  public hasOverclocked: boolean = false;
  public combatKills: number = 0;

  // Tutorial state persistence
  public tutorialCompleted: boolean = false;
  public tutorialSkipped: boolean = false;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): OnboardingSystem {
    if (!OnboardingSystem.instance) {
      OnboardingSystem.instance = new OnboardingSystem();
    }
    return OnboardingSystem.instance;
  }

  private loadState() {
    try {
      const saved = localStorage.getItem('OVERCLOCK_TUTORIAL_STATE');
      if (saved) {
        const state = JSON.parse(saved);
        this.tutorialCompleted = state.completed || false;
        this.tutorialSkipped = state.skipped || false;
      }
    } catch {
      // Ignore
    }
  }

  private saveState() {
    try {
      localStorage.setItem('OVERCLOCK_TUTORIAL_STATE', JSON.stringify({
        completed: this.tutorialCompleted,
        skipped: this.tutorialSkipped,
      }));
    } catch {
      // Ignore
    }
  }

  public shouldShowTutorial(): boolean {
    return !this.tutorialCompleted && !this.tutorialSkipped;
  }

  public startTutorial() {
    this.isActive = true;
    this.currentStepIndex = 0;
    this.stepProgress = 0;
    this.dialogueIndex = 0;
    this.showDialogue = true;
    this.isWaitingForAction = false;
    this.resetActionTracking();
    this.showCurrentDialogue();
  }

  public skipTutorial() {
    this.isActive = false;
    this.tutorialSkipped = true;
    this.saveState();
  }

  public completeTutorial() {
    this.isActive = false;
    this.tutorialCompleted = true;
    this.saveState();
  }

  public replayTutorial() {
    this.tutorialCompleted = false;
    this.tutorialSkipped = false;
    this.startTutorial();
  }

  private resetActionTracking() {
    this.hasMoved = false;
    this.hasAimed = false;
    this.hasFired = false;
    this.hasSwitchedWeapon = false;
    this.hasDashed = false;
    this.hasReachedHeat = false;
    this.hasCooled = false;
    this.hasOverclocked = false;
    this.combatKills = 0;
  }

  public getCurrentStep(): TutorialStepConfig | null {
    if (!this.isActive || this.currentStepIndex >= TUTORIAL_STEPS.length) {
      return null;
    }
    return TUTORIAL_STEPS[this.currentStepIndex];
  }

  private showCurrentDialogue() {
    this.showDialogue = true;
    this.dialogueIndex = 0;
  }

  public advanceDialogue(): boolean {
    const step = this.getCurrentStep();
    if (!step) return false;

    this.dialogueIndex++;
    if (this.dialogueIndex >= step.dialogue.lines.length) {
      // All dialogue shown — now wait for player action
      this.showDialogue = false;
      this.isWaitingForAction = true;
      return true; // Dialogue complete
    }
    return false; // More dialogue to show
  }

  // Called by the game engine when player performs actions
  public onPlayerMoved() {
    if (!this.isActive || !this.isWaitingForAction) return;
    const step = this.getCurrentStep();
    if (step?.actionType === 'movement') {
      this.hasMoved = true;
      this.checkStepCompletion();
    }
  }

  public onPlayerAimed() {
    if (!this.isActive || !this.isWaitingForAction) return;
    const step = this.getCurrentStep();
    if (step?.actionType === 'aim') {
      this.hasAimed = true;
      this.checkStepCompletion();
    }
  }

  public onPlayerFired() {
    if (!this.isActive || !this.isWaitingForAction) return;
    const step = this.getCurrentStep();
    if (step?.actionType === 'fire') {
      this.hasFired = true;
      this.checkStepCompletion();
    }
  }

  public onWeaponSwitch() {
    if (!this.isActive || !this.isWaitingForAction) return;
    const step = this.getCurrentStep();
    if (step?.actionType === 'weapon_switch') {
      this.hasSwitchedWeapon = true;
      this.checkStepCompletion();
    }
  }

  public onDash() {
    if (!this.isActive || !this.isWaitingForAction) return;
    const step = this.getCurrentStep();
    if (step?.actionType === 'dash') {
      this.hasDashed = true;
      this.checkStepCompletion();
    }
  }

  public onHeatChanged(heat: number) {
    if (!this.isActive) return;

    if (this.isWaitingForAction) {
      const step = this.getCurrentStep();
      if (step?.actionType === 'heat' && heat >= 30) {
        this.hasReachedHeat = true;
        this.checkStepCompletion();
      }
      if (step?.actionType === 'cooling' && this.hasReachedHeat && heat < 15) {
        this.hasCooled = true;
        this.checkStepCompletion();
      }
    }
  }

  public onOverclockActivated() {
    if (!this.isActive || !this.isWaitingForAction) return;
    const step = this.getCurrentStep();
    if (step?.actionType === 'overclock') {
      this.hasOverclocked = true;
      this.checkStepCompletion();
    }
  }

  public onEnemyKilled() {
    if (!this.isActive || !this.isWaitingForAction) return;
    const step = this.getCurrentStep();
    if (step?.actionType === 'combat') {
      this.combatKills++;
      this.checkStepCompletion();
    }
  }

  private checkStepCompletion() {
    const step = this.getCurrentStep();
    if (!step) return;

    let complete = false;

    switch (step.actionType) {
      case 'movement': complete = this.hasMoved; break;
      case 'aim': complete = this.hasAimed; break;
      case 'fire': complete = this.hasFired; break;
      case 'weapon_switch': complete = this.hasSwitchedWeapon; break;
      case 'dash': complete = this.hasDashed; break;
      case 'heat': complete = this.hasReachedHeat; break;
      case 'cooling': complete = this.hasCooled; break;
      case 'overclock': complete = this.hasOverclocked; break;
      case 'combat': complete = this.combatKills >= (step.targetCount || 3); break;
      case 'none': complete = true; break;
    }

    if (complete) {
      this.advanceToNextStep();
    }
  }

  private advanceToNextStep() {
    this.isWaitingForAction = false;
    this.currentStepIndex++;
    this.stepProgress = 0;
    this.dialogueIndex = 0;

    if (this.currentStepIndex >= TUTORIAL_STEPS.length) {
      this.completeTutorial();
      return;
    }

    // Show next step's dialogue
    this.showCurrentDialogue();
  }

  public getProgress(): { current: number; total: number; percentage: number } {
    const total = TUTORIAL_STEPS.length;
    return {
      current: this.currentStepIndex,
      total,
      percentage: Math.round((this.currentStepIndex / total) * 100),
    };
  }
}

export const onboardingSystem = OnboardingSystem.getInstance();
