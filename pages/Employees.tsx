
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MoreVertical, Plus, Briefcase, Check, X, UserPlus, Clock } from 'lucide-react';
import { Role } from '../types';

export const Employees: React.FC = () => {
  const { users, departments, candidates, addEmployee, hireCandidate } = useApp();
  const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'CANDIDATES'>('EMPLOYEES');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<Role>(Role.EMPLOYEE);
  const [newEmpDept, setNewEmpDept] = useState('');

  const handleAddEmployee = () => {
      if(!newEmpName || !newEmpEmail) return;
      addEmployee({
          name: newEmpName,
          email: newEmpEmail,
          role: newEmpRole,
          departmentId: newEmpDept,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmpName)}&background=random`,
          isOnline: false
      });
      setShowAddModal(false);
      setNewEmpName('');
      setNewEmpEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
             <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nhân sự & Tuyển dụng</h1>
             <p className="text-sm text-slate-500">Quản lý hồ sơ nhân viên và ứng viên tiềm năng</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <UserPlus size={18} /> Thêm nhân viên
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-6">
              <button 
                onClick={() => setActiveTab('EMPLOYEES')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'EMPLOYEES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                  Danh sách nhân viên ({users.length})
              </button>
              <button 
                onClick={() => setActiveTab('CANDIDATES')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CANDIDATES' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                  Ứng viên xin việc ({candidates.length})
              </button>
          </div>
      </div>

      {activeTab === 'EMPLOYEES' ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                            <th className="p-4 pl-6">Nhân viên</th>
                            <th className="p-4">Vai trò</th>
                            <th className="p-4">Phòng ban</th>
                            <th className="p-4">Liên hệ</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {users.map(u => {
                            const dept = departments.find(d => d.id === u.departmentId);
                            return (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-600" />
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                                                <div className="text-xs text-slate-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 
                                            u.role === 'MANAGER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                                        {dept?.name || '-'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-3 text-slate-400">
                                            <button className="hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full"><Mail size={14} /></button>
                                            <button className="hover:text-green-600 transition-colors bg-slate-100 dark:bg-slate-700 p-1.5 rounded-full"><Phone size={14} /></button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${u.isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{u.isOnline ? 'Online' : 'Offline'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {candidates.length > 0 ? candidates.map(candidate => (
                <div key={candidate.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    
                    <div className="flex items-center gap-4 mb-4 relative">
                        <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm" />
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{candidate.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                                <Briefcase size={14} />
                                {candidate.position}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2 mb-6 text-sm text-slate-500 dark:text-slate-400 relative">
                        <div className="flex items-center gap-2">
                            <Mail size={14} /> {candidate.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} /> Ứng tuyển: {new Date(candidate.appliedDate).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => hireCandidate(candidate.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
                        >
                            <Check size={16} /> Duyệt
                        </button>
                        <button className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 py-2 rounded-lg font-medium transition-colors">
                            Từ chối
                        </button>
                    </div>
                </div>
            )) : (
                <div className="col-span-3 text-center py-12 text-slate-400">
                    <p>Hiện không có ứng viên nào đang chờ duyệt.</p>
                </div>
            )}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-xl font-bold mb-6 dark:text-white">Thêm nhân viên mới</h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Họ và tên</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            value={newEmpName}
                            onChange={(e) => setNewEmpName(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Email</label>
                          <input 
                            type="email" 
                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            value={newEmpEmail}
                            onChange={(e) => setNewEmpEmail(e.target.value)}
                          />
                      </div>
                       <div>
                            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Vai trò</label>
                            <select 
                                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={newEmpRole}
                                onChange={(e) => setNewEmpRole(e.target.value as Role)}
                            >
                                <option value={Role.EMPLOYEE}>Nhân viên</option>
                                <option value={Role.MANAGER}>Trưởng phòng</option>
                                <option value={Role.ADMIN}>Admin</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1 dark:text-slate-300">Phòng ban</label>
                            <select 
                                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={newEmpDept}
                                onChange={(e) => setNewEmpDept(e.target.value)}
                            >
                                <option value="">-- Chọn phòng ban --</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-slate-700">
                          <button 
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
                          >
                              Hủy
                          </button>
                          <button 
                            onClick={handleAddEmployee}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                          >
                              Thêm nhân viên
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
