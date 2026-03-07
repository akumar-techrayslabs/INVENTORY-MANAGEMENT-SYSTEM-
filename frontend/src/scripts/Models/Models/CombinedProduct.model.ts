export interface CombinedProduct {
  product_id: number;
  product_name: string;
  product_sku: string;
  category_name: string;
   warehouse_name:string;
   warehouse_id:number;
  is_active: boolean;
  variant_name?: string;
  variant_sku?: string;
  price?: number;
  quantity?: number;
  reserved_quantity?: number;
}