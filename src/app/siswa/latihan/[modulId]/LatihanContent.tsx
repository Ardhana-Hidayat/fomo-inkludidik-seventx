'use client';

import React, { useState, useEffect } from 'react';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { useAccessibility } from '@/components/accessibility/AccessibilityContext';
import { fetchModuleById, saveStudentProgress } from '@/lib/modules-store';
import { TapToMatch, type QuizQuestion } from '@/components/games/TapToMatch';
import type { LearningModule } from '@/types/database';
import Link from 'next/link';
import { Award, RotateCcw, ArrowRight } from 'lucide-react';

export function LatihanContent({ moduleId }: { moduleId: string }) {
  const { signPreference } = useAccessibility();

  const [moduleData, setModuleData] = useState<LearningModule | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    async function load() {
      if (!moduleId) return;
      setLoading(true);
      const res = await fetchModuleById(moduleId);
      setLoading(false);

      if (res.module && res.cards.length > 0) {
        setModuleData(res.module);

        // Buat bank soal dari kartu belajar yang ada
        const quizList: QuizQuestion[] = res.cards.map((card, idx, arr) => {
          const mainLetter = card.sign_letters[0] || 'A';

          // Buat pilihan salah dari kartu lain
          const otherCards = arr.filter((_, i) => i !== idx);
          const wrongLetter1 = otherCards[0]?.sign_letters[0] || (mainLetter === 'B' ? 'A' : 'B');
          const wrongLetter2 = otherCards[1]?.sign_letters[0] || (mainLetter === 'C' ? 'D' : 'C');

          const choices = [
            {
              id: `c-corr-${idx}`,
              label: card.word_or_step,
              letter: mainLetter,
              isCorrect: true,
            },
            {
              id: `c-w1-${idx}`,
              label: otherCards[0]?.word_or_step || 'Opsi Lain',
              letter: wrongLetter1,
              isCorrect: false,
            },
            {
              id: `c-w2-${idx}`,
              label: otherCards[1]?.word_or_step || 'Benda Lain',
              letter: wrongLetter2,
              isCorrect: false,
            },
          ].sort(() => Math.random() - 0.5);

          return {
            id: `q-${card.id}`,
            targetWord: card.word_or_step,
            targetExplanation: card.simple_explanation,
            targetSignLetter: mainLetter,
            choices,
          };
        });

        setQuestions(quizList);
      }
    }
    load();
  }, [moduleId]);

  async function handleComplete(score: number, total: number, isPeerTutor: boolean) {
    setFinalScore(score);
    setTotalQuestions(total);
    setIsCompleted(true);

    if (moduleId) {
      await saveStudentProgress(moduleId, score, total, isPeerTutor);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas text-ink">
        <AccessibilityToolbar backHref="/" backLabel="Ke Beranda" />
        <main className="mx-auto flex flex-1 items-center justify-center p-6">
          <p className="text-xl font-bold">Menyiapkan latihan...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AccessibilityToolbar
        backHref={`/siswa/belajar/${moduleId}`}
        backLabel="Ulangi Materi"
        title={moduleData?.title}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 2xl:px-8">
        {!isCompleted ? (
          <div>
            <div className="mb-6 text-center">
              <span className="inline-flex rounded-full border border-border-strong bg-surface px-4 py-1 text-sm font-bold text-brand">
                Tahap 2: Praktik Mandiri & Peer Tutor
              </span>
              <h1 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
                Latihan Menjodohkan Isyarat
              </h1>
            </div>

            {questions.length > 0 ? (
              <TapToMatch
                questions={questions}
                signPreference={signPreference}
                onComplete={handleComplete}
              />
            ) : (
              <div className="rounded-2xl border-2 border-border-subtle bg-surface p-8 text-center">
                <p className="text-lg font-semibold">Belum ada soal latihan untuk modul ini.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-md rounded-2xl border-2 border-border-subtle bg-surface p-8 text-center shadow-sm">
            <div className="mx-auto inline-flex min-h-20 min-w-20 items-center justify-center rounded-2xl bg-status-success-bg text-status-success-text">
              <Award className="h-10 w-10" aria-hidden="true" />
            </div>

            <h1 className="mt-4 text-3xl font-extrabold text-ink">
              Latihan Selesai!
            </h1>
            <p className="mt-2 text-base text-ink-secondary">
              Kerja bagus! Kamu sudah menyelesaikan semua kartu latihan hari ini.
            </p>

            <div className="mt-6 rounded-xl border-2 border-border-strong bg-surface-subtle p-4">
              <span className="text-xs font-bold uppercase text-ink-muted">Skor Latihanmu:</span>
              <p className="font-mono text-4xl font-extrabold text-brand">
                {finalScore} <span className="text-2xl text-ink-muted">/ {totalQuestions}</span>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCompleted(false);
                }}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-lg font-bold text-ink hover:bg-surface-subtle"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Ulangi Latihan</span>
              </button>

              <Link
                href="/"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-lg font-bold text-white hover:bg-brand-hover"
              >
                <span>Selesai & Ke Beranda</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
