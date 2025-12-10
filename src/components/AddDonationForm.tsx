import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Check, Plus, Heart } from 'lucide-react';
import { Beneficiary, BeneficiaryCategory, BENEFICIARY_CATEGORY_LABELS } from '@/types/maasser';
import { toast } from 'sonner';

interface AddDonationFormProps {
  beneficiaries: Beneficiary[];
  remainingMaasser: number;
  onSubmit: (amount: number, beneficiaryId: string, date: Date, note?: string) => void;
  onAddBeneficiary: (name: string, category?: BeneficiaryCategory) => Beneficiary;
}

const categories: BeneficiaryCategory[] = ['synagogue', 'yeshiva', 'charity', 'individual', 'organization', 'other'];

export function AddDonationForm({ 
  beneficiaries, 
  remainingMaasser,
  onSubmit, 
  onAddBeneficiary 
}: AddDonationFormProps) {
  const [amount, setAmount] = useState('');
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [note, setNote] = useState('');
  
  // New beneficiary dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBeneficiaryName, setNewBeneficiaryName] = useState('');
  const [newBeneficiaryCategory, setNewBeneficiaryCategory] = useState<BeneficiaryCategory>('charity');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    if (!beneficiaryId) {
      toast.error('Veuillez sélectionner un bénéficiaire');
      return;
    }

    onSubmit(parseFloat(amount), beneficiaryId, date, note || undefined);
    
    // Reset form
    setAmount('');
    setBeneficiaryId('');
    setDate(new Date());
    setNote('');
    
    toast.success('Don enregistré avec succès !', {
      description: 'Que votre générosité soit bénie 🙏',
    });
  };

  const handleAddBeneficiary = () => {
    if (!newBeneficiaryName.trim()) {
      toast.error('Veuillez entrer un nom');
      return;
    }

    const newBeneficiary = onAddBeneficiary(newBeneficiaryName.trim(), newBeneficiaryCategory);
    setBeneficiaryId(newBeneficiary.id);
    setNewBeneficiaryName('');
    setNewBeneficiaryCategory('charity');
    setIsDialogOpen(false);
    
    toast.success('Bénéficiaire ajouté !');
  };

  const selectedBeneficiary = beneficiaries.find(b => b.id === beneficiaryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Enregistrer un don
        </h2>
        {remainingMaasser > 0 && (
          <p className="text-sm text-warning mt-1">
            Maasser restant: {remainingMaasser.toLocaleString('fr-FR')} €
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="donation-amount">Montant du don</Label>
        <div className="relative">
          <Input
            id="donation-amount"
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
        {remainingMaasser > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAmount(remainingMaasser.toString())}
            className="text-xs"
          >
            Tout donner ({remainingMaasser.toLocaleString('fr-FR')} €)
          </Button>
        )}
      </div>

      {/* Beneficiary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Bénéficiaire</Label>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="text-primary">
                <Plus className="h-4 w-4 mr-1" />
                Nouveau
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un bénéficiaire</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="beneficiary-name">Nom</Label>
                  <Input
                    id="beneficiary-name"
                    placeholder="Ex: Beth Habad, Yeshiva..."
                    value={newBeneficiaryName}
                    onChange={(e) => setNewBeneficiaryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select 
                    value={newBeneficiaryCategory} 
                    onValueChange={(v) => setNewBeneficiaryCategory(v as BeneficiaryCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {BENEFICIARY_CATEGORY_LABELS[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddBeneficiary} className="w-full">
                  <Check className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {beneficiaries.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBeneficiaryId(b.id)}
              className={cn(
                "p-3 rounded-xl border transition-all duration-200 text-left",
                beneficiaryId === b.id
                  ? "border-success bg-success/10 shadow-card"
                  : "border-border bg-card hover:border-success/50"
              )}
            >
              <span className="text-sm font-medium block truncate">{b.name}</span>
              {b.category && (
                <span className="text-xs text-muted-foreground">
                  {BENEFICIARY_CATEGORY_LABELS[b.category]}
                </span>
              )}
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

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Note (optionnel)</Label>
        <Textarea
          id="note"
          placeholder="Ex: Don mensuel, en mémoire de..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="resize-none"
          rows={2}
        />
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold gradient-success hover:opacity-90 transition-opacity"
        disabled={!amount || parseFloat(amount) <= 0 || !beneficiaryId}
      >
        <Heart className="mr-2 h-5 w-5" />
        Enregistrer le don
      </Button>
    </form>
  );
}
