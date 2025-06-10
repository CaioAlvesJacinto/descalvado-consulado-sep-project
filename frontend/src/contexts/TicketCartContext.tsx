// src/contexts/TicketCartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/types/cart";
import { useToast } from "@/components/ui/use-toast";

interface TicketCartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  totalItems: number;
  totalPrice: number;
}

const TicketCartContext = createContext<TicketCartContextType | undefined>(undefined);

export const useTicketCart = () => {
  const context = useContext(TicketCartContext);
  if (!context) {
    throw new Error("useTicketCart must be used within a TicketCartProvider");
  }
  return context;
};

export const TicketCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.eventId === item.eventId);
      if (exists) {
        return prev.map((i) =>
          i.eventId === item.eventId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });

    toast({
      title: "Ingresso adicionado",
      description: `${item.title} foi adicionado ao carrinho.`,
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos.",
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <TicketCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        updateQuantity,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </TicketCartContext.Provider>
  );
};
