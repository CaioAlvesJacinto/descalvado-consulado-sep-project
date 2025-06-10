
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BellIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserFavorites } from "@/services/favoriteService";
import { getEventById } from "@/services/eventService";

const NotificationBadge = () => {
  const { user, isAuthenticated } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Check for events with available tickets among favorites
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotificationCount(0);
      return;
    }
    
    const checkNotifications = () => {
      const favorites = getUserFavorites(user.id);
      
      // Count only favorites with notifications enabled and available tickets
      const count = favorites.reduce((acc, favorite) => {
        if (favorite.notificationsEnabled) {
          const event = getEventById(favorite.eventId);
          if (event && event.availableTickets > 0) {
            return acc + 1;
          }
        }
        return acc;
      }, 0);
      
      setNotificationCount(count);
    };
    
    // Initial check
    checkNotifications();
    
    // Set up interval to periodically check (every 5 minutes)
    const intervalId = setInterval(checkNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, isAuthenticated]);
  
  if (notificationCount === 0) return null;
  
  return (
    <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] bg-red-500 text-white">
      {notificationCount}
    </Badge>
  );
};

export default NotificationBadge;
