
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { getUserFavorites } from "@/services/favoriteService";
import { getEventById } from "@/services/eventService";
import { FavoriteEvent } from "@/types/ticket";
import { Event } from "@/types/event";
import EventCard from "@/components/EventCard";
import { HeartIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toggleFavoriteNotifications, getNotificationStatus } from "@/services/favoriteService";
import { toast } from "@/components/ui/sonner";

const FavoriteEvents = () => {
  const { user, isAuthenticated } = useAuth();
  const [favoriteEvents, setFavoriteEvents] = useState<Array<{ event: Event; favorite: FavoriteEvent }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFavorites();
    } else {
      setFavoriteEvents([]);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const loadFavorites = () => {
    if (!user) return;
    
    setLoading(true);
    const favorites = getUserFavorites(user.id);
    
    // Get full event data for each favorite
    const eventsWithData = favorites.map(favorite => {
      const event = getEventById(favorite.eventId);
      if (!event) return null;
      return { event, favorite };
    }).filter(item => item !== null) as Array<{ event: Event; favorite: FavoriteEvent }>;
    
    setFavoriteEvents(eventsWithData);
    setLoading(false);
  };

  const handleToggleNotification = (eventId: string) => {
    if (!user) return;
    
    toggleFavoriteNotifications(user.id, eventId);
    
    // Update state
    setFavoriteEvents(prev => prev.map(item => {
      if (item.event.id === eventId) {
        return {
          ...item,
          favorite: {
            ...item.favorite,
            notificationsEnabled: !item.favorite.notificationsEnabled
          }
        };
      }
      return item;
    }));
    
    // Show toast
    const isEnabled = getNotificationStatus(user.id, eventId);
    if (isEnabled) {
      toast.success("Notificações ativadas", {
        description: "Você será notificado quando novos ingressos estiverem disponíveis."
      });
    } else {
      toast.success("Notificações desativadas", {
        description: "Você não receberá mais notificações para este evento."
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-10 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Eventos Favoritos</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <HeartIcon className="h-16 w-16 mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">Faça login para ver seus favoritos</h2>
              <p className="text-muted-foreground mb-4">
                Você precisa estar logado para acompanhar seus eventos favoritos.
              </p>
              <Button asChild>
                <Link to="/login">Fazer Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Seus Eventos Favoritos</h1>
        <p className="text-muted-foreground mb-6">
          Acompanhe seus eventos favoritos e receba notificações
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <p>Carregando seus favoritos...</p>
          </div>
        ) : favoriteEvents.length > 0 ? (
          <div className="space-y-6">
            {favoriteEvents.map(({ event, favorite }) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/4">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="p-4 md:w-3/4">
                    <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      <div>
                        <div className="font-medium">R$ {event.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.availableTickets > 0 
                            ? `${event.availableTickets} ingressos disponíveis` 
                            : "Esgotado"}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`notifications-${event.id}`} 
                            checked={favorite.notificationsEnabled}
                            onCheckedChange={() => handleToggleNotification(event.id)}
                          />
                          <Label htmlFor={`notifications-${event.id}`}>
                            Notificações
                          </Label>
                        </div>
                        
                        <Button asChild disabled={event.availableTickets === 0}>
                          <Link to={`/comprar/${event.id}`}>
                            Comprar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <HeartIcon className="h-16 w-16 mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">Nenhum evento favorito</h2>
              <p className="text-muted-foreground mb-4">
                Você ainda não adicionou nenhum evento aos seus favoritos.
              </p>
              <Button asChild>
                <Link to="/eventos">Explorar Eventos</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default FavoriteEvents;
