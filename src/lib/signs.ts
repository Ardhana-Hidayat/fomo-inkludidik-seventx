// Sistem Isyarat Bahasa Indonesia (SIBI) & Bisindo Aset Helper

export interface SignDetail {
  letter: string;
  name: string;
  description: string;
  fingers: string;
}

export const SIBI_ALPHABET: Record<string, SignDetail> = {
  A: { letter: 'A', name: 'SIBI A', description: 'Kepalan tangan dengan ibu jari tegak di samping jari telunjuk.', fingers: 'Genggam + Ibu jari samping' },
  B: { letter: 'B', name: 'SIBI B', description: 'Empat jari tegak lurus rapat ke atas, ibu jari ditekuk ke telapak.', fingers: 'Empat jari tegak' },
  C: { letter: 'C', name: 'SIBI C', description: 'Bentuk setengah lingkaran menyerupai huruf C dengan telapak tangan menyamping.', fingers: 'Lengkungan C' },
  D: { letter: 'D', name: 'SIBI D', description: 'Jari telunjuk tegak lurus ke atas, jari lain menyatu dengan ibu jari membentuk lingkaran.', fingers: 'Telunjuk tegak + Lingkaran' },
  E: { letter: 'E', name: 'SIBI E', description: 'Semua ujung jari menekuk ke bawah menyentuh ujung ibu jari.', fingers: 'Jari menekuk rapat' },
  F: { letter: 'F', name: 'SIBI F', description: 'Ujung telunjuk dan ibu jari membentuk lingkaran, tiga jari lainnya tegak.', fingers: 'Lingkaran telunjuk-jempol' },
  G: { letter: 'G', name: 'SIBI G', description: 'Ibu jari dan telunjuk membuka horizontal mengarah ke samping.', fingers: 'Jempol dan telunjuk mendatar' },
  H: { letter: 'H', name: 'SIBI H', description: 'Telunjuk dan jari tengah lurus mendatar ke samping.', fingers: 'Dua jari mendatar' },
  I: { letter: 'I', name: 'SIBI I', description: 'Jari kelingking tegak lurus ke atas, jari lainnya mengepal tertutup.', fingers: 'Kelingking tegak' },
  J: { letter: 'J', name: 'SIBI J', description: 'Kelingking membentuk gerakan melengkung seperti huruf J di udara.', fingers: 'Kelingking lengkung J' },
  K: { letter: 'K', name: 'SIBI K', description: 'Telunjuk dan jari tengah tegak membentuk V dengan ibu jari di antaranya.', fingers: 'Bentuk K / V + jempol' },
  L: { letter: 'L', name: 'SIBI L', description: 'Ibu jari dan telunjuk tegak lurus membentuk huruf L siku.', fingers: 'Bentuk huruf L siku' },
  M: { letter: 'M', name: 'SIBI M', description: 'Tiga jari (telunjuk, tengah, manis) menutupi ibu jari yang terselip di bawahnya.', fingers: 'Tiga jari menutupi jempol' },
  N: { letter: 'N', name: 'SIBI N', description: 'Dua jari (telunjuk dan tengah) menutupi ibu jari.', fingers: 'Dua jari menutupi jempol' },
  O: { letter: 'O', name: 'SIBI O', description: 'Semua jari melingkar membentuk huruf O bulat sempurna.', fingers: 'Lingkaran penuh O' },
  P: { letter: 'P', name: 'SIBI P', description: 'Posisi huruf K yang diarahkan mengarah ke bawah.', fingers: 'Bentuk K menghadap bawah' },
  Q: { letter: 'Q', name: 'SIBI Q', description: 'Posisi huruf G yang diarahkan mengarah ke bawah.', fingers: 'Jempol-telunjuk bawah' },
  R: { letter: 'R', name: 'SIBI R', description: 'Jari telunjuk dan jari tengah saling menyilang tegak.', fingers: 'Telunjuk & tengah menyilang' },
  S: { letter: 'S', name: 'SIBI S', description: 'Kepalan tangan dengan ibu jari berada di depan jari-jari lain.', fingers: 'Genggaman jempol di depan' },
  T: { letter: 'T', name: 'SIBI T', description: 'Ibu jari terselip di antara jari telunjuk dan jari tengah.', fingers: 'Jempol selip di telunjuk' },
  U: { letter: 'U', name: 'SIBI U', description: 'Jari telunjuk dan jari tengah tegak lurus rapat ke atas.', fingers: 'Dua jari tegak rapat' },
  V: { letter: 'V', name: 'SIBI V', description: 'Jari telunjuk dan jari tengah terbuka membentuk huruf V.', fingers: 'Dua jari terbuka V' },
  W: { letter: 'W', name: 'SIBI W', description: 'Tiga jari (telunjuk, tengah, manis) terbuka ke atas membentuk W.', fingers: 'Tiga jari terbuka W' },
  X: { letter: 'X', name: 'SIBI X', description: 'Jari telunjuk menekuk seperti kait/kail pancing.', fingers: 'Telunjuk berkait X' },
  Y: { letter: 'Y', name: 'SIBI Y', description: 'Ibu jari dan kelingking terbuka keluar membentuk tanduk/telepon.', fingers: 'Jempol dan kelingking buka' },
  Z: { letter: 'Z', name: 'SIBI Z', description: 'Jari telunjuk menggambar pola huruf Z di udara.', fingers: 'Telunjuk pola Z' },
};

