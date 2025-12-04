
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Bell, Lock, Globe, Shield, LogOut, ChevronRight, Moon, Smartphone, HelpCircle, Mail } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, theme, toggleTheme, logout } = useApp();
  const [activeTab, setActiveTab] = useState('general');

  const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              {children}
          </div>
      </div>
  );

  const SettingItem: React.FC<{ icon: React.ReactNode; label: string; subLabel?: string; action?: React.ReactNode; onClick?: () => void; isLast?: boolean }> = ({ icon, label, subLabel, action, onClick, isLast }) => (
      <div 
        onClick={onClick}
        className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-slate-100 dark:border-slate-700' : ''} hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer`}
      >
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  {icon}
              </div>
              <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">{label}</h4>
                  {subLabel && <p className="text-xs text-slate-500">{subLabel}</p>}
              </div>
          </div>
          <div className="flex items-center gap-2">
              {action}
              {!action && <ChevronRight size={18} className="text-slate-400" />}
          </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cài đặt</h1>
        <p className="text-sm text-slate-500">Quản lý tài khoản và tùy chọn ứng dụng</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative">
             <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700" />
             <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-4 border-white dark:border-slate-800 hover:bg-blue-700 transition-colors">
                 <User size={14} />
             </button>
          </div>
          <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <div className="flex gap-2 justify-center sm:justify-start mt-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
                      {user?.role}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                      Verified
                  </span>
              </div>
          </div>
          <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">
              Chỉnh sửa hồ sơ
          </button>
      </div>

      <SettingSection title="Chung">
           <SettingItem 
                icon={<Moon size={20} />} 
                label="Giao diện" 
                subLabel={theme === 'light' ? 'Đang dùng chế độ sáng' : 'Đang dùng chế độ tối'}
                action={
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`} onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`}></div>
                    </div>
                }
           />
           <SettingItem icon={<Globe size={20} />} label="Ngôn ngữ" subLabel="Tiếng Việt (Mặc định)" />
           <SettingItem icon={<Smartphone size={20} />} label="Thiết bị đăng nhập" subLabel="MacBook Pro - Ho Chi Minh City" isLast />
      </SettingSection>

      <SettingSection title="Thông báo & Bảo mật">
           <SettingItem 
              icon={<Bell size={20} />} 
              label="Thông báo đẩy" 
              subLabel="Nhận thông báo về công việc mới" 
              action={<div className="w-12 h-6 rounded-full p-1 bg-blue-600"><div className="w-4 h-4 bg-white rounded-full shadow-md translate-x-6"></div></div>}
            />
            <SettingItem icon={<Mail size={20} />} label="Email thông báo" subLabel="Gửi tổng hợp báo cáo hàng ngày" />
            <SettingItem icon={<Lock size={20} />} label="Đổi mật khẩu" />
            <SettingItem icon={<Shield size={20} />} label="Xác thực 2 yếu tố (2FA)" subLabel="Chưa kích hoạt" isLast />
      </SettingSection>

      <SettingSection title="Khác">
          <SettingItem icon={<HelpCircle size={20} />} label="Trợ giúp & Hỗ trợ" />
          <SettingItem icon={<LogOut size={20} />} label="Đăng xuất tài khoản" onClick={logout} isLast />
      </SettingSection>
      
      <div className="text-center text-xs text-slate-400 pt-4">
          <p>BizTask AI v1.0.2 (Build 20241220)</p>
          <p className="mt-1">Designed for Business Excellence</p>
      </div>
    </div>
  );
};
