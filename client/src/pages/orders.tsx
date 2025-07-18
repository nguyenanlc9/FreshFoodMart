import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Package, Eye, Calendar, CreditCard } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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

export default function Orders() {
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Chờ xử lý':
        return <Package className="h-4 w-4" />;
      case 'Đã xác nhận':
        return <Package className="h-4 w-4" />;
      case 'Đang giao':
        return <Package className="h-4 w-4" />;
      case 'Đã giao':
        return <Package className="h-4 w-4" />;
      case 'Đã hủy':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={(query) => setLocation(`/?search=${query}`)} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của bạn</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">Bạn chưa có đơn hàng nào</p>
              <p className="text-gray-400 mb-6">Hãy mua sắm và đặt hàng ngay!</p>
              <Link href="/">
                <Button className="gradient-bg hover:opacity-90">
                  Bắt đầu mua hàng
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Đơn hàng #{order.id}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(order.date)}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-semibold">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết đơn hàng #{order.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Ngày đặt:</span>
                                <p className="text-gray-600">{formatDate(order.date)}</p>
                              </div>
                              <div>
                                <span className="font-medium">Trạng thái:</span>
                                <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Sản phẩm đã đặt:</h4>
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <img 
                                      src={item.image} 
                                      alt={item.productName}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                      <p className="font-medium">{item.productName}</p>
                                      <p className="text-sm text-gray-600">
                                        {item.quantity} x {formatPrice(item.price)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">
                                        {formatPrice(item.quantity * item.price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <div className="flex justify-between items-center text-lg font-bold">
                                <span>Tổng cộng:</span>
                                <span className="text-primary">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {order.status === 'Chờ xử lý' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'Đã hủy')}
                        >
                          Hủy đơn
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Sản phẩm:</span>
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}