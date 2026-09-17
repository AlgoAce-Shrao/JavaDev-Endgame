import { User, Project, Task, Incident, Comment } from '../types/devflow';

export const SAMPLE_USERS: User[] = [
  {
    id: 1,
    name: 'Alice Admin',
    email: 'admin@devflow.com',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 2,
    name: 'Bob Manager',
    email: 'manager@devflow.com',
    role: 'MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 3,
    name: 'Charlie Dev',
    email: 'charlie@devflow.com',
    role: 'DEVELOPER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 4,
    name: 'Diana Dev',
    email: 'diana@devflow.com',
    role: 'DEVELOPER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Cloud Portal Migration',
    description: 'Migrating core legacy monolith services to Cloud Native Microservices architecture with Spring Boot 3 & Docker',
    owner: SAMPLE_USERS[1], // Bob Manager
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isCachedInRedis: true
  },
  {
    id: 2,
    name: 'Mobile SDK Integration',
    description: 'Building cross-platform authentication and analytics SDK for iOS and Android apps with OAuth 2.0 PKCE',
    owner: SAMPLE_USERS[0], // Alice Admin
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isCachedInRedis: false
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 101,
    title: 'Design Database Schema for Auth Service',
    description: 'Create PostgreSQL ERD and JPA entity mappings with Flyway migrations for users, roles, and tokens.',
    priority: 'HIGH',
    status: 'DONE',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    projectId: 1,
    projectName: 'Cloud Portal Migration',
    createdBy: SAMPLE_USERS[1],
    assignedTo: SAMPLE_USERS[2], // Charlie Dev
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 102,
    title: 'Implement JWT Refresh Token Mechanism',
    description: 'Add Redis-backed refresh token rotation and session revocation support in Spring Security filter chain.',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    projectId: 1,
    projectName: 'Cloud Portal Migration',
    createdBy: SAMPLE_USERS[1],
    assignedTo: SAMPLE_USERS[2], // Charlie Dev
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 103,
    title: 'Setup CI/CD Pipeline on GitHub Actions',
    description: 'Configure automated build, Maven test execution, static analysis, and Docker image publishing.',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    projectId: 2,
    projectName: 'Mobile SDK Integration',
    createdBy: SAMPLE_USERS[0],
    assignedTo: SAMPLE_USERS[3], // Diana Dev
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 104,
    title: 'OpenAPI / Swagger Documentation Setup',
    description: 'Integrate springdoc-openapi UI with JWT Bearer security scheme for interactive API endpoint testing.',
    priority: 'MEDIUM',
    status: 'REVIEW',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    projectId: 1,
    projectName: 'Cloud Portal Migration',
    createdBy: SAMPLE_USERS[1],
    assignedTo: SAMPLE_USERS[3], // Diana Dev
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 201,
    title: 'High Latency on JWT Validation Endpoint',
    description: 'Cache misses in Redis causing PostgreSQL connection pool exhaustion during peak load tests.',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    projectId: 1,
    projectName: 'Cloud Portal Migration',
    reportedBy: SAMPLE_USERS[3],
    assignedTo: SAMPLE_USERS[2],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 202,
    title: 'OAuth Redirect URL Parsing Failure',
    description: 'Special characters in state parameter cause 400 Bad Request during OAuth callback processing.',
    severity: 'MEDIUM',
    status: 'OPEN',
    projectId: 2,
    projectName: 'Mobile SDK Integration',
    reportedBy: SAMPLE_USERS[2],
    assignedTo: SAMPLE_USERS[3],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 301,
    content: 'I have identified the slow query in the execution plan. Applying index fixes now.',
    taskId: 102,
    author: SAMPLE_USERS[2],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 302,
    content: 'Great progress! Make sure to run performance benchmarks before merging to main.',
    taskId: 102,
    author: SAMPLE_USERS[1],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];
