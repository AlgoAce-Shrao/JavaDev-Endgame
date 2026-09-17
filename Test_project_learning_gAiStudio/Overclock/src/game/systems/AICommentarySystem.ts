import { AI_DIALOGUE_REGISTRY, AIDialogueCategory } from '../data/aiDialogue';
import { TacticalAI } from './TacticalAI';

export class AICommentarySystem {
  private tacticalAI: TacticalAI;
  private lastTriggerTimes: Record<string, number> = {};
  private categoryIndices: Record<string, number> = {};

  // Behavioral Trackers
  public sessionMeltdownDeaths: number = 0;
  public missionOverclockCount: number = 0;
  public totalWallCollisions: number = 0;
  public peakHeatThisRun: number = 0;
  public highHeatSurviveCount: number = 0;
  public idleTimerSec: number = 0;
  public timeWithoutOverclockSec: number = 0;
  public hasTriggeredFirstKill: boolean = false;
  public weaponUsage: Record<string, number> = {
    plasma: 0,
    railgun: 0,
    missiles: 0,
    emp: 0,
  };

  constructor(tacticalAI: TacticalAI) {
    this.tacticalAI = tacticalAI;
  }

  public trigger(category: AIDialogueCategory, force: boolean = false) {
    const lines = AI_DIALOGUE_REGISTRY[category];
    if (!lines || lines.length === 0) return;

    // Pick round-robin line to prevent repetition
    const idx = (this.categoryIndices[category] || 0) % lines.length;
    this.categoryIndices[category] = idx + 1;
    const line = lines[idx];

    const now = Date.now();
    const last = this.lastTriggerTimes[line.cooldownKey] || 0;
    if (force || now - last > line.cooldownSec * 1000) {
      this.lastTriggerTimes[line.cooldownKey] = now;
      this.tacticalAI.addMessage(line.text, line.level);
    }
  }

  public update(dt: number, heat: number, isOverclocked: boolean, isMoving: boolean, isFiring: boolean, inCombat: boolean) {
    if (!inCombat) return;

    // Track peak heat
    if (heat > this.peakHeatThisRun) {
      this.peakHeatThisRun = heat;
    }

    // Heat commentary
    if (heat >= 92 && !isOverclocked) {
      this.trigger('HIGH_HEAT');
    }

    // Near-meltdown survival tracking
    if (heat >= 98.5 && !isOverclocked) {
      this.highHeatSurviveCount++;
      if (this.highHeatSurviveCount === 1) {
        this.trigger('HEAT_CRITICAL_SURVIVE');
      }
    }

    // Idle monitoring
    if (!isMoving && !isFiring) {
      this.idleTimerSec += dt;
      if (this.idleTimerSec > 14) {
        this.trigger('IDLE_PROMPT');
        this.idleTimerSec = 0;
      }
    } else {
      this.idleTimerSec = 0;
    }

    // Passive player monitor
    if (!isOverclocked) {
      this.timeWithoutOverclockSec += dt;
      if (this.timeWithoutOverclockSec > 50 && inCombat) {
        this.trigger('NO_OVERCLOCK_PASSIVE');
        this.timeWithoutOverclockSec = 0;
      }
    } else {
      this.timeWithoutOverclockSec = 0;
    }
  }

  public onOverclockActivated(isSupercritical: boolean) {
    this.missionOverclockCount++;
    this.timeWithoutOverclockSec = 0;

    if (isSupercritical) {
      this.trigger('SUPERCRITICAL', true);
    } else if (this.missionOverclockCount >= 4) {
      this.trigger('REPEATED_OVERCLOCK');
    } else {
      this.trigger('OVERCLOCK_ACTIVATE');
    }
  }

  public onPlayerDied(fromMeltdown: boolean) {
    if (fromMeltdown) {
      this.sessionMeltdownDeaths++;
      if (this.sessionMeltdownDeaths >= 2) {
        this.trigger('REPEATED_MELTDOWN', true);
      } else {
        this.trigger('MELTDOWN', true);
      }
    }
  }

  public onWallHit() {
    this.totalWallCollisions++;
    if (this.totalWallCollisions % 3 === 0) {
      this.trigger('WALL_COLLISION');
    }
  }

  public onEnemyKilled(firstEver: boolean) {
    if (firstEver && !this.hasTriggeredFirstKill) {
      this.hasTriggeredFirstKill = true;
      this.trigger('FIRST_KILL', true);
    }
  }

  public onWeaponFired(weaponId: string) {
    this.weaponUsage[weaponId] = (this.weaponUsage[weaponId] || 0) + 1;
    const total = Object.values(this.weaponUsage).reduce((a, b) => a + b, 0);

    // Comment on strong bias after 40 shots
    if (total > 40 && total % 30 === 0) {
      if (this.weaponUsage['plasma'] / total > 0.8) {
        this.trigger('WEAPON_PLASMA_FAVORITE');
      } else if (this.weaponUsage['railgun'] / total > 0.8) {
        this.trigger('WEAPON_RAILGUN_FAVORITE');
      } else if (this.weaponUsage['missiles'] / total > 0.8) {
        this.trigger('WEAPON_MISSILE_FAVORITE');
      } else if (this.weaponUsage['emp'] / total > 0.8) {
        this.trigger('WEAPON_EMP_FAVORITE');
      }
    }
  }

  public resetMissionTrackers() {
    this.missionOverclockCount = 0;
    this.timeWithoutOverclockSec = 0;
    this.idleTimerSec = 0;
    this.peakHeatThisRun = 0;
    this.highHeatSurviveCount = 0;
  }
}
