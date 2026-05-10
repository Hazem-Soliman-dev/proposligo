import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 120,
    xl: 200
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full group-hover:bg-emerald-400/20 transition-colors" />
        
        <Image
          src="/ProposliGo Logo.png"
          alt="ProposliGo Logo"
          width={currentSize}
          height={currentSize}
          className="relative z-10 object-contain"
          priority
        />
      </div>
    </div>
  );
};

export default Logo;
