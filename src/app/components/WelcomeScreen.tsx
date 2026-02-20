import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700 rounded-full mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-slate-800">
            Learn Coptic!
          </h1>
          <p className="text-gray-600 text-lg">
            Practice letters and words while earning XP!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-left mb-2 font-semibold text-gray-700">
              What's your name?
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="text-center text-lg"
              maxLength={20}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white py-6 text-lg font-bold"
            disabled={!name.trim()}
          >
            Start Learning! ✨
          </Button>
        </form>

        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-2xl mb-1">🎯</div>
            <div className="font-semibold text-slate-700">Activities</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-semibold text-slate-700">Earn XP</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-semibold text-slate-700">Compete</div>
          </div>
        </div>
      </div>
    </div>
  );
}