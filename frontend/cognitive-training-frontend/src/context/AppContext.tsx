// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Mejoramos la interfaz User con campos adicionales
export interface User {
  id: number;
  username: string;
  email?: string; // Campo opcional para futura expansión
  score: number;
  trainingRoute: string;
  avatar?: string; // Nuevo campo para el avatar
  lastLogin?: Date; // Campo para tracking de actividad
}

interface AppContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void; // Nueva función para actualizaciones parciales
  logout: () => void;
  authLoaded: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // Mejoramos la carga inicial con validación de datos
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === "object") {
            setUserState({
              id: parsedUser.id || 0,
              username: parsedUser.username || "",
              score: parsedUser.score || 0,
              trainingRoute: parsedUser.trainingRoute || "default",
              avatar: parsedUser.avatar || undefined,
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("user");
      } finally {
        setAuthLoaded(true);
      }
    };

    loadUser();
  }, []);

  // Función mejorada para actualizaciones parciales
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUserState(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Función setUser mantenida para compatibilidad
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Logout mejorado
  const logout = () => {
    setUser(null);
    // Agregar aquí cualquier otra limpieza necesaria
  };

  return (
    <AppContext.Provider value={{ user, setUser, updateUser, logout, authLoaded }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook mejorado con validación de tipos
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};