
import { MerchandiseStats } from "@/types/merchandiseOperations";
import { merchandiseData } from "@/data/merchandiseData";

// Get merchandise statistics including stock info
export const getMerchandiseStats = (): MerchandiseStats => {
  const total = merchandiseData.length;
  const inStock = merchandiseData.filter(item => item.inStock).length;
  const outOfStock = merchandiseData.filter(item => !item.inStock).length;
  const lowStock = merchandiseData.filter(item => item.stock > 0 && item.stock <= 10).length;
  
  const totalStockValue = merchandiseData.reduce((sum, item) => 
    sum + (item.stock * item.price), 0
  );
  
  const byCategory: Record<string, number> = {};
  merchandiseData.forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  });
  
  return { total, inStock, outOfStock, lowStock, totalStockValue, byCategory };
};
