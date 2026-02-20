// LocalStorage utilities for user progress and leaderboard

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  createdAt: string;
  lastActive: string;
}

export interface LeaderboardEntry {
  name: string;
  xp: number;
  weekStart: string;
}

export interface ActivityHistory {
  activityType: string;
  xpEarned: number;
  timestamp: string;
}

const USER_KEY = 'coptic_user_profile';
const LEADERBOARD_KEY = 'coptic_leaderboard';
const HISTORY_KEY = 'coptic_activity_history';

// Get the start of the current week (Sunday)
export function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek; // Days since Sunday
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
}

// User Profile Management
export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

export function createUserProfile(name: string): UserProfile {
  const profile: UserProfile = {
    name,
    xp: 0,
    level: 1,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
  return profile;
}

export function updateUserProfile(updates: Partial<UserProfile>): UserProfile {
  const profile = getUserProfile();
  if (!profile) throw new Error('No user profile found');
  
  const updated = {
    ...profile,
    ...updates,
    lastActive: new Date().toISOString(),
  };
  
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

export function addXP(amount: number, activityType: string): UserProfile {
  const profile = getUserProfile();
  if (!profile) throw new Error('No user profile found');
  
  const newXP = profile.xp + amount;
  const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
  
  const updated = updateUserProfile({
    xp: newXP,
    level: newLevel,
  });
  
  // Update leaderboard
  updateLeaderboard(profile.name, amount);
  
  // Add to activity history
  addActivityHistory(activityType, amount);
  
  return updated;
}

// Leaderboard Management
export function getLeaderboard(): LeaderboardEntry[] {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  if (!data) return [];
  
  const leaderboard: LeaderboardEntry[] = JSON.parse(data);
  const currentWeekStart = getWeekStart();
  
  // Filter to only show current week's entries
  return leaderboard
    .filter(entry => entry.weekStart === currentWeekStart)
    .sort((a, b) => b.xp - a.xp);
}

export function updateLeaderboard(name: string, xpToAdd: number): void {
  const leaderboard = getAllLeaderboardEntries();
  const currentWeekStart = getWeekStart();
  
  const existingIndex = leaderboard.findIndex(
    entry => entry.name === name && entry.weekStart === currentWeekStart
  );
  
  if (existingIndex !== -1) {
    leaderboard[existingIndex].xp += xpToAdd;
  } else {
    leaderboard.push({
      name,
      xp: xpToAdd,
      weekStart: currentWeekStart,
    });
  }
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

function getAllLeaderboardEntries(): LeaderboardEntry[] {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

// Activity History
export function getActivityHistory(): ActivityHistory[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function addActivityHistory(activityType: string, xpEarned: number): void {
  const history = getActivityHistory();
  history.push({
    activityType,
    xpEarned,
    timestamp: new Date().toISOString(),
  });
  
  // Keep only last 50 activities
  if (history.length > 50) {
    history.splice(0, history.length - 50);
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Reset weekly leaderboard (can be called manually or on a schedule)
export function resetWeeklyLeaderboard(): void {
  const leaderboard = getAllLeaderboardEntries();
  const currentWeekStart = getWeekStart();
  
  // Remove old entries (keep last 4 weeks for reference)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  
  const filtered = leaderboard.filter(entry => {
    const entryDate = new Date(entry.weekStart);
    return entryDate >= fourWeeksAgo;
  });
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(filtered));
}
