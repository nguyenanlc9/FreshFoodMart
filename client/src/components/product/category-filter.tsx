import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Apple, Beef, Milk, Egg, Wheat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", name: "Tất cả", icon: Package, color: "bg-gray-100 text-gray-800" },
  { id: "vegetables", name: "Rau củ", icon: Apple, color: "bg-green-100 text-green-800" },
  { id: "meat", name: "Thịt cá", icon: Beef, color: "bg-red-100 text-red-800" },
  { id: "dairy", name: "Sữa", icon: Milk, color: "bg-blue-100 text-blue-800" },
  { id: "eggs", name: "Trứng", icon: Egg, color: "bg-yellow-100 text-yellow-800" },
  { id: "dry", name: "Đồ khô", icon: Wheat, color: "bg-amber-100 text-amber-800" },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Get product count for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return products.length;
    return products.filter(product => product.category === categoryId).length;
  };

  return (
    <section className="bg-white py-8 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh mục sản phẩm</h2>
          <p className="text-gray-600">Chọn danh mục để xem sản phẩm phù hợp</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const count = getCategoryCount(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-medium transition-all hover:scale-105 ${
                  isSelected
                    ? "gradient-bg border-primary text-white hover:opacity-90"
                    : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                }`}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.name}</span>
                {count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 text-xs ${
                      isSelected 
                        ? "bg-white/20 text-white" 
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Active filter indicator */}
        {selectedCategory !== "all" && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-sm text-gray-600">Đang hiển thị:</span>
              <span className="font-semibold text-primary">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {getCategoryCount(selectedCategory)} sản phẩm
              </Badge>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
