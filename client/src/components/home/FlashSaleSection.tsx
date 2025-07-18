import { Link } from "wouter";

export interface FlashSaleItem {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
}

const sampleFlashSale: FlashSaleItem[] = [
  {
    id: 1,
    name: "Cà chua tươi",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&h=300",
    price: 30000,
    salePrice: 25000,
  },
  {
    id: 2,
    name: "Thịt bò tươi",
    image:
      "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?auto=format&fit=crop&w=400&h=300",
    price: 200000,
    salePrice: 180000,
  },
  {
    id: 3,
    name: "Gạo ST25",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&h=300",
    price: 90000,
    salePrice: 85000,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface Props {
  products?: FlashSaleItem[];
}

export default function FlashSaleSection({ products = sampleFlashSale }: Props) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">⚡ Flash Sale</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="min-w-[200px] bg-white rounded-xl shadow card-hover"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-40 w-full object-cover rounded-t-xl"
              />
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-semibold line-clamp-2">{p.name}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-primary font-bold">
                    {formatPrice(p.salePrice)}
                  </span>
                  <span className="line-through text-xs text-gray-500">
                    {formatPrice(p.price)}
                  </span>
                </div>
                <span className="inline-block text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  Giảm giá
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
