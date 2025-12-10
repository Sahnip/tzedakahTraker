import { useState, useCallback, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

const STORAGE_KEY = 'tzedakah_current_user';
const USERS_STORAGE_KEY = 'tzedakah_users';

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = loadFromStorage<User | null>(STORAGE_KEY, null);
    if (stored) {
      return {
        ...stored,
        createdAt: new Date(stored.createdAt),
      };
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Register new user
  const register = useCallback((email: string, password: string, name?: string): User | null => {
    // Load existing users
    const users = loadFromStorage<Array<{ email: string; password: string; user: User }>>(USERS_STORAGE_KEY, []);
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return null; // User already exists
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date(),
    };

    // Save user to users list
    users.push({
      email,
      password, // In production, this should be hashed
      user: newUser,
    });
    saveToStorage(USERS_STORAGE_KEY, users);

    // Set as current user
    setUser(newUser);
    saveToStorage(STORAGE_KEY, newUser);

    return newUser;
  }, []);

  // Login
  const login = useCallback((email: string, password: string): User | null => {
    const users = loadFromStorage<Array<{ email: string; password: string; user: User }>>(USERS_STORAGE_KEY, []);
    
    const userData = users.find(u => u.email === email && u.password === password);
    
    if (userData) {
      const user = {
        ...userData.user,
        createdAt: new Date(userData.user.createdAt),
      };
      setUser(user);
      saveToStorage(STORAGE_KEY, user);
      return user;
    }

    return null; // Invalid credentials
  }, []);

  // Logout
  const logout = useCallback(() => {
    // Capture user ID before clearing
    const userId = user?.id;
    
    // Clear user session
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    
    // Clear all user-specific data from localStorage
    if (userId) {
      localStorage.removeItem(`tzedakah_incomes_${userId}`);
      localStorage.removeItem(`tzedakah_donations_${userId}`);
      localStorage.removeItem(`tzedakah_beneficiaries_${userId}`);
    }
  }, [user]);

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

