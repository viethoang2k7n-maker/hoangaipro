import React, { useEffect } from 'react';
import { Logo } from '../components/Logo';

export const Splash: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-screen w-full bg-blue-600 flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="z-10 animate-bounce-slow">
        <Logo className="w-24 h-24 mb-4 drop-shadow-lg" variant="dark" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-widest animate-fade-in-up z-10">BizTask AI</h1>
      <p className="mt-2 text-blue-100 opacity-80 text-sm animate-fade-in-up delay-200 z-10">Giải pháp quản lý thông minh</p>
      
      <div className="absolute bottom-10 z-10">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
