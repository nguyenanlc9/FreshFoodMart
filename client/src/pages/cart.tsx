import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, CreditCard } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import type { Product } from "@shared/schema";

interface CartItemWithProduct {
  id: number;
  productId: number;
  quantity: number;
  sessionId: string;
  product: Product;
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const { cartItems, updateCart, removeFromCart, isUpdating, isRemoving } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch product details for each cart item
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const cartItemsWithProducts: CartItemWithProduct[] = cartItems.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  })).filter(item => item.product);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const order = {
        id: Date.now().toString(),
        items: cartItemsWithProducts.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        total: totalAmount,
        date: new Date().toISOString(),
        status: "Chờ xử lý"
      };

      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(order);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      // Clear cart
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }

      return order;
    },
    onSuccess: (order) => {
      toast({
        title: "Đặt hàng thành công!",
        description: `Đơn hàng #${order.id} đã được tạo. Tổng tiền: ${formatPrice(order.total)}`,
      });
      setLocation("/orders");
    },
    onError: () => {
      toast({
        title: "Lỗi đặt hàng",
        description: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(id);
      return;
    }
    
    try {
      await updateCart(id, newQuantity);
      toast({
        title: "Cập nhật giỏ hàng",
        description: "Số lượng sản phẩm đã được cập nhật",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật số lượng sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await removeFromCart(id);
      toast({
        title: "Xóa sản phẩm",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm khỏi giỏ hàng",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (cartItemsWithProducts.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán",
        variant: "destructive",
      });
      return;
    }
    
    checkoutMutation.mutate();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalAmount = cartItemsWithProducts.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );

  const totalItems = cartItemsWithProducts.reduce(
    (sum, item) => sum + item.quantity, 
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={(query) => setLocation(`/?search=${query}`)} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tiếp tục mua hàng
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Giỏ hàng của bạn ({totalItems} sản phẩm)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItemsWithProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
                    <Link href="/">
                      <Button className="gradient-bg hover:opacity-90">
                        Bắt đầu mua hàng
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItemsWithProducts.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg animate-fade-in">
                        <Link href={`/product/${item.product.id}`}>
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          />
                        </Link>
                        
                        <div className="flex-1">
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-semibold text-gray-800 hover:text-primary cursor-pointer">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600">{item.product.weight}</p>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isRemoving}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          {cartItemsWithProducts.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tổng đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCheckout}
                    disabled={checkoutMutation.isPending}
                    className="w-full gradient-bg hover:opacity-90 text-white py-3"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {checkoutMutation.isPending ? "Đang xử lý..." : "Thanh toán"}
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    Miễn phí vận chuyển cho đơn hàng trên 200.000₫
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}