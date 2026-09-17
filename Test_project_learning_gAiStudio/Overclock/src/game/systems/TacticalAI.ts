import { TacticalMessage } from '../types';

export class TacticalAI {
  private messages: TacticalMessage[] = [];
  private lastAlertTime: Record<string, number> = {};

  constructor() {
    this.addMessage('VX-01 TACTICAL INTERFACE ONLINE. OPERATOR IDENTIFIED.', 'NORMAL');
  }

  public addMessage(text: string, level: 'NORMAL' | 'WARN' | 'CRIT' | 'SECRET' | 'GLITCH') {
    const msg: TacticalMessage = {
      id: `tac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text,
      timestamp: Date.now(),
      level,
    };
    this.messages.unshift(msg);
    if (this.messages.length > 8) {
      this.messages.pop();
    }
  }

  public notify(key: string, text: string, level: 'NORMAL' | 'WARN' | 'CRIT' | 'SECRET' | 'GLITCH', cooldownSec: number = 5.0) {
    const now = Date.now();
    const last = this.lastAlertTime[key] || 0;
    if (now - last > cooldownSec * 1000) {
      this.lastAlertTime[key] = now;
      this.addMessage(text, level);
    }
  }

  public getMessages(): TacticalMessage[] {
    return [...this.messages];
  }

  public clear() {
    this.messages = [];
  }
}
