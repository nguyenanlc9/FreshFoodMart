import { ShoppingBasket, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBasket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FoodMart</span>
            </div>
            <p className="text-gray-300">
              FoodMart - Nền tảng bán thực phẩm tươi ngon, chất lượng cao với dịch vụ giao hàng nhanh chóng.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Danh mục</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Rau củ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Thịt cá</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sữa & Trứng</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Đồ khô</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vận chuyển</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Thanh toán</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                0123 456 789
              </p>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@foodmart.com
              </p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                123 Nguyễn Văn A, Q.1, HCM
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 FoodMart. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
