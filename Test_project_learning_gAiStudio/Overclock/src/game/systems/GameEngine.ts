import {
  GameStateMode,
  TelemetrySnapshot,
  WeaponDef,
  WeaponId,
  UpgradeDef,
  Vector2D,
  MissionDef,
  EnemyType,
  WeaponModConfig,
  WeaponModSlotType,
  WeaponModDef,
  EndlessMutationDef,
  MissionStats,
} from '../types';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Boss } from '../entities/Boss';
import { Projectile } from '../entities/Projectile';
import { Particle } from '../entities/Particle';
import { WEAPON_REGISTRY } from '../data/weapons';
import { MISSIONS } from '../data/missions';
import { ALL_UPGRADES } from '../data/upgrades';
import { DEFAULT_WEAPON_SLOT_CONFIGS, WEAPON_MODS_REGISTRY } from '../data/weaponMods';
import { ALL_ENDLESS_MUTATIONS } from '../data/endlessMutations';
import { SECRETS_DATA, SecretCommandResult } from '../data/secrets';
import { GAME_BALANCE } from '../data/balanceConfig';
import { EXPERIMENTAL_PROTOCOLS } from '../data/protocols';
import { PowerSystem } from './PowerSystem';
import { TacticalAI } from './TacticalAI';
import { AICommentarySystem } from './AICommentarySystem';
import { DemoModeSystem } from './DemoModeSystem';
import { onboardingSystem } from './OnboardingSystem';
import { achievementSystem } from './AchievementSystem';
import { operatorProfileSystem } from './OperatorProfileSystem';
import { saveSystem } from './SaveSystem';
import { soundSynth } from '../audio/SoundSynth';

export class GameEngine {
  public mode: GameStateMode = 'BOOT';
  public previousMode: GameStateMode = 'PLAYING';
  public arenaWidth: number = 1000;
  public arenaHeight: number = 700;

  // Systems
  public player: Player;
  public powerSystem: PowerSystem;
  public tacticalAI: TacticalAI;
  public aiCommentary: AICommentarySystem;
  public demoSystem: DemoModeSystem;
  public activeProtocols: string[] = [];

  // Entities
  public enemies: Enemy[] = [];
  public projectiles: Projectile[] = [];
  public particles: Particle[] = [];
  public boss: Boss | null = null;

  // Weapons & Modding
  public availableWeapons: WeaponDef[] = [];
  public activeWeaponIndex: number = 0;
  public fireCooldownTimer: number = 0;
  public cyberCredits: number = 0;
  public weaponModConfigs: Record<WeaponId, WeaponModConfig> = JSON.parse(
    JSON.stringify(DEFAULT_WEAPON_SLOT_CONFIGS)
  );

  // Missions & Progression
  public currentMissionIndex: number = 0;
  public currentWaveIndex: number = 0;
  public waveSpawnTimer: number = 0;
  public enemiesToSpawn: EnemyType[] = [];

  // Mission Tracking & Statistics
  public missionTimeSec: number = 0;
  public missionKills: number = 0;
  public missionDamageDealt: number = 0;
  public missionMaxCombo: number = 0;
  public missionMaxHeat: number = 0;
  public missionOverclockUsage: number = 0;
  public objectiveCompleteTimer: number = 0;
  public lastMissionStats?: MissionStats;

  // Mission Objective Specific Counts
  public missionSpecificKills: number = 0;
  public missionSpecificTarget: number = 0;

  // Endless Mode & Mutations
  public isEndlessMode: boolean = false;
  public endlessWaveNumber: number = 1;
  public activeEndlessMutations: EndlessMutationDef[] = [];
  public currentMutationChoices: EndlessMutationDef[] = [];

  // Upgrades
  public activeUpgrades: UpgradeDef[] = [];
  public currentUpgradeChoices: UpgradeDef[] = [];

  // Secrets & Lore
  public secretsUnlocked: string[] = [];
  public greenPhosphorColorway: boolean = false;

  // Overall Score & Stats
  public score: number = 0;
  public combo: number = 0;
  public comboTimer: number = 0;
  public comboMultiplier: number = 1.0;
  public kills: number = 0;
  public overclockKills: number = 0;
  public gameTimeSec: number = 0;
  public totalDamageDealt: number = 0;

  // Screen Effects
  public screenShake: number = 0;
  public meltdownSequenceTimer: number = 0;

  // Inputs
  public keysDown: Set<string> = new Set();
  public mousePos: Vector2D = { x: 500, y: 350 };
  public isMouseDown: boolean = false;
  public virtualInputDir: Vector2D = { x: 0, y: 0 };
  public virtualAimDir: Vector2D | null = null;
  public virtualFiring: boolean = false;

  // Telemetry callback
  private onTelemetryUpdate?: (telemetry: TelemetrySnapshot) => void;
  private telemetryTimer: number = 0;

  constructor(onTelemetryUpdate?: (telemetry: TelemetrySnapshot) => void) {
    this.onTelemetryUpdate = onTelemetryUpdate;
    this.player = new Player(500, 350);
    this.powerSystem = new PowerSystem();
    this.tacticalAI = new TacticalAI();
    this.aiCommentary = new AICommentarySystem(this.tacticalAI);
    this.demoSystem = new DemoModeSystem();

    // Initialize Save System State
    const saved = saveSystem.getState();
    this.cyberCredits = saved.totalCyberCredits || 0;
    this.activeProtocols = saved.activeProtocols || [];

    // Load available weapons from save
    const unlockedIds = saved.unlockedWeapons || ['plasma'];
    this.availableWeapons = Object.values(WEAPON_REGISTRY).filter((w) =>
      unlockedIds.includes(w.id as WeaponId)
    );
    if (this.availableWeapons.length === 0) {
      this.availableWeapons = [WEAPON_REGISTRY.plasma];
    }

    if (saved.weaponModConfigs) {
      this.weaponModConfigs = {
        ...this.weaponModConfigs,
        ...saved.weaponModConfigs,
      };
    }
  }

  public get unlockedMissions(): number[] {
    return saveSystem.getState().unlockedMissions || [1];
  }

  public get completedMissions(): number[] {
    return saveSystem.getState().completedMissions || [];
  }

  public get missionRatings(): Record<number, 'S' | 'A' | 'B' | 'C'> {
    return saveSystem.getState().missionRatings || {};
  }

  public get missionHighScores(): Record<number, number> {
    return saveSystem.getState().missionHighScores || {};
  }

  public get endlessUnlocked(): boolean {
    return saveSystem.getState().endlessUnlocked || false;
  }

  public get endlessHighScore(): number {
    return saveSystem.getState().endlessHighScore || 0;
  }

  public get endlessBestWave(): number {
    return saveSystem.getState().endlessBestWave || 1;
  }

  public emitTelemetry() {
    if (this.onTelemetryUpdate) {
      this.onTelemetryUpdate(this.getTelemetrySnapshot());
    }
  }

  public calculateEffectiveWeaponStats(weaponDef: WeaponDef) {
    const config = this.weaponModConfigs[weaponDef.id];
    let damageMult = 1.0;
    let fireRateMult = 1.0;
    let heatPerShotMult = 1.0;
    let energyPerShotMult = 1.0;
    let rangeMult = 1.0;
    let speedMult = 1.0;
    const specialEffects: string[] = [];

    if (config && config.slots) {
      for (const slot of config.slots) {
        if (slot.unlocked && slot.equippedModId) {
          const modDef = WEAPON_MODS_REGISTRY[slot.equippedModId];
          if (modDef) {
            if (modDef.damageMult) damageMult *= modDef.damageMult;
            if (modDef.fireRateMult) fireRateMult *= modDef.fireRateMult;
            if (modDef.heatPerShotMult) heatPerShotMult *= modDef.heatPerShotMult;
            if (modDef.energyPerShotMult) energyPerShotMult *= modDef.energyPerShotMult;
            if (modDef.rangeMult) rangeMult *= modDef.rangeMult;
            if (modDef.speedMult) speedMult *= modDef.speedMult;
            if (modDef.statsDescription) specialEffects.push(modDef.name);
          }
        }
      }
    }

    const calculatedDamage = Math.round(weaponDef.damage * damageMult);
    const calculatedFireRate = Number((weaponDef.fireRate * fireRateMult).toFixed(2));
    const calculatedHeat = Math.max(1, Math.round(weaponDef.heatPerShot * heatPerShotMult));
    const calculatedEnergy = Math.max(1, Math.round(weaponDef.energyPerShot * energyPerShotMult));
    const calculatedDps = Math.round(calculatedDamage * calculatedFireRate);
    const calculatedProjSpeed = Math.round(weaponDef.projectileSpeed * rangeMult * speedMult);

    return {
      damage: calculatedDamage,
      fireRate: calculatedFireRate,
      dps: calculatedDps,
      heatPerShot: calculatedHeat,
      energyPerShot: calculatedEnergy,
      projectileSpeed: calculatedProjSpeed,
      specialEffects,
    };
  }

