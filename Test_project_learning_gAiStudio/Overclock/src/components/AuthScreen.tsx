/**
 * OVERCLOCK — Authentication UI Components
 * Handles the visual states of authentication:
 * loading, unauthenticated, authenticating, error.
 */

import React from 'react';
import { useAuth } from '../game/auth/AuthContext';
import { Loader2, AlertTriangle, LogOut, User } from 'lucide-react';

// --- Authentication Loading Screen ---
export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 z-50 bg-[#050605] flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <Loader2 className="w-8 h-8 text-[#00ff9f] animate-spin mx-auto" />
        <div>
          <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
            SYSTEM INITIALIZATION
          </div>
          <div className="text-sm text-[#00ff9f] tracking-wider animate-pulse">
            ESTABLISHING NEURAL LINK...
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Facility Access Granted Screen ---
export const AuthGrantedScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 z-50 bg-[#050605] flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 border-2 border-[#00ff9f] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_#00ff9f]">
          <div className="text-[#00ff9f] text-2xl font-black">✓</div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[#00ff9f]/60 uppercase mb-2">
            AUTHENTICATION VERIFIED
          </div>
          <div className="text-lg font-black tracking-widest text-[#00ff9f]">
            FACILITY ACCESS GRANTED
          </div>
        </div>
        <div className="text-xs text-white/40 animate-pulse">
          LOADING OPERATOR PROFILE...
        </div>
      </div>
    </div>
  );
};

// --- Authentication Error Screen ---
export const AuthErrorScreen: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-[#050605] flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <AlertTriangle className="w-12 h-12 text-[#ff3e3e] mx-auto" />
        <div>
          <div className="text-lg font-black tracking-widest text-[#ff3e3e] mb-2">
            FACILITY ACCESS DENIED
          </div>
          <div className="text-xs text-white/50 tracking-wider">
            {error || 'Authentication failed. Please try again.'}
          </div>
        </div>
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black tracking-widest text-sm transition-colors cursor-pointer shadow-[0_0_20px_#00ff9f]"
        >
          RETRY
        </button>
      </div>
    </div>
  );
};

// --- User Info Badge (shown in header when authenticated) ---
export const UserBadge: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {user.picture ? (
        <img
          src={user.picture}
          alt={user.name}
          className="w-6 h-6 rounded-full border border-[#00ff9f]/30"
        />
      ) : (
        <div className="w-6 h-6 bg-[#00ff9f]/20 border border-[#00ff9f]/30 flex items-center justify-center">
          <User className="w-3 h-3 text-[#00ff9f]" />
        </div>
      )}
      <span className="text-[10px] text-white/60 hidden sm:inline max-w-[100px] truncate">
        {user.name}
      </span>
      <button
        onClick={logout}
        className="p-1 hover:bg-[#ff3e3e]/20 text-white/40 hover:text-[#ff3e3e] border border-transparent hover:border-[#ff3e3e]/30 cursor-pointer transition-colors"
        title="Logout"
      >
        <LogOut className="w-3 h-3" />
      </button>
    </div>
  );
};
