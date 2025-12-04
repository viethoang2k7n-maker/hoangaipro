
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Task, Department, Role, TaskStatus, TaskPriority, Candidate, Project, Partner, Channel, GroupMessage } from '../types';

interface AppContextType {
  user: User | null;
  users: User[];
  candidates: Candidate[];
  departments: Department[];
  tasks: Task[];
  projects: Project[];
  partners: Partner[];
  channels: Channel[];
  groupMessages: GroupMessage[];
  theme: 'light' | 'dark';
  login: (email: string, role: Role) => void;
  logout: () => void;
  toggleTheme: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addEmployee: (user: Omit<User, 'id'>) => void;
  hireCandidate: (candidateId: string) => void;
  sendGroupMessage: (channelId: string, text: string) => void;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data
const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Phát triển sản phẩm', memberCount: 5, managerId: 'u2' },
  { id: 'd2', name: 'Marketing', memberCount: 3, managerId: 'u4' },
  { id: 'd3', name: 'Nhân sự', memberCount: 2, managerId: 'u5' },
];

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Nguyễn Văn Admin', email: 'admin@biztask.ai', role: Role.ADMIN, avatar: 'https://i.pravatar.cc/150?u=u1', isOnline: true },
  { id: 'u2', name: 'Trần Trưởng Phòng', email: 'manager@biztask.ai', role: Role.MANAGER, departmentId: 'd1', avatar: 'https://i.pravatar.cc/150?u=u2', isOnline: true },
  { id: 'u3', name: 'Lê Nhân Viên', email: 'staff@biztask.ai', role: Role.EMPLOYEE, departmentId: 'd1', avatar: 'https://i.pravatar.cc/150?u=u3', isOnline: false },
  { id: 'u4', name: 'Phạm Designer', email: 'design@biztask.ai', role: Role.EMPLOYEE, departmentId: 'd2', avatar: 'https://i.pravatar.cc/150?u=u4', isOnline: true },
  { id: 'u5', name: 'Hoàng HR', email: 'hr@biztask.ai', role: Role.EMPLOYEE, departmentId: 'd3', avatar: 'https://i.pravatar.cc/150?u=u5', isOnline: false },
];

const MOCK_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Đặng Ứng Viên', email: 'candidate1@gmail.com', position: 'Frontend Developer', appliedDate: '2023-12-15', avatar: 'https://i.pravatar.cc/150?u=c1', status: 'PENDING' },
  { id: 'c2', name: 'Vũ Tester', email: 'candidate2@gmail.com', position: 'QA QC', appliedDate: '2023-12-18', avatar: 'https://i.pravatar.cc/150?u=c2', status: 'INTERVIEW' },
];

const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'BizTask Mobile App', description: 'Phát triển ứng dụng mobile cho khách hàng', status: 'ACTIVE', progress: 75 },
  { id: 'p2', name: 'Marketing Tết 2024', description: 'Chiến dịch quảng bá mùa Tết', status: 'ACTIVE', progress: 40 },
  { id: 'p3', name: 'Nâng cấp Hạ tầng Server', description: 'Migrate dữ liệu sang Cloud mới', status: 'ON_HOLD', progress: 20 },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Thiết kế giao diện Dashboard', description: 'Hoàn thiện UI/UX cho màn hình dashboard admin', assigneeId: 'u3', creatorId: 'u2', projectId: 'p1', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, dueDate: '2023-12-31', createdAt: '2023-12-01' },
  { id: 't2', title: 'Tích hợp Gemini API', description: 'Viết service kết nối Google Gemini', assigneeId: 'u3', creatorId: 'u2', projectId: 'p1', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, dueDate: '2023-12-25', createdAt: '2023-12-05' },
  { id: 't3', title: 'Báo cáo quý 4', description: 'Tổng hợp số liệu kinh doanh', assigneeId: 'u2', creatorId: 'u1', projectId: 'p2', status: TaskStatus.REVIEW, priority: TaskPriority.HIGH, dueDate: '2024-01-05', createdAt: '2023-12-10' },
  { id: 't4', title: 'Họp team Marketing', description: 'Brainstorm ý tưởng chiến dịch Tết', assigneeId: 'u4', creatorId: 'u2', projectId: 'p2', status: TaskStatus.DONE, priority: TaskPriority.LOW, dueDate: '2023-12-20', createdAt: '2023-12-01' },
  { id: 't5', title: 'Tuyển dụng ReactJS', description: 'Phỏng vấn ứng viên Senior', assigneeId: 'u5', creatorId: 'u1', projectId: 'p3', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, dueDate: '2023-12-28', createdAt: '2023-12-15' },
];

