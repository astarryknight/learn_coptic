import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { organizations } from '../data/organizations';
import type { OrganizationOption } from '../data/organizations';
import {
  assignUserToOrganization,
  subscribeToAllUsers,
  type UserProfile,
} from '../utils/storage';

interface AdminDashboardProps {
  onBack: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [draftOrganizationByUser, setDraftOrganizationByUser] = useState<Record<string, string>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers((profiles) => {
      setUsers(profiles);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      const email = user.email || '';
      const organization = user.organizationName || '';
      return (
        user.name.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        organization.toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  const selectedUser = useMemo(
    () => filteredUsers.find((user) => user.uid === selectedUserId) || filteredUsers[0] || null,
    [filteredUsers, selectedUserId],
  );

  const getDraftOrganizationId = (user: UserProfile) =>
    draftOrganizationByUser[user.uid] ?? user.organizationId ?? '';

  const handleDraftChange = (uid: string, organizationId: string) => {
    setDraftOrganizationByUser((prev) => ({ ...prev, [uid]: organizationId }));
  };

  const handleSaveOrganization = async (user: UserProfile) => {
    const organizationId = getDraftOrganizationId(user);
    if (!organizationId) return;

    const organization = organizations.find((org) => org.id === organizationId);
    if (!organization) return;

    try {
      setSavingUserId(user.uid);
      await assignUserToOrganization(user.uid, organization.id, organization.name);
    } catch (error) {
      console.error('Failed to assign organization:', error);
    } finally {
      setSavingUserId(null);
    }
  };

  const currentOrganization = (user: UserProfile): OrganizationOption | null =>
    organizations.find((org) => org.id === getDraftOrganizationId(user)) || null;

  const progressPercent = selectedUser ? (selectedUser.xp % 100) : 0;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-slate-600">
              Manage organization membership and review user progress.
            </p>
          </div>
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="w-full md:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 p-4 md:p-5 bg-white">
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-4">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, or organization"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            {loading ? (
              <p className="text-slate-500">Loading users...</p>
            ) : null}

            {!loading && filteredUsers.length === 0 ? (
              <p className="text-slate-500">No users found.</p>
            ) : null}

            {!loading && filteredUsers.length > 0 ? (
              <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                {filteredUsers.map((user) => {
                  const organization = currentOrganization(user);
                  const isSaving = savingUserId === user.uid;
                  return (
                    <div
                      key={user.uid}
                      className={`rounded-xl border p-3 md:p-4 ${
                        selectedUser?.uid === user.uid ? 'border-slate-500 bg-slate-50' : 'border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedUserId(user.uid)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="size-10 border border-slate-200">
                            <AvatarImage src={user.photoURL || undefined} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email || 'No email'}</p>
                          </div>
                        </div>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                        <select
                          value={getDraftOrganizationId(user)}
                          onChange={(event) => handleDraftChange(user.uid, event.target.value)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        >
                          <option value="" disabled>Select organization</option>
                          {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                        </select>

                        <Button
                          type="button"
                          onClick={() => void handleSaveOrganization(user)}
                          disabled={isSaving || !organization}
                          className="bg-slate-700 hover:bg-slate-800"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </Card>

          <Card className="p-4 md:p-5 bg-white">
            {!selectedUser ? (
              <div className="text-slate-500">
                Select a user to view progress.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border border-slate-200">
                    <AvatarImage src={selectedUser.photoURL || undefined} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-800 truncate">{selectedUser.name}</h2>
                    <p className="text-xs text-slate-500 truncate">{selectedUser.email || 'No email'}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Organization</p>
                  <p className="font-semibold text-slate-800">
                    {selectedUser.organizationName || 'Not assigned'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">XP</p>
                    <p className="font-bold text-xl text-slate-800">{selectedUser.xp}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Level</p>
                    <p className="font-bold text-xl text-slate-800">{selectedUser.level}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Progress to next level</p>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-slate-500 mt-2">{progressPercent}/100 XP</p>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
                    <p className="text-sm text-slate-800">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Last active</p>
                    <p className="text-sm text-slate-800">{formatDate(selectedUser.lastActive)}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-900 text-white p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4" />
                    <p className="font-semibold text-sm">Admin Access</p>
                  </div>
                  <p className="text-xs text-slate-200">
                    This dashboard is only visible to authorized admin accounts.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
