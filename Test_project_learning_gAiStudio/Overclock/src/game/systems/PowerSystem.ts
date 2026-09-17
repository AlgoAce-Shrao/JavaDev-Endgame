import { PowerAllocation } from '../types';

export class PowerSystem {
  public allocation: PowerAllocation = {
    weapons: 25,
    engine: 25,
    shield: 25,
    cooling: 25,
  };

  public setChannel(channel: keyof PowerAllocation, value: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const diff = clamped - this.allocation[channel];
    if (diff === 0) return;

    this.allocation[channel] = clamped;

    // Distribute remaining amongst other 3 channels
    const otherKeys = (['weapons', 'engine', 'shield', 'cooling'] as (keyof PowerAllocation)[]).filter(
      (k) => k !== channel
    );
    const otherSum = otherKeys.reduce((acc, k) => acc + this.allocation[k], 0);

    if (otherSum === 0) {
      const split = (100 - clamped) / otherKeys.length;
      otherKeys.forEach((k) => (this.allocation[k] = split));
    } else {
      const scale = (100 - clamped) / otherSum;
      otherKeys.forEach((k) => {
        this.allocation[k] = Math.max(0, Math.round(this.allocation[k] * scale));
      });
    }

    // Force exact 100 sum
    this.normalize();
  }

  public applyPreset(preset: 'BALANCED' | 'ATTACK' | 'EVASION' | 'DEFENSE' | 'COOLING') {
    switch (preset) {
      case 'BALANCED':
        this.allocation = { weapons: 25, engine: 25, shield: 25, cooling: 25 };
        break;
      case 'ATTACK':
        this.allocation = { weapons: 55, engine: 15, shield: 15, cooling: 15 };
        break;
      case 'EVASION':
        this.allocation = { weapons: 15, engine: 55, shield: 15, cooling: 15 };
        break;
      case 'DEFENSE':
        this.allocation = { weapons: 15, engine: 15, shield: 55, cooling: 15 };
        break;
      case 'COOLING':
        this.allocation = { weapons: 10, engine: 15, shield: 15, cooling: 60 };
        break;
    }
    this.normalize();
  }

  private normalize() {
    const sum = this.allocation.weapons + this.allocation.engine + this.allocation.shield + this.allocation.cooling;
    const diff = 100 - sum;
    if (diff !== 0) {
      this.allocation.cooling = Math.max(0, this.allocation.cooling + diff);
    }
  }

  public getWeaponDamageMultiplier(): number {
    return 0.8 + (this.allocation.weapons / 100) * 0.5; // 0.8x to 1.3x
  }

  public getWeaponFireRateMultiplier(): number {
    return 0.85 + (this.allocation.weapons / 100) * 0.4; // 0.85x to 1.25x
  }

  public getWeaponHeatMultiplier(): number {
    return 0.85 + (this.allocation.weapons / 100) * 0.45; // 0.85x to 1.3x
  }

  public getCoolingMultiplier(): number {
    return 0.4 + (this.allocation.cooling / 100) * 2.2; // 0.4x to 2.6x
  }
}
