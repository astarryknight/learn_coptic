import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { copticAlphabet, getRandomItems, shuffleArray, CopticLetter } from '../../data/copticData';

interface LetterRecognitionActivityProps {
  onComplete: (xpEarned: number) => void;
  onBack: () => void;
}

export function LetterRecognitionActivity({ onComplete, onBack }: LetterRecognitionActivityProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [targetLetter, setTargetLetter] = useState<CopticLetter | null>(null);
  const [options, setOptions] = useState<CopticLetter[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const TOTAL_ROUNDS = 5;

  useEffect(() => {
    setupRound();
  }, []);

  const setupRound = () => {
    const target = getRandomItems(copticAlphabet, 1)[0];
    const wrongOptions = getRandomItems(
      copticAlphabet.filter(l => l.letter !== target.letter),
      3
    );
    
    const allOptions = shuffleArray([target, ...wrongOptions]);

    setTargetLetter(target);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleAnswer = (letter: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(letter);
    const correct = letter === targetLetter?.letter;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentRound + 1 >= TOTAL_ROUNDS) {
        const xpEarned = score * 2 + (correct ? 2 : 0);
        onComplete(xpEarned);
      } else {
        setCurrentRound(currentRound + 1);
        setupRound();
      }
    }, 1500);
  };

  if (!targetLetter) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4 md:mb-6">
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
            Find the letter that makes this sound
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-8">Click on the correct Coptic letter</p>

          <motion.div
            key={targetLetter.name}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="mb-5 md:mb-8"
          >
            <div className="inline-block bg-slate-700 rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg">
              <div className="text-white text-base md:text-xl font-semibold mb-2">
                {targetLetter.name}
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl px-5 md:px-6 py-3 md:py-4">
                <div className="text-white text-4xl md:text-5xl font-bold">
                  "{targetLetter.sound}"
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {options.map((option, index) => (
              <motion.button
                key={`${option.letter}-${index}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option.letter)}
                disabled={selectedAnswer !== null}
                className={`aspect-square p-4 md:p-6 rounded-xl md:rounded-2xl border-3 md:border-4 text-5xl md:text-6xl font-bold transition-all ${
                  selectedAnswer === option.letter
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 scale-110'
                      : 'bg-red-100 border-red-500'
                    : 'bg-white border-gray-200 hover:border-slate-400 hover:bg-slate-50 hover:scale-105'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div>{option.letter}</div>
                  {selectedAnswer === option.letter && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      {isCorrect ? (
                        <Check className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                      ) : (
                        <X className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                      )}
                    </motion.div>
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
                {isCorrect ? '🎉 Great job!' : '❌ Oops!'}
              </p>
              {!isCorrect && (
                <p className="text-sm mt-1">
                  The correct letter is: <strong>{targetLetter.letter} ({targetLetter.name})</strong>
                </p>
              )}
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}