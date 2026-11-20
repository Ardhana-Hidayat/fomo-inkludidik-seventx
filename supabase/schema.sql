-- Skema Basis Data InkluDidik (Supabase SQL)
-- Jalankan skrip ini pada Supabase SQL Editor

-- 1. Tabel Profil Pengguna (Guru & Siswa)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text check (role in ('guru', 'siswa')) not null,
  rombel text, -- contoh: 'Rombel D (Tunagrahita)', 'Rombel B (Tunarungu-Wicara)'
  sign_preference text default 'SIBI' check (sign_preference in ('SIBI', 'BISINDO')),
  created_at timestamptz default now()
);

-- 2. Tabel Modul Belajar (Kumpulan Kartu Peraga)
create table if not exists modules (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  rombel text not null,
  mode text default 'demonstrasi' check (mode in ('demonstrasi', 'kosakata', 'instruksi')),
  share_code text unique not null, -- Kode 6 karakter agar siswa/orang tua mudah akses di rumah
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 3. Tabel Kartu Peraga Individual
create table if not exists learning_cards (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references modules(id) on delete cascade not null,
  order_index int not null,
  word_or_step text not null,          -- Kata benda atau kalimat langkah pendek (maks 7 kata)
  simple_explanation text not null,    -- Penjelasan konkret ramah anak
  image_url text,                      -- URL gambar ilustrasi (Supabase Storage / aset lokal)
  sign_letters text[],                 -- Array huruf untuk ejaan isyarat SIBI/Bisindo (misal: ['B','A','J','U'])
  audio_text text not null             -- Teks yang dibacakan oleh Web Speech API
);

-- 4. Tabel Progres & Hasil Praktik Siswa
create table if not exists student_progress (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references profiles(id) on delete set null,
  student_name_guest text,             -- Opsi nama tanpa login rumit untuk demo/anak di kelas
  module_id uuid references modules(id) on delete cascade not null,
  score int not null,
  total_questions int not null,
  is_peer_tutor boolean default false, -- Penanda sesi pendampingan sebaya (peer tutor)
  completed_at timestamptz default now()
);

-- Pengaturan Row Level Security (RLS)
alter table profiles enable row level security;
alter table modules enable row level security;
alter table learning_cards enable row level security;
alter table student_progress enable row level security;

-- Kebijakan RLS Profiles
create policy "Profil dapat dibaca oleh pengguna terautentikasi"
  on profiles for select
  to authenticated
  using (true);

create policy "Pengguna dapat memperbarui profil sendiri"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Pengguna dapat mendaftarkan profil sendiri"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Kebijakan RLS Modules
create policy "Modul dipublikasikan dapat dibaca semua orang"
  on modules for select
  using (is_published = true or (auth.uid() is not null and auth.uid() = teacher_id));

create policy "Guru dapat membuat modul"
  on modules for insert
  to authenticated
  with check (auth.uid() = teacher_id);

create policy "Guru dapat mengedit modul milik sendiri"
  on modules for update
  to authenticated
  using (auth.uid() = teacher_id);

create policy "Guru dapat menghapus modul milik sendiri"
  on modules for delete
  to authenticated
  using (auth.uid() = teacher_id);

-- Kebijakan RLS Learning Cards
create policy "Kartu dapat dibaca jika modul dapat dibaca"
  on learning_cards for select
  using (
    exists (
      select 1 from modules
      where modules.id = learning_cards.module_id
      and (modules.is_published = true or modules.teacher_id = auth.uid())
    )
  );

create policy "Guru dapat menambah kartu pada modul sendiri"
  on learning_cards for insert
  to authenticated
  with check (
    exists (
      select 1 from modules
      where modules.id = learning_cards.module_id
      and modules.teacher_id = auth.uid()
    )
  );

create policy "Guru dapat memperbarui kartu pada modul sendiri"
  on learning_cards for update
  to authenticated
  using (
    exists (
      select 1 from modules
      where modules.id = learning_cards.module_id
      and modules.teacher_id = auth.uid()
    )
  );

create policy "Guru dapat menghapus kartu pada modul sendiri"
  on learning_cards for delete
  to authenticated
  using (
    exists (
      select 1 from modules
      where modules.id = learning_cards.module_id
      and modules.teacher_id = auth.uid()
    )
  );

-- Kebijakan RLS Student Progress
create policy "Progres siswa dapat dimasukkan oleh siapa saja (termasuk tamu)"
  on student_progress for insert
  with check (true);

create policy "Guru dapat melihat progres siswa pada modul mereka"
  on student_progress for select
  using (
    exists (
      select 1 from modules
      where modules.id = student_progress.module_id
      and (modules.teacher_id = auth.uid() or student_progress.student_id = auth.uid())
    )
    or auth.uid() is null
  );
