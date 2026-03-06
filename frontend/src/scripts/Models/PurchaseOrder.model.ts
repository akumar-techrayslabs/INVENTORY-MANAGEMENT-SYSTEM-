import type { PurchaseOrderItem } from "./PurchaseOrderItem.model.js";

export interface PurchaseOrder {
  id: number;
  warehouse_id: number;
  supplier_id: number;
  name: string;
  status: "approved" | "draft" | "rejected";
  total_amount: number;
  items: PurchaseOrderItem[];
}