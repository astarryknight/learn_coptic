import { BookOpen, Volume2, Eye, Award } from 'lucide-react';
import { Card } from './ui/card';

export type ActivityType = 'letter-sounds' | 'word-pronunciation' | 'letter-recognition';

interface ActivitySelectorProps {
  onSelectActivity: (activity: ActivityType) => void;
}

export function ActivitySelector({ onSelectActivity }: ActivitySelectorProps) {
  const activities = [
    {
      id: 'letter-sounds' as ActivityType,
      title: 'Letter Sounds',
      description: 'Match Coptic letters with their sounds',
      icon: Volume2,
      color: 'from-blue-400 to-blue-600',
      xp: '+10 XP per round',
    },
    {
      id: 'word-pronunciation' as ActivityType,
      title: 'Word Practice',
      description: 'Learn how to pronounce Coptic words',
      icon: BookOpen,
      color: 'from-green-400 to-green-600',
      xp: '+15 XP per round',
    },
    {
      id: 'letter-recognition' as ActivityType,
      title: 'Letter Match',
      description: 'Identify the correct Coptic letter',
      icon: Eye,
      color: 'from-purple-400 to-purple-600',
      xp: '+10 XP per round',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-slate-800">
            Choose an Activity
          </h1>
          <p className="text-gray-600 text-lg">
            Practice and earn XP to climb the leaderboard!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Card
                key={activity.id}
                className="cursor-pointer hover:scale-105 transition-transform duration-200 overflow-hidden border-2 hover:border-slate-400"
                onClick={() => onSelectActivity(activity.id)}
              >
                <div className={`bg-gradient-to-br ${activity.color} p-6 text-white`}>
                  <Icon className="w-12 h-12 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Award className="w-4 h-4" />
                    {activity.xp}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}