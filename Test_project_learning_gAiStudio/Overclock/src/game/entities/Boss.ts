import { Vector2D, BossSubsystem, BossSubsystemId } from '../types';
import { Projectile } from './Projectile';
import { Particle } from './Particle';
import { Player } from './Player';
import { GAME_BALANCE } from '../data/balanceConfig';

export class Boss {
  public pos: Vector2D;
  public vel: Vector2D = { x: 0, y: 0 };
  public radius: number = 48;
  public angle: number = 0;

  // Boss Health & Phases
  public maxHp: number = GAME_BALANCE.BOSS.MAX_HP;
  public hp: number = GAME_BALANCE.BOSS.MAX_HP;
  public phase: number = 1;
  public dead: boolean = false;
  public isEntering: boolean = true;
  public entranceTimer: number = 2.5;

  // Subsystems
  public subsystems: BossSubsystem[] = [
    { id: 'shield', name: 'MATRIX SHIELD', hp: 280, maxHp: 280, destroyed: false, angleOffset: 0 },
    { id: 'weapons', name: 'GATLING ARRAY', hp: 320, maxHp: 320, destroyed: false, angleOffset: Math.PI / 2 },
    { id: 'engine', name: 'THRUSTER RELAY', hp: 260, maxHp: 260, destroyed: false, angleOffset: Math.PI },
    { id: 'core', name: 'MAINFRAME CORE', hp: GAME_BALANCE.BOSS.MAX_HP, maxHp: GAME_BALANCE.BOSS.MAX_HP, destroyed: false, angleOffset: (Math.PI * 3) / 2 },
  ];

  // Attack timers
  public attackTimer: number = 1.0;
  public specialTimer: number = GAME_BALANCE.BOSS.SPECIAL_COOLDOWN;
  public ringAngle: number = 0;
  public spawnTimer: number = GAME_BALANCE.BOSS.REINFORCEMENT_SPAWN_TIMER;

  constructor(x: number, y: number) {
    this.pos = { x, y };
  }

  public getSubsystem(id: BossSubsystemId): BossSubsystem | undefined {
    return this.subsystems.find((s) => s.id === id);
  }

