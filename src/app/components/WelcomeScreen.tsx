import { FormEvent, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';

type EmailMode = 'signin' | 'signup';

interface WelcomeScreenProps {
  onGoogleStart: () => Promise<void>;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  authError: string | null;
  onClearError: () => void;
}

export function WelcomeScreen({
  onGoogleStart,
  onEmailSignIn,
  onEmailSignUp,
  isLoading,
  authError,
  onClearError,
}: WelcomeScreenProps) {
  const [emailMode, setEmailMode] = useState<EmailMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSignUp = emailMode === 'signup';

  const localValidationError = useMemo(() => {
    if (!email || !password) return 'Email and password are required.';
    if (isSignUp && !name.trim()) return 'Name is required for sign up.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  }, [email, isSignUp, name, password]);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (localValidationError) return;

    if (isSignUp) {
      await onEmailSignUp(name.trim(), email.trim(), password);
      return;
    }

    await onEmailSignIn(email.trim(), password);
  };

  const switchMode = (mode: EmailMode) => {
    setEmailMode(mode);
    onClearError();
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

        <div className="space-y-3">
          <Button
            type="button"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white py-6 text-lg font-bold"
            onClick={() => void onGoogleStart()}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
            <div className="h-px bg-slate-200 flex-1" />
            <span>Or use email</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={isSignUp ? 'outline' : 'default'}
              className={isSignUp ? '' : 'bg-slate-700 hover:bg-slate-800'}
              onClick={() => switchMode('signin')}
              disabled={isLoading}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={isSignUp ? 'default' : 'outline'}
              className={isSignUp ? 'bg-slate-700 hover:bg-slate-800' : ''}
              onClick={() => switchMode('signup')}
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </div>

          <form className="space-y-2 text-left" onSubmit={(event) => void handleEmailSubmit(event)}>
            {isSignUp ? (
              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  onClearError();
                }}
                placeholder="Full name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                disabled={isLoading}
              />
            ) : null}
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                onClearError();
              }}
              placeholder="Email"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              disabled={isLoading}
            />
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                onClearError();
              }}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              disabled={isLoading}
            />

            {localValidationError ? (
              <p className="text-xs text-amber-700">{localValidationError}</p>
            ) : null}
            {authError ? (
              <p className="text-xs text-red-700">{authError}</p>
            ) : null}

            <Button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-800"
              disabled={isLoading || !!localValidationError}
            >
              {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
        </div>

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
