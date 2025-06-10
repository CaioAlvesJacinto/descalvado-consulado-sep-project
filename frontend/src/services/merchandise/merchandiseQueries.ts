
import { Merchandise } from "@/types/merchandise";
import { merchandiseData } from "@/data/merchandiseData";

// Get all merchandise
export const getAllMerchandise = (): Merchandise[] => {
  return merchandiseData;
};

// Get featured merchandise
export const getFeaturedMerchandise = (): Merchandise[] => {
  return merchandiseData.filter(item => item.featured);
};

// Get merchandise by ID
export const getMerchandiseById = (id: string): Merchandise | undefined => {
  return merchandiseData.find(item => item.id === id);
};

// Get merchandise by category
export const getMerchandiseByCategory = (category: string): Merchandise[] => {
  return merchandiseData.filter(item => item.category === category);
};

// Get merchandise by event
export const getMerchandiseByEvent = (eventId: string): Merchandise[] => {
  return merchandiseData.filter(item => item.eventRelated === eventId);
};

// Get all available categories
export const getMerchandiseCategories = (): string[] => {
  const categories = new Set<string>();
  merchandiseData.forEach(item => categories.add(item.category));
  return Array.from(categories);
};
