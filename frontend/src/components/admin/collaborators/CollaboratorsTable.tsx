// frontend/src/components/admin/collaborators/CollaboratorsTable.tsx
import { Collaborator } from "@/types/collaborator";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { roleLabel } from "@/services/collaboratorService";

interface Props {
  collaborators: Collaborator[];
  onEdit: (c: Collaborator) => void; // essa função já busca por ID e inclui a senha
  onDelete: (c: Collaborator) => void;
}

export default function CollaboratorsTable({
  collaborators,
  onEdit,
  onDelete,
}: Props) {
  if (!Array.isArray(collaborators)) return null;

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th>Status</th>
            <th>Departamento</th>
            <th>Documento</th>
            <th>Tipo</th>
            <th>Criado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {collaborators.map((c) => (
            <tr key={c.id}>
              <td className="font-medium">
                {c.name}
                {c.troca_senha_obrigatoria && (
                  <span
                    className="ml-1 text-yellow-600 text-sm align-middle"
                    title="Acesso ainda não realizado"
                  >
                    🔒
                  </span>
                )}
              </td>
              <td>{c.email}</td>
              <td>
                <Badge
                  variant={
                    c.role === "admin"
                      ? "default"
                      : c.role === "scanner"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {roleLabel[c.role] ?? "Desconhecido"}
                </Badge>
              </td>
              <td>
                <Badge
                  variant={
                    c.status === "Ativo"
                      ? "default"
                      : c.status === "Inativo"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {c.status}
                </Badge>
              </td>
              <td>{c.department || "-"}</td>
              <td>{c.documento || "-"}</td>
              <td>{c.document_type || "-"}</td>
              <td>
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <td>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(c)} // ✅ já chama função que busca senha
                    aria-label={`Editar colaborador ${c.name}`}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => onDelete(c)}
                    aria-label={`Remover colaborador ${c.name}`}
                  >
                    Remover
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
