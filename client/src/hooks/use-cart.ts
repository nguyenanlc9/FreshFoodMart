import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CartItem } from "@shared/schema";

export function useCart() {
  const queryClient = useQueryClient();
  
  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", { productId, quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const addToCart = async (productId: number, quantity: number = 1) => {
    return addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateCart = async (id: number, quantity: number) => {
    return updateCartMutation.mutateAsync({ id, quantity });
  };

  const removeFromCart = async (id: number) => {
    return removeFromCartMutation.mutateAsync(id);
  };

  return {
    cartItems,
    isLoading,
    addToCart,
    updateCart,
    removeFromCart,
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
  };
}
