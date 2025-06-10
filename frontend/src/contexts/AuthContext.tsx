import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/supabaseClient";

export type UserRole = "gerente" | "colaborador" | "participante";

export interface User {
  id: string;
  name: string;         // Nome completo, gerado pela trigger
  email: string;
  role: UserRole;
  first_name?: string;  // Novos campos opcionais
  last_name?: string;
  telefone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mapeia roles do Supabase para roles da aplicação
  const mapRole = (supabaseRole: string): UserRole => {
    switch (supabaseRole) {
      case "admin":
        return "gerente";
      case "scanner":
        return "colaborador";
      case "buyer":
      default:
        return "participante";
    }
  };

  // Verifica sessão atual
  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile, error } = await supabase
          .from("users")
          .select("id, email, name, role, first_name, last_name, telefone")
          .eq("id", authUser.id)
          .single();

        if (profile && !error) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: mapRole(profile.role),
            first_name: profile.first_name,
            last_name: profile.last_name,
            telefone: profile.telefone,
          });
        }
      }

      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message || "Credenciais inválidas");
    }

    // Recarrega perfil do usuário após login
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const { data: profile, error } = await supabase
        .from("users")
        .select("id, email, name, role, first_name, last_name, telefone")
        .eq("id", authUser.id)
        .single();

      if (profile && !error) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: mapRole(profile.role),
          first_name: profile.first_name,
          last_name: profile.last_name,
          telefone: profile.telefone,
        });
      }
    }

    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }

    // "gerente" tem acesso completo
    if (user.role === "gerente") return true;

    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
