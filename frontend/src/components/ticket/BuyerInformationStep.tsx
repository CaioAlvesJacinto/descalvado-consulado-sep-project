
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface BuyerFormData {
  name: string;
  email: string;
  phone: string;
  quantity: string;
}

interface BuyerInformationStepProps {
  formData: BuyerFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const BuyerInformationStep = ({ 
  formData, 
  handleChange, 
  handleSelectChange, 
  handleSubmit 
}: BuyerInformationStepProps) => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <>
      <CardHeader>
        <CardTitle>Informações do Participante</CardTitle>
        <CardDescription>
          {isAuthenticated 
            ? `Comprando como ${user?.name}` 
            : "Preencha seus dados para emissão do ingresso"}
        </CardDescription>
        {isAuthenticated && (
          <Badge variant="outline" className="mt-2">Usuário Autenticado</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} id="buyer-form">
          <div className="space-y-4">
            {!isAuthenticated && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Digite seu nome completo" 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="seu.email@exemplo.com" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    placeholder="(00) 00000-0000" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {isAuthenticated && (
              <div className="space-y-4 bg-muted/30 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm font-medium">Nome:</span>
                  <span>{formData.name}</span>
                  <span className="text-sm font-medium">Email:</span>
                  <span>{formData.email}</span>
                  {formData.phone && (
                    <>
                      <span className="text-sm font-medium">Telefone:</span>
                      <span>{formData.phone}</span>
                    </>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade de Ingressos</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("quantity", value)}
                defaultValue={formData.quantity}
              >
                <SelectTrigger id="quantity">
                  <SelectValue placeholder="Selecione a quantidade" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Total: R$ {(parseInt(formData.quantity) * 45).toFixed(2)}
        </div>
        <Button type="submit" form="buyer-form">
          Continuar para Pagamento
        </Button>
      </CardFooter>
    </>
  );
};

export default BuyerInformationStep;
