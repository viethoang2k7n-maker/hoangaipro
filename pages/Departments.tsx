import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Users, MoreHorizontal } from 'lucide-react';

export const Departments: React.FC = () => {
  const { departments, users } = useApp();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quản lý phòng ban</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Thêm phòng ban
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => {
            const manager = users.find(u => u.id === dept.managerId);
            return (
                <div key={dept.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Building2 size={24} />
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{dept.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                        <Users size={16} />
                        <span>{dept.memberCount} thành viên</span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Trưởng phòng</p>
                        <div className="flex items-center gap-3">
                            <img src={manager?.avatar || 'https://picsum.photos/50'} alt="Manager" className="w-8 h-8 rounded-full" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{manager?.name || 'Chưa bổ nhiệm'}</span>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};
