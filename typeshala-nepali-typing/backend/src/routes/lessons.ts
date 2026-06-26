import { Router, Request, Response } from "express";

interface Lesson {
  string: string;
  setType: string;
  difficulty: number;
  language: string;
}

const lessons: Record<string, Lesson> = {
  // English lessons
  en_num1: { string: "123 123 123 123 123 123 123 123", setType: "numRow", difficulty: 1, language: "en" },
  en_num2: { string: "321 321 321 321 321 321 321 321", setType: "numRow", difficulty: 1, language: "en" },
  en_num3: { string: "456 456 456 456 456 456 456 456", setType: "numRow", difficulty: 1, language: "en" },
  en_num4: { string: "654 654 654 654 654 654 654 654", setType: "numRow", difficulty: 1, language: "en" },
  en_num5: { string: "678 678 678 678 678 678 678 678", setType: "numRow", difficulty: 1, language: "en" },
  en_num6: { string: "890 890 890 890 890 890 890 890", setType: "numRow", difficulty: 1, language: "en" },
  en_num7: { string: "098 098 098 098 098 098 098 098", setType: "numRow", difficulty: 1, language: "en" },
  en_num8: { string: "456 546 456 546 456 546 456 546", setType: "numRow", difficulty: 2, language: "en" },
  en_num9: { string: "123 321 123 321 123 321 123 321", setType: "numRow", difficulty: 2, language: "en" },
  en_top1: { string: "qwertyuiop[]\\ qwertyuiop[]\\", setType: "topRow", difficulty: 1, language: "en" },
  en_top2: { string: "er tu oi pio p[oi erw iop erw", setType: "topRow", difficulty: 2, language: "en" },
  en_top3: { string: "qwe poi yui rew tyu pou wer tyi", setType: "topRow", difficulty: 2, language: "en" },
  en_top4: { string: "]pew \\qwe erwi wqeq popi utiq", setType: "topRow", difficulty: 3, language: "en" },
  en_top5: { string: "eutw\\ iuiwq ioepw ytuqi weroo", setType: "topRow", difficulty: 3, language: "en" },
  en_top6: { string: "qwiyt oiuyw ][ywue oiutew weiu", setType: "topRow", difficulty: 3, language: "en" },
  en_mid1: { string: "as sa asd dsa asdf fdsa sdf lk", setType: "midRow", difficulty: 1, language: "en" },
  en_mid2: { string: "lkj jkl hjkl; gdf fdas kfd lkf", setType: "midRow", difficulty: 2, language: "en" },
  en_mid3: { string: "asdfgh jkl;' asdfgh jkl;' asdf", setType: "midRow", difficulty: 2, language: "en" },
  en_low1: { string: "xzcv vczx nmb, vccz vc n,mnm,b./", setType: "lowRow", difficulty: 1, language: "en" },
  en_low2: { string: "zxcvbnm,./ zxcvbnm,./ zxcvbnm", setType: "lowRow", difficulty: 2, language: "en" },
  en_low3: { string: "fkl ckoew lknc ioerh dfklje opjlk", setType: "lowRow", difficulty: 3, language: "en" },
  en_all1: { string: "the quick brown fox jumps over the lazy dog.", setType: "allKeys", difficulty: 3, language: "en" },
  en_all2: { string: "pack my box with five dozen liquor jugs.", setType: "allKeys", difficulty: 4, language: "en" },
  en_all3: { string: "sphinx of black quartz judge my vow.", setType: "allKeys", difficulty: 4, language: "en" },
  en_all4: { string: "how vexingly quick daft zebras jump.", setType: "allKeys", difficulty: 4, language: "en" },
  en_all5: { string: "the five boxing wizards jump quickly.", setType: "allKeys", difficulty: 5, language: "en" },

  // Nepali lessons
  ne_top1: { string: "qw er ty ui op [] \\", setType: "topRow", difficulty: 1, language: "ne" },
  ne_top2: { string: "qwe rty uio p[] \\", setType: "topRow", difficulty: 1, language: "ne" },
  ne_top3: { string: "qwert yuiop []\\", setType: "topRow", difficulty: 2, language: "ne" },
  ne_top4: { string: "qw er ty ui op qw er ty ui op", setType: "topRow", difficulty: 2, language: "ne" },
  ne_top5: { string: "qwe rty uio p[] qwe rty uio p[]", setType: "topRow", difficulty: 2, language: "ne" },
  ne_top6: { string: "oiu ytr ewq p[] \\ oiu ytr ewq", setType: "topRow", difficulty: 3, language: "ne" },
  ne_mid1: { string: "as df gh jk l; '", setType: "midRow", difficulty: 1, language: "ne" },
  ne_mid2: { string: "asdf ghjk l;'", setType: "midRow", difficulty: 1, language: "ne" },
  ne_mid3: { string: "as df gh jk l; 'y as df gh jk", setType: "midRow", difficulty: 2, language: "ne" },
  ne_mid4: { string: "asdfgh jkl;' asdfgh jkl;'", setType: "midRow", difficulty: 2, language: "ne" },
  ne_mid5: { string: ";lkj hgf dsa ;' lkj hgf dsa", setType: "midRow", difficulty: 3, language: "ne" },
  ne_low1: { string: "zx cv bn m, ./", setType: "lowRow", difficulty: 1, language: "ne" },
  ne_low2: { string: "zxcv bnm ,./", setType: "lowRow", difficulty: 1, language: "ne" },
  ne_low3: { string: "zx cv bn m, ./ zx cv bn m,", setType: "lowRow", difficulty: 2, language: "ne" },
  ne_low4: { string: "zxcvbnm,./ zxcvbnm,./ zxcvbnm", setType: "lowRow", difficulty: 2, language: "ne" },
  ne_low5: { string: "/. ,mn bvc xz /. ,mn bvc xz", setType: "lowRow", difficulty: 3, language: "ne" },
  ne_all1: { string: "q;x g;l hg. hg. q;x g;l", setType: "allKeys", difficulty: 3, language: "ne" },
  ne_all2: { string: "df;x g;lt df;x g;lt df;x g;lt", setType: "allKeys", difficulty: 3, language: "ne" },
  ne_all3: { string: "q;x g;l hg. dfl; xf; g]kfn", setType: "allKeys", difficulty: 4, language: "ne" },
  ne_all4: { string: "q;x g;l hg. dfl; xf; g]kfn jf ;'/x", setType: "allKeys", difficulty: 4, language: "ne" },
  ne_all5: { string: "q;x g;l hg. dfl; xf; g]kfn jf ;'/x l;h{gx? l;h{gx?", setType: "allKeys", difficulty: 5, language: "ne" },
};

export const lessonsRouter = Router();

lessonsRouter.get("/", (_req: Request, res: Response) => {
  res.json(lessons);
});

lessonsRouter.get("/:setType", (req: Request, res: Response) => {
  const { setType } = req.params;
  const { language } = req.query;
  let filtered = Object.values(lessons).filter((l) => l.setType === setType);
  if (typeof language === "string") {
    filtered = filtered.filter((l) => l.language === language);
  }
  res.json(filtered);
});