import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import {
  assignUserToOrganization,
  createOrganization,
  deleteOrganization,
  setUserOrgAdminScope,
  subscribeToAllUsers,
  subscribeToUsersByOrganization,
  updateOrganization,
  type Organization,
  type UserProfile,
} from '../utils/storage';

interface AdminDashboardProps {
  onBack: () => void;
  organizations: Organization[];
  currentUser: UserProfile | null;
  isFullAdmin: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function AdminDashboard({
  onBack,
  organizations,
  currentUser,
  isFullAdmin,
}: AdminDashboardProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [draftOrganizationByUser, setDraftOrganizationByUser] = useState<Record<string, string>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [savingOrgAdminUserId, setSavingOrgAdminUserId] = useState<string | null>(null);
  const [newOrganizationName, setNewOrganizationName] = useState('');
  const [newOrganizationDescription, setNewOrganizationDescription] = useState('');
  const [isCreatingOrganization, setIsCreatingOrganization] = useState(false);
  const [deletingOrganizationId, setDeletingOrganizationId] = useState<string | null>(null);
  const [orgDraftName, setOrgDraftName] = useState('');
  const [orgDraftDescription, setOrgDraftDescription] = useState('');
  const [savingManagedOrganizationId, setSavingManagedOrganizationId] = useState<string | null>(null);

  const adminOrganizationId = currentUser?.adminOrganizationId || '';

  const visibleOrganizations = useMemo(() => {
    if (isFullAdmin) return organizations;
    return organizations.filter((organization) => organization.id === adminOrganizationId);
  }, [adminOrganizationId, isFullAdmin, organizations]);
  const managedOrganization = visibleOrganizations[0] || null;

  useEffect(() => {
    if (isFullAdmin) return;
    setOrgDraftName(managedOrganization?.name || '');
    setOrgDraftDescription(managedOrganization?.description || '');
  }, [isFullAdmin, managedOrganization?.description, managedOrganization?.name]);

  useEffect(() => {
    setLoading(true);

    if (isFullAdmin) {
      const unsubscribe = subscribeToAllUsers((profiles) => {
        setUsers(profiles);
        setLoading(false);
      });
      return () => unsubscribe();
    }

    if (!adminOrganizationId) {
      setUsers([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUsersByOrganization(adminOrganizationId, (profiles) => {
      setUsers(profiles);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [adminOrganizationId, isFullAdmin]);

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

    const organization = visibleOrganizations.find((org) => org.id === organizationId);
    if (!organization) return;

    try {
      setSavingUserId(user.uid);
      await assignUserToOrganization(user.uid, organization.id, organization.name);

      // Keep org-admin scope aligned when a full admin moves an org admin to another org.
      if (isFullAdmin && user.adminOrganizationId && user.adminOrganizationId !== organization.id) {
        await setUserOrgAdminScope(user.uid, organization.id);
      }
    } catch (error) {
      console.error('Failed to assign organization:', error);
    } finally {
      setSavingUserId(null);
    }
  };

  const currentOrganization = (user: UserProfile): Organization | null =>
    organizations.find((org) => org.id === getDraftOrganizationId(user)) || null;

  const progressPercent = selectedUser ? (selectedUser.xp % 100) : 0;

  const handleCreateOrganization = async () => {
    try {
      setIsCreatingOrganization(true);
      await createOrganization(newOrganizationName, newOrganizationDescription);
      setNewOrganizationName('');
      setNewOrganizationDescription('');
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setIsCreatingOrganization(false);
    }
  };

  const handleDeleteOrganization = async (organization: Organization) => {
    const hasUsers = users.some((user) => user.organizationId === organization.id);
    if (hasUsers) {
      console.error('Cannot delete organization with assigned users');
      return;
    }

    try {
      setDeletingOrganizationId(organization.id);
      await deleteOrganization(organization.id);
    } catch (error) {
      console.error('Failed to delete organization:', error);
    } finally {
      setDeletingOrganizationId(null);
    }
  };

  const handleSetOrgAdmin = async (user: UserProfile, adminScopeOrgId: string | null) => {
    if (!isFullAdmin) return;

    try {
      setSavingOrgAdminUserId(user.uid);
      await setUserOrgAdminScope(user.uid, adminScopeOrgId);
    } catch (error) {
      console.error('Failed to update org admin scope:', error);
    } finally {
      setSavingOrgAdminUserId(null);
    }
  };

  const handleSaveManagedOrganization = async () => {
    if (!managedOrganization) return;

    try {
      setSavingManagedOrganizationId(managedOrganization.id);
      await updateOrganization(managedOrganization.id, orgDraftName, orgDraftDescription);
    } catch (error) {
      console.error('Failed to update organization:', error);
    } finally {
      setSavingManagedOrganizationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {isFullAdmin ? 'Global Admin Dashboard' : 'Organization Admin Dashboard'}
            </h1>
            <p className="text-sm md:text-base text-slate-600">
              {isFullAdmin
                ? 'Manage organizations, users, and org admins.'
                : 'Manage users and activity inside your organization.'}
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
                  const isSavingOrgAdmin = savingOrgAdminUserId === user.uid;
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
                          disabled={!isFullAdmin}
                        >
                          <option value="" disabled>Select organization</option>
                          {visibleOrganizations.map((org) => (
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

                      {isFullAdmin ? (
                        <div className="mt-2 flex items-center gap-2">
                          {user.adminOrganizationId ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => void handleSetOrgAdmin(user, null)}
                              disabled={isSavingOrgAdmin}
                            >
                              {isSavingOrgAdmin ? 'Updating...' : 'Remove Org Admin'}
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                void handleSetOrgAdmin(user, getDraftOrganizationId(user) || null)
                              }
                              disabled={isSavingOrgAdmin || !getDraftOrganizationId(user)}
                            >
                              {isSavingOrgAdmin ? 'Updating...' : 'Make Org Admin'}
                            </Button>
                          )}
                          <span className="text-xs text-slate-500">
                            {user.adminOrganizationId
                              ? `Org admin for ${
                                  organizations.find((org) => org.id === user.adminOrganizationId)?.name ||
                                  user.adminOrganizationId
                                }`
                              : 'Not an org admin'}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </Card>

          <Card className="p-4 md:p-5 bg-white">
            {!selectedUser ? (
              <div className="text-slate-500">Select a user to view progress.</div>
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
                    {isFullAdmin
                      ? 'You have full admin access across all organizations.'
                      : 'You have admin access limited to your organization only.'}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {isFullAdmin ? (
          <Card className="p-4 md:p-5 bg-white">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Organizations</h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
              <input
                value={newOrganizationName}
                onChange={(event) => setNewOrganizationName(event.target.value)}
                placeholder="Organization name"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={newOrganizationDescription}
                onChange={(event) => setNewOrganizationDescription(event.target.value)}
                placeholder="Description (optional)"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <Button
                type="button"
                onClick={() => void handleCreateOrganization()}
                disabled={isCreatingOrganization || !newOrganizationName.trim()}
                className="bg-slate-700 hover:bg-slate-800"
              >
                {isCreatingOrganization ? 'Creating...' : 'Create'}
              </Button>
            </div>

            <div className="space-y-2">
              {organizations.map((organization) => {
                const hasUsers = users.some((user) => user.organizationId === organization.id);
                const isDeleting = deletingOrganizationId === organization.id;
                return (
                  <div
                    key={organization.id}
                    className="rounded-lg border border-slate-200 p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{organization.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {organization.description || 'No description'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleDeleteOrganization(organization)}
                      disabled={isDeleting || hasUsers}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        ) : (
          <Card className="p-4 md:p-5 bg-white">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Your Organization</h2>
            {!managedOrganization ? (
              <p className="text-slate-500">No managed organization found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  value={orgDraftName}
                  onChange={(event) => setOrgDraftName(event.target.value)}
                  placeholder="Organization name"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <input
                  value={orgDraftDescription}
                  onChange={(event) => setOrgDraftDescription(event.target.value)}
                  placeholder="Description"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <Button
                  type="button"
                  onClick={() => void handleSaveManagedOrganization()}
                  disabled={savingManagedOrganizationId === managedOrganization.id || !orgDraftName.trim()}
                  className="bg-slate-700 hover:bg-slate-800"
                >
                  {savingManagedOrganizationId === managedOrganization.id ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
