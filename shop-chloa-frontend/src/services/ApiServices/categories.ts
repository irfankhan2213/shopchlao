import axiosInstance from "./axiosInstance";

export type Category = {
  id: string;
  name: string;
  description?: string;
  productCount?: number;
};

const API_URL = "/categories";

export async function getCategories(): Promise<Category[]> {
  const res = await axiosInstance.get(API_URL);
  return (res.data || []).map((c: any) => ({
    id: c._id ?? c.id,
    name: c.name,
    description: c.description,
    productCount: c.productCount,
  }));
}

export async function createCategory(data: {
  name: string;
  description?: string;
}): Promise<Category> {
  const res = await axiosInstance.post(API_URL, data);
  const c = res.data;
  return { id: c._id ?? c.id, name: c.name, description: c.description };
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category> {
  const res = await axiosInstance.put(`${API_URL}/${id}`, data);
  const c = res.data;
  return { id: c._id ?? c.id, name: c.name, description: c.description };
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean }> {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
}
