import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getEventById } from "@/services/eventService";
import { Event } from "@/types/event";
import { useAuth } from "@/contexts/AuthContext";
import BuyTicketStepHeader from "@/components/ticket/BuyTicketStepHeader";
import BuyerInformationStep from "@/components/ticket/BuyerInformationStep";

const BuyTicket = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: "1",
  });
  const [event, setEvent] = useState<Event | null>(null);

  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId } = useParams();

useEffect(() => {
  if (!eventId) return;

  const fetchEvent = async () => {
    const result = await getEventById(eventId);
    if (result) {
      setEvent(result);
      console.log("Evento carregado:", result); // <-- Adicione aqui
    } else {
      toast({
        title: "Evento não encontrado",
        description: "Verifique o link ou tente novamente mais tarde.",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  fetchEvent();
}, [eventId]);


  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!formData.name || !formData.email || !event) {
      toast({
        title: "Informações incompletas",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(formData.quantity);

    const purchase = {
      valor: quantity * event.price,
      descricao: "Compra de ingressos",
      comprador: {
        name: formData.name,
        email: formData.email,
      },
      eventos: [
        {
          eventoId: event.id,
          nameEvento: event.title,
          quantidade: quantity,
          unitPrice: event.price,
          totalPrice: quantity * event.price,
        },
      ],
    };


    setStep(2);
    navigate("/checkout", { state: { purchase } });
  };

  if (!event) {
    return (
      <Layout>
        <div className="container py-8 max-w-xl mx-auto text-center">
          <p className="text-muted-foreground">Carregando informações do evento...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2">Compra de Ingressos</h1>
        <p className="text-muted-foreground text-center mb-8">
          {event.title} - R$ {event.price.toFixed(2)}
        </p>

        <BuyTicketStepHeader currentStep={step} />

        <Card>
          {step === 1 && (
            <BuyerInformationStep
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleSubmit={handleSubmit}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default BuyTicket;
