import { Vector2D, PowerAllocation } from '../types';
import { Particle } from './Particle';
import { GAME_BALANCE } from '../data/balanceConfig';

export class Player {
  public pos: Vector2D;
  public vel: Vector2D = { x: 0, y: 0 };
  public aimAngle: number = 0;
  public radius: number = 18;

  // Machine Resources
  public core: number = GAME_BALANCE.PLAYER.MAX_CORE_HEALTH;
  public maxCore: number = GAME_BALANCE.PLAYER.MAX_CORE_HEALTH;
  public shield: number = GAME_BALANCE.PLAYER.MAX_SHIELD;
  public maxShield: number = GAME_BALANCE.PLAYER.MAX_SHIELD;
  public energy: number = GAME_BALANCE.PLAYER.MAX_ENERGY;
  public maxEnergy: number = GAME_BALANCE.PLAYER.MAX_ENERGY;
  public heat: number = 0; // 0 - 100%

  // Overclock
  public isOverclocked: boolean = false;
  public overclockTimer: number = 0;
  public baseOverclockDuration: number = GAME_BALANCE.HEAT.OVERCLOCK_DURATION;
  public isSupercritical: boolean = false;
  public supercriticalTimer: number = 0;

  // Dash
  public isDashing: boolean = false;
  public dashTimer: number = 0;
  public dashDuration: number = GAME_BALANCE.PLAYER.DASH_DURATION;
  public dashCooldownTimer: number = 0;
  public baseDashCooldown: number = GAME_BALANCE.PLAYER.DASH_COOLDOWN_BASE;
  public dashVel: Vector2D = { x: 0, y: 0 };

  // Shield Recovery
  public shieldRegenDelayTimer: number = 0;

  // Cyberwarfare
  public isHacked: boolean = false;
  public hackTimer: number = 0;

  // Stats
  public baseSpeed: number = GAME_BALANCE.PLAYER.BASE_SPEED;
  public thrusterTimer: number = 0;

  constructor(x: number, y: number) {
    this.pos = { x, y };
  }

