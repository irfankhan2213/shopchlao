import axiosInstance from './axiosInstance';
import { Customer } from '../../types/app';

const API_URL = '/customers';

export async function getCustomers(): Promise<Customer[]> {
  const res = await axiosInstance.get(API_URL);
  return res.data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const res = await axiosInstance.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteCustomer(id: string): Promise<any> {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
}

export async function uploadCustomerImage(id: string, file: File, description?: string): Promise<Customer> {
  const formData = new FormData();
  formData.append('image', file);
  if (description) {
    formData.append('description', description);
  }
  const res = await axiosInstance.post(`${API_URL}/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}
