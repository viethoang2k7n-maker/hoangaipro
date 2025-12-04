
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';

export const TeamCalendar: React.FC = () => {
  const { users, tasks, departments } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const filteredUsers = selectedDept === 'ALL' 
    ? users 
    : users.filter(u => u.departmentId === selectedDept);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
             <CalendarIcon size={24} className="text-blue-600"/> Lịch làm việc nhóm
           </h1>
           <p className="text-sm text-slate-500">Theo dõi tiến độ và lịch trình của toàn bộ nhân sự</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                    <option value="ALL">Toàn bộ công ty</option>
                    {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ChevronLeft size={20} className="dark:text-slate-300"/></button>
                <span className="px-3 font-medium text-sm dark:text-white min-w-[100px] text-center">
                    Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><ChevronRight size={20} className="dark:text-slate-300"/></button>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          {/* Calendar Header */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-700 p-4 min-w-[200px] text-left text-xs font-bold text-slate-500 uppercase">
                            Nhân sự
                        </th>
                        {daysArray.map(day => {
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            const isToday = new Date().toDateString() === date.toDateString();
                            return (
                                <th key={day} className={`p-2 border-b border-slate-200 dark:border-slate-700 min-w-[40px] text-center ${isWeekend ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800'}`}>
                                    <div className={`text-xs font-semibold ${isToday ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>{day}</div>
                                    <div className="text-[10px] text-slate-400 font-normal">
                                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()]}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredUsers.map(u => (
                        <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/20">
                            <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 p-3 border-r border-slate-200 dark:border-slate-700 group-hover:bg-slate-50 dark:group-hover:bg-slate-700/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[140px]">{u.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{u.role}</p>
                                    </div>
                                </div>
                            </td>
                            {daysArray.map(day => {
                                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const userTasks = tasks.filter(t => t.assigneeId === u.id && t.dueDate === dateStr);
                                const isWeekend = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() % 6 === 0;

                                return (
                                    <td key={day} className={`p-1 border-r border-slate-100 dark:border-slate-800 h-16 align-top ${isWeekend ? 'bg-slate-50/50 dark:bg-slate-900/30' : ''}`}>
                                        <div className="flex flex-col gap-1 h-full">
                                            {userTasks.map(task => (
                                                <div 
                                                    key={task.id} 
                                                    title={`${task.title} (${task.status})`}
                                                    className={`h-full min-h-[20px] rounded px-1 text-[10px] truncate cursor-pointer transition-all hover:opacity-80 flex items-center
                                                        ${task.status === 'DONE' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 
                                                          task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 
                                                          'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};
