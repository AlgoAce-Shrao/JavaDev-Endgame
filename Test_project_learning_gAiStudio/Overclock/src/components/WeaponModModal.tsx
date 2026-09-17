import React, { useState } from 'react';
import {
  WeaponId,
  WeaponModSlotType,
  WeaponModDef,
  TelemetrySnapshot,
  WeaponDef,
} from '../game/types';
import { WEAPON_REGISTRY } from '../game/data/weapons';
import { WEAPON_MODS_REGISTRY } from '../game/data/weaponMods';
import {
  X,
  Sliders,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Zap,
  Flame,
  Snowflake,
  Shield,
  Crosshair,
  Columns,
  BatteryCharging,
  Cpu,
  Target,
  Sparkles,
  Activity,
  Disc,
  Repeat,
  Compass,
  ArrowRight,
  Grid,
  Wind,
  ShieldAlert,
  Radio,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface WeaponModModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: TelemetrySnapshot | null;
  onUnlockSlot: (weaponId: WeaponId, slotType: WeaponModSlotType) => void;
  onEquipMod: (weaponId: WeaponId, slotType: WeaponModSlotType, modId?: string) => void;
  onSelectWeapon: (idx: number) => void;
  calculateStats?: (weaponDef: WeaponDef) => any;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Columns,
  Crosshair,
  Target,
  Sparkles,
  Snowflake,
  BatteryCharging,
  Zap,
  Flame,
  Cpu,
  Activity,
  Disc,
  Repeat,
  Compass,
  ArrowRight,
  Grid,
  Wind,
  ShieldAlert,
  Radio,
};

const SLOT_NAMES: Record<WeaponModSlotType, { label: string; desc: string }> = {
  BARREL: { label: 'BARREL HOUSING', desc: 'Muzzle velocity, spread, split discharge' },
  MAGAZINE: { label: 'MAGAZINE / CAPACITOR', desc: 'Fire rate, energy drain, ammo synthesis' },
  CATALYST: { label: 'ELEMENTAL CATALYST', desc: 'Cryo freeze, thermite burn, tesla arcs' },
  ACCELERATOR: { label: 'KINETIC ACCELERATOR', desc: 'Ricochet, smart homing, piercing penetrator' },
  OVERCLOCK_CORE: { label: 'OVERCLOCK CORE', desc: 'Thermal siphon, shield vampire, singularity' },
};

const ALL_SLOTS: WeaponModSlotType[] = [
  'BARREL',
  'MAGAZINE',
  'CATALYST',
  'ACCELERATOR',
  'OVERCLOCK_CORE',
];

