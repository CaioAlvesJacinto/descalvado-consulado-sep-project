import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logo = () => {
  const { user } = useAuth();

  const getLogoLink = () => {
    if (user?.role === "gerente") return "/admin";
    if (user?.role === "colaborador") return "/colaborador";
    if (user?.role === "participante") return "/";
    return "/";
  };

  return (
    <Link to={getLogoLink()} className="flex items-center gap-3 group">
      <img
        src="/images/logos/logo-consulado-palmeiras.jpg"
        alt="Logo da Associação Palestra de Descalvado"
        className="h-12 w-auto transition-transform group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      <div className="font-semibold text-xl text-primary">
        Associação Palestra<span className="text-secondary"> - Descalvado</span>
      </div>
    </Link>
  );
};

export default Logo;
