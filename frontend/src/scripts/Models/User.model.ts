export interface User {
  id: number;
  organization_id: number;
  full_name: string;
  email:string;
  phone_no:string;
  password:string;
  role_id:number;
  is_active: boolean;
}