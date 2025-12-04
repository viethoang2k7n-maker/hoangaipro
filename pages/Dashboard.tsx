
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock, Zap, Target, Calendar, Globe } from 'lucide-react';
import { TaskStatus } from '../types';

const KPICard: React.FC<{ title: string; value: string; subValue?: string; trend?: string; icon: React.ReactNode; color: string }> = ({ title, value, subValue, trend, icon, color }) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: color.replace('bg-', 'text-') })}
      </div>
      {trend && (
        <span className="text-xs font-medium text-green-500 flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <div className="flex items-baseline gap-2 mt-1">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subValue && <p className="text-xs text-slate-500 dark:text-slate-400">{subValue}</p>}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { user, tasks, departments, users, partners } = useApp();

  const taskStats = [
    { name: 'Hoàn thành', value: tasks.filter(t => t.status === TaskStatus.DONE).length, color: '#22c55e' },
    { name: 'Đang làm', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#3b82f6' },
    { name: 'Chờ duyệt', value: tasks.filter(t => t.status === TaskStatus.REVIEW).length, color: '#f59e0b' },
    { name: 'Cần làm', value: tasks.filter(t => t.status === TaskStatus.TODO).length, color: '#64748b' },
  ];

  const deptData = departments.map(d => ({
    name: d.name,
    tasks: Math.floor(Math.random() * 50) + 10,
  }));

  const productivityData = [
      { name: 'T2', score: 65 }, { name: 'T3', score: 78 }, { name: 'T4', score: 82 }, 
      { name: 'T5', score: 75 }, { name: 'T6', score: 90 }, { name: 'T7', score: 85 }, { name: 'CN', score: 40 }
  ];

  const myTasks = tasks.filter(t => t.assigneeId === user?.id && t.status !== TaskStatus.DONE);
  const onlineUsers = users.filter(u => u.isOnline);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tổng quan Dashboard</h1>
           <p className="text-slate-500 text-sm">Cập nhật lúc {new Date().toLocaleTimeString()} - Chúc {user?.name} làm việc hiệu quả!</p>
        </div>
        <div className="flex gap-3">
             <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600 dark:text-slate-300">Hệ thống ổn định</span>
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/20">
              + Tạo báo cáo
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Kết quả KPI Tháng" 
          value="94.5%" 
          subValue="Mục tiêu: 90%"
          trend="+4.5%" 
          icon={<Target size={24} />} 
          color="bg-indigo-500" 
        />
         <KPICard 
          title="Thời gian làm việc" 
          value="142h" 
          subValue="/ 160h chuẩn"
          trend="Đúng tiến độ" 
          icon={<Clock size={24} />} 
          color="bg-blue-500" 
        />
        <KPICard 
          title="Công việc hoàn thành" 
          value={tasks.filter(t => t.status === TaskStatus.DONE).length.toString()}
          subValue={`trên tổng ${tasks.length} việc`}
          trend="+12%" 
          icon={<CheckCircle size={24} />} 
          color="bg-green-500" 
        />
        <KPICard 
          title="Năng suất trung bình" 
          value="High" 
          subValue="Top 10% công ty"
          trend="+2%" 
          icon={<Zap size={24} />} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white">Năng suất làm việc 7 ngày qua</h3>
            <select className="text-xs bg-slate-50 dark:bg-slate-700 border-none rounded-lg p-2 outline-none">
                <option>Tuần này</option>
                <option>Tháng này</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Trạng thái công việc</h3>
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {taskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800 dark:text-white">{tasks.length}</span>
                <span className="text-xs text-slate-500">Tasks</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
              {taskStats.map((stat) => (
                  <div key={stat.name} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{backgroundColor: stat.color}}></div>
                          <span className="text-slate-600 dark:text-slate-300">{stat.name}</span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{stat.value}</span>
                  </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tasks List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle size={18} className="text-blue-600" />
                    Việc cần làm của tôi
                </h3>
                <span className="text-xs text-slate-500 hover:text-blue-600 cursor-pointer">Xem tất cả</span>
            </div>
            <div className="space-y-3">
                {myTasks.length > 0 ? myTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-600 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500' : task.priority === 'MEDIUM' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                            <div>
                                <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{task.title}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                            {task.status}
                        </span>
                    </div>
                )) : (
                    <div className="text-center py-8 text-slate-400 text-sm">Bạn đã hoàn thành hết công việc!</div>
                )}
            </div>
          </div>

          {/* Online Team */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-green-600" />
                    Đang trực tuyến
                </h3>
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{onlineUsers.length}</span>
            </div>
            <div className="space-y-4">
                {users.slice(0, 5).map((u, idx) => ( 
                    <div key={u.id} className="flex items-center gap-3">
                        <div className="relative">
                            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800" />
                            {u.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                            <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        </div>
                        <div className="text-xs text-slate-400">
                             {u.isOnline ? 'Online' : '15p trước'}
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Xem toàn bộ team
            </button>
          </div>
      </div>

      {/* Strategic Partners Section */}
      <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe size={20} className="text-blue-600" />
              Đối tác chiến lược & Cổ đông
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {partners.map(p => (
                  <div key={p.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-lg transition-all group cursor-pointer">
                      <div className="h-16 w-16 mb-4 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-full p-2 group-hover:scale-110 transition-transform">
                          <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{p.name}</h3>
                      <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full mb-2">
                          {p.type}
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
