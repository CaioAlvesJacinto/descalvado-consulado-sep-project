/* ---------------------- Enums (valores fixos) ---------------------- */
export type CollaboratorStatus = "Ativo" | "Inativo" | "Suspenso";
export type CollaboratorRole = "admin" | "scanner";
export type DocumentType = "CPF" | "CNPJ" | "RG" | "Passaporte" | "Outro";

/* ---------------------- Registro principal ------------------------- */
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  phone?: string;
  department: string;
  documento?: string;
  document_type?: DocumentType;
  data_entrada?: string;       // formato ISO: yyyy-mm-dd
  troca_senha_obrigatoria: boolean;
  senha?: string;              // visível apenas após criação inicial
  created_by?: string;
  updated_by?: string;
  createdAt: string;           // formato ISO: yyyy-mm-ddTHH:mm:ssZ
  updatedAt?: string;
}

/* ---------------------- Filtros usados na UI ----------------------- */
export interface CollaboratorFilters {
  status?: CollaboratorStatus | "";
  role?: CollaboratorRole | "";
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/* ---------------------- KPIs para os cards ------------------------- */
export interface CollaboratorStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  admins: number;
  scanners: number;
}
