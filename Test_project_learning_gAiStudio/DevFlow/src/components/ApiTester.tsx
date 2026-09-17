import React, { useState } from 'react';
import { User } from '../types/devflow';
import { Terminal, Send, Lock, ShieldCheck, CheckCircle, Copy, Code, Server, Zap } from 'lucide-react';

interface ApiTesterProps {
  currentUser: User;
}

interface EndpointDef {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  defaultBody?: string;
  rolesRequired: string[];
}

export const ApiTester: React.FC<ApiTesterProps> = ({ currentUser }) => {
  const endpoints: EndpointDef[] = [
    {
      id: 'auth-login',
      method: 'POST',
      path: '/api/auth/login',
      summary: 'Authenticate user & generate JWT token',
      defaultBody: JSON.stringify(
        { email: currentUser.email, password: 'password123' },
        null,
        2
      ),
      rolesRequired: ['PUBLIC']
    },
    {
      id: 'get-projects',
      method: 'GET',
      path: '/api/projects',
      summary: 'Get all projects (Redis cached response)',
      rolesRequired: ['ADMIN', 'MANAGER', 'DEVELOPER']
    },
    {
      id: 'create-project',
      method: 'POST',
      path: '/api/projects',
      summary: 'Create a new project (Admin & Manager only)',
      defaultBody: JSON.stringify(
        {
          name: 'Microservices Mesh Gateway',
          description: 'Istio and Spring Cloud Gateway deployment with Rate Limiting'
        },
        null,
        2
      ),
      rolesRequired: ['ADMIN', 'MANAGER']
    },
    {
      id: 'get-tasks',
      method: 'GET',
      path: '/api/tasks',
      summary: 'List and filter tasks with pagination',
      rolesRequired: ['ADMIN', 'MANAGER', 'DEVELOPER']
    },
    {
      id: 'create-task',
      method: 'POST',
      path: '/api/tasks',
      summary: 'Create a new task with assignment & due date',
      defaultBody: JSON.stringify(
        {
          title: 'Implement OAuth PKCE flow',
          description: 'Secure auth token exchange for mobile frontend clients',
          priority: 'HIGH',
          status: 'TODO',
          projectId: 1,
          assignedToUserId: currentUser.id,
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
        },
        null,
        2
      ),
      rolesRequired: ['ADMIN', 'MANAGER']
    },
    {
      id: 'update-task-status',
      method: 'PATCH',
      path: '/api/tasks/102/status?status=IN_PROGRESS',
      summary: 'Update task status (Assigned Developers or Managers)',
      rolesRequired: ['ADMIN', 'MANAGER', 'DEVELOPER']
    },
    {
      id: 'get-incidents',
      method: 'GET',
      path: '/api/incidents',
      summary: 'List all bug reports & production incidents',
      rolesRequired: ['ADMIN', 'MANAGER', 'DEVELOPER']
    },
    {
      id: 'actuator-health',
      method: 'GET',
      path: '/actuator/health',
      summary: 'Spring Boot Actuator health status (DB + Redis check)',
      rolesRequired: ['PUBLIC']
    }
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(endpoints[0]);
  const [requestBody, setRequestBody] = useState<string>(endpoints[0].defaultBody || '');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Simulated JWT Token for current user
  const sampleJwt = `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI${btoa(currentUser.email)}Iiwicm9sZSI6IktB${currentUser.role}IiwiaWF0IjoxNzE4MjE1MDAwLCJleHAiOjE3MTgzMDE0MDB9.x7B3z_sample_jwt_signature`;

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setRequestBody(ep.defaultBody || '');
    setResponseStatus(null);
    setResponseBody(null);
    setResponseTime(null);
  };

  const executeRequest = () => {
    setIsLoading(true);
    const start = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start + Math.random() * 35 + 15);
      setResponseTime(elapsed);

      // Authorization RBAC check simulation
      const userRole = currentUser.role;
      const requiresRestrictedRole =
        selectedEndpoint.rolesRequired.length > 0 &&
        !selectedEndpoint.rolesRequired.includes('PUBLIC') &&
        !selectedEndpoint.rolesRequired.includes(userRole);

      if (requiresRestrictedRole) {
        setResponseStatus(403);
        setResponseBody(
          JSON.stringify(
            {
              timestamp: new Date().toISOString(),
              status: 403,
              error: 'Forbidden',
              message: `Access Denied: User '${currentUser.email}' with role '${userRole}' lacks required permissions [${selectedEndpoint.rolesRequired.join(', ')}]`,
              path: selectedEndpoint.path
            },
            null,
            2
          )
        );
        setIsLoading(false);
        return;
      }

      // Mock response based on endpoint
      setResponseStatus(200);

      if (selectedEndpoint.id === 'auth-login') {
        setResponseBody(
          JSON.stringify(
            {
              token: sampleJwt,
              tokenType: 'Bearer',
              userId: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role,
              expiresInSeconds: 86400
            },
            null,
            2
          )
        );
      } else if (selectedEndpoint.id === 'actuator-health') {
        setResponseBody(
          JSON.stringify(
            {
              status: 'UP',
              components: {
                db: { status: 'UP', details: { database: 'PostgreSQL 16.2', validationQuery: 'isValid()' } },
                redis: { status: 'UP', details: { version: '7.2.4', mode: 'standalone' } },
                diskSpace: { status: 'UP', details: { total: 107374182400, free: 64424509440 } }
              }
            },
            null,
            2
          )
        );
      } else if (selectedEndpoint.id === 'get-projects') {
        setResponseBody(
          JSON.stringify(
            [
              {
                id: 1,
                name: 'Cloud Portal Migration',
                description: 'Migrating legacy monolith services to Spring Boot 3 Microservices',
                owner: { id: 2, name: 'Bob Manager', email: 'manager@devflow.com', role: 'MANAGER' },
                cachedInRedis: true
              },
              {
                id: 2,
                name: 'Mobile SDK Integration',
                description: 'Cross-platform auth & analytics SDK with OAuth PKCE',
                owner: { id: 1, name: 'Alice Admin', email: 'admin@devflow.com', role: 'ADMIN' },
                cachedInRedis: false
              }
            ],
            null,
            2
          )
        );
      } else {
        try {
          const parsed = requestBody ? JSON.parse(requestBody) : {};
          setResponseBody(
            JSON.stringify(
              {
                status: 'SUCCESS',
                message: `Executed ${selectedEndpoint.method} ${selectedEndpoint.path}`,
                receivedPayload: parsed,
                executedBy: { email: currentUser.email, role: currentUser.role },
                timestamp: new Date().toISOString()
              },
              null,
              2
            )
          );
        } catch {
          setResponseBody(
            JSON.stringify({ status: 'SUCCESS', path: selectedEndpoint.path, timestamp: new Date().toISOString() }, null, 2)
          );
        }
      }

      setIsLoading(false);
    }, 350);
  };

  const getCurlCommand = () => {
    let cmd = `curl -X ${selectedEndpoint.method} "http://localhost:8080${selectedEndpoint.path}" \\\n  -H "Content-Type: application/json"`;
    if (!selectedEndpoint.rolesRequired.includes('PUBLIC')) {
      cmd += ` \\\n  -H "Authorization: Bearer ${sampleJwt}"`;
    }
    if (selectedEndpoint.defaultBody && ['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) {
      cmd += ` \\\n  -d '${requestBody.replace(/\n/g, ' ')}'`;
    }
    return cmd;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Interactive OpenAPI / REST API Console
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test Spring Boot endpoints, JWT Bearer tokens, and Role-Based Access Control (RBAC) live
            </p>
          </div>
        </div>

        {/* Current Security Token Badge */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs flex items-center gap-3 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase">Active Auth Principal:</div>
            <span className="font-bold text-emerald-300">{currentUser.email}</span> ({currentUser.role})
          </div>
        </div>
      </div>

      {/* Main Split Layout: Endpoint List & Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Navigation Column */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
            API Endpoints ({endpoints.length})
          </h3>

          <div className="space-y-2">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              const methodColor =
                ep.method === 'GET'
                  ? 'bg-emerald-500 text-white'
                  : ep.method === 'POST'
                  ? 'bg-blue-500 text-white'
                  : ep.method === 'PATCH'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-500 text-white';

              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-600 shadow-sm'
                      : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded font-mono ${methodColor}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {ep.path}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {ep.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Request Execution & Response Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Endpoint Execution Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-600 text-white font-mono font-extrabold text-xs rounded-lg">
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedEndpoint.path}
                </span>
              </div>

              <button
                onClick={executeRequest}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin text-sm">↻</span>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send Request</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {selectedEndpoint.summary}
            </p>

            {/* Role Requirement Indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Allowed Roles:</span>
              {selectedEndpoint.rolesRequired.map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {r}
                </span>
              ))}
            </div>

            {/* Request Body Editor (if applicable) */}
            {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 font-mono">
                  JSON Request Payload
                </label>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Response Inspector */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold">HTTP Response:</span>
                {responseStatus !== null && (
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-xs ${
                      responseStatus === 200
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {responseStatus} {responseStatus === 200 ? 'OK' : 'FORBIDDEN'}
                  </span>
                )}
                {responseTime !== null && (
                  <span className="text-slate-500 text-[11px]">{responseTime} ms</span>
                )}
              </div>

              <button
                onClick={copyCurl}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCurl ? 'Copied cURL!' : 'Copy cURL'}</span>
              </button>
            </div>

            {/* Response JSON Output */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80 overflow-x-auto min-h-[160px] text-emerald-400">
              {isLoading ? (
                <div className="flex items-center gap-2 text-slate-500 italic">
                  <span className="animate-spin">↻</span> Executing request against Spring Boot controller...
                </div>
              ) : responseBody ? (
                <pre>{responseBody}</pre>
              ) : (
                <div className="text-slate-600 italic">
                  Click "Send Request" above to execute this endpoint.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
