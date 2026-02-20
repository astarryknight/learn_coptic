// Coptic alphabet with sounds and pronunciations
export interface CopticLetter {
  letter: string;
  name: string;
  sound: string;
  pronunciation: string;
}

export interface CopticWord {
  coptic: string;
  english: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const copticAlphabet: CopticLetter[] = [
  { letter: 'Ⲁ', name: 'Alpha', sound: 'a', pronunciation: 'ah' },
  { letter: 'Ⲃ', name: 'Beta', sound: 'b', pronunciation: 'b' },
  { letter: 'Ⲅ', name: 'Gamma', sound: 'g', pronunciation: 'g' },
  { letter: 'Ⲇ', name: 'Delta', sound: 'd', pronunciation: 'd' },
  { letter: 'Ⲉ', name: 'Ei', sound: 'e', pronunciation: 'eh' },
  //{ letter: 'Ⲋ', name: 'So', sound: 'so', pronunciation: 'so' },
  { letter: 'Ⲍ', name: 'Zeta', sound: 'z', pronunciation: 'z' },
  { letter: 'Ⲏ', name: 'Eeta', sound: 'ee', pronunciation: 'ee' },
  { letter: 'Ⲑ', name: 'Theta', sound: 'th', pronunciation: 'th' },
  { letter: 'Ⲓ', name: 'Yota', sound: 'i', pronunciation: 'i' },
  { letter: 'Ⲕ', name: 'Kappa', sound: 'k', pronunciation: 'k' },
  { letter: 'Ⲗ', name: 'Lola', sound: 'l', pronunciation: 'l' },
  { letter: 'Ⲙ', name: 'Me', sound: 'm', pronunciation: 'm' },
  { letter: 'Ⲛ', name: 'Ne', sound: 'n', pronunciation: 'n' },
  { letter: 'Ⲝ', name: 'Eksi', sound: 'ks', pronunciation: 'ks' },
  { letter: 'Ⲟ', name: 'O', sound: 'o', pronunciation: 'oh' },
  { letter: 'Ⲡ', name: 'Pi', sound: 'p', pronunciation: 'p' },
  { letter: 'Ⲣ', name: 'Ro', sound: 'r', pronunciation: 'r' },
  { letter: 'Ⲥ', name: 'Seema', sound: 's', pronunciation: 's' },
  { letter: 'Ⲧ', name: 'Tav', sound: 't', pronunciation: 't' },
  { letter: 'Ⲩ', name: 'Epsilon', sound: 'u/v', pronunciation: 'u/v' },
  { letter: 'Ⲫ', name: 'Fi', sound: 'ph', pronunciation: 'ph' },
  { letter: 'Ⲭ', name: 'Khi', sound: 'kh/k', pronunciation: 'kh/k' },
  { letter: 'Ⲯ', name: 'Epsi', sound: 'ps', pronunciation: 'ps' },
  { letter: 'Ⲱ', name: 'Ou', sound: 'oo', pronunciation: 'oo' },
  { letter: 'Ϣ', name: 'Shai', sound: 'sh', pronunciation: 'sh' },
  { letter: 'Ϥ', name: 'Fai', sound: 'f', pronunciation: 'f' },
  { letter: 'Ϧ', name: 'Khai', sound: 'kh', pronunciation: 'kh' },
  { letter: 'Ϩ', name: 'Hori', sound: 'h', pronunciation: 'h' },
  { letter: 'Ϫ', name: 'Janja', sound: 'j', pronunciation: 'j' },
  { letter: 'Ϭ', name: 'Cheema', sound: 'ch', pronunciation: 'ch' },
  { letter: 'Ϯ', name: 'Ti', sound: 'ti', pronunciation: 'tee' },
];

export const copticWords: CopticWord[] = [
  // Easy words (2-3 letters)
  { coptic: 'ϩⲏⲧ', english: 'heart', pronunciation: 'heet', difficulty: 'easy' },
  { coptic: 'ⲙⲁ', english: 'place', pronunciation: 'mah', difficulty: 'easy' },
  { coptic: 'ⲛⲁⲛ', english: 'us', pronunciation: 'nan', difficulty: 'easy' },
  { coptic: 'ϧⲉⲛ', english: 'in', pronunciation: 'khen', difficulty: 'easy' },
  { coptic: 'ⲛ̀ⲧⲉ', english: 'of', pronunciation: 'en-teh', difficulty: 'easy' },
  { coptic: 'ⲫⲁⲓ', english: 'this', pronunciation: 'fai', difficulty: 'easy' },

  // Medium words (4-5 letters)
  { coptic: 'ⲛⲟⲩϯ', english: 'God', pronunciation: 'noo-tee', difficulty: 'medium' },
  { coptic: 'ⲁⲅⲅⲉⲗⲟⲥ', english: 'angel', pronunciation: 'an-ge-los', difficulty: 'medium' },
  { coptic: 'ϣⲏⲣⲓ', english: 'son', pronunciation: 'shee-ree', difficulty: 'medium' },
  { coptic: 'ⲙⲁⲩ', english: 'mother', pronunciation: 'mav', difficulty: 'medium' },
  { coptic: 'ⲥⲓⲟⲩ', english: 'star', pronunciation: 'see-ou', difficulty: 'medium' },
  { coptic: 'ⲕⲁϩⲓ', english: 'earth', pronunciation: 'kah-hee', difficulty: 'medium' },
  { coptic: 'ϣⲟⲙⲧ', english: 'three', pronunciation: 'sho-mt', difficulty: 'medium' },

  // Hard words (6+ letters)
  { coptic: 'ϩⲓⲣⲏⲛⲏ', english: 'peace', pronunciation: 'hee-ree-nee', difficulty: 'hard' },
  { coptic: 'ⲙⲉⲧⲁⲛⲟⲓⲁ', english: 'repentance', pronunciation: 'meh-ta-noy-ah', difficulty: 'hard' },
  { coptic: 'ⲉⲑⲟⲩⲁⲃ', english: 'holy', pronunciation: 'eth-ou-ab', difficulty: 'hard' },
  { coptic: 'ⲉⲕⲕⲗⲏⲥⲓⲁ', english: 'church', pronunciation: 'ek-klee-see-ah', difficulty: 'hard' },
];

// Helper function to get random items
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Helper function to shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}
