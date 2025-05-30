// src/context/AppContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getUserById as apiGetUserById, updateUser as apiUpdateUser } from "../utils/api";

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
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
  authLoaded: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState<boolean>(false);

  // Carga inicial del usuario desde localStorage y sincronización con el backend
  useEffect(() => {
    async function loadUserData() {
      try {
        const storedData = localStorage.getItem("user");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData && typeof parsedData === "object") {
            // Validación básica y creación del objeto usuario
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

            try {
              // Sincronizamos con el backend para obtener la versión actualizada del usuario.
              const updatedUser = (await apiGetUserById(validatedUser.id.toString())) as Partial<User>;
              const mergedUser: User = {
                ...validatedUser,
                ...updatedUser, // Se actualizan campos que el backend haya modificado.
                lastLogin: new Date(),
              };
              setUserState(mergedUser);
              localStorage.setItem("user", JSON.stringify(mergedUser));
            } catch (backendError) {
              console.error("Error sincronizando usuario con el backend", backendError);
              setUserState(validatedUser);
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        localStorage.removeItem("user");
      } finally {
        setAuthLoaded(true);
      }
    }

    loadUserData();
  }, []);

  // Actualización parcial del usuario, persiguiendo actualizar también la base de datos a través del backend.
  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        // Declaramos safeUpdates con las propiedades obligatorias definidas explícitamente.
        const safeUpdates: { score: number; trainingRoute: string } = {
          score: updates.score !== undefined ? updates.score : user.score,
          trainingRoute:
            updates.trainingRoute !== undefined ? updates.trainingRoute : user.trainingRoute,
        };

        // Llamamos al endpoint del backend para actualizar el usuario.
        const backendUpdatedUser = (await apiUpdateUser(user.id.toString(), safeUpdates)) as Partial<User>;

        // Fusionamos la información actual, la proveniente del backend y nuestras actualizaciones.
        const updatedUser: User = {
          ...user,
          ...backendUpdatedUser, // Se asume que el backend retorna campos actualizados.
          ...safeUpdates,
          lastLogin: new Date(),
        };
        setUserState(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error updating user on backend:", error);
      }
    }
  };

  // setUser establece el usuario en el contexto y lo persiste en localStorage.
  const setUser = (newUser: User | null) => {
    if (newUser) {
      const completeUser: User = {
        ...newUser,
        createdAt: newUser.createdAt || new Date(),
        lastLogin: new Date(),
      };
      setUserState(completeUser);
      localStorage.setItem("user", JSON.stringify(completeUser));
    } else {
      setUserState(null);
      localStorage.removeItem("user");
    }
  };

  // logout limpia el estado y localStorage; puedes ampliar esta función para invocar un endpoint en el backend si es necesario.
  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");
  };

  return (
    <AppContext.Provider value={{ user, setUser, updateUser, logout, authLoaded }}>
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
