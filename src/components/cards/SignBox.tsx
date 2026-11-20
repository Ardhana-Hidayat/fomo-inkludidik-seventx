'use client';

import React from 'react';
import { getSignDetail } from '@/lib/signs';
import { SignIllustration } from './SignIllustration';
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
          ? 'h-36 w-32 p-2.5 2xl:h-48 2xl:w-40'
          : 'h-28 w-24 p-1.5 sm:h-32 sm:w-28'
      } ${
        isActive
          ? 'border-brand bg-brand-subtle ring-2 ring-brand'
          : 'border-border-subtle bg-surface hover:border-border-strong'
      }`}
    >
      {/* Visual Tangan Isyarat Realistis & Anatomis Sesuai Huruf */}
      <div className="flex flex-1 items-center justify-center p-0.5">
        <SignIllustration
          letter={letter}
          system={system}
          isActive={isActive}
          className={isLarge ? 'h-20 w-20 2xl:h-28 2xl:w-28' : 'h-14 w-14 sm:h-16 sm:w-16'}
        />
      </div>

      {/* Huruf Kapital & Label Sistem */}
      <div className="flex w-full items-baseline justify-between border-t border-border-subtle pt-1 px-1">
        <span className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {letter}
        </span>
        <span className="text-[10px] font-bold uppercase text-brand">
          {system}
        </span>
      </div>

      {/* Petunjuk Posisi Jari Singkat */}
      <span className="w-full truncate px-0.5 text-center text-[10px] font-medium text-ink-muted">
        {detail.fingers}
      </span>
    </div>
  );
}
