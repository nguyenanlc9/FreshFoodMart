import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBasket, Search, ShoppingCart, Menu } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems } = useCart();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ShoppingBasket className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-800">FoodMart</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Trang chủ
              </Button>
            </Link>
            <Link href="/category">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Danh mục
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="ghost" className="text-gray-700 hover:text-primary">
                Đơn hàng
              </Button>
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent ml-2 border-none focus:ring-0 focus:border-none"
            />
          </form>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/login">
              <Button className="gradient-bg hover:opacity-90 text-white">
                Đăng nhập
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
