
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Merchandise } from "@/types/merchandise";
import MerchandiseForm from "./MerchandiseForm";
import { useToast } from "@/hooks/use-toast";

interface MerchandiseDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  merchandise?: Merchandise;
  onSubmit: (data: any) => void;
  events?: { id: string; name: string }[];
}

export const MerchandiseDialog = ({
  children,
  title,
  description,
  merchandise,
  onSubmit,
  events,
}: MerchandiseDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: any) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <MerchandiseForm
          initialData={merchandise}
          onSubmit={handleSubmit}
          events={events}
        />
      </DialogContent>
    </Dialog>
  );
};

interface DeleteMerchandiseDialogProps {
  children: React.ReactNode;
  merchandise: Merchandise;
  onConfirm: () => void;
}

export const DeleteMerchandiseDialog = ({
  children,
  merchandise,
  onConfirm,
}: DeleteMerchandiseDialogProps) => {
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm();
    toast({
      title: "Produto excluído",
      description: `${merchandise.name} foi removido com sucesso.`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir o produto "{merchandise.name}"?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
