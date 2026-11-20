# DESIGN.md - Sistem Desain InkluDidik

Spesifikasi sistem desain untuk aplikasi web pendidikan inklusif **InkluDidik** (SLBN Manisrejo) berbasis **Next.js (App Router) + Tailwind CSS**. Dokumen ini menjadi acuan langsung bagi pengembang dan coding agent agar antarmuka tetap tenang, mudah dipahami siswa berkebutuhan khusus, dan cepat dioperasikan guru senior.

---

## 1. Prinsip Desain & Identitas Visual

InkluDidik memakai gaya visual **tenang, hangat, dan ramah edukasi**. Setiap elemen layar harus membantu pemahaman siswa tunarungu-wicara serta tunagrahita, sekaligus memudahkan guru senior menjalankan kelas tanpa kebingungan navigasi.

### Lima Prinsip Utama

1. **Satu Fokus per Layar (Single-Task Screen):** Setiap tampilan siswa menampilkan satu tujuan belajar saja (satu kartu, satu rangkaian isyarat, atau satu soal pencocokan). Hilangkan sidebar, banner promosi, dan menu sekunder saat sesi belajar aktif.
2. **Alur Guru Maksimal 3 Klik:** Tugas utama guru (buat kartu peraga, tampilkan layar isyarat Smart TV, bagikan kode kelas 6-digit, lihat progres siswa) wajib selesai dalam maksimal 3 klik dari beranda.
3. **Visual Konkret dan Tenang:** Gunakan latar hangat off-white, garis tepi tegas `1px-2px`, ilustrasi objek nyata berlatar bersih, dan jarak ruang longgar agar mata tidak cepat lelah di Smart TV maupun HP Android.
4. **Umpan Balik Ramah Tanpa Tekanan Waktu:** Latihan siswa tidak memakai penghitung mundur (countdown timer). Jawaban keliru menampilkan ajakan mencoba lagi berwarna amber hangat, bukan merah agresif atau ikon silang besar.
5. **Aksesibilitas Bawaan:** Target sentuh minimal `48px-56px`, kontras minimal WCAG AA (`4.5:1`) dengan target AAA (`7:1`), serta fokus keyboard dan remote Smart TV yang selalu terlihat.

### Daftar Larangan (Stop-Slop Visual)

- Larang gradien neon atau ungu-biru generik (`bg-gradient-to-r from-purple-600 to-indigo-600`).
- Larang efek glassmorphism berat (`backdrop-blur-md bg-white/20`) yang menurunkan keterbacaan teks.
- Larang bayangan tebal (`shadow-xl`, `shadow-2xl`, glow berwarna). Gunakan border solid untuk memisahkan permukaan.
- Larang animasi latar otomatis (`animate-bounce`, `animate-pulse` permanen, parallax, atau partikel bergerak) yang memecah konsentrasi siswa SLB.
- Larang emoji atau ikon dekoratif berlebih (`✨`, `🚀`, `🎉`) di judul halaman dan tombol aksi.

---

## 2. Design Tokens

### 2.1 Palet Warna Semantik

Mode standar memakai latar hangat off-white (`#FAF9F5`) agar tidak menyilaukan layar Smart TV kelas. Mode Kontras Tinggi (`[data-contrast="high"]`) menaikkan seluruh rasio kontras ke standar **WCAG AAA (>= 7:1)** dengan garis tepi hitam solid `2px`.

