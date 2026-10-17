'use client';

import React from 'react';

interface BloomLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header';
  variant?: 'emblem' | 'full';
}

export const BloomLogo: React.FC<BloomLogoProps> = ({
  className = '',
  size = 'header',
  variant = 'emblem',
}) => {
  if (variant === 'full') {
    const sizeClasses = {
      sm: 'h-9',
      md: 'h-12',
      header: 'h-12 sm:h-14',
      lg: 'h-20',
      xl: 'h-28',
    };

    return (
      <div className={`relative inline-flex items-center overflow-hidden rounded-2xl ${sizeClasses[size]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="BLOOM Specialty Coffee"
          className="h-full w-auto object-contain rounded-2xl"
        />
      </div>
    );
  }

  // Emblem mode: focused on the iconic coffee blossom and bean mark
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    header: 'w-12 h-12 sm:w-14 sm:h-14', // Large and prominent for header
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-[#161619] border-2 border-[#C88A6E]/40 shadow-lg shadow-black/60 shrink-0 transition-transform group-hover:scale-105 group-hover:border-[#C88A6E] ${emblemSizes[size]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="BLOOM Coffee Logo"
        className="w-[185%] h-[185%] max-w-none object-cover object-[center_34%] transition-transform duration-300"
      />
    </div>
  );
};
