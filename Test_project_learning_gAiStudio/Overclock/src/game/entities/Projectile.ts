import { Vector2D } from '../types';
import { Particle } from './Particle';

export class Projectile {
  public pos: Vector2D;
  public vel: Vector2D;
  public damage: number;
  public radius: number;
  public color: string;
  public isPlayer: boolean;
  public life: number;
  public maxLife: number;
  public piercing: boolean;
  public homing: boolean;
  public areaEffect: boolean;
  public weaponId?: string;
  public dead: boolean = false;
  public hitEntityIds: Set<string> = new Set();
  public trailTimer: number = 0;

  // Mod Attributes
  public ricochetBounces: number = 0;
  public cryoSlow: boolean = false;
  public plasmaIgnite: boolean = false;
  public chainLightning: boolean = false;
  public heatSiphon: boolean = false;
  public shieldVampire: boolean = false;
  public areaRadiusMult: number = 1.0;

  constructor(options: {
    pos: Vector2D;
    vel: Vector2D;
    damage: number;
    radius: number;
    color: string;
    isPlayer: boolean;
    life: number;
    piercing?: boolean;
    homing?: boolean;
    areaEffect?: boolean;
    weaponId?: string;
    ricochetBounces?: number;
    cryoSlow?: boolean;
    plasmaIgnite?: boolean;
    chainLightning?: boolean;
    heatSiphon?: boolean;
    shieldVampire?: boolean;
    areaRadiusMult?: number;
  }) {
    this.pos = { ...options.pos };
    this.vel = { ...options.vel };
    this.damage = options.damage;
    this.radius = options.radius;
    this.color = options.color;
    this.isPlayer = options.isPlayer;
    this.life = options.life;
    this.maxLife = options.life;
    this.piercing = !!options.piercing;
    this.homing = !!options.homing;
    this.areaEffect = !!options.areaEffect;
    this.weaponId = options.weaponId;
    this.ricochetBounces = options.ricochetBounces || 0;
    this.cryoSlow = !!options.cryoSlow;
    this.plasmaIgnite = !!options.plasmaIgnite;
    this.chainLightning = !!options.chainLightning;
    this.heatSiphon = !!options.heatSiphon;
    this.shieldVampire = !!options.shieldVampire;
    this.areaRadiusMult = options.areaRadiusMult || 1.0;
  }

  public update(
    dt: number,
    targetPos?: Vector2D,
    particles?: Particle[],
    arenaBounds?: { width: number; height: number }
  ) {
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
      return;
    }

    // Homing logic (for missiles & smart guidance)
    if (this.homing && targetPos) {
      const dx = targetPos.x - this.pos.x;
      const dy = targetPos.y - this.pos.y;
      const targetAngle = Math.atan2(dy, dx);
      const currentAngle = Math.atan2(this.vel.y, this.vel.x);

      let diff = targetAngle - currentAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      const steerSpeed = 7.0; // rad/s
      const newAngle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), steerSpeed * dt);
      const speed = Math.hypot(this.vel.x, this.vel.y);

      this.vel.x = Math.cos(newAngle) * speed;
      this.vel.y = Math.sin(newAngle) * speed;
    }

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Ricochet off arena walls
    if (arenaBounds && this.ricochetBounces > 0) {
      let bounced = false;
      if (this.pos.x <= 15 && this.vel.x < 0) {
        this.vel.x = -this.vel.x;
        this.pos.x = 16;
        bounced = true;
      } else if (this.pos.x >= arenaBounds.width - 15 && this.vel.x > 0) {
        this.vel.x = -this.vel.x;
        this.pos.x = arenaBounds.width - 16;
        bounced = true;
      }

      if (this.pos.y <= 15 && this.vel.y < 0) {
        this.vel.y = -this.vel.y;
        this.pos.y = 16;
        bounced = true;
      } else if (this.pos.y >= arenaBounds.height - 15 && this.vel.y > 0) {
        this.vel.y = -this.vel.y;
        this.pos.y = arenaBounds.height - 16;
        bounced = true;
      }

      if (bounced) {
        this.ricochetBounces--;
        if (particles) {
          particles.push(
            new Particle(this.pos, { x: 0, y: 0 }, 0.2, '#00ff9f', 4, 'spark')
          );
        }
      }
    }

    // Trails
    this.trailTimer += dt;
    if (particles && this.trailTimer > 0.03) {
      this.trailTimer = 0;
      if (this.weaponId === 'missiles') {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20 },
            0.25,
            '#ff5500',
            3.0,
            'smoke'
          )
        );
      } else if (this.weaponId === 'railgun' || this.weaponId === 'gauss_gatling') {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 },
            0.2,
            this.color,
            2.5,
            'spark'
          )
        );
      } else if (this.weaponId === 'singularity') {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 },
            0.35,
            '#c084fc',
            5.0,
            'smoke'
          )
        );
      } else if (this.cryoSlow) {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 },
            0.18,
            '#67e8f9',
            2.0,
            'spark'
          )
        );
      } else if (this.plasmaIgnite) {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 12, y: (Math.random() - 0.5) * 12 },
            0.2,
            '#ff3e3e',
            2.5,
            'smoke'
          )
        );
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.isPlayer ? 8 : 4;

    if (this.areaEffect && this.weaponId === 'emp') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.weaponId === 'singularity') {
      // Swirling singularity visual
      ctx.fillStyle = '#0a001a';
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else if (this.weaponId === 'railgun') {
      const angle = Math.atan2(this.vel.y, this.vel.x);
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(angle);
      ctx.fillRect(-18, -2.5, 36, 5);
    } else if (this.weaponId === 'missiles') {
      const angle = Math.atan2(this.vel.y, this.vel.x);
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(angle);
      ctx.fillRect(-6, -3, 12, 6);
    } else if (this.weaponId === 'scatter_flak') {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

