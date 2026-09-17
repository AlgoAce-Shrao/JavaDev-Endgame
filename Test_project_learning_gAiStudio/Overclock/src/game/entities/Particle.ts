import { Vector2D } from '../types';

export type ParticleType =
  | 'spark'
  | 'smoke'
  | 'thermal'
  | 'shockwave'
  | 'laser_trail'
  | 'text'
  | 'debris'
  | 'overclock_surge';

export class Particle {
  public pos: Vector2D;
  public vel: Vector2D;
  public life: number;
  public maxLife: number;
  public color: string;
  public size: number;
  public type: ParticleType;
  public text?: string;
  public alpha: number = 1.0;
  public dead: boolean = false;

  constructor(
    pos: Vector2D,
    vel: Vector2D,
    life: number,
    color: string,
    size: number,
    type: ParticleType = 'spark',
    text?: string
  ) {
    this.pos = { ...pos };
    this.vel = { ...vel };
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
    this.type = type;
    this.text = text;
  }

  public update(dt: number) {
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
      return;
    }

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    if (this.type === 'spark' || this.type === 'debris') {
      this.vel.x *= 0.94;
      this.vel.y *= 0.94;
    } else if (this.type === 'thermal') {
      this.vel.y -= 20 * dt; // rise upward
      this.size += 4 * dt;
    } else if (this.type === 'shockwave') {
      this.size += 220 * dt;
    } else if (this.type === 'text') {
      this.vel.y -= 15 * dt;
    }

    this.alpha = Math.max(0, this.life / this.maxLife);
  }

  public isDead(): boolean {
    return this.dead || this.life <= 0;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;

    if (this.type === 'spark' || this.type === 'debris') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'thermal' || this.type === 'smoke') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'shockwave') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3 * this.alpha;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'text' && this.text) {
      ctx.fillStyle = this.color;
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.text, this.pos.x, this.pos.y);
    } else if (this.type === 'overclock_surge') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size * (1 - this.alpha + 0.2), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
