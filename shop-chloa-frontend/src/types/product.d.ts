export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  lots: ProductLot[];
  barcode?: string;
  // Computed properties for current lot
  currentLot?: ProductLot;
  priceChange?: PriceChange;
  description: string;
  prices: {
    purchasePrice: number;
    sellPrice: number;
    mrp: number;
  }[];
  status: StockLevel;
  expiry: ExpiryStatus;
  stock: number; // Total stock across all lots
}

export type ExpiryStatus = "expired" | "near-expiry" | "normal";
export type StockLevel = "low" | "medium" | "high";

export interface ProductLot {
  id: string;
  batchNumber: string;
  purchasePrice: number;
  salePrice: number;
  mrp: number;
  expiryDate: string;
  stockCount: number;
  purchaseDate: string;
  isCurrentLot: boolean; // Indicates if this is the currently selling lot
}

export interface PriceChange {
  oldPrice: number;
  newPrice: number;
  discountPercentage: number;
}
