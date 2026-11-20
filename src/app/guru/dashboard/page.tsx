'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { getAllModules, getAllStudentProgress } from '@/lib/modules-store';
import type { LearningModule, StudentProgress } from '@/types/database';
import {
  Sparkles,
  Tv,
  BookOpen,
  Users,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function GuruDashboardPage() {
  const [modules] = useState<LearningModule[]>(getAllModules);
  const [progressList] = useState<StudentProgress[]>(getAllStudentProgress);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AccessibilityToolbar backHref="/" backLabel="Ke Beranda" title="Dashboard Guru" />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 2xl:px-8">
        {/* Banner Selamat Datang Guru Senior */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-border-subtle bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-brand">
              Ruang Guru SLBN Manisrejo
            </span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Dashboard Pembelajaran Inklusif
            </h1>
            <p className="mt-1 text-base text-ink-secondary">
              Pilih menu aksi di bawah ini. Semua tugas dapat diselesaikan dalam maksimal 3 klik.
            </p>
          </div>

          <Link
            href="/guru/buat-kartu"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-lg font-bold text-white transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
          >
            <Sparkles className="h-5 w-5" aria-hidden="true" />
            <span>Buat Kartu Baru</span>
          </Link>
        </div>

        {/* 4 KARTU MODUL UTAMA GURU (GRID 2x2 - SESUAI DESIGN.MD SECTION 3.5) */}
        <section className="mt-8">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Aksi Utama Guru
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {/* AKSI 1: BUAT KARTU PERAGA AI */}
            <Link
              href="/guru/buat-kartu"
              className="flex min-h-36 flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 transition-all duration-150 hover:border-brand hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Buat Kartu Peraga</h3>
                  <p className="text-sm text-ink-secondary">
                    Generator otomatis dari topik ajar & foto buku paket.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-sm font-bold text-brand">
                <span>Mulai Buat</span>
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </div>
            </Link>

            {/* AKSI 2: JEMBATAN KOMUNIKASI SMART TV */}
            <Link
              href="/guru/jembatan-komunikasi"
              className="flex min-h-36 flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 transition-all duration-150 hover:border-brand hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-surface-subtle text-ink">
                  <Tv className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Layar Isyarat TV</h3>
                  <p className="text-sm text-ink-secondary">
                    Terjemahkan instruksi suara guru ke isyarat visual di layar TV.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-sm font-bold text-brand">
                <span>Buka Layar TV</span>
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </div>
            </Link>

            {/* AKSI 3: DAFTAR MODUL BELAJAR */}
            <a
              href="#daftar-modul"
              className="flex min-h-36 flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 transition-all duration-150 hover:border-brand hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-surface-subtle text-ink">
                  <BookOpen className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Modul Belajar Siswa</h3>
                  <p className="text-sm text-ink-secondary">
                    {modules.length} modul aktif siap dipraktikkan di kelas.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-sm font-bold text-brand">
                <span>Lihat Modul</span>
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </div>
            </a>

            {/* AKSI 4: REKAP PROGRES SISWA */}
            <a
              href="#rekap-progres"
              className="flex min-h-36 flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 transition-all duration-150 hover:border-brand hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
            >
              <div className="flex items-center gap-4">
                <div className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-surface-subtle text-ink">
                  <TrendingUp className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Progres & Skor Latihan</h3>
                  <p className="text-sm text-ink-secondary">
                    {progressList.length} aktivitas latihan siswa tercatat.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-sm font-bold text-brand">
                <span>Lihat Progres</span>
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </div>
            </a>
          </div>
        </section>

        {/* DAFTAR MODUL AKTIF KELAS */}
        <section id="daftar-modul" className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-ink">
              Modul Kelas Aktif
            </h2>
            <Link
              href="/guru/buat-kartu"
              className="text-sm font-bold text-brand hover:underline"
            >
              + Tambah Modul Baru
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {modules.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-border-strong bg-surface-subtle px-2.5 py-1 text-xs font-bold text-ink">
                      {m.rombel}
                    </span>
                    <span className="text-xs font-semibold uppercase text-ink-muted">
                      Mode: {m.mode}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-ink">{m.title}</h3>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-border-strong bg-surface-subtle p-3">
                    <span className="text-xs font-bold uppercase text-ink-muted">
                      Kode Kelas:
                    </span>
                    <span className="font-mono text-xl font-bold tracking-widest text-brand">
                      {m.share_code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(m.share_code)}
                      className="ml-auto inline-flex min-h-10 items-center gap-1 rounded-lg border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:bg-surface-subtle"
                      aria-label={`Salin kode kelas ${m.share_code}`}
                    >
                      {copiedCode === m.share_code ? (
                        <>
                          <Check className="h-4 w-4 text-green-700" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-border-subtle pt-4">
                  <Link
                    href={`/siswa/belajar/${m.id}`}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
                  >
                    Buka Demonstrasi
                  </Link>
                  <Link
                    href={`/siswa/latihan/${m.id}`}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border-2 border-border-strong bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-surface-subtle"
                  >
                    Buka Latihan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REKAP PROGRES LATIHAN SISWA */}
        <section id="rekap-progres" className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Aktivitas Praktik Siswa Terakhir
          </h2>

          <div className="mt-4 overflow-hidden rounded-2xl border-2 border-border-subtle bg-surface">
            {progressList.length === 0 ? (
              <div className="p-8 text-center text-ink-secondary">
                <p className="text-base">Belum ada data belajar siswa hari ini.</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Bagikan kode kelas 6-digit di atas kepada siswa atau orang tua di rumah.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border-subtle bg-surface-subtle text-xs font-bold uppercase text-ink-muted">
                    <tr>
                      <th className="px-6 py-3">Nama Siswa</th>
                      <th className="px-6 py-3">Mode</th>
                      <th className="px-6 py-3">Skor Benar</th>
                      <th className="px-6 py-3">Waktu Selesai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {progressList.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-subtle">
                        <td className="px-6 py-4 font-bold text-ink">
                          {item.student_name_guest || 'Siswa Kelas'}
                        </td>
                        <td className="px-6 py-4">
                          {item.is_peer_tutor ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                              <Users className="h-3 w-3" />
                              Peer Tutor
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                              Mandiri
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-brand">
                          {item.score} / {item.total_questions}
                        </td>
                        <td className="px-6 py-4 text-xs text-ink-muted">
                          {new Date(item.completed_at).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
