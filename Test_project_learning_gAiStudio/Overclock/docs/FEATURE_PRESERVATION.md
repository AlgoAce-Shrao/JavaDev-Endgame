# OVERCLOCK — Feature Preservation Checklist

This document serves as the regression checklist for the Final Integration & Productization Pass.
Every item must continue to work after the addition of Authentication, Onboarding, and Landing Page features.

---

## Core Gameplay Systems
- [x] Campaign (6 missions + boss)
- [x] Mission progression (sequential unlock)
- [x] Mission briefing screen
- [x] Mission victory screen
- [x] Mission failure / Game Over screen
- [x] Upgrade selection between missions
- [x] Campaign completion (Mission 6 boss)

## Weapons & Combat
- [x] Plasma Cannon (default weapon)
- [x] Railgun (unlocked after Mission 01)
- [x] Micro-Missile Swarm (unlocked after Mission 02)
- [x] EMP Disruptor (unlocked after Mission 03)
- [x] Weapon switching (keys 1-6)
- [x] Weapon modding matrix
- [x] Weapon mod slot unlocking
- [x] Weapon stat calculation with mods

## Enemy Systems
- [x] Drone enemies
- [x] Charger enemies (telegraph + charge)
- [x] Turret enemies (fortified)
- [x] Energy Leech enemies (drain)
- [x] Hacker enemies (UI disruption + heat spike)
- [x] The Administrator boss (4 phases, subsystems)
- [x] Enemy spawning system
- [x] Wave progression

## Player Systems
- [x] Core Health (130 HP)
- [x] Shield (60 SP + regen)
- [x] Energy (100 EP + regen)
- [x] Heat system (0-100%)
- [x] Cooling / heat dissipation
- [x] Meltdown at 100% heat
- [x] Overclock (Q key, +150% damage, +100% fire rate)
- [x] Supercritical secret (95-99% heat window)
- [x] Dash (Space/Shift/E, i-frames)
- [x] WASD movement
- [x] Mouse aiming + cursor fire
- [x] Directional twin-stick fire (Arrows/IJKL)

## Power Routing
- [x] 4-channel power allocation (Weapons/Engine/Shield/Cooling)
- [x] Power presets (Z/Balanced, X/Attack, C/Evasion, V/Defense)
- [x] Power router modal (R key)
- [x] Real-time power bar visualization

## Progression & Economy
- [x] Cyber Credits earned per kill and mission
- [x] Mission ratings (S/A/B/C)
- [x] Mission high scores
- [x] Endless Overdrive mode (unlocked after Mission 6)
- [x] Endless mutations system
- [x] Endless high score tracking

## Roguelite Upgrades
- [x] 10+ upgrade definitions with trade-offs
- [x] Upgrade selection after mission completion
- [x] Upgrade effects (cryo core, blood reactor, overclock amp, etc.)
- [x] Endless mode mutation selection

## Operator Profile
- [x] Total runs, kills, meltdowns tracking
- [x] Best combo, best score tracking
- [x] Playstyle archetype determination
- [x] AI assessment text
- [x] Profile modal accessible from Boot screen

## Achievements
- [x] Achievement unlock system
- [x] Achievement toast notifications
- [x] Achievements modal (view all)
- [x] Achievement persistence in save data

## Easter Eggs & Secrets
- [x] Supercritical Overclock (95-99% heat)
- [x] Terminal commands: `sudo overclock --unsafe`
- [x] Terminal commands: `ai.opinion`
- [x] Terminal commands: `admin.bypass`
- [x] Terminal commands: `overclock.unlimit`
- [x] Terminal commands: `secret.colorway`
- [x] Terminal commands: `lore.logs`
- [x] Green phosphor colorway toggle

## Experimental Protocols
- [x] Protocol selection modal
- [x] Protocol modifiers (heat gen, cooling, overclock duration, etc.)
- [x] Protocol score multipliers
- [x] Protocol persistence

## Demo Mode
- [x] Demo mode activation from Boot screen
- [x] 5-step demo scenario
- [x] Demo step progression tracking
- [x] Demo completion

## AI Personality
- [x] Tactical AI commentary messages
- [x] AI commentary system (contextual reactions)
- [x] Weapon usage tracking
- [x] Heat commentary
- [x] Overclock commentary
- [x] Idle prompts
- [x] Wall collision commentary

## UI System
- [x] Boot sequence screen
- [x] Mission select modal
- [x] Briefing modal
- [x] Pause modal (ESC/P)
- [x] Resume functionality
- [x] Game Over modal
- [x] Victory modal
- [x] Campaign victory modal
- [x] Terminal drawer (` key)
- [x] Controls modal (H/? key)
- [x] Weapon mod modal (U key)
- [x] On-screen touch controls

## Audio
- [x] Procedural Web Audio synthesizer
- [x] Weapon fire sounds (plasma, railgun, missiles, EMP)
- [x] Enemy hit/explosion sounds
- [x] Dash sound
- [x] Overclock start/end sounds
- [x] Supercritical sound
- [x] Warning/critical alarm sounds
- [x] Meltdown siren
- [x] UI click sounds
- [x] Mission complete fanfare
- [x] Upgrade selected sound
- [x] Mute toggle (M key)

## Persistence
- [x] localStorage save system (OVERCLOCK_CAMPAIGN_SAVE_V2)
- [x] Campaign progress persistence
- [x] Weapon unlock persistence
- [x] Weapon mod config persistence
- [x] Settings persistence (mute, volume, screen shake, scanlines)
- [x] Boot sequence seen flag
- [x] Achievement persistence
- [x] Secret discovery persistence
- [x] Protocol unlock persistence

## Controls
- [x] WASD movement
- [x] Mouse aim + left-click fire
- [x] Arrow keys / IJKL directional fire
- [x] Numpad 8-way fire
- [x] Space/Shift/E dash
- [x] Q Overclock toggle
- [x] 1-6 weapon switching
- [x] Z/X/C/V power presets
- [x] R power router
- [x] U weapon mods
- [x] M mute
- [x] H/? controls help
- [x] ` terminal
- [x] Escape/P pause
- [x] On-screen touch controls

## Onboarding & Authentication (New in v1.0.0)
- [x] OnboardingSystem action hooks wired into GameEngine
- [x] Tutorial enemy spawning uses engine's `enemiesToSpawn` queue
- [x] Tutorial arena initialization via `startTutorialArena()`
- [x] Completion transition moved to useEffect (no render-phase side effects)
- [x] Replay Tutorial button on Boot Screen
- [x] Google OAuth2 redirect URI matches server callback route
- [x] Logout returns user to Landing Page
- [x] Auth URL cleanup centralized in AuthContext

## Difficulty Balance
- [x] Enemy damage values unchanged
- [x] Player health/shield values unchanged
- [x] Heat generation rates unchanged
- [x] Overclock duration/damage unchanged
- [x] Boss phase damages unchanged
- [x] Wave composition unchanged

---

**Last verified**: 2026-08-20
**Verified by**: Code review + TypeScript typecheck