| Token | Mode Standar (Hex) | Mode Kontras Tinggi AAA (Hex) | Fungsi & Aturan Pakai |
| --- | --- | --- | --- |
| `--bg-canvas` | `#FAF9F5` | `#FFFFFF` | Latar utama halaman agar lembut di mata |
| `--bg-surface` | `#FFFFFF` | `#FFFFFF` | Permukaan kartu peraga, modal, dan form |
| `--bg-surface-subtle` | `#F2EFE9` | `#F3F4F6` | Area sekunder, kotak ejaan isyarat, baris tabel |
| `--border-subtle` | `#D6D3CD` | `#000000` | Garis pemisah kartu (`1px` standar, `2px` AAA) |
| `--border-strong` | `#6B7280` | `#000000` | Border input, tombol sekunder, kotak aktif |
| `--border-focus` | `#1D4ED8` | `#000000` | Ring fokus keyboard dan navigasi remote TV (`4px`) |
| `--text-primary` | `#111827` | `#000000` | Judul, kata kartu peraga, teks utama (`> 16:1`) |
| `--text-secondary` | `#374151` | `#111827` | Instruksi singkat dan deskripsi pendukung (`> 10:1`) |
| `--text-muted` | `#4B5563` | `#111827` | Label metadata dan keterangan kecil (`> 7.2:1`) |
| `--text-inverse` | `#FFFFFF` | `#FFFFFF` | Teks di atas tombol primer |
| `--accent-primary` | `#1E40AF` | `#0F2D8A` | Tombol aksi utama, indikator aktif (`8.6:1` dg putih) |
| `--accent-hover` | `#1E3A8A` | `#091D5C` | State hover tombol aksi utama |
| `--accent-subtle` | `#EFF6FF` | `#E0E7FF` | Latar kartu terpilih dan sorotan lembut |
| `--status-success-bg` | `#DCFCE7` | `#D1FAE5` | Latar umpan balik jawaban benar |
| `--status-success-text` | `#14532D` | `#064E3B` | Teks dan ikon jawaban benar (`> 8.5:1`) |
| `--status-success-border` | `#15803D` | `#065F46` | Border kartu jawaban benar (`2px`) |
| `--status-retry-bg` | `#FEF3C7` | `#FDE68A` | Latar umpan balik "coba lagi" siswa (amber hangat) |
| `--status-retry-text` | `#78350F` | `#451A03` | Teks "coba lagi" tanpa kesan menghukum (`> 8.2:1`) |
| `--status-retry-border` | `#B45309` | `#78350F` | Border lembut untuk opsi yang perlu dicoba ulang |
| `--status-error-bg` | `#FEE2E2` | `#FEE2E2` | Khusus error sistem/jaringan di halaman guru |
| `--status-error-text` | `#7F1D1D` | `#7F1D1D` | Teks error teknis guru (jangan dipakai untuk latihan siswa) |

### 2.2 Tipografi Ramah Baca

Gunakan **`Lexend`** (font sans-serif dengan jarak karakter lapang untuk mendukung keterbacaan visual siswa) sebagai font utama melalui `next/font/google`, dengan **`Plus Jakarta Sans`** sebagai alternatif setara. Gunakan **`JetBrains Mono`** dengan `tabular-nums` khusus untuk kode kelas 6-digit dan angka progres.

| Peran | HP Android (`360px`) | Laptop Guru (`1366px`) | Smart TV (`1920px`) | Bobot | Line Height | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Display (Mode TV / Kata Utama) | `2rem` (`32px`) | `2.5rem` (`40px`) | `4rem` (`64px`) | `700` | `1.15` | `-0.01em` |
| H1 (Judul Halaman) | `1.5rem` (`24px`) | `1.875rem` (`30px`) | `2.75rem` (`44px`) | `700` | `1.2` | `-0.01em` |
| H2 (Judul Kartu / Bagian) | `1.25rem` (`20px`) | `1.5rem` (`24px`) | `2.25rem` (`36px`) | `600` | `1.25` | `0` |
| Label Kartu & Tombol Siswa | `1.125rem` (`18px`) | `1.25rem` (`20px`) | `1.5rem` (`24px`) | `600` | `1.3` | `0.01em` |
| Body (Isi & Instruksi) | `1rem` (`16px`) | `1.125rem` (`18px`) | `1.75rem` (`28px`) | `400` | `1.6` | `0.01em` |
| Caption / Label Huruf Isyarat | `1rem` (`16px`) | `1rem` (`16px`) | `1.25rem` (`20px`) | `600` | `1.4` | `0.02em` |
| Mono (Kode Kelas 6-Digit) | `1.5rem` (`24px`) | `1.875rem` (`30px`) | `3rem` (`48px`) | `700` | `1.2` | `0.15em` |

**Aturan Skala Teks Global (`data-text-scale` pada `<html>`):**

- `normal`: `font-size: 16px` (`100%`)
- `large`: `font-size: 18px` (`112.5%`)
- `xlarge`: `font-size: 20px` (`125%`)

Seluruh ukuran teks dan padding tombol memakai satuan `rem` agar ikut membesar secara proporsional saat guru atau siswa mengganti skala teks. Panjang baris teks instruksi dibatasi maksimal `55ch`.

### 2.3 Spasi, Grid, Radius, dan Target Sentuh

