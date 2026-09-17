# OVERCLOCK — Landing Page

## Overview
The landing page is the public entry point for OVERCLOCK. It presents the game's story, showcases gameplay pillars, and provides CTAs to enter the game or try demo mode. The visual language matches the game's sci-fi facility terminal aesthetic.

## Visual Language
- **Style**: Sci-fi facility terminal (NOT generic SaaS)
- **Colors**: Pitch black `#050605`, tactical green `#00ff9f`, crimson `#ff3e3e`, amber `#ffaa00`
- **Typography**: Monospace, sharp, uppercase, tracking-widest
- **Effects**: Scanlines, grid backdrop, concentric rings, glitch effects
- **Borders**: Sharp 0px radius, 1-2px borders, no rounded corners

## Sections

### 1. Hero Section
- **Title**: "OVERCLOCK" (large, glitch effect)
- **Subtitle**: "VX-01" badge
- **Tagline**: "HOW FAR CAN YOU PUSH THE MACHINE BEFORE IT PUSHES BACK?"
- **Primary CTA**: "ENTER THE FACILITY" (triggers Google OAuth)
- **Secondary CTA**: "DEMO MODE" (bypasses auth, starts demo)
- **Background**: Concentric radar rings, grid pattern

### 2. Story Section
Five story panels with staggered reveal animation:

**THE FACILITY**
> Humanity no longer sends soldiers into the most dangerous facilities.
> It sends machines.

**THE MACHINE**
> VX-01 was designed to survive where humans couldn't.
> A combat platform capable of temporarily exceeding its own operating limits.
> The system was called: OVERCLOCK.

**THE INCIDENT**
> But during the final testing phase...
> VX-01 stopped following commands.
> The facility was sealed. The Administrator took control.
> Every previous operator failed.

**THE OPERATOR**
> Now the system has been reactivated.
> And you're inside.
> THE QUESTION ISN'T WHETHER VX-01 CAN SURVIVE.
> HOW FAR WILL YOU PUSH IT?

### 3. Gameplay Pillars Section
Grid of 5 gameplay pillar cards:
- **COMBAT**: 8 weapons, 5 enemy types
- **OVERCLOCK**: Risk vs reward mechanic
- **POWER ROUTING**: 4-channel reactor management
- **ADAPTATION**: Roguelite upgrades, weapon modding
- **SURVIVAL**: Thermal management, edge-of-death scoring

### 4. Final CTA Section
> THE FACILITY IS WAITING
> ARE YOU READY, OPERATOR?
> [ENTER THE FACILITY]

## Navigation Flow

### Landing → Auth → Game
```
Landing Page
  → "Enter the Facility"
    → Google OAuth2 redirect
      → Callback with session
        → "Facility Access Granted" screen
          → New user → Onboarding (ZIX)
          → Returning user → Boot Screen → Mission Select
```

### Landing → Demo (No Auth)
```
Landing Page
  → "Demo Mode"
    → Skip auth
      → Game Engine in demo mode
        → 5-step demo scenario
```

## Implementation

### Component
- Location: `src/components/LandingPage.tsx`
- Props: `onEnterFacility`, `onStartDemoMode`
- Self-contained (no external dependencies beyond SoundSynth)

### Integration in App.tsx
- `showLanding` state controls visibility
- Default state: `true` (landing is the entry point)
- Set to `false` when auth succeeds or demo starts

### Performance
- No canvas rendering (pure HTML/CSS/JS)
- CSS animations (no JS animation loops)
- Staggered reveal with `setTimeout`
- Lazy content (below-the-fold sections load via scroll)

### Responsive Behavior
- Full-width sections
- Mobile-friendly layout
- Touch-friendly CTAs
- Text scales with viewport

## Audio
- UI click sound on CTA button clicks
- SoundSynth initialized on first interaction
