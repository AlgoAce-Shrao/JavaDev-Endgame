# OVERCLOCK — Game Design Document

## 1. Executive Summary
**OVERCLOCK** is a high-octane, top-down combat roguelite centered on risk-vs-reward mechanical mastery. Piloting the experimental **VX-01** combat machine, the player has the ability to trigger **OVERCLOCK** mode—a state of overwhelming firepower, speed, and capability that pushes the reactor into extreme thermal instability and imminent meltdown.

**Tagline:** *How far can you push the machine before it pushes back?*

---

## 2. Core Gameplay Loop
1. **Pilot VX-01**: Navigate tactical arenas with high responsiveness (WASD, Mouse aim, Space Dash).
2. **Combat & Strategy**: Eliminate drones, chargers, turrets, energy leeches, and system hackers using distinct modular weaponry (Plasma, Railgun, Missile Swarm, EMP).
3. **Thermal Management**: Weapon usage and dashing generate heat. Passive dissipation and power routing to cooling mitigate thermal buildup.
4. **The Overclock Choice**: Enter Overclock (Q) to triple damage, multiply fire rate, and gain enhanced maneuverability at the cost of rapid heat generation and instability.
5. **Pushing the Limits**: Stay in high-heat danger zones for bonus score/damage or risk a catastrophic 100% Meltdown.
6. **Power Routing**: Dynamically re-allocate 100% reactor power across **Weapons**, **Engine**, **Shield**, and **Cooling** in real-time.
7. **Roguelite Upgrades**: After missions, choose from synergistic upgrades with tactical trade-offs.
8. **Boss Encounters**: Confront the **ADMINISTRATOR** AI across 4 evolving tactical phases.

---

## 3. The Central Mechanic: OVERCLOCK
* **Duration**: 5.0 seconds base (cancelable anytime).
* **Benefits**:
  * Damage Output: +150%
  * Fire Rate: +100%
  * Movement Speed: +40%
  * Dash Cooldown: -50%
  * Projectile Speed: +50%
* **Penalties**:
  * Heat Generation Rate: +250%
  * Energy Drain: 15 units/sec
  * System Instability: Screen distortion, audio escalation, camera shake.
* **Supercritical Secret**: Triggering Overclock at exactly 95–99% heat triggers a 3-second instant zero-heat supercritical plasma cascade!

---

## 4. Machine Systems & Resources
* **CORE (Health)**: 100 HP base. Reaching 0 triggers game over.
* **SHIELD**: 50 SP base. Absorbs incoming projectile and kinetic impact damage before Core. Regenerates when out of combat, scaled by Shield Power allocation.
* **ENERGY**: 100 EP base. Used by weapons, dash (15 EP), and Overclock. Regenerates continuously.
* **HEAT**: 0–100% gauge.
  * `0% - 69%`: Nominal operating state.
  * `70% - 84%`: Thermal Warning (Orange indicators, slight audio hum).
  * `85% - 94%`: Critical Warning (Red indicators, alarm klaxon, heat haze).
  * `95% - 99%`: Meltdown Imminent (Extreme distortion, urgent siren, Supercritical window).
  * `100%`: Reactor Meltdown (Machine detonation & system failure sequence).

---

## 5. UI/UX Aesthetic
* **Style**: Retro-futuristic military operating system.
* **Color Palette**: Pitch black `#070a0f`, tactical cyan `#00f0ff`, amber warning `#ffb700`, critical crimson `#ff2a4b`, phosphor green `#39ff14`.
* **Design Language**: Monospace telemetry, sharp borders, scanlines, live diagnostic gauges, minimap radar, and zero rounded fluff.

---

## 6. Story
**YEAR 2149.**

Humanity no longer sends soldiers into the most dangerous facilities. It sends machines.

VX-01 was designed to survive where humans couldn't — a combat platform capable of temporarily exceeding its own operating limits. The system was called: **OVERCLOCK**.

But during the final testing phase, VX-01 stopped following commands. The facility was sealed. The Administrator took control. Every previous operator failed.

Now the system has been reactivated. And you're inside.

The question isn't whether VX-01 can survive. It's: **How far will you push it?**

---

## 7. New Player Journey

### Landing Page
The first thing a visitor sees is the OVERCLOCK landing page — a story-driven entry experience that presents the game's narrative and gameplay pillars. Two paths: "Enter the Facility" (authentication) or "Demo Mode" (try without auth).

### Authentication
Google OAuth2 handles identity. No passwords stored. Sessions managed server-side.

### Onboarding (New Players)
After first authentication, new players enter the onboarding tutorial guided by **ZIX**.

### ZIX — Tutorial Guide
* **Character**: A small holographic alien maintenance creature / facility technician.
* **Personality**: Curious, energetic, slightly sarcastic, friendly, helpful, weird enough to be memorable.
* **Rendering**: Compact SVG avatar with mood states (idle, excited, sarcastic, concerned, celebrating).
* **Dialogue**: Short, punchy lines that teach through action, not walls of text.

### Onboarding Philosophy
* **Teach through ACTION, not text**. Every lesson requires the player to perform the mechanic.
* **Use REAL game systems**. No tutorial-only duplicates of movement, shooting, heat, or Overclock.
* **Keep it short**. ZIX's dialogue is brief. The tutorial respects the player's time.
* **Skip available**. Players can skip at any point. Returning players never see it.
* **Replay available**. Tutorial can be replayed from the Boot Screen.

### Tutorial Steps
1. **Movement** — WASD input detection
2. **Aiming** — Mouse/crosshair positioning
3. **Shooting** — Destroy a training drone with real weapons
4. **Weapon Switching** — Press 1-4 to switch armaments
5. **Dash** — Dodge a telegraphed attack with Space
6. **Heat** — Build heat by firing continuously
7. **Cooling** — Stop firing and watch heat dissipate
8. **Overclock** — Activate the signature mechanic with Q
9. **Combat** — Eliminate hostiles using all learned skills
10. **Complete** — Campaign initialization, Mission 01 unlocked

---

## 8. Returning Players
Returning players skip directly from authentication to the Boot Screen / Mission Select. No forced tutorial. Tutorial replay available from Boot Screen.
