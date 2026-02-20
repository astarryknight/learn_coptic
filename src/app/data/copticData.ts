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
  { letter: 'Ⲃ', name: 'Vita', sound: 'v', pronunciation: 'v' },
  { letter: 'Ⲅ', name: 'Gamma', sound: 'g', pronunciation: 'g' },
  { letter: 'Ⲇ', name: 'Dalda', sound: 'd', pronunciation: 'd' },
  { letter: 'Ⲉ', name: 'Ei', sound: 'e', pronunciation: 'eh' },
  { letter: 'Ⲋ', name: 'So', sound: 'so', pronunciation: 'so' },
  { letter: 'Ⲍ', name: 'Zita', sound: 'z', pronunciation: 'z' },
  { letter: 'Ⲏ', name: 'Ita', sound: 'i', pronunciation: 'ee' },
  { letter: 'Ⲑ', name: 'Thita', sound: 'th', pronunciation: 'th' },
  { letter: 'Ⲓ', name: 'Yota', sound: 'i', pronunciation: 'ee' },
  { letter: 'Ⲕ', name: 'Kappa', sound: 'k', pronunciation: 'k' },
  { letter: 'Ⲗ', name: 'Lauda', sound: 'l', pronunciation: 'l' },
  { letter: 'Ⲙ', name: 'Mi', sound: 'm', pronunciation: 'm' },
  { letter: 'Ⲛ', name: 'Ni', sound: 'n', pronunciation: 'n' },
  { letter: 'Ⲝ', name: 'Eksi', sound: 'ks', pronunciation: 'ks' },
  { letter: 'Ⲟ', name: 'O', sound: 'o', pronunciation: 'oh' },
  { letter: 'Ⲡ', name: 'Pi', sound: 'p', pronunciation: 'p' },
  { letter: 'Ⲣ', name: 'Ro', sound: 'r', pronunciation: 'r' },
  { letter: 'Ⲥ', name: 'Sima', sound: 's', pronunciation: 's' },
  { letter: 'Ⲧ', name: 'Tav', sound: 't', pronunciation: 't' },
  { letter: 'Ⲩ', name: 'Upsilon', sound: 'u', pronunciation: 'oo' },
  { letter: 'Ⲫ', name: 'Fi', sound: 'f', pronunciation: 'f' },
  { letter: 'Ⲭ', name: 'Khi', sound: 'kh', pronunciation: 'kh' },
  { letter: 'Ⲯ', name: 'Epsi', sound: 'ps', pronunciation: 'ps' },
  { letter: 'Ⲱ', name: 'Omega', sound: 'o', pronunciation: 'oh' },
  { letter: 'Ϣ', name: 'Shai', sound: 'sh', pronunciation: 'sh' },
  { letter: 'Ϥ', name: 'Fai', sound: 'f', pronunciation: 'f' },
  { letter: 'Ϧ', name: 'Khai', sound: 'kh', pronunciation: 'kh' },
  { letter: 'Ϩ', name: 'Hori', sound: 'h', pronunciation: 'h' },
  { letter: 'Ϫ', name: 'Janja', sound: 'j', pronunciation: 'j' },
  { letter: 'Ϭ', name: 'Chima', sound: 'ch', pronunciation: 'ch' },
  { letter: 'Ϯ', name: 'Ti', sound: 'ti', pronunciation: 'tee' },
];

export const copticWords: CopticWord[] = [
  // Easy words (2-3 letters)
  { coptic: 'ⲁⲃ', english: 'heart', pronunciation: 'ah-v', difficulty: 'easy' },
  { coptic: 'ⲙⲁ', english: 'place', pronunciation: 'mah', difficulty: 'easy' },
  { coptic: 'ⲣⲟ', english: 'mouth', pronunciation: 'roh', difficulty: 'easy' },
  { coptic: 'ϩⲟ', english: 'face', pronunciation: 'hoh', difficulty: 'easy' },
  { coptic: 'ⲛⲁ', english: 'mercy', pronunciation: 'nah', difficulty: 'easy' },
  { coptic: 'ⲡⲓ', english: 'the (m)', pronunciation: 'pee', difficulty: 'easy' },
  { coptic: 'ϯ', english: 'the (f)', pronunciation: 'tee', difficulty: 'easy' },
  { coptic: 'ⲣⲁ', english: 'sun', pronunciation: 'rah', difficulty: 'easy' },
  
  // Medium words (4-5 letters)
  { coptic: 'ⲛⲟⲩϯ', english: 'god', pronunciation: 'noo-tee', difficulty: 'medium' },
  { coptic: 'ⲁⲅⲅⲉⲗⲟⲥ', english: 'angel', pronunciation: 'an-ge-los', difficulty: 'medium' },
  { coptic: 'ϣⲏⲣⲉ', english: 'son', pronunciation: 'shee-reh', difficulty: 'medium' },
  { coptic: 'ⲙⲁⲓ', english: 'mother', pronunciation: 'my', difficulty: 'medium' },
  { coptic: 'ⲙⲏⲓ', english: 'walk', pronunciation: 'mee', difficulty: 'medium' },
  { coptic: 'ⲥⲟⲛ', english: 'brother', pronunciation: 'son', difficulty: 'medium' },
  { coptic: 'ⲥⲱⲛⲉ', english: 'sister', pronunciation: 'so-neh', difficulty: 'medium' },
  { coptic: 'ⲟⲩⲱⲙ', english: 'eat', pronunciation: 'oo-ohm', difficulty: 'medium' },
  
  // Hard words (6+ letters)
  { coptic: 'ϩⲓⲣⲏⲛⲏ', english: 'peace', pronunciation: 'hee-ree-nee', difficulty: 'hard' },
  { coptic: 'ⲙⲉⲧⲁⲛⲟⲓⲁ', english: 'repentance', pronunciation: 'meh-ta-noy-ah', difficulty: 'hard' },
  { coptic: 'ⲁⲅⲁⲡⲏ', english: 'love', pronunciation: 'ah-ga-pee', difficulty: 'hard' },
  { coptic: 'ⲡⲓⲥⲧⲓⲥ', english: 'faith', pronunciation: 'pees-tees', difficulty: 'hard' },
  { coptic: 'ⲉⲕⲕⲗⲏⲥⲓⲁ', english: 'church', pronunciation: 'ek-klee-see-ah', difficulty: 'hard' },
  { coptic: 'ⲉⲩⲭⲁⲣⲓⲥⲧⲓⲁ', english: 'thanksgiving', pronunciation: 'ev-kha-rees-tee-ah', difficulty: 'hard' },
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
