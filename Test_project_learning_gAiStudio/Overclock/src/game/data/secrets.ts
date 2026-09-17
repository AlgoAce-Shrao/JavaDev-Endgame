export interface SecretCommandResult {
  success: boolean;
  message: string;
  action?:
    | 'UNLOCK_ALL_WEAPONS'
    | 'SUPERCHARGE'
    | 'ZERO_HEAT'
    | 'TOGGLE_COLOR'
    | 'SHOW_LORE'
    | 'ADMIN_ACCESS'
    | 'UNSAFE_ROOT'
    | 'AI_OPINION'
    | 'ADD_CREDITS';
}

export const SECRETS_DATA = {
  supercriticalWindow: {
    minHeat: 95,
    maxHeat: 99.9,
    bonusSeconds: 3.5,
    description: 'Triggering Overclock while at 95-99% heat triggers Supercritical Surge (0 heat generation + maximum fire rate)!',
  },
  commands: {
    help: 'Available commands: sys.status, sys.override, overclock.unlimit, lore.logs, secret.colorway, sudo overclock --unsafe, ai.opinion, admin.bypass, whoami, clear',
    'sys.status': 'VX-01 EXPERIMENTAL COMBAT UNIT // OS v4.19.8 // ALL SUBSYSTEMS NOMINAL.',
    'sys.override': 'SAFETY PROTOCOLS BYPASSED: All experimental weapon modules unlocked!',
    'overclock.unlimit': 'REACTOR FLOW BYPASS: Instant 100% Energy & 0% Heat granted.',
    'lore.logs': 'ARCHIVE ENTRY #894: Project OVERCLOCK was designed to test if biological pilots could survive 300% core overclocking without total cerebral breakdown.',
    'secret.colorway': 'TACTICAL VISUAL OVERRIDE: Phosphor green amber monochrome palette toggled.',
    'sudo overclock --unsafe': 'ROOT ELEVATION SUCCESSFUL: Governor limiters disabled. Achievement [UNREGULATED ROOT] unlocked.',
    'ai.opinion': 'TACTICAL AI EVALUATION: "You are either a tactical genius or completely indifferent to self-preservation."',
    'admin.bypass': 'ADMIN OVERRIDE: Protocol [INFINITE RESONANCE] unlocked + 500 Cyber Credits allocated.',
    whoami: 'PILOT UNIT VX-01 // EXPERIMENTAL NEURAL LINK: ACTIVE // CLEARANCE: LEVEL 5',
    'credits.grant': 'FINANCIAL INJECTION: 250 Cyber Credits added to account.',
    clear: 'CLEAR',
  } as Record<string, string>,
};
