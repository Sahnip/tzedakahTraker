import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations:supubase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    let mounted = true;

    // Check for existing session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error in getSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If table doesn't exist or profile not found, try to get user from auth
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.warn('Table profiles not found. Please run the SQL schema in Supabase.');
          // Fallback: use auth user data
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              name: authUser.user_metadata?.name || undefined,
              createdAt: new Date(authUser.created_at),
            });
          }
        } else {
          throw error;
        }
      } else if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name || undefined,
          createdAt: new Date(profile.created_at),
        });
      }
    } catch (error: any) {
      console.error('Error loading user profile:', error);
      // Fallback: try to get user from auth
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: authUser.user_metadata?.name || undefined,
            createdAt: new Date(authUser.created_at),
          });
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user
  const register = useCallback(async (email: string, password: string, name?: string): Promise<User | null> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || null,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Profile is created automatically by trigger, but we can update it with name
        if (name) {
          await supabase
            .from('profiles')
            .update({ name })
            .eq('id', authData.user.id);
        }

        // Load the profile
        await loadUserProfile(authData.user.id);

        return {
          id: authData.user.id,
          email: authData.user.email!,
          name: name || undefined,
          createdAt: new Date(authData.user.created_at),
        };
      }

      return null;
    } catch (error: any) {
      console.error('Registration error:', error);
      return null;
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        await loadUserProfile(authData.user.id);
        return {
          id: authData.user.id,
          email: authData.user.email!,
          name: undefined, // Will be loaded from profile
          createdAt: new Date(authData.user.created_at),
        };
      }

      return null;
    } catch (error: any) {
      console.error('Login error:', error);
      return null;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // Get user ID for storage keys
  const getUserId = useCallback((): string | null => {
    return user?.id || null;
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    getUserId,
  };
}
