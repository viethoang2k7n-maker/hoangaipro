import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const { login } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chào mừng trở lại</h1>
          <p className="text-slate-500 text-sm mt-2">Chọn vai trò để trải nghiệm Demo</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => login('admin@biztask.ai', Role.ADMIN)}
            className="w-full p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">A</div>
            <div className="text-left">
              <p className="font-semibold text-blue-900 dark:text-blue-100">Giám đốc (Admin)</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Quyền cao nhất, xem toàn bộ báo cáo</p>
            </div>
          </button>

          <button 
            onClick={() => login('manager@biztask.ai', Role.MANAGER)}
            className="w-full p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">M</div>
            <div className="text-left">
              <p className="font-semibold text-purple-900 dark:text-purple-100">Trưởng phòng</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Quản lý nhân viên & tiến độ</p>
            </div>
          </button>

          <button 
            onClick={() => login('staff@biztask.ai', Role.EMPLOYEE)}
            className="w-full p-4 rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">E</div>
            <div className="text-left">
              <p className="font-semibold text-green-900 dark:text-green-100">Nhân viên</p>
              <p className="text-xs text-green-700 dark:text-green-300">Thực hiện công việc & báo cáo</p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">BizTask AI © 2024. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
