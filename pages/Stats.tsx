
import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, Award, UserCheck, AlertCircle } from 'lucide-react';
import { TaskStatus } from '../types';

export const Stats: React.FC = () => {
  const { users, tasks } = useApp();

  // Calculate KPI Data for each user
  const userKpiData = users.map(u => {
      const userTasks = tasks.filter(t => t.assigneeId === u.id);
      const total = userTasks.length;
      const completed = userTasks.filter(t => t.status === TaskStatus.DONE).length;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      // Mock Efficiency Score (Random for demo)
      const efficiency = total > 0 ? Math.floor(Math.random() * 30) + 70 : 0; 

      return {
          name: u.name,
          completed,
          total,
          rate,
          efficiency,
          avatar: u.avatar
      };
  }).filter(d => d.total > 0).sort((a, b) => b.rate - a.rate);

  // Top Performer
  const topPerformer = userKpiData[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thống kê & KPI</h1>
           <p className="text-sm text-slate-500">Báo cáo hiệu suất làm việc của nhân sự trong tháng</p>
        </div>
        <div className="flex gap-2">
            <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
                <option>Tháng này</option>
                <option>Tháng trước</option>
                <option>Quý này</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Xuất báo cáo
            </button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-white/20 rounded-xl"><Award size={24} /></div>
                 <div>
                     <p className="text-blue-100 text-sm">Nhân viên xuất sắc</p>
                     <p className="font-bold text-lg">{topPerformer?.name || 'N/A'}</p>
                 </div>
              </div>
              <div className="flex justify-between items-end">
                  <div>
                      <span className="text-3xl font-bold">{topPerformer?.rate}%</span>
                      <span className="text-blue-100 text-sm ml-2">hoàn thành</span>
                  </div>
                  <img src={topPerformer?.avatar} className="w-12 h-12 rounded-full border-2 border-white/30" alt="Winner"/>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg"><TrendingUp size={20}/></div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Tổng hiệu suất toàn công ty</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">87.5%</p>
              <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp size={14} /> +5.2% so với tháng trước
              </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg"><AlertCircle size={20}/></div>
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Công việc trễ hạn</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-4">3</p>
              <p className="text-sm text-slate-500 mt-1">
                  Cần nhắc nhở các bộ phận liên quan
              </p>
          </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Tỷ lệ hoàn thành công việc theo nhân sự</h3>
              <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userKpiData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#64748b'}} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                          <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name="Tỷ lệ %" />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">Điểm chất lượng & Năng suất</h3>
              <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userKpiData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} />
                          <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                          <Tooltip contentStyle={{borderRadius: '8px'}} />
                          <Legend />
                          <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} name="Điểm hiệu quả" />
                          <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={3} name="Tỷ lệ hoàn thành" />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white">Chi tiết hiệu suất nhân sự</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                      <tr>
                          <th className="p-4 pl-6">Nhân viên</th>
                          <th className="p-4 text-center">Tổng việc được giao</th>
                          <th className="p-4 text-center">Đã hoàn thành</th>
                          <th className="p-4 text-center">Tỷ lệ</th>
                          <th className="p-4 text-center">Đánh giá</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {userKpiData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                              <td className="p-4 pl-6 flex items-center gap-3">
                                  <span className="w-6 text-slate-400 text-sm font-medium">#{idx + 1}</span>
                                  <img src={row.avatar} alt="" className="w-8 h-8 rounded-full" />
                                  <span className="font-medium text-slate-900 dark:text-white">{row.name}</span>
                              </td>
                              <td className="p-4 text-center text-slate-600 dark:text-slate-300">{row.total}</td>
                              <td className="p-4 text-center text-slate-600 dark:text-slate-300">{row.completed}</td>
                              <td className="p-4 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      row.rate >= 80 ? 'bg-green-100 text-green-700' :
                                      row.rate >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                      {row.rate}%
                                  </span>
                              </td>
                              <td className="p-4 text-center">
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                      {row.rate >= 90 ? 'Xuất sắc' : row.rate >= 75 ? 'Tốt' : 'Cần cố gắng'}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
