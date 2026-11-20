'use client';

import React from 'react';
import type { SignPreference } from '@/types/database';

interface SignIllustrationProps {
  letter: string;
  system: SignPreference;
  className?: string;
  isActive?: boolean;
}

export function SignIllustration({
  letter,
  system,
  className = 'h-14 w-14',
  isActive = false,
}: SignIllustrationProps) {
  const upper = letter.toUpperCase();

  // Warna kulit ramah kontras tinggi (sesuai WCAG & Stop-Slop)
  const skinFill = isActive ? '#DBEAFE' : '#FEF3C7'; // Blue subtle / Warm skin tone
  const skinStroke = isActive ? '#1E40AF' : '#1F2937'; // Brand blue / Slate-800
  const detailStroke = isActive ? '#1D4ED8' : '#4B5563'; // Garis lipatan jari

  // Render path SVG spesifik untuk tiap huruf SIBI (Manual Alphabet)
  // Setiap gestur memiliki anatomi jari yang jelas: telapak, ruas jari, dan lipatan kuku
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Latar Belakang Kartu Isyarat Bersih */}
      <circle cx="50" cy="50" r="46" fill="white" stroke={isActive ? '#2563EB' : '#E5E7EB'} strokeWidth="2" />

      {system === 'SIBI' ? (
        <SibiGesture letter={upper} fill={skinFill} stroke={skinStroke} detail={detailStroke} />
      ) : (
        <BisindoGesture letter={upper} fill={skinFill} stroke={skinStroke} detail={detailStroke} />
      )}
    </svg>
  );
}

