import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, RotateCcw, Star, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { copticWords, CopticWord, getRandomItems, shuffleArray } from '../../data/copticData';

interface WordBuilderActivityProps {
  onComplete: (xpEarned: number) => void;
  onBack: () => void;
}

interface SoundToken {
  id: string;
  text: string;
}

const TOTAL_ROUNDS = 5;

function splitPronunciation(pronunciation: string): string[] {
  const spacedParts = pronunciation
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (spacedParts.length > 1) {
    return spacedParts;
  }

  return pronunciation
    .split('-')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function WordBuilderActivity({ onComplete, onBack }: WordBuilderActivityProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState<CopticWord | null>(null);
  const [correctParts, setCorrectParts] = useState<string[]>([]);
  const [bankTokens, setBankTokens] = useState<SoundToken[]>([]);
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const allSoundParts = useMemo(
    () =>
      copticWords.flatMap((word) => splitPronunciation(word.pronunciation)).filter(Boolean),
    []
  );

  useEffect(() => {
    setupRound();
  }, []);

  const setupRound = () => {
    const nextWord = getRandomItems(copticWords, 1)[0];
    const parts = splitPronunciation(nextWord.pronunciation);
    const uniqueCorrectParts = new Set(parts);
    const wrongPartsPool = allSoundParts.filter((part) => !uniqueCorrectParts.has(part));
    const wrongCount = Math.max(3, Math.ceil(parts.length / 2));
    const wrongParts = getRandomItems([...new Set(wrongPartsPool)], wrongCount);

    const combinedTokens = shuffleArray([...parts, ...wrongParts]).map((text, index) => ({
      id: `${index}-${text}`,
      text,
    }));

    setCurrentWord(nextWord);
    setCorrectParts(parts);
    setBankTokens(combinedTokens);
    setSelectedTokenIds([]);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const selectedTokens = selectedTokenIds
    .map((id) => bankTokens.find((token) => token.id === id))
    .filter((token): token is SoundToken => Boolean(token));

  const canSelectMore = selectedTokenIds.length < correctParts.length;

  const handleToggleToken = (tokenId: string) => {
    if (showFeedback) return;

    const isSelected = selectedTokenIds.includes(tokenId);
    if (isSelected) {
      setSelectedTokenIds(selectedTokenIds.filter((id) => id !== tokenId));
      return;
    }

    if (!canSelectMore) return;
    setSelectedTokenIds([...selectedTokenIds, tokenId]);
  };

  const handleSubmit = () => {
    if (showFeedback || selectedTokens.length !== correctParts.length) return;

    const answerParts = selectedTokens.map((token) => token.text);
    const correct = answerParts.every((part, index) => part === correctParts[index]);

    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentRound + 1 >= TOTAL_ROUNDS) {
        const xpEarned = score * 3 + (correct ? 3 : 0);
        onComplete(xpEarned);
      } else {
        setCurrentRound(currentRound + 1);
        setupRound();
      }
    }, 2000);
  };

  const handleClear = () => {
    if (showFeedback) return;
    setSelectedTokenIds([]);
  };

  if (!currentWord) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2 text-xs md:text-sm h-8 md:h-10"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 md:gap-2 bg-white rounded-full px-2 md:px-4 py-1 md:py-2 shadow">
              <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-xs md:text-base">{score}/{currentRound + 1}</span>
            </div>
            <div className="text-xs md:text-sm font-semibold text-gray-600">
              {currentRound + 1}/{TOTAL_ROUNDS}
            </div>
          </div>
        </div>

        <Card className="p-5 md:p-8 text-center bg-white/80 backdrop-blur">
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-slate-700">
            Build the word sounds
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6">
            Tap sounds from the bank in the correct order
          </p>

          <motion.div
            key={currentWord.coptic}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-5 md:mb-8"
          >
            <div className="inline-block bg-slate-700 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg max-w-full">
              <div className="coptic-text text-5xl sm:text-6xl md:text-7xl mb-3 md:mb-4 text-white font-bold break-all">
                {currentWord.coptic}
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 inline-block">
                <div className="text-white text-base md:text-lg font-semibold">
                  {currentWord.english}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mb-4 md:mb-5">
            <div className="text-sm font-semibold text-slate-600 mb-2">Your answer</div>
            <div className="flex items-center justify-start sm:justify-center gap-1.5 md:gap-2 overflow-x-auto pb-1">
              {Array.from({ length: correctParts.length }).map((_, index) => {
                const selected = selectedTokens[index];
                return (
                  <div
                    key={index}
                    className={`w-10 h-9 md:w-12 md:h-10 rounded-md border-2 flex-shrink-0 flex items-center justify-center text-xs md:text-sm font-bold ${
                      selected ? 'bg-slate-50 border-slate-400 text-slate-800' : 'bg-white border-dashed border-slate-300 text-slate-400'
                    }`}
                  >
                    {selected?.text || '...'}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-5">
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              disabled={selectedTokenIds.length === 0 || showFeedback}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedTokens.length !== correctParts.length || showFeedback}
              size="sm"
            >
              Check Answer
            </Button>
          </div>

          <div className="text-sm font-semibold text-slate-600 mb-2">Sound bank</div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {bankTokens.map((token, index) => {
              const selected = selectedTokenIds.includes(token.id);
              return (
                <motion.button
                  key={token.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => handleToggleToken(token.id)}
                  disabled={showFeedback}
                  className={`min-w-16 px-3 py-2 rounded-lg border-2 text-sm md:text-base font-bold transition-all ${
                    selected
                      ? 'bg-slate-700 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-500'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {token.text}
                </motion.button>
              );
            })}
          </div>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 md:mt-6 p-3 md:p-4 rounded-lg ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <p className="font-bold text-base md:text-lg flex items-center justify-center gap-2">
                {isCorrect ? (
                  <>
                    <Check className="w-5 h-5" />
                    Correct order!
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    Not quite.
                  </>
                )}
              </p>
              {!isCorrect && (
                <p className="text-sm mt-1">
                  Correct sequence: <strong>{correctParts.join(' ')}</strong>
                </p>
              )}
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
