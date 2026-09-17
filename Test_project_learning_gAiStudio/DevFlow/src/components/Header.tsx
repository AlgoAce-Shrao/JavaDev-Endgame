import React from 'react';
import { User, Role } from '../types/devflow';
import { SAMPLE_USERS } from '../data/mockData';
import {
  ShieldCheck,
  Cpu,
  Database,
  Layers,
  Terminal,
  Server,
  Activity,
  UserCheck,
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  Code2
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  activeTab: 'board' | 'incidents' | 'api-tester' | 'architecture';
  onTabChange: (tab: 'board' | 'incidents' | 'api-tester' | 'architecture') => void;
  redisCacheHits: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChange,
  activeTab,
  onTabChange,
  redisCacheHits
}) => {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'DEVELOPER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Spring Boot 3.2.4 API: UP
          </span>
          <span className="flex items-center gap-1.5 font-mono text-cyan-400">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            PostgreSQL 16: Connected
          </span>
          <span className="flex items-center gap-1.5 font-mono text-amber-400">
            <Server className="w-3.5 h-3.5 text-amber-400" />
            Redis 7 Cache: Active ({redisCacheHits} hits)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            JWT Security Filter Active
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">Java 21 Virtual Threads</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Platform Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                DevFlow
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Enterprise Task & Bug Incident Management API Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-sm font-medium">
          <button
            id="nav-tab-board"
            onClick={() => onTabChange('board')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'board'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Task Board</span>
          </button>

          <button
            id="nav-tab-incidents"
            onClick={() => onTabChange('incidents')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'incidents'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Incidents</span>
          </button>

          <button
            id="nav-tab-api"
            onClick={() => onTabChange('api-tester')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'api-tester'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>REST API Console</span>
          </button>

          <button
            id="nav-tab-architecture"
            onClick={() => onTabChange('architecture')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'architecture'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* User & Role Switcher */}
        <div className="flex items-center gap-3 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
          />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                {currentUser.name}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[140px] font-mono">
              {currentUser.email}
            </p>
          </div>

          <div className="border-l border-slate-700 pl-2">
            <select
              id="role-user-select"
              value={currentUser.id}
              onChange={(e) => {
                const found = SAMPLE_USERS.find((u) => u.id === Number(e.target.value));
                if (found) onUserChange(found);
              }}
              className="bg-slate-900 text-xs text-slate-200 border border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium cursor-pointer"
            >
              {SAMPLE_USERS.map((user) => (
                <option key={user.id} value={user.id}>
                  Switch to: {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
