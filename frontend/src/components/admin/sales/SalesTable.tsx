import React from "react";
import { Sale, TicketSale } from "@/types/sales";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  sales: Sale[];
  /** Se precisar de alguma ação (estorno, exclusão etc.) — opcional */
  onDelete?: (sale: Sale) => void;
}

export default function SalesTable({ sales, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Item</th>
            <th>Qtd.</th>
            <th>Valor</th>
            <th>Status</th>
            {onDelete && <th>Ações</th>}
          </tr>
        </thead>

        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td className="font-mono text-xs">{sale.id}</td>

              {/* Tipo */}
              <td>
                <Badge variant={sale.type === "Ingresso" ? "default" : "secondary"}>
                  {sale.type}
                </Badge>
              </td>

              <td>{sale.customerName}</td>

              {/* Data */}
              <td>
                {new Date(sale.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>

              {/* Nome do evento ou produto */}
              <td className="max-w-[200px] truncate">
                {sale.type === "Ingresso"
                  ? (sale as TicketSale).eventName
                  : (sale as any).merchandiseName}
              </td>

              {/* Quantidade */}
              <td>{sale.quantity}</td>

              {/* Valor */}
              <td>R$ {sale.amount.toFixed(2)}</td>

              {/* Status */}
              <td>
                <Badge
                  variant={
                    sale.status === "Pago"
                      ? "default"
                      : sale.status === "Pendente"
                      ? "secondary"
                      : sale.status === "Cancelado"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {sale.status}
                </Badge>
              </td>

              {/* Ações opcionais */}
              {onDelete && (
                <td>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => onDelete(sale)}
                  >
                    Remover
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
