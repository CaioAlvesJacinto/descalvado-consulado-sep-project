
export interface MerchandiseStats {
  total: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  totalStockValue: number;
  byCategory: Record<string, number>;
}
