
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListFilter } from "lucide-react";
import { TicketInfo } from "@/types/ticket";

interface ValidationHistoryCardProps {
  validations: TicketInfo[];
}

const ValidationHistoryCard = ({ validations }: ValidationHistoryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Validações</CardTitle>
        <CardDescription>
          Ingressos verificados recentemente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validations.length > 0 ? (
          <div className="space-y-4">
            {validations.map((validation, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{validation.holderName}</div>
                  <Badge variant={validation.isValidated ? "outline" : "default"}>
                    {validation.isValidated ? 'Validado' : 'Novo'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {validation.eventName} • {validation.validatedAt || "Agora"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
            <ListFilter className="h-8 w-8 mb-2 opacity-50" />
            <p>Nenhuma validação recente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValidationHistoryCard;
