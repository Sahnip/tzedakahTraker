import { useState } from 'react';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { AddIncomeForm } from '@/components/AddIncomeForm';
import { AddDonationForm } from '@/components/AddDonationForm';
import { BeneficiariesList } from '@/components/BeneficiariesList';
import { HistoryView } from '@/components/HistoryView';
import { useMaasser } from '@/hooks/useMaasser';

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  const {
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
    availableYears,
  } = useMaasser();

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            yearSummary={yearSummary}
            recentActivity={recentActivity}
            beneficiaries={beneficiaries}
            availableYears={availableYears}
            onYearChange={setSelectedYear}
          />
        );
      
      case 'add-income':
        return (
          <AddIncomeForm
            onSubmit={(amount, source, date, description) => {
              addIncome(amount, source, date, description);
              setActiveTab('dashboard');
            }}
          />
        );
      
      case 'add-donation':
        return (
          <AddDonationForm
            beneficiaries={beneficiaries}
            remainingMaasser={yearSummary.remaining}
            onSubmit={(amount, beneficiaryId, date, note) => {
              addDonation(amount, beneficiaryId, date, note);
              setActiveTab('dashboard');
            }}
            onAddBeneficiary={addBeneficiary}
          />
        );
      
      case 'beneficiaries':
        return (
          <BeneficiariesList
            beneficiaries={beneficiaries}
            donations={donations}
          />
        );
      
      case 'history':
        return (
          <HistoryView
            incomes={incomes}
            donations={donations}
            beneficiaries={beneficiaries}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onUpdateIncome={updateIncome}
            onDeleteIncome={deleteIncome}
            onUpdateDonation={updateDonation}
            onDeleteDonation={deleteDonation}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-24">
        {renderContent()}
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
