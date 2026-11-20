import { NextResponse } from 'next/server';
import { z } from 'zod';
import { translateInstructionWithAI } from '@/lib/gemini';

const RequestSchema = z.object({
  instruction: z.string().min(2, 'Instruksi lisan harus diisi minimal 2 karakter.'),
  signPreference: z.enum(['SIBI', 'BISINDO']).default('SIBI'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Input instruksi tidak valid.' },
        { status: 400 }
      );
    }

    const { instruction, signPreference } = parsed.data;

    const steps = await translateInstructionWithAI(instruction, signPreference);

    return NextResponse.json({
      success: true,
      data: steps,
    });
  } catch (error) {
    console.error('API Error /api/ai/translate-instruction:', error);
    return NextResponse.json(
      { error: 'Gagal menerjemahkan instruksi. Coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
