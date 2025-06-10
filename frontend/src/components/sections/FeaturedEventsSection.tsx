import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getFeaturedEvents } from "@/services/eventService";
import type { Event } from "@/types/event";
import EventCard from "@/components/EventCard";

const FeaturedEventsSection = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getFeaturedEvents();
      setFeaturedEvents(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-8">Carregando eventos em destaque...</p>
    );
  }

  if (!featuredEvents.length) {
    return (
      <p className="text-center py-8">Nenhum evento em destaque no momento.</p>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Título e descrição */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Próximos Eventos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Participe dos nossos eventos beneficentes e ajude a transformar nossa
            comunidade. Cada ingresso contribui para projetos sociais importantes.
          </p>
        </div>

        {/* Grid de cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredEvents.map((e) => (
            <EventCard
              key={e.id}
              id={e.id}
              title={e.title}
              description={e.description}
              start_datetime={new Date(e.start_datetime).toLocaleDateString("pt-BR")}
              location={e.location}
              price={e.price}
              image={e.image}
              available_tickets={e.available_tickets}
              sold_tickets={e.sold_tickets}
              category={e.category}
            />
          ))}

        </div>

        {/* Botão “Ver todos” */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/eventos">
              Ver Todos os Eventos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEventsSection;
