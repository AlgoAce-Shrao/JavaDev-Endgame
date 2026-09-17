import { Vector2D, EnemyType, EndlessMutationDef } from '../types';
import { Projectile } from './Projectile';
import { Particle } from './Particle';
import { Player } from './Player';
import { GAME_BALANCE } from '../data/balanceConfig';

export class Enemy {
  public id: string;
  public type: EnemyType;
  public pos: Vector2D;
  public vel: Vector2D = { x: 0, y: 0 };
  public radius: number;
  public hp: number;
  public maxHp: number;
  public dead: boolean = false;
  public scoreValue: number;

  // Behavior timers
  public attackTimer: number = 0;
  public state: 'idle' | 'charging' | 'windup' | 'firing' = 'idle';
  public chargeDir: Vector2D = { x: 0, y: 0 };
  public windupTimer: number = 0;
  public rotation: number = 0;

  // Leech tether state
  public isTethering: boolean = false;

  // Status Effects & Elemental Debuffs
  public cryoSlowTimer: number = 0;
  public burnTimer: number = 0;
  public burnDps: number = 0;
  public phaseShiftTimer: number = 0;
  public isPhasedOut: boolean = false;
  public berserkActive: boolean = false;

  constructor(type: EnemyType, x: number, y: number, idSuffix: number = 0, hpMult: number = 1.0) {
    this.id = `enemy_${type}_${Date.now()}_${idSuffix}`;
    this.type = type;
    this.pos = { x, y };

    switch (type) {
      case 'drone':
        this.radius = 13;
        this.maxHp = Math.round(GAME_BALANCE.DRONE.MAX_HP * hpMult);
        this.scoreValue = 100;
        this.attackTimer = Math.random() * 1.5;
        break;
      case 'charger':
        this.radius = 18;
        this.maxHp = Math.round(GAME_BALANCE.CHARGER.MAX_HP * hpMult);
        this.scoreValue = 250;
        this.attackTimer = 1.0 + Math.random() * 2.0;
        break;
      case 'turret':
        this.radius = 22;
        this.maxHp = Math.round(GAME_BALANCE.TURRET.MAX_HP * hpMult);
        this.scoreValue = 400;
        this.attackTimer = 1.5 + Math.random();
        break;
      case 'leech':
        this.radius = 15;
        this.maxHp = Math.round(GAME_BALANCE.LEECH.MAX_HP * hpMult);
        this.scoreValue = 200;
        this.attackTimer = 0.5;
        break;
      case 'hacker':
        this.radius = 19;
        this.maxHp = Math.round(GAME_BALANCE.HACKER.MAX_HP * hpMult);
        this.scoreValue = 350;
        this.attackTimer = 2.0 + Math.random();
        break;
    }
    this.hp = this.maxHp;
    this.phaseShiftTimer = Math.random() * 4.0;
  }

  public update(
    dt: number,
    player: Player,
    projectiles: Projectile[],
    particles: Particle[],
    arenaBounds: { width: number; height: number },
    allEnemies: Enemy[],
    mutations: EndlessMutationDef[] = []
  ) {
    // 1. Process Status Effects
    if (this.cryoSlowTimer > 0) {
      this.cryoSlowTimer -= dt;
      if (Math.random() < 0.25) {
        particles.push(
          new Particle(this.pos, { x: 0, y: 0 }, 0.15, '#67e8f9', 2, 'spark')
        );
      }
    }

    if (this.burnTimer > 0) {
      this.burnTimer -= dt;
      const burnDmg = this.burnDps * dt;
      this.hp -= burnDmg;
      if (Math.random() < 0.3) {
        particles.push(
          new Particle(this.pos, { x: 0, y: -15 }, 0.2, '#ff3e3e', 3, 'smoke')
        );
      }
      if (this.hp <= 0) {
        this.dead = true;
      }
    }

    // 2. Process Mutations
    let speedMult = 1.0;
    let bulletSpeedMult = 1.0;
    let attackRateMult = 1.0;

    for (const mut of mutations) {
      if (mut.effects.naniteRegenRate && this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + mut.effects.naniteRegenRate * dt);
      }
      if (mut.effects.enemySpeedMult) speedMult *= mut.effects.enemySpeedMult;
      if (mut.effects.enemyBulletSpeedMult) bulletSpeedMult *= mut.effects.enemyBulletSpeedMult;
      if (mut.effects.enemyFireRateMult) attackRateMult *= mut.effects.enemyFireRateMult;

      if (mut.effects.berserkerUnderHpPercent) {
        if (this.hp / this.maxHp <= mut.effects.berserkerUnderHpPercent) {
          this.berserkActive = true;
          speedMult *= 1.8;
          attackRateMult *= 2.2;
        } else {
          this.berserkActive = false;
        }
      }

      if (mut.effects.quantumPhaseShift) {
        this.phaseShiftTimer -= dt;
        if (this.phaseShiftTimer <= 0) {
          this.isPhasedOut = !this.isPhasedOut;
          this.phaseShiftTimer = this.isPhasedOut ? 1.0 : 3.5;
          particles.push(
            new Particle(this.pos, { x: 0, y: 0 }, 0.3, '#a855f7', 14, 'shockwave')
          );
        }
      }
    }