- **Grid Spasi Dasar 4px:** `4px` (`1`), `8px` (`2`), `12px` (`3`), `16px` (`4`), `24px` (`6`), `32px` (`8`), `48px` (`12`), `64px` (`16`).
- **Target Sentuh Minimum:**
  - Kontrol standar & toolbar guru: minimal `48x48px` (`min-h-12 min-w-12`).
  - Tombol utama siswa, pilihan latihan, dan kontrol Smart TV: minimal `56px` (`min-h-14`), naik ke `64px` (`min-h-16`) di mode Smart TV.
  - Jarak antar elemen klik minimal `12px` (`gap-3`) di HP dan `16px-24px` (`gap-4` hingga `gap-6`) di laptop dan Smart TV.
- **Border Radius:**
  - Input & tombol: `10px` (`rounded-xl` / `12px`) agar terasa ramah dan jelas batasnya.
  - Kartu peraga & kartu latihan: `16px` (`rounded-2xl`).
  - Kotak huruf isyarat: `12px` (`rounded-xl`).
  - Pill / toggle grup: `9999px` (`rounded-full`).
- **Elevasi:** Utamakan border `1px-2px` solid. Pakai `shadow-sm` tipis hanya pada dialog modal atau toolbar melayang.

### 2.4 Tiga Breakpoint Layar Wajib

| Target Perangkat | Resolusi Acuan | Prefix Tailwind | Container Max-Width | Padding Samping | Aturan Layout |
| --- | --- | --- | --- | --- | --- |
| HP Android Siswa | `360x800` | default (mobile-first) | `100%` | `16px` (`px-4`) | 1 kolom penuh, tombol aksi menumpuk vertikal (`w-full`) |
| Laptop Guru SLB | `1366x768` | `lg:` (`1024px+`) | `1152px` (`max-w-6xl`) | `32px` (`px-8`) | Navigasi atas datar, grid 2 kolom untuk editor & pratinjau |
| Smart TV Kelas | `1920x1080` | `2xl:` (`1536px+`) | `1680px` (`max-w-[1680px]`) | `48px` (`px-12`) | Mode layar penuh bebas chrome, 2 zona lebar, teks skala TV |

---

## 3. Spesifikasi Komponen Inti

Semua komponen interaktif wajib mendefinisikan 6 state: `default`, `hover`, `focus-visible`, `active`, `disabled`, dan `loading` (jika memanggil API/TTS).

### 3.1 Kartu Peraga Digital (Learning Card)

Digunakan di modul Generator Kartu Peraga AI dan Modul Belajar Bertahap.

- **Struktur Vertikal (HP & Laptop) / 2-Kolom (Smart TV):**
  1. **Area Gambar:** Rasio `aspect-[4/3]` pada latar putih bersih (`bg-white border border-subtle rounded-xl`), `object-contain` dengan padding dalam `16px` agar objek utuh tidak terpotong.
  2. **Teks Utama & Instruksi:** Kata inti di tengah (`text-3xl` HP, `text-4xl` laptop, `text-6xl` TV) diikuti maksimal 1 kalimat instruksi siswa (5-7 kata, misalnya `Lihat gambar, lalu tiru isyaratnya.`).
  3. **Baris Kotak Ejaan Isyarat (SIBI/Bisindo):** Deretan kotak seragam (`flex flex-wrap justify-center gap-3`). Tiap kotak berukuran minimal `72x88px` di HP dan `104x124px` di Smart TV, berisi ilustrasi tangan isyarat di atas dan huruf kapital tebal (`text-xl font-bold`) di bawah. Kotak aktif saat pemutaran ejaan mendapat border `2px` `--accent-primary` dan latar `--accent-subtle`.
  4. **Baris Aksi:** Dua tombol sejajar (`Putar Suara` sebagai tombol primer, `Kartu Berikutnya` sebagai tombol sekunder).
- **State Tombol `Putar Suara` (TTS):**
  - `default`: Latar `--accent-primary`, teks putih, tinggi `min-h-14`.
  - `hover`: Latar `--accent-hover`.
  - `focus-visible`: Ring `4px` `--border-focus` + `ring-offset-2`.
  - `active`: Sedikit mengecil tenang (`active:scale-[0.98]`).
  - `loading` / sedang memutar: Label berubah `Memutar Suara...` dengan ikon speaker statis (tanpa `animate-bounce`), tombol dinonaktifkan sementara agar tidak bertumpuk.
  - `error`: Tampilkan kotak pesan ramah di bawah tombol (`Suara belum bisa diputar. Tekan lagi.`).

### 3.2 Layar Jembatan Komunikasi (Smart TV Mode)

Dirancang khusus untuk tampilan layar penuh `1920x1080` yang terbaca dari bangku paling belakang kelas SLB.

