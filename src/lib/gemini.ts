import { GoogleGenAI, Type } from '@google/genai';

export interface GeneratedCardData {
  word_or_step: string;
  simple_explanation: string;
  image_keyword: string;
  sign_letters: string[];
}

export interface InstructionStepData {
  step_number: number;
  action_label: string;
  simple_explanation: string;
  sign_letters: string[];
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Generate 4-6 kartu peraga terstruktur untuk materi SLB
 */
export async function generateLearningCardsWithAI(
  topic: string,
  rombel: string,
  signPreference: 'SIBI' | 'BISINDO'
): Promise<GeneratedCardData[]> {
  const ai = getGeminiClient();

  if (!ai) {
    // Fallback kurikulum SLB terstandar jika API Key belum diisi
    return getFallbackCards(topic);
  }

  const prompt = `Anda adalah ahli kurikulum pendidikan khusus SLB (Sekolah Luar Biasa) di Indonesia.
Topik pembelajaran: "${topic}".
Target siswa: ${rombel} (tunarungu-wicara dan/atau tunagrahita).
Preferensi bahasa isyarat: ${signPreference}.

Aturan ketat:
1. Buat maksimal 4 sampai 5 kartu belajar konkret.
2. 'word_or_step': Kata benda atau tindakan nyata (1-4 kata saja).
3. 'simple_explanation': Kalimat penjelasan sederhana maksimal 5-7 kata ramah anak SLB.
4. 'image_keyword': Kata kunci bahasa Inggris 1 kata untuk ilustrasi konkret (misal: "pencil", "book", "apple").
5. 'sign_letters': Pisahkan kata utama menjadi array huruf kapital A-Z untuk dieja dengan isyarat ${signPreference} (hanya huruf, tanpa spasi/simbol).
Kembalikan data dalam format JSON yang valid.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word_or_step: { type: Type.STRING },
              simple_explanation: { type: Type.STRING },
              image_keyword: { type: Type.STRING },
              sign_letters: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['word_or_step', 'simple_explanation', 'image_keyword', 'sign_letters'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      return getFallbackCards(topic);
    }

    const parsed = JSON.parse(text) as GeneratedCardData[];
    return parsed.map((card) => ({
      word_or_step: card.word_or_step.trim(),
      simple_explanation: card.simple_explanation.trim(),
      image_keyword: card.image_keyword.toLowerCase().trim(),
      sign_letters: card.sign_letters.map((l) => l.toUpperCase().trim()),
    }));
  } catch (error) {
    console.error('Error saat memanggil Gemini API:', error);
    return getFallbackCards(topic);
  }
}

/**
 * Memecah kalimat instruksi lisan/panjang guru menjadi urutan aksi konkret (Quick Visual Translator)
 */
export async function translateInstructionWithAI(
  rawInstruction: string,
  signPreference: 'SIBI' | 'BISINDO'
): Promise<InstructionStepData[]> {
  const ai = getGeminiClient();

  if (!ai) {
    return getFallbackInstructions(rawInstruction);
  }

  const prompt = `Anda adalah penerjemah instruksi kelas SLB (Sekolah Luar Biasa) untuk siswa tunarungu dan tunagrahita.
Kalimat guru: "${rawInstruction}".
Preferensi isyarat: ${signPreference}.

Tugas:
Pecah kalimat instruksi tersebut menjadi urutan aksi konkret yang jelas untuk ditampilkan di layar Smart TV kelas (minimal 1 hingga 4 langkah aksi).
Setiap langkah:
- 'step_number': Angka urutan (1, 2, 3...)
- 'action_label': Kalimat tindakan aktif yang menampung minimal 2 hingga 4 kata agar konteks instruksi dipahami siswa secara utuh (contoh: "Ambil Buku Tulis", "Cuci Tangan Bersih", "Duduk Rapi di Kursi", "Buka Halaman Lima").
- 'simple_explanation': Instruksi konkret ramah anak berkebutuhan khusus (maksimal 7 kata).
- 'sign_letters': Array huruf kapital untuk ejaan isyarat jari. Tampung 2 atau 3 kata penting dalam tindakan tersebut agar mencakup lebih banyak kata untuk dipelajari anak (misalnya untuk aksi "Ambil Buku", sertakan huruf ['A','M','B','I','L','B','U','K','U'] atau minimal 2 kata kunci utama, tanpa tanda baca atau spasi, hanya huruf A-Z kapital, maksimal 12 huruf).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step_number: { type: Type.INTEGER },
              action_label: { type: Type.STRING },
              simple_explanation: { type: Type.STRING },
              sign_letters: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['step_number', 'action_label', 'simple_explanation', 'sign_letters'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      return getFallbackInstructions(rawInstruction);
    }

    const parsed = JSON.parse(text) as InstructionStepData[];
    return parsed;
  } catch (error) {
    console.error('Error saat menerjemahkan instruksi:', error);
    return getFallbackInstructions(rawInstruction);
  }
}

