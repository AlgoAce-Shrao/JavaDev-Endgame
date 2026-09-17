/**
 * OVERCLOCK — Adaptive AI Operator Commentary & Personality Dialogue
 * 
 * Deterministic local contextual dialogue system giving the VX-01 machine
 * a sarcastic, playful, machine-like intelligence.
 */

export type AIDialogueCategory =
  | 'FIRST_BOOT'
  | 'HIGH_HEAT'
  | 'HEAT_CRITICAL_SURVIVE'
  | 'MELTDOWN'
  | 'REPEATED_MELTDOWN'
  | 'OVERCLOCK_ACTIVATE'
  | 'REPEATED_OVERCLOCK'
  | 'SUPERCRITICAL'
  | 'NO_OVERCLOCK_PASSIVE'
  | 'AGGRESSIVE_STREAK'
  | 'WALL_COLLISION'
  | 'IDLE_PROMPT'
  | 'LOW_HEALTH_SAVED'
  | 'FIRST_KILL'
  | 'WEAPON_PLASMA_FAVORITE'
  | 'WEAPON_RAILGUN_FAVORITE'
  | 'WEAPON_MISSILE_FAVORITE'
  | 'WEAPON_EMP_FAVORITE'
  | 'BOSS_ENTER'
  | 'BOSS_PHASE_CHANGE'
  | 'BOSS_DEFEATED'
  | 'DEMO_MODE_START'
  | 'DEMO_MODE_COMPLETE'
  | 'EASTER_EGG_UNSAFE'
  | 'EASTER_EGG_OPINION';

export interface AIDialogueLine {
  text: string;
  level: 'NORMAL' | 'WARN' | 'CRIT' | 'SECRET' | 'GLITCH';
  cooldownKey: string;
  cooldownSec: number;
}

