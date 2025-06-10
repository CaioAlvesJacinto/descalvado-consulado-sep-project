// frontend/src/services/collaboratorService.ts
import { supabase } from "@/integrations/supabase/supabaseClient";
import {
  Collaborator,
  CollaboratorFilters,
  CollaboratorStats,
  CollaboratorRole,
  CollaboratorStatus,
  DocumentType,
} from "@/types/collaborator";

/* ------------------------------------------------------------------ */
/* CRUD                                                               */
/* ------------------------------------------------------------------ */
export async function getAllCollaborators(): Promise<Collaborator[]> {
  const { data, error } = await supabase
    .from("collaborators")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return [];
  }

  return (data ?? []).map(rowToCollaborator);
}

export async function createCollaborator(
  payload: Omit<
    Collaborator,
    "id" | "createdAt" | "updatedAt" | "created_by" | "updated_by"
  >
): Promise<{
  colaborador: Collaborator | null;
  senha?: string;
  erro?: "email_existente" | "rate_limit" | "auth_error" | "insert_error";
}> {
  const { data: already, error: checkError } = await supabase
    .from("collaborators")
    .select("id")
    .eq("email", payload.email)
    .maybeSingle();

  if (checkError) {
    console.error("Erro ao verificar e-mail existente:", checkError);
    return { colaborador: null, erro: "auth_error" };
  }

  if (already) {
    console.warn("Email já cadastrado");
    return { colaborador: null, erro: "email_existente" };
  }

  const senhaGerada = Math.random().toString(36).slice(-10);

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: payload.email,
    password: senhaGerada,
  });

  if (authError) {
    if ((authError as any).status === 429) {
      console.warn("Rate limit excedido na criação via Auth");
      return { colaborador: null, erro: "rate_limit" };
    }

    console.error("Erro no Supabase Auth:", authError);
    return { colaborador: null, erro: "auth_error" };
  }

  if (!authData?.user?.id) {
    console.error("Usuário não retornado pelo Auth");
    return { colaborador: null, erro: "auth_error" };
  }

  const insertPayload = {
    ...toRow(payload),
    user_id: authData.user.id,
    troca_senha_obrigatoria: true,
    senha_temporaria: senhaGerada,
  };

  const { data, error: insertError } = await supabase
    .from("collaborators")
    .insert(insertPayload)
    .select()
    .single();

  if (insertError || !data) {
    console.error("Erro ao inserir colaborador:", insertError);
    return { colaborador: null, erro: "insert_error" };
  }

  return {
    colaborador: rowToCollaborator(data),
    senha: senhaGerada,
  };
}


export async function updateCollaborator(
  id: string,
  payload: Partial<
    Omit<Collaborator, "id" | "createdAt" | "updatedAt" | "created_by" | "updated_by">
  >
): Promise<Collaborator | null> {
  const { data, error } = await supabase
    .from("collaborators")
    .update(toRow(payload))
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("Erro ao atualizar colaborador:", error);
    return null;
  }

  return rowToCollaborator(data);
}

export async function deleteCollaborator(id: string): Promise<boolean> {
  const { error } = await supabase.from("collaborators").delete().eq("id", id);
  if (error) console.error("Erro ao excluir colaborador:", error);
  return !error;
}

/* ------------------------------------------------------------------ */
/* Filtros e KPIs                                                     */
/* ------------------------------------------------------------------ */
export function getFilteredCollaborators(
  list: Collaborator[],
  f: CollaboratorFilters
) {
  return list.filter((c) => {
    if (f.status && c.status !== f.status) return false;
    if (f.role && c.role !== f.role) return false;
    if (f.department && c.department !== f.department) return false;
    if (f.search) {
      const s = f.search.toLowerCase();
      if (
        !c.name.toLowerCase().includes(s) &&
        !c.email.toLowerCase().includes(s)
      )
        return false;
    }
    if (f.dateFrom && c.createdAt < f.dateFrom) return false;
    if (f.dateTo && c.createdAt > f.dateTo) return false;
    return true;
  });
}

export function getCollaboratorStats(list: Collaborator[]): CollaboratorStats {
  return {
    total: list.length,
    active: list.filter((c) => c.status === "Ativo").length,
    inactive: list.filter((c) => c.status === "Inativo").length,
    suspended: list.filter((c) => c.status === "Suspenso").length,
    admins: list.filter((c) => c.role === "admin").length,
    scanners: list.filter((c) => c.role === "scanner").length,
  };
}

export async function getCollaboratorById(id: string): Promise<Collaborator | null> {
  const { data, error } = await supabase
    .from("collaborators")
    .select("*, senha_temporaria") // <- isso é essencial
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Erro ao buscar colaborador:", error);
    return null;
  }

  return rowToCollaborator(data);
}



/* ------------------------------------------------------------------ */
/* Combos e Labels                                                    */
/* ------------------------------------------------------------------ */
export const getAvailableDepartments = (list: Collaborator[]) =>
  Array.from(new Set(list.map((c) => c.department))).sort();

export const getAvailableStatuses = (): CollaboratorStatus[] => [
  "Ativo",
  "Inativo",
  "Suspenso",
];

export const getAvailableRoles = (): CollaboratorRole[] => [
  "admin",
  "scanner",
];

export const roleLabel: Record<CollaboratorRole, string> = {
  admin: "Gerente",
  scanner: "Colaborador",
};

/* ------------------------------------------------------------------ */
/* Conversão snake_case  ↔  camelCase                                 */
/* ------------------------------------------------------------------ */
function rowToCollaborator(row: any): Collaborator {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as CollaboratorRole,
    status: row.status as CollaboratorStatus,
    phone: row.phone ?? undefined,
    department: row.department,
    documento: row.documento ?? undefined,
    document_type: (row.document_type as DocumentType) ?? undefined,
    troca_senha_obrigatoria: row.troca_senha_obrigatoria ?? true,
    created_by: row.created_by ?? undefined,
    updated_by: row.updated_by ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
    senha: row.senha_temporaria ?? undefined, // <-- Aqui
  };
}


function toRow(obj: any) {
  const {
    id,
    createdAt,
    updatedAt,
    created_by,
    updated_by,
    senha,
    ...rest
  } = obj;
  return rest;
}
