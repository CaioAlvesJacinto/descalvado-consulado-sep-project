
import { Merchandise } from "@/types/merchandise";

// Mock data for merchandise with stock control
export const merchandiseData: Merchandise[] = [
  {
    id: "camiseta-descalvado-2025",
    name: "Camiseta Descalvado 2025",
    description: "Camiseta oficial do Consulado do Palmeiras de Descalvado. Edição especial 2025 com estampa exclusiva do escudo oficial da agremiação.",
    price: 65.90,
    images: ["/lovable-uploads/898ee821-d0c0-428e-bf67-9b0e5f92c368.png"],
    sizes: [
      { value: "P", label: "P", available: true },
      { value: "M", label: "M", available: true },
      { value: "G", label: "G", available: true },
      { value: "GG", label: "GG", available: true },
    ],
    colors: [
      { value: "verde", label: "Verde", hex: "#006437", available: true },
      { value: "branco", label: "Branco", hex: "#FFFFFF", available: true },
    ],
    category: "Oficial",
    featured: true,
    inStock: true,
    stock: 50,
  },
];
