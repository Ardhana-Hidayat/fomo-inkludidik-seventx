# InkluDidik — Web Pendidikan Inklusif Adaptif

Aplikasi web pendidikan inklusif untuk siswa berkebutuhan khusus (tunarungu-wicara dan tunagrahita) serta guru di **SLBN Manisrejo Kota Madiun**, dikembangkan oleh **Tim Fomo** untuk kompetisi nasional **SEVENT X (Kategori Website)**.

---

## 🌟 Fitur & Empat Modul Utama

1. **Modul 1: Generator Kartu Peraga Digital AI (`/guru/buat-kartu`)**
   - Guru senior cukup mengetik topik (atau unggah foto buku paket), sistem menghasilkan kartu peraga digital terstruktur dalam hitungan detik.
   - Dilengkapi pemetaan ejaan isyarat tangan **SIBI** dan **Bisindo** secara deterministik.
   - Pratinjau langsung dan penerbitan ke kelas dengan 1 klik.

2. **Modul 2: Jembatan Komunikasi Cepat Guru–Siswa (`/guru/jembatan-komunikasi`)**
   - Mode layar penuh (*Smart TV Mode*) dengan tipografi raksasa dan kontras tinggi.
   - Input teks atau mikrofon lisan (*Web Speech API*) bahasa Indonesia (`id-ID`).
   - Pemecah instruksi lisan menjadi urutan aksi visual konkret dengan slider pengatur kecepatan isyarat (`0.5x`, `0.75x`, `1x`, `1.25x`) dan dukungan navigasi remote TV / keyboard.

3. **Modul 3: Modul Belajar Bertahap (`/siswa/belajar/[modulId]` & `/siswa/latihan/[modulId]`)**
   - **Tahap Demonstrasi**: 1 kartu per layar (*single task screen*), pelafalan suara Text-to-Speech bahasa Indonesia (`window.speechSynthesis`), ejaan huruf isyarat interaktif, navigasi tombol besar.
   - **Tahap Praktik Mandiri & Peer Tutor**: Kuis visual *Tap-to-Match* tanpa penalti waktu stres. Umpan balik positif dengan warna amber hangat untuk mencoba lagi (tanpa merah agresif).

4. **Modul 4: Aksesibilitas Global & Kode Kelas 6-Digit (`/`)**
   - Akses siswa langsung via kode 6-digit tanpa login rumit.
   - Toolbar Aksesibilitas Global: Mode Kontras Tinggi (*WCAG AAA* `>= 7:1`), pengatur ukuran font (`Normal`, `Besar`, `Ekstra Besar`), dan sakelar sistem isyarat (`SIBI` / `Bisindo`).
   - Dashboard progres belajar siswa dan rekap skor latihan untuk evaluasi guru.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Framework**: Next.js 16 (App Router + Turbopack + Cache Components)
- **Bahasa**: TypeScript (100% strict type check, bebas `any`)
- **Styling**: Tailwind CSS v4 dengan Design Tokens Semantik
- **AI**: Google Gemini API (`gemini-2.5-flash` via `@google/genai`) dengan *Structured JSON Output*
- **Basis Data & Auth**: Supabase (`@supabase/ssr` & `@supabase/supabase-js`)
- **Desain & Aksesibilitas**: Prinsip ramah anak SLB (aturan ketat `STOP-SLOP.md` & `DESIGN.md`)

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Lingkungan (`.env.local`)
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu isi kredensial Supabase dan Google Gemini API:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```
*(Catatan: Aplikasi memiliki fallback offline/cache cerdas sehingga tetap dapat diuji secara penuh meskipun kredensial API belum diisi).*

### 3. Setup Basis Data (Supabase)
Jalankan skrip SQL di file `supabase/schema.sql` pada menu **SQL Editor** di dashboard Supabase Anda.

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada tautan [http://localhost:3000](http://localhost:3000).

### 5. Membangun untuk Produksi
```bash
npm run build
npm run start
```

---

## ♿ Standar Aksesibilitas & Kepatuhan Stop-Slop

Proyek ini menerapkan standar mutu tinggi sesuai dokumen `STOP-SLOP.md` dan `DESIGN.md`:
- **Target Sentuh**: Minimal `48x48px` hingga `64x64px` untuk kemudahan motorik anak dan remote Smart TV.
- **Rasio Kontras**: Minimal WCAG AA (`4.5:1`) dan mendukung WCAG AAA (`>= 7:1`) pada mode Kontras Tinggi.
- **Ketenangan Visual**: Bebas gradien neon agresif, bebas animasi distraksi (`animate-bounce`), dan tanpa timer hitung mundur yang memicu kecemasan siswa.
- **Microcopy Ramah**: Kalimat instruksi pendek (maksimal 5–7 kata), bahasa Indonesia lugas dan aktif.
- **Efisiensi Alur**: Seluruh aksi utama guru dapat diselesaikan dalam maksimal 3 klik dari beranda.
