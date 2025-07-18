import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Banner from "@/components/home/Banner";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import PromotionSection from "@/components/home/PromotionSection";
import FruitGiftSection from "@/components/home/FruitGiftSection";
import ProductSection from "@/components/home/ProductSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <Banner />
      <FlashSaleSection />
      <PromotionSection />
      <FruitGiftSection />
      <ProductSection />
      <Footer />
    </div>
  );
}
