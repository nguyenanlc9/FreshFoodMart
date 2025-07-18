import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Thêm vào giỏ hàng thành công",
        description: `${product.name} đã được thêm vào giỏ hàng`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const generateStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover image-zoom animate-fade-in cursor-pointer">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover transition-transform duration-300"
          />
          {product.tag && (
            <Badge 
              className={`absolute top-2 right-2 ${getTagColor(product.tag)}`}
            >
              {getTagText(product.tag)}
            </Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center mb-3">
            <div className="flex">
              {generateStars(parseFloat(product.rating || "0"))}
            </div>
            <span className="ml-2 text-gray-500 text-sm">
              ({product.rating})
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-gray-500 text-sm">
              {product.weight}
            </div>
          </div>
          
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isLoading}
            className="w-full gradient-bg hover:opacity-90 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
