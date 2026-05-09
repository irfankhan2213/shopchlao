export type TeamMemberType = {
  id: number;
  first_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  branch_name: string | null;
  manager_name: string | null;
  leads_count: number;
  added_date: string;
};
