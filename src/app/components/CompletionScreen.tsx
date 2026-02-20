import { motion } from 'motion/react';
import { Trophy, Star, ArrowRight, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface CompletionScreenProps {
  xpEarned: number;
  onContinue: () => void;
  onHome: () => void;
}

export function CompletionScreen({ xpEarned, onContinue, onHome }: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center bg-white/90 backdrop-blur">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-700 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold mb-2 text-slate-800"
        >
          Amazing Work!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          You completed the activity!
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-slate-700 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Star className="w-8 h-8 fill-yellow-300 text-yellow-300" />
            <span className="text-5xl font-bold text-white">{xpEarned}</span>
            <span className="text-2xl font-bold text-white">XP</span>
          </div>
          <p className="text-white/90">earned this round!</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={onContinue}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white py-6 text-lg font-bold"
          >
            Practice More
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            onClick={onHome}
            variant="outline"
            className="w-full py-6 text-lg font-bold"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Activities
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-3xl"
        >
          {xpEarned >= 10 ? '🌟' : ''}
          {xpEarned >= 8 ? '✨' : ''}
          {xpEarned >= 5 ? '⭐' : ''}
          {xpEarned < 5 ? '👍' : ''}
        </motion.div>
      </Card>
    </div>
  );
}