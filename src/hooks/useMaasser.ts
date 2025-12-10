import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations:supubase/client';
import { Income, Donation, Beneficiary, YearSummary, IncomeSource, BeneficiaryCategory } from '@/types/maasser';

export function useMaasser(userId: string | null = null) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase when userId changes
  useEffect(() => {
    if (!userId) {
      setIncomes([]);
      setDonations([]);
      setBeneficiaries([]);
      setIsLoading(false);
      return;
    }

    loadAllData();
  }, [userId]);

  const loadAllData = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Load beneficiaries
      const { data: beneficiariesData, error: beneficiariesError } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (beneficiariesError) throw beneficiariesError;

      const loadedBeneficiaries: Beneficiary[] = (beneficiariesData || []).map(b => ({
        id: b.id,
        name: b.name,
        category: b.category as BeneficiaryCategory | undefined,
        createdAt: new Date(b.created_at),
      }));
      setBeneficiaries(loadedBeneficiaries);

      // Load incomes
      const { data: incomesData, error: incomesError } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (incomesError) throw incomesError;

      const loadedIncomes: Income[] = (incomesData || []).map(i => ({
        id: i.id,
        amount: Number(i.amount),
        source: i.source as IncomeSource,
        date: new Date(i.date),
        description: i.description || undefined,
        maasserDue: Number(i.maasser_due),
      }));
      setIncomes(loadedIncomes);

      // Load donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (donationsError) throw donationsError;

      const loadedDonations: Donation[] = (donationsData || []).map(d => ({
        id: d.id,
        amount: Number(d.amount),
        beneficiaryId: d.beneficiary_id,
        date: new Date(d.date),
        note: d.note || undefined,
      }));
      setDonations(loadedDonations);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add income
  const addIncome = useCallback(async (
    amount: number,
    source: IncomeSource,
    date: Date,
    description?: string
  ) => {
    if (!userId) return null;

    const maasserDue = amount * 0.1;
    const newIncome = {
      user_id: userId,
      amount,
      source,
      date: date.toISOString().split('T')[0],
      description: description || null,
      maasser_due: maasserDue,
    };

    const { data, error } = await supabase
      .from('incomes')
      .insert(newIncome)
      .select()
      .single();

    if (error) {
      console.error('Error adding income:', error);
      return null;
    }

    const income: Income = {
      id: data.id,
      amount: Number(data.amount),
      source: data.source as IncomeSource,
      date: new Date(data.date),
      description: data.description || undefined,
      maasserDue: Number(data.maasser_due),
    };

    setIncomes(prev => [income, ...prev]);
    return income;
  }, [userId]);

  // Add donation
  const addDonation = useCallback(async (
    amount: number,
    beneficiaryId: string,
    date: Date,
    note?: string
  ) => {
    if (!userId) return null;

    const newDonation = {
      user_id: userId,
      amount,
      beneficiary_id: beneficiaryId,
      date: date.toISOString().split('T')[0],
      note: note || null,
    };

    const { data, error } = await supabase
      .from('donations')
      .insert(newDonation)
      .select()
      .single();

    if (error) {
      console.error('Error adding donation:', error);
      return null;
    }

    const donation: Donation = {
      id: data.id,
      amount: Number(data.amount),
      beneficiaryId: data.beneficiary_id,
      date: new Date(data.date),
      note: data.note || undefined,
    };

    setDonations(prev => [donation, ...prev]);
    return donation;
  }, [userId]);

  // Update income
  const updateIncome = useCallback(async (
    id: string,
    amount: number,
    source: IncomeSource,
    date: Date,
    description?: string
  ) => {
    if (!userId) return;

    const maasserDue = amount * 0.1;
    const { error } = await supabase
      .from('incomes')
      .update({
        amount,
        source,
        date: date.toISOString().split('T')[0],
        description: description || null,
        maasser_due: maasserDue,
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating income:', error);
      return;
    }

    setIncomes(prev => prev.map(income => 
      income.id === id 
        ? { ...income, amount, source, date, description, maasserDue }
        : income
    ));
  }, [userId]);

  // Delete income
  const deleteIncome = useCallback(async (id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting income:', error);
      return;
    }

    setIncomes(prev => prev.filter(income => income.id !== id));
  }, [userId]);

  // Update donation
  const updateDonation = useCallback(async (
    id: string,
    amount: number,
    beneficiaryId: string,
    date: Date,
    note?: string
  ) => {
    if (!userId) return;

    const { error } = await supabase
      .from('donations')
      .update({
        amount,
        beneficiary_id: beneficiaryId,
        date: date.toISOString().split('T')[0],
        note: note || null,
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating donation:', error);
      return;
    }

    setDonations(prev => prev.map(donation => 
      donation.id === id 
        ? { ...donation, amount, beneficiaryId, date, note }
        : donation
    ));
  }, [userId]);

  // Delete donation
  const deleteDonation = useCallback(async (id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting donation:', error);
      return;
    }

    setDonations(prev => prev.filter(donation => donation.id !== id));
  }, [userId]);

  // Add beneficiary
  const addBeneficiary = useCallback(async (
    name: string,
    category?: BeneficiaryCategory
  ) => {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('beneficiaries')
      .insert({
        user_id: userId,
        name,
        category: category || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding beneficiary:', error);
      return null;
    }

    const beneficiary: Beneficiary = {
      id: data.id,
      name: data.name,
      category: data.category as BeneficiaryCategory | undefined,
      createdAt: new Date(data.created_at),
    };

    setBeneficiaries(prev => [beneficiary, ...prev]);
    return beneficiary;
  }, [userId]);

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
    isLoading,
  };
}
