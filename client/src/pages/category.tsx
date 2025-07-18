import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CategoryFilter from "@/components/product/category-filter";
import ProductGrid from "@/components/product/product-grid";

export default function CategoryPage() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const searchParam = params.get('search');
    const typeParam = params.get('type');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (typeParam) {
      setSelectedCategory(typeParam);
    } else {
      setSelectedCategory('all');
    }
  }, [location]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    if (category === 'all') {
      params.delete('type');
    } else {
      params.set('type', category);
    }
    const queryString = params.toString();
    setLocation(`/category${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ProductGrid category={selectedCategory} searchQuery={searchQuery} />
      <Footer />
    </div>
  );
}
