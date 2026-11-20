'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAccessibility, type TextScale } from './AccessibilityContext';
import { Eye, Hand, Settings, Home, ArrowLeft } from 'lucide-react';

interface AccessibilityToolbarProps {
  backHref?: string;
  backLabel?: string;
  title?: string;
}

export function AccessibilityToolbar({
  backHref,
  backLabel = 'Kembali',
  title,
}: AccessibilityToolbarProps) {
  const { contrast, textScale, signPreference, toggleContrast, setTextScale, setSignPreference } =
    useAccessibility();
  const [mobileOpen, setMobileOpen] = useState(false);

  const textScales: { key: TextScale; label: string; desc: string }[] = [
    { key: 'normal', label: 'A', desc: 'Ukuran huruf normal' },
    { key: 'large', label: 'A+', desc: 'Ukuran huruf besar' },
    { key: 'xlarge', label: 'A++', desc: 'Ukuran huruf sangat besar' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border-subtle bg-surface text-ink shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 2xl:px-8">
        {/* Sisi Kiri: Navigasi Cepat Guru / Judul */}
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border-strong bg-surface px-4 py-2 text-base font-semibold text-ink transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span>{backLabel}</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-xl font-bold tracking-tight text-brand transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <Home className="h-6 w-6" aria-hidden="true" />
              <span>InkluDidik</span>
            </Link>
          )}

          {title && (
            <span className="hidden text-base font-medium text-ink-muted sm:inline-block">
              / {title}
            </span>
          )}
        </div>

        {/* Tombol Tampilan Mobile */}
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-border-strong bg-surface p-2 text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
            aria-label="Buka Pengaturan Aksesibilitas"
            aria-expanded={mobileOpen}
          >
            <Settings className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Panel Kontrol Aksesibilitas Desktop */}
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          {/* 1. Toggle Kontras Tinggi */}
          <button
            type="button"
            onClick={toggleContrast}
            aria-pressed={contrast === 'high'}
            suppressHydrationWarning
            className={`inline-flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none ${
              contrast === 'high'
                ? 'border-black bg-black text-white'
                : 'border-border-strong bg-surface text-ink hover:bg-surface-subtle'
            }`}
          >
            <Eye className="h-5 w-5" aria-hidden="true" />
            <span suppressHydrationWarning>
              {contrast === 'high' ? 'Kontras: Tinggi' : 'Kontras Tinggi'}
            </span>
          </button>

          {/* 2. Pengatur Ukuran Huruf */}
          <div
            className="flex items-center rounded-xl border border-border-strong bg-surface p-0.5"
            role="radiogroup"
            aria-label="Pengaturan Ukuran Teks"
          >
            {textScales.map((scale) => {
              const active = textScale === scale.key;
              return (
                <button
                  key={scale.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={scale.desc}
                  onClick={() => setTextScale(scale.key)}
                  suppressHydrationWarning
                  className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2.5 text-base font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none ${
                    active
                      ? 'bg-brand text-white'
                      : 'text-ink hover:bg-surface-subtle'
                  }`}
                >
                  {scale.label}
                </button>
              );
            })}
          </div>

          {/* 3. Pilihan Bahasa Isyarat SIBI / Bisindo */}
          <div
            className="flex items-center rounded-xl border border-border-strong bg-surface p-0.5"
            role="radiogroup"
            aria-label="Pilihan Sistem Isyarat"
          >
            {(['SIBI', 'BISINDO'] as const).map((pref) => {
              const active = signPreference === pref;
              return (
                <button
                  key={pref}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSignPreference(pref)}
                  suppressHydrationWarning
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-bold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none ${
                    active
                      ? 'bg-brand text-white'
                      : 'text-ink hover:bg-surface-subtle'
                  }`}
                >
                  <Hand className="h-4 w-4" aria-hidden="true" />
                  <span>{pref}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel Aksesibilitas Dropdown Mobile */}
      {mobileOpen && (
        <div className="border-t border-border-subtle bg-surface p-4 sm:hidden">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={toggleContrast}
              aria-pressed={contrast === 'high'}
              suppressHydrationWarning
              className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus ${
                contrast === 'high'
                  ? 'border-black bg-black text-white'
                  : 'border-border-strong bg-surface text-ink'
              }`}
            >
              <Eye className="h-5 w-5" aria-hidden="true" />
              <span suppressHydrationWarning>
                {contrast === 'high' ? 'Matikan Kontras Tinggi' : 'Nyalakan Kontras Tinggi'}
              </span>
            </button>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink-muted">Ukuran Teks:</span>
              <div className="flex gap-2">
                {textScales.map((scale) => (
                  <button
                    key={scale.key}
                    type="button"
                    onClick={() => setTextScale(scale.key)}
                    suppressHydrationWarning
                    className={`min-h-12 min-w-12 rounded-xl border px-3 py-2 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus ${
                      textScale === scale.key
                        ? 'border-brand bg-brand text-white'
                        : 'border-border-strong bg-surface text-ink'
                    }`}
                  >
                    {scale.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink-muted">Sistem Isyarat:</span>
              <div className="flex gap-2">
                {(['SIBI', 'BISINDO'] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setSignPreference(pref)}
                    suppressHydrationWarning
                    className={`min-h-12 rounded-xl border px-4 py-2 font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus ${
                      signPreference === pref
                        ? 'border-brand bg-brand text-white'
                        : 'border-border-strong bg-surface text-ink'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
