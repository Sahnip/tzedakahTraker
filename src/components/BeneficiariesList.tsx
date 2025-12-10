import { Beneficiary, Donation, BENEFICIARY_CATEGORY_LABELS } from '@/types/maasser';
import { cn } from '@/lib/utils';
import { Users, Building2, BookOpen, Heart, User, Landmark } from 'lucide-react';

interface BeneficiariesListProps {
  beneficiaries: Beneficiary[];
  donations: Donation[];
}

const categoryIcons = {
  synagogue: Building2,
  yeshiva: BookOpen,
  charity: Heart,
  individual: User,
  organization: Landmark,
  other: Users,
};

export function BeneficiariesList({ beneficiaries, donations }: BeneficiariesListProps) {
  // Calculate total donations per beneficiary
  const donationsByBeneficiary = donations.reduce((acc, d) => {
    acc[d.beneficiaryId] = (acc[d.beneficiaryId] || 0) + d.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort by total donated
  const sortedBeneficiaries = [...beneficiaries].sort((a, b) => {
    const aTotal = donationsByBeneficiary[a.id] || 0;
    const bTotal = donationsByBeneficiary[b.id] || 0;
    return bTotal - aTotal;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Bénéficiaires
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {beneficiaries.length} bénéficiaire{beneficiaries.length > 1 ? 's' : ''} enregistré{beneficiaries.length > 1 ? 's' : ''}
        </p>
      </div>

      {sortedBeneficiaries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucun bénéficiaire pour le moment</p>
          <p className="text-sm mt-1">
            Ajoutez un bénéficiaire lors de votre premier don
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBeneficiaries.map((beneficiary, index) => {
            const Icon = categoryIcons[beneficiary.category || 'other'];
            const totalDonated = donationsByBeneficiary[beneficiary.id] || 0;
            const donationCount = donations.filter(d => d.beneficiaryId === beneficiary.id).length;

            return (
              <div
                key={beneficiary.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl bg-card border border-border",
                  "transition-all duration-200 hover:shadow-card-hover animate-slide-up"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {beneficiary.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {beneficiary.category && (
                      <span>{BENEFICIARY_CATEGORY_LABELS[beneficiary.category]}</span>
                    )}
                    <span>•</span>
                    <span>{donationCount} don{donationCount > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-success">
                    {totalDonated.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-xs text-muted-foreground">total</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
