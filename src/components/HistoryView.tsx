import { useState } from 'react';
import { Income, Donation, Beneficiary, IncomeSource, INCOME_SOURCE_LABELS, INCOME_SOURCE_ICONS } from '@/types/maasser';
import { ActivityItem } from './ActivityItem';
import { EditIncomeDialog } from './EditIncomeDialog';
import { EditDonationDialog } from './EditDonationDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryViewProps {
  incomes: Income[];
  donations: Donation[];
  beneficiaries: Beneficiary[];
  availableYears: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  onUpdateIncome: (id: string, amount: number, source: IncomeSource, date: Date, description?: string) => void;
  onDeleteIncome: (id: string) => void;
  onUpdateDonation: (id: string, amount: number, beneficiaryId: string, date: Date, note?: string) => void;
  onDeleteDonation: (id: string) => void;
}

export function HistoryView({
  incomes,
  donations,
  beneficiaries,
  availableYears,
  selectedYear,
  onYearChange,
  onUpdateIncome,
  onDeleteIncome,
  onUpdateDonation,
  onDeleteDonation,
}: HistoryViewProps) {
  const [sourceFilter, setSourceFilter] = useState<IncomeSource | 'all'>('all');
  const [beneficiaryFilter, setBeneficiaryFilter] = useState<string>('all');
  
  // Edit dialogs
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);

  const getBeneficiaryName = (id: string) => beneficiaries.find(b => b.id === id)?.name || 'Inconnu';

  // Filter incomes
  const filteredIncomes = incomes
    .filter(i => i.date.getFullYear() === selectedYear)
    .filter(i => sourceFilter === 'all' || i.source === sourceFilter)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Filter donations
  const filteredDonations = donations
    .filter(d => d.date.getFullYear() === selectedYear)
    .filter(d => beneficiaryFilter === 'all' || d.beneficiaryId === beneficiaryFilter)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Group by month
  const groupByMonth = <T extends { date: Date }>(items: T[]) => {
    const groups: Record<string, T[]> = {};
    items.forEach(item => {
      const key = format(item.date, 'MMMM yyyy', { locale: fr });
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  };

  const incomesByMonth = groupByMonth(filteredIncomes);
  const donationsByMonth = groupByMonth(filteredDonations);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Historique
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Cliquez sur une entrée pour la modifier
        </p>
      </div>

      {/* Year filter */}
      <div className="flex justify-center">
        <Select 
          value={selectedYear.toString()} 
          onValueChange={(v) => onYearChange(parseInt(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">Tout</TabsTrigger>
          <TabsTrigger value="incomes">Revenus</TabsTrigger>
          <TabsTrigger value="donations">Dons</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-2">
          {[...filteredIncomes, ...filteredDonations]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 20)
            .map((item) => {
              const isIncome = 'source' in item;
              return (
                <ActivityItem
                  key={item.id}
                  type={isIncome ? 'income' : 'donation'}
                  data={item}
                  beneficiaryName={!isIncome ? getBeneficiaryName((item as Donation).beneficiaryId) : undefined}
                  onEdit={() => isIncome ? setEditingIncome(item as Income) : setEditingDonation(item as Donation)}
                />
              );
            })}
        </TabsContent>

        <TabsContent value="incomes" className="mt-4 space-y-4">
          {/* Source filter */}
          <Select 
            value={sourceFilter} 
            onValueChange={(v) => setSourceFilter(v as IncomeSource | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sources</SelectItem>
              {Object.entries(INCOME_SOURCE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {INCOME_SOURCE_ICONS[key as IncomeSource]} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {Object.entries(incomesByMonth).map(([month, items]) => (
            <div key={month} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground capitalize px-1">
                {month}
              </h3>
              {items.map(income => (
                <ActivityItem
                  key={income.id}
                  type="income"
                  data={income}
                  onEdit={() => setEditingIncome(income)}
                />
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="donations" className="mt-4 space-y-4">
          {/* Beneficiary filter */}
          <Select 
            value={beneficiaryFilter} 
            onValueChange={setBeneficiaryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par bénéficiaire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les bénéficiaires</SelectItem>
              {beneficiaries.map(b => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {Object.entries(donationsByMonth).map(([month, items]) => (
            <div key={month} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground capitalize px-1">
                {month}
              </h3>
              {items.map(donation => (
                <ActivityItem
                  key={donation.id}
                  type="donation"
                  data={donation}
                  beneficiaryName={getBeneficiaryName(donation.beneficiaryId)}
                  onEdit={() => setEditingDonation(donation)}
                />
              ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit dialogs */}
      <EditIncomeDialog
        income={editingIncome}
        open={!!editingIncome}
        onOpenChange={(open) => !open && setEditingIncome(null)}
        onUpdate={onUpdateIncome}
        onDelete={onDeleteIncome}
      />
      
      <EditDonationDialog
        donation={editingDonation}
        beneficiaries={beneficiaries}
        open={!!editingDonation}
        onOpenChange={(open) => !open && setEditingDonation(null)}
        onUpdate={onUpdateDonation}
        onDelete={onDeleteDonation}
      />
    </div>
  );
}
