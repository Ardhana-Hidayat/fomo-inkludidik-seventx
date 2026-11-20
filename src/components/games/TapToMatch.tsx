'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, RotateCcw, ArrowRight, Users } from 'lucide-react';
import { SignBox } from '../cards/SignBox';
import type { SignPreference } from '@/types/database';

export interface QuizQuestion {
  id: string;
  targetWord: string;
  targetExplanation: string;
  targetSignLetter: string;
  choices: {
    id: string;
    label: string;
    letter: string;
    isCorrect: boolean;
  }[];
}

interface TapToMatchProps {
  questions: QuizQuestion[];
  signPreference: SignPreference;
  onComplete: (score: number, total: number, isPeerTutor: boolean) => void;
}

export function TapToMatch({
  questions,
  signPreference,
  onComplete,
}: TapToMatchProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isPeerTutor, setIsPeerTutor] = useState(false);

  const currentQuestion = questions[currentIdx];

  function handleSelect(choiceId: string, correct: boolean) {
    if (isAnswered && isCorrect) return; // Kunci jika sudah benar

    setSelectedChoiceId(choiceId);
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      // Umpan balik positif lembut tanpa distraksi
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          disableForReducedMotion: true,
        });
      } catch {}
    }
  }

  function handleRetry() {
    setSelectedChoiceId(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }

  function handleNext() {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedChoiceId(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Selesai latihan
      onComplete(score, questions.length, isPeerTutor);
    }
  }

  if (!currentQuestion) {
    return (
      <div className="rounded-2xl border-2 border-border-subtle bg-surface p-8 text-center text-ink">
        <p className="text-xl font-bold">Latihan selesai!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col rounded-2xl border-2 border-border-subtle bg-surface p-6 sm:p-8 2xl:p-12">
      {/* Header Latihan & Mode Peer Tutor */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <span className="font-mono text-base font-bold text-ink-muted sm:text-lg">
          Soal {currentIdx + 1} dari {questions.length}
        </span>

        {/* Sakelar Peer Tutor */}
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border-strong bg-surface px-3 py-1.5 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={isPeerTutor}
            onChange={(e) => setIsPeerTutor(e.target.checked)}
            className="h-5 w-5 rounded border-border-strong text-brand focus:ring-focus"
          />
          <Users className="h-4 w-4 text-brand" aria-hidden="true" />
          <span>Belajar Bersama Teman</span>
        </label>
      </div>

      {/* Target Soal: Satu Fokus per Layar (Single Task Screen) */}
      <div className="mt-6 text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-ink-muted">
          Pilih Isyarat yang Sesuai
        </span>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl 2xl:text-5xl">
          {currentQuestion.targetWord}
        </h2>
        <p className="mt-2 text-lg text-ink-secondary">
          {currentQuestion.targetExplanation}
        </p>
      </div>

      {/* Grid Pilihan Gambar Isyarat (Maksimal 2-4 pilihan) */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {currentQuestion.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          let stateStyle =
            'border-2 border-border-subtle bg-surface hover:border-border-strong';

          if (isSelected) {
            if (isCorrect) {
              stateStyle =
                'border-2 border-status-success-border bg-status-success-bg text-status-success-text ring-2 ring-status-success-border';
            } else {
              stateStyle =
                'border-2 border-status-retry-border bg-status-retry-bg text-status-retry-text';
            }
          }

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => handleSelect(choice.id, choice.isCorrect)}
              disabled={isAnswered && isCorrect}
              className={`flex min-h-36 flex-col items-center justify-center gap-3 rounded-2xl p-4 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none ${stateStyle}`}
            >
              <SignBox
                letter={choice.letter}
                system={signPreference}
                size="large"
              />
              <span className="text-base font-bold sm:text-lg">
                {choice.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Banner Umpan Balik Ramah (Amber untuk coba lagi, Hijau untuk benar) */}
      {isAnswered && (
        <div className="mt-8">
          {isCorrect ? (
            <div
              role="alert"
              className="flex items-center justify-between rounded-xl border-2 border-status-success-border bg-status-success-bg p-4 text-status-success-text"
            >
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                <span className="text-lg font-bold">Bagus! Pilihanmu tepat.</span>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-status-success-border px-5 py-2 text-base font-bold text-white transition-colors duration-150 hover:bg-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div
              role="alert"
              className="flex items-center justify-between rounded-xl border-2 border-status-retry-border bg-status-retry-bg p-4 text-status-retry-text"
            >
              <div className="flex items-center gap-3">
                <RotateCcw className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                <span className="text-lg font-bold">
                  Belum pas. Coba pilih gambar lain.
                </span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-status-retry-border bg-surface px-5 py-2 text-base font-bold text-status-retry-text transition-colors duration-150 hover:bg-status-retry-bg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
              >
                <span>Coba Lagi</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
