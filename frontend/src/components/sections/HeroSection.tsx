import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getFeaturedEvents } from "@/services/eventService";
import { useAutoplayCarousel } from "@/hooks/useAutoplayCarousel";
import type { Event } from "@/types/event";

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await getFeaturedEvents();
      setFeaturedEvents(events || []);
    };
    fetchEvents();
  }, []);

  useAutoplayCarousel({
    api,
    delay: 6000,
    stopOnInteraction: true,
  });

  return (
    <section className="bg-accent py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="relative"
        >
          <CarouselContent>
            {/* Slide 1: Conteúdo promocional da plataforma */}
            <CarouselItem>
              <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                <div className="flex flex-col gap-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Participe dos eventos da <span className="gradient-heading">Associação Palestra</span> de Descalvado
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Adquira ingressos para os eventos da Associação Palestra de Descalvado
                    e confira nossa coleção oficial de camisetas e produtos exclusivos.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                    <Button size="lg" asChild>
                      <Link to="/eventos">Comprar Ingressos</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/loja">Ver Nossa Loja</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070"
                    alt="Eventos da Associação Palestra"
                    className="w-full h-auto object-cover rounded-xl shadow-lg"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
            </CarouselItem>

            {/* Slides 2...n: Eventos em destaque */}
            {featuredEvents.map((event) => (
              <CarouselItem key={event.id}>
                <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center rounded-lg bg-green-100 px-3 py-1 text-xs font-medium text-green-700 mb-2 w-fit">
                      Próximo Evento
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      {event.title}
                    </h1>
                    <p className="text-muted-foreground text-lg line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.start_datetime).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {event.available_tickets} ingressos disponíveis
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {Number(event.price).toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">por pessoa</span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                      <Button size="lg" asChild>
                        <Link to={`/comprar/${event.id}`}>Comprar Ingresso</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link to="/eventos">Ver Todos os Eventos</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-auto object-cover rounded-xl shadow-lg"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navegação e indicadores - aparece só se houver slides de eventos */}
          {featuredEvents.length > 0 && (
            <>
              <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-14 z-20" />
              <CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-14 z-20" />
              <div className="flex justify-center mt-8 space-x-2">
                {[...Array(1 + featuredEvents.length)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === 0 ? "bg-primary" : "bg-primary/30"
                    }`}
                  ></div>
                ))}
              </div>
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default HeroSection;
