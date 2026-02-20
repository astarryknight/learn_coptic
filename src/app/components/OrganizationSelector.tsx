import { Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { OrganizationOption } from '../data/organizations';

interface OrganizationSelectorProps {
  organizations: OrganizationOption[];
  isSaving: boolean;
  onSelect: (organization: OrganizationOption) => Promise<void>;
}

export function OrganizationSelector({
  organizations,
  isSaving,
  onSelect,
}: OrganizationSelectorProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-slate-700 text-white mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Choose Your Organization</h1>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Your leaderboard will be scoped to this organization.
          </p>
        </div>

        <div className="space-y-3">
          {organizations.map((organization) => (
            <button
              key={organization.id}
              type="button"
              disabled={isSaving}
              onClick={() => void onSelect(organization)}
              className="w-full text-left rounded-xl border-2 border-slate-200 hover:border-slate-400 bg-white p-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <h2 className="font-bold text-slate-800">{organization.name}</h2>
              <p className="text-sm text-slate-600 mt-1">{organization.description}</p>
            </button>
          ))}
        </div>

        <Button
          type="button"
          disabled
          className="w-full mt-6 bg-slate-300 text-slate-700 cursor-not-allowed"
        >
          {isSaving ? 'Saving organization...' : 'Select an organization to continue'}
        </Button>
      </Card>
    </div>
  );
}
