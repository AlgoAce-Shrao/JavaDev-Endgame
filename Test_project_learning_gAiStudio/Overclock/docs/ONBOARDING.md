# OVERCLOCK — Onboarding System

## Overview
The onboarding system provides a first-time player experience guided by ZIX, a small holographic maintenance creature. It teaches game mechanics through interactive steps using the REAL gameplay systems — no duplicate implementations.

## Guide Character: ZIX
- **Concept**: Small alien-like holographic maintenance creature
- **Personality**: Curious, energetic, slightly sarcastic, friendly, helpful, weird
- **Rendering**: SVG component with mood states (idle, excited, sarcastic, concerned, celebrating)
- **Voice**: Text-based dialogue with typewriter animation

## Tutorial Flow

### Step 1: INTRODUCTION
ZIX introduces itself and Facility 07.
```
ZIX: "OH." "You're awake." "That's... probably good."
      "Welcome to Facility 07." "I'll show you how not to explode."
```

### Step 2: MOVEMENT
Player must move using WASD.
```
ZIX: "Let's see if you can move."
Action: WASD movement detected → Step complete
```

### Step 3: AIMING
Player must aim at a training target.
```
ZIX: "Point that weapon at the training drone."
Action: Mouse movement detected → Step complete
```

### Step 4: SHOOTING
Player must shoot and destroy a training drone.
```
ZIX: "Now shoot it."
Action: Destroy target → Uses real weapon system
```

### Step 5: WEAPON SWITCHING
Player must switch weapons using number keys.
```
ZIX: "Different weapons." "Different problems."
Action: Press 1-4 to switch → Step complete
```

### Step 6: DASH
Player must dodge a telegraphed attack.
```
ZIX: "That drone is about to attack." "Move."
Action: Press Space to dash → Step complete
```

### Step 7: HEAT
Player must build heat by firing continuously.
```
ZIX: "That red bar is important." "Very important."
Action: Fire until heat ≥ 30% → Uses real heat system
```

### Step 8: COOLING
Player must stop firing and watch heat decrease.
```
ZIX: "Machines need breathing room too." "Stop firing. Watch the heat drop."
Action: Heat drops below 15% → Step complete
```

### Step 9: OVERCLOCK
Player must activate Overclock.
```
ZIX: "Now..." "I probably shouldn't show you this yet." "Pause."
      "But..." "You're going to use it anyway."
Action: Press Q → Uses REAL Overclock system → Step complete
```

### Step 10: COMBAT
Player must demonstrate all skills against enemies.
```
ZIX: "Show me everything." "Movement. Shooting. Dash." "And that beautiful Overclock."
Action: Eliminate 3 hostiles (2 drones + 1 charger)
```

### Step 11: COMPLETE (Step 10 of 10)
```
ZIX: "Okay." "You're ready." "Pause." "Probably."
→ FACILITY 07 CAMPAIGN INITIALIZATION → MISSION 01
```

> **Note**: There are 10 tutorial steps total (INTRODUCTION through COMPLETE).

## Tutorial State Management

### State Persistence
- Stored in localStorage key: `OVERCLOCK_TUTORIAL_STATE`
- Tracks: `completed` (boolean), `skipped` (boolean)
- Returning users are NOT forced through tutorial

### Skip Behavior
- "SKIP TRAINING" button available on every step
- Sets `tutorialSkipped = true`
- Proceeds directly to Mission Select

### Replay Behavior
- "REPLAY TUTORIAL" button on Boot Screen
- Resets tutorial state and starts from beginning
- Available to all users regardless of completion status

## Architecture

### OnboardingSystem (State Machine)
- Location: `src/game/systems/OnboardingSystem.ts`
- Singleton pattern (like other game systems)
- Tracks: current step, dialogue index, action progress
- Action listeners: onPlayerMoved, onPlayerFired, onDash, etc.
- Completion detection: checks step requirements

### OnboardingOverlay (UI)
- Location: `src/components/OnboardingOverlay.tsx`
- Renders over the game canvas
- Shows ZIX character + dialogue box
- Shows key highlights for current lesson
- Shows step progress bar
- Shows action hints when waiting for player

### ZIX Character (SVG)
- Location: `src/components/ZIXCharacter.tsx`
- Compact SVG avatar (48-80px)
- Mood states: idle, excited, sarcastic, concerned, celebrating
- Blinking animation
- Speaking bounce animation
- Holographic shimmer effect

## Integration Points

### With GameEngine
- GameEngine imports `onboardingSystem` and calls action hooks directly:
  - `onPlayerMoved()` — when player moves during PLAYING mode
  - `onPlayerAimed()` — when mouse position changes
  - `onPlayerFired()` — after `fireActiveWeapon()` completes
  - `onWeaponSwitch()` — in `selectWeapon()`
  - `onDash()` — when dash succeeds in `triggerDash()`
  - `onOverclockActivated()` — when Overclock engages in `toggleOverclock()`
  - `onEnemyKilled()` — in `handleEnemyKilled()`
  - `onHeatChanged()` — each frame during heat updates
- Tutorial spawns enemies via `engine.enemiesToSpawn` queue (uses existing spawner)
- Uses real weapon system for shooting
- Uses real heat system for heat/cooling
- Uses real Overclock system
- `startTutorialArena()` initializes the arena without mission data

### With App.tsx
- `showOnboarding` state controls overlay visibility
- `handleTutorialComplete` → closes overlay, opens Mission Select
- `handleTutorialSkipped` → closes overlay, opens Mission Select
- `onReplayTutorial` on BootScreen restarts tutorial

### With SaveSystem
- Tutorial state stored in separate localStorage key
- Does not affect game save data
- Logout does not reset tutorial completion
