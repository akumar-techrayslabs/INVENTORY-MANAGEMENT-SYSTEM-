export interface Product {
  id: number;
  warehouse_id: number;
  name: string;
  sku: string;
  category_id: number | null;
  organization_id:number;
  reorder_level: number;
  is_active: boolean;
}