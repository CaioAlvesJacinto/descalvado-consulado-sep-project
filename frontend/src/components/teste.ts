// Pseudocódigo! Adapte para o seu arquivo real:
import { useEffect, useState } from "react";
import { getAllEvents } from "@/services/eventService";
import EventCard from "./EventCard";

export default function EventsListPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getAllEvents().then((data) => {
      console.log("Eventos vindos do Supabase:", data); // <-- Coloque aqui!
      setEvents(data);
    });
  }, []);

  return (
    <section>
      {events.map(event => (
        <EventCard key={event.id} {...event} />
      ))}
    </section>
  );
}
