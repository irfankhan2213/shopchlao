import axiosInstance from "./axiosInstance";

export type StockItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
  status: "good" | "low" | "out";
  earliestExpiry?: string | null;
};

export type StockSummary = {
  total: number;
  good: number;
  low: number;
  out: number;
};

export type ExpiringLot = {
  productId: string;
  name: string;
  batch?: string;
  expiryDate: string;
  stock: number;
  daysLeft: number;
};

const API_URL = "/stock";

export async function getStockInventory(): Promise<StockItem[]> {
  const res = await axiosInstance.get(API_URL);
  return res.data;
}

export async function adjustStock(
  productId: string,
  delta: number,
  note?: string
): Promise<any> {
  const res = await axiosInstance.post(`${API_URL}/${productId}/adjust`, { delta, note });
  return res.data;
}

export async function getStockSummary(): Promise<StockSummary> {
  const res = await axiosInstance.get(`${API_URL}/summary`);
  return res.data;
}

export async function getExpiringLots(days: number = 7): Promise<ExpiringLot[]> {
  const res = await axiosInstance.get(`${API_URL}/expiring`, { params: { days } });
  return res.data;
}