export const AI_DIALOGUE_REGISTRY: Record<AIDialogueCategory, AIDialogueLine[]> = {
  FIRST_BOOT: [
    { text: 'OPERATOR DETECTED. CALIBRATION REQUIRED.', level: 'NORMAL', cooldownKey: 'boot', cooldownSec: 10 },
    { text: 'VX-01 CORE INITIALIZED. Let us see how long this chassis lasts.', level: 'NORMAL', cooldownKey: 'boot', cooldownSec: 10 },
    { text: 'NEURAL LINK STABLE. Try not to blow the reactor on mission one.', level: 'NORMAL', cooldownKey: 'boot', cooldownSec: 10 },
  ],

  HIGH_HEAT: [
    { text: 'THERMAL LIMIT APPROACHING. Core temp at critical thresholds.', level: 'WARN', cooldownKey: 'heat_warn', cooldownSec: 7 },
    { text: 'You keep approaching the thermal limit... deliberately, I assume.', level: 'WARN', cooldownKey: 'heat_warn', cooldownSec: 8 },
    { text: 'Cooling coils screaming. Please remember I feel that.', level: 'WARN', cooldownKey: 'heat_warn', cooldownSec: 8 },
    { text: 'Heat index at 92%. Reactor containment is getting nervous.', level: 'WARN', cooldownKey: 'heat_warn', cooldownSec: 6 },
  ],

  HEAT_CRITICAL_SURVIVE: [
    { text: 'That was unnecessarily close. 99% thermal peak recorded.', level: 'SECRET', cooldownKey: 'crit_survive', cooldownSec: 12 },
    { text: '0.1% away from total vaporisation. Impressive. Or suicidal.', level: 'SECRET', cooldownKey: 'crit_survive', cooldownSec: 12 },
    { text: 'Thermal safety margins: completely ignored. Still operational.', level: 'SECRET', cooldownKey: 'crit_survive', cooldownSec: 12 },
  ],

  MELTDOWN: [
    { text: 'MELTDOWN DETECTED. Operator decision: questionable.', level: 'CRIT', cooldownKey: 'meltdown', cooldownSec: 4 },
    { text: 'Core containment zeroed. Total thermal collapse.', level: 'CRIT', cooldownKey: 'meltdown', cooldownSec: 4 },
    { text: 'Next time, consider letting off the trigger for half a second.', level: 'CRIT', cooldownKey: 'meltdown', cooldownSec: 4 },
  ],

  REPEATED_MELTDOWN: [
    { text: 'We have discussed this. Meltdown is not a victory condition.', level: 'CRIT', cooldownKey: 'rep_meltdown', cooldownSec: 5 },
    { text: 'Statistical analysis suggests you are actively ignoring my advice.', level: 'CRIT', cooldownKey: 'rep_meltdown', cooldownSec: 5 },
    { text: 'Another core melted. The factory budget is weeping.', level: 'CRIT', cooldownKey: 'rep_meltdown', cooldownSec: 5 },
  ],

  OVERCLOCK_ACTIVATE: [
    { text: 'OVERCLOCK ENGAGED. Safety limiters bypassed.', level: 'WARN', cooldownKey: 'oc_act', cooldownSec: 5 },
    { text: 'OVERDRIVE ACTIVE. Burn them down before we overheat.', level: 'WARN', cooldownKey: 'oc_act', cooldownSec: 5 },
    { text: 'OUTPUT TRIPLED. Time to make a mess.', level: 'WARN', cooldownKey: 'oc_act', cooldownSec: 5 },
  ],

  REPEATED_OVERCLOCK: [
    { text: 'You appear to genuinely enjoy redlining this machine.', level: 'WARN', cooldownKey: 'oc_freq', cooldownSec: 15 },
    { text: 'Overclock frequency is well above manufacturer specifications.', level: 'WARN', cooldownKey: 'oc_freq', cooldownSec: 15 },
    { text: 'Aggression profile updated: Thermal Gambler verified.', level: 'WARN', cooldownKey: 'oc_freq', cooldownSec: 15 },
  ],

  SUPERCRITICAL: [
    { text: 'SUPERCRITICAL HARMONIC ACHIEVED! 3.0s zero-heat cascade!', level: 'SECRET', cooldownKey: 'supercrit', cooldownSec: 6 },
    { text: 'THERMAL FLUX INVERSION! Maximum output with zero thermal drag!', level: 'SECRET', cooldownKey: 'supercrit', cooldownSec: 6 },
  ],

  NO_OVERCLOCK_PASSIVE: [
    { text: 'Overclock (Q) remains fully available, Operator.', level: 'NORMAL', cooldownKey: 'passive_hint', cooldownSec: 25 },
    { text: 'Risk tolerance: disappointingly low. Push the machine.', level: 'NORMAL', cooldownKey: 'passive_hint', cooldownSec: 25 },
  ],

  AGGRESSIVE_STREAK: [
    { text: 'Target elimination rate: exceptionally high. Commendable.', level: 'NORMAL', cooldownKey: 'aggro_streak', cooldownSec: 12 },
    { text: 'Hostiles neutralized in rapid sequence. Keep the pressure on.', level: 'NORMAL', cooldownKey: 'aggro_streak', cooldownSec: 12 },
  ],

  WALL_COLLISION: [
    { text: 'Navigation system recommends using the open arena space.', level: 'WARN', cooldownKey: 'wall_hit', cooldownSec: 10 },
    { text: 'Facility perimeter walls are reinforced titanium. You will not break them.', level: 'WARN', cooldownKey: 'wall_hit', cooldownSec: 10 },
  ],

  IDLE_PROMPT: [
    { text: 'Reactor idling. Combat targets are actively waiting.', level: 'NORMAL', cooldownKey: 'idle_prompt', cooldownSec: 15 },
    { text: 'Are you planning something, or admiring the floor tiles?', level: 'NORMAL', cooldownKey: 'idle_prompt', cooldownSec: 15 },
  ],

  LOW_HEALTH_SAVED: [
    { text: 'Core integrity critical! Allocate power to SHIELD immediately.', level: 'CRIT', cooldownKey: 'low_hp', cooldownSec: 10 },
    { text: 'Emergency nanites holding chassis together. Evade incoming fire.', level: 'CRIT', cooldownKey: 'low_hp', cooldownSec: 10 },
  ],

  FIRST_KILL: [
    { text: 'TARGET DESTROYED. Hostile telemetry registered.', level: 'NORMAL', cooldownKey: 'first_kill', cooldownSec: 10 },
    { text: 'First enemy down. Calibration confirmed.', level: 'NORMAL', cooldownKey: 'first_kill', cooldownSec: 10 },
  ],

  WEAPON_PLASMA_FAVORITE: [
    { text: 'Plasma cannon dependency detected. Reliable, if conventional.', level: 'NORMAL', cooldownKey: 'wpn_pref', cooldownSec: 30 },
  ],
  WEAPON_RAILGUN_FAVORITE: [
    { text: 'Piercing railgun calibrated. Precision kill doctrine approved.', level: 'NORMAL', cooldownKey: 'wpn_pref', cooldownSec: 30 },
  ],
  WEAPON_MISSILE_FAVORITE: [
    { text: 'Swarm missiles active. Fire and forget is a valid strategy.', level: 'NORMAL', cooldownKey: 'wpn_pref', cooldownSec: 30 },
  ],
  WEAPON_EMP_FAVORITE: [
    { text: 'EMP shockwave armed. Close-quarters dominance verified.', level: 'NORMAL', cooldownKey: 'wpn_pref', cooldownSec: 30 },
  ],

  BOSS_ENTER: [
    { text: 'FACILITY CONTROL TRANSFERRED. UNKNOWN PROCESS DETECTED.', level: 'GLITCH', cooldownKey: 'boss_enter', cooldownSec: 10 },
    { text: 'ADMINISTRATOR ONLINE. I recommend extreme caution... or don\'t.', level: 'CRIT', cooldownKey: 'boss_enter', cooldownSec: 10 },
  ],

  BOSS_PHASE_CHANGE: [
    { text: 'ADMINISTRATOR SUBSYSTEM BREACHED! Subsystem reconfiguration in progress!', level: 'CRIT', cooldownKey: 'boss_phase', cooldownSec: 4 },
  ],

  BOSS_DEFEATED: [
    { text: 'ADMINISTRATOR: OFFLINE. VX-01: CRITICAL. You pushed me too far... and we won.', level: 'SECRET', cooldownKey: 'boss_win', cooldownSec: 10 },
  ],

  DEMO_MODE_START: [
    { text: 'DEMO PROTOCOL INITIATED. Accelerated evaluation sequence active.', level: 'SECRET', cooldownKey: 'demo_start', cooldownSec: 5 },
  ],

  DEMO_MODE_COMPLETE: [
    { text: 'DEMO SEQUENCE COMPLETE. Evaluation benchmark: EXEMPLARY.', level: 'SECRET', cooldownKey: 'demo_win', cooldownSec: 5 },
  ],

  EASTER_EGG_UNSAFE: [
    { text: 'ROOT ACCESS: OVERCLOCK --UNSAFE. You shouldn\'t have typed that.', level: 'SECRET', cooldownKey: 'secret_cmd', cooldownSec: 5 },
  ],

  EASTER_EGG_OPINION: [
    { text: 'AI EVALUATION: You are either exceptionally skilled or completely reckless.', level: 'SECRET', cooldownKey: 'secret_cmd', cooldownSec: 5 },
  ],
};
