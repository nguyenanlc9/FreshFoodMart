import { useQuery } from "@tanstack/react-query";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  category: string;
  searchQuery: string;
}

export default function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products", { category, search: searchQuery }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Không thể tải sản phẩm. Vui lòng thử lại.</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