  public reset(x: number, y: number) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.core = this.maxCore;
    this.shield = this.maxShield;
    this.energy = this.maxEnergy;
    this.heat = 0;
    this.isOverclocked = false;
    this.overclockTimer = 0;
    this.isSupercritical = false;
    this.supercriticalTimer = 0;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashCooldownTimer = 0;
    this.isHacked = false;
    this.hackTimer = 0;
  }

  public update(
    dt: number,
    inputDir: Vector2D,
    mousePos: Vector2D,
    power: PowerAllocation,
    arenaBounds: { width: number; height: number },
    particles: Particle[]
  ) {
    // Aim angle
    this.aimAngle = Math.atan2(mousePos.y - this.pos.y, mousePos.x - this.pos.x);

    // Timers
    if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= dt;
    if (this.shieldRegenDelayTimer > 0) this.shieldRegenDelayTimer -= dt;

    if (this.isHacked) {
      this.hackTimer -= dt;
      if (this.hackTimer <= 0) this.isHacked = false;
    }

    if (this.isSupercritical) {
      this.supercriticalTimer -= dt;
      if (this.supercriticalTimer <= 0) {
        this.isSupercritical = false;
      }
    }

    // Overclock timer
    if (this.isOverclocked) {
      this.overclockTimer -= dt;
      if (this.overclockTimer <= 0) {
        this.isOverclocked = false;
        this.isSupercritical = false;
      }
    }

    // Dash update
    if (this.isDashing) {
      this.dashTimer -= dt;
      this.pos.x += this.dashVel.x * dt;
      this.pos.y += this.dashVel.y * dt;

      // Dash ghost particle trail
      particles.push(
        new Particle(
          this.pos,
          { x: (Math.random() - 0.5) * 30, y: (Math.random() - 0.5) * 30 },
          0.16,
          this.isOverclocked ? '#ff2a4b' : '#00f0ff',
          6,
          'smoke'
        )
      );

      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    } else {
      // Normal movement modified by ENGINE power (0.7x to 1.5x) and Overclock (+40%)
      const engineMult = 0.7 + (power.engine / 100) * 0.8;
      const ocSpeedMult = this.isOverclocked ? 1.4 : 1.0;
      const hackSpeedMult = this.isHacked ? 0.7 : 1.0;
      const targetSpeed = this.baseSpeed * engineMult * ocSpeedMult * hackSpeedMult;

      const len = Math.hypot(inputDir.x, inputDir.y);
      if (len > 0) {
        const normX = inputDir.x / len;
        const normY = inputDir.y / len;
        this.vel.x += (normX * targetSpeed - this.vel.x) * 12 * dt;
        this.vel.y += (normY * targetSpeed - this.vel.y) * 12 * dt;

        // Thruster sparks
        this.thrusterTimer += dt;
        if (this.thrusterTimer > 0.04) {
          this.thrusterTimer = 0;
          const oppAngle = Math.atan2(this.vel.y, this.vel.x) + Math.PI;
          particles.push(
            new Particle(
              {
                x: this.pos.x + Math.cos(oppAngle) * 12,
                y: this.pos.y + Math.sin(oppAngle) * 12,
              },
              {
                x: Math.cos(oppAngle + (Math.random() - 0.5) * 0.5) * 60,
                y: Math.sin(oppAngle + (Math.random() - 0.5) * 0.5) * 60,
              },
              0.15,
              this.isOverclocked ? '#ff9900' : '#00f0ff',
              2.5,
              'spark'
            )
          );
        }
      } else {
        this.vel.x *= Math.pow(0.01, dt);
        this.vel.y *= Math.pow(0.01, dt);
      }

      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
    }

    // Clamp inside arena bounds
    const pad = this.radius + 10;
    this.pos.x = Math.max(pad, Math.min(arenaBounds.width - pad, this.pos.x));
    this.pos.y = Math.max(pad, Math.min(arenaBounds.height - pad, this.pos.y));

    // Shield Regeneration (governed by SHIELD power allocation)
    if (this.shieldRegenDelayTimer <= 0 && this.shield < this.maxShield) {
      const shieldRegenRate = GAME_BALANCE.PLAYER.SHIELD_REGEN_RATE_BASE * (0.3 + (power.shield / 100) * 2.2); // Responsive SP/s
      this.shield = Math.min(this.maxShield, this.shield + shieldRegenRate * dt);
    }

    // Energy Regeneration
    const energyRegenRate = GAME_BALANCE.PLAYER.ENERGY_REGEN_RATE; // 20 EP/s base
    this.energy = Math.min(this.maxEnergy, this.energy + energyRegenRate * dt);

    // Overclock Energy Drain & Overclock Sparks
    if (this.isOverclocked) {
      if (!this.isSupercritical) {
        this.energy = Math.max(0, this.energy - 10 * dt);
      }
      if (Math.random() < 0.3) {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 70, y: (Math.random() - 0.5) * 70 },
            0.2,
            this.isSupercritical ? '#39ff14' : '#ff2a4b',
            2,
            'overclock_surge'
          )
        );
      }
    }
  }

  public dash(inputDir: Vector2D, power: PowerAllocation, particles: Particle[]): boolean {
    if (this.dashCooldownTimer > 0 || this.energy < GAME_BALANCE.PLAYER.DASH_ENERGY_COST || this.isDashing) {
      return false;
    }

    const engineMult = 0.5 + (power.engine / 100) * 0.8;
    this.dashCooldownTimer = Math.max(0.3, this.baseDashCooldown / (engineMult * (this.isOverclocked ? 1.5 : 1.0)));
    this.energy -= GAME_BALANCE.PLAYER.DASH_ENERGY_COST;
    this.isDashing = true;
    this.dashTimer = this.dashDuration;

    let dirX = inputDir.x;
    let dirY = inputDir.y;
    if (dirX === 0 && dirY === 0) {
      dirX = Math.cos(this.aimAngle);
      dirY = Math.sin(this.aimAngle);
    }
    const len = Math.hypot(dirX, dirY);
    const speed = 720;
    this.dashVel = {
      x: (dirX / len) * speed,
      y: (dirY / len) * speed,
    };

    // Dash shockwave
    particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.25, '#00f0ff', 12, 'shockwave'));
    return true;
  }

  public takeDamage(dmg: number, particles: Particle[]): boolean {
    if (this.isDashing) return false; // i-frames
    this.shieldRegenDelayTimer = GAME_BALANCE.PLAYER.SHIELD_REGEN_DELAY;

    // Damage shield first
    if (this.shield > 0) {
      if (this.shield >= dmg) {
        this.shield -= dmg;
        particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.2, '#00f0ff', 24, 'shockwave'));
        return false;
      } else {
        const leftover = dmg - this.shield;
        this.shield = 0;
        this.core = Math.max(0, this.core - leftover);
        particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.35, '#ff2a4b', 30, 'shockwave'));
      }
    } else {
      this.core = Math.max(0, this.core - dmg);
      particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.3, '#ff2a4b', 24, 'shockwave'));
    }

    return this.core <= 0;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);

    // Overclock / Supercritical Outer Glow
    if (this.isOverclocked) {
      ctx.save();
      ctx.strokeStyle = this.isSupercritical ? '#39ff14' : '#ff2a4b';
      ctx.lineWidth = 2;
      ctx.shadowColor = this.isSupercritical ? '#39ff14' : '#ff2a4b';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Shield Dome
    if (this.shield > 0) {
      const shieldAlpha = Math.min(0.6, (this.shield / this.maxShield) * 0.6);
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = shieldAlpha;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Rotating Aim Chassis
    ctx.rotate(this.aimAngle);

    // Main Mech Body (Chiseled military octagonal silhouette)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = this.isOverclocked
      ? (this.isSupercritical ? '#39ff14' : '#ff2a4b')
      : '#00f0ff';
    ctx.lineWidth = 2;

    // Hull polygon
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(4, 12);
    ctx.lineTo(-12, 10);
    ctx.lineTo(-15, 0);
    ctx.lineTo(-12, -10);
    ctx.lineTo(4, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Twin Barrel Cannons
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, -6, 12, 3);
    ctx.fillRect(8, 3, 12, 3);

    // Reactor Core Pip (Glows hotter with heat)
    let coreColor = '#00f0ff';
    if (this.heat > 85) coreColor = '#ff2a4b';
    else if (this.heat > 65) coreColor = '#ffb700';

    ctx.fillStyle = coreColor;
    ctx.shadowColor = coreColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
