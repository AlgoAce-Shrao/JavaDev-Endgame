# OVERCLOCK — Changelog

## [1.0.0] - 2026-08-20
### Final Productization Pass
- **Authentication**: Google OAuth2 authentication via Express backend. Real OAuth2 flow with session management. No passwords stored.
- **Landing Page**: Story-driven public entry page with game narrative, gameplay pillars, and CTAs. Matches the game's sci-fi facility terminal aesthetic.
- **Onboarding**: First-time player tutorial guided by ZIX, a holographic alien maintenance creature. 11-step interactive tutorial teaching movement, aiming, shooting, weapon switching, dash, heat, cooling, Overclock, and basic combat using real game systems.
- **ZIX Character**: SVG holographic avatar with mood states (idle, excited, sarcastic, concerned, celebrating), blinking animation, and speaking bounce.
- **Tutorial Persistence**: Tutorial state saved to localStorage. Returning players skip tutorial. Replay option available on Boot Screen.
- **Logout**: Logout functionality in Pause Modal. Does not delete game progress.
- **User Badge**: Authenticated user display in game header with avatar and logout button.
- **Demo Mode from Landing**: Demo mode accessible directly from landing page without authentication.
- **Documentation**: Complete documentation suite for authentication, onboarding, landing page, and architecture.

## [0.2.0] - 2026-08-19
### Balance & Survivability Tuning
- **Centralized Balance Configuration**: Extracted all tuneable gameplay stats to `src/game/data/balanceConfig.ts` (`GAME_BALANCE`).
- **Player Survivability**:
  - Increased base Core Health to 130 (+30%).
  - Increased base Shield Armor to 60 (+20%).
  - Reduced Shield recharge delay to 2.2s (down from 2.5s) with 7.0 SP/s base regeneration.
  - Reduced Dash energy cost to 12 EP and base cooldown to 0.9s.
  - Increased baseline Energy recovery to 20 EP/s.
- **Thermal Mechanics**:
  - Slower weapon heat buildup via 0.88x heat accumulation factor.
  - Increased passive cooling dissipation rate to 9.0%/s (up from 8.0%/s).
  - Reduced Overclock heat accumulation rate to 12.0%/s (down from 14.0%/s).
  - Extended base Overclock window to 5.5s.
- **Enemy & Boss Balance**:
  - Reduced incoming hostile damage by ~18% globally.
  - Drone: Damage reduced to 8 (-20%), projectile velocity reduced to 290, attack interval lengthened to 2.6s.
  - Charger: Telegraph windup extended to 1.15s for generous dash-dodging reaction window; attack cooldown increased to 3.0s.
  - Turret: Projectile damage reduced to 11 (-21%), projectile velocity reduced to 340, firing interval set to 2.8s. HP preserved to preserve the Overclock learning objective.
  - Energy Leech: Drain rate reduced to 8 EP/s (-20%), tether range reduced to 300.
  - Cyberwarfare Hacker: Hack pulse cooldown increased to 5.2s; hack interference duration reduced to 2.8s; heat spike reduced to 4%.
  - The Administrator (Boss): Core HP tuned to 1100, bullet damages rebalanced across all phases, hack duration reduced to 2.4s, and reinforcement spawners paced.
- **Documentation**: Updated all technical and level design docs to reflect the new balance architecture.

## [0.1.0] - 2026-08-18
### Added
- Modular GameEngine, Entity Component pipeline, Physics and Spatial Collision detection.
- Core VX-01 Machine Systems: Core Health, Shield Armor, Energy Reserves, Heat/Meltdown simulation.
- Signature Overclock mechanic (Q) with triple damage, rapid fire, and visual/audio escalation.
- Supercritical 95-99% Heat Overclock secret window.
- 4 Weapon Systems: Plasma Cannon, Piercing Railgun, Swarm Homing Missiles, EMP Shockwave.
- 5 Enemy types: Drones, Chargers, Fortified Turrets, Energy Leeches, Cyberwarfare Hackers.
- 4-Phase Final Boss: The Administrator with destroyable subsystems (Core, Shield, Weapons, Engine).
- 4-Channel Power Router (Weapons, Engine, Shield, Cooling) with real-time slider controls and hotkey presets.
- 10+ Roguelite Upgrades with trade-offs.
- 5 Story Missions + Boss Encounter + Endless Overdrive Mode.
- Web Audio procedural sound synthesizer (Lasers, explosions, alarms, thrusters, hums, glitch static).
- Retro-futuristic military OS Boot screen, Telemetry HUD, Terminal drawer, and Diagnostic failure logs.
