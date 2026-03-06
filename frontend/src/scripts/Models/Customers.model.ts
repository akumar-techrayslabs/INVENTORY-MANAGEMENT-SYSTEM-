export interface Customers {
  id: number;
  organization_id: number;
  name: string;
  email: string;
  company: string | null;
  is_active: boolean;
}