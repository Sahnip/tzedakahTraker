import { useState, useCallback, useMemo, useEffect } from 'react';
import { Income, Donation, Beneficiary, YearSummary, IncomeSource, BeneficiaryCategory } from '@/types/maasser';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Get storage keys based on user ID
const getStorageKeys = (userId: string | null) => {
  const suffix = userId ? `_${userId}` : '';
  return {
    INCOMES: `tzedakah_incomes${suffix}`,
    DONATIONS: `tzedakah_donations${suffix}`,
    BENEFICIARIES: `tzedakah_beneficiaries${suffix}`,
  };
};

// Sample data for demo (used only if localStorage is empty)
const SAMPLE_INCOMES: Income[] = [
  {
    id: '1',
    amount: 4500,
    source: 'salary',
    date: new Date(2024, 0, 15),
    description: 'Salaire janvier',
    maasserDue: 450,
  },
  {
    id: '2',
    amount: 4500,
    source: 'salary',
    date: new Date(2024, 1, 15),
    description: 'Salaire février',
    maasserDue: 450,
  },
  {
    id: '3',
    amount: 1200,
    source: 'freelance',
    date: new Date(2024, 1, 20),
    description: 'Projet web',
    maasserDue: 120,
  },
  {
    id: '4',
    amount: 500,
    source: 'gift',
    date: new Date(2024, 2, 5),
    description: 'Cadeau Pourim',
    maasserDue: 50,
  },
];

const SAMPLE_BENEFICIARIES: Beneficiary[] = [
  { id: 'b1', name: 'Beth Habad', category: 'synagogue', createdAt: new Date(2023, 0, 1) },
  { id: 'b2', name: 'Yeshiva Or Torah', category: 'yeshiva', createdAt: new Date(2023, 0, 1) },
  { id: 'b3', name: 'Keren Hayeled', category: 'charity', createdAt: new Date(2023, 5, 1) },
];

