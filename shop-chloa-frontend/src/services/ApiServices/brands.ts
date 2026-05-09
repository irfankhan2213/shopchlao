import axiosInstance from "./axiosInstance";

export type Brand = {
  id: string;
  name: string;
  description?: string;
};

const API_URL = "/brands";

export async function getBrands(): Promise<Brand[]> {
  const res = await axiosInstance.get(API_URL);
  // Normalize _id to id
  return (res.data || []).map((b: any) => ({ id: b._id ?? b.id, name: b.name, description: b.description }));
}

export async function createBrand(data: { name: string; description?: string }): Promise<Brand> {
  const res = await axiosInstance.post(API_URL, data);
  const b = res.data;
  return { id: b._id ?? b.id, name: b.name, description: b.description };
}

export async function updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  const b = res.data;
  return { id: b._id ?? b.id, name: b.name, description: b.description };
}

export async function deleteBrand(id: string): Promise<{ success: boolean }> {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
}

