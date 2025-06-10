import { Button } from "@/components/ui/button";
import { Collaborator } from "@/types/collaborator";
import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface CollaboratorExportButtonsProps {
  collaborators: Collaborator[];
  fileName?: string;
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "Gerente";
    case "scanner":
      return "Colaborador";
    case "buyer":
      return "Comprador";
    default:
      return role;
  }
};

const CollaboratorExportButtons = ({
  collaborators,
  fileName = "colaboradores",
}: CollaboratorExportButtonsProps) => {
  const exportToExcel = () => {
    const exportData = collaborators.map((collaborator) => ({
      ID: collaborator.id,
      Nome: collaborator.name,
      Email: collaborator.email,
      Função: getRoleLabel(collaborator.role),
      Status: collaborator.status,
      Departamento: collaborator.department,
      Telefone: collaborator.phone || "",
      "Data de Criação": new Date(collaborator.createdAt).toLocaleDateString("pt-BR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 25 },
      { wch: 30 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Colaboradores");
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Colaboradores", 14, 22);

    doc.setFontSize(10);
    doc.text(`Exportado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30);

    const activeCount = collaborators.filter((c) => c.status === "Ativo").length;
    const managerCount = collaborators.filter((c) => c.role === "admin").length;

    doc.text(`Total de Colaboradores: ${collaborators.length}`, 14, 38);
    doc.text(`Colaboradores Ativos: ${activeCount}`, 14, 44);
    doc.text(`Gerentes: ${managerCount}`, 14, 50);

    const tableData = collaborators.map((collaborator) => [
      collaborator.name,
      collaborator.email,
      getRoleLabel(collaborator.role),
      collaborator.status,
      collaborator.department,
      new Date(collaborator.createdAt).toLocaleDateString("pt-BR"),
    ]);

    doc.autoTable({
      head: [["Nome", "Email", "Função", "Status", "Departamento", "Data de Criação"]],
      body: tableData,
      startY: 58,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`${fileName}_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToExcel}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};

export default CollaboratorExportButtons;