const MOCK_PARTNERS: Partner[] = [
  { id: 'pt1', name: 'OpenAI (ChatGPT)', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', type: 'Tech Partner', description: 'Cung cấp giải pháp NLP tiên tiến' },
  { id: 'pt2', name: 'Suno AI', logo: 'https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/e5gplb1sm0l95c8u7q7k', type: 'Shareholder', description: 'Đối tác chiến lược mảng âm thanh' },
  { id: 'pt3', name: 'Google DeepMind (Veo)', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Google_DeepMind_Logo.svg/2560px-Google_DeepMind_Logo.svg.png', type: 'Shareholder', description: 'Hợp tác phát triển Video Generative AI' },
];

const MOCK_CHANNELS: Channel[] = [
  { id: 'ch1', name: 'Chung (General)', type: 'PUBLIC' },
  { id: 'ch2', name: 'Thông báo', type: 'PUBLIC' },
  { id: 'ch3', name: 'BizTask Mobile App', type: 'PUBLIC', projectId: 'p1' },
  { id: 'ch4', name: 'Marketing Tết', type: 'PUBLIC', projectId: 'p2' },
];

const MOCK_MESSAGES: GroupMessage[] = [
  { id: 'm1', channelId: 'ch1', senderId: 'u1', text: 'Chào mọi người, tuần này chúng ta tập trung vào dự án Mobile nhé!', timestamp: Date.now() - 10000000 },
  { id: 'm2', channelId: 'ch3', senderId: 'u2', text: 'Tiến độ API đến đâu rồi @Lê Nhân Viên?', timestamp: Date.now() - 5000000 },
  { id: 'm3', channelId: 'ch3', senderId: 'u3', text: 'Em đang fix bug phần Auth, chiều nay sẽ xong ạ.', timestamp: Date.now() - 4000000 },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [departments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>(MOCK_MESSAGES);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Load theme from system preference initially
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme class to body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const login = (email: string, role: Role) => {
    const foundUser = users.find(u => u.role === role) || users[0];
    setUser(foundUser);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);
  };

  const addProject = (newProject: Omit<Project, 'id'>) => {
    const project: Project = {
      ...newProject,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProjects(prev => [...prev, project]);
    // Create a chat channel for the new project
    setChannels(prev => [...prev, {
      id: `ch_${project.id}`,
      name: project.name,
      type: 'PUBLIC',
      projectId: project.id
    }]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const addEmployee = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: Math.random().toString(36).substr(2, 9),
      isOnline: false
    };
    setUsers(prev => [...prev, user]);
  };

  const hireCandidate = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      addEmployee({
        name: candidate.name,
        email: candidate.email,
        role: Role.EMPLOYEE,
        avatar: candidate.avatar,
        departmentId: 'd1'
      });
      setCandidates(prev => prev.filter(c => c.id !== candidateId));
    }
  };

  const sendGroupMessage = (channelId: string, text: string) => {
    if (!user) return;
    const msg: GroupMessage = {
      id: Math.random().toString(36).substr(2, 9),
      channelId,
      senderId: user.id,
      text,
      timestamp: Date.now()
    };
    setGroupMessages(prev => [...prev, msg]);
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
  };

  return (
    <AppContext.Provider value={{
      user,
      users,
      candidates,
      departments,
      tasks,
      projects,
      partners: MOCK_PARTNERS,
      channels,
      groupMessages,
      theme,
      login,
      logout,
      toggleTheme,
      addTask,
      addProject,
      updateTaskStatus,
      addEmployee,
      hireCandidate,
      sendGroupMessage,
      hasOnboarded,
      completeOnboarding
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
