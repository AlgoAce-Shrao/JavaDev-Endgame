export interface DemoStepDef {
  id: number;
  code: string;
  title: string;
  instruction: string;
  actionPrompt: string;
  targetCount: number;
  spawnDrones: number;
  spawnChargers: number;
  forceOverclockAvailable?: boolean;
}

export const DEMO_SCENARIO_STEPS: DemoStepDef[] = [
  {
    id: 1,
    code: 'STEP 01/05',
    title: 'PROPULSION & AIM CALIBRATION',
    instruction: 'Engage ion thrusters and calibrate targeting reticle.',
    actionPrompt: 'Use WASD to move and Mouse to aim reticle',
    targetCount: 1,
    spawnDrones: 0,
    spawnChargers: 0,
  },
  {
    id: 2,
    code: 'STEP 02/05',
    title: 'KINETIC TARGET ACQUISITION',
    instruction: 'Hostile security drones incoming. Engage with primary Plasma Cannon.',
    actionPrompt: 'Left-Click to fire and neutralize the 2 target drones',
    targetCount: 2,
    spawnDrones: 2,
    spawnChargers: 0,
  },
  {
    id: 3,
    code: 'STEP 03/05',
    title: 'THERMAL THRESHOLD INSPECTION',
    instruction: 'Continuous fire generates heat. Watch the HUD Heat Gauge in the center.',
    actionPrompt: 'Build heat past 50%, then route power or release trigger to cool down',
    targetCount: 1,
    spawnDrones: 1,
    spawnChargers: 0,
  },
  {
    id: 4,
    code: 'STEP 04/05',
    title: 'SIGNATURE OVERCLOCK ACTIVATION',
    instruction: 'Trigger the Overclock core (Q) to experience 300% fire rate and temporary zero heat generation!',
    actionPrompt: 'Press [ Q ] to ENGAGE OVERCLOCK and eradicate the strike wave',
    targetCount: 3,
    spawnDrones: 3,
    spawnChargers: 1,
    forceOverclockAvailable: true,
  },
  {
    id: 5,
    code: 'STEP 05/05',
    title: 'TACTICAL ELITE BATTLE',
    instruction: 'Heavy combat units deployed. Switch weapons (1-4) and power routes (F1-F4) for maximum efficiency.',
    actionPrompt: 'Neutralize the elite combat squad to conclude evaluation',
    targetCount: 4,
    spawnDrones: 2,
    spawnChargers: 2,
  },
];
