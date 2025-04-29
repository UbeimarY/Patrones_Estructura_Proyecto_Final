// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User { /* definición de usuario */ }

interface AppContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// El proveedor actúa como sujeto, notificando a sus consumidores cuando cambia el estado.
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    // Aquí también se podrían cerrar tokens, etc.
  };

  return (
    <AppContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
