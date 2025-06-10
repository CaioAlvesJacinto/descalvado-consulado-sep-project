// src/components/admin/merchandise/MerchandiseTable.tsx
import React from "react";
import { Merchandise } from "@/types/merchandise";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  products: Merchandise[];
  onEdit?: (item: Merchandise) => void;
  onDelete?: (item: Merchandise) => void;
}

export default function MerchandiseTable({
  products,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Estoque</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>R$ {item.price.toFixed(2)}</td>
              <td>{item.category || "-"}</td>
              <td>{item.stock}</td>
              <td>
                <Badge variant={item.status === "ativo" ? "default" : "destructive"}>
                  {item.status}
                </Badge>
              </td>
              <td>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button variant="outline" onClick={() => onEdit(item)}>
                      Editar
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="destructive" onClick={() => onDelete(item)}>
                      Remover
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
