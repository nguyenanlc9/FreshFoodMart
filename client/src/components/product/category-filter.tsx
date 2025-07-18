import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "vegetables", name: "Rau củ" },
  { id: "meat", name: "Thịt cá" },
  { id: "dairy", name: "Sữa" },
  { id: "eggs", name: "Trứng" },
  { id: "dry", name: "Đồ khô" },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section className="bg-white py-8 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full border-2 font-medium transition-all ${
                selectedCategory === category.id
                  ? "gradient-bg border-primary text-white hover:opacity-90"
                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
