
import Layout from "@/components/Layout";
import QRCodeScanner from "@/components/QRCodeScanner";
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { provideFeedback } from "@/services/feedbackService";

type ValidationStatus = "idle" | "valid" | "invalid" | "used";

interface TicketInfo {
  id: string;
  eventName: string;
  holderName: string;
  purchaseDate: string;
  isValidated: boolean;
}

const ValidateTicket = () => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);

  // In a real application, this would validate with an API
  const validateQRCode = useCallback((qrData: string) => {
    console.log("QR Code scanned:", qrData);
    
    try {
      // Attempt to parse the QR code data
      const parsedData = JSON.parse(qrData);
      
      // Mock validation logic
      if (!parsedData.id) {
        setValidationStatus("invalid");
        // Provide feedback for invalid ticket
        provideFeedback('invalid');
        return;
      }
      
      // Mock ticket database check
      // In a real app, this would make an API request
      if (parsedData.id === "already-used") {
        setValidationStatus("used");
        // Provide feedback for used ticket
        provideFeedback('used');
        setTicketInfo({
          id: parsedData.id,
          eventName: parsedData.eventName || "Evento",
          holderName: parsedData.holderName || "Nome do Participante",
          purchaseDate: parsedData.purchaseDate || "01/01/2023",
          isValidated: true
        });
      } else {
        setValidationStatus("valid");
        // Provide feedback for valid ticket
        provideFeedback('valid');
        setTicketInfo({
          id: parsedData.id,
          eventName: parsedData.eventName || "Feijoada Beneficente",
          holderName: parsedData.holderName || "João Silva",
          purchaseDate: parsedData.purchaseDate || new Date().toLocaleDateString(),
          isValidated: false
        });
      }
    } catch (error) {
      console.error("Error parsing QR code:", error);
      setValidationStatus("invalid");
      // Provide feedback for invalid ticket
      provideFeedback('invalid');
      setTicketInfo(null);
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationStatus("idle");
    setTicketInfo(null);
  }, []);

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Validação de Ingressos</h1>
        
        {validationStatus === "idle" ? (
          <QRCodeScanner onScan={validateQRCode} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Resultado da Validação
              </CardTitle>
              <CardDescription className="text-center">
                Detalhes do ingresso escaneado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationStatus === "valid" && ticketInfo && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-600">Ingresso Válido</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Este ingresso é válido e pode ser utilizado.
                  </AlertDescription>
                </Alert>
              )}
              
              {validationStatus === "invalid" && (
                <Alert className="border-red-500 bg-red-50">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="text-red-600">Ingresso Inválido</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Não foi possível validar este QR Code. Verifique se o QR Code é válido.
                  </AlertDescription>
                </Alert>
              )}
              
              {validationStatus === "used" && ticketInfo && (
                <Alert className="border-amber-500 bg-amber-50">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-600">Ingresso Já Utilizado</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Este ingresso já foi utilizado anteriormente.
                  </AlertDescription>
                </Alert>
              )}
              
              {ticketInfo && (
                <div className="border rounded-lg p-4 mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-sm text-muted-foreground">ID:</span>
                    <span className="text-sm font-medium">{ticketInfo.id}</span>
                    
                    <span className="text-sm text-muted-foreground">Evento:</span>
                    <span className="text-sm font-medium">{ticketInfo.eventName}</span>
                    
                    <span className="text-sm text-muted-foreground">Titular:</span>
                    <span className="text-sm font-medium">{ticketInfo.holderName}</span>
                    
                    <span className="text-sm text-muted-foreground">Data de Compra:</span>
                    <span className="text-sm font-medium">{ticketInfo.purchaseDate}</span>
                    
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={`text-sm font-medium ${ticketInfo.isValidated ? 'text-amber-600' : 'text-green-600'}`}>
                      {ticketInfo.isValidated ? 'Já Utilizado' : 'Não Utilizado'}
                    </span>
                  </div>
                </div>
              )}
              
              <Button onClick={resetValidation} className="w-full mt-4">
                Escanear Outro Ingresso
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ValidateTicket;
