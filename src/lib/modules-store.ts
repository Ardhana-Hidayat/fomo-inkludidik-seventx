import type { LearningModule, LearningCard, StudentProgress } from '@/types/database';
import { createClient } from './supabase/client';

// Modul terverifikasi awal untuk kelas SLBN Manisrejo
const DEFAULT_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    teacher_id: 'guru-1',
    title: 'Alat Tulis & Benda Kelas',
    rombel: 'Rombel B (Tunarungu-Wicara)',
    mode: 'kosakata',
    share_code: '123456',
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mod-2',
    teacher_id: 'guru-1',
    title: 'Langkah Mencuci Tangan Bersih',
    rombel: 'Rombel D (Tunagrahita)',
    mode: 'demonstrasi',
    share_code: '654321',
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_CARDS: Record<string, LearningCard[]> = {
  'mod-1': [
    {
      id: 'card-1-1',
      module_id: 'mod-1',
      order_index: 0,
      word_or_step: 'Buku',
      simple_explanation: 'Buku untuk membaca dan menulis.',
      image_url: null,
      sign_letters: ['B', 'U', 'K', 'U'],
      audio_text: 'Buku',
    },
    {
      id: 'card-1-2',
      module_id: 'mod-1',
      order_index: 1,
      word_or_step: 'Pensil',
      simple_explanation: 'Pensil untuk menulis di kertas.',
      image_url: null,
      sign_letters: ['P', 'E', 'N', 'S', 'I', 'L'],
      audio_text: 'Pensil',
    },
    {
      id: 'card-1-3',
      module_id: 'mod-1',
      order_index: 2,
      word_or_step: 'Meja',
      simple_explanation: 'Meja tempat menaruh buku belajar.',
      image_url: null,
      sign_letters: ['M', 'E', 'J', 'A'],
      audio_text: 'Meja',
    },
    {
      id: 'card-1-4',
      module_id: 'mod-1',
      order_index: 3,
      word_or_step: 'Kursi',
      simple_explanation: 'Kursi untuk duduk rapi.',
      image_url: null,
      sign_letters: ['K', 'U', 'R', 'S', 'I'],
      audio_text: 'Kursi',
    },
  ],
  'mod-2': [
    {
      id: 'card-2-1',
      module_id: 'mod-2',
      order_index: 0,
      word_or_step: 'Basahi Tangan',
      simple_explanation: 'Buka kran air dan basahi tangan.',
      image_url: null,
      sign_letters: ['A', 'I', 'R'],
      audio_text: 'Basahi Tangan',
    },
    {
      id: 'card-2-2',
      module_id: 'mod-2',
      order_index: 1,
      word_or_step: 'Beri Sabun',
      simple_explanation: 'Tuang sabun di telapak tangan.',
      image_url: null,
      sign_letters: ['S', 'A', 'B', 'U', 'N'],
      audio_text: 'Beri Sabun',
    },
    {
      id: 'card-2-3',
      module_id: 'mod-2',
      order_index: 2,
      word_or_step: 'Gosok Jari',
      simple_explanation: 'Gosok telapak dan sela-sela jari.',
      image_url: null,
      sign_letters: ['J', 'A', 'R', 'I'],
      audio_text: 'Gosok Jari',
    },
    {
      id: 'card-2-4',
      module_id: 'mod-2',
      order_index: 3,
      word_or_step: 'Bilas Air',
      simple_explanation: 'Bilas busa sabun sampai bersih.',
      image_url: null,
      sign_letters: ['B', 'I', 'L', 'A', 'S'],
      audio_text: 'Bilas Air',
    },
  ],
};

const STORAGE_KEYS = {
  MODULES: 'inkludidik_modules_cache',
  CARDS: 'inkludidik_cards_cache',
  PROGRESS: 'inkludidik_progress_cache',
};

function getLocalModules(): LearningModule[] {
  if (typeof window === 'undefined') return DEFAULT_MODULES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODULES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_MODULES;
}

function getLocalCards(moduleId: string): LearningCard[] {
  if (typeof window === 'undefined') return DEFAULT_CARDS[moduleId] || [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (raw) {
      const allCards: Record<string, LearningCard[]> = JSON.parse(raw);
      if (allCards[moduleId]) return allCards[moduleId];
    }
  } catch {}
  return DEFAULT_CARDS[moduleId] || [];
}

