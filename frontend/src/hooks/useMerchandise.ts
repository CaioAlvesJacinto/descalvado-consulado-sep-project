import { useEffect, useState } from "react";
import { Merchandise } from "@/types/merchandise";
import { getAllMerchandise } from "@/services/merchandiseService";

/**
 * Hook centralizado para carregar, atualizar e expor a lista de produtos.
 */
export function useMerchandise() {
  const [products, setProducts] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);

  /** Faz uma nova chamada ao Supabase (útil para refresh manual) */
  const refresh = () => {
    setLoading(true);
    getAllMerchandise()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  // carrega na montagem
  useEffect(() => {
    refresh();
  }, []);

  return {
    products,      // lista de produtos
    loading,       // booleano de carregamento
    setProducts,   // setter (caso precise sobrescrever manualmente)
    refresh,       // função para recarregar do backend
  };
}