- **Tata Letak:** Tinggi penuh layar (`min-h-screen flex flex-col justify-between p-12 bg-canvas`). Header minimal hanya memuat judul topik dan tombol `Keluar Layar Penuh`.
- **Zona Konten Utama (Grid 12 Kolom):**
  - **Kiri (7 kolom):** Layar video atau rangkaian gambar isyarat SIBI/Bisindo besar (`aspect-video rounded-2xl border-2 border-strong bg-white`).
  - **Kanan (5 kolom):** Teks kata atau kalimat dengan tipografi raksasa (`text-6xl font-bold leading-tight text-primary`), badge penanda sistem isyarat (`SIBI` atau `Bisindo`), dan terjemahan ejaan huruf di bawahnya.
- **Bar Kontrol Bawah (Tinggi minimal `88px`):**
  - **Tombol `Ulangi Isyarat`:** Tombol primer ekstra besar (`min-h-16 px-8 text-2xl font-bold`).
  - **Kontrol Slider Kecepatan Isyarat:** Empat pilihan langkah diskrit (`0.5x`, `0.75x`, `1x`, `1.25x`) yang bisa digeser lewat `<input type="range">` ber-thumb `48x48px` ATAU diklik langsung pada tombol nilai angka agar guru senior tidak kesulitan menggeser slider kecil.
  - **Tombol Navigasi:** `Sebelumnya` dan `Berikutnya` (`min-h-16 px-8 text-2xl`) dengan dukungan tombol panah kiri/kanan keyboard dan remote TV.

### 3.3 Kartu Latihan Interaktif (Tap-to-Match)

Digunakan pada tahap Praktik Mandiri dan Peer Tutor. Tidak menampilkan timer atau skor penalti.

- **Tata Letak:** Prompt kata atau video isyarat di bagian atas, diikuti grid pilihan gambar konkret (`grid-cols-2 gap-4` di HP dan laptop, `grid-cols-3 gap-6` jika maksimal 3 pilihan). Batasi maksimal 2-4 pilihan per soal untuk mencegah beban kognitif siswa tunagrahita.
- **Empat State Kartu Pilihan:**

| State | Border & Latar | Indikator Visual | Teks Umpan Balik |
| --- | --- | --- | --- |
| `default` | `border-2 border-subtle bg-surface` | Gambar jelas + label teks `18px-24px` | - |
| `dipilih` | `border-2 border-accent-primary bg-accent-subtle` | Ring tipis primer, siap dikonfirmasi | `Pilihanmu ditandai.` |
| `benar` | `border-2 border-status-success-border bg-status-success-bg` | Lencana centang solid hijau (`#14532D`) di sudut kanan atas | `Bagus! Pilihanmu tepat.` |
| `coba lagi` | `border-2 border-status-retry-border bg-status-retry-bg` | Lencana panah putar amber hangat (`#78350F`), **tanpa merah agresif** | `Belum pas. Coba pilih gambar lain.` |

- **State `disabled`:** Kartu lain yang tidak dipilih saat jawaban sudah benar menurunkan opasitas ringan (`opacity-60`) agar fokus siswa tertuju pada jawaban benar dan tombol `Soal Berikutnya`.

### 3.4 Toolbar Aksesibilitas Global

Tersedia konsisten di bagian atas aplikasi (`sticky top-0 z-30 border-b border-subtle bg-surface`) dengan struktur datar dan label teks eksplisit (bukan ikon saja).

- **Tiga Kontrol Wajib:**
  1. **Kontras Tinggi:** Tombol toggle `aria-pressed` dengan label `Kontras Tinggi` (`min-h-12 px-4`). Saat aktif, menambahkan `data-contrast="high"` pada `<html>`.
  2. **Ukuran Teks:** Grup 3 tombol radio (`role="radiogroup"`) berlabel `A` (`Normal`), `A+` (`Besar`), `A++` (`Ekstra Besar`), masing-masing `min-h-12 min-w-12`. Mengubah `data-text-scale` pada `<html>`.
  3. **Bahasa Isyarat:** Segmented toggle `SIBI` | `Bisindo` (`min-h-12 px-4`). Menyimpan preferensi di `localStorage` dan langsung menyinkronkan aset isyarat di seluruh modul.
- **Responsif HP (`360px`):** Jika ruang horizontal sempit, tombol `Pengaturan Tampilan` (`min-h-12`) membuka panel ringkas 1 klik berisi 3 kontrol tersebut agar header tetap bersih.

### 3.5 Navigasi Guru Senior (Alur <= 3 Klik)

