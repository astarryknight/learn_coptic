import type { User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  organizationId: string | null;
  organizationName: string | null;
  xp: number;
  level: number;
  createdAt: string;
  lastActive: string;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  photoURL: string | null;
  xp: number;
  level: number;
}

const USERS_COLLECTION = 'users';

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function mapUserProfile(uid: string, data: Record<string, unknown>): UserProfile {
  const xp = typeof data.xp === 'number' ? data.xp : 0;
  return {
    uid,
    name: typeof data.name === 'string' ? data.name : 'Learner',
    email: typeof data.email === 'string' ? data.email : null,
    photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
    organizationId: typeof data.organizationId === 'string' ? data.organizationId : null,
    organizationName: typeof data.organizationName === 'string' ? data.organizationName : null,
    xp,
    level: typeof data.level === 'number' ? data.level : calculateLevel(xp),
    createdAt: timestampToIso(data.createdAt),
    lastActive: timestampToIso(data.lastActive),
  };
}

function userDocRef(uid: string) {
  return doc(db, USERS_COLLECTION, uid);
}

export async function ensureUserProfileFromAuth(authUser: FirebaseUser): Promise<UserProfile> {
  const userRef = userDocRef(authUser.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    return mapUserProfile(existing.id, existing.data() as Record<string, unknown>);
  }

  const initialXP = 0;
  const profile = {
    name: authUser.displayName || 'Learner',
    email: authUser.email || null,
    photoURL: authUser.photoURL || null,
    organizationId: null,
    organizationName: null,
    xp: initialXP,
    level: calculateLevel(initialXP),
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  };

  await setDoc(userRef, profile);

  const created = await getDoc(userRef);
  return mapUserProfile(created.id, created.data() as Record<string, unknown>);
}

export function subscribeToUserProfile(
  uid: string,
  onUpdate: (profile: UserProfile | null) => void,
) {
  return onSnapshot(userDocRef(uid), (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate(null);
      return;
    }
    onUpdate(mapUserProfile(snapshot.id, snapshot.data() as Record<string, unknown>));
  });
}

export function subscribeToAllUsers(
  onUpdate: (profiles: UserProfile[]) => void,
) {
  const usersQuery = query(collection(db, USERS_COLLECTION));

  return onSnapshot(usersQuery, (snapshot) => {
    const profiles = snapshot.docs
      .map((entry) => mapUserProfile(entry.id, entry.data() as Record<string, unknown>))
      .sort((a, b) => a.name.localeCompare(b.name));
    onUpdate(profiles);
  });
}

export async function addXP(
  uid: string,
  amount: number,
): Promise<UserProfile> {
  const userRef = userDocRef(uid);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists()) {
      throw new Error('No user profile found');
    }

    const currentXP = typeof snapshot.data().xp === 'number' ? snapshot.data().xp : 0;
    const updatedXP = currentXP + amount;

    transaction.update(userRef, {
      xp: increment(amount),
      level: calculateLevel(updatedXP),
      lastActive: serverTimestamp(),
    });
  });

  const updated = await getDoc(userRef);
  if (!updated.exists()) throw new Error('No user profile found');
  return mapUserProfile(updated.id, updated.data() as Record<string, unknown>);
}

export async function setUserOrganization(
  uid: string,
  organizationId: string,
  organizationName: string,
): Promise<UserProfile> {
  const userRef = userDocRef(uid);

  await setDoc(
    userRef,
    {
      organizationId,
      organizationName,
      lastActive: serverTimestamp(),
    },
    { merge: true },
  );

  const updated = await getDoc(userRef);
  if (!updated.exists()) throw new Error('No user profile found');
  return mapUserProfile(updated.id, updated.data() as Record<string, unknown>);
}

export async function assignUserToOrganization(
  uid: string,
  organizationId: string,
  organizationName: string,
): Promise<UserProfile> {
  return setUserOrganization(uid, organizationId, organizationName);
}

function mapLeaderboardEntry(entryId: string, data: Record<string, unknown>): LeaderboardEntry {
  const xp = typeof data.xp === 'number' ? data.xp : 0;
  return {
    uid: entryId,
    name: typeof data.name === 'string' ? data.name : 'Learner',
    photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
    xp,
    level: typeof data.level === 'number' ? data.level : calculateLevel(xp),
  };
}

function sortAndTrimLeaderboard(entries: LeaderboardEntry[], limitCount: number) {
  return entries
    .sort((a, b) => b.xp - a.xp)
    .slice(0, limitCount);
}

export async function getLeaderboard(
  organizationId: string,
  limitCount = 100,
): Promise<LeaderboardEntry[]> {
  const leaderboardQuery = query(
    collection(db, USERS_COLLECTION),
    where('organizationId', '==', organizationId),
  );
  const snapshots = await getDocs(leaderboardQuery);

  const entries = snapshots.docs.map((entry) =>
    mapLeaderboardEntry(entry.id, entry.data() as Record<string, unknown>),
  );
  return sortAndTrimLeaderboard(entries, limitCount);
}

export function subscribeToLeaderboard(
  organizationId: string,
  onUpdate: (entries: LeaderboardEntry[]) => void,
  limitCount = 100,
) {
  const leaderboardQuery = query(
    collection(db, USERS_COLLECTION),
    where('organizationId', '==', organizationId),
  );

  return onSnapshot(leaderboardQuery, (snapshot) => {
    const entries = snapshot.docs.map((entry) =>
      mapLeaderboardEntry(entry.id, entry.data() as Record<string, unknown>),
    );
    onUpdate(sortAndTrimLeaderboard(entries, limitCount));
  });
}
