import { Link } from "wouter";
import type { Product } from "@shared/schema";

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Cà chua tươi",
    category: "vegetables",
    price: 25000,
    weight: "500g",
    rating: "4.5",
    tag: "organic",
    description: "Cà chua tươi ngon, trồng hữu cơ",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&h=300",
  },
  {
    id: 2,
    name: "Thịt bò tươi",
    category: "meat",
    price: 180000,
    weight: "1kg",
    rating: "4.8",
    tag: "new",
    description: "Thịt bò tươi chất lượng cao",
    image:
      "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?auto=format&fit=crop&w=400&h=300",
  },
  {
    id: 3,
    name: "Gạo ST25",
    category: "dry",
    price: 85000,
    weight: "5kg",
    rating: "4.9",
    tag: "sale",
    description: "Gạo ST25 thơm ngon, chất lượng cao",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&h=300",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface Props {
  products?: Product[];
}

export default function ProductSection({ products = sampleProducts }: Props) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">⭐ Sản phẩm</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="bg-white rounded-xl shadow card-hover image-zoom"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-48 w-full object-cover rounded-t-xl"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-primary font-bold">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
