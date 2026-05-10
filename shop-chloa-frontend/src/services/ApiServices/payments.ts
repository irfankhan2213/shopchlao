import axiosInstance from './axiosInstance';

const API_URL = '/payments';

export async function createPayment(data: { customerId: string, amount: number, paymentMethod: string, notes?: string }): Promise<any> {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
}