  public unlockModSlot(weaponId: WeaponId, slotType: WeaponModSlotType): boolean {
    const config = this.weaponModConfigs[weaponId];
    if (!config) return false;
    const slot = config.slots.find((s) => s.slotType === slotType);
    if (!slot || slot.unlocked) return false;

    if (this.cyberCredits >= slot.unlockCost) {
      this.cyberCredits -= slot.unlockCost;
      saveSystem.spendCredits(slot.unlockCost);
      slot.unlocked = true;
      saveSystem.saveWeaponModConfig(weaponId, config);
      soundSynth.playUpgradeSelected();
      this.tacticalAI.addMessage(`UNLOCKED [${slotType}] MOD SLOT ON ${weaponId.toUpperCase()}`, 'NORMAL');
      return true;
    }
    this.tacticalAI.addMessage('INSUFFICIENT CYBER CREDITS', 'WARN');
    return false;
  }

  public equipMod(
    weaponId: WeaponId,
    slotType: WeaponModSlotType,
    modId?: string
  ): boolean {
    const config = this.weaponModConfigs[weaponId];
    if (!config) return false;
    const slot = config.slots.find((s) => s.slotType === slotType);
    if (!slot || !slot.unlocked) return false;

    slot.equippedModId = modId;
    saveSystem.saveWeaponModConfig(weaponId, config);
    soundSynth.playUiClick();

    const wName = WEAPON_REGISTRY[weaponId]?.name || weaponId;
    if (modId) {
      const mName = WEAPON_MODS_REGISTRY[modId]?.name || modId;
      this.tacticalAI.addMessage(`MOD ATTACHED: ${wName} -> ${mName} [${slotType}]`, 'NORMAL');
    } else {
      this.tacticalAI.addMessage(`MOD DETACHED: ${wName} [${slotType}]`, 'NORMAL');
    }
    return true;
  }

  // --- Campaign Flow & Mission Navigation ---

  public showMissionSelect() {
    this.mode = 'MISSION_SELECT';
    this.clearKeys();
    this.emitTelemetry();
  }

  public openMissionSelect() {
    this.showMissionSelect();
  }

  public showBriefing(missionIndex: number) {
    if (missionIndex < 0 || missionIndex >= MISSIONS.length) return;
    this.currentMissionIndex = missionIndex;
    this.mode = 'BRIEFING';
    this.clearKeys();
    soundSynth.playUiClick();
    this.emitTelemetry();
  }

  public openBriefing(missionIndex: number) {
    this.showBriefing(missionIndex);
  }

  public launchCurrentMission() {
    this.startMission(this.currentMissionIndex);
  }

  public restartMission() {
    this.startMission(this.currentMissionIndex);
  }

  public proceedToNextMission() {
    const nextIdx = this.currentMissionIndex + 1;
    if (nextIdx < MISSIONS.length) {
      this.showBriefing(nextIdx);
    } else {
      this.showMissionSelect();
    }
  }

  public startMission(missionIndex: number = 0) {
    this.currentMissionIndex = Math.max(0, Math.min(MISSIONS.length - 1, missionIndex));
    this.currentWaveIndex = 0;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.boss = null;
    this.isEndlessMode = false;
    this.mode = 'PLAYING';
    this.clearKeys();

    // Reset Mission stats
    this.missionTimeSec = 0;
    this.missionKills = 0;
    this.missionDamageDealt = 0;
    this.missionMaxCombo = 0;
    this.missionMaxHeat = 0;
    this.missionOverclockUsage = 0;
    this.missionSpecificKills = 0;
    this.objectiveCompleteTimer = 0;

    // Reset Player position & combat vitals
    this.player.reset(this.arenaWidth / 2 || 500, this.arenaHeight / 2 || 350);

    const mission = MISSIONS[this.currentMissionIndex];
    if (!mission) {
      this.mode = 'VICTORY';
      this.emitTelemetry();
      return;
    }

    // Calculate specific target counts based on mission requirements
    if (mission.id === 1) {
      // Drones across all waves
      this.missionSpecificTarget = mission.waves.reduce((acc, w) => acc + (w.enemyCounts.drone || 0), 0);
    } else if (mission.id === 2) {
      // Chargers across all waves
      this.missionSpecificTarget = mission.waves.reduce((acc, w) => acc + (w.enemyCounts.charger || 0), 0);
    } else if (mission.id === 3) {
      // Fortified Turrets
      this.missionSpecificTarget = mission.waves.reduce((acc, w) => acc + (w.enemyCounts.turret || 0), 0);
    } else if (mission.id === 4) {
      // Energy Leeches
      this.missionSpecificTarget = mission.waves.reduce((acc, w) => acc + (w.enemyCounts.leech || 0), 0);
    } else if (mission.id === 5) {
      // Hackers
      this.missionSpecificTarget = mission.waves.reduce((acc, w) => acc + (w.enemyCounts.hacker || 0), 0);
    } else if (mission.id === 6) {
      this.missionSpecificTarget = 4; // 4 subsystems
    }

    this.tacticalAI.addMessage(`OPERATION INITIALIZED: ${mission.code} [${mission.title}]`, 'NORMAL');

    if (mission.unlocksWeapon && !this.availableWeapons.some((w) => w.id === mission.unlocksWeapon)) {
      const def = WEAPON_REGISTRY[mission.unlocksWeapon];
      if (def) this.availableWeapons.push(def);
    }

    if (mission.bossMission) {
      this.boss = new Boss(this.arenaWidth / 2, 200);
      this.tacticalAI.addMessage('ALERT: ADMINISTRATOR MAINFRAME ONLINE', 'CRIT');
    } else {
      this.setupWave(0);
    }
    this.emitTelemetry();
  }

  public setupWave(waveIdx: number) {
    const mission = MISSIONS[this.currentMissionIndex];
    if (!mission || !mission.waves[waveIdx]) return;
    this.currentWaveIndex = waveIdx;
    const wave = mission.waves[waveIdx];
    this.enemiesToSpawn = [];
    Object.entries(wave.enemyCounts).forEach(([type, count]) => {
      for (let i = 0; i < (count || 0); i++) {
        this.enemiesToSpawn.push(type as EnemyType);
      }
    });
    this.waveSpawnTimer = wave.spawnDelaySec;
    this.tacticalAI.addMessage(`WAVE ${waveIdx + 1}/${mission.waves.length} ENGAGING`, 'NORMAL');
  }

  // --- Centralized Pause System ---

  public pause() {
    if (this.mode === 'PLAYING') {
      this.previousMode = this.mode;
      this.mode = 'PAUSED';
      this.clearKeys();
      soundSynth.playPause();
      this.emitTelemetry();
    }
  }

  public resume() {
    if (this.mode === 'PAUSED') {
      this.mode = this.previousMode === 'PAUSED' ? 'PLAYING' : this.previousMode;
      this.clearKeys();
      soundSynth.playResume();
      this.emitTelemetry();
    }
  }

  public togglePause() {
    if (this.mode === 'PLAYING') {
      this.pause();
    } else if (this.mode === 'PAUSED') {
      this.resume();
    }
  }

  // --- Virtual / Directional Input & Aiming ---

  public setVirtualAim(dir: Vector2D | null, fire: boolean = true) {
    this.virtualAimDir = dir ? { ...dir } : null;
    this.virtualFiring = fire && dir !== null;
  }

