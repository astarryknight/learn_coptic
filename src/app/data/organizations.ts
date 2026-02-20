export interface OrganizationOption {
  id: string;
  name: string;
  description: string;
}

export const organizations: OrganizationOption[] = [
  {
    id: 'st-mark',
    name: 'St. Mark Coptic Orthodox Church',
    description: 'Primary parish leaderboard',
  },
  {
    id: 'st-mary',
    name: 'St. Mary Coptic Orthodox Church',
    description: 'Regional youth leaderboard',
  },
  {
    id: 'archdiocese-demo',
    name: 'Archdiocese Demo Organization',
    description: 'Example shared instance group',
  },
];
