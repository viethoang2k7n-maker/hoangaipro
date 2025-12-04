
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings as SettingsIcon, 
  MessageSquare,
  Building2,
  LogOut,
  Moon,
  Sun,
  Menu,
  Library as LibraryIcon
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Logo } from './components/Logo';
import { Chatbox } from './components/Chatbox';
import { Role } from './types';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Onboarding } from './pages/Onboarding';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Departments } from './pages/Departments';
import { Employees } from './pages/Employees';
import { Settings } from './pages/Settings';
import { Library } from './pages/Library';
import { TeamCalendar } from './pages/TeamCalendar';
import { Stats } from './pages/Stats';
import { InternalChat } from './pages/InternalChat';

type View = 'dashboard' | 'departments' | 'employees' | 'tasks' | 'library' | 'calendar' | 'stats' | 'chat' | 'settings';

const MainLayout: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useApp();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Login />;

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, role: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
    { id: 'departments', label: 'Phòng ban', icon: Building2, role: [Role.ADMIN] },
    { id: 'employees', label: 'Nhân sự', icon: Users, role: [Role.ADMIN, Role.MANAGER] },
    { id: 'tasks', label: 'Dự án & Công việc', icon: CheckSquare, role: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
    { id: 'library', label: 'Thư viện', icon: LibraryIcon, role: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
    { id: 'calendar', label: 'Lịch biểu', icon: CalendarIcon, role: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
    { id: 'stats', label: 'Thống kê KPI', icon: BarChart3, role: [Role.ADMIN, Role.MANAGER] },
    { id: 'chat', label: 'Chat nội bộ', icon: MessageSquare, role: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
    { id: 'settings', label: 'Cài đặt', icon: SettingsIcon, role: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'library': return <Library />;
      case 'departments': return <Departments />;
      case 'employees': return <Employees />;
      case 'calendar': return <TeamCalendar />;
      case 'stats': return <Stats />;
      case 'chat': return <InternalChat />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700">
          <Logo className="w-8 h-8" variant={theme} />
          <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">BizTask AI</h1>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)] no-scrollbar">
          {menuItems.filter(item => item.role.includes(user.role)).map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 p-2 rounded-lg text-sm transition-colors"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
              <button 
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-semibold lg:hidden pl-2 dark:text-white">BizTask AI</h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-50 dark:bg-slate-900">
          {renderContent()}
        </div>
      </main>
      
      {/* Global Components */}
      <Chatbox />
    </div>
  );
};

const AppContent = () => {
  const { hasOnboarded } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
