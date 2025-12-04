
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, FileText, Download, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export const Library: React.FC = () => {
  const { users, tasks } = useApp();
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'RESOURCES'>('SCHEDULE');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper to generate days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(currentMonth);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const resources = [
      { id: 1, name: 'Quy trình làm việc.pdf', size: '2.4 MB', type: 'PDF', date: '2023-12-01' },
      { id: 2, name: 'Brand Guidelines.ai', size: '15 MB', type: 'AI', date: '2023-11-20' },
      { id: 3, name: 'Hợp đồng mẫu.docx', size: '450 KB', type: 'DOCX', date: '2023-12-10' },
      { id: 4, name: 'Báo cáo năm 2023.xlsx', size: '1.2 MB', type: 'XLSX', date: '2023-12-18' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thư viện & Lịch trình</h1>
           <p className="text-sm text-slate-500">Truy cập lịch trình làm việc và tài nguyên dùng chung</p>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-6">
              <button 
                onClick={() => setActiveTab('SCHEDULE')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'SCHEDULE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                  <Calendar size={18} /> Lịch trình công sở (Team Schedule)
              </button>
              <button 
                onClick={() => setActiveTab('RESOURCES')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'RESOURCES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                  <FileText size={18} /> Tài liệu doanh nghiệp
              </button>
          </div>
      </div>

      {activeTab === 'SCHEDULE' ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock size={20} className="text-blue-600" />
                      Tháng {currentMonth.getMonth() + 1} / {currentMonth.getFullYear()}
                  </h3>
                  <div className="flex gap-2">
                      <button onClick={prevMonth} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><ChevronLeft size={20}/></button>
                      <button onClick={nextMonth} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"><ChevronRight size={20}/></button>
                  </div>
              </div>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr>
                              <th className="p-4 min-w-[200px] border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-500 font-semibold sticky left-0 z-10">Thành viên</th>
                              {days.map(d => (
                                  <th key={d} className="p-2 border-b border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center min-w-[40px]">
                                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{d}</span>
                                  </th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {users.map(u => (
                              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                  <td className="p-3 border-b border-slate-100 dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                      <div className="flex items-center gap-3">
                                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                                          <div className="truncate w-32">
                                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                                              <p className="text-[10px] text-slate-500 truncate">{u.role}</p>
                                          </div>
                                      </div>
                                  </td>
                                  {days.map(d => {
                                      // Mock logic: randomly show busy status or specific tasks for that day
                                      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                      const hasTask = tasks.some(t => t.assigneeId === u.id && t.dueDate.startsWith(dateStr));
                                      const isWeekend = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d).getDay() % 6 === 0;

                                      return (
                                          <td key={d} className={`p-1 border-b border-l border-slate-100 dark:border-slate-700 text-center h-12 ${isWeekend ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}>
                                              {hasTask && (
                                                  <div className="w-full h-full min-h-[24px] bg-blue-100 dark:bg-blue-900/40 rounded flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors" title="Có công việc">
                                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                  </div>
                                              )}
                                          </td>
                                      )
                                  })}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map(file => (
                  <div key={file.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-300">
                              <FileText size={20} />
                          </div>
                          <button className="text-slate-400 hover:text-blue-600">
                              <Download size={18} />
                          </button>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white truncate mb-1">{file.name}</h4>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>{file.size}</span>
                          <span>{file.date}</span>
                      </div>
                  </div>
              ))}
              <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">
                  <Download size={32} className="mb-2" />
                  <span className="text-sm font-medium">Tải lên tài liệu mới</span>
              </div>
          </div>
      )}
    </div>
  );
};
