import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { copticWords, getRandomItems, shuffleArray, CopticWord } from '../../data/copticData';

interface WordPronunciationActivityProps {
  onComplete: (xpEarned: number) => void;
  onBack: () => void;
}

export function WordPronunciationActivity({ onComplete, onBack }: WordPronunciationActivityProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState<CopticWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const TOTAL_ROUNDS = 5;

  useEffect(() => {
    setupRound();
  }, []);

  const setupRound = () => {
    const word = getRandomItems(copticWords, 1)[0];
    const wrongOptions = getRandomItems(
      copticWords.filter(w => w.pronunciation !== word.pronunciation),
      3
    );
    
    const allOptions = shuffleArray([
      word.pronunciation,
      ...wrongOptions.map(w => w.pronunciation)
    ]);

    setCurrentWord(word);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentWord?.pronunciation;
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

  if (!currentWord) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6">
      <div className="max-w-2xl mx-auto">
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
            How do you pronounce this word?
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6">Choose the correct pronunciation</p>

          <motion.div
            key={currentWord.coptic}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-5 md:mb-8"
          >
            <div className="inline-block bg-slate-700 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg max-w-full">
              <div className="text-5xl sm:text-6xl md:text-7xl mb-3 md:mb-4 text-white font-bold break-all">
                {currentWord.coptic}
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 inline-block">
                <div className="text-white text-base md:text-lg font-semibold">
                  {currentWord.english}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-2.5 md:gap-3">
            {options.map((option, index) => (
              <motion.button
                key={`${option}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`p-4 md:p-5 rounded-xl border-2 text-lg md:text-xl font-bold transition-all ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-white border-gray-200 hover:border-slate-400 hover:bg-slate-50'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="break-all text-left">{option}</span>
                  {selectedAnswer === option && (
                    <div className="ml-2 flex-shrink-0">
                      {isCorrect ? (
                        <Check className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 md:mt-6 p-3 md:p-4 rounded-lg ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <p className="font-bold text-base md:text-lg">
                {isCorrect ? '🎉 Excellent!' : '❌ Try again!'}
              </p>
              {!isCorrect && (
                <p className="text-sm mt-1 break-all">
                  The correct pronunciation is: <strong>{currentWord.pronunciation}</strong>
                </p>
              )}
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}