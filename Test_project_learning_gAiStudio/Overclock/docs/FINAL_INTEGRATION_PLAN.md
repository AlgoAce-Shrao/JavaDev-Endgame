# OVERCLOCK — Final Integration Plan

## 1. Existing Architecture

### Frontend
- **Framework**: React 19 + TypeScript 5.8
- **Styling**: Tailwind CSS 4 (via Vite plugin)
- **Build**: Vite 6
- **Icons**: lucide-react
- **Motion**: motion/react (for transitions)
- **Rendering**: HTML5 Canvas 2D (game) + React overlays (UI)
- **Audio**: Web Audio API procedural synthesizer (zero external assets)
- **No routing library** — single-page app with mode-based rendering

### Backend
- **Before**: None (purely client-side)
- **After**: Minimal Express server for Google OAuth2 authentication
  - `server.ts` — Express server with OAuth2 callback handling
  - Session-based authentication via `express-session`
  - Serves static frontend build in production

### State Management
- `GameEngine` class: Master game state coordinator (mode-based)
- React `useState` hooks in `App.tsx`: UI overlay state
- `SaveSystem` singleton: localStorage persistence (`OVERCLOCK_CAMPAIGN_SAVE_V2`)
- `AuthContext` (NEW): React context for authentication state

### Persistence
- localStorage via `SaveSystem` class
- Session cookies via `express-session` (server-side)

## 2. Existing Gameplay Systems
All gameplay systems are preserved unchanged:
- GameEngine (game loop, input, physics, collision)
- Player (movement, dash, heat, overclock, shield, energy)
- Enemy system (5 types with unique behaviors)
- Boss system (4-phase Administrator)
- Projectile & Particle systems
- PowerSystem (4-channel allocation)
- TacticalAI (commentary)
- AICommentarySystem (contextual reactions)
- DemoModeSystem (5-step demo)
- AchievementSystem
- OperatorProfileSystem

## 3. New Features Added

### Feature 1: Google OAuth2 Authentication
**Files created:**
- `server.ts` — Express backend with OAuth2 flow
- `src/game/auth/AuthContext.tsx` — React auth context + provider
- `src/components/AuthScreen.tsx` — Auth UI (loading, granted, error, user badge)

**Files modified:**
- `package.json` — Added `express-session`, `@types/express-session`
- `.env.example` — Added OAuth2 environment variables
- `index.html` — Updated metadata
- `src/main.tsx` — Wrapped with `AuthProvider`
- `src/App.tsx` — Integrated auth flow
- `src/components/PauseModal.tsx` — Added logout button

### Feature 2: First-Time Player Onboarding
**Files created:**
- `src/game/systems/OnboardingSystem.ts` — Tutorial state machine
- `src/components/OnboardingOverlay.tsx` — Tutorial UI overlay
- `src/components/ZIXCharacter.tsx` — ZIX guide character (SVG)

**Files modified:**
- `src/components/BootScreen.tsx` — Added Replay Tutorial button
- `src/App.tsx` — Integrated onboarding flow

### Feature 3: Story-Driven Landing Page
**Files created:**
- `src/components/LandingPage.tsx` — Public landing page

**Files modified:**
- `src/App.tsx` — Added landing page as entry point

## 4. Application Flow

### New Player Flow
```
Landing Page
  → "Enter the Facility"
    → Google OAuth2
      → Auth Callback
        → Facility Access Granted
          → Onboarding (ZIX Tutorial)
            → Tutorial Steps (Movement → Aim → Shoot → Switch → Dash → Heat → Cooling → Overclock → Combat)
              → Campaign Initialization
                → Mission 01
```

### Returning Player Flow
```
Landing Page
  → "Enter the Facility"
    → Google OAuth2
      → Auth Callback
        → Facility Access Granted
          → Boot Screen → Mission Select
```

### Demo Mode Flow
```
Landing Page
  → "Demo Mode"
    → Game (no auth required)
```

## 5. Files That MUST Remain Untouched
- `src/game/systems/GameEngine.ts` (except minor integration hooks)
- `src/game/entities/Player.ts`
- `src/game/entities/Enemy.ts`
- `src/game/entities/Boss.ts`
- `src/game/entities/Projectile.ts`
- `src/game/entities/Particle.ts`
- `src/game/data/balanceConfig.ts`
- `src/game/data/missions.ts`
- `src/game/data/weapons.ts`
- `src/game/data/upgrades.ts`
- `src/game/data/endlessMutations.ts`
- `src/game/data/weaponMods.ts`
- `src/game/data/protocols.ts`
- `src/game/data/secrets.ts`
- `src/game/audio/SoundSynth.ts`
- `src/game/systems/PowerSystem.ts`
- `src/game/systems/TacticalAI.ts`
- `src/game/systems/AICommentarySystem.ts`
- `src/game/systems/AchievementSystem.ts`
- `src/game/systems/SaveSystem.ts`
- `src/game/systems/OperatorProfileSystem.ts`
- `src/game/systems/DemoModeSystem.ts`
- All existing component files (except targeted additions)

## 6. Which Existing Systems Were Extended (Not Replaced)
- `App.tsx` — Extended with auth flow, landing page routing, onboarding integration
- `BootScreen.tsx` — Extended with Replay Tutorial button
- `PauseModal.tsx` — Extended with Logout button
- `SaveSystem` — Extended with tutorial state (localStorage, not server)

## 7. Environment Variables Required
```
GOOGLE_CLIENT_ID=        # Google OAuth2 Client ID
GOOGLE_CLIENT_SECRET=    # Google OAuth2 Client Secret
AUTH_REDIRECT_URI=       # OAuth callback URL
SESSION_SECRET=          # Express session signing secret
APP_URL=                 # Frontend URL (for CORS)
GEMINI_API_KEY=          # Existing: Gemini AI API key
```
