import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { ActivitySelector, ActivityType } from './components/ActivitySelector';
import { LetterSoundsActivity } from './components/activities/LetterSoundsActivity';
import { WordPronunciationActivity } from './components/activities/WordPronunciationActivity';
import { LetterRecognitionActivity } from './components/activities/LetterRecognitionActivity';
import { CompletionScreen } from './components/CompletionScreen';
import { Leaderboard } from './components/Leaderboard';
import {
  getUserProfile,
  createUserProfile,
  addXP,
  UserProfile,
} from './utils/storage';

type Screen = 'welcome' | 'activities' | 'activity' | 'completion';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [lastXPEarned, setLastXPEarned] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const existingUser = getUserProfile();
    if (existingUser) {
      setUser(existingUser);
      setCurrentScreen('activities');
    }
  }, []);

  const handleStartApp = (name: string) => {
    const profile = createUserProfile(name);
    setUser(profile);
    setCurrentScreen('activities');
  };

  const handleSelectActivity = (activity: ActivityType) => {
    setCurrentActivity(activity);
    setCurrentScreen('activity');
  };

  const handleActivityComplete = (xpEarned: number) => {
    if (user) {
      const activityNames = {
        'letter-sounds': 'Letter Sounds',
        'word-pronunciation': 'Word Pronunciation',
        'letter-recognition': 'Letter Recognition',
      };
      
      const updatedUser = addXP(xpEarned, activityNames[currentActivity!]);
      setUser(updatedUser);
      setLastXPEarned(xpEarned);
      setCurrentScreen('completion');
    }
  };

  const handleContinuePractice = () => {
    setCurrentScreen('activity');
  };

  const handleBackToActivities = () => {
    setCurrentActivity(null);
    setCurrentScreen('activities');
  };

  const renderActivity = () => {
    const commonProps = {
      onComplete: handleActivityComplete,
      onBack: handleBackToActivities,
    };

    switch (currentActivity) {
      case 'letter-sounds':
        return <LetterSoundsActivity {...commonProps} />;
      case 'word-pronunciation':
        return <WordPronunciationActivity {...commonProps} />;
      case 'letter-recognition':
        return <LetterRecognitionActivity {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStartApp} />
      )}

      {currentScreen === 'activities' && (
        <>
          <Header user={user} onShowLeaderboard={() => setShowLeaderboard(true)} />
          <ActivitySelector onSelectActivity={handleSelectActivity} />
        </>
      )}

      {currentScreen === 'activity' && renderActivity()}

      {currentScreen === 'completion' && (
        <CompletionScreen
          xpEarned={lastXPEarned}
          onContinue={handleContinuePractice}
          onHome={handleBackToActivities}
        />
      )}

      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}
