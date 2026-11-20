'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { fetchModuleByShareCode } from '@/lib/modules-store';
import { LogIn, KeyRound, ArrowRight, UserCheck, Sparkles, BookOpen } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [classCode, setClassCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoinClass(e: React.FormEvent) {
    e.preventDefault();
    const clean = classCode.trim();

    if (clean.length !== 6) {
      setErrorMsg('Kode kelas harus 6 digit angka.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const result = await fetchModuleByShareCode(clean);
    setIsLoading(false);

    if (result.error || !result.module) {
      setErrorMsg(result.error || 'Kode kelas tidak ditemukan.');
      return;
    }

    // Arahkan langsung ke halaman belajar siswa
    router.push(`/siswa/belajar/${result.module.id}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AccessibilityToolbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:py-16">
        {/* Header Bersih & Bebas Distraksi */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-1.5 text-sm font-semibold text-brand">
            <span>SLBN Manisrejo Kota Madiun</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            InkluDidik
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-secondary sm:text-xl">
            Aplikasi belajar adaptif untuk siswa berkebutuhan khusus dan guru kelas.
          </p>
        </div>

        {/* Dua Pintu Utama: Siswa (Kode 6-Digit) & Guru */}
        <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {/* PINTU 1: SISWA (MASUK DENGAN KODE KELAS 6-DIGIT) */}
          <section className="flex flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-sm sm:p-8">
            <div>
              <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                <KeyRound className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink">
                Masuk Kelas Siswa
              </h2>
              <p className="mt-2 text-base text-ink-secondary">
                Masukkan 6 angka kode kelas dari guru untuk mulai belajar.
              </p>

              <form onSubmit={handleJoinClass} className="mt-6 flex flex-col gap-4">
                <div>
                  <label htmlFor="class-code" className="sr-only">
                    Kode Kelas 6 Angka
                  </label>
                  <input
                    id="class-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Contoh: 123456"
                    value={classCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setClassCode(val);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="min-h-14 w-full rounded-xl border-2 border-border-strong bg-surface px-4 text-center font-mono text-2xl font-bold tracking-[0.25em] tabular-nums text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                    aria-describedby={errorMsg ? 'code-error' : undefined}
                  />
                </div>

                {errorMsg && (
                  <p
                    id="code-error"
                    role="alert"
                    className="rounded-xl border border-status-error-bg bg-status-error-bg p-3 text-sm font-semibold text-status-error-text"
                  >
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || classCode.length !== 6}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-lg font-bold text-white transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-40 motion-reduce:transition-none"
                >
                  <span>{isLoading ? 'Membuka...' : 'Masuk Kelas'}</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </div>

            <div className="mt-6 border-t border-border-subtle pt-4 text-center">
              <span className="text-sm font-medium text-ink-muted">
                Kode percobaan: <code className="font-mono font-bold text-ink">123456</code> atau <code className="font-mono font-bold text-ink">654321</code>
              </span>
            </div>
          </section>

          {/* PINTU 2: GURU (LOGIN & KELOLA KELAS) */}
          <section className="flex flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-sm sm:p-8">
            <div>
              <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-surface-subtle text-ink">
                <LogIn className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-ink">
                Ruang Guru SLB
              </h2>
              <p className="mt-2 text-base text-ink-secondary">
                Buat kartu peraga otomatis dengan AI, jembatan komunikasi Smart TV, dan pantau progres latihan siswa.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/guru/dashboard"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-lg font-bold text-ink transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
                >
                  <UserCheck className="h-5 w-5" aria-hidden="true" />
                  <span>Buka Dashboard Guru (Demo)</span>
                </Link>

                <Link
                  href="/guru/buat-kartu"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-lg font-bold text-white transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  <span>Buat Kartu Peraga AI</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t border-border-subtle pt-4 text-center">
              <span className="text-sm font-medium text-ink-muted">
                Alur maksimal 3 klik, ramah untuk guru senior.
              </span>
            </div>
          </section>
        </div>

        {/* Akses Pintas Modul Contoh */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/siswa/belajar/mod-1"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-ink-secondary transition-colors duration-150 hover:bg-surface-subtle"
          >
            <BookOpen className="h-4 w-4 text-brand" aria-hidden="true" />
            <span>Contoh: Alat Tulis & Benda Kelas</span>
          </Link>
          <Link
            href="/siswa/belajar/mod-2"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-ink-secondary transition-colors duration-150 hover:bg-surface-subtle"
          >
            <BookOpen className="h-4 w-4 text-brand" aria-hidden="true" />
            <span>Contoh: Langkah Cuci Tangan</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
