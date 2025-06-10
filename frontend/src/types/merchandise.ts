// 📁 src/types/merchandise.ts
export interface Merchandise {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  status: "ativo" | "inativo";
  created_at?: string;
  updated_at?: string;
}