import { useToast as useRadixToast } from "@/components/ui/use-toast";

export function useToast() {
  const { toast } = useRadixToast();

  const showSuccess = (message: string) =>
    toast({
      title: "Sucesso",
      description: message,
      variant: "default",
    });

  const showError = (message: string) =>
    toast({
      title: "Erro",
      description: message,
      variant: "destructive",
    });

  return {
    toast,
    showSuccess,
    showError,
  };
}