- Beranda guru menampilkan 4 kartu modul besar berlabel jelas (`Buat Kartu Peraga`, `Layar Isyarat TV`, `Modul Belajar`, `Kode & Progres Kelas`) dalam grid 2x2 (`min-h-28`).
- Hindari dropdown bersarang, ikon titik tiga tersembunyi, atau istilah teknis bahasa Inggris (`Generate`, `Deploy`, `Sync`).
- Contoh alur 2 klik: Beranda Guru -> `Kode & Progres Kelas` -> Kode 6-digit langsung tampil besar dengan tombol `Salin Kode` dan `Tampilkan di TV`.

---

## 4. Aturan Motion & Interaksi

Gerakan antarmuka hanya berfungsi memberi kepastian bahwa sentuhan atau klik sudah diterima, tanpa menarik perhatian berlebihan.

- **Durasi:**
  - Hover, fokus, dan perubahan warna tombol: `150ms`.
  - Pergantian kartu peraga, feedback latihan, dan buka/tutup modal: `200ms`.
- **Kurva Easing:**
  - Masuk & perubahan state: `cubic-bezier(0.2, 0, 0, 1)`.
  - Keluar: `cubic-bezier(0.4, 0, 1, 1)`.
- **Properti yang Diizinkan:** Hanya `opacity`, `transform` ringan (`scale-[0.98]` saat ditekan), `background-color`, dan `border-color`. Jangan menganimasikan `width`, `height`, `margin`, atau posisi latar.
- **Preferensi Gerak Berkurang (`prefers-reduced-motion`):** Semua kelas transisi wajib dipasangkan dengan `motion-reduce:transition-none motion-reduce:transform-none`.
- **Zero Auto-Motion:** Tidak ada carousel otomatis, teks berjalan (marquee), atau indikator berkedip terus-menerus.

---

## 5. Aturan Microcopy (Stop-Slop UI Copy)

- **Instruksi Siswa:** Maksimal 5-7 kata, bahasa Indonesia konkret, kalimat aktif.
  - Benar: `Tekan gambar yang sesuai kata.` (5 kata)
  - Salah: `Silakan pilih salah satu gambar di bawah ini yang menurutmu paling tepat.`
- **Label Tombol Aksi:** Kata kerja + objek nyata (`Buat Kartu`, `Putar Suara`, `Ulangi Isyarat`, `Kartu Berikutnya`, `Salin Kode Kelas`).
- **Pesan Kosong & Error:** Sebutkan kondisi dan tindakan berikutnya dalam satu kalimat lugas (`Belum ada kartu di kelas ini. Tekan Buat Kartu untuk mulai.`).
- **Larangan Teks:** Tanpa tanda pisah panjang (em dash), tanpa kata klise pemasaran (`Revolusioner`, `Seamless`, `Pintar AI`), dan tanpa istilah teknis rumit di layar guru atau siswa.

---

## 6. Pemetaan Langsung ke Next.js + Tailwind CSS

### 6.1 Konfigurasi Font (`app/layout.tsx`)

```tsx
import { Lexend, JetBrains_Mono } from 'next/font/google';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-mono',
  display: 'swap',
});
```

Pasang `${lexend.variable} ${jetbrainsMono.variable}` pada tag `<html>`, bersama atribut `data-contrast="standard"` dan `data-text-scale="normal"`.

### 6.2 Token CSS & Mode Kontras Tinggi (`app/globals.css`)

