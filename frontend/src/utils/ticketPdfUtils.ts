import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TicketInfo } from "@/types/ticket";

// Baixa UM ingresso individual (caso queira usar em outro lugar)
export async function downloadTicketPdf(ticket: TicketInfo, doc?: jsPDF) {
  const isRoot = !doc;
  if (!doc) {
    doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  }

  doc.setFontSize(20);
  doc.text(ticket.eventName, 105, 25, { align: "center" });

  doc.setFontSize(12);
  doc.text(ticket.purchaseDate, 105, 35, { align: "center" });

  // QR Code
  if (ticket.qrCodeUrl && ticket.qrCodeUrl.startsWith("data:image")) {
    doc.addImage(ticket.qrCodeUrl, "PNG", 80, 45, 50, 50);
  }

  const infos = [
    ["Nome:", ticket.holderName],
    ["Quantidade:", String(ticket.quantity || 1)],
    ["Total:", `R$ ${Number(ticket.totalPrice).toFixed(2)}`],
    ["Status:", ticket.isValidated ? "Utilizado" : "Não utilizado"],
    ["ID:", ticket.code],
  ];

  autoTable(doc, {
    startY: 105,
    margin: { left: 45 },
    head: [],
    body: infos,
    styles: { fontSize: 12, halign: "left" },
    theme: "plain",
  });

  // Se for chamado individual, já salva
  if (isRoot) {
    doc.save(`ingresso-${ticket.eventName}-${ticket.code}.pdf`);
  }
}

// Baixa TODOS os tickets de um evento em UM único PDF
export async function downloadTicketsPdf(tickets: TicketInfo[], eventName: string) {
  if (!tickets.length) return;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  for (let i = 0; i < tickets.length; i++) {
    if (i !== 0) doc.addPage();
    await downloadTicketPdf(tickets[i], doc);
  }

  doc.save(`ingressos-${eventName.replace(/\s+/g, "_")}.pdf`);
}
