import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Check } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Quản lý công việc toàn diện",
      desc: "Giao việc, theo dõi tiến độ và báo cáo KPI ngay trên một nền tảng duy nhất.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Kết nối doanh nghiệp",
      desc: "Chat nội bộ và hệ thống phòng ban giúp kết nối nhân viên mọi lúc mọi nơi.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Trợ lý AI thông minh",
      desc: "BizBot hỗ trợ giải đáp thắc mắc và hướng dẫn sử dụng 24/7.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-900">
      <div className="flex-1 relative">
        <img 
          src={steps[step].image} 
          alt="Onboarding" 
          className="w-full h-2/3 object-cover rounded-b-[3rem] shadow-xl"
        />
        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/50 to-transparent rounded-b-[3rem]"></div>
      </div>

      <div className="h-1/3 flex flex-col items-center justify-between p-8 pb-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-all duration-300">
            {steps[step].title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm px-4">
            {steps[step].desc}
          </p>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {step === steps.length - 1 ? <Check size={24} /> : <ArrowRight size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};
