import axiosInstance from './axiosInstance';

const API_URL = '/ledger';

export async function getCustomerLedger(customerId: string): Promise<any[]> {
  const res = await axiosInstance.get(`${API_URL}/${customerId}`);
  return res.data;
}