export const WeaponModModal: React.FC<WeaponModModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  onUnlockSlot,
  onEquipMod,
  onSelectWeapon,
  calculateStats,
}) => {
  const [selectedWeaponId, setSelectedWeaponId] = useState<WeaponId>(
    (telemetry?.activeWeapon?.id as WeaponId) || 'plasma'
  );
  const [activeSlotModal, setActiveSlotModal] = useState<WeaponModSlotType | null>(null);

  if (!isOpen || !telemetry) return null;

  const currentWeaponDef = WEAPON_REGISTRY[selectedWeaponId] || WEAPON_REGISTRY.plasma;
  const currentConfig = telemetry.weaponModConfigs?.[selectedWeaponId] || {
    weaponId: selectedWeaponId,
    slots: {
      BARREL: { slotType: 'BARREL', isUnlocked: true },
      MAGAZINE: { slotType: 'MAGAZINE', isUnlocked: false },
      CATALYST: { slotType: 'CATALYST', isUnlocked: false },
      ACCELERATOR: { slotType: 'ACCELERATOR', isUnlocked: false },
      OVERCLOCK_CORE: { slotType: 'OVERCLOCK_CORE', isUnlocked: false },
    },
  };

  // Safe calculation fallback
  const getCalculatedStats = (def: WeaponDef) => {
    if (calculateStats) return calculateStats(def);
    const config = telemetry.weaponModConfigs?.[def.id];
    let damageMult = 1.0;
    let fireRateMult = 1.0;
    let heatMult = 1.0;
    let speedMult = 1.0;
    let rangeMult = 1.0;
    let energyMult = 1.0;

    if (config?.slots) {
      config.slots.forEach((slot) => {
        if (slot?.unlocked && slot.equippedModId) {
          const mod = WEAPON_MODS_REGISTRY[slot.equippedModId];
          if (mod) {
            if (mod.damageMult) damageMult *= mod.damageMult;
            if (mod.fireRateMult) fireRateMult *= mod.fireRateMult;
            if (mod.heatPerShotMult) heatMult *= mod.heatPerShotMult;
            if (mod.speedMult) speedMult *= mod.speedMult;
            if (mod.rangeMult) rangeMult *= mod.rangeMult;
            if (mod.energyPerShotMult) energyMult *= mod.energyPerShotMult;
          }
        }
      });
    }

    const finalDamage = Math.round(def.damage * damageMult);
    const finalFireRate = +(def.fireRate * fireRateMult).toFixed(1);
    const finalHeat = +(def.heatPerShot * heatMult).toFixed(1);
    const finalSpeed = Math.round(def.projectileSpeed * speedMult);
    const finalRange = Math.round(def.range * rangeMult);
    const finalEnergy = +(def.energyPerShot * energyMult).toFixed(1);
    const dps = +(finalDamage * finalFireRate).toFixed(1);

    return {
      damage: finalDamage,
      fireRate: finalFireRate,
      dps,
      heat: finalHeat,
      speed: finalSpeed,
      range: finalRange,
      energy: finalEnergy,
    };
  };

  const calculated = getCalculatedStats(currentWeaponDef);

  const weaponList = Object.values(WEAPON_REGISTRY);

  const handleClose = () => {
    soundSynth.playUiClick();
    onClose();
  };

  const handleSelectWeaponTab = (wId: WeaponId) => {
    setSelectedWeaponId(wId);
    soundSynth.playUiClick();
    const idx = (telemetry.availableWeapons || []).findIndex((w) => w.id === wId);
    if (idx >= 0) {
      onSelectWeapon(idx);
    }
  };

  const getAvailableModsForSlot = (slotType: WeaponModSlotType) => {
    return Object.values(WEAPON_MODS_REGISTRY).filter((m) => m.slotType === slotType);
  };

  return (
    <div
      id="weapon-mod-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none font-mono"
      onClick={handleClose}
    >
      <div
        id="weapon-mod-modal-container"
        className="w-full max-w-5xl max-h-[92vh] bg-[#070907] border-2 border-[#00ff9f] p-4 sm:p-6 shadow-[0_0_40px_rgba(0,255,159,0.25)] flex flex-col text-[#00ff9f] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00ff9f]/10 border border-[#00ff9f]/30 text-[#00ff9f]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-widest text-white">
                ARMAMENT MODIFICATION MATRIX
              </h2>
              <div className="text-[10px] text-white/50">
                CYBERNETIC MODULAR COMPONENT ASSEMBLY // VX-01 TECH SPEC
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Cyber Credits Balance */}
            <div className="flex items-center gap-2 bg-[#0a1a14] border border-[#00ff9f]/40 px-3 py-1 text-xs">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-white/60">CREDITS:</span>
              <span className="font-bold text-amber-400">
                {(telemetry.cyberCredits || 0).toLocaleString()} CC
              </span>
            </div>

            <button
              onClick={handleClose}
              className="p-1 hover:bg-[#00ff9f]/20 border border-[#00ff9f]/40 text-white hover:text-[#00ff9f] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weapons Tab Selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-[#00ff9f]/20 mb-3 shrink-0">
          {weaponList.map((wpn) => {
            const isSelected = selectedWeaponId === wpn.id;
            return (
              <button
                key={wpn.id}
                id={`tab-weapon-${wpn.id}`}
                onClick={() => handleSelectWeaponTab(wpn.id)}
                className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-[#00ff9f] text-black border-[#00ff9f] shadow-[0_0_10px_#00ff9f]'
                    : 'bg-black/40 text-white/70 border-white/10 hover:border-[#00ff9f]/50 hover:text-white'
                }`}
              >
                {wpn.name}
              </button>
            );
          })}
        </div>

        {/* Body Layout: 5 Slots (Left/Center) + Calculated Telemetry Specs (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto pr-1">
          {/* LEFT 2 COLS: 5 Weapon Mod Slots */}
          <div className="lg:col-span-2 space-y-2.5">
            {ALL_SLOTS.map((slotType) => {
              const slotStatus = currentConfig?.slots?.find((s) => s.slotType === slotType) || {
                slotType,
                unlocked: slotType === 'BARREL' || slotType === 'MAGAZINE',
                unlockCost: 300,
                equippedModId: undefined,
              };

              const equippedMod = slotStatus.equippedModId
                ? WEAPON_MODS_REGISTRY[slotStatus.equippedModId]
                : undefined;

              const slotInfo = SLOT_NAMES[slotType];
              const IconComp = equippedMod ? ICON_MAP[equippedMod.icon] || Sliders : Sliders;

              return (
                <div
                  key={slotType}
                  id={`mod-slot-card-${slotType}`}
                  className={`border p-3 transition-all ${
                    slotStatus.unlocked
                      ? equippedMod
                        ? 'border-[#00ff9f] bg-[#00ff9f]/5 shadow-[0_0_12px_rgba(0,255,159,0.15)]'
                        : 'border-[#00ff9f]/30 bg-black/40'
                      : 'border-white/10 bg-black/60 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 border text-xs ${
                          slotStatus.unlocked
                            ? equippedMod
                              ? 'border-[#00ff9f] bg-[#00ff9f]/20 text-[#00ff9f]'
                              : 'border-[#00ff9f]/30 text-white/50'
                            : 'border-white/10 text-white/30'
                        }`}
                      >
                        {slotStatus.unlocked ? (
                          <IconComp className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#ff3e3e]" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-white tracking-wider">
                            {slotInfo.label}
                          </span>
                          <span className="text-[9px] text-white/40">[{slotType}]</span>
                        </div>
                        <div className="text-[10px] text-white/60">{slotInfo.desc}</div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div>
                      {!slotStatus.unlocked ? (
                        <button
                          id={`btn-unlock-${slotType}`}
                          onClick={() => onUnlockSlot(selectedWeaponId, slotType)}
                          className="px-3 py-1.5 bg-[#1a140a] hover:bg-amber-400 hover:text-black text-amber-400 border border-amber-400/60 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-[0_0_8px_rgba(251,191,36,0.2)]"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>UNLOCK ({slotStatus.unlockCost} CC)</span>
                        </button>
                      ) : equippedMod ? (
                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-swap-mod-${slotType}`}
                            onClick={() => setActiveSlotModal(slotType)}
                            className="px-2.5 py-1 bg-[#0a1a14] hover:bg-[#00ff9f]/20 border border-[#00ff9f]/50 text-[#00ff9f] text-xs font-bold cursor-pointer"
                          >
                            CHANGE
                          </button>
                          <button
                            id={`btn-remove-mod-${slotType}`}
                            onClick={() => onEquipMod(selectedWeaponId, slotType, undefined)}
                            title="Remove Mod"
                            className="p-1.5 bg-[#1a070a] hover:bg-[#ff3e3e]/20 border border-[#ff3e3e]/40 text-[#ff3e3e] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`btn-attach-mod-${slotType}`}
                          onClick={() => setActiveSlotModal(slotType)}
                          className="px-3 py-1.5 bg-[#00ff9f]/10 hover:bg-[#00ff9f] hover:text-black text-[#00ff9f] border border-[#00ff9f]/40 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ATTACH COMPONENT</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Equipped Mod Detail Banner */}
                  {slotStatus.unlocked && equippedMod && (
                    <div className="mt-2.5 pt-2 border-t border-[#00ff9f]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-[11px]">
                            {equippedMod.name}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 bg-[#00ff9f]/10 border border-[#00ff9f]/30 text-[#00ff9f]">
                            {equippedMod.rarity}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#00ff9f]/90 mt-0.5">
                          {equippedMod.statsDescription}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COL: Real-time Calculated Weapon Performance */}
          <div className="border border-[#00ff9f]/30 bg-black/60 p-4 space-y-3.5 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="border-b border-[#00ff9f]/20 pb-2 mb-3">
                <div className="text-[10px] text-white/50 uppercase">CALCULATED SPECS</div>
                <div className="text-base font-black text-white uppercase flex items-center justify-between">
                  <span>{currentWeaponDef.name}</span>
                  <span className="text-xs text-[#00ff9f]">DPS ~{calculated.dps}</span>
                </div>
                <div className="text-[10px] text-white/60 mt-0.5">
                  {currentWeaponDef.description}
                </div>
              </div>

              {/* Stats matrix */}
              <div className="space-y-2">
                <div className="flex justify-between bg-[#0a1a14] p-1.5 border border-[#00ff9f]/20">
                  <span className="text-white/60">DAMAGE PER SHOT</span>
                  <span className="font-bold text-white">
                    {calculated.damage}{' '}
                    {calculated.burstCount > 1 && `(x${calculated.burstCount})`}
                  </span>
                </div>

                <div className="flex justify-between bg-[#0a1a14] p-1.5 border border-[#00ff9f]/20">
                  <span className="text-white/60">FIRE RATE</span>
                  <span className="font-bold text-[#00ff9f]">
                    {calculated.fireRate} rps
                  </span>
                </div>

                <div className="flex justify-between bg-[#0a1a14] p-1.5 border border-[#00ff9f]/20">
                  <span className="text-white/60">HEAT GENERATION</span>
                  <span className="font-bold text-[#ff3e3e]">
                    +{calculated.heatPerShot}% / shot
                  </span>
                </div>

                <div className="flex justify-between bg-[#0a1a14] p-1.5 border border-[#00ff9f]/20">
                  <span className="text-white/60">ENERGY CONSUMPTION</span>
                  <span className="font-bold text-sky-400">
                    {calculated.energyPerShot} J
                  </span>
                </div>

                <div className="flex justify-between bg-[#0a1a14] p-1.5 border border-[#00ff9f]/20">
                  <span className="text-white/60">EFFECTIVE RANGE</span>
                  <span className="font-bold text-white">
                    {calculated.range} px
                  </span>
                </div>

                <div className="flex justify-between bg-[#0a1a14] p-1.5 border border-[#00ff9f]/20">
                  <span className="text-white/60">PROJECTILE VELOCITY</span>
                  <span className="font-bold text-white">
                    {calculated.projectileSpeed} px/s
                  </span>
                </div>
              </div>

              {/* Active Special Traits */}
              <div className="mt-3 pt-2.5 border-t border-[#00ff9f]/20">
                <div className="text-[10px] text-white/50 uppercase mb-1.5 font-bold">
                  ACTIVE MOD ATTRIBUTES
                </div>
                {calculated.specialEffects && calculated.specialEffects.length > 0 ? (
                  <div className="space-y-1">
                    {calculated.specialEffects.map((eff: string, i: number) => (
                      <div
                        key={i}
                        className="text-[10px] text-[#00ff9f] bg-[#00ff9f]/10 px-2 py-0.5 border border-[#00ff9f]/30 flex items-center gap-1.5"
                      >
                        <ChevronRight className="w-3 h-3 text-[#00ff9f]" />
                        <span>{eff}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-white/40 italic">
                    No custom status catalysts attached.
                  </div>
                )}
              </div>
            </div>

            {/* Quick action: Set as Active Rig Weapon */}
            <button
              onClick={() => {
                const idx = (telemetry.availableWeapons || []).findIndex(
                  (w) => w.id === selectedWeaponId
                );
                if (idx >= 0) {
                  onSelectWeapon(idx);
                  soundSynth.playUiClick();
                }
              }}
              className="w-full py-2 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black text-xs cursor-pointer transition-all shadow-[0_0_12px_#00ff9f]"
            >
              EQUIP AS PRIMARY RIG WEAPON
            </button>
          </div>
        </div>

        {/* Modal Sub-drawer: Pick Mod for Active Slot */}
        {activeSlotModal && (
          <div
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setActiveSlotModal(null)}
          >
            <div
              className="w-full max-w-2xl bg-[#070907] border-2 border-[#00ff9f] p-5 shadow-[0_0_30px_rgba(0,255,159,0.3)] space-y-4 max-h-[85vh] flex flex-col font-mono"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-2">
                <div>
                  <h3 className="text-sm font-black text-white">
                    SELECT COMPONENT // {activeSlotModal}
                  </h3>
                  <div className="text-[10px] text-white/50">
                    Choose an augmentation to attach to {currentWeaponDef.name}
                  </div>
                </div>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  className="p-1 hover:bg-[#00ff9f]/20 border border-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {getAvailableModsForSlot(activeSlotModal).map((mod) => {
                  const IconMod = ICON_MAP[mod.icon] || Sliders;
                  const isCurrent =
                    currentConfig?.slots?.find((s) => s.slotType === activeSlotModal)
                      ?.equippedModId === mod.id;

                  return (
                    <div
                      key={mod.id}
                      id={`mod-choice-${mod.id}`}
                      className={`border p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all ${
                        isCurrent
                          ? 'border-[#00ff9f] bg-[#00ff9f]/10 shadow-[0_0_10px_#00ff9f]'
                          : 'border-[#00ff9f]/30 bg-black/50 hover:border-[#00ff9f]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#00ff9f]/10 border border-[#00ff9f]/30 text-[#00ff9f] mt-0.5">
                          <IconMod className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-xs">
                              {mod.name}
                            </span>
                            <span className="text-[9px] px-1 bg-white/10 text-white/70">
                              {mod.code}
                            </span>
                            <span className="text-[9px] px-1 bg-[#00ff9f]/10 border border-[#00ff9f]/30 text-[#00ff9f]">
                              {mod.rarity}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/60 mt-0.5">
                            {mod.description}
                          </p>
                          <div className="text-[11px] font-bold text-[#00ff9f] mt-1">
                            {mod.statsDescription}
                          </div>
                        </div>
                      </div>

                      <button
                        id={`btn-install-${mod.id}`}
                        onClick={() => {
                          onEquipMod(selectedWeaponId, activeSlotModal, mod.id);
                          setActiveSlotModal(null);
                        }}
                        className={`px-3 py-1.5 text-xs font-black cursor-pointer whitespace-nowrap transition-all ${
                          isCurrent
                            ? 'bg-[#0a1a14] text-[#00ff9f] border border-[#00ff9f]'
                            : 'bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black border border-[#00ff9f]'
                        }`}
                      >
                        {isCurrent ? 'EQUIPPED' : 'INSTALL COMPONENT'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
