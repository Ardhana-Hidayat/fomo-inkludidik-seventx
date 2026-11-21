'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { useToast } from '@/components/ui/ToastContext';
import { DEFAULT_MODULES, getAllModules, getAllStudentProgress, deleteModule } from '@/lib/modules-store';
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
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function GuruDashboardPage() {
  const toast = useToast();
  // Gunakan DEFAULT_MODULES dan [] untuk render awal SSR & client yang 100% identik (bebas hydration mismatch)
  const [modules, setModules] = useState<LearningModule[]>(DEFAULT_MODULES);
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<LearningModule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Sinkronkan data aktual dari LocalStorage setelah komponen terhidrasi di client (non-blocking)
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        setModules(getAllModules());
        setProgressList(getAllStudentProgress());
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Kode kelas ${code} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  async function handleConfirmDelete() {
    if (!moduleToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteModule(moduleToDelete.id);
      if (res.success) {
        setModules((prev) => prev.filter((m) => m.id !== moduleToDelete.id));
        setProgressList((prev) => prev.filter((p) => p.module_id !== moduleToDelete.id));
        toast.success(`Modul "${moduleToDelete.title}" berhasil dihapus.`);
      } else {
        toast.error(res.error || 'Gagal menghapus modul.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat menghapus modul.');
    } finally {
      setIsDeleting(false);
      setModuleToDelete(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AccessibilityToolbar backHref="/" backLabel="Ke Beranda" title="Dashboard Guru" />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 2xl:px-8">
        {/* Banner Selamat Datang Guru Senior */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
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
                  <p className="text-sm text-ink-secondary" suppressHydrationWarning>
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
                  <p className="text-sm text-ink-secondary" suppressHydrationWarning>
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

          {modules.length === 0 ? (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-border-subtle bg-surface p-8 text-center">
              <p className="text-base font-semibold text-ink">Belum ada modul kelas aktif.</p>
              <p className="mt-1 text-sm text-ink-secondary">
                Buat modul baru menggunakan generator AI atau buat kartu instruksi secara mandiri.
              </p>
              <Link
                href="/guru/buat-kartu"
                className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Buat Modul Sekarang</span>
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-sm transition-all hover:border-border-strong"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-border-strong bg-surface-subtle px-2.5 py-1 text-xs font-bold text-ink">
                          {m.rombel}
                        </span>
                        <span className="text-xs font-semibold uppercase text-ink-muted">
                          Mode: {m.mode}
                        </span>
                      </div>

                      {/* Tombol Hapus Modul dengan Icon Trash */}
                      <button
                        type="button"
                        onClick={() => setModuleToDelete(m)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 border-transparent text-ink-muted transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                        title={`Hapus modul ${m.title}`}
                        aria-label={`Hapus modul ${m.title}`}
                      >
                        <Trash2 className="h-5 w-5 text-red-600" aria-hidden="true" />
                      </button>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-ink">{m.title}</h3>

                    <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-border-strong bg-surface-subtle p-3">
                      <span className="text-xs font-bold uppercase text-ink-muted">
                        Kode Kelas:
                      </span>
                      <span className="font-mono text-xl font-bold tracking-widest text-brand">
                        {m.share_code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(m.share_code)}
                        className="ml-auto inline-flex min-h-10 items-center gap-1 rounded-lg border-2 border-border-strong bg-surface px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-surface-subtle"
                        aria-label={`Salin kode kelas ${m.share_code}`}
                      >
                        {copiedCode === m.share_code ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-700" />
                            <span className="text-emerald-800">Tersalin</span>
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
          )}
        </section>

        {/* REKAP PROGRES LATIHAN SISWA */}
        <section id="rekap-progres" className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-ink">
            Aktivitas Praktik Siswa Terakhir
          </h2>

          <div className="mt-4 overflow-hidden rounded-2xl border-2 border-border-subtle bg-surface">
            {progressList.length === 0 ? (
              <div className="p-8 text-center text-ink-secondary">
                <p className="text-base font-semibold">Belum ada data belajar siswa hari ini.</p>
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
                        <td className="px-6 py-4 text-xs text-ink-muted" suppressHydrationWarning>
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

        {/* MODAL DIALOG KONFIRMASI HAPUS MODUL (ACCESSIBLE & SAFE) */}
        {moduleToDelete && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-delete-title"
            aria-describedby="modal-delete-desc"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          >
            <div className="relative w-full max-w-md rounded-2xl border-2 border-border-strong bg-surface p-6 shadow-2xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="modal-delete-title" className="text-xl font-bold text-ink">
                    Hapus Modul Kelas?
                  </h3>
                  <p className="text-xs font-semibold text-red-600">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>

              <p id="modal-delete-desc" className="mt-4 text-sm leading-relaxed text-ink-secondary">
                Apakah Bapak/Ibu yakin ingin menghapus modul{' '}
                <strong className="font-bold text-ink">“{moduleToDelete.title}”</strong> (Kode Kelas:{' '}
                <span className="font-mono font-bold text-brand">{moduleToDelete.share_code}</span>)? Seluruh kartu peraga dan progres latihan siswa di modul ini akan dibersihkan.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModuleToDelete(null)}
                  disabled={isDeleting}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-border-strong bg-surface px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-red-900 bg-red-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Modul'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
