import { YearSummary, Income, Donation, Beneficiary } from '@/types/maasser';
import { ProgressRing } from './ProgressRing';
import { StatCard } from './StatCard';
import { ActivityItem } from './ActivityItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, Heart, Clock, Wallet, LogOut, User } from 'lucide-react';
import { User as UserType } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface DashboardProps {
  yearSummary: YearSummary;
  recentActivity: Array<{
    type: 'income' | 'donation';
    data: Income | Donation;
    date: Date;
  }>;
  beneficiaries: Beneficiary[];
  availableYears: number[];
  onYearChange: (year: number) => void;
  user: UserType | null;
  onLogout: () => void;
}

export function Dashboard({
  yearSummary,
  recentActivity,
  beneficiaries,
  availableYears,
  onYearChange,
  user,
  onLogout
}: DashboardProps) {
  const handleLogout = () => {
    onLogout();
    toast.success('Déconnexion réussie', {
      description: 'À bientôt !',
    });
  };
  const getBeneficiaryName = (id: string) => beneficiaries.find(b => b.id === id)?.name || 'Inconnu';
  return <div className="space-y-6 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Maasser
          </h1>
          <p className="text-muted-foreground mt-1">
            Donne le Maasser pour t'enrichir    
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Year Selector */}
      <div className="flex justify-center">
        <Select value={yearSummary.year.toString()} onValueChange={v => onYearChange(parseInt(v))}>
          <SelectTrigger className="w-32 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center py-4">
        <ProgressRing percent={yearSummary.percentComplete} size={180} strokeWidth={14} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Revenus totaux" value={`${yearSummary.totalIncome.toLocaleString('fr-FR')} €`} icon={<TrendingUp className="h-5 w-5" />} variant="accent" />
        <StatCard label="Maasser dû" value={`${yearSummary.totalMaasserDue.toLocaleString('fr-FR')} €`} icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Déjà donné" value={`${yearSummary.totalDonated.toLocaleString('fr-FR')} €`} icon={<Heart className="h-5 w-5" />} variant="success" />
        <StatCard label="Restant" value={`${yearSummary.remaining.toLocaleString('fr-FR')} €`} icon={<Clock className="h-5 w-5" />} variant={yearSummary.remaining > 0 ? 'warning' : 'success'} />
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold text-foreground px-1">
          Activité récente
        </h2>
        
        {recentActivity.length === 0 ? <div className="text-center py-8 text-muted-foreground">
            <p>Aucune activité pour le moment</p>
            <p className="text-sm mt-1">Ajoutez votre premier revenu ou don</p>
          </div> : <div className="space-y-2">
            {recentActivity.map((activity, index) => <div key={`${activity.type}-${activity.data.id}`} className="animate-slide-up" style={{
          animationDelay: `${index * 100}ms`
        }}>
                <ActivityItem type={activity.type} data={activity.data} beneficiaryName={activity.type === 'donation' ? getBeneficiaryName((activity.data as Donation).beneficiaryId) : undefined} />
              </div>)}
          </div>}
      </div>
    </div>;
}