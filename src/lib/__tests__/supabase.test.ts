import { describe, it, expect } from 'vitest';
import { createClient as createBrowserClient } from '../supabase/client';
import { createServerSupabaseClient } from '../supabase/server';

describe('Supabase Client Initializer', () => {
  it('berhasil menginisialisasi browser client ketika variabel lingkungan tersedia', () => {
    const client = createBrowserClient();
    expect(client).toBeDefined();
  });

  it('menyediakan server client async function', () => {
    expect(typeof createServerSupabaseClient).toBe('function');
  });
});
