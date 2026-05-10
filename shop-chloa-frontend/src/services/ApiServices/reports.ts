import axiosInstance from './axiosInstance';
import { Report } from '../../types/app';

const API_URL = '/reports';

export async function getDashboardStats(): Promise<any> {
  const res = await axiosInstance.get(`${API_URL}/dashboard`);
  return res.data;
}

export async function getReports(): Promise<Report[]> {
  const res = await axiosInstance.get(API_URL);
  return res.data;
}

export async function getReport(id: number): Promise<Report> {
  const res = await axiosInstance.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createReport(data: Partial<Report>): Promise<Report> {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
}

export async function updateReport(id: number, data: Partial<Report>): Promise<Report> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  return res.data;
}

export async function deleteReport(id: number): Promise<any> {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
}