export const BISINDO_ALPHABET: Record<string, SignDetail> = {
  A: { letter: 'A', name: 'Bisindo A', description: 'Dua tangan: Tangan pasif terbuka, telunjuk tangan aktif menyentuh ibu jari tangan pasif.', fingers: 'Sentuh ujung ibu jari' },
  B: { letter: 'B', name: 'Bisindo B', description: 'Dua tangan: Kedua tangan membentuk lingkaran O lalu menyatu seperti angka 8 / huruf B.', fingers: 'Dua lingkaran menyatu' },
  C: { letter: 'C', name: 'Bisindo C', description: 'Satu tangan membentuk lengkungan C yang tegas menghadap lawan bicara.', fingers: 'Lengkung C satu tangan' },
  D: { letter: 'D', name: 'Bisindo D', description: 'Dua tangan: Tangan aktif membentuk lengkungan menyentuh telunjuk tangan pasif yang tegak.', fingers: 'Bentuk setengah lingkaran + garis' },
  E: { letter: 'E', name: 'Bisindo E', description: 'Dua tangan: Telunjuk tangan aktif menyentuh jari telunjuk tangan pasif.', fingers: 'Sentuh jari telunjuk' },
  F: { letter: 'F', name: 'Bisindo F', description: 'Dua tangan: Dua jari (telunjuk & tengah) menyilang di atas dua jari tangan lain.', fingers: 'Dua jari silang' },
  G: { letter: 'G', name: 'Bisindo G', description: 'Dua kepalan tangan ditumpuk vertikal satu di atas yang lain.', fingers: 'Dua kepalan bertumpuk' },
  H: { letter: 'H', name: 'Bisindo H', description: 'Tangan aktif menyapu telapak tangan pasif secara mendatar.', fingers: 'Usap telapak tangan' },
  I: { letter: 'I', name: 'Bisindo I', description: 'Dua tangan: Telunjuk tangan aktif menyentuh jari tengah tangan pasif.', fingers: 'Sentuh jari tengah' },
  J: { letter: 'J', name: 'Bisindo J', description: 'Telunjuk menyusur dari jari manis ke ujung tangan pasif membentuk lengkung.', fingers: 'Lengkung telunjuk di telapak' },
  K: { letter: 'K', name: 'Bisindo K', description: 'Telunjuk ditekuk menyentuh jari telunjuk tangan lain membentuk kait K.', fingers: 'Kait telunjuk bertemu' },
  L: { letter: 'L', name: 'Bisindo L', description: 'Telunjuk tangan aktif diletakkan tegak di atas telapak tangan pasif.', fingers: 'Telunjuk di atas telapak' },
  M: { letter: 'M', name: 'Bisindo M', description: 'Tiga jari (telunjuk, tengah, manis) diletakkan di atas telapak tangan pasif.', fingers: 'Tiga jari di atas telapak' },
  N: { letter: 'N', name: 'Bisindo N', description: 'Dua jari (telunjuk & tengah) diletakkan di atas telapak tangan pasif.', fingers: 'Dua jari di atas telapak' },
  O: { letter: 'O', name: 'Bisindo O', description: 'Dua tangan: Telunjuk tangan aktif menyentuh jari manis tangan pasif.', fingers: 'Sentuh jari manis' },
  P: { letter: 'P', name: 'Bisindo P', description: 'Telunjuk dan ibu jari membentuk lingkaran di atas jari telunjuk tangan pasif.', fingers: 'Lingkaran di ujung telunjuk' },
  Q: { letter: 'Q', name: 'Bisindo Q', description: 'Lingkaran kedua tangan saling mengait lembut.', fingers: 'Kait lingkaran dua tangan' },
  R: { letter: 'R', name: 'Bisindo R', description: 'Jari telunjuk ditekuk di atas telapak tangan pasif membentuk lengkungan.', fingers: 'Kait di telapak tangan' },
  S: { letter: 'S', name: 'Bisindo S', description: 'Kedua jari kelingking saling mengait di depan dada.', fingers: 'Kelingking saling kait' },
  T: { letter: 'T', name: 'Bisindo T', description: 'Ujung telunjuk tangan aktif menyentuh tepi sisi telapak tangan pasif.', fingers: 'Sentuh tepi telapak tangan' },
  U: { letter: 'U', name: 'Bisindo U', description: 'Dua tangan: Telunjuk tangan aktif menyentuh ujung kelingking tangan pasif.', fingers: 'Sentuh ujung kelingking' },
  V: { letter: 'V', name: 'Bisindo V', description: 'Bentuk huruf V dua jari diletakkan di atas telapak tangan pasif.', fingers: 'Huruf V di atas telapak' },
  W: { letter: 'W', name: 'Bisindo W', description: 'Jari-jari kedua tangan saling mengunci menyilang mengarah ke atas.', fingers: 'Jari bersilang mengunci' },
  X: { letter: 'X', name: 'Bisindo X', description: 'Kedua telunjuk menyilang membentuk silang X.', fingers: 'Dua telunjuk menyilang X' },
  Y: { letter: 'Y', name: 'Bisindo Y', description: 'Ibu jari dan telunjuk tangan aktif diletakkan di antara jempol dan telunjuk tangan pasif.', fingers: 'Bentuk sudut Y dua tangan' },
  Z: { letter: 'Z', name: 'Bisindo Z', description: 'Ujung jari kedua telapak tangan saling bertemu miring membentuk pola Z.', fingers: 'Pertemuan sudut telapak Z' },
};

export function getSignDetail(letter: string, system: 'SIBI' | 'BISINDO'): SignDetail {
  const upper = letter.toUpperCase();
  const dict = system === 'BISINDO' ? BISINDO_ALPHABET : SIBI_ALPHABET;
  if (dict[upper]) {
    return dict[upper];
  }
  return {
    letter: upper,
    name: `${system} ${upper}`,
    description: `Isyarat huruf ${upper} sistem ${system}.`,
    fingers: `Huruf ${upper}`,
  };
}