const SAMPLE_DONATIONS: Donation[] = [
  { id: 'd1', amount: 200, beneficiaryId: 'b1', date: new Date(2024, 0, 20), note: 'Don mensuel' },
  { id: 'd2', amount: 150, beneficiaryId: 'b2', date: new Date(2024, 1, 10) },
  { id: 'd3', amount: 100, beneficiaryId: 'b3', date: new Date(2024, 1, 25), note: 'Pourim' },
];

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      // Convert date strings back to Date objects
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => {
          if (item.date) item.date = new Date(item.date);
          if (item.createdAt) item.createdAt = new Date(item.createdAt);
          return item;
        }) as T;
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function useMaasser(userId: string | null = null) {
  const storageKeys = getStorageKeys(userId);

  // Load initial data from localStorage or use sample data
  const [incomes, setIncomes] = useState<Income[]>(() => {
    const stored = loadFromStorage<Income[]>(storageKeys.INCOMES, []);
    return stored.length > 0 ? stored : (userId ? [] : SAMPLE_INCOMES);
  });
  
  const [donations, setDonations] = useState<Donation[]>(() => {
    const stored = loadFromStorage<Donation[]>(storageKeys.DONATIONS, []);
    return stored.length > 0 ? stored : (userId ? [] : SAMPLE_DONATIONS);
  });
  
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const stored = loadFromStorage<Beneficiary[]>(storageKeys.BENEFICIARIES, []);
    return stored.length > 0 ? stored : (userId ? [] : SAMPLE_BENEFICIARIES);
  });
  
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Reload data when userId changes
  useEffect(() => {
    const keys = getStorageKeys(userId);
    const loadedIncomes = loadFromStorage<Income[]>(keys.INCOMES, []);
    const loadedDonations = loadFromStorage<Donation[]>(keys.DONATIONS, []);
    const loadedBeneficiaries = loadFromStorage<Beneficiary[]>(keys.BENEFICIARIES, []);
    
    setIncomes(loadedIncomes.length > 0 ? loadedIncomes : (userId ? [] : SAMPLE_INCOMES));
    setDonations(loadedDonations.length > 0 ? loadedDonations : (userId ? [] : SAMPLE_DONATIONS));
    setBeneficiaries(loadedBeneficiaries.length > 0 ? loadedBeneficiaries : (userId ? [] : SAMPLE_BENEFICIARIES));
  }, [userId]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    const keys = getStorageKeys(userId);
    saveToStorage(keys.INCOMES, incomes);
  }, [incomes, userId]);

  useEffect(() => {
    const keys = getStorageKeys(userId);
    saveToStorage(keys.DONATIONS, donations);
  }, [donations, userId]);

  useEffect(() => {
    const keys = getStorageKeys(userId);
    saveToStorage(keys.BENEFICIARIES, beneficiaries);
  }, [beneficiaries, userId]);

  // Add income
  const addIncome = useCallback((
    amount: number,
    source: IncomeSource,
    date: Date,
    description?: string
  ) => {
    const newIncome: Income = {
      id: generateId(),
      amount,
      source,
      date,
      description,
      maasserDue: amount * 0.1,
    };
    setIncomes(prev => [newIncome, ...prev]);
    return newIncome;
  }, []);

  // Add donation
  const addDonation = useCallback((
    amount: number,
    beneficiaryId: string,
    date: Date,
    note?: string
  ) => {
    const newDonation: Donation = {
      id: generateId(),
      amount,
      beneficiaryId,
      date,
      note,
    };
    setDonations(prev => [newDonation, ...prev]);
    return newDonation;
  }, []);

  // Update income
  const updateIncome = useCallback((
    id: string,
    amount: number,
    source: IncomeSource,
    date: Date,
    description?: string
  ) => {
    setIncomes(prev => prev.map(income => 
      income.id === id 
        ? { ...income, amount, source, date, description, maasserDue: amount * 0.1 }
        : income
    ));
  }, []);

  // Delete income
  const deleteIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  }, []);

  // Update donation
  const updateDonation = useCallback((
    id: string,
    amount: number,
    beneficiaryId: string,
    date: Date,
    note?: string
  ) => {
    setDonations(prev => prev.map(donation => 
      donation.id === id 
        ? { ...donation, amount, beneficiaryId, date, note }
        : donation
    ));
  }, []);

  // Delete donation
  const deleteDonation = useCallback((id: string) => {
    setDonations(prev => prev.filter(donation => donation.id !== id));
  }, []);

  // Add beneficiary
  const addBeneficiary = useCallback((
    name: string,
    category?: BeneficiaryCategory
  ) => {
    const newBeneficiary: Beneficiary = {
      id: generateId(),
      name,
      category,
      createdAt: new Date(),
    };
    setBeneficiaries(prev => [newBeneficiary, ...prev]);
    return newBeneficiary;
  }, []);

  // Get year summary
  const yearSummary = useMemo((): YearSummary => {
    const yearIncomes = incomes.filter(i => i.date.getFullYear() === selectedYear);
    const yearDonations = donations.filter(d => d.date.getFullYear() === selectedYear);

    const totalIncome = yearIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalMaasserDue = yearIncomes.reduce((sum, i) => sum + i.maasserDue, 0);
    const totalDonated = yearDonations.reduce((sum, d) => sum + d.amount, 0);
    const remaining = Math.max(0, totalMaasserDue - totalDonated);
    const percentComplete = totalMaasserDue > 0 
      ? Math.min(100, (totalDonated / totalMaasserDue) * 100) 
      : 0;

    return {
      year: selectedYear,
      totalIncome,
      totalMaasserDue,
      totalDonated,
      remaining,
      percentComplete,
    };
  }, [incomes, donations, selectedYear]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    const allActivity = [
      ...incomes.map(i => ({ type: 'income' as const, data: i, date: i.date })),
      ...donations.map(d => ({ type: 'donation' as const, data: d, date: d.date })),
    ];
    return allActivity
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [incomes, donations]);

  // Get beneficiary by ID
  const getBeneficiary = useCallback((id: string) => {
    return beneficiaries.find(b => b.id === id);
  }, [beneficiaries]);

  // Available years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    incomes.forEach(i => years.add(i.date.getFullYear()));
    donations.forEach(d => years.add(d.date.getFullYear()));
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [incomes, donations]);

  return {
    incomes,
    donations,
    beneficiaries,
    selectedYear,
    setSelectedYear,
    addIncome,
    addDonation,
    addBeneficiary,
    updateIncome,
    deleteIncome,
    updateDonation,
    deleteDonation,
    yearSummary,
    recentActivity,
    getBeneficiary,
    availableYears,
  };
}
