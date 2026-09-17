import { OperatorStats, PlaystyleArchetype } from '../types';
import { saveSystem } from './SaveSystem';

export class OperatorProfileSystem {
  private static instance: OperatorProfileSystem;

  private constructor() {}

  public static getInstance(): OperatorProfileSystem {
    if (!OperatorProfileSystem.instance) {
      OperatorProfileSystem.instance = new OperatorProfileSystem();
    }
    return OperatorProfileSystem.instance;
  }

  public getStats(): OperatorStats {
    const state = saveSystem.getState();
    return (
      state.operatorStats || {
        totalRuns: 0,
        totalKills: 0,
        totalMeltdowns: 0,
        totalOverclockTimeSec: 0,
        highestHeatReached: 0,
        bestCombo: 0,
        bestScore: 0,
        missionsCompleted: 0,
        bossDefeats: 0,
        favoriteWeapon: 'Plasma Cannon',
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        firstKillAchieved: false,
        nearMeltdownSurvivals: 0,
        supercriticalTriggers: 0,
      }
    );
  }

  public recordRun(stats: Partial<OperatorStats>) {
    const current = this.getStats();
    const updated: OperatorStats = {
      totalRuns: current.totalRuns + 1,
      totalKills: current.totalKills + (stats.totalKills || 0),
      totalMeltdowns: current.totalMeltdowns + (stats.totalMeltdowns || 0),
      totalOverclockTimeSec: current.totalOverclockTimeSec + (stats.totalOverclockTimeSec || 0),
      highestHeatReached: Math.max(current.highestHeatReached, stats.highestHeatReached || 0),
      bestCombo: Math.max(current.bestCombo, stats.bestCombo || 0),
      bestScore: Math.max(current.bestScore, stats.bestScore || 0),
      missionsCompleted: current.missionsCompleted + (stats.missionsCompleted || 0),
      bossDefeats: current.bossDefeats + (stats.bossDefeats || 0),
      favoriteWeapon: stats.favoriteWeapon || current.favoriteWeapon,
      totalDamageDealt: current.totalDamageDealt + (stats.totalDamageDealt || 0),
      totalDamageTaken: current.totalDamageTaken + (stats.totalDamageTaken || 0),
      firstKillAchieved: current.firstKillAchieved || (stats.firstKillAchieved ?? false),
      nearMeltdownSurvivals: current.nearMeltdownSurvivals + (stats.nearMeltdownSurvivals || 0),
      supercriticalTriggers: current.supercriticalTriggers + (stats.supercriticalTriggers || 0),
    };

    saveSystem.updateOperatorStats(updated);
  }

  public determineArchetype(): {
    archetype: PlaystyleArchetype;
    title: string;
    description: string;
    color: string;
  } {
    const stats = this.getStats();

    if (stats.nearMeltdownSurvivals >= 3 || stats.highestHeatReached >= 99) {
      return {
        archetype: 'THERMAL_GAMBLER',
        title: 'THERMAL GAMBLER',
        description: 'Lives on the absolute threshold of reactor containment. Thrives when cooling systems fail.',
        color: '#ff3e3e',
      };
    }

    if (stats.totalOverclockTimeSec > 45 || stats.supercriticalTriggers >= 4) {
      return {
        archetype: 'OVERCLOCK_ADDICT',
        title: 'OVERCLOCK ADDICT',
        description: 'Relies perpetually on overclocking safety bypasses. Values raw firepower over machine preservation.',
        color: '#ff9f00',
      };
    }

    if (stats.totalMeltdowns >= 3) {
      return {
        archetype: 'CHAOS_OPERATOR',
        title: 'CHAOS OPERATOR',
        description: 'Pushes equipment past mechanical failure. Leaves a trail of vaporized hardware and high scores.',
        color: '#d946ef',
      };
    }

    if (stats.bestCombo >= 15) {
      return {
        archetype: 'SPEED_DEMON',
        title: 'KINETIC RESONATOR',
        description: 'Chains rapid eliminations into continuous kinetic momentum with minimal hesitation.',
        color: '#00ff9f',
      };
    }

    if (stats.totalDamageDealt > 5000) {
      return {
        archetype: 'KINETIC_BALLISTICIAN',
        title: 'KINETIC BALLISTICIAN',
        description: 'Executes high-yield firing solutions with devastating precision and sustained DPS.',
        color: '#38bdf8',
      };
    }

    return {
      archetype: 'COLD_CALCULATOR',
      title: 'PRECISION OPERATOR',
      description: 'Maintains measured cooling management and methodical tactical discipline.',
      color: '#00ff9f',
    };
  }

  public getAIAssessment(): string {
    const stats = this.getStats();
    const { title } = this.determineArchetype();

    if (stats.totalRuns === 0) {
      return 'OPERATOR UNCALIBRATED. Neural telemetry awaiting first combat deployment.';
    }

    if (stats.totalMeltdowns > stats.missionsCompleted && stats.totalRuns >= 2) {
      return `WARNING: Operator displays recurrent thermal catastrophic failure (${stats.totalMeltdowns} meltdowns). Recommendation: Release the trigger or upgrade cooling manifolds.`;
    }

    if (stats.nearMeltdownSurvivals >= 3) {
      return `EVALUATION [${title}]: Operator repeatedly flirts with 99% core meltdown. Statistical survival odds were < 4%. Impressively reckless.`;
    }

    if (stats.bossDefeats >= 1) {
      return `EVALUATION [SYSTEM CONQUEROR]: Administrator neutralized. Operator telemetry surpasses all factory baseline projections. Rig clearance: MAXIMUM.`;
    }

    return `EVALUATION [${title}]: Combat efficiency verified. Total neutralization count: ${stats.totalKills}. Core integrity within operational limits.`;
  }
}

export const operatorProfileSystem = OperatorProfileSystem.getInstance();
