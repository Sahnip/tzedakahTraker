import { useState } from 'react';
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();

  // Redirect when authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      onAuthSuccess?.();
    }
  }, [isAuthenticated, onAuthSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        toast.success('Connexion réussie !', {
          description: `Bienvenue ${user.name || user.email}`,
        });
        // The useEffect will handle the redirect
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      const user = await register(email, password, name || undefined);
      if (user) {
        toast.success('Compte créé avec succès !', {
          description: `Bienvenue ${user.name || user.email}`,
        });
        // The useEffect will handle the redirect
      } else {
        toast.error('Cet email est déjà utilisé ou une erreur est survenue');
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <span className="text-3xl">🙏</span>
          </div>
          <CardTitle className="text-2xl">Give Maasser</CardTitle>
          <CardDescription>
            Gérez vos dons et votre maasser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn size={16} />
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus size={16} />
                Créer un compte
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock size={16} />
                    Mot de passe
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn size={16} className="mr-2" />
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="flex items-center gap-2">
                    <User size={16} />
                    Nom (optionnel)
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="flex items-center gap-2">
                    <Lock size={16} />
                    Mot de passe
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Au moins 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <UserPlus size={16} className="mr-2" />
                  {isLoading ? 'Création...' : 'Créer un compte'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}

