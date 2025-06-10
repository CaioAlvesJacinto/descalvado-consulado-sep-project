import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents, getEventCategories, searchEvents } from "@/services/eventService";
import { Event } from "@/types/event";
import { CalendarIcon, SearchIcon } from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState("all");

  // Carrega eventos e categorias ao montar o componente
  useEffect(() => {
    (async () => {
      const allEvents = await getAllEvents();
      setEvents(allEvents);

      const allCategories = await getEventCategories();
      setCategories(allCategories);
    })();
  }, []);

  // Busca eventos por texto
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setEvents(await getAllEvents());
      return;
    }

    const results = await searchEvents(searchQuery);
    setEvents(results);
    setCurrentCategory("all");
  };

  // Filtra eventos por categoria
  const handleCategoryChange = async (category: string) => {
    setCurrentCategory(category);

    if (category === "all") {
      setEvents(await getAllEvents());
    } else {
      const filteredEvents = (await getAllEvents()).filter(
        (event) => (event.category || "") === category
      );
      setEvents(filteredEvents);
    }
    setSearchQuery("");
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">Nossos Eventos</h1>
        <p className="text-muted-foreground mb-6">
          Explore nossos eventos beneficentes e participe da nossa causa.
        </p>

        {/* Busca e filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar eventos..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Buscar</Button>
        </div>

        {/* Abas de categoria */}
        <Tabs defaultValue="all" value={currentCategory} className="mb-8">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all" onClick={() => handleCategoryChange("all")}>
              Todos
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={currentCategory} className="mt-0">
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description || ""}
                    start_datetime={event.start_datetime}
                    location={event.location || ""}
                    price={event.price}
                    image={event.image || ""}
                    available_tickets={event.available_tickets || 0}
                    sold_tickets={event.sold_tickets || 0}
                    category={event.category || ""}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Nenhum evento encontrado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Não encontramos eventos correspondentes à sua busca.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Events;
