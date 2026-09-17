/**
 * Procedural Web Audio Synthesizer for OVERCLOCK.
 * Generates all tactical, weapon, mechanical, thermal, and alarm audio
 * with zero external asset latency or missing file risks.
 */

class SoundSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;
  private alarmOsc: OscillatorNode | null = null;
  private alarmGain: GainNode | null = null;
  private overclockDroneOsc: OscillatorNode | null = null;
  private overclockDroneGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      console.warn('Web Audio API not supported or blocked');
    }
  }

  private ensureContext(): boolean {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return !!this.ctx && !!this.masterGain;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playShoot(weaponId: string, isOverclocked: boolean = false) {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (weaponId === 'plasma') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isOverclocked ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isOverclocked ? 920 : 640, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + (isOverclocked ? 0.08 : 0.06));
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isOverclocked ? 0.08 : 0.06));
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (weaponId === 'railgun') {
      // High-voltage beam crack + low bass boom
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const subGain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(120, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
      subGain.gain.setValueAtTime(0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      subOsc.connect(subGain);
      gain.connect(this.masterGain);
      subGain.connect(this.masterGain);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 0.26);
      subOsc.stop(now + 0.36);
    } else if (weaponId === 'missiles') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(750, now + 0.09);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (weaponId === 'emp') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.32);
    }
  }

  public playEnemyShoot() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playHit() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playExplosion(isLarge: boolean = false) {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * (isLarge ? 0.45 : 0.2);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLarge ? 400 : 800, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + (isLarge ? 0.4 : 0.18));

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isLarge ? 0.55 : 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isLarge ? 0.45 : 0.2));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  public playDash() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  public playOverclockStart(isSupercritical: boolean = false) {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Turbine ramp
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isSupercritical ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(isSupercritical ? 440 : 180, now);
    osc.frequency.exponentialRampToValueAtTime(isSupercritical ? 1800 : 980, now + 0.35);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.35);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.4);

    // Continuous drone
    this.startOverclockDrone();
  }

  public playOverclockEnd() {
    this.stopOverclockDrone();
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  public startOverclockDrone() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    if (this.overclockDroneOsc) return;
    try {
      const now = this.ctx.currentTime;
      this.overclockDroneOsc = this.ctx.createOscillator();
      this.overclockDroneGain = this.ctx.createGain();
      this.overclockDroneOsc.type = 'sawtooth';
      this.overclockDroneOsc.frequency.setValueAtTime(160, now);
      this.overclockDroneGain.gain.setValueAtTime(0.08, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      this.overclockDroneOsc.connect(filter);
      filter.connect(this.overclockDroneGain);
      this.overclockDroneGain.connect(this.masterGain);
      this.overclockDroneOsc.start(now);
    } catch {
      // Ignored
    }
  }

  public stopOverclockDrone() {
    if (this.overclockDroneOsc) {
      try {
        this.overclockDroneOsc.stop();
        this.overclockDroneOsc.disconnect();
      } catch {
        // Ignored
      }
      this.overclockDroneOsc = null;
      this.overclockDroneGain = null;
    }
  }

  public playSupercritical() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.linearRampToValueAtTime(1046.5, now + 0.4); // C6
    osc2.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.linearRampToValueAtTime(1318.5, now + 0.4); // E6

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.65);
    osc2.stop(now + 0.65);
  }

  public playWarningBeep() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playCriticalAlarm() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.setValueAtTime(750, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playMeltdownSiren() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.linearRampToValueAtTime(400, now + 0.4);
    osc.frequency.linearRampToValueAtTime(1400, now + 0.8);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.85);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  public playShieldBreak() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playHacked() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.setValueAtTime(620, now + 0.04);
    osc.frequency.setValueAtTime(180, now + 0.08);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playUiClick() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playObjectiveComplete() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C major chord arpeggio
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.05;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  public playMissionComplete() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const fanfare = [
      { f: 523.25, t: 0.0, d: 0.12 },
      { f: 659.25, t: 0.12, d: 0.12 },
      { f: 783.99, t: 0.24, d: 0.15 },
      { f: 1046.5, t: 0.39, d: 0.4 },
    ];
    fanfare.forEach((n) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + n.t;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, st);
      gain.gain.setValueAtTime(0.25, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + n.d);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(st);
      osc.stop(st + n.d + 0.05);
    });
  }

  public playRewardCollect() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1); // E6
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playPause() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playResume() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playEnemyHit() {
    this.playHit();
  }

  public playPlayerDamage() {
    this.playHit();
  }

  public playEnemyExplosion(isLarge: boolean = false) {
    this.playExplosion(isLarge);
  }

  public playSecretUnlocked() {
    this.playObjectiveComplete();
  }

  public playPowerRoute() {
    this.playUiClick();
  }

  public playAchievement() {
    this.playRewardCollect();
  }

  public playUpgradeSelected() {
    if (!this.ensureContext() || this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A major
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }
}

export const soundSynth = new SoundSynth();
