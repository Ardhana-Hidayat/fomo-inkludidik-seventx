'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SignPreference } from '@/types/database';

export type TextScale = 'normal' | 'large' | 'xlarge';
export type ContrastMode = 'standard' | 'high';

interface AccessibilityContextValue {
  contrast: ContrastMode;
  textScale: TextScale;
  signPreference: SignPreference;
  toggleContrast: () => void;
  setTextScale: (scale: TextScale) => void;
  setSignPreference: (pref: SignPreference) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  CONTRAST: 'inkludidik_contrast',
  TEXT_SCALE: 'inkludidik_text_scale',
  SIGN_PREF: 'inkludidik_sign_pref',
};

function getInitialContrast(): ContrastMode {
  if (typeof window === 'undefined') return 'standard';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTRAST);
    if (saved === 'high' || saved === 'standard') return saved;
  } catch {}
  return 'standard';
}

function getInitialTextScale(): TextScale {
  if (typeof window === 'undefined') return 'normal';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TEXT_SCALE);
    if (saved && ['normal', 'large', 'xlarge'].includes(saved)) return saved as TextScale;
  } catch {}
  return 'normal';
}

function getInitialSignPref(): SignPreference {
  if (typeof window === 'undefined') return 'SIBI';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SIGN_PREF);
    if (saved === 'SIBI' || saved === 'BISINDO') return saved;
  } catch {}
  return 'SIBI';
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [contrast, setContrast] = useState<ContrastMode>(getInitialContrast);
  const [textScale, setTextScaleState] = useState<TextScale>(getInitialTextScale);
  const [signPreference, setSignPreferenceState] = useState<SignPreference>(getInitialSignPref);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
    document.documentElement.setAttribute('data-text-scale', textScale);
  }, [contrast, textScale]);

  function toggleContrast() {
    const next = contrast === 'standard' ? 'high' : 'standard';
    setContrast(next);
    document.documentElement.setAttribute('data-contrast', next);
    try {
      localStorage.setItem(STORAGE_KEYS.CONTRAST, next);
    } catch {}
  }

  function setTextScale(scale: TextScale) {
    setTextScaleState(scale);
    document.documentElement.setAttribute('data-text-scale', scale);
    try {
      localStorage.setItem(STORAGE_KEYS.TEXT_SCALE, scale);
    } catch {}
  }

  function setSignPreference(pref: SignPreference) {
    setSignPreferenceState(pref);
    try {
      localStorage.setItem(STORAGE_KEYS.SIGN_PREF, pref);
    } catch {}
  }

  return (
    <AccessibilityContext.Provider
      value={{
        contrast,
        textScale,
        signPreference,
        toggleContrast,
        setTextScale,
        setSignPreference,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility harus digunakan di dalam AccessibilityProvider');
  }
  return context;
}
