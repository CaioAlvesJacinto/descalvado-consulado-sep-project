// EventsTable.tsx
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Event } from "@/types/event";

type Props = {
  events: Event[];
  onEdit: (e: Event) => void;
  onDelete: (e: Event) => void;
};

export default function EventsTable({ events, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Local</TableHead>
          <TableHead>Ingressos</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.title}</TableCell>
            <TableCell>
              {event.start_datetime
                ? new Date(event.start_datetime).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : ""}
            </TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>{event.available_tickets ?? "-"}</TableCell>
            <TableCell>
              {typeof event.price === "number"
                ? `R$ ${event.price.toFixed(2)}`
                : "-"}
            </TableCell>
            <TableCell>{event.status ?? "-"}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button size="sm" onClick={() => onEdit(event)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(event)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