// Fallback deterministik berbasis topik jika API Key belum tersedia
function getFallbackCards(topic: string): GeneratedCardData[] {
  const clean = topic.toLowerCase().trim();

  if (clean.includes('cuci') || clean.includes('tangan')) {
    return [
      {
        word_or_step: 'Basahi Tangan',
        simple_explanation: 'Basahi kedua tangan dengan air mengalir.',
        image_keyword: 'water',
        sign_letters: ['A', 'I', 'R'],
      },
      {
        word_or_step: 'Beri Sabun',
        simple_explanation: 'Tuang sabun secukupnya ke telapak tangan.',
        image_keyword: 'soap',
        sign_letters: ['S', 'A', 'B', 'U', 'N'],
      },
      {
        word_or_step: 'Gosok Telapak',
        simple_explanation: 'Gosok telapak dan sela-sela jari.',
        image_keyword: 'hands',
        sign_letters: ['J', 'A', 'R', 'I'],
      },
      {
        word_or_step: 'Bilas Bersih',
        simple_explanation: 'Bilas busa sabun hingga bersih.',
        image_keyword: 'clean',
        sign_letters: ['A', 'I', 'R'],
      },
      {
        word_or_step: 'Keringkan Tangan',
        simple_explanation: 'Lap tangan dengan kain kering bersih.',
        image_keyword: 'towel',
        sign_letters: ['L', 'A', 'P'],
      },
    ];
  }

  // Standar: Benda Kelas / Alat Tulis
  return [
    {
      word_or_step: 'Buku',
      simple_explanation: 'Buku dipakai untuk membaca dan menulis.',
      image_keyword: 'book',
      sign_letters: ['B', 'U', 'K', 'U'],
    },
    {
      word_or_step: 'Pensil',
      simple_explanation: 'Pensil untuk menulis di atas kertas.',
      image_keyword: 'pencil',
      sign_letters: ['P', 'E', 'N', 'S', 'I', 'L'],
    },
    {
      word_or_step: 'Meja',
      simple_explanation: 'Meja tempat meletakkan alat tulis.',
      image_keyword: 'table',
      sign_letters: ['M', 'E', 'J', 'A'],
    },
    {
      word_or_step: 'Kursi',
      simple_explanation: 'Kursi dipakai untuk duduk belajar.',
      image_keyword: 'chair',
      sign_letters: ['K', 'U', 'R', 'S', 'I'],
    },
  ];
}

function getFallbackInstructions(rawInstruction: string): InstructionStepData[] {
  const parts = rawInstruction
    .split(/(?:lalu|kemudian|dan|terus|,)/i)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return [
      {
        step_number: 1,
        action_label: 'Duduk Tenang Rapi',
        simple_explanation: 'Duduk rapi di bangku kelas.',
        sign_letters: ['D', 'U', 'D', 'U', 'K'],
      },
    ];
  }

  return parts.slice(0, 4).map((part, index) => {
    // Ambil 2 hingga 3 kata pertama agar menampung lebih banyak kata secara bermakna
    const words = part.split(/\s+/).filter(Boolean).slice(0, 3);
    const cleanLetters = words
      .join('')
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('')
      .slice(0, 12);

    const fallbackLetters = cleanLetters.length > 0 ? cleanLetters : ['S', 'I', 'A', 'P'];
    const actionLabel = words.join(' ') || part;

    return {
      step_number: index + 1,
      action_label: actionLabel.length > 30 ? actionLabel.slice(0, 30) : actionLabel,
      simple_explanation: `${part}.`,
      sign_letters: fallbackLetters,
    };
  });
}
