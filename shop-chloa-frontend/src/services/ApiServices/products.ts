

import axiosInstance from './axiosInstance';
import {  StockLot } from '../../types/app';
import { Product } from '@/types/product';

const API_URL = '/products';

export async function getProducts(): Promise<Product[]> {
  const res = await axiosInstance.get(API_URL);
  return res.data;
}

export async function getProduct(id: number): Promise<Product> {
  const res = await axiosInstance.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: number): Promise<any> {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
}

// Stock lot APIs
export async function addStockLot(productId: number | string, data: Partial<StockLot>): Promise<StockLot> {
  const res = await axiosInstance.post(`${API_URL}/${productId}/lots`, data);
  return res.data;
}

export async function getStockLots(productId: number | string): Promise<StockLot[]> {
  const res = await axiosInstance.get(`${API_URL}/${productId}/lots`);
  return res.data;
}

export async function updateStockLot(productId: number, lotId: number, data: Partial<StockLot>): Promise<StockLot> {
  const res = await axiosInstance.put(`${API_URL}/${productId}/lots/${lotId}`, data);
  return res.data;
}

export async function deleteStockLot(productId: number, lotId: number): Promise<any> {
  const res = await axiosInstance.delete(`${API_URL}/${productId}/lots/${lotId}`);
  return res.data;
}
