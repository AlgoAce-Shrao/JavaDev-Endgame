import React from 'react';
import {
  Code2,
  Database,
  ShieldCheck,
  Server,
  Layers,
  Cpu,
  CheckCircle2,
  Terminal,
  Box,
  KeyRound,
  Zap,
  Activity
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Java 21 & Spring Boot 3 Architecture Overview
            </h2>
            <p className="text-xs text-indigo-200/80">
              DevFlow Backend Specifications, Security Filters, Database Schema, and Redis Integration
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Java 21 Virtual Threads</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Built with Java 21 LTS runtime utilizing Project Loom virtual threads for ultra-high concurrency throughput.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Spring Security & JWT</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stateless JWT authentication filter chain with fine-grained Role-Based Access Control (ADMIN, MANAGER, DEVELOPER).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>PostgreSQL & Spring Data JPA</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Relational JPA Entities (`User`, `Project`, `Task`, `Incident`, `Comment`) with indexed foreign keys and automatic auditing.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Server className="w-4 h-4" />
            <span>Redis Cache Layer</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Spring Cache abstraction with `@Cacheable` and `@CacheEvict` annotations for instant project lookup responses.
          </p>
        </div>
      </div>

      {/* Database Schema Map */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          JPA Entity Schema Relations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span>Entity: User</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 rounded">users table</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
              <li>• id: Long (PK)</li>
              <li>• email: String (Unique Index)</li>
              <li>• password: String (BCrypt)</li>
              <li>• role: Enum (ADMIN, MANAGER, DEVELOPER)</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
              <span>Entity: Project</span>
              <span className="text-[10px] bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded">projects table</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
              <li>• id: Long (PK)</li>
              <li>• name: String</li>
              <li>• description: String</li>
              <li>• owner_id: Long (FK -&gt; users)</li>
              <li>• tasks: List&lt;Task&gt; (@OneToMany)</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Entity: Task</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">tasks table</span>
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
              <li>• id: Long (PK)</li>
              <li>• title: String</li>
              <li>• priority: Enum (LOW..CRITICAL)</li>
              <li>• status: Enum (TODO..DONE)</li>
              <li>• assigned_to_id: Long (FK -&gt; users)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Maven Test Verification Log */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-md font-mono text-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-emerald-400 font-bold">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Maven JUnit 5 Test Suite Verification Status
          </span>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[11px]">
            16 / 16 PASSED
          </span>
        </div>

        <div className="text-slate-400 space-y-1 text-[11px] leading-relaxed">
          <p>[INFO] Running com.devflow.service.AuthServiceTest</p>
          <p className="text-emerald-400">
            [INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0 -- SUCCESS
          </p>
          <p>[INFO] Running com.devflow.service.ProjectServiceTest</p>
          <p className="text-emerald-400">
            [INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 -- SUCCESS
          </p>
          <p>[INFO] Running com.devflow.service.TaskServiceTest</p>
          <p className="text-emerald-400">
            [INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 -- SUCCESS
          </p>
          <p>[INFO] Running com.devflow.controller.ProjectControllerTest</p>
          <p className="text-emerald-400">
            [INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0 -- SUCCESS
          </p>
          <p className="text-slate-300 font-bold pt-2 border-t border-slate-800">
            [INFO] BUILD SUCCESS - Total time: 18.420 s
          </p>
        </div>
      </div>
    </div>
  );
};
