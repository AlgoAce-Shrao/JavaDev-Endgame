import { ACHIEVEMENTS_REGISTRY } from '../data/achievements';
import { AchievementDef } from '../types';
import { saveSystem } from './SaveSystem';
import { soundSynth } from '../audio/SoundSynth';

export class AchievementSystem {
  private static instance: AchievementSystem;
  private onAchievementUnlockedCallbacks: ((achievement: AchievementDef) => void)[] = [];

  private constructor() {}

  public static getInstance(): AchievementSystem {
    if (!AchievementSystem.instance) {
      AchievementSystem.instance = new AchievementSystem();
    }
    return AchievementSystem.instance;
  }

  public onUnlock(callback: (achievement: AchievementDef) => void) {
    this.onAchievementUnlockedCallbacks.push(callback);
  }

  public isUnlocked(id: string): boolean {
    const state = saveSystem.getState();
    return !!state.unlockedAchievements?.includes(id);
  }

  public unlock(id: string): boolean {
    const ach = ACHIEVEMENTS_REGISTRY.find((a) => a.id === id);
    if (!ach) return false;

    const state = saveSystem.getState();
    const current = state.unlockedAchievements || [];
    if (current.includes(id)) return false;

    const updated = [...current, id];
    saveSystem.updateUnlockedAchievements(updated);

    // Audio cue
    soundSynth.playPowerRoute();

    // Broadcast toast
    this.onAchievementUnlockedCallbacks.forEach((cb) => cb(ach));
    return true;
  }

  public getUnlockedList(): AchievementDef[] {
    const state = saveSystem.getState();
    const unlockedIds = state.unlockedAchievements || [];
    return ACHIEVEMENTS_REGISTRY.filter((a) => unlockedIds.includes(a.id));
  }

  public getAll(): AchievementDef[] {
    return ACHIEVEMENTS_REGISTRY;
  }

  public getProgress(): { unlocked: number; total: number; percentage: number } {
    const state = saveSystem.getState();
    const unlockedIds = state.unlockedAchievements || [];
    const total = ACHIEVEMENTS_REGISTRY.length;
    const unlocked = unlockedIds.length;
    return {
      unlocked,
      total,
      percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0,
    };
  }
}

export const achievementSystem = AchievementSystem.getInstance();
