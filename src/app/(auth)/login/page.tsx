'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { LogIn, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  function handleDemoLogin() {
    // Mode demo cepat 1-klik untuk juri lomba dan pengujian tanpa hambatan
    router.push('/guru/dashboard');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setInfoMsg(null);

    // Cukup arahkan ke dashboard guru untuk demo MVP
    setTimeout(() => {
      setLoading(false);
      router.push('/guru/dashboard');
    }, 400);
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AccessibilityToolbar backHref="/" backLabel="Ke Beranda" title="Login Guru" />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-sm sm:p-8">
          <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-brand-subtle text-brand">
            <LogIn className="h-6 w-6" aria-hidden="true" />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Masuk Ruang Guru
          </h1>
          <p className="mt-2 text-base text-ink-secondary">
            Akses modul pembelajaran dan jembatan komunikasi kelas.
          </p>

          {/* Tombol Demo Cepat 1-Klik untuk Juri & Guru */}
          <div className="mt-6 rounded-xl border border-brand bg-brand-subtle p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Akses Cepat Pengujian
            </span>
            <p className="mt-1 text-sm text-ink-secondary">
              Gunakan tombol di bawah untuk langsung masuk tanpa mendaftar akun.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-base font-bold text-white transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <UserCheck className="h-5 w-5" aria-hidden="true" />
              <span>Masuk Mode Demo Guru</span>
            </button>
          </div>

          {/* Form Login Guru Standar */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="guru-email" className="block text-sm font-semibold text-ink">
                Alamat Email Guru
              </label>
              <input
                id="guru-email"
                type="email"
                placeholder="guru@slbnmanisrejo.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 min-h-12 w-full rounded-xl border-2 border-border-strong bg-surface px-4 text-base text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
              />
            </div>

            <div>
              <label htmlFor="guru-password" className="block text-sm font-semibold text-ink">
                Kata Sandi
              </label>
              <input
                id="guru-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 min-h-12 w-full rounded-xl border-2 border-border-strong bg-surface px-4 text-base text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
              />
            </div>

            {infoMsg && (
              <p role="alert" className="text-sm font-medium text-status-retry-text">
                {infoMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-lg font-bold text-ink transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <span>{loading ? 'Memproses...' : 'Masuk'}</span>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Kembali ke Halaman Masuk Siswa
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
