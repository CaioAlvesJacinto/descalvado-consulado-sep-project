// src/components/admin/merchandise/MerchandiseStats.tsx
import React from "react";
import { Merchandise } from "@/types/merchandise";

interface Props {
  products: Merchandise[];
}

export default function MerchandiseStats({ products }: Props) {
  const total = products.length;
  const active = products.filter((i) => i.status === "ativo").length;
  const inStock = products.filter((i) => i.stock > 0).length;

  return (
    <div className="flex gap-4 mb-4">
      <div>📦 Total: {total}</div>
      <div>✅ Ativos: {active}</div>
      <div>📊 Em Estoque: {inStock}</div>
    </div>
  );
}
