'use client';

import React from 'react';
import { getSignDetail } from '@/lib/signs';
import type { SignPreference } from '@/types/database';

interface SignBoxProps {
  letter: string;
  system: SignPreference;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'normal' | 'large';
}

export function SignBox({
  letter,
  system,
  isActive = false,
  onClick,
  size = 'normal',
}: SignBoxProps) {
  const detail = getSignDetail(letter, system);

  const isLarge = size === 'large';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Huruf isyarat ${letter} sistem ${system}: ${detail.description}`}
      className={`flex flex-col items-center justify-between rounded-xl border transition-all duration-150 motion-reduce:transition-none ${
        isLarge
          ? 'h-32 w-28 p-2 2xl:h-40 2xl:w-36'
          : 'h-24 w-20 p-1.5 sm:h-28 sm:w-24'
      } ${
        isActive
          ? 'border-brand bg-brand-subtle ring-2 ring-brand'
          : 'border-border-subtle bg-surface-subtle hover:border-border-strong'
      }`}
    >
      {/* Visual Tangan Isyarat (Siluet / Simbol Kontras Tinggi) */}
      <div className="flex flex-1 items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isLarge ? 'h-16 w-16 2xl:h-20 2xl:w-20' : 'h-12 w-12'}
          aria-hidden="true"
        >
          {/* Latar Belakang Tangan */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="8"
            className={isActive ? 'fill-blue-100 stroke-brand' : 'fill-white stroke-border-strong'}
            strokeWidth="1.5"
          />

          {/* Ikon Tangan Adaptif Sederhana & Bersih */}
          <path
            d="M24 10C21 10 19 13 19 18V24H15C13 24 11 26 11 28C11 34 16 38 24 38C32 38 37 34 37 28V20C37 18 35 16 33 16C31 16 30 17 29 18V15C29 13 27 11 25 11C24.7 11 24.3 11 24 11.2V10Z"
            className={isActive ? 'fill-brand stroke-brand' : 'fill-slate-800 stroke-slate-900'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Garis Jari Penjelas */}
          <line x1="24" y1="16" x2="24" y2="24" stroke="white" strokeWidth="1.5" />
          <line x1="29" y1="19" x2="29" y2="25" stroke="white" strokeWidth="1.5" />
          <line x1="19" y1="20" x2="19" y2="25" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Huruf Kapital & Label Sistem */}
      <div className="flex w-full items-baseline justify-between border-t border-border-subtle pt-1 px-1">
        <span className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {letter}
        </span>
        <span className="text-[10px] font-semibold uppercase text-ink-muted">
          {system}
        </span>
      </div>
    </div>
  );
}
