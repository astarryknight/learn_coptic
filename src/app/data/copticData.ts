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
  { coptic: 'ϩⲏⲧ', english: 'heart', pronunciation: 'h ee t', difficulty: 'easy' },
  { coptic: 'ⲙⲁ', english: 'place', pronunciation: 'm a', difficulty: 'easy' },
  { coptic: 'ⲛⲁⲛ', english: 'us', pronunciation: 'n a n', difficulty: 'easy' },
  { coptic: 'ⲛⲁⲓ', english: 'mercy', pronunciation: 'n a i', difficulty: 'easy' },
  { coptic: 'ϧⲉⲛ', english: 'in', pronunciation: 'kh e n', difficulty: 'easy' },
  { coptic: 'ⲛ̀ⲧⲉ', english: 'of', pronunciation: 'en t e', difficulty: 'easy' },
  { coptic: 'ⲫⲁⲓ', english: 'this', pronunciation: 'f a i', difficulty: 'easy' },
  { coptic: 'ϫⲟⲙ', english: 'power', pronunciation: 'g o m', difficulty: 'easy' },
  { coptic: 'ⲛⲉⲙ', english: 'and', pronunciation: 'n e m', difficulty: 'easy' },
  { coptic: 'ϩⲱⲥ', english: 'praise', pronunciation: 'h o o s', difficulty: 'easy' },
  { coptic: 'ⲗⲁⲥ', english: 'tongue', pronunciation: 'l a s', difficulty: 'easy' },
  { coptic: 'ϫⲓϫ', english: 'hand', pronunciation: 'j i j', difficulty: 'easy' },
  { coptic: 'ⲱⲟⲩ', english: 'glory', pronunciation: 'ou o u', difficulty: 'easy' },
  { coptic: 'ⲣⲁⲛ', english: 'name', pronunciation: 'r a n', difficulty: 'easy' },
  { coptic: 'ⲙⲁⲩ', english: 'name', pronunciation: 'm a v', difficulty: 'easy' },

  // Medium words (4-5 letters)
  { coptic: 'ⲛⲟⲩϯ', english: 'God', pronunciation: 'n o u tee', difficulty: 'medium' },
  { coptic: 'ⲁⲅⲅⲉⲗⲟⲥ', english: 'angel', pronunciation: 'a n g e l o s', difficulty: 'medium' },
  { coptic: 'ϣⲏⲣⲓ', english: 'son', pronunciation: 'sh ee r ee', difficulty: 'medium' },
  { coptic: 'ⲙⲁⲩ', english: 'mother', pronunciation: 'm a v', difficulty: 'medium' },
  { coptic: 'ⲥⲓⲟⲩ', english: 'star', pronunciation: 's ee o u', difficulty: 'medium' },
  { coptic: 'ⲕⲁϩⲓ', english: 'earth', pronunciation: 'k a h ee', difficulty: 'medium' },
  { coptic: 'ϣⲟⲙⲧ', english: 'three', pronunciation: 'sh o m t', difficulty: 'medium' },
  { coptic: 'ⲁⲝⲓⲟⲥ', english: 'worth', pronunciation: 'a x ee o s', difficulty: 'medium' },
  { coptic: 'ⲉϩⲟⲟⲩ', english: 'day', pronunciation: 'e h o o u', difficulty: 'medium' },
  { coptic: 'ⲣⲟⲙⲡⲓ', english: 'year', pronunciation: 'r o m p i', difficulty: 'medium' },
  { coptic: 'ⲯⲩⲭⲏ', english: 'soul', pronunciation: 'ps e kh ee', difficulty: 'medium' },
  { coptic: 'ⲣⲱⲙⲓ', english: 'human', pronunciation: 'r ou m i', difficulty: 'medium' },
  { coptic: 'ⲥ̀ⲙⲟⲩ', english: 'bless', pronunciation: 'es m o u', difficulty: 'medium' },
  { coptic: 'ⲕⲁⲧⲁ', english: 'according to', pronunciation: 'k a t a', difficulty: 'medium' },
  { coptic: 'ⲥⲁϫⲓ', english: 'word', pronunciation: 's a j i', difficulty: 'medium' },
  { coptic: 'ⲛⲟⲙⲟⲥ', english: 'law', pronunciation: 'n o m o s', difficulty: 'medium' },
  { coptic: 'ϭⲟⲓⲥ', english: 'lord', pronunciation: 'ch o i s', difficulty: 'medium' },
  { coptic: 'ⲧⲏⲣⲟⲩ', english: 'all', pronunciation: 't ee r o u', difficulty: 'medium' },
  { coptic: 'ⲛⲟⲩϯ', english: 'god', pronunciation: 'n o u tee', difficulty: 'medium' },
  { coptic: 'ⲥⲱⲛⲓ', english: 'sister', pronunciation: 's ou n i', difficulty: 'medium' },
  { coptic: 'ϣⲁϣϥ', english: 'seven', pronunciation: 'sh a sh f', difficulty: 'medium' },
  { coptic: 'ϩⲙⲟⲧ', english: 'grace', pronunciation: 'eh m o t', difficulty: 'medium' },
  { coptic: 'ⲣⲁϣⲓ', english: 'joy', pronunciation: 'r a sh i', difficulty: 'medium' },
  { coptic: 'ⲑ̀ⲙⲏⲓ', english: 'true', pronunciation: 'eth m ee i', difficulty: 'medium' },
  { coptic: 'ⲟⲩⲣⲟ', english: 'king', pronunciation: 'o u r o', difficulty: 'medium' },
  { coptic: 'ϣⲫⲉⲣⲓ', english: 'friend', pronunciation: 'esh v e r i', difficulty: 'medium' },


  // Hard words (6+ letters)
  { coptic: 'ϩⲓⲣⲏⲛⲏ', english: 'peace', pronunciation: 'h ee r ee n ee', difficulty: 'hard' },
  { coptic: 'ⲙⲉⲧⲁⲛⲟⲓⲁ', english: 'repentance', pronunciation: 'm e t a n o i a', difficulty: 'hard' },
  { coptic: 'ⲉⲑⲟⲩⲁⲃ', english: 'holy', pronunciation: 'e th o u a b', difficulty: 'hard' },
  { coptic: 'ⲉⲕⲕⲗⲏⲥⲓⲁ', english: 'church', pronunciation: 'e k k l ee s i a', difficulty: 'hard' },
  { coptic: 'ⲟⲩⲱⲓⲛⲓ', english: 'light', pronunciation: 'o u ou i n i', difficulty: 'hard' },
  { coptic: 'ⲟⲩⲱϣⲧ', english: 'worship', pronunciation: 'o u ou sh t', difficulty: 'hard' },

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
