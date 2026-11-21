'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { useAccessibility } from '@/components/accessibility/AccessibilityContext';
import { useToast } from '@/components/ui/ToastContext';
import { SignBox } from '@/components/cards/SignBox';
import type { InstructionStepData } from '@/lib/gemini';
import {
  Mic,
  Maximize2,
  Minimize2,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Send,
} from 'lucide-react';

export default function JembatanKomunikasiPage() {
  const { signPreference } = useAccessibility();
  const toast = useToast();

  // State Input Guru
  const [inputText, setInputText] = useState('Ambil buku dan pensil lalu duduk tenang.');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // State Hasil Langkah Isyarat
  const [steps, setSteps] = useState<InstructionStepData[]>([
    {
      step_number: 1,
      action_label: 'Ambil Buku',
      simple_explanation: 'Ambil buku tulis di tas.',
      sign_letters: ['B', 'U', 'K', 'U'],
    },
    {
      step_number: 2,
      action_label: 'Ambil Pensil',
      simple_explanation: 'Keluarkan pensil untuk menulis.',
      sign_letters: ['P', 'E', 'N', 'S', 'I', 'L'],
    },
    {
      step_number: 3,
      action_label: 'Duduk Tenang',
      simple_explanation: 'Duduk rapi di bangku.',
      sign_letters: ['D', 'U', 'D', 'U', 'K'],
    },
  ]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<0.5 | 0.75 | 1 | 1.25>(1);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);

  // Sinkronisasi status Fullscreen HTML5 bawaan browser
  useEffect(() => {
    function handleFullscreenChange() {
      const active = Boolean(
        document.fullscreenElement ||
        // @ts-expect-error fallback browser vendor prefix
        document.webkitFullscreenElement ||
        // @ts-expect-error fallback browser vendor prefix
        document.msFullscreenElement
      );
      setIsFullscreen(active);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Mode Layar Penuh Native Browser (memenuhi seluruh windows / monitor Smart TV)
  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ('webkitRequestFullscreen' in document.documentElement) {
          // @ts-expect-error fallback browser vendor prefix
          await document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ('webkitExitFullscreen' in document) {
          // @ts-expect-error fallback browser vendor prefix
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Gagal mengubah mode layar penuh browser:', err);
      // Fallback CSS jika izin Fullscreen browser dibatasi
      setIsFullscreen((prev) => !prev);
    }
  }

  // Speech Recognition (Web Speech API)
  function toggleSpeechRecognition() {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Browser belum mendukung pengenalan suara mikrofon.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      toast.info('Perekaman suara dihentikan.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Mendengarkan instruksi guru...');
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        setInputText(transcript);
        setIsListening(false);
        recognitionRef.current = null;
        if (transcript.trim().length > 0) {
          toast.success(`Suara terdeteksi: "${transcript}". Mengonversi ke TV...`);
          // Otomatis convert tanpa perlu guru mengklik tombol terjemahkan lagi
          executeTranslate(transcript);
        }
      };
      recognition.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
        toast.error('Gagal mengenali suara. Coba ulangi lagi.');
      };
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
    }
  }

  async function executeTranslate(textOverride?: string) {
    const text = (textOverride ?? inputText).trim();
    if (!text) {
      toast.error('Ketik atau rekam kalimat instruksi terlebih dahulu.');
      return;
    }

    setIsTranslating(true);
    toast.info('Menerjemahkan instruksi ke isyarat...');
    try {
      const res = await fetch('/api/ai/translate-instruction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: text,
          signPreference,
        }),
      });

      const json = await res.json();
      if (res.ok && json.data && json.data.length > 0) {
        setSteps(json.data);
        setCurrentStepIdx(0);
        setActiveLetterIdx(null);
        toast.success('Instruksi berhasil ditampilkan di layar TV!');
      } else {
        toast.error('Gagal menerjemahkan instruksi.');
      }
    } catch (err) {
      console.error('Gagal menerjemahkan instruksi:', err);
      toast.error('Terjadi kendala jaringan.');
    } finally {
      setIsTranslating(false);
    }
  }

  // Animasi ejaan huruf isyarat sesuai slider kecepatan
  function replaySignSpelling() {
    const currentStep = steps[currentStepIdx];
    if (!currentStep || currentStep.sign_letters.length === 0) return;

    let idx = 0;
    setActiveLetterIdx(0);

    const baseDelay = 1200; // ms
    const duration = baseDelay / speedMultiplier;

    const interval = setInterval(() => {
      idx++;
      if (idx < currentStep.sign_letters.length) {
        setActiveLetterIdx(idx);
      } else {
        clearInterval(interval);
        setActiveLetterIdx(null);
      }
    }, duration);
  }

  // Pintasan Keyboard Remote Smart TV (Panah Kiri & Kanan)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStepIdx((prev) => Math.max(0, prev - 1));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length]);

  const currentStep = steps[currentStepIdx];

  return (
    <div
      className={`flex flex-col bg-canvas text-ink ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto p-6 sm:p-10' : 'min-h-screen'
      }`}
    >
      {!isFullscreen && (
        <AccessibilityToolbar backHref="/guru/dashboard" backLabel="Dashboard" title="Layar Isyarat TV" />
      )}

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-4 py-6 sm:px-6 2xl:px-8">
        {/* Panel Kontrol Guru (Input Instruksi Lisan & Teks) */}
        <div className="rounded-2xl border-2 border-border-subtle bg-surface p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Jembatan Komunikasi Guru–Siswa (Smart TV Mode)
            </h1>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-4 py-2 text-sm font-bold text-ink hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-5 w-5" />
                  <span>Keluar Layar Penuh</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-5 w-5" />
                  <span>Mode Layar Penuh TV</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Ketik kalimat instruksi guru di sini..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-14 flex-1 rounded-xl border-2 border-border-strong bg-surface px-4 text-lg font-medium text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus"
            />

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`inline-flex min-h-14 min-w-14 items-center justify-center gap-2 rounded-xl border-2 px-4 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus ${
                isListening
                  ? 'border-red-700 bg-red-600 text-white shadow-md'
                  : 'border-border-strong bg-surface text-ink hover:bg-surface-subtle'
              }`}
              title={isListening ? 'Sedang merekam suara instruksi... Klik untuk berhenti' : 'Gunakan Mikrofon Suara'}
              aria-label={isListening ? 'Sedang merekam suara guru. Klik untuk berhenti merekam' : 'Gunakan Mikrofon Suara'}
            >
              {isListening ? (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                  </span>
                  <Mic className="h-6 w-6 animate-pulse text-white" />
                  <span className="text-sm font-bold text-white">Merekam...</span>
                </div>
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>

            <button
              type="button"
              onClick={() => executeTranslate()}
              disabled={isTranslating}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
              <span>{isTranslating ? 'Menerjemahkan...' : 'Tampilkan di TV'}</span>
            </button>
          </div>
        </div>

        {/* AREA TAMPILAN SMART TV (GRID 12-KOLOM SESUAI DESIGN.MD SECTION 3.2) */}
        {currentStep && (
          <section className="mt-8 flex-1 rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-sm sm:p-10 2xl:p-14">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <span className="font-mono text-lg font-bold text-ink-muted 2xl:text-2xl">
                Langkah {currentStepIdx + 1} dari {steps.length}
              </span>
              <span className="rounded-lg border-2 border-border-strong bg-surface-subtle px-3 py-1 text-sm font-bold uppercase text-ink">
                Sistem Isyarat: {signPreference}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* SISI KIRI: DERETAN HURUF ISYARAT RAKSASA (7 KOLOM) - ADAPTIF UNTUK 2-3 KATA */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 2xl:gap-5">
                  {currentStep.sign_letters.map((ltr, lIdx) => (
                    <SignBox
                      key={`${ltr}-${lIdx}`}
                      letter={ltr}
                      system={signPreference}
                      isActive={activeLetterIdx === lIdx}
                      size={currentStep.sign_letters.length > 6 ? 'normal' : 'large'}
                      onClick={() => setActiveLetterIdx(lIdx)}
                    />
                  ))}
                </div>
              </div>

              {/* SISI KANAN: TEKS RAKSASA TERBACA JARAK JAUH SMART TV (5 KOLOM) */}
              <div className="text-center lg:col-span-5 lg:text-left">
                <span className="text-sm font-extrabold uppercase tracking-widest text-brand 2xl:text-lg">
                  Instruksi Siswa
                </span>
                <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl 2xl:text-7xl">
                  {currentStep.action_label}
                </h2>
                <p className="mt-4 text-xl text-ink-secondary sm:text-2xl 2xl:text-3xl">
                  {currentStep.simple_explanation}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* BAR KONTROL BAWAH (TINGGI >= 88PX) */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-border-subtle bg-surface p-4 sm:p-6">
          {/* Tombol Ulangi Isyarat */}
          <button
            type="button"
            onClick={replaySignSpelling}
            className="inline-flex min-h-16 items-center gap-3 rounded-xl bg-brand px-8 py-3 text-xl font-bold text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus 2xl:text-2xl"
          >
            <RotateCcw className="h-6 w-6" aria-hidden="true" />
            <span>Ulangi Isyarat</span>
          </button>

          {/* Pilihan Kecepatan Langkah Diskrit */}
          <div className="flex items-center gap-2 rounded-xl border-2 border-border-strong bg-surface p-1">
            <span className="px-3 text-sm font-bold text-ink-muted">Kecepatan:</span>
            {([0.5, 0.75, 1, 1.25] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeedMultiplier(spd)}
                className={`min-h-12 min-w-14 rounded-lg px-3 py-1 text-base font-bold transition-colors ${
                  speedMultiplier === spd
                    ? 'bg-brand text-white'
                    : 'text-ink hover:bg-surface-subtle'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Navigasi Langkah: Sebelumnya & Berikutnya */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIdx === 0}
              className="inline-flex min-h-16 items-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-xl font-bold text-ink transition-colors hover:bg-surface-subtle disabled:opacity-40"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Sebelumnya</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStepIdx === steps.length - 1}
              className="inline-flex min-h-16 items-center gap-2 rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-xl font-bold text-ink transition-colors hover:bg-surface-subtle disabled:opacity-40"
            >
              <span>Berikutnya</span>
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
