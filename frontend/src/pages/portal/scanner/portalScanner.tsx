
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import QRCodeScanner from "@/components/QRCodeScanner";
import EventSelectionCard from "@/components/EventSelectionCard";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ValidationResultCard from "@/components/ticket-validation/ValidationResultCard";
import { validateTicketQRCode, ValidationStatus } from "@/services/ticketValidationService";
import { TicketInfo } from "@/types/ticket";
import { ArrowLeft, QrCode } from "lucide-react";
import { getActiveEvents } from "@/services/eventService";
import { saveValidationRecord } from "@/services/validationHistoryService";

const ColaboradorDashboard = () => {
  const { user } = useAuth();
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string } | null>(null);
  const [activeTab, setActiveTab] = useState("events");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);
  const [scannerKey, setScannerKey] = useState(0); // Key to force remount of scanner

  // Load active events from event service (only future/today events)
    useEffect(() => {
    async function fetchEvents() {
        const events = await getActiveEvents();
        const transformedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.start_datetime,      // ou event.date, se existir
        location: event.location,
        availableTickets: event.available_tickets,
        category: event.category,
        }));
        setAvailableEvents(transformedEvents);
    }
    fetchEvents();
    }, []);

  const handleEventSelect = (eventId: string, eventTitle: string) => {
    setSelectedEvent({ id: eventId, title: eventTitle });
    setActiveTab("scanner");
    resetValidation();
    // Force remount of scanner when event changes
    setScannerKey(prev => prev + 1);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setActiveTab("events");
    resetValidation();
    // Force cleanup of current scanner
    setScannerKey(prev => prev + 1);
  };

  const handleQRCodeScan = async (qrData: string) => {
    console.log("QR Code scanned for event:", selectedEvent?.title, qrData);
    
    try {
      const result = await validateTicketQRCode(qrData);
      setValidationStatus(result.status);
      setTicketInfo(result.ticketInfo);
      setValidationMessage(result.message);
      
      // Save validation record only for valid statuses (excluding "idle")
      if (result.ticketInfo && user?.id && user?.name && result.status !== "idle") {
        saveValidationRecord(
          result.ticketInfo, 
          user.id, 
          user.name, 
          result.status as "valid" | "invalid" | "used" | "expired"
        );
      }
    } catch (error) {
      console.error('Error validating QR code:', error);
      setValidationStatus("invalid");
      setTicketInfo(null);
      setValidationMessage("Erro interno na validação do ingresso.");
    }
  };

  const resetValidation = () => {
    setValidationStatus("idle");
    setTicketInfo(null);
    setValidationMessage(undefined);
  };

  // Clean up scanner when tab changes away from scanner
  const handleTabChange = (value: string) => {
    if (activeTab === "scanner" && value !== "scanner") {
      // Force cleanup of scanner before changing tabs
      setScannerKey(prev => prev + 1);
    }
    setActiveTab(value);
    if (value !== "scanner") {
      resetValidation();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setScannerKey(prev => prev + 1);
    };
  }, []);

  return (
    <Layout>
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Painel do Colaborador</h1>
          <p className="text-muted-foreground">Selecione um evento para fazer CheckIn dos participantes.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="scanner" disabled={!selectedEvent}>
              Scanner QR Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <div className="space-y-4">
              <div className="text-center py-4">
                <QrCode className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <h3 className="text-lg font-medium">Escolha um Evento</h3>
                <p className="text-muted-foreground">Selecione o evento para o qual você irá fazer CheckIn dos participantes</p>
              </div>
              
              {availableEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableEvents.map((event) => (
                    <EventSelectionCard
                      key={event.id}
                      {...event}
                      onSelect={handleEventSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum evento disponível para CheckIn no momento.</p>
                  <p className="text-sm mt-2">Eventos passados não são exibidos.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scanner">
            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
                  <Button variant="outline" size="sm" onClick={handleBackToEvents}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar aos Eventos
                  </Button>
                  <div>
                    <h3 className="font-medium">Fazendo CheckIn para:</h3>
                    <p className="text-sm text-muted-foreground">{selectedEvent.title}</p>
                  </div>
                </div>
                
                {validationStatus === "idle" ? (
                  <QRCodeScanner 
                    key={scannerKey} 
                    onScan={handleQRCodeScan} 
                  />
                ) : (
                  <ValidationResultCard 
                    validationStatus={validationStatus} 
                    ticketInfo={ticketInfo} 
                    onReset={resetValidation} 
                    message={validationMessage}
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ColaboradorDashboard;