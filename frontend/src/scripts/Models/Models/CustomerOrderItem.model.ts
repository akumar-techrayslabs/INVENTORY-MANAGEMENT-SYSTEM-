export interface CustomerOrderItem {
  id: number;
  warehouse_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_amount: number;
}