    // Cryo Slow reduces speed and fire rate by 50%
    if (this.cryoSlowTimer > 0) {
      speedMult *= 0.5;
      attackRateMult *= 0.5;
    }

    const dx = player.pos.x - this.pos.x;
    const dy = player.pos.y - this.pos.y;
    const distToPlayer = Math.hypot(dx, dy);
    this.rotation = Math.atan2(dy, dx);

    // Flocking repulsion from other enemies
    let repX = 0;
    let repY = 0;
    for (const other of allEnemies) {
      if (other === this || other.dead) continue;
      const ox = this.pos.x - other.pos.x;
      const oy = this.pos.y - other.pos.y;
      const odist = Math.hypot(ox, oy);
      if (odist < this.radius + other.radius + 10 && odist > 0) {
        repX += (ox / odist) * 40;
        repY += (oy / odist) * 40;
      }
    }

    switch (this.type) {
      case 'drone': {
        const baseSpeed = GAME_BALANCE.DRONE.SPEED * speedMult;
        const targetX = (dx / (distToPlayer || 1)) * baseSpeed + repX;
        const targetY = (dy / (distToPlayer || 1)) * baseSpeed + repY;
        this.vel.x += (targetX - this.vel.x) * 4 * dt;
        this.vel.y += (targetY - this.vel.y) * 4 * dt;

        this.attackTimer -= dt * attackRateMult;
        if (this.attackTimer <= 0 && distToPlayer < 600) {
          this.attackTimer = GAME_BALANCE.DRONE.ATTACK_COOLDOWN_BASE + Math.random() * 0.8;
          const pAngle = this.rotation + (Math.random() - 0.5) * 0.2;
          projectiles.push(
            new Projectile({
              pos: { ...this.pos },
              vel: {
                x: Math.cos(pAngle) * GAME_BALANCE.DRONE.BULLET_SPEED * bulletSpeedMult,
                y: Math.sin(pAngle) * GAME_BALANCE.DRONE.BULLET_SPEED * bulletSpeedMult,
              },
              damage: GAME_BALANCE.DRONE.BULLET_DAMAGE,
              radius: 4,
              color: '#ff2a4b',
              isPlayer: false,
              life: 2.5,
            })
          );
        }
        break;
      }

      case 'charger': {
        this.attackTimer -= dt * attackRateMult;
        if (this.state === 'idle') {
          const baseSpeed = GAME_BALANCE.CHARGER.PATROL_SPEED * speedMult;
          this.vel.x = (dx / (distToPlayer || 1)) * baseSpeed + repX;
          this.vel.y = (dy / (distToPlayer || 1)) * baseSpeed + repY;

          if (this.attackTimer <= 0 && distToPlayer < 450) {
            this.state = 'windup';
            this.windupTimer = GAME_BALANCE.CHARGER.WINDUP_TELEGRAPH_TIME;
            this.chargeDir = { x: dx / (distToPlayer || 1), y: dy / (distToPlayer || 1) };
            this.vel = { x: 0, y: 0 };
          }
        } else if (this.state === 'windup') {
          this.windupTimer -= dt * attackRateMult;
          particles.push(
            new Particle(
              this.pos,
              { x: (Math.random() - 0.5) * 40, y: (Math.random() - 0.5) * 40 },
              0.15,
              '#ffb700',
              2.5,
              'spark'
            )
          );

          if (this.windupTimer <= 0) {
            this.state = 'charging';
            this.windupTimer = 0.75;
            const chargeSpeed = GAME_BALANCE.CHARGER.CHARGE_SPEED * speedMult;
            this.vel = {
              x: this.chargeDir.x * chargeSpeed,
              y: this.chargeDir.y * chargeSpeed,
            };
          }
        } else if (this.state === 'charging') {
          this.windupTimer -= dt;
          particles.push(
            new Particle(
              this.pos,
              { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20 },
              0.2,
              '#ff2a4b',
              4,
              'smoke'
            )
          );
          if (this.windupTimer <= 0) {
            this.state = 'idle';
            this.attackTimer = GAME_BALANCE.CHARGER.ATTACK_COOLDOWN_BASE + Math.random();
          }
        }
        break;
      }

      case 'turret': {
        this.vel = { x: repX * 0.2, y: repY * 0.2 };
        this.attackTimer -= dt * attackRateMult;
        if (this.attackTimer <= 0 && distToPlayer < 750) {
          this.attackTimer = GAME_BALANCE.TURRET.ATTACK_COOLDOWN;
          const offsets = [-0.1, 0.1];
          offsets.forEach((off) => {
            const angle = this.rotation + off;
            projectiles.push(
              new Projectile({
                pos: { ...this.pos },
                vel: {
                  x: Math.cos(angle) * GAME_BALANCE.TURRET.BULLET_SPEED * bulletSpeedMult,
                  y: Math.sin(angle) * GAME_BALANCE.TURRET.BULLET_SPEED * bulletSpeedMult,
                },
                damage: GAME_BALANCE.TURRET.BULLET_DAMAGE,
                radius: 4.5,
                color: '#ffb700',
                isPlayer: false,
                life: 3.0,
              })
            );
          });
        }
        break;
      }

      case 'leech': {
        const targetDist = 220;
        const distDiff = distToPlayer - targetDist;
        const radialSpeed = Math.sign(distDiff) * Math.min(100, Math.abs(distDiff) * 0.8) * speedMult;
        const tangentX = -dy / (distToPlayer || 1);
        const tangentY = dx / (distToPlayer || 1);

        this.vel.x = (dx / (distToPlayer || 1)) * radialSpeed + tangentX * 120 * speedMult + repX;
        this.vel.y = (dy / (distToPlayer || 1)) * radialSpeed + tangentY * 120 * speedMult + repY;

        if (distToPlayer < GAME_BALANCE.LEECH.TETHER_DISTANCE) {
          this.isTethering = true;
          player.energy = Math.max(0, player.energy - GAME_BALANCE.LEECH.ENERGY_DRAIN_RATE * dt);
          if (Math.random() < 0.2) {
            particles.push(
              new Particle(
                {
                  x: (this.pos.x + player.pos.x) / 2 + (Math.random() - 0.5) * 20,
                  y: (this.pos.y + player.pos.y) / 2 + (Math.random() - 0.5) * 20,
                },
                { x: 0, y: 0 },
                0.2,
                '#00f0ff',
                2,
                'spark'
              )
            );
          }
        } else {
          this.isTethering = false;
        }
        break;
      }

      case 'hacker': {
        const speed = 70 * speedMult;
        const targetX = -(dx / (distToPlayer || 1)) * speed + repX;
        const targetY = -(dy / (distToPlayer || 1)) * speed + repY;
        this.vel.x += (targetX - this.vel.x) * 3 * dt;
        this.vel.y += (targetY - this.vel.y) * 3 * dt;

        this.attackTimer -= dt * attackRateMult;
        if (this.attackTimer <= 0) {
          this.attackTimer = GAME_BALANCE.HACKER.HACK_COOLDOWN;
          particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.8, '#a855f7', 20, 'shockwave'));
          if (distToPlayer < GAME_BALANCE.HACKER.HACK_RANGE) {
            player.isHacked = true;
            player.hackTimer = GAME_BALANCE.HACKER.HACK_DURATION;
            player.heat = Math.min(100, player.heat + GAME_BALANCE.HACKER.HEAT_SPIKE);
          }
        }
        break;
      }
    }

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Bounds clamp
    const pad = this.radius + 5;
    this.pos.x = Math.max(pad, Math.min(arenaBounds.width - pad, this.pos.x));
    this.pos.y = Math.max(pad, Math.min(arenaBounds.height - pad, this.pos.y));
  }

  public takeDamage(dmg: number, particles: Particle[]): boolean {
    // If phased out, 70% chance to evade
    if (this.isPhasedOut && Math.random() < 0.7) {
      particles.push(new Particle(this.pos, { x: 0, y: -20 }, 0.4, '#a855f7', 12, 'text', 'PHASED'));
      return false;
    }

    this.hp -= dmg;
    particles.push(new Particle(this.pos, { x: 0, y: -20 }, 0.4, '#fff', 12, 'text', `-${Math.round(dmg)}`));
    if (this.hp <= 0) {
      this.dead = true;
      particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.4, '#ffb700', this.radius * 2, 'shockwave'));
      for (let i = 0; i < 8; i++) {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 140, y: (Math.random() - 0.5) * 140 },
            0.3 + Math.random() * 0.3,
            '#ff2a4b',
            3 + Math.random() * 3,
            'debris'
          )
        );
      }
      return true;
    }
    return false;
  }

  public draw(ctx: CanvasRenderingContext2D, playerPos: Vector2D) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);

    if (this.isPhasedOut) {
      ctx.globalAlpha = 0.35;
    }

    // Berserk aura
    if (this.berserkActive) {
      ctx.strokeStyle = '#ff3e3e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Charger windup telegraph laser
    if (this.type === 'charger' && this.state === 'windup') {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 42, 75, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.chargeDir.x * 600, this.chargeDir.y * 600);
      ctx.stroke();
      ctx.restore();
    }

    // Leech energy tether beam
    if (this.type === 'leech' && this.isTethering) {
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(playerPos.x - this.pos.x, playerPos.y - this.pos.y);
      ctx.stroke();
      ctx.restore();
    }

    // Rotate towards heading
    ctx.rotate(this.rotation);

    if (this.type === 'drone') {
      ctx.fillStyle = this.berserkActive ? '#3a0d14' : '#1e1e24';
      ctx.strokeStyle = this.cryoSlowTimer > 0 ? '#67e8f9' : '#ff2a4b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-8, 9);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-8, -9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#ff2a4b';
      ctx.beginPath();
      ctx.arc(3, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'charger') {
      ctx.fillStyle = '#1f1b24';
      ctx.strokeStyle = this.state === 'charging' ? '#ff2a4b' : '#ffb700';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(6, 14);
      ctx.lineTo(-14, 12);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-14, -12);
      ctx.lineTo(6, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front Ram
      ctx.fillStyle = this.state === 'charging' ? '#ff2a4b' : '#ffb700';
      ctx.fillRect(8, -8, 6, 16);
    } else if (this.type === 'turret') {
      ctx.fillStyle = '#131b2e';
      ctx.strokeStyle = this.cryoSlowTimer > 0 ? '#67e8f9' : '#ffb700';
      ctx.lineWidth = 2;

      // Base octagon
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Twin Gun Barrels
      ctx.fillStyle = '#ffb700';
      ctx.fillRect(4, -8, 16, 4);
      ctx.fillRect(4, 4, 16, 4);
    } else if (this.type === 'leech') {
      ctx.fillStyle = '#0a232e';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;

      // Diamond geometry
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(0, 12);
      ctx.lineTo(-14, 0);
      ctx.lineTo(0, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Siphon core
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'hacker') {
      ctx.fillStyle = '#261238';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;

      // Outer ring
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Inner polygon
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-8, 8);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-8, -8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Mini Health Bar above head
    if (this.hp < this.maxHp) {
      ctx.rotate(-this.rotation);
      const barW = this.radius * 2;
      const barH = 3;
      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(-barW / 2, -this.radius - 8, barW, barH);
      ctx.fillStyle = this.cryoSlowTimer > 0 ? '#67e8f9' : '#ff2a4b';
      ctx.fillRect(-barW / 2, -this.radius - 8, barW * hpPct, barH);
    }

    ctx.restore();
  }
}

