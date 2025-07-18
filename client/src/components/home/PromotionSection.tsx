import { Link } from "wouter";

export interface PromotionItem {
  id: number;
  name: string;
  image: string;
  price: number;
}

const samplePromotions: PromotionItem[] = [
  {
    id: 4,
    name: "Sữa tươi Vinamilk",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&h=300",
    price: 35000,
  },
  {
    id: 5,
    name: "Trứng gà ta",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&h=300",
    price: 45000,
  },
  {
    id: 6,
    name: "Rau xanh tươi",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&h=300",
    price: 18000,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface Props {
  products?: PromotionItem[];
}

export default function PromotionSection({ products = samplePromotions }: Props) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">🎁 Khuyến mãi dành cho bạn</h2>
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
