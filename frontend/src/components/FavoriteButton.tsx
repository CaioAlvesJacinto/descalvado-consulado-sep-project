
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addEventToFavorites, removeEventFromFavorites, isEventFavorited } from "@/services/favoriteService";
import { toast } from "@/components/ui/sonner";

interface FavoriteButtonProps {
  eventId: string;
  compact?: boolean;
}

const FavoriteButton = ({ eventId, compact = false }: FavoriteButtonProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const favorited = isEventFavorited(user.id, eventId);
      setIsFavorite(favorited);
    }
  }, [user, eventId, isAuthenticated]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated || !user) {
      toast.error("Você precisa estar logado para favoritar eventos.", {
        description: "Faça login para salvar seus eventos favoritos."
      });
      return;
    }

    try {
      if (isFavorite) {
        removeEventFromFavorites(user.id, eventId);
        setIsFavorite(false);
        toast.success("Evento removido dos favoritos");
      } else {
        addEventToFavorites(user.id, eventId);
        setIsFavorite(true);
        toast.success("Evento adicionado aos favoritos", {
          description: "Você receberá notificações quando novos ingressos estiverem disponíveis."
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Erro ao atualizar favoritos");
    }
  };

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size={compact ? "sm" : "default"}
      className={`${isFavorite ? "bg-red-500 hover:bg-red-600" : ""} ${compact ? "w-9 p-0" : ""}`}
      onClick={handleToggleFavorite}
    >
      <HeartIcon className={`${compact ? "h-4 w-4" : "h-5 w-5 mr-2"} ${isFavorite ? "fill-current" : ""}`} />
      {!compact && (isFavorite ? "Favorito" : "Favoritar")}
    </Button>
  );
};

export default FavoriteButton;
