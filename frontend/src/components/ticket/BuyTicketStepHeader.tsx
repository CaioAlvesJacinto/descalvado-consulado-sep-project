
import React from "react";

interface BuyTicketStepHeaderProps {
  currentStep: number;
}

const BuyTicketStepHeader = ({ currentStep }: BuyTicketStepHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-primary" : "bg-muted"
            } text-primary-foreground text-sm mb-2`}
          >
            1
          </div>
          <span className="text-xs">Informações</span>
        </div>
        <div
          className={`h-0.5 flex-1 mx-2 ${
            currentStep >= 2 ? "bg-primary" : "bg-muted"
          }`}
        />
        <div className="flex flex-col items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-primary" : "bg-muted"
            } text-primary-foreground text-sm mb-2`}
          >
            2
          </div>
          <span className="text-xs">Pagamento</span>
        </div>
        <div
          className={`h-0.5 flex-1 mx-2 ${
            currentStep >= 3 ? "bg-primary" : "bg-muted"
          }`}
        />
        <div className="flex flex-col items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-primary" : "bg-muted"
            } text-primary-foreground text-sm mb-2`}
          >
            3
          </div>
          <span className="text-xs">Ingresso</span>
        </div>
      </div>
    </div>
  );
};

export default BuyTicketStepHeader;
