import { Trophy, Star, User } from 'lucide-react';
import { UserProfile } from '../utils/storage';

interface HeaderProps {
  user: UserProfile | null;
  onShowLeaderboard: () => void;
}

export function Header({ user, onShowLeaderboard }: HeaderProps) {
  if (!user) return null;

  return (
    <header className="bg-slate-800 text-white p-3 md:p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 md:p-2 flex-shrink-0">
            <User className="w-4 h-4 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm md:text-lg truncate">{user.name}</h2>
            <p className="text-xs md:text-sm text-white/90">Level {user.level}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-2 md:px-4 py-1.5 md:py-2">
            <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-300 text-yellow-300" />
            <span className="font-bold text-sm md:text-base">{user.xp}</span>
            <span className="hidden sm:inline text-sm md:text-base">XP</span>
          </div>

          <button
            onClick={onShowLeaderboard}
            className="flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-2 md:px-4 py-1.5 md:py-2 hover:bg-white/30 transition-colors"
          >
            <Trophy className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-bold text-xs md:text-base hidden sm:inline">Leaderboard</span>
          </button>
        </div>
      </div>
    </header>
  );
}