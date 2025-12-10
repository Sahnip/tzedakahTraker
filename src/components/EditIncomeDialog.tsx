import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Check, Trash2 } from 'lucide-react';
import { Income, IncomeSource, INCOME_SOURCE_LABELS, INCOME_SOURCE_ICONS } from '@/types/maasser';
import { toast } from 'sonner';

interface EditIncomeDialogProps {
  income: Income | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, amount: number, source: IncomeSource, date: Date, description?: string) => void;
  onDelete: (id: string) => void;
}

const sources: IncomeSource[] = ['salary', 'freelance', 'gift', 'investment', 'bonus', 'other'];

export function EditIncomeDialog({ income, open, onOpenChange, onUpdate, onDelete }: EditIncomeDialogProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<IncomeSource>('salary');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (income) {
      setAmount(income.amount.toString());
      setSource(income.source);
      setDate(income.date);
      setDescription(income.description || '');
    }
  }, [income]);

  const maasserAmount = amount ? parseFloat(amount) * 0.1 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!income || !amount || parseFloat(amount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    onUpdate(income.id, parseFloat(amount), source, date, description || undefined);
    onOpenChange(false);
    toast.success('Revenu modifié avec succès !');
  };

  const handleDelete = () => {
    if (income) {
      onDelete(income.id);
      onOpenChange(false);
      toast.success('Revenu supprimé');
    }
  };

  if (!income) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le revenu</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Montant</Label>
            <div className="relative">
              <Input
                id="edit-amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-semibold h-12 pr-12"
                step="0.01"
                min="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                €
              </span>
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="text-sm text-primary font-medium">
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
                    "p-2 rounded-lg border transition-all duration-200 text-center",
                    source === s
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <span className="text-lg block">{INCOME_SOURCE_ICONS[s]}</span>
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
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "d MMMM yyyy", { locale: fr })}
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
            <Label htmlFor="edit-description">Description (optionnel)</Label>
            <Textarea
              id="edit-description"
              placeholder="Ex: Salaire janvier..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer ce revenu ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le Maasser associé sera également recalculé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button type="submit" disabled={!amount || parseFloat(amount) <= 0}>
              <Check className="h-4 w-4 mr-1" />
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
