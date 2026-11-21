'use client';

import React, { useState } from 'react';
import type { LearningCard, SignPreference } from '@/types/database';
import { SignBox } from './SignBox';
import { Volume2, ArrowLeft, ArrowRight, Play, Check } from 'lucide-react';

interface LearningCardPlayerProps {
  card: LearningCard;
  currentIndex: number;
  totalCards: number;
  signPreference: SignPreference;
  onNext: () => void;
  onPrev: () => void;
  onFinish?: () => void;
}

export function LearningCardPlayer({
  card,
  currentIndex,
  totalCards,
  signPreference,
  onNext,
  onPrev,
  onFinish,
}: LearningCardPlayerProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Pola React: reset state saat id kartu berganti tanpa memicu useEffect cascading renders
  const [prevCardId, setPrevCardId] = useState(card.id);
  if (card.id !== prevCardId) {
    setPrevCardId(card.id);
    setActiveLetterIdx(null);
    setAudioError(null);
  }

  // Web Speech API untuk pelafalan suara ramah anak SLB
  function playSpeech(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioError('Perangkat ini belum mendukung fitur suara.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.85; // Sedikit lebih lambat agar jelas bagi siswa SLB

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setAudioError(null);
      };

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setAudioError('Suara gagal diputar. Coba tekan lagi.');
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudio(false);
      setAudioError('Suara gagal diputar. Coba tekan lagi.');
    }
  }

  // Animasi ejaan huruf isyarat satu per satu secara perlahan
  function spellOutSigns() {
    if (card.sign_letters.length === 0) return;

    let index = 0;
    setActiveLetterIdx(0);

    const interval = setInterval(() => {
      index++;
      if (index < card.sign_letters.length) {
        setActiveLetterIdx(index);
      } else {
        clearInterval(interval);
        setActiveLetterIdx(null);
      }
    }, 1200); // 1.2 detik per huruf agar siswa dapat mencerna
  }

  const isLast = currentIndex === totalCards - 1;

  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col rounded-2xl border-2 border-border-subtle bg-surface p-5 shadow-sm sm:p-8 2xl:p-12">
      {/* Indikator Progres Kartu */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <span className="font-mono text-base font-bold text-ink-muted sm:text-lg">
          Kartu {currentIndex + 1} dari {totalCards}
        </span>
        <button
          type="button"
          onClick={spellOutSigns}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-4 py-2 text-sm font-bold text-ink transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          <span>Eja Isyarat Otomatis</span>
        </button>
      </div>

      {/* Bagian Kata Utama & Instruksi Pendek (Stop-Slop: Maksimal 5-7 kata) */}
      <div className="mt-6 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl 2xl:text-6xl">
          {card.word_or_step}
        </h2>
        <p className="mt-2 text-lg font-medium text-ink-secondary sm:text-xl">
          {card.simple_explanation}
        </p>
      </div>

      {/* Baris Kotak Huruf Isyarat SIBI / Bisindo */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {card.sign_letters.map((letter, idx) => (
            <SignBox
              key={`${letter}-${idx}`}
              letter={letter}
              system={signPreference}
              isActive={activeLetterIdx === idx}
              onClick={() => setActiveLetterIdx(idx)}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-ink-muted">
          Ketuk huruf untuk melihat bentuk isyaratnya.
        </p>
      </div>

      {/* Pesan Error Audio Jika Ada */}
      {audioError && (
        <p
          role="alert"
          className="mt-4 rounded-xl border-2 border-red-300 bg-red-50 p-3 text-center text-sm font-semibold text-red-900"
        >
          {audioError}
        </p>
      )}

      {/* Tombol Utama: Putar Suara */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => playSpeech(card.audio_text || card.word_or_step)}
          disabled={isPlayingAudio}
          className="inline-flex min-h-14 min-w-48 items-center justify-center gap-3 rounded-xl bg-brand px-8 py-3 text-lg font-bold text-white shadow-md transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-50 motion-reduce:transition-none 2xl:min-h-16 2xl:text-2xl"
        >
          <Volume2 className="h-6 w-6" aria-hidden="true" />
          <span>{isPlayingAudio ? 'Memutar Suara...' : 'Putar Suara'}</span>
        </button>
      </div>

      {/* Bar Navigasi Bawah: Sebelumnya & Selanjutnya */}
      <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-lg font-semibold text-ink transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-40 motion-reduce:transition-none"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span>Sebelumnya</span>
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onFinish || onNext}
            className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-emerald-900 bg-emerald-700 px-6 py-3 text-lg font-bold text-white shadow-md transition-colors duration-150 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
          >
            <Check className="h-5 w-5" aria-hidden="true" />
            <span>Mulai Latihan</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-lg font-semibold text-ink transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus motion-reduce:transition-none"
          >
            <span>Selanjutnya</span>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