  public update(
    dt: number,
    player: Player,
    projectiles: Projectile[],
    particles: Particle[],
    arenaBounds: { width: number; height: number },
    onSpawnReinforcements: () => void
  ) {
    if (this.dead) return;

    // Cinematic Entrance State
    if (this.isEntering) {
      this.entranceTimer -= dt;
      this.ringAngle += 2.5 * dt;

      // Spawn dramatic lightning sparks
      if (Math.random() < 0.3) {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 160 },
            0.5,
            '#ff2a4b',
            6,
            'spark'
          )
        );
      }

      if (this.entranceTimer <= 0) {
        this.isEntering = false;
      }
      return;
    }

    this.ringAngle += 0.8 * dt;
    const dx = player.pos.x - this.pos.x;
    const dy = player.pos.y - this.pos.y;
    const dist = Math.hypot(dx, dy);
    this.angle = Math.atan2(dy, dx);

    // Phase transitions based on HP
    const hpRatio = this.hp / this.maxHp;
    if (hpRatio <= 0.25) {
      this.phase = 4;
    } else if (hpRatio <= 0.55) {
      this.phase = 3;
    } else if (hpRatio <= 0.8) {
      this.phase = 2;
    }

    // Boss Movement (Engine subsystem accelerates if alive)
    const engineSys = this.getSubsystem('engine');
    const engineAlive = engineSys && !engineSys.destroyed;
    const moveSpeed = engineAlive ? (this.phase === 4 ? 120 : 60) : 25;

    // Orbit around arena center
    const centerX = arenaBounds.width / 2;
    const centerY = arenaBounds.height / 2;
    const cdx = centerX - this.pos.x;
    const cdy = centerY - this.pos.y;
    this.vel.x += (cdx * 0.2 + (Math.random() - 0.5) * moveSpeed - this.vel.x) * 2 * dt;
    this.vel.y += (cdy * 0.2 + (Math.random() - 0.5) * moveSpeed - this.vel.y) * 2 * dt;

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Weapon Subsystem attacks
    const weaponsSys = this.getSubsystem('weapons');
    const weaponsAlive = weaponsSys && !weaponsSys.destroyed;

    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
      this.attackTimer = weaponsAlive ? (this.phase === 4 ? 0.8 : GAME_BALANCE.BOSS.ATTACK_COOLDOWN_BASE) : 2.8;

      if (this.phase === 1) {
        // Radial 6-shot pattern
        for (let i = 0; i < 6; i++) {
          const a = this.ringAngle + (i * Math.PI) / 3;
          projectiles.push(
            new Projectile({
              pos: { ...this.pos },
              vel: { x: Math.cos(a) * 260, y: Math.sin(a) * 260 },
              damage: GAME_BALANCE.BOSS.PHASE1_DAMAGE,
              radius: 5,
              color: '#ff2a4b',
              isPlayer: false,
              life: 3.5,
            })
          );
        }
      } else if (this.phase === 2) {
        // Aimed 3-bolt fan + radial
        for (let i = -1; i <= 1; i++) {
          const a = this.angle + i * 0.22;
          projectiles.push(
            new Projectile({
              pos: { ...this.pos },
              vel: { x: Math.cos(a) * 360, y: Math.sin(a) * 360 },
              damage: GAME_BALANCE.BOSS.PHASE2_DAMAGE,
              radius: 6,
              color: '#ffb700',
              isPlayer: false,
              life: 3.5,
            })
          );
        }
      } else if (this.phase >= 3) {
        // Spiral barrage
        for (let i = 0; i < 8; i++) {
          const a = this.ringAngle * 2 + (i * Math.PI) / 4;
          projectiles.push(
            new Projectile({
              pos: { ...this.pos },
              vel: { x: Math.cos(a) * 310, y: Math.sin(a) * 310 },
              damage: GAME_BALANCE.BOSS.PHASE3_DAMAGE,
              radius: 5.5,
              color: '#a855f7',
              isPlayer: false,
              life: 4.0,
            })
          );
        }
      }
    }

    // Special Phase Attacks
    this.specialTimer -= dt;
    if (this.specialTimer <= 0) {
      this.specialTimer = GAME_BALANCE.BOSS.SPECIAL_COOLDOWN;
      if (this.phase >= 3) {
        // Hack shockwave
        particles.push(new Particle(this.pos, { x: 0, y: 0 }, 1.2, '#a855f7', 40, 'shockwave'));
        if (dist < 480) {
          player.isHacked = true;
          player.hackTimer = GAME_BALANCE.BOSS.HACK_DURATION;
        }
      }
    }

    // Reinforcements
    if (this.phase >= 2) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.phase === 4 ? 8.0 : GAME_BALANCE.BOSS.REINFORCEMENT_SPAWN_TIMER;
        onSpawnReinforcements();
      }
    }
  }

  public takeDamage(dmg: number, particles: Particle[], isOverclocked: boolean): boolean {
    const shieldSys = this.getSubsystem('shield');
    const shieldAlive = shieldSys && !shieldSys.destroyed;

    // If shield is active, it mitigates 60% of damage unless player is in OVERCLOCK!
    let effectiveDmg = dmg;
    if (shieldAlive && !isOverclocked) {
      effectiveDmg *= 0.4;
      shieldSys.hp = Math.max(0, shieldSys.hp - dmg * 0.6);
      if (shieldSys.hp <= 0) {
        shieldSys.destroyed = true;
        particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.6, '#00f0ff', 60, 'shockwave'));
      }
    }

    this.hp -= effectiveDmg;
    particles.push(new Particle(this.pos, { x: 0, y: -40 }, 0.5, '#ff2a4b', 16, 'text', `-${Math.round(effectiveDmg)}`));

    // Also damage other subsystems
    const weaponsSys = this.getSubsystem('weapons');
    if (weaponsSys && !weaponsSys.destroyed && this.hp < 700) {
      weaponsSys.hp -= effectiveDmg * 0.5;
      if (weaponsSys.hp <= 0) {
        weaponsSys.destroyed = true;
        particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.6, '#ffb700', 50, 'shockwave'));
      }
    }

    const engineSys = this.getSubsystem('engine');
    if (engineSys && !engineSys.destroyed && this.hp < 400) {
      engineSys.hp -= effectiveDmg * 0.5;
      if (engineSys.hp <= 0) {
        engineSys.destroyed = true;
        particles.push(new Particle(this.pos, { x: 0, y: 0 }, 0.6, '#a855f7', 50, 'shockwave'));
      }
    }

    if (this.hp <= 0) {
      this.dead = true;
      this.hp = 0;
      for (let i = 0; i < 30; i++) {
        particles.push(
          new Particle(
            this.pos,
            { x: (Math.random() - 0.5) * 320, y: (Math.random() - 0.5) * 320 },
            0.6 + Math.random() * 0.8,
            Math.random() > 0.5 ? '#ff2a4b' : '#ffb700',
            6 + Math.random() * 6,
            'debris'
          )
        );
      }
      return true;
    }
    return false;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);

    // Shield Dome
    const shieldSys = this.getSubsystem('shield');
    if (shieldSys && !shieldSys.destroyed) {
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Outer Orbiting Subsystem Nodes
    this.subsystems.forEach((sub) => {
      const angle = this.ringAngle + sub.angleOffset;
      const subX = Math.cos(angle) * (this.radius + 12);
      const subY = Math.sin(angle) * (this.radius + 12);

      ctx.save();
      ctx.translate(subX, subY);
      ctx.fillStyle = sub.destroyed ? '#334155' : '#1e1b4b';
      ctx.strokeStyle = sub.destroyed ? '#475569' : (sub.id === 'shield' ? '#00f0ff' : '#ff2a4b');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // Core Fortress Chassis
    ctx.rotate(this.angle);

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = this.phase === 4 ? '#ff2a4b' : '#a855f7';
    ctx.lineWidth = 3;

    // Dodecagon Hull
    ctx.beginPath();
    const sides = 8;
    for (let i = 0; i < sides; i++) {
      const a = (i * Math.PI * 2) / sides;
      const x = Math.cos(a) * this.radius;
      const y = Math.sin(a) * this.radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Pulsing Core Eye
    const pulse = Math.sin(Date.now() * 0.008) * 4;
    ctx.fillStyle = this.phase === 4 ? '#ff2a4b' : '#ffb700';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, 0, 16 + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
