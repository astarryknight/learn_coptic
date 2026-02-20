import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Header } from './components/Header';
import { ActivitySelector, ActivityType } from './components/ActivitySelector';
import { AdminDashboard } from './components/AdminDashboard';
import { OrganizationSelector } from './components/OrganizationSelector';
import { LetterSoundsActivity } from './components/activities/LetterSoundsActivity';
import { WordPronunciationActivity } from './components/activities/WordPronunciationActivity';
import { LetterRecognitionActivity } from './components/activities/LetterRecognitionActivity';
import { CompletionScreen } from './components/CompletionScreen';
import { Leaderboard } from './components/Leaderboard';
import {
  addXP,
  ensureUserProfileFromAuth,
  setUserOrganization,
  subscribeToOrganizations,
  subscribeToUserProfile,
  type Organization,
} from './utils/storage';
import type { UserProfile } from './utils/storage';
import { auth, signInWithGoogle, signOutUser } from './utils/firebase';

type Screen = 'welcome' | 'organization' | 'activities' | 'activity' | 'completion' | 'admin';
const ADMIN_EMAILS = new Set(['whiteh4tter@gmail.com']);

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [lastXPEarned, setLastXPEarned] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isSavingOrganization, setIsSavingOrganization] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const isAdmin = user?.email ? ADMIN_EMAILS.has(user.email.toLowerCase()) : false;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        setCurrentScreen('welcome');
        setIsAuthLoading(false);
        return;
      }

      try {
        const profile = await ensureUserProfileFromAuth(authUser);
        setUser(profile);
        const userIsAdmin = profile.email
          ? ADMIN_EMAILS.has(profile.email.toLowerCase())
          : false;
        if (userIsAdmin) {
          setCurrentScreen('admin');
        } else {
          setCurrentScreen(profile.organizationId ? 'activities' : 'organization');
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setUser(null);
        setCurrentScreen('welcome');
      } finally {
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribeOrganizations = subscribeToOrganizations((nextOrganizations) => {
      setOrganizations(nextOrganizations);
    });

    return () => unsubscribeOrganizations();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribeProfile = subscribeToUserProfile(user.uid, (profile) => {
      if (profile) {
        setUser(profile);
      }
    });

    return () => unsubscribeProfile();
  }, [user?.uid]);

  const handleStartApp = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSelectActivity = (activity: ActivityType) => {
    setCurrentActivity(activity);
    setCurrentScreen('activity');
  };

  const handleSelectOrganization = async (organization: Organization) => {
    if (!user) return;

    try {
      setIsSavingOrganization(true);
      const updatedUser = await setUserOrganization(user.uid, organization.id, organization.name);
      setUser(updatedUser);
      setCurrentScreen('activities');
    } catch (error) {
      console.error('Failed to set organization:', error);
    } finally {
      setIsSavingOrganization(false);
    }
  };

  const handleActivityComplete = async (xpEarned: number) => {
    if (user && currentActivity) {
      const updatedUser = await addXP(user.uid, xpEarned);
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

  const handleSignOut = async () => {
    await signOutUser();
    setShowLeaderboard(false);
    setCurrentActivity(null);
    setCurrentScreen('welcome');
  };

  const handleShowAdmin = () => {
    setShowLeaderboard(false);
    setCurrentActivity(null);
    setCurrentScreen('admin');
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
      {isAuthLoading && (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <p className="text-slate-700 text-lg">Loading account...</p>
        </div>
      )}

      {!isAuthLoading && currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStartApp} isLoading={isSigningIn} />
      )}

      {!isAuthLoading && currentScreen === 'organization' && (
        <OrganizationSelector
          organizations={organizations}
          isSaving={isSavingOrganization}
          onSelect={handleSelectOrganization}
        />
      )}

      {!isAuthLoading && currentScreen === 'activities' && (
        <>
          <Header
            user={user}
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onShowAdmin={isAdmin ? handleShowAdmin : undefined}
            showAdminButton={isAdmin}
            onSignOut={handleSignOut}
          />
          <ActivitySelector onSelectActivity={handleSelectActivity} />
        </>
      )}

      {!isAuthLoading && currentScreen === 'admin' && isAdmin && (
        <AdminDashboard
          onBack={() => setCurrentScreen('activities')}
          organizations={organizations}
        />
      )}

      {!isAuthLoading && currentScreen === 'activity' && renderActivity()}

      {!isAuthLoading && currentScreen === 'completion' && (
        <CompletionScreen
          xpEarned={lastXPEarned}
          onContinue={handleContinuePractice}
          onHome={handleBackToActivities}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          onClose={() => setShowLeaderboard(false)}
          organizationId={user?.organizationId || ''}
          organizationName={user?.organizationName || ''}
        />
      )}
    </div>
  );
}
