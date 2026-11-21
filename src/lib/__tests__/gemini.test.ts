import { describe, it, expect } from 'vitest';
import {
  generateLearningCardsWithAI,
  translateInstructionWithAI,
} from '../gemini';

describe('gemini AI Integration & Fallback System', () => {
  it('menghasilkan kartu peraga fallback deterministik jika AI offline atau topik seputar cuci tangan', async () => {
    // Memanggil fungsi generator kartu pembelajaran
    const cards = await generateLearningCardsWithAI(
      'Langkah Mencuci Tangan',
      'Rombel D (Tunagrahita)',
      'SIBI'
    );

    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBeGreaterThanOrEqual(3);
    // Verifikasi struktur data kartu
    expect(cards[0]).toHaveProperty('word_or_step');
    expect(cards[0]).toHaveProperty('simple_explanation');
    expect(cards[0]).toHaveProperty('sign_letters');
    expect(Array.isArray(cards[0].sign_letters)).toBe(true);
  });

  it('menerjemahkan instruksi Smart TV dan mendukung 2-3 kata per aksi', async () => {
    const steps = await translateInstructionWithAI(
      'Ambil buku tulis dan pensil lalu duduk rapi di kursi',
      'SIBI'
    );

    expect(Array.isArray(steps)).toBe(true);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toHaveProperty('step_number');
    expect(steps[0]).toHaveProperty('action_label');
    expect(steps[0]).toHaveProperty('simple_explanation');
    expect(steps[0]).toHaveProperty('sign_letters');

    // Menampung kata yang memadai
    expect(steps[0].action_label.length).toBeGreaterThanOrEqual(3);
    expect(steps[0].sign_letters.length).toBeGreaterThan(0);
  });
});
