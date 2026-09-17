export interface Vector2D {
  x: number;
  y: number;
}

export type WeaponId =
  | 'plasma'
  | 'railgun'
  | 'missiles'
  | 'emp'
  | 'scatter_flak'
  | 'cryo_beam'
  | 'gauss_gatling'
  | 'singularity';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  code: string;
  description: string;
  damage: number;
  fireRate: number; // shots per second
  heatPerShot: number;
  energyPerShot: number;
  projectileSpeed: number;
  projectileRadius: number;
  range: number;
  color: string;
  burstCount?: number;
  spreadAngle?: number;
  piercing?: boolean;
  homing?: boolean;
  areaEffect?: boolean;
  beam?: boolean;
  ricochet?: boolean;
  chargeTime?: number;
}

// -------------------------------------------------------------
// WEAPON MODDING TYPES
// -------------------------------------------------------------
export type WeaponModSlotType =
  | 'BARREL'
  | 'MAGAZINE'
  | 'CATALYST'
  | 'ACCELERATOR'
  | 'OVERCLOCK_CORE';

export interface WeaponModDef {
  id: string;
  name: string;
  code: string;
  slotType: WeaponModSlotType;
  description: string;
  statsDescription: string;
  icon: string;
  rarity: 'STANDARD' | 'ADVANCED' | 'PROTOTYPE' | 'QUANTUM';
  cost: number;
  // Modifiers
  damageMult?: number;
  fireRateMult?: number;
  heatPerShotMult?: number;
  energyPerShotMult?: number;
  speedMult?: number;
  rangeMult?: number;
  extraProjectiles?: number;
  spreadAngleAdd?: number;
  ricochetBounces?: number;
  piercing?: boolean;
  homing?: boolean;
  areaEffect?: boolean;
  areaRadiusMult?: number;
  chainLightning?: boolean;
  cryoSlow?: boolean;
  plasmaIgnite?: boolean;
  heatSiphon?: boolean;
  shieldVampire?: boolean;
}

export interface WeaponModSlotStatus {
  slotType: WeaponModSlotType;
  unlocked: boolean;
  unlockCost: number;
  equippedModId?: string;
}

export interface WeaponModConfig {
  weaponId: WeaponId;
  slots: WeaponModSlotStatus[];
}

// -------------------------------------------------------------
// ENDLESS MODIFIERS & MUTATIONS
// -------------------------------------------------------------
export type EndlessMutationType = 'HOSTILE' | 'ENVIRONMENTAL' | 'DOUBLE_EDGED';

export interface EndlessMutationDef {
  id: string;
  name: string;
  code: string;
  type: EndlessMutationType;
  hazardLevel: 1 | 2 | 3 | 4 | 5;
  description: string;
  icon: string;
  color: string;
  effects: {
    enemySpeedMult?: number;
    enemyHpMult?: number;
    enemyFireRateMult?: number;
    enemyBulletSpeedMult?: number;
    enemyExplodeOnDeath?: boolean;
    naniteRegenRate?: number; // HP/s
    berserkerUnderHpPercent?: number; // under HP % frenzy
    quantumPhaseShift?: boolean; // periodic teleport / dodge
    acidPoolsOnDeath?: boolean; // leaves hazard pools
    gravityWells?: boolean; // gravitational singularity anomalies
    solarFlareHeatRate?: number; // reduced cooling or ambient heat
    empStormFlicker?: boolean; // periodic EMP glitch pulses
    corrosiveAura?: boolean;
    swarmDensityMult?: number;
    playerBonusDamage?: number;
  };
}

export interface HazardPool {
  id: string;
  x: number;
  y: number;
  radius: number;
  duration: number;
  maxDuration: number;
  color: string;
  damagePerSec: number;
  type: 'ACID' | 'FIRE' | 'EMP';
}

export interface GravityAnomaly {
  id: string;
  x: number;
  y: number;
  radius: number;
  pullStrength: number;
  duration: number;
  maxDuration: number;
  pulseTimer: number;
}

export interface PowerAllocation {
  weapons: number; // percentage (0-100)
  engine: number;  // percentage (0-100)
  shield: number;  // percentage (0-100)
  cooling: number; // percentage (0-100)
}

export interface UpgradeDef {
  id: string;
  name: string;
  code: string;
  tagline: string;
  benefit: string;
  drawback: string;
  category: 'THERMAL' | 'OFFENSE' | 'DEFENSE' | 'REACTOR' | 'CYBER';
  icon: string;
  appliedCount: number;
}

export type EnemyType = 'drone' | 'charger' | 'turret' | 'leech' | 'hacker';

export type BossSubsystemId = 'core' | 'shield' | 'weapons' | 'engine';

export interface BossSubsystem {
  id: BossSubsystemId;
  name: string;
  hp: number;
  maxHp: number;
  destroyed: boolean;
  angleOffset: number;
}

export interface MissionWave {
  enemyCounts: Partial<Record<EnemyType, number>>;
  spawnDelaySec: number;
  hazardNote?: string;
}

export interface MissionDef {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  arena: string;
  threatLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'CRITICAL';
  briefing: string;
  primaryObjective: string;
  systemWarning?: string;
  completionConditionText: string;
  failureConditionText: string;
  waves: MissionWave[];
  rewardCredits: number;
  rewardScore: number;
  rewardModule?: string;
  unlocksWeapon?: WeaponId;
  bossMission?: boolean;
}

export interface MissionStats {
  missionId: number;
  missionCode: string;
  missionTitle: string;
  timeSec: number;
  kills: number;
  damageDealt: number;
  maxCombo: number;
  maxHeat: number;
  overclockUsage: number;
  rating: 'S' | 'A' | 'B' | 'C';
  creditsEarned: number;
  scoreEarned: number;
  unlockedWeapon?: string;
}

