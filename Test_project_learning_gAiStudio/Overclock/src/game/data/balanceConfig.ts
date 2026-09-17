/**
 * OVERCLOCK — Centralized Game Balance & Survivability Configuration
 * 
 * Provides tuneable constants for player survivability, thermal dynamics,
 * enemy behavior/damage, pacing, and boss mechanics.
 */

export const GAME_BALANCE = {
  // --- PLAYER SURVIVABILITY & COMBAT VITALS ---
  PLAYER: {
    MAX_CORE_HEALTH: 130,          // Default baseline increased by +30% (from 100 to 130)
    MAX_SHIELD: 60,                // Default shield increased by +20% (from 50 to 60)
    MAX_ENERGY: 100,
    BASE_SPEED: 280,
    SHIELD_REGEN_RATE_BASE: 7.0,   // Base shield regen rate per second (was 6.0)
    SHIELD_REGEN_DELAY: 2.2,       // Delay before shield recharge begins after hit in seconds (was 2.5s)
    ENERGY_REGEN_RATE: 20.0,       // Energy regen per second (was 18.0)
    DASH_COOLDOWN_BASE: 0.9,       // Base dash cooldown in seconds (was 1.0s)
    DASH_DURATION: 0.18,           // Dash invulnerability duration (seconds)
    DASH_ENERGY_COST: 12,          // Dash energy cost (was 15)
  },

  // --- HEAT & OVERCLOCK DYNAMICS ---
  HEAT: {
    HEAT_GENERATION_MULTIPLIER: 0.88, // 12% slower heat buildup during combat
    NORMAL_COOLING_RATE: 9.0,         // Passive cooling dissipation rate (was 8.0)
    OVERCLOCK_HEAT_RATE: 12.0,        // Heat buildup rate during Overclock (was 14.0, ~14% lower)
    OVERCLOCK_DURATION: 5.5,          // Base Overclock duration in seconds (was 5.0s)
    SUPERCRITICAL_MIN_HEAT: 95,       // Meltdown threshold window for supercritical activation
    SUPERCRITICAL_MAX_HEAT: 99,
  },

  // --- ENEMY GENERAL & DAMAGE REDUCTION ---
  ENEMY_GENERAL: {
    GLOBAL_DAMAGE_MULTIPLIER: 0.82,   // Incoming hostile damage reduced by ~18%
    CONTACT_DAMAGE: 12,               // Physical body collision damage with player (was 15)
    WAVE_SPAWN_INTERVAL: 0.85,        // Spawn spacing between enemies in seconds (was 0.65s)
  },

  // --- ENEMY SPECIFIC BALANCE ---
  DRONE: {
    MAX_HP: 26,                       // Drone health (was 28)
    SPEED: 130,                       // Movement speed (was 140)
    BULLET_DAMAGE: 8,                 // Projectile damage (was 10, -20%)
    BULLET_SPEED: 290,                // Projectile velocity (was 320)
    ATTACK_COOLDOWN_BASE: 2.6,        // Time between shots (was 2.2s)
  },

  CHARGER: {
    MAX_HP: 70,                       // Charger health (was 75)
    PATROL_SPEED: 85,                 // Approach speed (was 90)
    WINDUP_TELEGRAPH_TIME: 1.15,      // Visual laser telegraph duration (was 0.9s, generous reaction window)
    CHARGE_SPEED: 570,                // Charge dash velocity (was 620)
    ATTACK_COOLDOWN_BASE: 3.0,        // Post-charge recovery & cooldown (was 2.5s)
  },

  TURRET: {
    MAX_HP: 130,                      // Fortified HP preserved to teach Overclock usage
    BULLET_DAMAGE: 11,                // Turret dual-bolt damage (was 14, -21%)
    BULLET_SPEED: 340,                // Turret projectile speed (was 380)
    ATTACK_COOLDOWN: 2.8,             // Firing cycle interval (was 2.4s)
  },

  LEECH: {
    MAX_HP: 48,                       // Leech health (was 50)
    ENERGY_DRAIN_RATE: 8.0,           // Drain intensity per second (was 10.0/s, -20%)
    TETHER_DISTANCE: 300,             // Siphon range (was 320)
  },

  HACKER: {
    MAX_HP: 75,                       // Hacker health (was 80)
    HACK_COOLDOWN: 5.2,               // Pulse cooldown (was 4.5s, longer reaction time)
    HACK_DURATION: 2.8,               // Duration of UI / system disruption (was 3.5s)
    HEAT_SPIKE: 4,                    // Heat injected during hack pulse (was 6)
    HACK_RANGE: 350,                  // Broadcast radius (was 380)
  },

  // --- BOSS: THE ADMINISTRATOR ---
  BOSS: {
    MAX_HP: 1100,                     // Total Core HP (was 1200)
    PHASE1_DAMAGE: 10,                // Phase 1 radial shot damage (was 12)
    PHASE2_DAMAGE: 13,                // Phase 2 fan shot damage (was 16)
    PHASE3_DAMAGE: 11,                // Phase 3 spiral barrage damage (was 14)
    ATTACK_COOLDOWN_BASE: 1.6,        // Weapon subsystem attack cycle (was 1.4s)
    SPECIAL_COOLDOWN: 6.0,            // Special hack blast interval (was 5.0s)
    HACK_DURATION: 2.4,               // Boss hack duration (was 3.0s)
    REINFORCEMENT_SPAWN_TIMER: 9.0,   // Spawn timer for helper drones (was 7-10s)
  },
} as const;
