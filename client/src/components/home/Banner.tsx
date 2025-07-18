import { cn } from "@/lib/utils";

export default function Banner() {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1470&q=80)",
      }}
    >
      <div className="absolute inset-0 bg-orange-600/60 flex items-center justify-center text-center px-4">
        <div className="text-white space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Chào mừng đến với FreshFoodMart
          </h1>
          <p className="text-lg md:text-2xl">
            Nơi bạn tìm thấy thực phẩm tươi ngon mỗi ngày
          </p>
        </div>
      </div>
    </section>
  );
}
