import { useEffect, useState, useCallback } from "react";
import {
  Collaborator,
  CollaboratorFilters,
  CollaboratorStats,
} from "@/types/collaborator";
import {
  getAllCollaborators,
  getFilteredCollaborators,
  getCollaboratorStats,
  createCollaborator as createCollaboratorInTable,
  updateCollaborator as updateCollaboratorInTable,
  deleteCollaborator as deleteCollaboratorInTable,
  getCollaboratorById, // 👈 IMPORTANTE
} from "@/services/collaboratorService";
import type { CollaboratorFormData } from "@/components/admin/collaborators/CollaboratorForm";
import { useToast } from "@/hooks/useToast";

type NewCollaboratorData = Omit<CollaboratorFormData, "senha"> & {
  troca_senha_obrigatoria: boolean;
};

export function useCollaborators(initial: CollaboratorFilters = {}) {
  const [all, setAll] = useState<Collaborator[]>([]);
  const [filters, setFilters] = useState<CollaboratorFilters>(initial);
  const [list, setList] = useState<Collaborator[]>([]);
  const [stats, setStats] = useState<CollaboratorStats>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    admins: 0,
    scanners: 0,
  });
  const [loading, setLoading] = useState(true);

  const [collaboratorDialogOpen, setCollaboratorDialogOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState<
    (CollaboratorFormData & { id?: string; senha?: string }) | null
  >(null);
  const [collaboratorDeleteDialogOpen, setCollaboratorDeleteDialogOpen] =
    useState(false);
  const [collaboratorToDelete, setCollaboratorToDelete] =
    useState<Collaborator | null>(null);

  const { toast } = useToast();

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await getAllCollaborators();
    setAll(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const filtered = getFilteredCollaborators(all, filters);
    setList(filtered);
    setStats(getCollaboratorStats(filtered));
  }, [all, filters]);

  async function handleCollaboratorSubmit(
    data: CollaboratorFormData
  ): Promise<{ senha?: string; erro?: string; colaborador?: Collaborator }> {

    try {
      if (editingCollaborator?.id) {
        await updateCollaboratorInTable(editingCollaborator.id, data);
        toast({ title: "Colaborador atualizado com sucesso!" });

        setCollaboratorDialogOpen(false);
        setEditingCollaborator(null);
        await reload();
        return {};
      } else {
        const result = await createCollaboratorInTable({
          ...data,
          troca_senha_obrigatoria: true,
        } as NewCollaboratorData);

        if (!result.colaborador) {
          if (result.erro === "email_existente") {
            toast({ title: "E-mail já existente", variant: "destructive" });
            return { erro: "email_exists" };
          }
          if (result.erro === "rate_limit") {
            toast({
              title: "Limite atingido. Aguarde alguns minutos e tente novamente.",
              variant: "destructive",
            });
            return { erro: "rate_limit" };
          }

          toast({
            title: "Erro ao criar colaborador",
            description: "Tente novamente mais tarde.",
            variant: "destructive",
          });
          return { erro: "create_error" };
        }

        toast({ title: "Colaborador criado com sucesso!" });

        // ✅ Exibe o colaborador com senha e reabre modal
        setEditingCollaborator({ ...result.colaborador, senha: result.senha });
        setCollaboratorDialogOpen(true);

        // ⏳ Recarrega depois de exibir senha
        setTimeout(() => {
          reload();
        }, 500);

        return { senha: result.senha };
      }
    } catch (e) {
      console.error("Erro inesperado ao salvar colaborador", e);
      toast({ title: "Erro inesperado", variant: "destructive" });
      return { erro: "unknown" };
    }
  }

  async function handleEditCollaborator(c: Collaborator) {
    const fullData = await getCollaboratorById(c.id);
    if (fullData) {
      setEditingCollaborator({ ...fullData });
      setCollaboratorDialogOpen(true);
    } else {
      toast({
        title: "Erro ao carregar dados do colaborador",
        variant: "destructive",
      });
    }
  }

  async function confirmDeleteCollaborator() {
    if (collaboratorToDelete) {
      await deleteCollaboratorInTable(collaboratorToDelete.id);
      toast({ title: "Colaborador removido com sucesso!" });
      setCollaboratorDeleteDialogOpen(false);
      setCollaboratorToDelete(null);
      await reload();
    }
  }

  return {
    collaborators: list,
    filters,
    setFilters,
    stats,
    loading,
    reload,
    collaboratorDialogOpen,
    setCollaboratorDialogOpen,
    editingCollaborator,
    setEditingCollaborator,
    collaboratorDeleteDialogOpen,
    setCollaboratorDeleteDialogOpen,
    collaboratorToDelete,
    setCollaboratorToDelete,
    handleCollaboratorSubmit,
    handleEditCollaborator, // 👈 novo handler com senha
    confirmDeleteCollaborator,
  };
}
