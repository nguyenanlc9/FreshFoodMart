import { 
  products, 
  cartItems, 
  admins,
  type Product, 
  type InsertProduct, 
  type CartItem, 
  type InsertCartItem,
  type Admin,
  type InsertAdmin
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;

  // Admin
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private admins: Map<number, Admin>;
  private currentProductId: number;
  private currentCartId: number;
  private currentAdminId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.admins = new Map();
    this.currentProductId = 1;
    this.currentCartId = 1;
    this.currentAdminId = 1;
    
    // Initialize with default admin
    this.createAdmin({
      email: "admin@foodmart.com",
      password: "admin123"
    });

    // Initialize with sample products
    this.initializeProducts();
  }

  private async initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Cà chua tươi",
        category: "vegetables",
        price: 25000,
        weight: "500g",
        rating: "4.5",
        tag: "organic",
        description: "Cà chua tươi ngon, trồng hữu cơ",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Thịt bò tươi",
        category: "meat",
        price: 180000,
        weight: "1kg",
        rating: "4.8",
        tag: "new",
        description: "Thịt bò tươi chất lượng cao",
        image: "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Sữa tươi Vinamilk",
        category: "dairy",
        price: 35000,
        weight: "1L",
        rating: "4.6",
        tag: "",
        description: "Sữa tươi nguyên chất 100%",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Trứng gà ta",
        category: "eggs",
        price: 45000,
        weight: "10 quả",
        rating: "4.7",
        tag: "organic",
        description: "Trứng gà ta sạch, an toàn",
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Gạo ST25",
        category: "dry",
        price: 85000,
        weight: "5kg",
        rating: "4.9",
        tag: "sale",
        description: "Gạo ST25 thơm ngon, chất lượng cao",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Rau xanh tươi",
        category: "vegetables",
        price: 18000,
        weight: "300g",
        rating: "4.3",
        tag: "organic",
        description: "Rau xanh tươi ngon, trồng hữu cơ",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updateData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      item => item.sessionId === sessionId
    );
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.productId === insertItem.productId && item.sessionId === insertItem.sessionId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = this.currentCartId++;
    const cartItem: CartItem = { ...insertItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId);
    
    itemsToRemove.forEach(([id, _]) => this.cartItems.delete(id));
  }

  // Admin methods
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.email === email);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }
}

export const storage = new MemStorage();
