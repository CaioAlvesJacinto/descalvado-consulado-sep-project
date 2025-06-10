
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketInfo } from "@/types/ticket";
import { provideFeedback } from "@/services/feedbackService";

type ValidationStatus = "idle" | "valid" | "invalid" | "used" | "expired" | "tampered";

interface ValidationResultCardProps {
  validationStatus: ValidationStatus;
  ticketInfo: TicketInfo | null;
  onReset: () => void;
  message?: string;
}

const ValidationResultCard = ({ 
  validationStatus, 
  ticketInfo, 
  onReset,
  message 
}: ValidationResultCardProps) => {
  // Provide feedback when the component mounts
  React.useEffect(() => {
    // Only trigger feedback if not idle and if we have window object (client-side)
    if (validationStatus !== "idle" && typeof window !== 'undefined') {
      // Check global settings before providing feedback
      if (window.vibrationEnabled !== false || window.soundEnabled !== false) {
        provideFeedback(validationStatus as 'valid' | 'invalid' | 'used');
      }
    }
  }, [validationStatus]);

  return (
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
              {message || "Este ingresso é válido e pode ser utilizado."}
            </AlertDescription>
          </Alert>
        )}
        
        {validationStatus === "invalid" && (
          <Alert className="border-red-500 bg-red-50">
            <XCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-600">Ingresso Inválido</AlertTitle>
            <AlertDescription className="text-red-700">
              {message || "Não foi possível validar este QR Code. Verifique se o QR Code é válido."}
            </AlertDescription>
          </Alert>
        )}
        
        {validationStatus === "used" && ticketInfo && (
          <Alert className="border-amber-500 bg-amber-50">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-600">Ingresso Já Utilizado</AlertTitle>
            <AlertDescription className="text-amber-700">
              {message || "Este ingresso já foi utilizado anteriormente."}
            </AlertDescription>
          </Alert>
        )}
        
        {validationStatus === "expired" && ticketInfo && (
          <Alert className="border-orange-500 bg-orange-50">
            <Clock className="h-5 w-5 text-orange-600" />
            <AlertTitle className="text-orange-600">Ingresso Expirado</AlertTitle>
            <AlertDescription className="text-orange-700">
              {message || "Este ingresso expirou e não pode mais ser utilizado."}
            </AlertDescription>
          </Alert>
        )}
        
        {validationStatus === "tampered" && (
          <Alert className="border-purple-500 bg-purple-50">
            <Shield className="h-5 w-5 text-purple-600" />
            <AlertTitle className="text-purple-600">Ingresso Adulterado</AlertTitle>
            <AlertDescription className="text-purple-700">
              {message || "Este QR Code parece ter sido adulterado ou é inválido."}
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
        
        <Button onClick={onReset} className="w-full mt-4">
          Escanear Outro Ingresso
        </Button>
      </CardContent>
    </Card>
  );
};

export default ValidationResultCard;
