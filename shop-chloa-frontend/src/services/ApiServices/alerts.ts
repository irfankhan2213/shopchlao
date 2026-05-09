import axiosInstance from './axiosInstance';
import { Alert } from '../../types/app';

const API_URL = '/alerts';

export async function getAlerts(): Promise<Alert[]> {
  const res = await axiosInstance.get(API_URL);
  return res.data;
}

export async function getAlert(id: number): Promise<Alert> {
  const res = await axiosInstance.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createAlert(data: Partial<Alert>): Promise<Alert> {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
}

export async function updateAlert(id: number, data: Partial<Alert>): Promise<Alert> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteAlert(id: number): Promise<any> {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
}
