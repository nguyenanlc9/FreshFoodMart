import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, ZoomIn } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [imageZoomed, setImageZoomed] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: product?.category }],
    queryFn: async () => {
      const response = await fetch(`/api/products?category=${product?.category}`);
      if (!response.ok) throw new Error("Failed to fetch related products");
      const products = await response.json();
      return products.filter((p: Product) => p.id !== product?.id).slice(0, 4);
    },
    enabled: !!product?.category,
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
      toast({
        title: "Thêm vào giỏ hàng thành công!",
        description: `${quantity} x ${product.name} đã được thêm vào giỏ hàng`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'organic': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'sale': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagText = (tag: string) => {
    switch (tag) {
      case 'organic': return 'Organic';
      case 'new': return 'Mới';
      case 'sale': return 'Khuyến mãi';
      default: return tag;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'vegetables': return 'Rau củ';
      case 'meat': return 'Thịt cá';
      case 'dairy': return 'Sữa';
      case 'eggs': return 'Trứng';
      case 'dry': return 'Đồ khô';
      default: return category;
    }
  };

  const generateStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    
    return stars;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h1>
            <p className="text-gray-600 mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/">
              <Button className="gradient-bg hover:opacity-90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={(query) => setLocation(`/?search=${query}`)} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <span className="hover:text-primary">{getCategoryName(product.category)}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="animate-fade-in">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className={`w-full h-96 object-cover transition-transform duration-300 cursor-pointer ${
                  imageZoomed ? 'scale-150' : 'hover:scale-110'
                }`}
                onClick={() => setImageZoomed(!imageZoomed)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setImageZoomed(!imageZoomed)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {product.tag && (
                <Badge className={`absolute top-4 left-4 ${getTagColor(product.tag)}`}>
                  {getTagText(product.tag)}
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-slide-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {generateStars(parseFloat(product.rating || "0"))}
              </div>
              <span className="ml-2 text-gray-600">({product.rating} đánh giá)</span>
            </div>

            <div className="text-4xl font-bold text-primary mb-4">
              {formatPrice(product.price)}
            </div>

            <div className="text-gray-600 mb-6">
              <span className="font-medium">Trọng lượng:</span> {product.weight}
            </div>

            <div className="text-gray-700 mb-8 leading-relaxed">
              {product.description || "Sản phẩm tươi ngon, chất lượng cao được chọn lọc kỹ càng."}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="text-gray-700 mr-4">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full gradient-bg hover:opacity-90 text-white py-3 text-lg"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Thêm vào giỏ hàng
            </Button>

            {/* Back Button */}
            <Link href="/">
              <Button variant="outline" className="w-full mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách sản phẩm
              </Button>
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}