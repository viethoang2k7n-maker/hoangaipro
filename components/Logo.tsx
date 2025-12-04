import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", variant = 'light' }) => {
  const primaryColor = "#2563EB"; // blue-600
  const secondaryColor = variant === 'dark' ? "#F8FAFC" : "#1E293B"; // slate-50 : slate-800

  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Abstract B */}
      <rect x="10" y="10" width="30" height="80" rx="5" fill={primaryColor} />
      <circle cx="65" cy="30" r="20" stroke={primaryColor} strokeWidth="10" />
      <circle cx="65" cy="70" r="20" stroke={secondaryColor} strokeWidth="10" />
      
      {/* Abstract A connection */}
      <path d="M40 50 L60 50" stroke={secondaryColor} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
};
