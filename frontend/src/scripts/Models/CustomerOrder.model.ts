import type { CustomerOrderItem } from "./CustomerOrderItem.model.js";

export interface CustomerOrder {
  id: number;
  customer_id: number;

  total_amount: number;
  created_by: number;
  warehouse_id:number;
  status: "approved" | "draft" | "rejected";
  items: CustomerOrderItem[];
}