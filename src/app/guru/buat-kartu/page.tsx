'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { useAccessibility } from '@/components/accessibility/AccessibilityContext';
import { saveModuleAndCards } from '@/lib/modules-store';
import { SignBox } from '@/components/cards/SignBox';
import type { GeneratedCardData } from '@/lib/gemini';
import {
  Sparkles,
  Camera,
  Save,
  CheckCircle,
  Plus,
  Trash2,
} from 'lucide-react';

export default function BuatKartuPage() {
  const router = useRouter();
  const { signPreference } = useAccessibility();

  // State Form Input
  const [topic, setTopic] = useState('');
  const [rombel, setRombel] = useState('Rombel B (Tunarungu-Wicara)');
  const [systemSign, setSystemSign] = useState<'SIBI' | 'BISINDO'>(signPreference);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State Kartu Hasil AI
  const [cards, setCards] = useState<GeneratedCardData[]>([]);
  const [savedShareCode, setSavedShareCode] = useState<string | null>(null);

  // Opsi cepat topik kurikulum SLB
  const quickTopics = [
    'Alat Tulis Kelas',
    'Langkah Cuci Tangan',
    'Anggota Tubuh',
    'Rambu Keselamatan',
  ];

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Masukkan topik pembelajaran terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          rombel,
          signPreference: systemSign,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal membuat kartu.');
      }

      setCards(json.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleUpdateCard(idx: number, field: keyof GeneratedCardData, val: unknown) {
    setCards((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], [field]: val };
      return clone;
    });
  }

  function handleDeleteCard(idx: number) {
    setCards((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddCard() {
    setCards((prev) => [
      ...prev,
      {
        word_or_step: 'Kata Baru',
        simple_explanation: 'Penjelasan konkret ramah anak.',
        image_keyword: 'item',
        sign_letters: ['B', 'A', 'R', 'U'],
      },
    ]);
  }

  async function handleSaveModule() {
    if (cards.length === 0) return;

    setIsSaving(true);
    setErrorMsg(null);

    // Buat kode 6-digit acak yang mudah diingat anak
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await saveModuleAndCards(
      {
        teacher_id: 'guru-1',
        title: topic.trim() || 'Modul Kartu Peraga',
        rombel,
        mode: 'kosakata',
        share_code: randomCode,
        is_published: true,
      },
      cards.map((c, i) => ({
        order_index: i,
        word_or_step: c.word_or_step,
        simple_explanation: c.simple_explanation,
        image_url: null,
        sign_letters: c.sign_letters,
        audio_text: c.word_or_step,
      }))
    );

    setIsSaving(false);

    if (result.success) {
      setSavedShareCode(randomCode);
    } else {
      setErrorMsg(result.error || 'Gagal menyimpan modul.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AccessibilityToolbar backHref="/guru/dashboard" backLabel="Dashboard" title="Buat Kartu Peraga" />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 2xl:px-8">
        {/* Judul Halaman Sesuai Stop-Slop (Polos & Jelas) */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Buat Kartu Peraga
          </h1>
          <p className="mt-2 text-base text-ink-secondary">
            Ketik topik pembelajaran atau pilih materi SLB di bawah untuk menghasilkan kartu digital dalam hitungan detik.
          </p>
        </div>

        {/* Modal Sukses Penyimpanan */}
        {savedShareCode && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border-2 border-status-success-border bg-status-success-bg p-6 text-status-success-text"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 flex-shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold">Modul Berhasil Diterbitkan!</h2>
                <p className="mt-1 text-sm text-ink-secondary">
                  Siswa dapat langsung membuka modul ini di HP atau Smart TV kelas dengan kode:
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-status-success-border bg-white p-4">
              <span className="text-xs font-bold uppercase text-ink-muted">Kode Kelas 6-Digit:</span>
              <span className="font-mono text-3xl font-extrabold tracking-widest text-brand">
                {savedShareCode}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push('/guru/dashboard')}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-status-success-border px-6 py-2.5 text-base font-bold text-white transition-colors hover:bg-green-800"
              >
                <span>Kembali ke Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSavedShareCode(null);
                  setCards([]);
                  setTopic('');
                }}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-border-strong bg-white px-6 py-2.5 text-base font-bold text-ink transition-colors hover:bg-slate-100"
              >
                <span>Buat Modul Lain</span>
              </button>
            </div>
          </div>
        )}

        {/* FORM 3 LANGKAH RAMAH GURU SENIOR */}
        {!savedShareCode && (
          <form onSubmit={handleGenerate} className="mt-8 rounded-2xl border-2 border-border-subtle bg-surface p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Langkah 1: Input Topik */}
              <div className="md:col-span-2">
                <label htmlFor="topic-input" className="block text-base font-bold text-ink">
                  1. Masukkan Topik Pembelajaran
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="topic-input"
                    type="text"
                    placeholder="Contoh: Benda di Ruang Kelas, Langkah Mencuci Tangan"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="min-h-14 flex-1 rounded-xl border-2 border-border-strong bg-surface px-4 text-lg text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                  />
                  <button
                    type="button"
                    onClick={() => setTopic('Langkah Mencuci Tangan Bersih')}
                    className="inline-flex min-h-14 min-w-14 items-center justify-center rounded-xl border-2 border-border-strong bg-surface p-3 text-ink-muted hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                    title="Simulasi Unggah Foto Halaman Buku"
                    aria-label="Simulasi Unggah Foto Halaman Buku"
                  >
                    <Camera className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Tombol Pilihan Topik Cepat */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-ink-muted">Contoh Cepat:</span>
                  {quickTopics.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(item)}
                      className="rounded-lg border border-border-subtle bg-surface-subtle px-3 py-1 text-xs font-semibold text-ink hover:border-border-strong"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Langkah 2: Pilih Target Rombel */}
              <div>
                <label htmlFor="rombel-select" className="block text-base font-bold text-ink">
                  2. Pilih Target Siswa (Rombel)
                </label>
                <select
                  id="rombel-select"
                  value={rombel}
                  onChange={(e) => setRombel(e.target.value)}
                  className="mt-2 min-h-14 w-full rounded-xl border-2 border-border-strong bg-surface px-4 text-base font-medium text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
                >
                  <option value="Rombel B (Tunarungu-Wicara)">Rombel B (Tunarungu-Wicara)</option>
                  <option value="Rombel D (Tunagrahita)">Rombel D (Tunagrahita)</option>
                  <option value="Rombel B & D (Gabungan Inklusif)">Rombel B & D (Gabungan Inklusif)</option>
                </select>
              </div>

              {/* Langkah 3: Pilih Sistem Isyarat */}
              <div>
                <label className="block text-base font-bold text-ink">
                  3. Pilihan Sistem Isyarat
                </label>
                <div className="mt-2 flex gap-3">
                  {(['SIBI', 'BISINDO'] as const).map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => setSystemSign(sys)}
                      className={`min-h-14 flex-1 rounded-xl border-2 text-base font-bold transition-colors ${
                        systemSign === sys
                          ? 'border-brand bg-brand text-white'
                          : 'border-border-strong bg-surface text-ink hover:bg-surface-subtle'
                      }`}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errorMsg && (
              <p role="alert" className="mt-4 rounded-xl border border-status-error-bg bg-status-error-bg p-3 text-sm font-semibold text-status-error-text">
                {errorMsg}
              </p>
            )}

            {/* Tombol Aksi: Buat Kartu (Ukuran Besar >= 56px) */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-brand px-8 py-3 text-lg font-bold text-white transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-50 motion-reduce:transition-none"
              >
                <Sparkles className="h-6 w-6" aria-hidden="true" />
                <span>{isGenerating ? 'Membuat Kartu...' : 'Buat Kartu'}</span>
              </button>
            </div>
          </form>
        )}

        {/* PRATINJAU & EDITOR KARTU HASIL AI */}
        {cards.length > 0 && !savedShareCode && (
          <section className="mt-12">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Pratinjau Kartu Peraga ({cards.length} Kartu)
                </h2>
                <p className="mt-1 text-sm text-ink-secondary">
                  Periksa atau edit teks sebelum diterbitkan ke kelas siswa.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-surface-subtle"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Kartu</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveModule}
                  disabled={isSaving}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-status-success-border px-6 py-2 text-base font-bold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan & Dapatkan Kode'}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-6">
              {cards.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <span className="font-mono text-sm font-bold text-brand">
                      Kartu #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(idx)}
                      className="rounded-lg p-1.5 text-ink-muted hover:bg-status-error-bg hover:text-status-error-text"
                      title="Hapus Kartu"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted">
                        Kata Utama
                      </label>
                      <input
                        type="text"
                        value={c.word_or_step}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateCard(idx, 'word_or_step', val);
                          const letters = val.toUpperCase().replace(/[^A-Z]/g, '').split('');
                          handleUpdateCard(idx, 'sign_letters', letters);
                        }}
                        className="mt-1 min-h-12 w-full rounded-xl border-2 border-border-strong bg-surface px-3 text-lg font-bold text-ink"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-ink-muted">
                        Penjelasan Ramah Siswa (Maksimal 7 Kata)
                      </label>
                      <input
                        type="text"
                        value={c.simple_explanation}
                        onChange={(e) => handleUpdateCard(idx, 'simple_explanation', e.target.value)}
                        className="mt-1 min-h-12 w-full rounded-xl border-2 border-border-strong bg-surface px-3 text-base text-ink"
                      />
                    </div>
                  </div>

                  {/* Tampilan Huruf Isyarat Kartu */}
                  <div className="mt-4 border-t border-border-subtle pt-4">
                    <span className="text-xs font-bold uppercase text-ink-muted">
                      Ejaan Isyarat Tangan ({systemSign}):
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.sign_letters.map((lettr, lIdx) => (
                        <SignBox
                          key={`${lettr}-${lIdx}`}
                          letter={lettr}
                          system={systemSign}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSaveModule}
                disabled={isSaving}
                className="inline-flex min-h-14 items-center gap-2 rounded-xl bg-status-success-border px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                <span>{isSaving ? 'Menyimpan Modul...' : 'Simpan & Publikasikan ke Kelas'}</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
