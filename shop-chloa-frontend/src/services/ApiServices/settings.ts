import axiosInstance from './axiosInstance';
import { Settings } from '../../types/app';

const API_URL = '/settings';

export async function getSettings(): Promise<Settings> {
  const res = await axiosInstance.get(API_URL);
  return res.data;
}

export async function updateSettings(data: Partial<Settings>): Promise<any> {
  const res = await axiosInstance.put(API_URL, data);
  return res.data;
}
