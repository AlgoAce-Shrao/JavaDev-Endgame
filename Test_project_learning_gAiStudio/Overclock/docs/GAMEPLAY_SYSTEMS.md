# OVERCLOCK — Gameplay Systems

## 1. Centralized Game Balance Configuration
All tuneable balance parameters are consolidated in `/src/game/data/balanceConfig.ts` (`GAME_BALANCE`), allowing single-point-of-truth adjustments for:
- Player Core, Shield, Energy, Speed, and Dash timings.
- Heat accumulation rate, cooling dissipation, and Overclock duration.
- Enemy HP, attack cooldowns, telegraph durations, projectile velocities, and damage values.
- Boss subsystem HP, damage profiles, and attack intervals.

## 2. Player Survivability & Vitals
* **Core Health**: 130 HP (+30% baseline survivability buffer).
* **Shield Capacity**: 60 SP (+20% baseline shield cushion).
* **Shield Regeneration**: Starts after 2.2s without taking damage (down from 2.5s) at a base rate of 7.0 SP/s (scaled by Shield Power allocation up to ~17 SP/s).
* **Energy Capacity**: 100 EP with a fast 20 EP/s recovery rate.
* **Dash**: Consumes 12 EP (down from 15 EP), with a 0.9s base cooldown (further reduced by Engine power allocation) providing 0.18s invulnerability frames.

## 3. Thermal & Heat Simulation
* Heat is generated through:
  * Primary weapon fire (balanced with a 0.88x heat accumulation factor).
  * Dash thrusters (+8% heat).
  * Overclock sustained state (+12% per second, reduced from +14%/s).
  * Hacker sabotage (+4% spike per pulse, down from +6%).
* Heat is dissipated by:
  * Passive cooling base rate (-9.0% per second when not firing, up from 8.0%/s).
  * Cooling power allocation multiplier (0.5x at 0% power up to 2.5x at 100% cooling power).
  * Emergency cooling upgrades and Supercritical cascades.
* **Overclock (Q)**: 5.5s base duration with +150% damage boost, +100% fire rate, and +40% projectile speed.
* **Meltdown**: At 100% heat, the core enters containment failure, counts down with warning audio, then triggers a terminal reactor blowout.

## 4. Power Routing System
Total available reactor power is 100%. Players can shift points between 4 distinct channels:
* **WEAPONS**: Boosts damage (+0% to +40%) and fire rate (+0% to +35%), but increases heat generation (+0% to +50%).
* **ENGINE**: Boosts top speed (+0% to +50%) and reduces Dash cooldown (from 0.9s down to 0.3s).
* **SHIELD**: Speeds up shield recharge delay and regeneration speed (+0% to +220%).
* **COOLING**: Multiplies heat dissipation speed by up to 2.5x.

## 5. Combo & Scoring System
* Consecutive kills within 2.8s build the Combo Multiplier (up to x10.0).
* Multipliers are enhanced if kills occur during Overclock (+50% bonus).
* No-damage waves award "Tactical Perfection" bonus credits and score.

