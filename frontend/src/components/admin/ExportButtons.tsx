
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/sales";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportButtonsProps {
  sales: Sale[];
  fileName?: string;
}

const ExportButtons = ({ sales, fileName = 'vendas' }: ExportButtonsProps) => {
  
  const exportToExcel = () => {
    const exportData = sales.map(sale => ({
      'ID': sale.id,
      'Tipo': sale.type,
      'Cliente': sale.customerName,
      'Email': sale.customerEmail,
      'Data': sale.date,
      'Valor': `R$ ${sale.amount.toFixed(2)}`,
      'Status': sale.status,
      'Pagamento': sale.paymentMethod,
      'Produto/Evento': sale.type === 'Ingresso' 
        ? (sale as any).eventName 
        : (sale as any).merchandiseName,
      'Quantidade': sale.type === 'Ingresso' 
        ? (sale as any).quantity 
        : (sale as any).quantity,
      'Detalhes': sale.type === 'Produto'
        ? `${(sale as any).size} - ${(sale as any).color}`
        : (sale as any).ticketCode
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    
    // Set column widths
    const columnWidths = [
      { wch: 12 }, // ID
      { wch: 10 }, // Tipo
      { wch: 20 }, // Cliente
      { wch: 25 }, // Email
      { wch: 12 }, // Data
      { wch: 12 }, // Valor
      { wch: 10 }, // Status
      { wch: 15 }, // Pagamento
      { wch: 30 }, // Produto/Evento
      { wch: 10 }, // Quantidade
      { wch: 20 }, // Detalhes
    ];
    worksheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas');
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Relatório de Vendas', 14, 22);
    
    // Add export date
    doc.setFontSize(10);
    doc.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
    
    // Prepare table data
    const tableData = sales.map(sale => [
      sale.id,
      sale.type,
      sale.customerName,
      sale.date,
      `R$ ${sale.amount.toFixed(2)}`,
      sale.status,
      sale.type === 'Ingresso' 
        ? (sale as any).eventName.substring(0, 25) + '...'
        : (sale as any).merchandiseName.substring(0, 25) + '...'
    ]);

    // Add table
    doc.autoTable({
      head: [['ID', 'Tipo', 'Cliente', 'Data', 'Valor', 'Status', 'Produto/Evento']],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    // Add summary
    const totalRevenue = sales
      .filter(sale => sale.status === 'Pago')
      .reduce((sum, sale) => sum + sale.amount, 0);
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total de Vendas: ${sales.length}`, 14, finalY);
    doc.text(`Receita Total: R$ ${totalRevenue.toFixed(2)}`, 14, finalY + 8);
    
    doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
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

export default ExportButtons;
