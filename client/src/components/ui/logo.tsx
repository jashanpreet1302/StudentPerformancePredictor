import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const ClueStradLogo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#16A34A", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#059669", stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Background rounded square */}
      <rect 
        x="2" y="2" width="28" height="28" rx="6" ry="6" 
        fill="url(#greenGradient)" 
        stroke="#047857" 
        strokeWidth="1"
      />
      
      {/* Letter S with lightning integration */}
      <g fill="white">
        {/* Main S shape */}
        <path d="M8 8 L20 8 C22 8 24 10 24 12 C24 14 22 16 20 16 L12 16 L12 18 L20 18 C22 18 24 20 24 22 C24 24 22 26 20 26 L8 26 L8 23 L19 23 C19.5 23 20 22.5 20 22 C20 21.5 19.5 21 19 21 L11 21 L11 13 C11 12.5 11.5 12 12 12 L19 12 C19.5 12 20 12.5 20 13 C20 13.5 19.5 14 19 14 L8 14 L8 8 Z"/>
        
        {/* Lightning bolt accent */}
        <path d="M20 14 L24 10 L22 10 L25 7 L28 12 L26 12 L23 16 L20 14 Z" fill="#EA580C"/>
      </g>
    </svg>
  );
};