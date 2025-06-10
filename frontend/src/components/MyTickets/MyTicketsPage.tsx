import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents } from "@/services/eventService";
import { getTicketsByUserId } from "@/services/ticketService";
import { TicketInfo } from "@/types/ticket";
import TicketsAccordion from "./TicketsAccordion";
import UpcomingEventsList from "./UpcomingEventsList";


const MyTicketsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tickets");
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (user?.id) {
        const userTickets = await getTicketsByUserId(user.id);
        setTickets(userTickets ?? []);
      }
    };
    const fetchEvents = async () => {
      const eventList = await getAllEvents();
      setEvents(eventList ?? []);
    };
    fetchTickets();
    fetchEvents();
  }, [user]);

  return (
    <Layout>
      <div className="container py-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Meus Ingressos</h1>
        <p className="text-muted-foreground mb-6">
          Olá, {user?.name}. Gerencie seus ingressos.
        </p>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets">Meus Ingressos</TabsTrigger>
            <TabsTrigger value="events">Próximos Eventos</TabsTrigger>
          </TabsList>
          <TabsContent value="tickets">
            <TicketsAccordion tickets={tickets} events={events} />
          </TabsContent>
          <TabsContent value="events">
            <UpcomingEventsList events={events} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyTicketsPage;
