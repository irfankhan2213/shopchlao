import { ExpiryStatus, StockLevel, Product,ProductLot, PriceChange } from '@/types/product';


export const getExpiryStatus = (expiryDate: string): ExpiryStatus => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'expired';
  } else if (diffDays <= 30) {
    return 'near-expiry';
  } else {
    return 'normal';
  }
};

export const getStockLevel = (stockCount: number): StockLevel => {
  if (stockCount <= 10) {
    return 'low';
  } else if (stockCount <= 50) {
    return 'medium';
  } else {
    return 'high';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// New utility functions for lot management
export const getCurrentLot = (lots: ProductLot[]): ProductLot | undefined => {
  return lots.find(lot => lot.isCurrentLot) || lots[0];
};

export const getTotalStock = (lots: ProductLot[]): number => {
  return lots.reduce((total, lot) => total + lot.stockCount, 0);
};

export const getPriceChange = (lots: ProductLot[]): PriceChange | undefined => {
  if (lots.length < 2) return undefined;
  
  const sortedLots = lots.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  const currentLot = sortedLots[0];
  const previousLot = sortedLots[1];
  
  if (currentLot.salePrice !== previousLot.salePrice) {
    const discountPercentage = ((previousLot.salePrice - currentLot.salePrice) / previousLot.salePrice) * 100;
    return {
      oldPrice: previousLot.salePrice,
      newPrice: currentLot.salePrice,
      discountPercentage: Math.round(discountPercentage)
    };
  }
  
  return undefined;
};

// export const processProduct = (product: Omit<Product, 'currentLot' | 'priceChange' | 'totalStock'>): Product => {
//   const currentLot = getCurrentLot(product.lots);
//   const totalStock = product.stock;
//   const priceChange = getPriceChange(product.lots);
  
//   return {
//     ...product,
//     currentLot,
//     totalStock,
//     priceChange
//   };
// };