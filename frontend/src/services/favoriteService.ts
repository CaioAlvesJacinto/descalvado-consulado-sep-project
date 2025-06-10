
import { FavoriteEvent } from "@/types/ticket";

// Storage key for favorites in localStorage
const FAVORITES_STORAGE_KEY = "palmeiras_favorite_events";

// Get all favorite events for a user
export const getUserFavorites = (userId: string): FavoriteEvent[] => {
  try {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedFavorites) return [];
    
    const allFavorites: FavoriteEvent[] = JSON.parse(storedFavorites);
    return allFavorites.filter(fav => fav.userId === userId);
  } catch (error) {
    console.error("Error getting user favorites:", error);
    return [];
  }
};

// Check if an event is in user's favorites
export const isEventFavorited = (userId: string, eventId: string): boolean => {
  const userFavorites = getUserFavorites(userId);
  return userFavorites.some(fav => fav.eventId === eventId);
};

// Add an event to favorites
export const addEventToFavorites = (userId: string, eventId: string): FavoriteEvent => {
  const userFavorites = getUserFavorites(userId);
  
  // Check if already favorited
  if (isEventFavorited(userId, eventId)) {
    return userFavorites.find(fav => fav.eventId === eventId && fav.userId === userId)!;
  }
  
  // Create new favorite
  const newFavorite: FavoriteEvent = {
    userId,
    eventId,
    addedAt: new Date().toISOString(),
    notificationsEnabled: true
  };
  
  // Get all favorites (for all users)
  const allFavorites: FavoriteEvent[] = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]");
  allFavorites.push(newFavorite);
  
  // Save back to storage
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites));
  
  return newFavorite;
};

// Remove an event from favorites
export const removeEventFromFavorites = (userId: string, eventId: string): boolean => {
  // Get all favorites
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!storedFavorites) return false;
  
  const allFavorites: FavoriteEvent[] = JSON.parse(storedFavorites);
  const newFavorites = allFavorites.filter(
    fav => !(fav.userId === userId && fav.eventId === eventId)
  );
  
  // Save filtered favorites
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
  
  return true;
};

// Toggle notification status for a favorite event
export const toggleFavoriteNotifications = (userId: string, eventId: string): boolean => {
  // Get all favorites
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!storedFavorites) return false;
  
  const allFavorites: FavoriteEvent[] = JSON.parse(storedFavorites);
  
  // Find and update the specific favorite
  const updatedFavorites = allFavorites.map(fav => {
    if (fav.userId === userId && fav.eventId === eventId) {
      return {
        ...fav,
        notificationsEnabled: !fav.notificationsEnabled
      };
    }
    return fav;
  });
  
  // Save updated favorites
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
  
  return true;
};

// Get notification status for a favorite event
export const getNotificationStatus = (userId: string, eventId: string): boolean => {
  const userFavorites = getUserFavorites(userId);
  const favorite = userFavorites.find(fav => fav.eventId === eventId);
  return favorite ? favorite.notificationsEnabled : false;
};