  public fireInDirection(dir: Vector2D) {
    const len = Math.hypot(dir.x, dir.y);
    if (len > 0) {
      const normX = dir.x / len;
      const normY = dir.y / len;
      this.mousePos = {
        x: this.player.pos.x + normX * 300,
        y: this.player.pos.y + normY * 300,
      };
      if (this.mode === 'PLAYING') {
        this.fireActiveWeapon();
      }
    }
  }

  public getDirectionalFireVector(): Vector2D | null {
    if (this.virtualAimDir) {
      return this.virtualAimDir;
    }

    let dx = 0;
    let dy = 0;

    // Arrow keys dedicated directional firing
    if (this.hasKey('ArrowUp')) dy -= 1;
    if (this.hasKey('ArrowDown')) dy += 1;
    if (this.hasKey('ArrowLeft')) dx -= 1;
    if (this.hasKey('ArrowRight')) dx += 1;

    // IJKL Twin-Stick keys
    if (this.hasKey('KeyI') || this.hasKey('i')) dy -= 1;
    if (this.hasKey('KeyK') || this.hasKey('k')) dy += 1;
    if (this.hasKey('KeyJ') || this.hasKey('j')) dx -= 1;
    if (this.hasKey('KeyL') || this.hasKey('l')) dx += 1;

    // Numpad Directional keys
    if (this.hasKey('Numpad8')) dy -= 1;
    if (this.hasKey('Numpad2')) dy += 1;
    if (this.hasKey('Numpad4')) dx -= 1;
    if (this.hasKey('Numpad6')) dx += 1;
    if (this.hasKey('Numpad7')) { dy -= 1; dx -= 1; }
    if (this.hasKey('Numpad9')) { dy -= 1; dx += 1; }
    if (this.hasKey('Numpad1')) { dy += 1; dx -= 1; }
    if (this.hasKey('Numpad3')) { dy += 1; dx += 1; }

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      return { x: dx / len, y: dy / len };
    }
    return null;
  }

  public handleKeyDown(code: string, key?: string) {
    if (code) this.keysDown.add(code);
    if (key) {
      this.keysDown.add(key);
      this.keysDown.add(key.toLowerCase());
      this.keysDown.add(key.toUpperCase());
    }

    const c = code || '';
    const k = (key || '').toLowerCase();

    // Pause Key Toggle (Escape or P)
    if (c === 'Escape' || c === 'KeyP' || k === 'p') {
      if (this.mode === 'PLAYING') {
        this.pause();
        return;
      } else if (this.mode === 'PAUSED') {
        this.resume();
        return;
      }
    }

    // Primary Fire key press immediate trigger
    if (c === 'KeyF' || k === 'f' || c === 'Enter' || c === 'Numpad0') {
      if (this.mode === 'PLAYING') {
        this.fireActiveWeapon();
      }
    } else if (c === 'KeyQ' || k === 'q') {
      this.toggleOverclock();
    } else if (c === 'Digit1' || k === '1') {
      this.selectWeapon(0);
    } else if (c === 'Digit2' || k === '2') {
      this.selectWeapon(1);
    } else if (c === 'Digit3' || k === '3') {
      this.selectWeapon(2);
    } else if (c === 'Digit4' || k === '4') {
      this.selectWeapon(3);
    } else if (c === 'Digit5' || k === '5') {
      this.selectWeapon(4);
    } else if (c === 'Digit6' || k === '6') {
      this.selectWeapon(5);
    } else if (
      c === 'Space' ||
      k === ' ' ||
      c === 'ShiftLeft' ||
      c === 'ShiftRight' ||
      c === 'KeyE' ||
      k === 'e'
    ) {
      // Dash
      this.triggerDash();
    } else if (c === 'KeyZ' || k === 'z' || c === 'F1') {
      this.powerSystem.applyPreset('BALANCED');
      soundSynth.playUiClick();
    } else if (c === 'KeyX' || k === 'x' || c === 'F2') {
      this.powerSystem.applyPreset('ATTACK');
      soundSynth.playUiClick();
    } else if (c === 'KeyC' || k === 'c' || c === 'F3') {
      this.powerSystem.applyPreset('EVASION');
      soundSynth.playUiClick();
    } else if (c === 'KeyV' || k === 'v' || c === 'F4') {
      this.powerSystem.applyPreset('DEFENSE');
      soundSynth.playUiClick();
    }
  }

  public handleKeyUp(code: string, key?: string) {
    if (code) this.keysDown.delete(code);
    if (key) {
      this.keysDown.delete(key);
      this.keysDown.delete(key.toLowerCase());
      this.keysDown.delete(key.toUpperCase());
    }
  }

  public clearKeys() {
    this.keysDown.clear();
    this.isMouseDown = false;
    this.virtualInputDir = { x: 0, y: 0 };
    this.virtualFiring = false;
    this.virtualAimDir = null;
  }

  public setVirtualInput(dir: Vector2D) {
    this.virtualInputDir = { ...dir };
  }

  public triggerFire(firing: boolean) {
    this.isMouseDown = firing;
  }

  public handleMouseMove(x: number, y: number) {
    this.mousePos = { x, y };
    onboardingSystem.onPlayerAimed();
  }

  public handleMouseDown(button: number) {
    if (button === 0) {
      this.isMouseDown = true;
    } else if (button === 2) {
      this.triggerDash();
    }
  }

  public handleMouseUp(button: number) {
    if (button === 0) {
      this.isMouseDown = false;
    }
  }

  public triggerDash() {
    if (this.mode !== 'PLAYING') return;
    const inputDir = this.getInputDirection();
    const dashed = this.player.dash(inputDir, this.powerSystem.allocation, this.particles);
    if (dashed) {
      this.player.heat = Math.min(100, this.player.heat + 8.0);
      soundSynth.playDash();
      this.screenShake = Math.max(this.screenShake, 3);
      onboardingSystem.onDash();
    }
  }

  public selectWeapon(index: number) {
    if (index >= 0 && index < this.availableWeapons.length) {
      this.activeWeaponIndex = index;
      soundSynth.playUiClick();
      this.tacticalAI.notify('weapon_switch', `WEAPON ENGAGED: ${this.availableWeapons[index].name}`, 'NORMAL', 1.0);
      onboardingSystem.onWeaponSwitch();
    }
  }

  public toggleOverclock() {
    if (this.mode !== 'PLAYING') return;

    if (this.player.isOverclocked) {
      // Manual Cancel
      this.player.isOverclocked = false;
      this.player.isSupercritical = false;
      soundSynth.playOverclockEnd();
      this.tacticalAI.addMessage('OVERCLOCK DISENGAGED. COOLING ACTIVE.', 'NORMAL');
      return;
    }

    // Secret Supercritical Check (Triggered at 95-99% heat)
    if (this.player.heat >= SECRETS_DATA.supercriticalWindow.minHeat && this.player.heat <= SECRETS_DATA.supercriticalWindow.maxHeat) {
      this.player.isSupercritical = true;
      this.player.supercriticalTimer = SECRETS_DATA.supercriticalWindow.bonusSeconds;
      this.player.heat = 0;
      if (!this.secretsUnlocked.includes('SUPERCRITICAL')) {
        this.secretsUnlocked.push('SUPERCRITICAL');
        saveSystem.recordSecretDiscovered('SUPERCRITICAL');
      }
      soundSynth.playOverclockStart(true);
      this.screenShake = 12;
      this.tacticalAI.addMessage('SUPERCRITICAL PLASMA CASCADE ACTIVE! ZERO HEAT CONSUMPTION!', 'SECRET');
      this.particles.push(new Particle(this.player.pos, { x: 0, y: 0 }, 1.5, '#39ff14', 80, 'shockwave'));
      this.aiCommentary.onOverclockActivated(true);
      achievementSystem.unlock('THERMAL_GAMBLER');
      if (this.demoSystem.isActive) {
        this.demoSystem.onOverclockTriggered(true);
      }
    } else {
      soundSynth.playOverclockStart(false);
      this.screenShake = 6;
      this.tacticalAI.addMessage('OVERCLOCK ENGAGED // +150% DMG // RAPID HEAT ACCUMULATION', 'WARN');
      this.aiCommentary.onOverclockActivated(false);
      achievementSystem.unlock('OVERCLOCK_ADDICT');
      if (this.demoSystem.isActive) {
        this.demoSystem.onOverclockTriggered(false);
      }
    }

    this.missionOverclockUsage++;
    this.player.isOverclocked = true;
    this.player.overclockTimer = this.player.baseOverclockDuration;
    onboardingSystem.onOverclockActivated();
  }

  public executeTerminalCommand(cmdStr: string): SecretCommandResult {
    const raw = cmdStr.trim().toLowerCase();

    if (raw === 'sudo overclock --unsafe') {
      this.player.isOverclocked = true;
      this.player.isSupercritical = true;
      this.player.supercriticalTimer = 20;
      this.player.heat = 0;
      saveSystem.recordSecretDiscovered('SUDO_UNSAFE');
      achievementSystem.unlock('ROOT_UNSAFE');
      this.aiCommentary.trigger('EASTER_EGG_UNSAFE', true);
      soundSynth.playSecretUnlocked();
      return {
        success: true,
        message: 'ROOT PRIVILEGES GRANTED: SAFETY INTERLOCKS BYPASSED [SUPERCRITICAL CASCADE 20s]',
      };
    }

    if (raw === 'ai.opinion') {
      saveSystem.recordSecretDiscovered('AI_OPINION');
      this.aiCommentary.trigger('EASTER_EGG_OPINION', true);
      soundSynth.playSecretUnlocked();
      return {
        success: true,
        message: 'TACTICAL AI SUBROUTINE: "I evaluate operator survival probability at precisely 3.8% — unless you embrace thermal risk."',
      };
    }

    if (raw === 'admin.bypass') {
      saveSystem.recordSecretDiscovered('ADMIN_BYPASS');
      this.aiCommentary.trigger('EASTER_EGG_ADMIN_BYPASS', true);
      soundSynth.playSecretUnlocked();
      return {
        success: true,
        message: 'FACILITY ARCHIVE LOG: "The Administrator is not an enemy. It is the compiler that deletes malfunctioning pilots."',
      };
    }

    if (raw === 'overclock.unlimit') {
      this.player.heat = 0;
      this.player.energy = this.player.maxEnergy;
      this.player.core = this.player.maxCore;
      this.player.shield = this.player.maxShield;
      if (!this.secretsUnlocked.includes('OVERCLOCK_UNLIMIT')) {
        this.secretsUnlocked.push('OVERCLOCK_UNLIMIT');
        saveSystem.recordSecretDiscovered('OVERCLOCK_UNLIMIT');
      }
      soundSynth.playSecretUnlocked();
      this.tacticalAI.addMessage('TERMINAL OVERRIDE: REACTOR FLUSH COMPLETE', 'SECRET');
      return { success: true, message: 'REACTOR RE-INITIALIZED: Heat 0°C, Energy/Shields 100%' };
    }

    if (raw === 'secret.colorway') {
      this.greenPhosphorColorway = !this.greenPhosphorColorway;
      saveSystem.recordSecretDiscovered('SECRET_COLORWAY');
      return {
        success: true,
        message: `TACTICAL COLORWAY: ${this.greenPhosphorColorway ? 'PHOSPHOR MATRIX' : 'CYAN MILITARY'}`,
      };
    }

    if (raw === 'lore.logs') {
      saveSystem.recordSecretDiscovered('LORE_LOGS');
      return {
        success: true,
        message: 'PROJECT OVERCLOCK: "VX-01 was engineered as an autonomous facility defense prototype..."',
      };
    }

    if (raw === 'help') {
      return {
        success: true,
        message: 'COMMANDS: help, sudo overclock --unsafe, ai.opinion, admin.bypass, overclock.unlimit, secret.colorway, lore.logs, clear',
      };
    }

    if (raw === 'clear') {
      return { success: true, message: 'CONSOLE PURGED.' };
    }

    return { success: false, message: `UNKNOWN DIRECTIVE: "${cmdStr}"` };
  }

  private hasKey(k: string): boolean {
    return this.keysDown.has(k) || this.keysDown.has(k.toLowerCase()) || this.keysDown.has(k.toUpperCase());
  }

  private getInputDirection(): Vector2D {
    let dx = this.virtualInputDir.x;
    let dy = this.virtualInputDir.y;

    if (this.hasKey('KeyW') || this.hasKey('w')) dy -= 1;
    if (this.hasKey('KeyS') || this.hasKey('s')) dy += 1;
    if (this.hasKey('KeyA') || this.hasKey('a')) dx -= 1;
    if (this.hasKey('KeyD') || this.hasKey('d')) dx += 1;

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      return { x: dx / len, y: dy / len };
    }
    return { x: 0, y: 0 };
  }

  private isFiring(): boolean {
    return (
      this.isMouseDown ||
      this.virtualFiring ||
      this.getDirectionalFireVector() !== null ||
      this.hasKey('KeyF') ||
      this.hasKey('f') ||
      this.hasKey('Enter') ||
      this.hasKey('Numpad0')
    );
  }

  // --- Main Engine Simulation Loop ---

  public update(dt: number) {
    // If paused, completely freeze all simulation and game timers
    if (this.mode === 'PAUSED' || this.mode === 'BOOT' || this.mode === 'MISSION_SELECT' || this.mode === 'BRIEFING') {
      // Only send telemetry update periodically so UI stays reactive
      this.telemetryTimer += dt;
      if (this.telemetryTimer > 0.04 && this.onTelemetryUpdate) {
        this.telemetryTimer = 0;
        this.onTelemetryUpdate(this.getTelemetrySnapshot());
      }
      return;
    }

    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - 12 * dt);
    }

    // Meltdown Failure Sequence
    if (this.mode === 'MELTDOWN') {
      this.meltdownSequenceTimer -= dt;
      this.screenShake = 15;
      if (Math.random() < 0.4) {
        this.particles.push(
          new Particle(
            this.player.pos,
            { x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 220 },
            0.4,
            '#ff2a4b',
            8,
            'smoke'
          )
        );
      }
      if (this.meltdownSequenceTimer <= 0) {
        this.mode = 'GAME_OVER';
        soundSynth.playExplosion(true);
      }
      this.updateParticles(dt);
      if (this.onTelemetryUpdate) this.onTelemetryUpdate(this.getTelemetrySnapshot());
      return;
    }

    // Objective Complete brief freeze & banner transition
    if (this.mode === 'OBJECTIVE_COMPLETE') {
      this.objectiveCompleteTimer -= dt;
      this.updateParticles(dt);
      // Sparkles of celebration
      if (Math.random() < 0.3) {
        this.particles.push(
          new Particle(
            {
              x: Math.random() * this.arenaWidth,
              y: Math.random() * this.arenaHeight,
            },
            { x: (Math.random() - 0.5) * 60, y: (Math.random() - 0.5) * 60 },
            0.6,
            '#00ff9f',
            4,
            'spark'
          )
        );
      }
      if (this.objectiveCompleteTimer <= 0) {
        this.finalizeMissionVictory();
      }
      if (this.onTelemetryUpdate) this.onTelemetryUpdate(this.getTelemetrySnapshot());
      return;
    }

    if (this.mode === 'PLAYING') {
      this.gameTimeSec += dt;
      this.missionTimeSec += dt;
      this.missionMaxHeat = Math.max(this.missionMaxHeat, this.player.heat);

      const inputDir = this.getInputDirection();

      // Directional Fire Aim updates
      const dirFire = this.getDirectionalFireVector();
      if (dirFire) {
        this.mousePos = {
          x: this.player.pos.x + dirFire.x * 300,
          y: this.player.pos.y + dirFire.y * 300,
        };
      }

      // Update Player
      this.player.update(
        dt,
        inputDir,
        this.mousePos,
        this.powerSystem.allocation,
        { width: this.arenaWidth, height: this.arenaHeight },
        this.particles
      );

      // Notify onboarding of player movement
      if (Math.abs(inputDir.x) > 0 || Math.abs(inputDir.y) > 0) {
        onboardingSystem.onPlayerMoved();
      }

      // Weapon Fire
      if (this.fireCooldownTimer > 0) this.fireCooldownTimer -= dt;
      if (this.isFiring()) {
        this.fireActiveWeapon();
      }

      // Heat Dissipation (Passive + Cooling Power multiplier)
      if (!this.player.isOverclocked && !this.isFiring()) {
        const coolingMult = this.powerSystem.getCoolingMultiplier();
        const baseDissipation = GAME_BALANCE.HEAT.NORMAL_COOLING_RATE;
        this.player.heat = Math.max(0, this.player.heat - baseDissipation * coolingMult * dt);
      }

      // Heat Overclock Generation
      if (this.player.isOverclocked && !this.player.isSupercritical) {
        const ocHeatRate = GAME_BALANCE.HEAT.OVERCLOCK_HEAT_RATE;
        this.player.heat = Math.min(100, this.player.heat + ocHeatRate * dt);
      }

      // Notify onboarding of heat changes
      onboardingSystem.onHeatChanged(this.player.heat);

      // Thermal Alarms & Meltdown Trigger
      this.handleThermalAlarms();

      // Combo Decay
      if (this.combo > 0) {
        this.comboTimer -= dt;
        if (this.comboTimer <= 0) {
          this.combo = 0;
          this.comboMultiplier = 1.0;
        }
      }

      // Spawn Wave Enemies
      this.updateSpawners(dt);

      // Update Projectiles
      this.updateProjectiles(dt);

      // Update Enemies
      this.updateEnemies(dt);

      // Update Boss (Mission 6)
      if (this.boss) {
        this.boss.update(
          dt,
          this.player,
          this.projectiles,
          this.particles,
          { width: this.arenaWidth, height: this.arenaHeight },
          () => {
            for (let i = 0; i < 3; i++) {
              const rx = Math.random() * (this.arenaWidth - 100) + 50;
              this.enemies.push(new Enemy('drone', rx, 80, i));
            }
          }
        );

        if (this.boss.dead) {
          this.score += 5000 * this.comboMultiplier;
          this.tacticalAI.addMessage('FACILITY ADMINISTRATOR ANNIHILATED!', 'SECRET');
          this.triggerObjectiveComplete();
        }
      }

      // Check Mission Completion status
      this.checkMissionStatus();
    }

    this.updateParticles(dt);

    // Send Telemetry to React
    this.telemetryTimer += dt;
    if (this.telemetryTimer > 0.04 && this.onTelemetryUpdate) {
      this.telemetryTimer = 0;
      this.onTelemetryUpdate(this.getTelemetrySnapshot());
    }
  }

  private handleThermalAlarms() {
    if (this.player.heat >= 100) {
      this.mode = 'MELTDOWN';
      this.meltdownSequenceTimer = 1.0;
      soundSynth.playMeltdownSiren();
      this.tacticalAI.addMessage('CRITICAL FAILURE: REACTOR CONTAINMENT BREACH (100% HEAT)', 'CRIT');
      return;
    }

    if (this.player.heat >= 95) {
      this.tacticalAI.notify('meltdown_warn', 'MELTDOWN IMMINENT (95%+). OVERCLOCK CAN ENGAGE SUPERCRITICAL!', 'CRIT', 1.8);
      soundSynth.playCriticalAlarm();
    } else if (this.player.heat >= 85) {
      this.tacticalAI.notify('crit_heat', 'THERMAL WARNING: CORE AT 85% STABILITY LIMIT', 'CRIT', 3.0);
      soundSynth.playCriticalAlarm();
    } else if (this.player.heat >= 70) {
      this.tacticalAI.notify('warn_heat', 'CAUTION: HEAT LEVEL EXCEEDS 70%. REROUTE TO COOLING.', 'WARN', 4.5);
      soundSynth.playWarningBeep();
    }
  }

  private fireActiveWeapon() {
    const active = this.availableWeapons[this.activeWeaponIndex];
    if (!active || this.fireCooldownTimer > 0) return;

    const stats = this.calculateEffectiveWeaponStats(active);
    const energyCost = stats.energyPerShot;
    if (this.player.energy < energyCost) {
      this.tacticalAI.notify('energy_low', 'ENERGY RESERVES DEPLETED', 'WARN', 2.0);
      return;
    }

    this.player.energy -= energyCost;
    const heatMult = this.powerSystem.getWeaponHeatMultiplier();
    if (!this.player.isSupercritical) {
      const generatedHeat = stats.heatPerShot * heatMult * GAME_BALANCE.HEAT.HEAT_GENERATION_MULTIPLIER;
      this.player.heat = Math.min(100, this.player.heat + generatedHeat);
    }

    const ocMult = this.player.isOverclocked ? 1.5 : 1.0;
    const pwrMult = this.powerSystem.getWeaponDamageMultiplier();
    const finalDamage = Math.round(stats.damage * ocMult * pwrMult);

    const speed = stats.projectileSpeed * (this.player.isOverclocked ? 1.4 : 1.0);
    const dx = this.mousePos.x - this.player.pos.x;
    const dy = this.mousePos.y - this.player.pos.y;
    const len = Math.hypot(dx, dy) || 1;
    const normX = dx / len;
    const normY = dy / len;

    const recoil = active.heatPerShot > 15 ? 0.3 : 0.1;
    this.player.vel.x -= normX * recoil * 15;
    this.player.vel.y -= normY * recoil * 15;

    soundSynth.playShoot(active.id, this.player.isOverclocked);

    if (active.beam || active.id === 'railgun' || active.id === 'cryo_beam') {
      this.projectiles.push(
        new Projectile({
          pos: { ...this.player.pos },
          vel: { x: normX * speed, y: normY * speed },
          damage: finalDamage,
          radius: 4,
          color: active.color,
          isPlayer: true,
          piercing: true,
          life: 0.8,
        })
      );
    } else if (active.homing || active.id === 'missiles') {
      const spread = active.spreadAngle || 0.3;
      const count = active.burstCount || 3;
      for (let i = 0; i < count; i++) {
        const offsetAngle = (i - (count - 1) / 2) * spread;
        const cos = Math.cos(offsetAngle);
        const sin = Math.sin(offsetAngle);
        const mdx = normX * cos - normY * sin;
        const mdy = normX * sin + normY * cos;
        this.projectiles.push(
          new Projectile({
            pos: { ...this.player.pos },
            vel: { x: mdx * speed, y: mdy * speed },
            damage: finalDamage,
            radius: 5,
            color: active.color,
            isPlayer: true,
            homing: true,
            life: 2.5,
          })
        );
      }
    } else if (active.burstCount && active.burstCount > 1 || active.id === 'scatter_flak') {
      const spread = active.spreadAngle || 0.4;
      const count = active.burstCount || 5;
      for (let i = 0; i < count; i++) {
        const offsetAngle = (i - (count - 1) / 2) * (spread / (count - 1 || 1));
        const cos = Math.cos(offsetAngle);
        const sin = Math.sin(offsetAngle);
        const mdx = normX * cos - normY * sin;
        const mdy = normX * sin + normY * cos;
        this.projectiles.push(
          new Projectile({
            pos: { ...this.player.pos },
            vel: { x: mdx * speed, y: mdy * speed },
            damage: finalDamage,
            radius: 3.5,
            color: active.color,
            isPlayer: true,
            life: 1.0,
          })
        );
      }
    } else if (active.areaEffect || active.id === 'emp') {
      this.projectiles.push(
        new Projectile({
          pos: { ...this.player.pos },
          vel: { x: normX * (speed * 0.5), y: normY * (speed * 0.5) },
          damage: finalDamage,
          radius: 28,
          color: active.color,
          isPlayer: true,
          piercing: true,
          life: 0.6,
        })
      );
      this.particles.push(new Particle(this.player.pos, { x: 0, y: 0 }, 0.4, '#a855f7', 35, 'shockwave'));
    } else {
      this.projectiles.push(
        new Projectile({
          pos: { ...this.player.pos },
          vel: { x: normX * speed, y: normY * speed },
          damage: finalDamage,
          radius: 5,
          color: active.color,
          isPlayer: true,
          life: 1.8,
        })
      );
    }

    const fireRatePwr = this.powerSystem.getWeaponFireRateMultiplier();
    const ocFireRate = this.player.isOverclocked ? 2.0 : 1.0;
    this.fireCooldownTimer = 1.0 / (stats.fireRate * fireRatePwr * ocFireRate);
    onboardingSystem.onPlayerFired();
  }

  private updateSpawners(dt: number) {
    if (this.enemiesToSpawn.length === 0) return;

    this.waveSpawnTimer -= dt;
    if (this.waveSpawnTimer <= 0) {
      this.waveSpawnTimer = GAME_BALANCE.ENEMY_GENERAL.WAVE_SPAWN_INTERVAL;
      const type = this.enemiesToSpawn.shift();
      if (!type) return;

      const edge = Math.floor(Math.random() * 4);
      let sx = 0;
      let sy = 0;
      const pad = 40;

      if (edge === 0) {
        sx = Math.random() * this.arenaWidth;
        sy = pad;
      } else if (edge === 1) {
        sx = this.arenaWidth - pad;
        sy = Math.random() * this.arenaHeight;
      } else if (edge === 2) {
        sx = Math.random() * this.arenaWidth;
        sy = this.arenaHeight - pad;
      } else {
        sx = pad;
        sy = Math.random() * this.arenaHeight;
      }

      this.enemies.push(new Enemy(type, sx, sy, this.enemies.length));
    }
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const closestEnemy = this.enemies[0]?.pos;
      p.update(
        dt,
        closestEnemy,
        this.particles,
        { width: this.arenaWidth, height: this.arenaHeight }
      );

      // Bounds check
      if (
        p.pos.x < 0 ||
        p.pos.x > this.arenaWidth ||
        p.pos.y < 0 ||
        p.pos.y > this.arenaHeight ||
        p.life <= 0
      ) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Player projectiles hit Enemies or Boss
      if (p.isPlayer) {
        // Check Boss collision
        if (this.boss && !this.boss.dead) {
          const bdist = Math.hypot(p.pos.x - this.boss.pos.x, p.pos.y - this.boss.pos.y);
          if (bdist < this.boss.radius + p.radius + 12) {
            this.boss.takeDamage(p.damage, this.particles, this.player.isOverclocked);
            this.missionDamageDealt += p.damage;
            this.totalDamageDealt += p.damage;
            soundSynth.playEnemyHit();
            if (!p.piercing) {
              this.projectiles.splice(i, 1);
              continue;
            }
          }
        }

        // Check Enemy collision
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const e = this.enemies[j];
          const dist = Math.hypot(p.pos.x - e.pos.x, p.pos.y - e.pos.y);
          if (dist < e.radius + p.radius) {
            const killed = e.takeDamage(p.damage, this.particles);
            this.missionDamageDealt += p.damage;
            this.totalDamageDealt += p.damage;
            soundSynth.playEnemyHit();

            if (killed) {
              this.handleEnemyKilled(e);
            }

            if (!p.piercing) {
              this.projectiles.splice(i, 1);
              break;
            }
          }
        }
      } else {
        // Hostile projectiles hit Player
        const pdist = Math.hypot(p.pos.x - this.player.pos.x, p.pos.y - this.player.pos.y);
        if (pdist < this.player.radius + p.radius) {
          if (!this.player.isDashing) {
            const incomingDmg = Math.round(p.damage * GAME_BALANCE.ENEMY_GENERAL.GLOBAL_DAMAGE_MULTIPLIER);
            const died = this.player.takeDamage(incomingDmg, this.particles);
            this.screenShake = 8;
            soundSynth.playPlayerDamage();

            if (died) {
              this.mode = 'GAME_OVER';
              soundSynth.playExplosion(true);
            }
          }
          this.projectiles.splice(i, 1);
        }
      }
    }
  }

  private handleEnemyKilled(e: Enemy) {
    this.kills++;
    this.missionKills++;
    if (this.player.isOverclocked) this.overclockKills++;

    // AI Commentary & Achievements
    this.aiCommentary.onEnemyKilled(this.kills === 1);
    achievementSystem.unlock('FIRST_KILL');
    onboardingSystem.onEnemyKilled();

    if (this.combo >= 15) {
      achievementSystem.unlock('COMBO_MASTER');
    }

    if (this.player.isOverclocked && this.player.heat >= 90) {
      achievementSystem.unlock('WORTH_IT');
    }

    if (this.demoSystem.isActive) {
      this.demoSystem.onEnemyKilled();
    }

    // First Kill visual fanfare
    if (this.kills === 1) {
      this.screenShake = 10;
      this.particles.push(
        new Particle(e.pos, { x: 0, y: 0 }, 1.2, '#00ff9f', 60, 'shockwave')
      );
      this.tacticalAI.addMessage('FIRST TARGET NEUTRALIZED // COMBAT TELEMETRY SYNCHRONIZED', 'SECRET');
    }

    // Track specific objective progress
    const mission = MISSIONS[this.currentMissionIndex];
    if (mission) {
      if (mission.id === 1 && e.type === 'drone') this.missionSpecificKills++;
      else if (mission.id === 2 && e.type === 'charger') this.missionSpecificKills++;
      else if (mission.id === 3 && e.type === 'turret') this.missionSpecificKills++;
      else if (mission.id === 4 && e.type === 'leech') this.missionSpecificKills++;
      else if (mission.id === 5 && e.type === 'hacker') this.missionSpecificKills++;
    }

    // Combo system
    this.combo++;
    this.missionMaxCombo = Math.max(this.missionMaxCombo, this.combo);
    this.comboTimer = 2.8;
    this.comboMultiplier = Math.min(10.0, 1.0 + (this.combo - 1) * 0.2);

    const ocBonus = this.player.isOverclocked ? 1.5 : 1.0;
    const pts = Math.round(e.scoreValue * this.comboMultiplier * ocBonus);
    this.score += pts;

    // Award cyber credits per kill
    const creds = Math.round(e.scoreValue * 0.15);
    this.cyberCredits += creds;

    soundSynth.playEnemyExplosion();

    // Death explosion particles
    for (let k = 0; k < 14; k++) {
      this.particles.push(
        new Particle(
          e.pos,
          { x: (Math.random() - 0.5) * 220, y: (Math.random() - 0.5) * 220 },
          0.4 + Math.random() * 0.4,
          Math.random() > 0.5 ? '#ffb700' : '#ff2a4b',
          4 + Math.random() * 4,
          'spark'
        )
      );
    }
  }

  private updateEnemies(dt: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.dead) {
        this.enemies.splice(i, 1);
        continue;
      }

      e.update(
        dt,
        this.player,
        this.projectiles,
        this.particles,
        { width: this.arenaWidth, height: this.arenaHeight },
        this.enemies,
        this.activeEndlessMutations
      );

      // Contact damage with player
      const dist = Math.hypot(e.pos.x - this.player.pos.x, e.pos.y - this.player.pos.y);
      if (dist < e.radius + this.player.radius) {
        if (!this.player.isDashing) {
          const died = this.player.takeDamage(GAME_BALANCE.ENEMY_GENERAL.CONTACT_DAMAGE, this.particles);
          this.screenShake = 7;
          soundSynth.playPlayerDamage();

          if (died) {
            this.mode = 'GAME_OVER';
            soundSynth.playExplosion(true);
          }
        }
      }
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.update(dt);
      if (pt.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  // --- Mission Completion & Rewards ---

  private checkMissionStatus() {
    if (this.mode !== 'PLAYING') return;

    if (this.isEndlessMode) {
      if (this.enemies.length === 0 && this.enemiesToSpawn.length === 0) {
        this.endlessWaveNumber++;
        saveSystem.recordEndlessScore(this.score, this.endlessWaveNumber);
        this.triggerEndlessMutationSelection();
      }
      return;
    }

    const mission = MISSIONS[this.currentMissionIndex];
    if (!mission || mission.bossMission) return;

    if (this.enemies.length === 0 && this.enemiesToSpawn.length === 0) {
      if (this.currentWaveIndex + 1 < mission.waves.length) {
        this.setupWave(this.currentWaveIndex + 1);
      } else {
        // Entire mission completed!
        this.triggerObjectiveComplete();
      }
    }
  }

  private triggerObjectiveComplete() {
    this.mode = 'OBJECTIVE_COMPLETE';
    this.objectiveCompleteTimer = 1.2;
    soundSynth.playObjectiveComplete();
    this.tacticalAI.addMessage('OBJECTIVE COMPLETE // PROTOCOL FINALIZED', 'SECRET');

    // Clear hostile bullets to make arena safe
    this.projectiles = this.projectiles.filter((p) => p.isPlayer);
  }

  private finalizeMissionVictory() {
    const mission = MISSIONS[this.currentMissionIndex] || MISSIONS[0];

    // Compute Rating
    let rating: 'S' | 'A' | 'B' | 'C' = 'C';
    if (this.missionTimeSec <= 45 && this.missionMaxHeat < 95 && this.missionMaxCombo >= 5) {
      rating = 'S';
    } else if (this.missionTimeSec <= 85 && this.missionMaxHeat < 98) {
      rating = 'A';
    } else if (this.missionTimeSec <= 130) {
      rating = 'B';
    }

    // Award bonus score and credits
    this.score += mission.rewardScore;
    this.cyberCredits += mission.rewardCredits;

    // Save to persistent storage
    const { newlyUnlockedMission, newlyUnlockedEndless } = saveSystem.completeMission(
      mission.id,
      this.score,
      rating,
      mission.rewardCredits,
      mission.unlocksWeapon
    );

    if (mission.unlocksWeapon && !this.availableWeapons.some((w) => w.id === mission.unlocksWeapon)) {
      const def = WEAPON_REGISTRY[mission.unlocksWeapon];
      if (def) this.availableWeapons.push(def);
    }

    this.lastMissionStats = {
      missionId: mission.id,
      missionCode: mission.code,
      missionTitle: mission.title,
      timeSec: this.missionTimeSec,
      kills: this.missionKills,
      damageDealt: this.missionDamageDealt,
      maxCombo: this.missionMaxCombo,
      maxHeat: this.missionMaxHeat,
      overclockUsage: this.missionOverclockUsage,
      rating,
      creditsEarned: mission.rewardCredits,
      scoreEarned: mission.rewardScore,
      unlockedWeapon: mission.rewardModule,
    };

    soundSynth.playMissionComplete();

    if (mission.bossMission || mission.id === 6) {
      this.mode = 'CAMPAIGN_VICTORY';
    } else {
      this.mode = 'MISSION_COMPLETE';
    }
  }

  public proceedToUpgrades() {
    this.triggerUpgradeSelection();
  }

  private triggerUpgradeSelection() {
    this.mode = 'UPGRADE_SELECT';
    soundSynth.playUpgradeSelected();
    const available = ALL_UPGRADES.filter((u) => u.appliedCount < 2);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    this.currentUpgradeChoices = shuffled.slice(0, 3);
  }

  private triggerEndlessMutationSelection() {
    this.mode = 'UPGRADE_SELECT';
    soundSynth.playUpgradeSelected();
    const unapplied = ALL_ENDLESS_MUTATIONS.filter(
      (m) => !this.activeEndlessMutations.some((am) => am.id === m.id)
    );
    const pool = unapplied.length >= 3 ? unapplied : ALL_ENDLESS_MUTATIONS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    this.currentMutationChoices = shuffled.slice(0, 3);
  }

  public selectEndlessMutation(mutation: EndlessMutationDef) {
    this.activeEndlessMutations.push(mutation);
    this.tacticalAI.addMessage(`ENDLESS MUTATION ACTIVE: ${mutation.name}`, 'WARN');
    this.mode = 'PLAYING';
    this.setupEndlessWave(this.endlessWaveNumber);
  }

  public applyUpgrade(upgrade: UpgradeDef) {
    upgrade.appliedCount++;
    this.activeUpgrades.push(upgrade);

    if (upgrade.id === 'cryo_core') {
      // Cryo cooling passive
    } else if (upgrade.id === 'blood_reactor') {
      this.player.maxCore = Math.round(this.player.maxCore * 0.85);
      this.player.core = Math.min(this.player.core, this.player.maxCore);
    } else if (upgrade.id === 'overclock_amp') {
      this.player.baseOverclockDuration += 2.5;
    } else if (upgrade.id === 'reactive_shield') {
      this.player.maxShield += 30;
      this.player.shield = this.player.maxShield;
    }

    this.tacticalAI.addMessage(`UPGRADE INSTALLED: ${upgrade.name}`, 'NORMAL');
    soundSynth.playUpgradeSelected();

    // Advance to Next Mission Briefing or Mission Select
    const nextIdx = this.currentMissionIndex + 1;
    if (nextIdx < MISSIONS.length) {
      this.showBriefing(nextIdx);
    } else {
      this.showMissionSelect();
    }
  }

  public selectUpgrade(upgrade: UpgradeDef) {
    this.applyUpgrade(upgrade);
  }

  public retryMission() {
    this.startMission(this.currentMissionIndex);
  }

  public quitToMissionSelect() {
    this.showMissionSelect();
  }

  public restart() {
    this.player.reset(this.arenaWidth / 2, this.arenaHeight / 2);
    this.score = 0;
    this.combo = 0;
    this.comboMultiplier = 1.0;
    this.kills = 0;
    this.overclockKills = 0;
    this.gameTimeSec = 0;
    this.activeUpgrades = [];
    this.isEndlessMode = false;
    this.endlessWaveNumber = 1;
    this.activeEndlessMutations = [];
    this.activeWeaponIndex = 0;
    this.powerSystem = new PowerSystem();
    this.tacticalAI.clear();
    this.startMission(0);
  }

  public restartGame() {
    this.restart();
  }

  public startEndlessMode() {
    this.player.reset(this.arenaWidth / 2, this.arenaHeight / 2);
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.boss = null;
    this.clearKeys();
    this.mode = 'PLAYING';
    this.isEndlessMode = true;
    this.endlessWaveNumber = 1;
    this.activeEndlessMutations = [];
    this.tacticalAI.clear();
    this.tacticalAI.addMessage('ENDLESS SIMULATION PROTOCOL ENGAGED // MAXIMUM DANGER', 'SECRET');
    this.setupEndlessWave(1);
  }

  public setupEndlessWave(waveNum: number) {
    this.enemiesToSpawn = [];
    const baseCount = 6 + waveNum * 3;
    let densityMult = 1.0;
    for (const m of this.activeEndlessMutations) {
      if (m.effects.swarmDensityMult) densityMult *= m.effects.swarmDensityMult;
    }
    const finalCount = Math.round(baseCount * densityMult);

    const enemyPool: EnemyType[] = ['drone', 'drone', 'charger', 'leech'];
    if (waveNum >= 2) enemyPool.push('turret');
    if (waveNum >= 3) enemyPool.push('hacker');

    for (let i = 0; i < finalCount; i++) {
      const chosen = enemyPool[Math.floor(Math.random() * enemyPool.length)];
      this.enemiesToSpawn.push(chosen);
    }
    this.waveSpawnTimer = 0.4;
    this.tacticalAI.addMessage(`ENDLESS SECTOR WAVE ${waveNum} INCOMING [${finalCount} HOSTILES]`, 'NORMAL');
  }

  // --- Rendering ---

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // Screen Shake Offset
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake * 2;
      const sy = (Math.random() - 0.5) * this.screenShake * 2;
      ctx.translate(sx, sy);
    }

    // Tactical Military Grid Backdrop
    const bgCol = this.greenPhosphorColorway ? '#040d06' : '#070a0f';
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, this.arenaWidth, this.arenaHeight);

    // Grid lines
    ctx.strokeStyle = this.greenPhosphorColorway ? 'rgba(57, 255, 20, 0.05)' : 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= this.arenaWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.arenaHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= this.arenaHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.arenaWidth, y);
      ctx.stroke();
    }

    // Arena Perimeter Wall
    ctx.strokeStyle = this.greenPhosphorColorway ? '#39ff14' : (this.player.isHacked ? '#a855f7' : '#00f0ff');
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, this.arenaWidth - 20, this.arenaHeight - 20);

    // Draw Particles (lower layer)
    this.particles.forEach((p) => p.draw(ctx));

    // Draw Projectiles
    this.projectiles.forEach((p) => p.draw(ctx));

    // Draw Enemies
    this.enemies.forEach((e) => e.draw(ctx, this.player.pos));

    // Draw Boss
    if (this.boss && !this.boss.dead) {
      this.boss.draw(ctx);
    }

    // Draw Player
    if (this.mode !== 'GAME_OVER') {
      this.player.draw(ctx);
    }

    // Draw Crosshair at mouse
    ctx.save();
    ctx.strokeStyle = this.player.isOverclocked ? '#ff2a4b' : '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.mousePos.x, this.mousePos.y, 8, 0, Math.PI * 2);
    ctx.moveTo(this.mousePos.x - 12, this.mousePos.y);
    ctx.lineTo(this.mousePos.x + 12, this.mousePos.y);
    ctx.moveTo(this.mousePos.x, this.mousePos.y - 12);
    ctx.lineTo(this.mousePos.x, this.mousePos.y + 12);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // --- Telemetry Snapshot Generator ---

  public getTelemetrySnapshot(): TelemetrySnapshot {
    let heatState: TelemetrySnapshot['heatState'] = 'NOMINAL';
    if (this.player.heat >= 100) heatState = 'MELTDOWN';
    else if (this.player.heat >= 95) heatState = 'MELTDOWN_IMMINENT';
    else if (this.player.heat >= 85) heatState = 'CRITICAL';
    else if (this.player.heat >= 70) heatState = 'WARNING';

    const mission = MISSIONS[this.currentMissionIndex] || MISSIONS[0];
    const activeWpn = this.availableWeapons[this.activeWeaponIndex] || this.availableWeapons[0];
    const activeCalculated = this.calculateEffectiveWeaponStats(activeWpn);

    const saved = saveSystem.getState();

    // Determine Objective Progress
    let objCurrent = this.missionSpecificKills;
    let objTotal = this.missionSpecificTarget || 1;
    let objLabel = 'HOSTILES REMAINING';

    if (this.isEndlessMode) {
      objCurrent = this.enemies.length + this.enemiesToSpawn.length;
      objTotal = objCurrent;
      objLabel = 'HOSTILES REMAINING';
    } else if (mission.bossMission && this.boss) {
      const destroyedSubs = this.boss.subsystems.filter((s) => s.destroyed).length;
      objCurrent = destroyedSubs;
      objTotal = 4;
      objLabel = 'SUBSYSTEMS DESTROYED';
    } else {
      if (mission.id === 1) objLabel = 'CALIBRATION DRONES';
      else if (mission.id === 2) objLabel = 'CHARGERS ELIMINATED';
      else if (mission.id === 3) objLabel = 'FORTIFIED TURRETS';
      else if (mission.id === 4) objLabel = 'ENERGY LEECHES';
      else if (mission.id === 5) objLabel = 'CYBER HACKERS';
    }

    const isComplete = this.mode === 'OBJECTIVE_COMPLETE' || this.mode === 'MISSION_COMPLETE' || this.mode === 'CAMPAIGN_VICTORY';

    return {
      core: this.player.core,
      maxCore: this.player.maxCore,
      shield: this.player.shield,
      maxShield: this.player.maxShield,
      energy: this.player.energy,
      maxEnergy: this.player.maxEnergy,
      heat: this.player.heat,
      heatState,
      isOverclocked: this.player.isOverclocked,
      overclockTimeLeft: Math.max(0, this.player.overclockTimer),
      overclockDuration: this.player.baseOverclockDuration,
      isSupercritical: this.player.isSupercritical,
      isHacked: this.player.isHacked,
      hackDurationLeft: Math.max(0, this.player.hackTimer),
      hackInterferenceTarget: this.player.isHacked ? 'WEAPONS' : undefined,
      isPaused: this.mode === 'PAUSED',
      currentMode: this.mode,
      power: { ...this.powerSystem.allocation },
      activeWeapon: activeWpn,
      availableWeapons: [...this.availableWeapons],
      weaponModConfigs: { ...this.weaponModConfigs },
      activeWeaponCalculatedStats: activeCalculated,
      score: this.score,
      cyberCredits: this.cyberCredits,
      combo: this.combo,
      comboMultiplier: this.comboMultiplier,
      missionNumber: this.isEndlessMode ? this.endlessWaveNumber : mission.id,
      missionCode: this.isEndlessMode ? 'ENDLESS' : mission.code,
      missionName: this.isEndlessMode ? 'SIMULATION: ENDLESS OVERDRIVE' : mission.title,
      missionArena: this.isEndlessMode ? 'UNBOUNDED COMBAT SECTOR' : mission.arena,
      missionWave: this.isEndlessMode ? this.endlessWaveNumber : this.currentWaveIndex + 1,
      totalWaves: this.isEndlessMode ? 999 : mission.waves.length,
      enemiesRemaining: this.enemies.length + this.enemiesToSpawn.length,
      primaryObjectiveText: this.isEndlessMode ? 'SURVIVE ESCALATING WAVES & SECTOR MUTATIONS' : mission.primaryObjective,
      objectiveProgress: {
        current: objCurrent,
        total: objTotal,
        label: objLabel,
        isComplete,
        objectiveCompleteTimer: this.objectiveCompleteTimer,
      },
      lastMissionStats: this.lastMissionStats,
      tacticalLog: this.tacticalAI.getMessages(),
      kills: this.kills,
      overclockKills: this.overclockKills,
      gameTimeSec: this.gameTimeSec,
      damageDealt: this.totalDamageDealt,
      activeUpgrades: [...this.activeUpgrades],
      secretsUnlocked: [...this.secretsUnlocked],
      unlockedMissions: [...saved.unlockedMissions],
      completedMissions: [...saved.completedMissions],
      endlessUnlocked: saved.endlessUnlocked,
      endlessHighScore: saved.endlessHighScore,
      endlessBestWave: saved.endlessBestWave,
      missionRatings: { ...saved.missionRatings },
      isEndlessMode: this.isEndlessMode,
      endlessWaveNumber: this.endlessWaveNumber,
      activeMutations: [...this.activeEndlessMutations],
      isDemoActive: this.demoSystem.isActive,
      demoStep: this.demoSystem.getCurrentStep()
        ? {
            id: this.demoSystem.getCurrentStep()!.id,
            stepNumber: this.demoSystem.getCurrentStep()!.stepNumber,
            totalSteps: this.demoSystem.getCurrentStep()!.totalSteps,
            title: this.demoSystem.getCurrentStep()!.title,
            description: this.demoSystem.getCurrentStep()!.description,
            actionPrompt: this.demoSystem.getCurrentStep()!.actionPrompt,
            progress: this.demoSystem.getCurrentStep()!.progress,
          }
        : undefined,
      activeProtocols: [...this.activeProtocols],
      bossHp: this.boss
        ? {
            current: this.boss.hp,
            max: this.boss.maxHp,
            phase: this.boss.phase,
            subsystems: this.boss.subsystems.map((s) => ({ ...s })),
          }
        : undefined,
    };
  }

  public startDemoMode() {
    this.player.reset(this.arenaWidth / 2 || 500, this.arenaHeight / 2 || 350);
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.boss = null;
    this.clearKeys();
    this.mode = 'PLAYING';
    this.isEndlessMode = false;
    this.demoSystem.startDemo();
    this.aiCommentary.trigger('DEMO_MODE_START');
    this.tacticalAI.clear();
    this.tacticalAI.addMessage('DEMO SHOWCASE ENGAGED // JUDGE EVALUATION MATRIX ACTIVE', 'SECRET');
    this.emitTelemetry();
  }

  /** Initialize arena for the onboarding tutorial — lightweight setup, no mission data. */
  public startTutorialArena() {
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.boss = null;
    this.isEndlessMode = false;
    this.clearKeys();

    // Reset mission stats so telemetry stays clean
    this.missionTimeSec = 0;
    this.missionKills = 0;
    this.missionDamageDealt = 0;
    this.missionMaxCombo = 0;
    this.missionMaxHeat = 0;
    this.missionOverclockUsage = 0;
    this.missionSpecificKills = 0;
    this.missionSpecificTarget = 0;
    this.objectiveCompleteTimer = 0;
    this.enemiesToSpawn = [];
    this.waveSpawnTimer = 0;

    // Reset player to arena center
    this.player.reset(this.arenaWidth / 2 || 500, this.arenaHeight / 2 || 350);

    this.mode = 'PLAYING';
    this.emitTelemetry();
  }
}