export async function fetchModuleByShareCode(code: string): Promise<{
  module: LearningModule | null;
  cards: LearningCard[];
  error: string | null;
}> {
  const cleanCode = code.trim();
  if (cleanCode.length !== 6) {
    return { module: null, cards: [], error: 'Kode kelas harus 6 digit angka.' };
  }

  const supabase = createClient();
  if (supabase) {
    try {
      const { data: moduleData, error: modError } = await supabase
        .from('modules')
        .select('*')
        .eq('share_code', cleanCode)
        .maybeSingle();

      if (modError) {
        console.error('Error fetch Supabase module:', modError);
      } else if (moduleData) {
        const parsedModule = moduleData as LearningModule;
        const { data: cardsData } = await supabase
          .from('learning_cards')
          .select('*')
          .eq('module_id', parsedModule.id)
          .order('order_index', { ascending: true });

        return {
          module: parsedModule,
          cards: (cardsData as LearningCard[]) || [],
          error: null,
        };
      }
    } catch (e) {
      console.error('Koneksi Supabase gagal, beralih ke cache lokal:', e);
    }
  }

  // Fallback lokal
  const modules = getLocalModules();
  const found = modules.find((m) => m.share_code === cleanCode);
  if (!found) {
    return { module: null, cards: [], error: 'Kode kelas tidak ditemukan. Periksa lagi kode dari guru.' };
  }

  const cards = getLocalCards(found.id);
  return { module: found, cards, error: null };
}

export async function fetchModuleById(id: string): Promise<{
  module: LearningModule | null;
  cards: LearningCard[];
  error: string | null;
}> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data: moduleData, error: modError } = await supabase
        .from('modules')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (modError) {
        console.error('Error fetch Supabase module by id:', modError);
      } else if (moduleData) {
        const parsedModule = moduleData as LearningModule;
        const { data: cardsData } = await supabase
          .from('learning_cards')
          .select('*')
          .eq('module_id', parsedModule.id)
          .order('order_index', { ascending: true });

        return {
          module: parsedModule,
          cards: (cardsData as LearningCard[]) || [],
          error: null,
        };
      }
    } catch (e) {
      console.error('Koneksi Supabase gagal, beralih ke cache lokal:', e);
    }
  }

  const modules = getLocalModules();
  const found = modules.find((m) => m.id === id);
  if (!found) {
    return { module: null, cards: [], error: 'Modul tidak ditemukan.' };
  }
  const cards = getLocalCards(found.id);
  return { module: found, cards, error: null };
}

export async function saveModuleAndCards(
  moduleData: Omit<LearningModule, 'id' | 'created_at'>,
  cardsData: Omit<LearningCard, 'id' | 'module_id'>[]
): Promise<{ success: boolean; moduleId: string; error: string | null }> {
  const newModuleId = `mod-${Date.now()}`;
  const fullModule: LearningModule = {
    ...moduleData,
    id: newModuleId,
    created_at: new Date().toISOString(),
  };

  const fullCards: LearningCard[] = cardsData.map((c, i) => ({
    ...c,
    id: `card-${newModuleId}-${i}`,
    module_id: newModuleId,
    order_index: i,
  }));

  const supabase = createClient();
  if (supabase) {
    try {
      const { data: insertedMod, error: modErr } = await supabase
        .from('modules')
        .insert(moduleData)
        .select('id')
        .single();

      if (modErr) throw modErr;

      if (insertedMod) {
        const typedInserted = insertedMod as { id: string };
        const cardsToInsert = cardsData.map((c, idx) => ({
          ...c,
          module_id: typedInserted.id,
          order_index: idx,
        }));
        await supabase.from('learning_cards').insert(cardsToInsert);
        return { success: true, moduleId: typedInserted.id, error: null };
      }
    } catch (e) {
      console.error('Gagal simpan ke Supabase, simpan ke cache lokal:', e);
    }
  }

  // Simpan ke localStorage
  if (typeof window !== 'undefined') {
    try {
      const existingModules = getLocalModules();
      const updatedModules = [fullModule, ...existingModules];
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(updatedModules));

      const rawCards = localStorage.getItem(STORAGE_KEYS.CARDS);
      const allCards: Record<string, LearningCard[]> = rawCards ? JSON.parse(rawCards) : DEFAULT_CARDS;
      allCards[newModuleId] = fullCards;
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(allCards));
    } catch (err) {
      console.error('Gagal menyimpan kartu lokal:', err);
    }
  }

  return { success: true, moduleId: newModuleId, error: null };
}

export async function saveStudentProgress(
  moduleId: string,
  score: number,
  totalQuestions: number,
  isPeerTutor: boolean,
  studentName?: string
): Promise<void> {
  const progressRecord: StudentProgress = {
    id: `prog-${Date.now()}`,
    student_id: null,
    student_name_guest: studentName || 'Siswa Kelas',
    module_id: moduleId,
    score,
    total_questions: totalQuestions,
    is_peer_tutor: isPeerTutor,
    completed_at: new Date().toISOString(),
  };

  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('student_progress').insert({
        module_id: moduleId,
        score,
        total_questions: totalQuestions,
        is_peer_tutor: isPeerTutor,
        student_name_guest: studentName || 'Siswa Kelas',
      });
      return;
    } catch (e) {
      console.error('Error simpan progres ke Supabase:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const list: StudentProgress[] = raw ? JSON.parse(raw) : [];
      list.push(progressRecord);
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(list));
    } catch {}
  }
}

export function getAllModules(): LearningModule[] {
  return getLocalModules();
}

export function getAllStudentProgress(): StudentProgress[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