// ----------------------------------------------------------------------
// SIBI (Sistem Isyarat Bahasa Indonesia) - 1 Tangan (A-Z)
// ----------------------------------------------------------------------
function SibiGesture({
  letter,
  fill,
  stroke,
  detail,
}: {
  letter: string;
  fill: string;
  stroke: string;
  detail: string;
}) {
  switch (letter) {
    case 'A':
      // Kepalan tangan tegak, ibu jari tegak di sisi luar telunjuk
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telapak tangan mengepal */}
          <rect x="36" y="38" width="34" height="38" rx="8" fill={fill} stroke={stroke} />
          {/* Lipatan 4 jari horizontal */}
          <line x1="38" y1="46" x2="68" y2="46" stroke={detail} strokeWidth="2" />
          <line x1="38" y1="55" x2="68" y2="55" stroke={detail} strokeWidth="2" />
          <line x1="38" y1="64" x2="68" y2="64" stroke={detail} strokeWidth="2" />
          {/* Ibu jari tegak menempel di sisi kiri */}
          <path d="M38 68V34C38 30 31 30 31 35V68" fill={fill} stroke={stroke} />
          {/* Pergelangan tangan */}
          <path d="M42 76V88H64V76" fill={fill} stroke={stroke} />
        </g>
      );

    case 'B':
      // 4 jari tegak lurus rapat ke atas, ibu jari melintang di telapak
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* 4 jari tegak rapat */}
          <rect x="34" y="16" width="36" height="46" rx="6" fill={fill} stroke={stroke} />
          {/* Garis pemisah 4 jari */}
          <line x1="43" y1="16" x2="43" y2="52" stroke={detail} strokeWidth="1.8" />
          <line x1="52" y1="16" x2="52" y2="52" stroke={detail} strokeWidth="1.8" />
          <line x1="61" y1="16" x2="61" y2="52" stroke={detail} strokeWidth="1.8" />
          {/* Telapak bawah & Ibu jari melipat di depan telapak */}
          <path d="M34 52C34 52 38 66 52 66C62 66 68 56 68 52V76H34V52Z" fill={fill} stroke={stroke} />
          <path d="M32 58C36 50 56 50 58 58" fill={fill} stroke={stroke} />
          {/* Pergelangan tangan */}
          <path d="M40 76V88H62V76" fill={fill} stroke={stroke} />
        </g>
      );

    case 'C':
      // Tangan melengkung seperti huruf C (tampak samping)
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <path
            d="M66 30C58 20 38 24 34 38C30 50 30 60 36 70C42 78 62 80 68 70C68 64 56 68 48 64C42 60 40 46 48 40C56 34 66 36 66 30Z"
            fill={fill}
            stroke={stroke}
          />
          {/* Ruas ibu jari bawah & jari atas */}
          <line x1="54" y1="28" x2="62" y2="35" stroke={detail} strokeWidth="2" />
          <line x1="54" y1="72" x2="62" y2="65" stroke={detail} strokeWidth="2" />
          {/* Pergelangan tangan */}
          <path d="M32 64L24 74H36" stroke={stroke} />
        </g>
      );

    case 'D':
      // Telunjuk tegak lurus ke atas, ibu jari menyentuh 3 jari lain membentuk lingkaran
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Jari telunjuk tegak tinggi */}
          <path d="M42 62V18C42 14 49 14 49 18V62" fill={fill} stroke={stroke} />
          {/* Lingkaran 3 jari dan ibu jari di depan */}
          <ellipse cx="58" cy="54" rx="14" ry="14" fill={fill} stroke={stroke} />
          <circle cx="58" cy="54" r="5" fill="white" stroke={stroke} strokeWidth="2" />
          {/* Pergelangan tangan */}
          <path d="M40 74V88H58V74" fill={fill} stroke={stroke} />
        </g>
      );

    case 'E':
      // Semua jari menekuk rapat ke bawah, menyentuh ibu jari di bawahnya
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <rect x="34" y="32" width="36" height="42" rx="7" fill={fill} stroke={stroke} />
          {/* Garis tekukan ujung jari */}
          <path d="M34 32C34 26 68 26 68 32V42H34V32Z" fill={fill} stroke={stroke} />
          <line x1="43" y1="32" x2="43" y2="42" stroke={detail} strokeWidth="1.8" />
          <line x1="52" y1="32" x2="52" y2="42" stroke={detail} strokeWidth="1.8" />
          <line x1="61" y1="32" x2="61" y2="42" stroke={detail} strokeWidth="1.8" />
          {/* Ibu jari mendatar di bawah kuku */}
          <path d="M32 46H68" stroke={stroke} strokeWidth="2.5" />
          {/* Pergelangan */}
          <path d="M40 74V88H62V74" fill={fill} stroke={stroke} />
        </g>
      );

    case 'F':
      // Ujung telunjuk dan ibu jari bertemu membentuk lingkaran, 3 jari lain tegak
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* 3 jari belakang tegak terbuka */}
          <path d="M50 48V16C50 13 56 13 56 16V48" fill={fill} stroke={stroke} />
          <path d="M57 48V19C57 16 63 16 63 19V48" fill={fill} stroke={stroke} />
          <path d="M64 48V24C64 21 70 21 70 24V56" fill={fill} stroke={stroke} />
          {/* Lingkaran telunjuk dan ibu jari (simbol OK) */}
          <circle cx="40" cy="50" r="11" fill={fill} stroke={stroke} />
          <circle cx="40" cy="50" r="4" fill="white" stroke={stroke} strokeWidth="1.8" />
          {/* Pergelangan */}
          <path d="M42 70V86H62V70" fill={fill} stroke={stroke} />
        </g>
      );

    case 'G':
      // Ibu jari dan telunjuk mendatar ke kiri/kanan sejajar
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telapak kepalan */}
          <circle cx="56" cy="52" r="16" fill={fill} stroke={stroke} />
          {/* Jari telunjuk menunjuk horizontal */}
          <path d="M56 42H22C18 42 18 48 22 48H56" fill={fill} stroke={stroke} />
          {/* Ibu jari sejajar mendatar */}
          <path d="M56 56H26C23 56 23 62 26 62H56" fill={fill} stroke={stroke} />
          {/* Pergelangan tangan */}
          <path d="M68 62L78 72H68" stroke={stroke} />
        </g>
      );

    case 'H':
      // Telunjuk dan jari tengah lurus mendatar bersamaan
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telapak kepalan */}
          <circle cx="60" cy="52" r="15" fill={fill} stroke={stroke} />
          {/* Telunjuk mendatar */}
          <path d="M60 40H20C17 40 17 47 20 47H60" fill={fill} stroke={stroke} />
          {/* Jari tengah mendatar berdampingan */}
          <path d="M60 48H22C19 48 19 55 22 55H60" fill={fill} stroke={stroke} />
          {/* Garis batas dua jari */}
          <line x1="22" y1="47.5" x2="58" y2="47.5" stroke={detail} strokeWidth="1.5" />
          {/* Pergelangan */}
          <path d="M68 62L78 72" stroke={stroke} />
        </g>
      );

    case 'I':
      // Jari kelingking tegak lurus, jari lain mengepal rapat
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telapak tangan mengepal */}
          <rect x="34" y="44" width="34" height="34" rx="7" fill={fill} stroke={stroke} />
          <line x1="36" y1="52" x2="66" y2="52" stroke={detail} strokeWidth="2" />
          <line x1="36" y1="62" x2="66" y2="62" stroke={detail} strokeWidth="2" />
          {/* Ibu jari melintang di depan kepalan */}
          <path d="M34 52C40 48 54 48 58 54" stroke={stroke} />
          {/* Kelingking tegak tinggi */}
          <path d="M61 44V18C61 14 68 14 68 18V44" fill={fill} stroke={stroke} />
          {/* Pergelangan tangan */}
          <path d="M42 78V88H62V78" fill={fill} stroke={stroke} />
        </g>
      );

    case 'K':
      // Telunjuk dan tengah tegak 'V', ibu jari terselip tegak di antaranya
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telunjuk tegak */}
          <path d="M38 56V20C38 16 44 16 44 20V56" fill={fill} stroke={stroke} />
          {/* Jari tengah miring */}
          <path d="M46 56L60 26C63 23 68 26 65 30L52 56" fill={fill} stroke={stroke} />
          {/* Ibu jari terselip di tengah */}
          <path d="M42 56V38C42 35 48 35 48 38V56" fill={fill} stroke={stroke} />
          {/* Telapak bawah */}
          <rect x="34" y="56" width="34" height="24" rx="6" fill={fill} stroke={stroke} />
          {/* Pergelangan */}
          <path d="M40 80V88H60V80" fill={fill} stroke={stroke} />
        </g>
      );

    case 'L':
      // Ibu jari dan telunjuk tegak lurus membentuk sudut 'L' siku-siku
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telunjuk tegak lurus ke atas */}
          <path d="M44 60V18C44 14 51 14 51 18V60" fill={fill} stroke={stroke} />
          {/* Ibu jari horizontal ke kiri membentuk huruf L */}
          <path d="M51 60H18C14 60 14 67 18 67H51" fill={fill} stroke={stroke} />
          {/* Sisa 3 jari tertekuk ke telapak */}
          <rect x="50" y="44" width="22" height="28" rx="6" fill={fill} stroke={stroke} />
          <line x1="52" y1="52" x2="70" y2="52" stroke={detail} strokeWidth="1.8" />
          <line x1="52" y1="60" x2="70" y2="60" stroke={detail} strokeWidth="1.8" />
          {/* Pergelangan tangan */}
          <path d="M48 72V88H66V72" fill={fill} stroke={stroke} />
        </g>
      );

    case 'M':
      // Tiga jari melipat di atas ibu jari
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <rect x="32" y="36" width="38" height="40" rx="8" fill={fill} stroke={stroke} />
          {/* Tiga jari melipat */}
          <line x1="42" y1="36" x2="42" y2="60" stroke={detail} strokeWidth="2" />
          <line x1="52" y1="36" x2="52" y2="60" stroke={detail} strokeWidth="2" />
          <line x1="61" y1="36" x2="61" y2="60" stroke={detail} strokeWidth="2" />
          {/* Ujung ibu jari mengintip di bawah jari manis */}
          <circle cx="58" cy="62" r="3.5" fill={fill} stroke={stroke} strokeWidth="1.8" />
          {/* Pergelangan */}
          <path d="M40 76V88H62V76" fill={fill} stroke={stroke} />
        </g>
      );

    case 'N':
      // Dua jari (telunjuk dan tengah) melipat di atas ibu jari
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <rect x="34" y="36" width="36" height="40" rx="8" fill={fill} stroke={stroke} />
          <line x1="48" y1="36" x2="48" y2="58" stroke={detail} strokeWidth="2" />
          {/* Ujung ibu jari menyembul antara jari tengah & manis */}
          <circle cx="48" cy="60" r="3.5" fill={fill} stroke={stroke} strokeWidth="1.8" />
          {/* Pergelangan */}
          <path d="M40 76V88H62V76" fill={fill} stroke={stroke} />
        </g>
      );

    case 'O':
      // Semua jari melingkar membentuk huruf O bulat
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <circle cx="50" cy="48" r="22" fill={fill} stroke={stroke} />
          <circle cx="50" cy="48" r="9" fill="white" stroke={stroke} strokeWidth="2.5" />
          {/* Lipatan ruas jari luar */}
          <path d="M40 30C48 26 56 26 62 30" stroke={detail} strokeWidth="1.8" />
          <path d="M40 66C48 70 56 70 62 66" stroke={detail} strokeWidth="1.8" />
          {/* Pergelangan */}
          <path d="M42 70V86H58V70" fill={fill} stroke={stroke} />
        </g>
      );

    case 'R':
      // Telunjuk dan jari tengah menyilang tegak
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telunjuk menyilang ke kanan */}
          <path d="M38 58L54 20C56 16 62 18 59 23L45 58" fill={fill} stroke={stroke} />
          {/* Jari tengah menyilang ke kiri di depan telunjuk */}
          <path d="M54 58L40 22C38 18 32 20 35 25L47 58" fill={fill} stroke={stroke} />
          {/* Telapak bawah & kepalan */}
          <rect x="34" y="56" width="34" height="24" rx="6" fill={fill} stroke={stroke} />
          {/* Pergelangan */}
          <path d="M40 80V88H60V80" fill={fill} stroke={stroke} />
        </g>
      );

    case 'S':
      // Kepalan tangan erat dengan ibu jari melintang di depan jari-jari
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <rect x="34" y="36" width="34" height="40" rx="8" fill={fill} stroke={stroke} />
          {/* Garis jari-jari di belakang */}
          <line x1="38" y1="46" x2="64" y2="46" stroke={detail} strokeWidth="1.8" />
          <line x1="38" y1="54" x2="64" y2="54" stroke={detail} strokeWidth="1.8" />
          {/* Ibu jari tebal melintang di depan tengah telapak */}
          <path d="M30 64C34 50 64 50 68 58C70 62 64 66 58 66H34" fill={fill} stroke={stroke} />
          {/* Pergelangan */}
          <path d="M40 76V88H62V76" fill={fill} stroke={stroke} />
        </g>
      );

    case 'U':
      // Dua jari (telunjuk dan tengah) tegak lurus rapat ke atas
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Dua jari tegak rapat */}
          <rect x="40" y="18" width="22" height="44" rx="6" fill={fill} stroke={stroke} />
          <line x1="51" y1="18" x2="51" y2="60" stroke={detail} strokeWidth="2" />
          {/* Telapak bawah & ibu jari melipat */}
          <rect x="34" y="54" width="34" height="26" rx="6" fill={fill} stroke={stroke} />
          <path d="M34 60C38 54 48 54 52 60" stroke={stroke} />
          {/* Pergelangan */}
          <path d="M40 80V88H60V80" fill={fill} stroke={stroke} />
        </g>
      );

    case 'V':
      // Dua jari (telunjuk dan tengah) terbuka membentuk huruf 'V'
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telunjuk miring ke kiri */}
          <path d="M44 56L32 20C30 16 36 14 39 18L49 56" fill={fill} stroke={stroke} />
          {/* Jari tengah miring ke kanan */}
          <path d="M49 56L61 18C64 14 70 16 68 20L56 56" fill={fill} stroke={stroke} />
          {/* Telapak tangan & jari lain melipat */}
          <rect x="34" y="54" width="34" height="26" rx="6" fill={fill} stroke={stroke} />
          {/* Pergelangan */}
          <path d="M40 80V88H60V80" fill={fill} stroke={stroke} />
        </g>
      );

    case 'W':
      // Tiga jari (telunjuk, tengah, manis) terbuka mengarah ke atas membentuk 'W'
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <path d="M42 56L30 20C28 16 34 14 37 18L46 56" fill={fill} stroke={stroke} />
          <path d="M46 56V16C46 12 53 12 53 16V56" fill={fill} stroke={stroke} />
          <path d="M53 56L63 18C66 14 72 16 70 20L58 56" fill={fill} stroke={stroke} />
          {/* Telapak tangan & kelingking + jempol melipat */}
          <rect x="34" y="54" width="34" height="26" rx="6" fill={fill} stroke={stroke} />
          {/* Pergelangan */}
          <path d="M40 80V88H60V80" fill={fill} stroke={stroke} />
        </g>
      );

    case 'Y':
      // Ibu jari dan kelingking terbuka keluar (tanda telepon/shaka)
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telapak tengah mengepal */}
          <rect x="36" y="44" width="28" height="32" rx="6" fill={fill} stroke={stroke} />
          <line x1="38" y1="54" x2="62" y2="54" stroke={detail} strokeWidth="1.8" />
          <line x1="38" y1="62" x2="62" y2="62" stroke={detail} strokeWidth="1.8" />
          {/* Ibu jari membuka ke kiri */}
          <path d="M40 60L18 40C15 36 21 32 25 36L42 52" fill={fill} stroke={stroke} />
          {/* Kelingking membuka ke kanan */}
          <path d="M60 52L77 36C81 32 87 36 84 40L62 60" fill={fill} stroke={stroke} />
          {/* Pergelangan */}
          <path d="M40 76V88H60V76" fill={fill} stroke={stroke} />
        </g>
      );

    default:
      // Gestur umum terdefinisi (tangan tegak dengan telunjuk aktif)
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <rect x="34" y="32" width="34" height="44" rx="8" fill={fill} stroke={stroke} />
          <path d="M44 48V20C44 16 51 16 51 20V48" fill={fill} stroke={stroke} />
          <path d="M34 52C38 46 48 46 52 52" stroke={stroke} />
          <path d="M40 76V88H62V76" fill={fill} stroke={stroke} />
        </g>
      );
  }
}

