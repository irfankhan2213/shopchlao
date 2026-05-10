export type routeType = {
    name: string;
    key: string;
    exactMatch:boolean;
    route: string;
    icon: (color: string) => JSX.Element;
}


export type StockLot = {
  lotId: number;
  productId: number;
  mrp: number;
  purchasePrice: number;
  sellPrice: number;
  quantity: number;
  batchNumber?: string;
  expiryDate?: string;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  lots: StockLot[];
};

export type Attachment = {
  _id?: string;
  url: string;
  date: string;
  description?: string;
}

export type Customer = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  attachments?: Attachment[];
};

export type SaleItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type Sale = {
  id: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  date: string;
};

export type Alert = {
  id: number;
  type: string;
  message: string;
  date: string;
};

export type Report = {
  id: number;
  type: string;
  data: any;
  date: string;
};

export type Settings = {
  lowStockThreshold?: number;
  enableBatchTracking?: boolean;
  enableSupplierTracking?: boolean;
  notifyExpiry?: boolean;
};
