import { Button } from "@/components/ui/button";
import CollaboratorStats from "@/components/admin/collaborators/CollaboratorStats";
import CollaboratorFilters from "@/components/admin/collaborators/CollaboratorFilters";
import CollaboratorsTable from "@/components/admin/collaborators/CollaboratorsTable";
import { Collaborator, CollaboratorFilters as FiltersType } from "@/types/collaborator";

interface CollaboratorsTabProps {
  collaboratorStats: any;
  collaboratorFilters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  collaborators: Collaborator[];
  onCreateCollaborator: () => void;
  onEditCollaborator: (c: Collaborator) => void;
  onDeleteCollaborator: (c: Collaborator) => void;
}

export default function CollaboratorsTab({
  collaboratorStats,
  collaboratorFilters,
  onFiltersChange,
  collaborators,
  onCreateCollaborator,
  onEditCollaborator,
  onDeleteCollaborator,
}: CollaboratorsTabProps) {
  return (
    <div className="space-y-4">
      <CollaboratorStats stats={collaboratorStats} />
      <CollaboratorFilters
        filters={collaboratorFilters}
        onFiltersChange={onFiltersChange}
        departments={[]} // adapte conforme necessário
      />
      <CollaboratorsTable
        collaborators={collaborators}
        onEdit={onEditCollaborator}
        onDelete={onDeleteCollaborator}
      />
      <Button onClick={onCreateCollaborator}>Novo Colaborador</Button>
    </div>
  );
}
