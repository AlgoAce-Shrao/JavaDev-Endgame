import React, { useState } from 'react';
import { Incident, Project, User, IncidentSeverity, IncidentStatus } from '../types/devflow';
import {
  AlertTriangle,
  Bug,
  Plus,
  CheckCircle,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  Trash2,
  User as UserIcon,
  Activity
} from 'lucide-react';

interface IncidentTrackerProps {
  incidents: Incident[];
  projects: Project[];
  users: User[];
  currentUser: User;
  onCreateIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateIncidentStatus: (incidentId: number, newStatus: IncidentStatus) => void;
  onDeleteIncident: (incidentId: number) => void;
}

export const IncidentTracker: React.FC<IncidentTrackerProps> = ({
  incidents,
  projects,
  users,
  currentUser,
  onCreateIncident,
  onUpdateIncidentStatus,
  onDeleteIncident
}) => {
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [projectId, setProjectId] = useState<number>(projects[0]?.id || 1);
  const [assignedToId, setAssignedToId] = useState<number | 'unassigned'>('unassigned');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSev = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStat = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesStat && matchesSearch;
  });

  const getSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500 text-white shadow-rose-500/20';
      case 'HIGH':
        return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'MEDIUM':
        return 'bg-blue-500 text-white shadow-blue-500/20';
      case 'LOW':
        return 'bg-slate-500 text-white shadow-slate-500/20';
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'INVESTIGATING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Incident title is required');
      return;
    }

    const assignedUser = assignedToId === 'unassigned' ? null : users.find((u) => u.id === assignedToId) || null;
    const proj = projects.find((p) => p.id === projectId) || projects[0];

    onCreateIncident({
      title,
      description,
      severity,
      status: 'OPEN',
      projectId: proj.id,
      projectName: proj.name,
      reportedBy: currentUser,
      assignedTo: assignedUser
    });

    setTitle('');
    setDescription('');
    setErrorMsg(null);
    setIsReportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Bug & Incident Operations Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time issue tracking, severity filtering, and resolution workflows
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as IncidentSeverity | 'ALL')}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'ALL')}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Incident List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Severity / Issue</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300 font-medium">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 dark:text-slate-500 italic">
                    No incidents match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Severity & Issue Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shadow-sm ${getSeverityBadge(inc.severity)}`}>
                          {inc.severity}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {inc.title}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 text-xs font-normal line-clamp-1 mt-0.5">
                            {inc.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-400">
                      {inc.projectName}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>

                    {/* Reported By */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={inc.reportedBy.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={inc.reportedBy.name}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300"
                        />
                        <span className="text-slate-800 dark:text-slate-200">
                          {inc.reportedBy.name}
                        </span>
                      </div>
                    </td>

                    {/* Assigned To */}
                    <td className="py-3.5 px-4">
                      {inc.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={inc.assignedTo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={inc.assignedTo.name}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300"
                          />
                          <span className="text-slate-800 dark:text-slate-200">
                            {inc.assignedTo.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          value={inc.status}
                          onChange={(e) => onUpdateIncidentStatus(inc.id, e.target.value as IncidentStatus)}
                          className="bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="OPEN">Set Open</option>
                          <option value="INVESTIGATING">Set Investigating</option>
                          <option value="RESOLVED">Set Resolved</option>
                          <option value="CLOSED">Set Closed</option>
                        </select>

                        <button
                          onClick={() => onDeleteIncident(inc.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                          title="Delete Incident"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-500" />
                Report Bug or Incident
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-xl border border-rose-200 dark:border-rose-800">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleReportIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Incident Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. High latency on JWT validation endpoint"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Incident Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Root cause, impact, error logs or steps to reproduce..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Affected Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Assign Incident Lead
                </label>
                <select
                  value={assignedToId}
                  onChange={(e) =>
                    setAssignedToId(
                      e.target.value === 'unassigned' ? 'unassigned' : Number(e.target.value)
                    )
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="unassigned">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
