import { useState, useEffect } from 'react';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { AddIncomeForm } from '@/components/AddIncomeForm';
import { AddDonationForm } from '@/components/AddDonationForm';
import { BeneficiariesList } from '@/components/BeneficiariesList';
import { HistoryView } from '@/components/HistoryView';
import { AuthPage } from '@/components/AuthPage';
import { UserMenu } from '@/components/UserMenu';
import { useMaasser } from '@/hooks/useMaasser';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, isAuthenticated, isLoading, logout, getUserId } = useAuth();
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
  } = useMaasser(getUserId());

  // Redirect to auth if not authenticated and trying to access other tabs
  useEffect(() => {
    if (!isLoading && !isAuthenticated && activeTab !== 'auth') {
      setActiveTab('auth');
    }
  }, [isAuthenticated, isLoading, activeTab]);

  // Redirect to dashboard after successful authentication
  useEffect(() => {
    if (isAuthenticated && activeTab === 'auth') {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated, activeTab]);

  const handleAuthSuccess = () => {
    // The useEffect above will handle the redirect when isAuthenticated changes
    // This callback is kept for potential future use
  };

  const handleTabChange = (tab: NavTab) => {
    if (!isAuthenticated && tab !== 'auth') {
      setActiveTab('auth');
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    // Show auth page if not authenticated
    if (!isAuthenticated) {
      return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }

    switch (activeTab) {
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground">Chargement...</div>
          <div className="text-xs text-muted-foreground/70">
            Vérification de la session...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <UserMenu user={user} onLogout={logout} />}
      <main className="max-w-lg mx-auto px-4 pt-6 pb-24">
        {renderContent()}
      </main>
      
      {isAuthenticated && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
};

export default Index;
