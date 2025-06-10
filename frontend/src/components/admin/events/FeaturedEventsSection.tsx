/*import { useEffect, useState } from "react";
import type { Event } from "@/types/event";
import { getFeaturedEvents } from "@/services/eventService";

export default function FeaturedEventsSection() { 
  // 1) estado sempre inicializado como array vazio
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchar() {
      try {
        setLoading(true);
        const eventos = await getFeaturedEvents();
        // no service, data já é array ou [], mas reforçamos:
        setFeaturedEvents(Array.isArray(eventos) ? eventos : []);
      } catch (err: any) {
        console.error("Erro ao buscar eventos em destaque:", err);
        setError(err.message ?? "Erro desconhecido");
        setFeaturedEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchar();
  }, []);

  if (loading) {
    return <div>Carregando eventos em destaque…</div>;
  }
  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <section>
      <h2>Eventos em Destaque</h2>
      {featuredEvents.length === 0 ? (
        <p>Não há eventos em destaque no momento.</p>
      ) : (
        <ul>
          {featuredEvents.map((evento) => (
            <li key={evento.id}>
              <strong>{evento.title}</strong><br />
              {new Date(evento.start_datetime).toLocaleString("pt-BR")}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
*/;