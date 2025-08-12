'use client'
import { useRouter } from 'next/navigation';
import { createContext, useContext, useCallback, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  isAdmin?: boolean;
  password?: string;
  createdAt: string;
  lastLogin: string;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
  };
  todoList?: TodoItem[];
  history?: HistoryItem[];
  savedItems?: SavedItem[];
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'career' | 'study' | 'general';
}

export interface SavedItem {
  id: string;
  title: string;
  content: string;
  category: string;
  savedAt: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    changePassword: (userId: string, newPassword: string) => void;
    addTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
    updateTodo: (todoId: string, updates: Partial<TodoItem>) => void;
    deleteTodo: (todoId: string) => void;
    addHistory: (history: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
    saveItem: (item: Omit<SavedItem, 'id' | 'savedAt'>) => void;
    deleteSavedItem: (itemId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const storedUser = localStorage.getItem('career-compass-user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    localStorage.removeItem('career-compass-user');
  }
  return null;
}

const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedUsers = localStorage.getItem('career-compass-users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error('Failed to parse users from localStorage', error);
    localStorage.removeItem('career-compass-users');
  }
  return [];
}

const saveUsersToStorage = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('career-compass-users', JSON.stringify(users));
  }
}

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'career-compass-user') {
         setUser(getUserFromStorage());
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
        window.removeEventListener('storage', handleStorageChange)
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      saveUsersToStorage(updatedUsers);
      
      localStorage.setItem('career-compass-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      if (updatedUser.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      // Check if it's admin login
      if (email === 'admin@careercompass.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email: 'admin@careercompass.com',
          name: 'Administrator',
          image: 'https://api.dicebear.com/8.x/initials/svg?seed=Admin',
          isAdmin: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        localStorage.setItem('career-compass-user', JSON.stringify(adminUser));
        setUser(adminUser);
        router.push('/admin');
      } else {
        // Create new user if not exists
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0].replace(/(?:^|\s)\S/g, a => a.toUpperCase()),
          image: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(email.split('@')[0])}`,
          isAdmin: false,
          password,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: { theme: 'light', language: 'en' },
          todoList: [],
          history: [],
          savedItems: [],
        };
        
        const updatedUsers = [...users, newUser];
        saveUsersToStorage(updatedUsers);
        localStorage.setItem('career-compass-user', JSON.stringify(newUser));
        setUser(newUser);
        router.push('/dashboard');
      }
    }
  }, [router]);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('career-compass-user');
        setUser(null);
        router.push('/login');
    }
  }, [router]);
  
  const updateUser = useCallback((updatedUser: User) => {
    const users = getUsersFromStorage();
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsersToStorage(updatedUsers);
    
    localStorage.setItem('career-compass-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const changePassword = useCallback((userId: string, newPassword: string) => {
    const users = getUsersFromStorage();
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, password: newPassword } : u
    );
    saveUsersToStorage(updatedUsers);
    
    if (user?.id === userId) {
      const updatedUser = { ...user, password: newPassword };
      localStorage.setItem('career-compass-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  const addTodo = useCallback((todo: Omit<TodoItem, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    const newTodo: TodoItem = {
      ...todo,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUser = {
      ...user,
      todoList: [...(user.todoList || []), newTodo]
    };
    
    updateUser(updatedUser);
  }, [user, updateUser]);

  const updateTodo = useCallback((todoId: string, updates: Partial<TodoItem>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      todoList: (user.todoList || []).map(todo =>
        todo.id === todoId ? { ...todo, ...updates } : todo
      )
    };
    
    updateUser(updatedUser);
  }, [user, updateUser]);

  const deleteTodo = useCallback((todoId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      todoList: (user.todoList || []).filter(todo => todo.id !== todoId)
    };
    
    updateUser(updatedUser);
  }, [user, updateUser]);

  const addHistory = useCallback((history: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if (!user) return;
    
    const newHistory: HistoryItem = {
      ...history,
      id: `history-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    const updatedUser = {
      ...user,
      history: [...(user.history || []), newHistory]
    };
    
    updateUser(updatedUser);
  }, [user, updateUser]);

  const saveItem = useCallback((item: Omit<SavedItem, 'id' | 'savedAt'>) => {
    if (!user) return;
    
    const newSavedItem: SavedItem = {
      ...item,
      id: `saved-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    
    const updatedUser = {
      ...user,
      savedItems: [...(user.savedItems || []), newSavedItem]
    };
    
    updateUser(updatedUser);
  }, [user, updateUser]);

  const deleteSavedItem = useCallback((itemId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      savedItems: (user.savedItems || []).filter(item => item.id !== itemId)
    };
    
    updateUser(updatedUser);
  }, [user, updateUser]);

  const value = { 
    user, 
    login, 
    logout, 
    loading, 
    updateUser, 
    changePassword,
    addTodo,
    updateTodo,
    deleteTodo,
    addHistory,
    saveItem,
    deleteSavedItem
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
