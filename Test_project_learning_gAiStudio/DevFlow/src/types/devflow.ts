export type Role = 'ADMIN' | 'MANAGER' | 'DEVELOPER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
  isCachedInRedis?: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  projectId: number;
  projectName?: string;
  createdBy: User;
  assignedTo?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  projectId: number;
  projectName?: string;
  reportedBy: User;
  assignedTo?: User | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  author: User;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface SystemHealth {
  status: 'UP' | 'DOWN';
  dbStatus: 'UP' | 'DOWN';
  redisStatus: 'UP' | 'DOWN';
  uptimeSeconds: number;
  version: string;
}
