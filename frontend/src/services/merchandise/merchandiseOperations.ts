
import { Merchandise } from "@/types/merchandise";
import { merchandiseData } from "@/data/merchandiseData";
import { getMerchandiseById } from "./merchandiseQueries";

// Create a new merchandise item
export const createMerchandise = (newItemData: Omit<Merchandise, 'id'>): Merchandise => {
  const newId = `tshirt-${merchandiseData.length + 1}`;
  const newMerchandise: Merchandise = { 
    id: newId, 
    ...newItemData,
    inStock: newItemData.stock > 0
  };
  merchandiseData.push(newMerchandise);
  return newMerchandise;
};

// Update an existing merchandise item
export const updateMerchandise = (id: string, updatedData: Partial<Merchandise>): Merchandise | undefined => {
  const index = merchandiseData.findIndex(item => item.id === id);
  if (index !== -1) {
    // Auto-update inStock based on stock quantity
    if (updatedData.stock !== undefined) {
      updatedData.inStock = updatedData.stock > 0;
    }
    merchandiseData[index] = { ...merchandiseData[index], ...updatedData };
    return merchandiseData[index];
  }
  return undefined;
};

// Update stock quantity
export const updateMerchandiseStock = (id: string, newStock: number): Merchandise | undefined => {
  return updateMerchandise(id, { 
    stock: newStock,
    inStock: newStock > 0 
  });
};

// Reduce stock (for sales)
export const reduceStock = (id: string, quantity: number): boolean => {
  const item = getMerchandiseById(id);
  if (item && item.stock >= quantity) {
    updateMerchandiseStock(id, item.stock - quantity);
    return true;
  }
  return false;
};

// Delete a merchandise item
export const deleteMerchandise = (id: string): boolean => {
  const initialLength = merchandiseData.length;
  const filteredData = merchandiseData.filter(item => item.id !== id);
  
  if (filteredData.length < initialLength) {
    merchandiseData.length = 0;
    merchandiseData.push(...filteredData);
    return true;
  }
  
  return false;
};

// Associate merchandise with an event
export const associateMerchandiseWithEvent = (merchandiseId: string, eventId: string): Merchandise | undefined => {
  return updateMerchandise(merchandiseId, { eventRelated: eventId });
};

// Remove merchandise event association
export const removeMerchandiseEventAssociation = (merchandiseId: string): Merchandise | undefined => {
  return updateMerchandise(merchandiseId, { eventRelated: undefined });
};
