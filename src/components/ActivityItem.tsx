import { cn } from '@/lib/utils';
import { Income, Donation, INCOME_SOURCE_ICONS, INCOME_SOURCE_LABELS } from '@/types/maasser';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil } from 'lucide-react';

interface ActivityItemProps {
  type: 'income' | 'donation';
  data: Income | Donation;
  beneficiaryName?: string;
  className?: string;
  onEdit?: () => void;
}

export function ActivityItem({ type, data, beneficiaryName, className, onEdit }: ActivityItemProps) {
  const isIncome = type === 'income';
  const income = data as Income;
  const donation = data as Donation;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-card border border-border",
        "transition-all duration-200 hover:shadow-card-hover",
        onEdit && "cursor-pointer group",
        className
      )}
      onClick={onEdit}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
          isIncome ? "bg-primary/10" : "bg-success/10"
        )}
      >
        {isIncome ? INCOME_SOURCE_ICONS[income.source] : '🤲'}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {isIncome 
            ? income.description || INCOME_SOURCE_LABELS[income.source]
            : beneficiaryName || 'Don'
          }
        </p>
        <p className="text-xs text-muted-foreground">
          {format(data.date, 'd MMM yyyy', { locale: fr })}
        </p>
      </div>

      <div className="text-right flex items-center gap-2">
        <div>
          <p className={cn(
            "font-semibold",
            isIncome ? "text-foreground" : "text-success"
          )}>
            {isIncome ? '+' : '-'}{data.amount.toLocaleString('fr-FR')} €
          </p>
          {isIncome && (
            <p className="text-xs text-muted-foreground">
              Maasser: {income.maasserDue.toLocaleString('fr-FR')} €
            </p>
          )}
        </div>
        {onEdit && (
          <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}
