import { CampaignSaveState, WeaponId } from '../types';

const STORAGE_KEY = 'OVERCLOCK_CAMPAIGN_SAVE_V2';

const DEFAULT_SAVE_STATE: CampaignSaveState = {
  completedMissions: [],
  unlockedMissions: [1], // Mission 01 unlocked initially
  highestUnlockedMission: 1,
  endlessUnlocked: false,
  endlessHighScore: 0,
  endlessBestWave: 1,
  totalCyberCredits: 0,
  missionRatings: {},
  missionHighScores: {},
  unlockedWeapons: ['plasma'],
  weaponModConfigs: {},
  settings: {
    isMuted: false,
    volume: 0.8,
    screenShake: true,
    crtScanlines: true,
  },
};

export class SaveSystem {
  private static instance: SaveSystem;
  private state: CampaignSaveState;

  private constructor() {
    this.state = this.load();
  }

  public static getInstance(): SaveSystem {
    if (!SaveSystem.instance) {
      SaveSystem.instance = new SaveSystem();
    }
    return SaveSystem.instance;
  }

  public getState(): CampaignSaveState {
    return { ...this.state };
  }

  private load(): CampaignSaveState {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return { ...DEFAULT_SAVE_STATE };
      const parsed = JSON.parse(serialized);
      return {
        ...DEFAULT_SAVE_STATE,
        ...parsed,
        unlockedMissions: Array.isArray(parsed.unlockedMissions) && parsed.unlockedMissions.length > 0
          ? Array.from(new Set([1, ...parsed.unlockedMissions]))
          : [1],
        completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
        unlockedWeapons: Array.isArray(parsed.unlockedWeapons) && parsed.unlockedWeapons.length > 0
          ? Array.from(new Set(['plasma' as WeaponId, ...parsed.unlockedWeapons]))
          : ['plasma'],
      };
    } catch {
      return { ...DEFAULT_SAVE_STATE };
    }
  }

  public save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save game state to localStorage', e);
    }
  }

  public isMissionUnlocked(missionId: number): boolean {
    if (missionId === 1) return true;
    return this.state.unlockedMissions.includes(missionId);
  }

  public isMissionCompleted(missionId: number): boolean {
    return this.state.completedMissions.includes(missionId);
  }

  public completeMission(
    missionId: number,
    score: number,
    rating: 'S' | 'A' | 'B' | 'C',
    creditsEarned: number,
    unlockedWeapon?: WeaponId
  ): { newlyUnlockedMission: number | null; newlyUnlockedEndless: boolean } {
    let newlyUnlockedMission: number | null = null;
    let newlyUnlockedEndless = false;

    if (!this.state.completedMissions.includes(missionId)) {
      this.state.completedMissions.push(missionId);
    }

    // Update rating if higher or not set
    const currentRating = this.state.missionRatings[missionId];
    const ratingWeights: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
    if (!currentRating || (ratingWeights[rating] || 0) > (ratingWeights[currentRating] || 0)) {
      this.state.missionRatings[missionId] = rating;
    }

    // High score
    const currentHigh = this.state.missionHighScores[missionId] || 0;
    if (score > currentHigh) {
      this.state.missionHighScores[missionId] = score;
    }

    // Add credits
    this.state.totalCyberCredits += creditsEarned;

    // Unlock next mission (Mission 1->2, 2->3, 3->4, 4->5, 5->6)
    const nextMissionId = missionId + 1;
    if (nextMissionId <= 6 && !this.state.unlockedMissions.includes(nextMissionId)) {
      this.state.unlockedMissions.push(nextMissionId);
      this.state.highestUnlockedMission = Math.max(this.state.highestUnlockedMission, nextMissionId);
      newlyUnlockedMission = nextMissionId;
    }

    // Mission 6 completion unlocks Endless
    if (missionId === 6 && !this.state.endlessUnlocked) {
      this.state.endlessUnlocked = true;
      newlyUnlockedEndless = true;
    }

    // Unlock weapon if provided
    if (unlockedWeapon && !this.state.unlockedWeapons.includes(unlockedWeapon)) {
      this.state.unlockedWeapons.push(unlockedWeapon);
    }

    this.save();
    return { newlyUnlockedMission, newlyUnlockedEndless };
  }

  public recordEndlessScore(score: number, wave: number): boolean {
    let isNewHigh = false;
    if (score > this.state.endlessHighScore) {
      this.state.endlessHighScore = score;
      isNewHigh = true;
    }
    if (wave > this.state.endlessBestWave) {
      this.state.endlessBestWave = wave;
    }
    this.save();
    return isNewHigh;
  }

  public addCredits(amount: number): void {
    this.state.totalCyberCredits += amount;
    this.save();
  }

  public spendCredits(amount: number): boolean {
    if (this.state.totalCyberCredits >= amount) {
      this.state.totalCyberCredits -= amount;
      this.save();
      return true;
    }
    return false;
  }

  public unlockWeapon(weaponId: WeaponId): void {
    if (!this.state.unlockedWeapons.includes(weaponId)) {
      this.state.unlockedWeapons.push(weaponId);
      this.save();
    }
  }

  public saveWeaponModConfig(weaponId: string, config: any): void {
    if (!this.state.weaponModConfigs) {
      this.state.weaponModConfigs = {};
    }
    this.state.weaponModConfigs[weaponId] = config;
    this.save();
  }

  public updateSettings(settings: Partial<CampaignSaveState['settings']>): void {
    this.state.settings = {
      ...this.state.settings,
      ...settings,
    } as any;
    this.save();
  }

  public setBootSequenceSeen(seen: boolean = true): void {
    this.state.bootSequenceSeen = seen;
    this.save();
  }

  public isBootSequenceSeen(): boolean {
    return !!this.state.bootSequenceSeen;
  }

  public updateOperatorStats(stats: any): void {
    this.state.operatorStats = stats;
    this.save();
  }

  public updateUnlockedAchievements(achievements: string[]): void {
    this.state.unlockedAchievements = achievements;
    this.save();
  }

  public updateDiscoveredSecrets(secrets: string[]): void {
    this.state.discoveredSecrets = secrets;
    this.save();
  }

  public recordSecretDiscovered(secretId: string): void {
    if (!this.state.discoveredSecrets) {
      this.state.discoveredSecrets = [];
    }
    if (!this.state.discoveredSecrets.includes(secretId)) {
      this.state.discoveredSecrets.push(secretId);
      this.save();
    }
  }

  public updateActiveProtocols(protocols: string[]): void {
    this.state.activeProtocols = protocols;
    this.save();
  }

  public unlockProtocol(protocolId: string): void {
    if (!this.state.unlockedProtocols) {
      this.state.unlockedProtocols = [];
    }
    if (!this.state.unlockedProtocols.includes(protocolId)) {
      this.state.unlockedProtocols.push(protocolId);
      this.save();
    }
  }

  public resetProgress(): void {
    this.state = { ...DEFAULT_SAVE_STATE };
    this.save();
  }
}

export const saveSystem = SaveSystem.getInstance();
