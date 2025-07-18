import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductTable from "@/components/admin/product-table";
import ProductForm from "@/components/admin/product-form";
import { Plus, LogOut, Package, BarChart3, ShoppingCart, Calendar, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "Chờ xử lý" | "Đã xác nhận" | "Đang giao" | "Đã giao" | "Đã hủy";
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
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
    if (auth?.authenticated) {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  }, [auth?.authenticated]);

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

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Chờ xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã xác nhận':
        return 'bg-blue-100 text-blue-800';
      case 'Đang giao':
        return 'bg-orange-100 text-orange-800';
      case 'Đã giao':
        return 'bg-green-100 text-green-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  const stats = [
    {
      title: "Tổng sản phẩm",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Danh mục",
      value: new Set(products.map(p => p.category)).size,
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Đơn hàng",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-purple-600",
    },
  ];

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
            <Button 
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('products')}
            >
              <Package className="h-4 w-4 mr-2" />
              Sản phẩm
            </Button>
            <Button 
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('orders')}
            >
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Products Section */}
          {activeTab === 'products' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Quản lý sản phẩm</CardTitle>
                  <Button 
                    onClick={handleAddProduct}
                    className="gradient-bg hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ProductTable products={products} onEdit={handleEditProduct} />
              </CardContent>
            </Card>
          )}

          {/* Orders Section */}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold">Đơn hàng #{order.id}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="Chờ xử lý">Chờ xử lý</option>
                              <option value="Đã xác nhận">Đã xác nhận</option>
                              <option value="Đang giao">Đang giao</option>
                              <option value="Đã giao">Đã giao</option>
                              <option value="Đã hủy">Đã hủy</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Sản phẩm:</p>
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <img 
                                  key={index}
                                  src={item.image} 
                                  alt={item.productName}
                                  className="w-8 h-8 object-cover rounded-full border-2 border-white"
                                />
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tổng tiền:</p>
                            <p className="font-bold text-lg text-primary">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Chi tiết:</p>
                          <ul className="mt-1 space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{item.productName} x{item.quantity}</span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Product Form Modal */}
          {showProductForm && (
            <ProductForm
              product={editingProduct}
              onClose={handleCloseForm}
            />
          )}
        </div>
      </div>
    </div>
  );
}