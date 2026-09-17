import React, { useState } from 'react';
import { Task, Project, User, Priority, TaskStatus, Role } from '../types/devflow';
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  MessageSquare,
  User as UserIcon,
  Calendar,
  Layers,
  ArrowRight,
  Trash2,
  Sparkles,
  ShieldAlert,
  Server
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  currentUser: User;
  selectedProjectId: number | 'all';
  onSelectProject: (id: number | 'all') => void;
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteTask: (taskId: number) => void;
  onOpenComments: (taskId: number) => void;
  redisCacheHits: number;
  onSimulateRedisFetch: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projects,
  users,
  currentUser,
  selectedProjectId,
  onSelectProject,
  onUpdateTaskStatus,
  onCreateTask,
  onDeleteTask,
  onOpenComments,
  redisCacheHits,
  onSimulateRedisFetch
}) => {
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const [newProjectId, setNewProjectId] = useState<number>(projects[0]?.id || 1);
  const [newAssignedToId, setNewAssignedToId] = useState<number | 'unassigned'>(users[2]?.id || 'unassigned');
  const [newDueDate, setNewDueDate] = useState<string>(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const columns: { status: TaskStatus; title: string; color: string; badge: string }[] = [
    { status: 'TODO', title: 'To Do', color: 'border-t-slate-500', badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-blue-500', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { status: 'REVIEW', title: 'Code Review', color: 'border-t-purple-500', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { status: 'DONE', title: 'Completed', color: 'border-t-emerald-500', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' }
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesProject = selectedProjectId === 'all' || task.projectId === selectedProjectId;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'LOW':
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'DEVELOPER') {
      setErrorMsg('Unauthorized: DEVELOPER role cannot create tasks directly (ADMIN or MANAGER required)');
      return;
    }
    if (!newTitle.trim()) {
      setErrorMsg('Task title is required');
      return;
    }

    const assignedUser = newAssignedToId === 'unassigned' ? null : users.find((u) => u.id === newAssignedToId) || null;
    const proj = projects.find((p) => p.id === newProjectId) || projects[0];

    onCreateTask({
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      status: 'TODO',
      dueDate: new Date(newDueDate).toISOString(),
      projectId: proj.id,
      projectName: proj.name,
      createdBy: currentUser,
      assignedTo: assignedUser
    });

    setNewTitle('');
    setNewDescription('');
    setErrorMsg(null);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Project Selector & Redis Cache trigger */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <label htmlFor="project-select-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Project:
          </label>
          <select
            id="project-select-filter"
            value={selectedProjectId}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
              onSelectProject(val);
              onSimulateRedisFetch();
            }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={onSimulateRedisFetch}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-semibold transition-all"
            title="Fetches project details through Redis Cache layer"
          >
            <Server className="w-3.5 h-3.5 text-amber-500" />
            <span>Redis Cache Fetch</span>
          </button>
        </div>

        {/* Priority Filter & Search */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
            />
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            id="priority-filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* New Task Button (Disabled for DEVELOPER role in UI) */}
          <button
            id="create-task-btn"
            onClick={() => {
              if (currentUser.role === 'DEVELOPER') {
                alert('Role Authorization Restriction: DEVELOPER role cannot create tasks. Switch role to ADMIN or MANAGER using the top right selector!');
                return;
              }
              setIsCreateModalOpen(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all ${
              currentUser.role === 'DEVELOPER'
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 active:scale-95'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Role Authorization Notice */}
      {currentUser.role === 'DEVELOPER' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>
            <strong>Developer Role Notice:</strong> You can update the status of tasks assigned to you. Task creation and assignment are restricted to <strong>ADMIN</strong> and <strong>MANAGER</strong> roles.
          </span>
        </div>
      )}

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className={`bg-slate-100/70 dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 border-t-4 ${col.color} flex flex-col min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {col.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono ${col.badge}`}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-6 text-center text-slate-400 dark:text-slate-600 text-xs font-medium">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-slate-800/90 rounded-xl p-4 shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700/80 transition-all space-y-3 group"
                    >
                      {/* Priority Tag & Project Name */}
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wider border uppercase ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[120px]" title={task.projectName}>
                          {task.projectName}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-normal">
                          {task.description}
                        </p>
                      </div>

                      {/* Status Flow Buttons */}
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-slate-500">Move status:</span>
                        <div className="flex items-center gap-1">
                          {columns.map((nextCol) => {
                            if (nextCol.status === task.status) return null;

                            // DEVELOPER authorization check
                            const isAssignedToCurrentDev =
                              currentUser.role !== 'DEVELOPER' ||
                              (task.assignedTo && task.assignedTo.id === currentUser.id);

                            return (
                              <button
                                key={nextCol.status}
                                disabled={!isAssignedToCurrentDev}
                                onClick={() => onUpdateTaskStatus(task.id, nextCol.status)}
                                className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${
                                  isAssignedToCurrentDev
                                    ? 'bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300'
                                    : 'opacity-40 cursor-not-allowed text-slate-400'
                                }`}
                                title={
                                  isAssignedToCurrentDev
                                    ? `Move to ${nextCol.title}`
                                    : 'Developers can only update status of tasks assigned to them'
                                }
                              >
                                {nextCol.title.split(' ')[0]}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Footer: Assignee, Due Date, Actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                        {/* Assignee Avatar */}
                        <div className="flex items-center gap-1.5" title={task.assignedTo ? `Assigned to ${task.assignedTo.name}` : 'Unassigned'}>
                          {task.assignedTo ? (
                            <>
                              <img
                                src={task.assignedTo.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                alt={task.assignedTo.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
                              />
                              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
                                {task.assignedTo.name.split(' ')[0]}
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] italic text-slate-400 flex items-center gap-1">
                              <UserIcon className="w-3.5 h-3.5" /> Unassigned
                            </span>
                          )}
                        </div>

                        {/* Comments Trigger & Delete Action */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenComments(task.id)}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-indigo-600 dark:text-indigo-400 font-semibold transition-colors"
                            title="Task comments"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {currentUser.role !== 'DEVELOPER' && (
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                              title="Delete Task (ADMIN/MANAGER)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Create New Developer Task
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
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

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement JWT Refresh Token Rotation"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed requirements or technical notes..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
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
                    Project
                  </label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(Number(e.target.value))}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Assign To
                  </label>
                  <select
                    value={newAssignedToId}
                    onChange={(e) =>
                      setNewAssignedToId(
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

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
