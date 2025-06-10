import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingCart as ShoppingCartIcon, X, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTicketCart } from "@/contexts/TicketCartContext";

const ShoppingCart = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useTicketCart();

  const [open, setOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [prevItemsCount, setPrevItemsCount] = useState(totalItems);

  useEffect(() => {
    if (prevItemsCount !== totalItems && prevItemsCount < totalItems) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
    setPrevItemsCount(totalItems);
  }, [totalItems, prevItemsCount]);

  const handleIncrement = (id: string, currentQty: number) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleDecrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative transition-all",
            animateCart ? "scale-125" : ""
          )}
        >
          <ShoppingCartIcon className="h-4 w-4" />
          {totalItems > 0 && (
            <span
              className={cn(
                "absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center transition-all",
                animateCart ? "scale-150" : ""
              )}
            >
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Seu Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Seu carrinho está vazio</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setOpen(false)}
                asChild
              >
                <Link to="/">Voltar para eventos</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-2 items-center"
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quantidade:
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleDecrement(item.id, item.quantity)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleIncrement(item.id, item.quantity)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col mt-auto">
            <Separator className="my-4" />
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="font-bold">Total</span>
              <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              size="lg"
              asChild
            >
              <Link to="/carrinho" onClick={() => setOpen(false)}>
                Finalizar compra
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
