import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroBanner from "@/components/hero/hero-banner";
import CategoryFilter from "@/components/product/category-filter";
import ProductGrid from "@/components/product/product-grid";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />
      <HeroBanner />
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <ProductGrid category={selectedCategory} searchQuery={searchQuery} />
      <Footer />
    </div>
  );
}
