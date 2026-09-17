/**
 * OVERCLOCK — Authentication Server
 * Minimal Express server for Google OAuth2 authentication flow.
 * Serves the built Vite frontend and handles OAuth callbacks.
 */

import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// --- Google OAuth2 Configuration ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.AUTH_REDIRECT_URI || `http://localhost:${PORT}/auth/google/callback`;
const SESSION_SECRET = process.env.SESSION_SECRET || 'overclock-dev-session-secret';
const FRONTEND_URL = process.env.APP_URL || `http://localhost:3000`;

// --- Session Middleware ---
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
  },
}));

// --- CORS for dev ---
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// --- Auth Types ---
interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

declare module 'express-session' {
  interface SessionData {
    user?: UserProfile;
    isNewUser?: boolean;
  }
}

// --- Helper: Exchange authorization code for tokens ---
async function exchangeCodeForTokens(code: string): Promise<{ access_token: string; id_token: string }> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return response.json() as Promise<{ access_token: string; id_token: string }>;
}

// --- Helper: Get user info from Google ---
async function getUserInfo(accessToken: string): Promise<UserProfile> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  const data = await response.json() as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture,
  };
}

// ============================================================
// AUTH ROUTES
// ============================================================

/**
 * GET /auth/google
 * Redirects the user to Google's OAuth2 consent screen.
 */
app.get('/auth/google', (req, res) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

/**
 * GET /auth/google/callback
 * Handles the OAuth2 callback from Google, exchanges code for tokens,
 * fetches user profile, and redirects to frontend with session.
 */
app.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    res.redirect(`${FRONTEND_URL}?auth=error&reason=${encodeURIComponent(String(error))}`);
    return;
  }

  if (!code) {
    res.redirect(`${FRONTEND_URL}?auth=error&reason=no_code`);
    return;
  }

  try {
    const tokens = await exchangeCodeForTokens(String(code));
    const profile = await getUserInfo(tokens.access_token);

    // Check if this is a new user (stored in session previously)
    const wasNew = !req.session.user;
    req.session.user = profile;
    req.session.isNewUser = wasNew;

    res.redirect(`${FRONTEND_URL}?auth=success`);
  } catch (err) {
    console.error('Auth callback error:', err);
    res.redirect(`${FRONTEND_URL}?auth=error&reason=token_exchange_failed`);
  }
});

/**
 * GET /auth/me
 * Returns the current authenticated user's profile.
 */
app.get('/auth/me', (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user,
      isNewUser: req.session.isNewUser || false,
    });
  } else {
    res.json({ authenticated: false, user: null });
  }
});

/**
 * POST /auth/logout
 * Destroys the session and logs the user out.
 */
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.json({ success: true });
  });
});

/**
 * POST /auth/onboarding-complete
 * Marks the onboarding as complete for this user.
 */
app.post('/auth/onboarding-complete', (req, res) => {
  if (req.session.user) {
    req.session.isNewUser = false;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// --- Serve Static Frontend (production) ---
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/auth/')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[OVERCLOCK] Auth server running on http://localhost:${PORT}`);
  console.log(`[OVERCLOCK] Frontend expected at ${FRONTEND_URL}`);
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('[OVERCLOCK] WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set.');
    console.warn('[OVERCLOCK] Google OAuth will not work without these environment variables.');
    console.warn('[OVERCLOCK] See .env.example for configuration.');
  }
});
