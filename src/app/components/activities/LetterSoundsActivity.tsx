import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, X, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { copticAlphabet, getRandomItems, shuffleArray, CopticLetter } from '../../data/copticData';

interface LetterSoundsActivityProps {
  onComplete: (xpEarned: number) => void;
  onBack: () => void;
}

export function LetterSoundsActivity({ onComplete, onBack }: LetterSoundsActivityProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLetter, setCurrentLetter] = useState<CopticLetter | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const TOTAL_ROUNDS = 5;

  useEffect(() => {
    setupRound();
  }, []);

  const setupRound = () => {
    const letter = getRandomItems(copticAlphabet, 1)[0];
    const wrongOptions = getRandomItems(
      copticAlphabet.filter(l => l.sound !== letter.sound),
      3
    );
    
    const allOptions = shuffleArray([
      letter.sound,
      ...wrongOptions.map(l => l.sound)
    ]);

    setCurrentLetter(letter);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentLetter?.sound;
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

  if (!currentLetter) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
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
            What sound does this letter make?
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-8">Listen to the name and choose the sound</p>

          <motion.div
            key={currentLetter.letter}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-5 md:mb-8"
          >
            <div className="inline-block bg-slate-700 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg">
              <div className="coptic-text text-6xl md:text-8xl mb-3 md:mb-4 text-white font-bold">
                {currentLetter.letter}
              </div>
              <div className="text-white text-lg md:text-xl font-semibold">
                {currentLetter.name}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {options.map((option, index) => (
              <motion.button
                key={`${option}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`p-4 md:p-6 rounded-xl border-2 text-xl md:text-2xl font-bold transition-all ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-white border-gray-200 hover:border-slate-400 hover:bg-slate-50'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer === option && (
                    <div>
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
                {isCorrect ? '🎉 Correct!' : '❌ Not quite!'}
              </p>
              {!isCorrect && (
                <p className="text-sm mt-1">
                  The correct answer is: <strong>{currentLetter.sound}</strong>
                </p>
              )}
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
}
