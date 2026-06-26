import type { SetType } from "./keyboardLayouts";

export interface Lesson {
  string: string;
  setType: SetType;
  difficulty: number;
  language: "en" | "ne";
  note?: string;
}

export interface LessonsMap {
  [key: string]: Lesson;
}

export const lessons: LessonsMap = {
  // English lessons
  en_num1: { string: "123 123 123 123 123 123 123 123", setType: "numRow", difficulty: 1, language: "en", note: "Practice the left-hand number keys 1-3" },
  en_num2: { string: "321 321 321 321 321 321 321 321", setType: "numRow", difficulty: 1, language: "en", note: "Reverse order practice for 1-3" },
  en_num3: { string: "456 456 456 456 456 456 456 456", setType: "numRow", difficulty: 1, language: "en", note: "Middle number keys 4-6" },
  en_num4: { string: "654 654 654 654 654 654 654 654", setType: "numRow", difficulty: 1, language: "en", note: "Reverse order practice for 4-6" },
  en_num5: { string: "678 678 678 678 678 678 678 678", setType: "numRow", difficulty: 1, language: "en", note: "Right-hand number keys 6-8" },
  en_num6: { string: "890 890 890 890 890 890 890 890", setType: "numRow", difficulty: 1, language: "en", note: "Right-hand number keys 8-0" },
  en_num7: { string: "098 098 098 098 098 098 098 098", setType: "numRow", difficulty: 1, language: "en", note: "Reverse order practice for 8-0" },
  en_num8: { string: "456 546 456 546 456 546 456 546", setType: "numRow", difficulty: 2, language: "en", note: "Mixed patterns for 4-6" },
  en_num9: { string: "123 321 123 321 123 321 123 321", setType: "numRow", difficulty: 2, language: "en", note: "Alternating forward and backward" },
  en_top1: { string: "qwertyuiop[]\\ qwertyuiop[]\\", setType: "topRow", difficulty: 1, language: "en" },
  en_top2: { string: "er tu oi pio p[oi erw iop erw", setType: "topRow", difficulty: 2, language: "en" },
  en_top3: { string: "qwe poi yui rew tyu pou wer tyi", setType: "topRow", difficulty: 2, language: "en" },
  en_top4: { string: "]pew \\qwe erwi wqeq popi utiq", setType: "topRow", difficulty: 3, language: "en" },
  en_top5: { string: "eutw\\ iuiwq ioepw ytuqi weroo", setType: "topRow", difficulty: 3, language: "en" },
  en_top6: { string: "qwiyt oiuyw ][ywue oiutew weiu", setType: "topRow", difficulty: 3, language: "en" },
  en_mid1: { string: "as sa asd dsa asdf fdsa sdf lk", setType: "midRow", difficulty: 1, language: "en", note: "Home row basics - ASDF and JKL;" },
  en_mid2: { string: "lkj jkl hjkl; gdf fdas kfd lkf", setType: "midRow", difficulty: 2, language: "en", note: "All home row keys with variations" },
  en_mid3: { string: "asdfgh jkl;' asdfgh jkl;' asdf", setType: "midRow", difficulty: 2, language: "en", note: "Full home row sequences" },
  en_low1: { string: "xzcv vczx nmb, vccz vc n,mnm,b./", setType: "lowRow", difficulty: 1, language: "en" },
  en_low2: { string: "zxcvbnm,./ zxcvbnm,./ zxcvbnm", setType: "lowRow", difficulty: 2, language: "en" },
  en_low3: { string: "fkl ckoew lknc ioerh dfklje opjlk", setType: "lowRow", difficulty: 3, language: "en" },
  en_all1: { string: "the quick brown fox jumps over the lazy dog.", setType: "allKeys", difficulty: 3, language: "en", note: "Pangram - uses all 26 letters" },
  en_all2: { string: "pack my box with five dozen liquor jugs.", setType: "allKeys", difficulty: 4, language: "en", note: "Another pangram for practice" },
  en_all3: { string: "sphinx of black quartz judge my vow.", setType: "allKeys", difficulty: 4, language: "en", note: "Short pangram" },
  en_all4: { string: "how vexingly quick daft zebras jump.", setType: "allKeys", difficulty: 4, language: "en", note: "Focus on speed and accuracy" },
  en_all5: { string: "the five boxing wizards jump quickly.", setType: "allKeys", difficulty: 5, language: "en", note: "Advanced pangram" },
  en_all6: { string: "grumpy wizards make toxic brew for the evil queen and jack.", setType: "allKeys", difficulty: 5, language: "en" },
  en_all7: { string: "two driven jocks help fax my big quiz to the hotel.", setType: "allKeys", difficulty: 4, language: "en" },
  en_all8: { string: "the quick brown fox jumps over the lazy dog near the bank of the river.", setType: "allKeys", difficulty: 3, language: "en" },

  en_num10: { string: "135 246 357 468 579 680", setType: "numRow", difficulty: 2, language: "en" },
  en_num11: { string: "987 876 765 654 543 432", setType: "numRow", difficulty: 2, language: "en" },
  en_num12: { string: "12345 67890 09876 54321", setType: "numRow", difficulty: 3, language: "en" },

  en_top7: { string: "qwer tyui op[] qwerty uiop[]", setType: "topRow", difficulty: 1, language: "en" },
  en_top8: { string: "quite quick write point order poor", setType: "topRow", difficulty: 3, language: "en" },
  en_top9: { string: "query power tower quiet report poet", setType: "topRow", difficulty: 4, language: "en" },

  en_mid4: { string: "ask dad had sad flash glad lass", setType: "midRow", difficulty: 1, language: "en" },
  en_mid5: { string: "half dashed flag salad dash flask", setType: "midRow", difficulty: 2, language: "en" },
  en_mid6: { string: "shall ask glad dash flask salad half", setType: "midRow", difficulty: 3, language: "en" },

  en_low4: { string: "zero zone mix vex cube numb climb", setType: "lowRow", difficulty: 2, language: "en" },
  en_low5: { string: "exam next cave buzz move zinc bonus", setType: "lowRow", difficulty: 3, language: "en" },
  en_low6: { string: "box fix maze jinx vault comb zinc", setType: "lowRow", difficulty: 4, language: "en" },

  // Nepali lessons (Preeti keyboard layout)
  // Top row: q=क w=ख e=ग r=घ t=ङ y=च u=छ i=ज o=झ p=ञ [=ट ]=ड \=ण
  ne_top1: { string: "qw er ty ui op [] \\", setType: "topRow", difficulty: 1, language: "ne", note: "Preeti top row basics - pairs of keys" },
  ne_top2: { string: "qwe rty uio p[] \\", setType: "topRow", difficulty: 1, language: "ne", note: "Three-key patterns for top row" },
  ne_top3: { string: "qwert yuiop []\\", setType: "topRow", difficulty: 2, language: "ne", note: "Full top row sequences" },
  ne_top4: { string: "qw er ty ui op qw er ty ui op", setType: "topRow", difficulty: 2, language: "ne" },
  ne_top5: { string: "qwe rty uio p[] qwe rty uio p[]", setType: "topRow", difficulty: 2, language: "ne" },
  ne_top6: { string: "oiu ytr ewq p[] \\ oiu ytr ewq", setType: "topRow", difficulty: 3, language: "ne" },

  // Mid row: a=त s=थ d=द f=ध g=न h=प j=फ k=ब l=भ ;=म '=य
  ne_mid1: { string: "as df gh jk l; '", setType: "midRow", difficulty: 1, language: "ne" },
  ne_mid2: { string: "asdf ghjk l;'", setType: "midRow", difficulty: 1, language: "ne" },
  ne_mid3: { string: "as df gh jk l; 'y as df gh jk", setType: "midRow", difficulty: 2, language: "ne" },
  ne_mid4: { string: "asdfgh jkl;' asdfgh jkl;'", setType: "midRow", difficulty: 2, language: "ne" },
  ne_mid5: { string: ";lkj hgf dsa ;' lkj hgf dsa", setType: "midRow", difficulty: 3, language: "ne" },

  // Low row: z=र x=ल c=व v=श b=ष n=स m=ह ,=अ .=इ /=उ
  ne_low1: { string: "zx cv bn m, ./", setType: "lowRow", difficulty: 1, language: "ne" },
  ne_low2: { string: "zxcv bnm ,./", setType: "lowRow", difficulty: 1, language: "ne" },
  ne_low3: { string: "zx cv bn m, ./ zx cv bn m,", setType: "lowRow", difficulty: 2, language: "ne" },
  ne_low4: { string: "zxcvbnm,./ zxcvbnm,./ zxcvbnm", setType: "lowRow", difficulty: 2, language: "ne" },
  ne_low5: { string: "/. ,mn bvc xz /. ,mn bvc xz", setType: "lowRow", difficulty: 3, language: "ne" },

  // All keys - words that form meaningful Nepali text in Preeti font
  // q=क a=त z=र ;=म x=ल g=न d=द h=प
  // Common Nepali words in Preeti: q;x=कमल, g;l=नमल, ;'/x=म्यल
  ne_all1: { string: "q;x g;l hg. hg. q;x g;l", setType: "allKeys", difficulty: 3, language: "ne" },
  ne_all2: { string: "df;x g;lt df;x g;lt df;x g;lt", setType: "allKeys", difficulty: 3, language: "ne" },
  ne_all3: { string: "q;x g;l hg. dfl; xf; g]kfn", setType: "allKeys", difficulty: 4, language: "ne" },
  ne_all4: { string: "q;x g;l hg. dfl; xf; g]kfn jf ;'/x", setType: "allKeys", difficulty: 4, language: "ne" },
  ne_all5: { string: "q;x g;l hg. dfl; xf; g]kfn jf ;'/x l;h{gx? l;h{gx?", setType: "allKeys", difficulty: 5, language: "ne" },

  ne_num1: { string: "123 123 123 123 123 123", setType: "numRow", difficulty: 1, language: "ne" },
  ne_num2: { string: "456 456 456 456 456 456", setType: "numRow", difficulty: 1, language: "ne" },
  ne_num3: { string: "789 789 789 789 789 789", setType: "numRow", difficulty: 1, language: "ne" },
  ne_num4: { string: "135 246 357 468 579 680", setType: "numRow", difficulty: 2, language: "ne" },
  ne_num5: { string: "987 876 765 654 543 432", setType: "numRow", difficulty: 2, language: "ne" },

  ne_top7: { string: "qwe rty uio qwe rty uio p[] \\", setType: "topRow", difficulty: 2, language: "ne" },
  ne_top8: { string: "oip ytr ewq oip ytr ewq p[] \\", setType: "topRow", difficulty: 3, language: "ne" },
  ne_top9: { string: "qwe rt yu io p[] qwe rt yu io p[] \\", setType: "topRow", difficulty: 3, language: "ne" },

  ne_mid6: { string: "as df gh jk l; 'y as df gh jk l; 'y", setType: "midRow", difficulty: 2, language: "ne" },
  ne_mid7: { string: "lkj hgf dsa ;'lkj hgf dsa ;'lkj hgf", setType: "midRow", difficulty: 3, language: "ne" },
  ne_mid8: { string: "asdf ghjk l;' yasdf ghjk l;' y", setType: "midRow", difficulty: 3, language: "ne" },

  ne_low6: { string: "zx cv bn m, ./ zx cv bn m, ./", setType: "lowRow", difficulty: 2, language: "ne" },
  ne_low7: { string: "/. ,mn bvc xz /. ,mn bvc xz", setType: "lowRow", difficulty: 3, language: "ne" },
  ne_low8: { string: "zx cv bn m, ./ zx cv bn m, ./", setType: "lowRow", difficulty: 3, language: "ne" },

  ne_all6: { string: "q;x g;l hg. dfl; xf; g]kfn", setType: "allKeys", difficulty: 3, language: "ne" },
  ne_all7: { string: "q;x g;l hg. dfl; xf; g]kfn jf ;'/x", setType: "allKeys", difficulty: 4, language: "ne" },
  ne_all8: { string: "q;x g;l hg. dfl; xf; g]kfn jf ;'/x l;h{gx?", setType: "allKeys", difficulty: 4, language: "ne" },
};

export function getLessonsByType(setType: SetType, language: "en" | "ne" = "en"): string[] {
  return Object.keys(lessons)
    .filter((key) => lessons[key].setType === setType && lessons[key].language === language)
    .map((key) => lessons[key].string);
}
