import React, { useState, useEffect } from 'react';
import {
  User,
  Project,
  Task,
  Incident,
  Comment,
  TaskStatus,
  IncidentStatus
} from './types/devflow';
import {
  SAMPLE_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_INCIDENTS,
  INITIAL_COMMENTS
} from './data/mockData';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { IncidentTracker } from './components/IncidentTracker';
import { ApiTester } from './components/ApiTester';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { CommentsDrawer } from './components/CommentsDrawer';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'board' | 'incidents' | 'api-tester' | 'architecture'>('board');

  // Active User / Role switcher state
  const [currentUser, setCurrentUser] = useState<User>(SAMPLE_USERS[1]); // Default: Bob Manager

  // Platform Data State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('devflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('devflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('devflow_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('devflow_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<number | 'all'>('all');
  const [activeCommentTaskId, setActiveCommentTaskId] = useState<number | null>(null);
  const [redisCacheHits, setRedisCacheHits] = useState(14);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('devflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('devflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('devflow_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('devflow_comments', JSON.stringify(comments));
  }, [comments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Task Operations
  const handleUpdateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
    );
    showToast(`Updated task #${taskId} status to '${newStatus}'`);
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created: Task = {
      ...newTaskData,
      id: Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks((prev) => [created, ...prev]);
    showToast(`Created new task '${created.title}'`);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast(`Deleted task #${taskId}`);
  };

  // Incident Operations
  const handleCreateIncident = (newIncData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created: Incident = {
      ...newIncData,
      id: Math.floor(200 + Math.random() * 800),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setIncidents((prev) => [created, ...prev]);
    showToast(`Reported new incident #${created.id} - ${created.title}`);
  };

  const handleUpdateIncidentStatus = (incidentId: number, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: newStatus,
              resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : i.resolvedAt,
              updatedAt: new Date().toISOString()
            }
          : i
      )
    );
    showToast(`Incident #${incidentId} status set to '${newStatus}'`);
  };

  const handleDeleteIncident = (incidentId: number) => {
    setIncidents((prev) => prev.filter((i) => i.id !== incidentId));
    showToast(`Deleted incident #${incidentId}`);
  };

  // Comment Operations
  const handleAddComment = (taskId: number, content: string) => {
    const newComment: Comment = {
      id: Math.floor(300 + Math.random() * 700),
      taskId,
      content,
      author: currentUser,
      createdAt: new Date().toISOString()
    };
    setComments((prev) => [...prev, newComment]);
    showToast('Posted comment to task discussion');
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    showToast('Deleted comment');
  };

  const handleSimulateRedisFetch = () => {
    setRedisCacheHits((prev) => prev + 1);
    showToast('Redis Cache HIT! Returned cached project details in 2ms');
  };

  const currentTaskForComments = tasks.find((t) => t.id === activeCommentTaskId) || null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Application Header */}
      <Header
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        redisCacheHits={redisCacheHits}
      />

      {/* Main Tab View Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'board' && (
          <KanbanBoard
            tasks={tasks}
            projects={projects}
            users={SAMPLE_USERS}
            currentUser={currentUser}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask}
            onOpenComments={(taskId) => setActiveCommentTaskId(taskId)}
            redisCacheHits={redisCacheHits}
            onSimulateRedisFetch={handleSimulateRedisFetch}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentTracker
            incidents={incidents}
            projects={projects}
            users={SAMPLE_USERS}
            currentUser={currentUser}
            onCreateIncident={handleCreateIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onDeleteIncident={handleDeleteIncident}
          />
        )}

        {activeTab === 'api-tester' && (
          <ApiTester currentUser={currentUser} />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureViewer />
        )}
      </main>

      {/* Task Comments Slide-over Drawer */}
      {activeCommentTaskId && (
        <CommentsDrawer
          task={currentTaskForComments}
          comments={comments}
          currentUser={currentUser}
          onClose={() => setActiveCommentTaskId(null)}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
}
