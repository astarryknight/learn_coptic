import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { subscribeToLeaderboard } from '../utils/storage';
import type { LeaderboardEntry } from '../utils/storage';

interface LeaderboardProps {
  onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((entries) => {
      setLeaderboard(entries);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600 fill-orange-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center font-bold text-gray-500">{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-200 to-yellow-100 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-200 to-gray-100 border-gray-400';
      case 3:
        return 'bg-gradient-to-r from-orange-200 to-orange-100 border-orange-400';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/95 backdrop-blur p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Global Leaderboard
              </h2>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading leaderboard...</p>
            </div>
          ) : null}

          {!loading && leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No entries yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Complete activities to appear on the leaderboard
              </p>
            </div>
          ) : null}

          {!loading && leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={`${entry.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankColor(index + 1)}`}
                >
                  <div className="flex-shrink-0">
                    {getRankIcon(index + 1)}
                  </div>

                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <Avatar className="size-10 border border-gray-200">
                      <AvatarImage src={entry.photoURL || undefined} alt={entry.name} />
                      <AvatarFallback className="font-semibold">
                        {entry.name.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg truncate">{entry.name}</h3>
                      <p className="text-sm text-gray-600">Level {entry.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
                    <Trophy className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-lg">{entry.xp}</span>
                    <span className="text-sm text-gray-600">XP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : null}

          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-800 text-center">
              💡 <strong>Tip:</strong> Complete more activities to earn XP and climb the leaderboard!
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