```css
@import "tailwindcss";

:root {
  --bg-canvas: #FAF9F5;
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: #F2EFE9;
  --border-subtle: #D6D3CD;
  --border-strong: #6B7280;
  --border-focus: #1D4ED8;
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-muted: #4B5563;
  --text-inverse: #FFFFFF;
  --accent-primary: #1E40AF;
  --accent-hover: #1E3A8A;
  --accent-subtle: #EFF6FF;
  --status-success-bg: #DCFCE7;
  --status-success-text: #14532D;
  --status-success-border: #15803D;
  --status-retry-bg: #FEF3C7;
  --status-retry-text: #78350F;
  --status-retry-border: #B45309;
  --status-error-bg: #FEE2E2;
  --status-error-text: #7F1D1D;
}

[data-contrast="high"] {
  --bg-canvas: #FFFFFF;
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: #F3F4F6;
  --border-subtle: #000000;
  --border-strong: #000000;
  --border-focus: #000000;
  --text-primary: #000000;
  --text-secondary: #111827;
  --text-muted: #111827;
  --accent-primary: #0F2D8A;
  --accent-hover: #091D5C;
  --accent-subtle: #E0E7FF;
  --status-success-bg: #D1FAE5;
  --status-success-text: #064E3B;
  --status-success-border: #065F46;
  --status-retry-bg: #FDE68A;
  --status-retry-text: #451A03;
  --status-retry-border: #78350F;
}

html[data-text-scale="normal"] { font-size: 16px; }
html[data-text-scale="large"]  { font-size: 18px; }
html[data-text-scale="xlarge"] { font-size: 20px; }

@theme inline {
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-mono: var(--font-mono), monospace;
  --color-canvas: var(--bg-canvas);
  --color-surface: var(--bg-surface);
  --color-surface-subtle: var(--bg-surface-subtle);
  --color-border-subtle: var(--border-subtle);
  --color-border-strong: var(--border-strong);
  --color-focus: var(--border-focus);
  --color-ink: var(--text-primary);
  --color-ink-secondary: var(--text-secondary);
  --color-ink-muted: var(--text-muted);
  --color-brand: var(--accent-primary);
  --color-brand-hover: var(--accent-hover);
  --color-brand-subtle: var(--accent-subtle);
  --color-success-bg: var(--status-success-bg);
  --color-success-ink: var(--status-success-text);
  --color-success-border: var(--status-success-border);
  --color-retry-bg: var(--status-retry-bg);
  --color-retry-ink: var(--status-retry-text);
  --color-retry-border: var(--status-retry-border);
  --color-error-bg: var(--status-error-bg);
  --color-error-ink: var(--status-error-text);
}
```

### 6.3 Resep Kelas Utilitas Tailwind Siap Pakai

| Elemen | Kelas Utilitas Tailwind CSS |
| --- | --- |
| Latar Halaman | `min-h-screen bg-canvas text-ink font-sans antialiased` |
| Fokus Aksesibel (Wajib) | `focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus focus-visible:ring-offset-2` |
| Transisi Standar | `transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none` |
| Tombol Primer (Guru/Siswa) | `inline-flex min-h-14 min-w-14 items-center justify-center rounded-xl bg-brand px-6 py-3 text-lg font-semibold text-white hover:bg-brand-hover active:scale-[0.98] disabled:opacity-50 2xl:min-h-16 2xl:px-8 2xl:text-2xl` |
| Tombol Sekunder | `inline-flex min-h-14 min-w-14 items-center justify-center rounded-xl border-2 border-border-strong bg-surface px-6 py-3 text-lg font-semibold text-ink hover:bg-surface-subtle active:scale-[0.98] 2xl:min-h-16 2xl:text-2xl` |
| Kartu Peraga (Learning Card) | `rounded-2xl border-2 border-border-subtle bg-surface p-5 lg:p-6 2xl:p-10` |
| Kotak Huruf Isyarat | `flex min-h-22 min-w-18 flex-col items-center justify-between rounded-xl border border-border-subtle bg-surface-subtle p-2 2xl:min-h-32 2xl:min-w-26 2xl:p-3` |
| Kartu Tap-to-Match (Benar) | `rounded-2xl border-2 border-success-border bg-success-bg p-4 text-success-ink` |
| Kartu Tap-to-Match (Coba Lagi) | `rounded-2xl border-2 border-retry-border bg-retry-bg p-4 text-retry-ink` |
| Input Kode Kelas 6-Digit | `min-h-14 w-full rounded-xl border-2 border-border-strong bg-surface px-4 text-center font-mono text-2xl font-bold tracking-[0.2em] tabular-nums text-ink` |

---

## 7. Checklist Verifikasi Desain Sebelum Implementasi

- [ ] Seluruh warna memakai token CSS semantik dan mendukung `data-contrast="high"` (WCAG AAA >= 7:1).
- [ ] Ukuran teks isi minimal `16px`, tombol/kartu siswa `18px-24px`, dan responsif terhadap 3 pilihan `data-text-scale`.
- [ ] Seluruh tombol, kartu klik, dan thumb slider berukuran minimal `48px` (`min-h-12`) hingga `56px` (`min-h-14`).
- [ ] Umpan balik "coba lagi" pada Tap-to-Match memakai warna amber hangat tanpa merah agresif dan tanpa timer.
- [ ] Tata letak sudah diuji pada viewport HP (`360x800`), laptop guru (`1366x768`), dan Smart TV (`1920x1080`).
- [ ] Semua transisi berdurasi `150ms-200ms`, mematuhi `prefers-reduced-motion`, dan bebas animasi latar otomatis.
