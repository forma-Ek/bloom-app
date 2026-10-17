'use client';

import React from 'react';

interface BloomLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'emblem' | 'full';
}

export const BloomLogo: React.FC<BloomLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'emblem',
}) => {
  if (variant === 'full') {
    const sizeClasses = {
      sm: 'h-8',
      md: 'h-12',
      lg: 'h-20',
      xl: 'h-28',
    };

    return (
      <div className={`relative inline-flex items-center overflow-hidden rounded-xl ${sizeClasses[size]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bloom-logo.png"
          alt="BLOOM Specialty Coffee"
          className="h-full w-auto object-contain rounded-xl"
        />
      </div>
    );
  }

  // Emblem mode (optimized for navbar badge or square icon)
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-[#1b1c1e] border border-amber-500/30 shadow-md shadow-black/40 shrink-0 ${emblemSizes[size]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bloom-logo.png"
        alt="BLOOM Coffee Logo"
        className="w-[170%] h-[170%] max-w-none object-cover object-[center_35%] scale-105"
      />
    </div>
  );
};
