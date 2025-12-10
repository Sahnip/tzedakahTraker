import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Check } from 'lucide-react';
import { IncomeSource, INCOME_SOURCE_LABELS, INCOME_SOURCE_ICONS } from '@/types/maasser';
import { toast } from 'sonner';

interface AddIncomeFormProps {
  onSubmit: (amount: number, source: IncomeSource, date: Date, description?: string) => void;
  onCancel?: () => void;
}

const sources: IncomeSource[] = ['salary', 'freelance', 'gift', 'investment', 'bonus', 'other'];

export function AddIncomeForm({ onSubmit, onCancel }: AddIncomeFormProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<IncomeSource>('salary');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');

  const maasserAmount = amount ? parseFloat(amount) * 0.1 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    onSubmit(parseFloat(amount), source, date, description || undefined);
    
    // Reset form
    setAmount('');
    setSource('salary');
    setDate(new Date());
    setDescription('');
    
    toast.success('Revenu ajouté avec succès !', {
      description: `Maasser calculé: ${maasserAmount.toLocaleString('fr-FR')} €`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Ajouter un revenu
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Le Maasser (10%) sera calculé automatiquement
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Montant</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl font-semibold h-14 pr-12"
            step="0.01"
            min="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            €
          </span>
        </div>
        {amount && parseFloat(amount) > 0 && (
          <p className="text-sm text-primary font-medium animate-fade-in">
            Maasser dû: {maasserAmount.toLocaleString('fr-FR')} €
          </p>
        )}
      </div>

      {/* Source */}
      <div className="space-y-2">
        <Label>Source du revenu</Label>
        <div className="grid grid-cols-3 gap-2">
          {sources.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={cn(
                "p-3 rounded-xl border transition-all duration-200 text-center",
                source === s
                  ? "border-primary bg-primary/10 shadow-card"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="text-xl block mb-1">{INCOME_SOURCE_ICONS[s]}</span>
              <span className="text-xs font-medium">{INCOME_SOURCE_LABELS[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal h-12",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnel)</Label>
        <Textarea
          id="description"
          placeholder="Ex: Salaire janvier, Projet client..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none"
          rows={2}
        />
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-opacity"
        disabled={!amount || parseFloat(amount) <= 0}
      >
        <Check className="mr-2 h-5 w-5" />
        Ajouter le revenu
      </Button>
    </form>
  );
}
