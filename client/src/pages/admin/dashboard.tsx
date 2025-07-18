import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductTable from "@/components/admin/product-table";
import ProductForm from "@/components/admin/product-form";
import { Plus, LogOut, Package, BarChart3, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Check authentication
  const { data: auth, isLoading: authLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!auth?.authenticated,
  });

  useEffect(() => {
    if (!authLoading && !auth?.authenticated) {
      setLocation("/admin/login");
    }
  }, [auth, authLoading, setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại!",
      });
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Lỗi đăng xuất",
        description: "Có lỗi xảy ra khi đăng xuất",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!auth?.authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="bg-white w-64 shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Sản phẩm
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Đơn hàng
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý sản phẩm</h1>
            <Button 
              onClick={handleAddProduct}
              className="gradient-bg hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(products.map(p => p.category)).size}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTable 
                products={products} 
                onEditProduct={handleEditProduct}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm 
          product={editingProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
