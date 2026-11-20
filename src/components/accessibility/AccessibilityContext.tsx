'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
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

const CHANGE_EVENT = 'inkludidik_settings_change';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

function getContrastSnapshot(): ContrastMode {
  if (typeof window === 'undefined') return 'standard';
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CONTRAST);
    return val === 'high' ? 'high' : 'standard';
  } catch {
    return 'standard';
  }
}

function getTextScaleSnapshot(): TextScale {
  if (typeof window === 'undefined') return 'normal';
  try {
    const val = localStorage.getItem(STORAGE_KEYS.TEXT_SCALE);
    if (val && ['normal', 'large', 'xlarge'].includes(val)) return val as TextScale;
  } catch {}
  return 'normal';
}

function getSignPrefSnapshot(): SignPreference {
  if (typeof window === 'undefined') return 'SIBI';
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SIGN_PREF);
    if (val === 'SIBI' || val === 'BISINDO') return val;
  } catch {}
  return 'SIBI';
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const contrast = useSyncExternalStore(
    subscribe,
    getContrastSnapshot,
    () => 'standard' as ContrastMode
  );

  const textScale = useSyncExternalStore(
    subscribe,
    getTextScaleSnapshot,
    () => 'normal' as TextScale
  );

  const signPreference = useSyncExternalStore(
    subscribe,
    getSignPrefSnapshot,
    () => 'SIBI' as SignPreference
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
    document.documentElement.setAttribute('data-text-scale', textScale);
  }, [contrast, textScale]);

  function toggleContrast() {
    const next = contrast === 'standard' ? 'high' : 'standard';
    try {
      localStorage.setItem(STORAGE_KEYS.CONTRAST, next);
      notifyChange();
    } catch {}
  }

  function setTextScale(scale: TextScale) {
    try {
      localStorage.setItem(STORAGE_KEYS.TEXT_SCALE, scale);
      notifyChange();
    } catch {}
  }

  function setSignPreference(pref: SignPreference) {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGN_PREF, pref);
      notifyChange();
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
