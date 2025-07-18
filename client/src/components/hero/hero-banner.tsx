import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <section className="gradient-bg relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-white z-10 max-w-xl">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Thực phẩm tươi ngon
            </h1>
            <p className="text-xl mb-8 opacity-90 animate-slide-in">
              Giao hàng nhanh chóng, chất lượng đảm bảo
            </p>
            <Button 
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 animate-scale-up"
              size="lg"
            >
              Mua ngay
            </Button>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Fresh vegetables and grocery shelves" 
              className="rounded-2xl shadow-2xl w-96 h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