// ----------------------------------------------------------------------
// BISINDO (Bahasa Isyarat Indonesia) - Gestur Kontak Dua Tangan
// ----------------------------------------------------------------------
function BisindoGesture({
  letter,
  fill,
  stroke,
  detail,
}: {
  letter: string;
  fill: string;
  stroke: string;
  detail: string;
}) {
  switch (letter) {
    case 'A':
      // Tangan pasif terbuka ke atas, telunjuk tangan aktif menyentuh ujung ibu jari
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Tangan pasif (kiri) telapak terbuka */}
          <path d="M22 68V40C22 36 28 36 28 40V68" fill={fill} stroke={stroke} />
          <path d="M29 68V34C29 30 35 30 35 34V68" fill={fill} stroke={stroke} />
          <path d="M36 68V36C36 32 42 32 42 36V68" fill={fill} stroke={stroke} />
          {/* Ibu jari tangan pasif miring ke kanan */}
          <path d="M42 56L54 44C57 41 62 44 59 48L46 64" fill={fill} stroke={stroke} />
          {/* Telunjuk tangan aktif (kanan) menyentuh ujung ibu jari pasif */}
          <path d="M78 64L57 46C54 43 59 39 63 42L82 58" fill={fill} stroke={stroke} />
          <circle cx="56" cy="45" r="4" fill="#3B82F6" stroke={stroke} strokeWidth="1.5" />
          <path d="M24 74H46V86H24V74Z" fill={fill} stroke={stroke} />
        </g>
      );

    case 'B':
      // Dua tangan membentuk dua lingkaran yang menyatu seperti huruf B
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Lingkaran atas */}
          <ellipse cx="50" cy="38" rx="14" ry="12" fill={fill} stroke={stroke} />
          <circle cx="50" cy="38" r="4.5" fill="white" stroke={stroke} strokeWidth="1.8" />
          {/* Lingkaran bawah */}
          <ellipse cx="50" cy="62" rx="16" ry="14" fill={fill} stroke={stroke} />
          <circle cx="50" cy="62" r="5.5" fill="white" stroke={stroke} strokeWidth="1.8" />
          {/* Garis vertikal punggung tangan kiri */}
          <path d="M35 26V76" stroke={stroke} strokeWidth="3" />
        </g>
      );

    case 'C':
      // Satu tangan membentuk lengkungan C yang tegas
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <path
            d="M66 30C56 18 36 24 32 38C28 52 28 62 34 72C40 80 62 82 68 70C68 64 54 68 46 64C40 60 38 46 46 40C54 34 66 36 66 30Z"
            fill={fill}
            stroke={stroke}
          />
          <path d="M30 64L20 74H32" stroke={stroke} />
        </g>
      );

    case 'D':
      // Tangan aktif membentuk lengkungan setengah lingkaran menyentuh telunjuk pasif yang tegak lurus
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Garis lurus telunjuk tegak (tangan kiri) */}
          <path d="M36 78V20C36 15 43 15 43 20V78" fill={fill} stroke={stroke} />
          {/* Lengkungan setengah lingkaran (tangan kanan) */}
          <path d="M43 24C65 24 74 42 74 52C74 62 65 74 43 74" fill={fill} stroke={stroke} />
          <circle cx="43" cy="24" r="3.5" fill="#3B82F6" />
          <circle cx="43" cy="74" r="3.5" fill="#3B82F6" />
        </g>
      );

    case 'E':
      // Telunjuk tangan aktif menyentuh ujung jari telunjuk tangan pasif
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          {/* Telapak tangan pasif */}
          <rect x="22" y="36" width="26" height="42" rx="6" fill={fill} stroke={stroke} />
          {/* Jari telunjuk pasif mendatar */}
          <path d="M48 44H62C65 44 65 50 62 50H48" fill={fill} stroke={stroke} />
          {/* Jari telunjuk aktif dari kanan menyentuh ujungnya */}
          <path d="M78 44H62C59 44 59 50 62 50H78" fill={fill} stroke={stroke} />
          {/* Titik kontak */}
          <circle cx="62" cy="47" r="4" fill="#3B82F6" stroke={stroke} strokeWidth="1.5" />
          <rect x="74" y="36" width="16" height="42" rx="6" fill={fill} stroke={stroke} />
        </g>
      );

    default:
      // Tampilan Bisindo umum (kontak dua tangan)
      return (
        <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
          <ellipse cx="40" cy="50" rx="14" ry="18" fill={fill} stroke={stroke} />
          <ellipse cx="60" cy="50" rx="14" ry="18" fill={fill} stroke={stroke} />
          <line x1="50" y1="36" x2="50" y2="64" stroke={detail} strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="#3B82F6" stroke={stroke} strokeWidth="1.5" />
        </g>
      );
  }
}
