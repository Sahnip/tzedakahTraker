import { cn } from '@/lib/utils';
import { Home, PlusCircle, Heart, Users, History } from 'lucide-react';

export type NavTab = 'dashboard' | 'add-income' | 'add-donation' | 'beneficiaries' | 'history';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Accueil', icon: Home },
  { id: 'add-income', label: 'Revenu', icon: PlusCircle },
  { id: 'add-donation', label: 'Don', icon: Heart },
  { id: 'beneficiaries', label: 'Bénéf.', icon: Users },
  { id: 'history', label: 'Historique', icon: History },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200",
                "min-w-[60px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative p-1.5 rounded-lg transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon 
                  size={22} 
                  className={cn(
                    "transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
