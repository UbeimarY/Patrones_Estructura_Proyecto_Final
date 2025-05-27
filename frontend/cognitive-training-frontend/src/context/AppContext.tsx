// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email?: string;
  score: number;
  trainingRoute: string;
  avatar?: string;
  lastLogin?: Date;
  createdAt?: Date;
}

interface AppContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  authLoaded: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // Carga inicial del usuario desde localStorage con validación
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem("user");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Validación básica de estructura de usuario
          if (parsedData && typeof parsedData === "object") {
            const validatedUser: User = {
              id: Number(parsedData.id) || 0,
              username: parsedData.username || "Usuario Anónimo",
              score: Number(parsedData.score) || 0,
              trainingRoute: parsedData.trainingRoute || "default",
              email: parsedData.email || undefined,
              avatar: parsedData.avatar || undefined,
              lastLogin: parsedData.lastLogin ? new Date(parsedData.lastLogin) : undefined,
              createdAt: parsedData.createdAt ? new Date(parsedData.createdAt) : new Date(),
            };

            setUserState(validatedUser);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("user");
      } finally {
        setAuthLoaded(true);
      }
    };

    loadUserData();
  }, []);

  // Actualización parcial del usuario
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { 
        ...user, 
        ...updates,
        lastLogin: new Date() // Actualizar última actividad
      };
      setUserState(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Establecer usuario completo
  const setUser = (newUser: User | null) => {
    if (newUser) {
      const completeUser: User = {
        ...newUser,
        createdAt: newUser.createdAt || new Date(),
        lastLogin: new Date()
      };
      setUserState(completeUser);
      localStorage.setItem("user", JSON.stringify(completeUser));
    } else {
      setUserState(null);
      localStorage.removeItem("user");
    }
  };

  // Cerrar sesión con limpieza
  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");
    // Agregar aquí cualquier otra limpieza necesaria
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      updateUser, 
      logout, 
      authLoaded 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};