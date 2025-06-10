import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PublicRouteProtection = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  // Redireciona gerentes e colaboradores para suas rotas específicas
  if (user?.role === "gerente") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "colaborador") {
    return <Navigate to="/colaborador" replace />;
  }

  // Se a rota exige login e o usuário ainda não está logado, envia para login com estado de origem
  const protectedPaths = ["/checkout", "/carrinho", "/favoritos", "/meus-ingressos"];
  if (!isAuthenticated && protectedPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default PublicRouteProtection;
