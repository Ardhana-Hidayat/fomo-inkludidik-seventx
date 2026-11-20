'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { useAccessibility } from '@/components/accessibility/AccessibilityContext';
import { fetchModuleById } from '@/lib/modules-store';
import { LearningCardPlayer } from '@/components/cards/LearningCardPlayer';
import type { LearningModule, LearningCard } from '@/types/database';
import Link from 'next/link';

export function BelajarContent({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const { signPreference } = useAccessibility();

  const [moduleData, setModuleData] = useState<LearningModule | null>(null);
  const [cards, setCards] = useState<LearningCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!moduleId) return;
      setLoading(true);
      const res = await fetchModuleById(moduleId);
      setLoading(false);

      if (res.error || !res.module) {
        setErrorMsg(res.error || 'Modul belajar tidak ditemukan.');
      } else {
        setModuleData(res.module);
        setCards(res.cards);
      }
    }
    load();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas text-ink">
        <AccessibilityToolbar backHref="/" backLabel="Ke Beranda" />
        <main className="mx-auto flex flex-1 items-center justify-center p-6">
          <p className="text-xl font-bold">Memuat modul belajar...</p>
        </main>
      </div>
    );
  }

  if (errorMsg || !moduleData || cards.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas text-ink">
        <AccessibilityToolbar backHref="/" backLabel="Ke Beranda" />
        <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="rounded-2xl border-2 border-border-subtle bg-surface p-8">
            <h1 className="text-2xl font-bold">Modul Belum Tersedia</h1>
            <p className="mt-2 text-base text-ink-secondary">
              {errorMsg || 'Belum ada kartu peraga di modul ini.'}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 py-2.5 text-base font-bold text-white hover:bg-brand-hover"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentCard = cards[currentIdx];

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AccessibilityToolbar
        backHref="/"
        backLabel="Keluar"
        title={moduleData.title}
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 2xl:px-8">
        {/* Banner Penanda Tahap Belajar (Demonstrasi) */}
        <div className="mb-6 text-center">
          <span className="inline-flex rounded-full border border-border-strong bg-surface px-4 py-1 text-sm font-bold text-brand">
            Tahap 1: Demonstrasi Visual & Pelafalan
          </span>
          <h1 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
            {moduleData.title}
          </h1>
        </div>

        {/* Pemutar Kartu Peraga Adaptif */}
        <LearningCardPlayer
          card={currentCard}
          currentIndex={currentIdx}
          totalCards={cards.length}
          signPreference={signPreference}
          onNext={() => setCurrentIdx((prev) => Math.min(cards.length - 1, prev + 1))}
          onPrev={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          onFinish={() => router.push(`/siswa/latihan/${moduleId}`)}
        />
      </main>
    </div>
  );
}