export interface OperatorStats {
  totalRuns: number;
  totalKills: number;
  totalMeltdowns: number;
  totalOverclockTimeSec: number;
  highestHeatReached: number;
  bestCombo: number;
  bestScore: number;
  missionsCompleted: number;
  bossDefeats: number;
  favoriteWeapon: string;
  totalDamageDealt: number;
  totalDamageTaken: number;
  firstKillAchieved: boolean;
  nearMeltdownSurvivals: number;
  supercriticalTriggers: number;
}

export type PlaystyleArchetype =
  | 'THERMAL_GAMBLER'
  | 'OVERCLOCK_ADDICT'
  | 'SPEED_DEMON'
  | 'KINETIC_BALLISTICIAN'
  | 'DEFENSIVE_TACTICIAN'
  | 'COLD_CALCULATOR'
  | 'CHAOS_OPERATOR';

export interface AchievementDef {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  secret?: boolean;
}

export interface ExperimentalProtocolDef {
  id: string;
  code: string;
  name: string;
  description: string;
  riskRewardDesc: string;
  scoreMultiplier: number;
  icon: string;
  unlockedByDefault?: boolean;
  modifiers: {
    heatGenerationMult?: number;
    coolingRateMult?: number;
    overclockDurationMult?: number;
    overclockDamageMult?: number;
    playerMaxHpMult?: number;
    playerSpeedMult?: number;
    enemyHpMult?: number;
    enemySpeedMult?: number;
    oneShotMode?: boolean;
    continuousHeatDecayDisabled?: boolean;
    unregulatedOverclock?: boolean;
  };
}

export interface CampaignSaveState {
  completedMissions: number[];
  unlockedMissions: number[];
  highestUnlockedMission: number;
  endlessUnlocked: boolean;
  endlessHighScore: number;
  endlessBestWave: number;
  totalCyberCredits: number;
  missionRatings: Record<number, 'S' | 'A' | 'B' | 'C'>;
  missionHighScores: Record<number, number>;
  unlockedWeapons: WeaponId[];
  weaponModConfigs?: Record<string, WeaponModConfig>;
  bootSequenceSeen?: boolean;
  operatorStats?: OperatorStats;
  unlockedAchievements?: string[];
  discoveredSecrets?: string[];
  unlockedProtocols?: string[];
  activeProtocols?: string[];
  settings?: {
    isMuted: boolean;
    volume: number;
    screenShake: boolean;
    crtScanlines: boolean;
  };
}

export interface TacticalMessage {
  id: string;
  text: string;
  timestamp: number;
  level: 'NORMAL' | 'WARN' | 'CRIT' | 'SECRET' | 'GLITCH';
}

export type GameStateMode =
  | 'BOOT'
  | 'MISSION_SELECT'
  | 'BRIEFING'
  | 'PLAYING'
  | 'PAUSED'
  | 'OBJECTIVE_COMPLETE'
  | 'MISSION_COMPLETE'
  | 'UPGRADE_SELECT'
  | 'CAMPAIGN_VICTORY'
  | 'MELTDOWN'
  | 'GAME_OVER'
  | 'VICTORY';

export interface TelemetrySnapshot {
  core: number;
  maxCore: number;
  shield: number;
  maxShield: number;
  energy: number;
  maxEnergy: number;
  heat: number; // 0 - 100
  heatState: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'MELTDOWN_IMMINENT' | 'MELTDOWN';
  isOverclocked: boolean;
  overclockTimeLeft: number;
  overclockDuration: number;
  isSupercritical: boolean;
  isHacked: boolean;
  hackDurationLeft: number;
  hackInterferenceTarget?: 'WEAPONS' | 'POWER_ROUTER' | 'RADAR' | 'THRUSTERS';
  isPaused: boolean;
  currentMode: GameStateMode;
  power: PowerAllocation;
  activeWeapon: WeaponDef;
  availableWeapons: WeaponDef[];
  score: number;
  combo: number;
  comboMultiplier: number;
  missionNumber: number;
  missionCode: string;
  missionName: string;
  missionArena: string;
  missionWave: number;
  totalWaves: number;
  enemiesRemaining: number;
  primaryObjectiveText: string;
  objectiveProgress: {
    current: number;
    total: number;
    label: string;
    isComplete: boolean;
    objectiveCompleteTimer?: number;
  };
  lastMissionStats?: MissionStats;
  tacticalLog: TacticalMessage[];
  kills: number;
  overclockKills: number;
  gameTimeSec: number;
  damageDealt: number;
  activeUpgrades: UpgradeDef[];
  secretsUnlocked: string[];
  bossHp?: { current: number; max: number; phase: number; subsystems: BossSubsystem[] };
  // Campaign & Progression
  unlockedMissions: number[];
  completedMissions: number[];
  endlessUnlocked: boolean;
  endlessHighScore: number;
  endlessBestWave: number;
  missionRatings: Record<number, string>;
  // Endless & Weapon Modding Additions
  isEndlessMode: boolean;
  endlessWaveNumber: number;
  activeMutations: EndlessMutationDef[];
  cyberCredits: number;
  weaponModConfigs: Record<string, WeaponModConfig>;
  activeWeaponCalculatedStats?: {
    damage: number;
    fireRate: number;
    dps: number;
    heatPerShot: number;
    energyPerShot: number;
    projectileSpeed: number;
    specialEffects: string[];
  };
  isDemoActive?: boolean;
  demoStep?: {
    id: string;
    stepNumber: number;
    totalSteps: number;
    title: string;
    description: string;
    actionPrompt: string;
    progress: number;
  };
  activeProtocols?: string[];
}
