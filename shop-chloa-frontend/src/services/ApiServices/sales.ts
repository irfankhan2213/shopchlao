import axiosInstance from './axiosInstance';
import { Sale } from '../../types/app';

const API_URL = '/sales';

export async function getSales(): Promise<Sale[]> {
  const res = await axiosInstance.get(API_URL);
  return res.data;
}

export async function getSale(id: number): Promise<Sale> {
  const res = await axiosInstance.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createSale(data: Partial<Sale>): Promise<Sale> {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
}

export async function updateSale(id: number, data: Partial<Sale>): Promise<Sale> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteSale(id: number): Promise<any> {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
}
