
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const EmptyCart = () => {
  return (
    <div className="max-w-md mx-auto text-center animate-fade-in">
      <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground animate-scale-in" />
      <h2 className="mt-6 text-2xl font-bold">Seu carrinho está vazio</h2>
      <p className="mt-2 text-muted-foreground">
        Parece que você ainda não adicionou nenhum produto ao carrinho.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="transition-all duration-200 hover:scale-105">
          <Link to="/loja">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a loja
          </Link>
        </Button>
        <Button asChild variant="outline" className="transition-all duration-200 hover:scale-105">
          <Link to="/eventos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ver eventos
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyCart;
