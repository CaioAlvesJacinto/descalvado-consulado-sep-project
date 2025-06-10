
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Store } from "lucide-react";
import ShoppingCart from "@/components/ShoppingCart";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const { user } = useAuth();
  
  // Hide navigation for managers/admins
  if (user?.role === "gerente") {
    return null;
  }

  return (
    <nav className="flex items-center gap-4">
      <Button variant="outline" size="sm" asChild className="flex gap-1 items-center">
        <Link to="/eventos">
          <Calendar className="h-4 w-4" />
          <span>Eventos</span>
        </Link>
      </Button>
      
      <Button variant="outline" size="sm" asChild className="flex gap-1 items-center">
        <Link to="/loja">
          <Store className="h-4 w-4" />
          <span>Loja</span>
        </Link>
      </Button>
      
      <ShoppingCart />
    </nav>
  );
};

export default Navigation;
