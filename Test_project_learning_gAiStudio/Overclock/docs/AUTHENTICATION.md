# OVERCLOCK — Authentication System

## Overview
OVERCLOCK uses Google OAuth2 for user authentication. The system consists of:
- An Express backend server (`server.ts`) that handles the OAuth2 flow
- A React auth context (`AuthContext.tsx`) that manages frontend auth state
- Session-based authentication via `express-session`

## OAuth Provider
- **Provider**: Google OAuth 2.0
- **Flow**: Authorization Code Grant
- **Scopes**: `openid email profile`

## Authentication Flow

### 1. User clicks "Enter the Facility"
```
Landing Page → auth.login() → Redirect to /auth/google
```

### 2. Google OAuth2 Consent
```
/auth/google → Redirect to Google Accounts → User grants permission
```

### 3. Callback
```
Google → /auth/google/callback?code=... → Exchange code for tokens → Fetch user profile → Create session → Redirect to frontend
```

### 4. Frontend receives session
```
Frontend ?auth=success → Check /auth/me → Display "Facility Access Granted" → Proceed to game
```

## Backend Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/auth/google` | GET | Redirects to Google OAuth2 consent screen |
| `/auth/google/callback` | GET | Handles OAuth2 callback, exchanges code, creates session |
| `/auth/me` | GET | Returns current authenticated user profile |
| `/auth/logout` | POST | Destroys session, logs user out |
| `/auth/onboarding-complete` | POST | Marks onboarding as complete for current user |

## Frontend Auth States

| State | Description |
|-------|-------------|
| `loading` | Initial auth check in progress |
| `unauthenticated` | No active session |
| `authenticated` | User has valid session |
| `error` | Authentication failed |

## Session Management
- Sessions stored in memory (server-side)
- Cookie-based session ID (httpOnly, 7-day expiry)
- Session destroyed on logout
- Game progress is NOT deleted on logout (stored in localStorage per browser)

## Environment Variables

```env
GOOGLE_CLIENT_ID=        # From Google Cloud Console
GOOGLE_CLIENT_SECRET=    # From Google Cloud Console
AUTH_REDIRECT_URI=       # e.g., http://localhost:3001/auth/google/callback
SESSION_SECRET=          # Random string for cookie signing
APP_URL=                 # Frontend URL for CORS (e.g., http://localhost:3000)
```

## Security Notes
- No passwords are stored
- No custom authentication system
- Google handles identity verification
- Session secrets must be changed in production
- `SESSION_SECRET` must be a strong random string in production
- `secure: true` on cookies should be enabled in production (HTTPS required)

## Local Development Setup
1. Create a Google OAuth2 Client ID at https://console.cloud.google.com
2. Set authorized redirect URI to `http://localhost:3001/auth/google/callback`
3. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`
4. Run `npm run server` to start the auth server on port 3001
5. Run `npm run dev` to start the frontend on port 3000

## Production Setup
1. Set `secure: true` on session cookies
2. Use HTTPS
3. Set proper `AUTH_REDIRECT_URI` for production domain
4. Generate strong `SESSION_SECRET`
5. Use `npm run start` (builds frontend + starts server)
