import React from "react";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/sales";
import { FileDown, FileText } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface Props {
  sales: Sale[];
  fileName?: string; // default: "sales"
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButtons({ sales, fileName = "sales" }: Props) {
  /* ---------------- CSV ---------------- */
  const handleExportCsv = () => {
    const csv = Papa.unparse(sales);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${fileName}.csv`);
  };

  /* ---------------- Excel -------------- */
  const handleExportXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    const xlsxBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const blob = new Blob([xlsxBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    downloadBlob(blob, `${fileName}.xlsx`);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportCsv}>
        <FileText className="mr-2 h-4 w-4" />
        CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportXlsx}>
        <FileDown className="mr-2 h-4 w-4" />
        Excel
      </Button>
    </div>
  );
}
