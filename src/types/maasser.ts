export interface Income {
  id: string;
  amount: number;
  source: IncomeSource;
  date: Date;
  description?: string;
  maasserDue: number;
}

export type IncomeSource = 
  | 'salary' 
  | 'freelance' 
  | 'gift' 
  | 'investment' 
  | 'bonus' 
  | 'other';

export interface Donation {
  id: string;
  amount: number;
  beneficiaryId: string;
  date: Date;
  note?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  category?: BeneficiaryCategory;
  createdAt: Date;
}

export type BeneficiaryCategory = 
  | 'synagogue' 
  | 'yeshiva' 
  | 'charity' 
  | 'individual' 
  | 'organization' 
  | 'other';

export interface YearSummary {
  year: number;
  totalIncome: number;
  totalMaasserDue: number;
  totalDonated: number;
  remaining: number;
  percentComplete: number;
}

export const INCOME_SOURCE_LABELS: Record<IncomeSource, string> = {
  salary: 'Salaire',
  freelance: 'Freelance',
  gift: 'Cadeau',
  investment: 'Investissement',
  bonus: 'Prime',
  other: 'Autre',
};

export const INCOME_SOURCE_ICONS: Record<IncomeSource, string> = {
  salary: '💼',
  freelance: '💻',
  gift: '🎁',
  investment: '📈',
  bonus: '🎉',
  other: '💰',
};

export const BENEFICIARY_CATEGORY_LABELS: Record<BeneficiaryCategory, string> = {
  synagogue: 'Synagogue',
  yeshiva: 'Yeshiva',
  charity: 'Tsédaka',
  individual: 'Particulier',
  organization: 'Organisation',
  other: 'Autre',
};
