import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_MODULES,
  getAllModules,
  fetchModuleByShareCode,
  saveModuleAndCards,
  deleteModule,
  saveStudentProgress,
  getAllStudentProgress,
} from '../modules-store';

describe('modules-store (Manajemen Modul & Progres Inklusif)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('mengembalikan modul default ketika cache lokal masih kosong', () => {
    expect(DEFAULT_MODULES.length).toBeGreaterThanOrEqual(2);
    const modules = getAllModules();
    expect(modules.length).toBeGreaterThanOrEqual(2);
    expect(modules[0].id).toBe('mod-1');
    expect(modules[1].id).toBe('mod-2');
  });

  it('menolak pencarian kode kelas jika bukan 6 digit', async () => {
    const resShort = await fetchModuleByShareCode('123');
    expect(resShort.module).toBeNull();
    expect(resShort.error).toContain('6 digit');

    const resLong = await fetchModuleByShareCode('1234567');
    expect(resLong.module).toBeNull();
    expect(resLong.error).toContain('6 digit');
  });

  it('berhasil menemukan modul default dengan kode kelas 6-digit', async () => {
    const res = await fetchModuleByShareCode('123456');
    expect(res.error).toBeNull();
    expect(res.module).not.toBeNull();
    expect(res.module?.id).toBe('mod-1');
    expect(res.cards.length).toBeGreaterThan(0);
  });

  it('dapat membuat modul kustom baru dan menyimpannya di storage lokal', async () => {
    const res = await saveModuleAndCards(
      {
        teacher_id: 'guru-1',
        title: 'Pengenalan Angka & Berhitung',
        rombel: 'Rombel D (Tunagrahita)',
        mode: 'kosakata',
        share_code: '998877',
        is_published: true,
      },
      [
        {
          order_index: 0,
          word_or_step: 'Satu',
          simple_explanation: 'Angka 1 satu jari tegak.',
          image_url: null,
          sign_letters: ['S', 'A', 'T', 'U'],
          audio_text: 'Satu',
        },
      ]
    );

    expect(res.success).toBe(true);
    expect(res.moduleId).toBeDefined();

    const all = getAllModules();
    const created = all.find((m) => m.title === 'Pengenalan Angka & Berhitung');
    expect(created).toBeDefined();
    expect(created?.share_code).toHaveLength(6);
  });

  it('dapat menghapus modul dari storage lokal', async () => {
    const createRes = await saveModuleAndCards(
      {
        teacher_id: 'guru-1',
        title: 'Modul Untuk Dihapus',
        rombel: 'Rombel B (Tunarungu-Wicara)',
        mode: 'instruksi',
        share_code: '112233',
        is_published: true,
      },
      []
    );
    expect(createRes.success).toBe(true);
    const newId = createRes.moduleId;

    const delRes = await deleteModule(newId);
    expect(delRes.success).toBe(true);

    const all = getAllModules();
    expect(all.find((m) => m.id === newId)).toBeUndefined();
  });

  it('dapat menyimpan dan mengambil riwayat progres latihan siswa', async () => {
    await saveStudentProgress('mod-1', 4, 4, false, 'Budi Santoso');
    const records = getAllStudentProgress();

    expect(records.length).toBe(1);
    expect(records[0].student_name_guest).toBe('Budi Santoso');
    expect(records[0].score).toBe(4);
    expect(records[0].total_questions).toBe(4);
    expect(records[0].is_peer_tutor).toBe(false);
  });
});
