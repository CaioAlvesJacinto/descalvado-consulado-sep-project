// frontend/src/components/admin/collaborators/CollaboratorForm.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CollaboratorRole,
  CollaboratorStatus,
  DocumentType,
} from "@/types/collaborator";
import { Loader2 } from "lucide-react";

export type CollaboratorFormData = {
  name: string;
  email: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  phone?: string;
  department: string;
  document_type?: DocumentType;
  documento?: string;
  troca_senha_obrigatoria: boolean;
  senha?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CollaboratorFormData) => Promise<{ senha?: string; erro?: string } | void>;
  initialData?: CollaboratorFormData;
};

export default function CollaboratorForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CollaboratorFormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "scanner",
      status: "Ativo",
      phone: "",
      department: "",
      document_type: "CPF",
      documento: "",
      troca_senha_obrigatoria: true,
      senha: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("📦 initialData recebida no formulário:", initialData);
    console.log("🔐 Senha recebida:", initialData?.senha);
    
    if (initialData) {
      reset(initialData);
      if (initialData.senha) {
        setTimeout(() => {
          setValue("senha", initialData.senha);
        }, 0);
      }
    } else {
      reset({
        name: "",
        email: "",
        role: "scanner",
        status: "Ativo",
        phone: "",
        department: "",
        document_type: "CPF",
        documento: "",
        troca_senha_obrigatoria: true,
        senha: "",
      });
    }
  }, [initialData, reset, setValue]);


  const handleInternalSubmit = async (data: CollaboratorFormData) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Colaborador" : "Novo Colaborador"}
          </DialogTitle>
          <DialogDescription /> {/* remove warning */}
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleInternalSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="Nome completo"
              />
              {errors.name && (
                <span className="text-red-600 text-sm">Nome obrigatório</span>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">E-mail obrigatório</span>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                {...register("department", { required: true })}
                placeholder="Departamento"
              />
              {errors.department && (
                <span className="text-red-600 text-sm">Departamento obrigatório</span>
              )}
            </div>

            <div className="space-y-1">
              <Label>Tipo de Documento</Label>
              <Select
                value={watch("document_type")}
                onValueChange={(value) =>
                  setValue("document_type", value as DocumentType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {(["CPF", "CNPJ", "RG", "Passaporte", "Outro"] as DocumentType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="documento">Número do Documento</Label>
              <Input
                id="documento"
                {...register("documento")}
                placeholder="Ex: 12345678900"
              />
            </div>

            <div className="space-y-1">
              <Label>Função</Label>
              <Select
                value={watch("role")}
                onValueChange={(value) =>
                  setValue("role", value as CollaboratorRole)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="scanner">Scanner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as CollaboratorStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label>Senha Gerada</Label>
              <Input
                value={watch("senha") ?? ""}
                placeholder="Nenhuma senha cadastrada"
                disabled
                className="bg-gray-100 select-all"
              />
            </div>

          </div>

          <input
            type="hidden"
            value="true"
            {...register("troca_senha_obrigatoria")}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
