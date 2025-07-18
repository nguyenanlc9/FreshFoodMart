import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";
import type { Product, InsertProduct } from "@shared/schema";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<InsertProduct>>({
    name: "",
    category: "vegetables",
    price: 0,
    weight: "",
    rating: "4.0",
    tag: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        weight: product.weight,
        rating: product.rating || "4.0",
        tag: product.tag || "",
        description: product.description || "",
        image: product.image,
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      if (product) {
        return await apiRequest("PUT", `/api/products/${product.id}`, data);
      } else {
        return await apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
        description: product ? "Sản phẩm đã được cập nhật" : "Sản phẩm mới đã được thêm vào hệ thống",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi lưu sản phẩm",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(formData as InsertProduct);
  };

  const handleInputChange = (field: keyof InsertProduct, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetables">Rau củ</SelectItem>
                  <SelectItem value="meat">Thịt cá</SelectItem>
                  <SelectItem value="dairy">Sữa</SelectItem>
                  <SelectItem value="eggs">Trứng</SelectItem>
                  <SelectItem value="dry">Đồ khô</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                required
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Trọng lượng</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="500g"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Đánh giá</Label>
              <Input
                id="rating"
                type="number"
                value={formData.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                min="1"
                max="5"
                step="0.1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tag">Tag</Label>
              <Select 
                value={formData.tag} 
                onValueChange={(value) => handleInputChange("tag", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không có</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="sale">Khuyến mãi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">URL ảnh *</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="gradient-bg hover:opacity-90"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
