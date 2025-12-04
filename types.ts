
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  departmentId?: string;
  isOnline?: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  appliedDate: string;
  avatar: string;
  status: 'PENDING' | 'INTERVIEW' | 'REJECTED';
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  memberCount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  creatorId: string;
  projectId?: string; // Link task to a project
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // ISO date string
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'ai' or 'user' or userId
  text: string;
  timestamp: number;
  isRead: boolean;
  type: 'text' | 'image';
}

export interface Channel {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'DIRECT';
  projectId?: string; // Linked to a project
}

export interface GroupMessage {
  id: string;
  channelId: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'Shareholder' | 'Tech Partner';
  description: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  departments: Department[];
  tasks: Task[];
  projects: Project[];
  theme: 'light' | 'dark';
}