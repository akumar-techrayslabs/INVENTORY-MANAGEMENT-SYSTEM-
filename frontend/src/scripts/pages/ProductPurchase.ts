
import type { PurchaseOrder } from "../Models/PurchaseOrder.model.js";
import type { PurchaseOrderItem } from "../Models/PurchaseOrderItem.model.js";
import { addStockEntry } from "../services/stockManagement.js";




declare var Swal: any;

function showSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Purchase Order Created",
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    window.location.reload();
  });
}

function showWarning(message: string) {
  Swal.fire({
    title: "warning!",
    text: `${message}`,
    icon: "warning",
    confirmButtonText: "OK",
  });
}

(window as any).showSuccess = showSuccess;

(window as any).showWarning = showWarning;

let items: PurchaseOrderItem[] = [];
let itemId = 1;
let editingId: number | null = null;
const addItemsForm = document.getElementById(
  "product-items-form",
) as HTMLFormElement;
const saveBtn = document.getElementById("savePO")!;
const table = document.getElementById("itemsTable")!;
const grandTotalEl = document.getElementById("grandTotal")!;
const purchase_add_section = document.getElementById(
  "purchase-add-section",
) as HTMLDivElement;
const purchase_list = document.getElementById(
  "purchase-list",
) as HTMLDivElement;

let item: PurchaseOrderItem;
let products = JSON.parse(localStorage.getItem("products") || "[]");

const btn = document.getElementById("add-btn") as HTMLDivElement;
console.log("btn", btn);

btn.addEventListener("click", () => {
  console.log("clicked");

  purchase_add_section.classList.toggle("hidden");
  purchase_list.classList.toggle("hidden");
});

addItemsForm.addEventListener("submit", (e) => {
  console.log("addbtnclicked");

  e.preventDefault();
  const product_id = Number(
    (document.getElementById("product") as HTMLInputElement).value,
  );
  const qty = Number(
    (document.getElementById("qty") as HTMLInputElement).value,
  );
  const price = Number(
    (document.getElementById("price") as HTMLInputElement).value,
  );
  const taxPercent = Number(
    (document.getElementById("tax") as HTMLInputElement).value,
  );

  const tax = (qty * price * taxPercent) / 100;
  const total = qty * price + tax;

  item = {
    id: itemId++,
    product_id,
    quantity: qty,
    unitPrice: price,
    tax,
    total,
  };
  console.log("purchase items added ");

  items.push(item);
  renderItems();
});

function renderItems() {
  table.innerHTML = "";
  let grandTotal = 0;

  items.forEach((item) => {
    grandTotal += item.total;
    let productname = products.find((c: any) => c.id == item.product_id);

    table.innerHTML += `
      <tr class="border-t">
        <td>${productname.name}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice}</td>
        <td>${item.tax.toFixed(2)}</td>
        <td>${item.total.toFixed(2)}</td>
        <td>
        <button onclick="removeItem(${item.id})" class=" text-white   cursor-pointer">
       <i class="fa-solid fa-xmark" style="color: #FF0000;"></i></button>
        </td>
      </tr>
    `;
    (window as any).removeItem = function (id: number) {
      items = items.filter((item) => item.id !== id);
      renderItems();
    };
  });

  grandTotalEl.textContent = grandTotal.toFixed(2);
}

saveBtn.addEventListener("click", (e) => {


  e.preventDefault();


  if (items.length == 0) {
    showWarning("Add atleast one product to create a Purchase Order!");
    return;
  }


  const warehouse_id = Number(
    (document.getElementById("warehouse_id") as HTMLSelectElement).value
  );


  if (!warehouse_id) {
    showWarning("Select Warehouse");
    return;
  }


  const supplier_id = Number(
    (document.getElementById("supplier_id") as HTMLSelectElement).value
  );


  if (!supplier_id) {
    showWarning("Add Supplier first");
    return;
  }


  const name = (document.getElementById("name") as HTMLInputElement).value;


  if (!name) {
    showWarning("Add Purchase Title");
    return;
  }


  const grandTotal = Number(grandTotalEl.textContent);


  const purchaseOrders: PurchaseOrder[] =
    JSON.parse(localStorage.getItem("purchaseOrders") || "[]");


  if (editingId) {


    const index = purchaseOrders.findIndex(po => po.id === editingId);


    purchaseOrders[index] = {
      id:editingId,
      supplier_id,
      warehouse_id,
      name,
      status: "draft",
      total_amount: grandTotal,
      items
    };


    editingId = null;


  } else {


    const newPO: PurchaseOrder = {
      id: Date.now(),
      warehouse_id,
      supplier_id,
      name,
      status: "draft",
      total_amount: grandTotal,
      items
    };


    purchaseOrders.push(newPO);


    // Only add stock when creating new order
    items.forEach(item => {
      addStockEntry(
        item.product_id,
        warehouse_id,
        1,
        item.quantity
      );
    });
  }


  // ✅ SAVE ALWAYS (for both edit and create)
  localStorage.setItem("purchaseOrders", JSON.stringify(purchaseOrders));


  // Reset
  items = [];
  itemId = 1;
  renderItems();


  (document.getElementById("name") as HTMLInputElement).value = "";
  (document.getElementById("supplier_id") as HTMLSelectElement).value = "";
  (document.getElementById("warehouse_id") as HTMLSelectElement).value = "";


  render();
  showSuccess();
});



const tableBody = document.querySelector(
  "#purchaseTable tbody",
) as HTMLTableSectionElement;

function render() {
  const purchaseOrders: PurchaseOrder[] = JSON.parse(
    localStorage.getItem("purchaseOrders") || "[]",
  );

  tableBody.innerHTML = "";
  const warehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");

  purchaseOrders.forEach((po, index) => {
    const rowId = `items-${po.id}`;
    tableBody.innerHTML += `
      <tr class="border-t bg-white">
        <td class="py-3 px-2">${index + 1}</td>
        <td class="py-3 px-2">${po.id}</td>
     <td class="py-3 px-2">
  ${warehouses.find((w: any) => w.id === po.warehouse_id)?.name || "-"}
</td>

        <td class="py-3 px-2">${po.supplier_id}</td>
        <td class="py-3 px-2">${po.name}</td>
        <td class="py-3 px-2">${po.status}</td>
        <td class="py-3 px-2">₹ ${po.total_amount}</td>
        <td class="py-3 px-2">
          <button onclick="toggleItems('${rowId}')"
            class=" text-black px-3 py-1 rounded flex flex-col justify-center items-center hover:bg-teal-600 cursor-pointer" title="see all items">
         
           <i class="fa-solid fa-angle-down " style="color: #000;"></i>
          </button>
        </td>
        <td>
         <button onclick="editPurchaseOrder(${po.id})"
    class=" text-white px-2 py-3 rounded">
   <i class="fa-solid fa-pen-to-square cursor-pointer" style="color: #1e2939;"></i>
  </button>
    </td>
    <td>
  <button onclick="deletePurchaseOrder(${po.id})"
    class=" text-white px-2 py-3 rounded">
      <i class="fa-solid fa-trash cursor-pointer" style="color: #1e2939;"></i>
  </button>
    </td>
      </tr>

      <tr id="${rowId}" class="hidden ">
        <td colspan="8">
          ${renderItemsTable(po.items)}
        </td>
      </tr>
    `;
  });
}

(window as any).deletePurchaseOrder = function (id: number) {


  Swal.fire({
    title: "Are you sure?",
    text: "This will delete the Purchase Order",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then((result: any) => {


    if (result.isConfirmed) {


      let purchaseOrders: PurchaseOrder[] =
        JSON.parse(localStorage.getItem("purchaseOrders") || "[]");


   
      const order = purchaseOrders.find(po => po.id === id);


      if (!order) return;


     
      order.items.forEach((item:any) => {
        addStockEntry(
          item.product_id,
          order.warehouse_id,
          2, // OUT movement (reverse purchase)
          item.quantity
        );
      });




      purchaseOrders = purchaseOrders.filter(po => po.id !== id);


  
      localStorage.setItem("purchaseOrders", JSON.stringify(purchaseOrders));


      render();
    }
  });
};



(window as any).editPurchaseOrder = function (id: number) {
  const purchaseOrders: PurchaseOrder[] = JSON.parse(
    localStorage.getItem("purchaseOrders") || "[]",
  );

  const po = purchaseOrders.find((p) => p.id === id);

  if (!po) return;

  editingId = id;

  purchase_add_section.classList.remove("hidden");
  purchase_list.classList.add("hidden");

  (document.getElementById("supplier_id") as HTMLSelectElement).value =
    po.supplier_id.toString();

  (document.getElementById("name") as HTMLInputElement).value = po.name;
(document.getElementById("warehouse_id") as HTMLSelectElement).value =
  po.warehouse_id.toString();

  items = [...po.items];

  // this will prevent any id to be same after creating a new purchase item id
  itemId = Math.max(...items.map((i) => i.id), 0) + 1;

  renderItems();
};

function renderItemsTable(items: PurchaseOrderItem[]) {
  let html = `
    <div class="p-4 mt-2 mb-10">
    <table class="w-full border text-sm text-center py-4">
      <thead class="bg-emerald-400 h-4">
        <tr class="py-4 px-3">
          <th class="py-3 px-3">Product</th>
          <th class="py-3 px-3">Qty</th>
          <th class="py-3 px-3">Price</th>
          <th class="py-3 px-3">Tax</th>
          <th class="py-3 px-3">Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  items.forEach((item) => {
    let product = products.find((c: any) => c.id == item.product_id);
    html += `
      <tr class="divide-y">
        <td class="py-3 px-3">${product.name}</td>
        <td class="py-3 px-3">${item.quantity}</td>
        <td class="py-3 px-3">${item.unitPrice}</td>
        <td class="py-3 px-3">${item.tax.toFixed(2)}</td>
        <td class="py-3 px-3">${item.total.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;

  return html;
}

(window as any).toggleItems = function (id: string) {
  const row = document.getElementById(id);
  row?.classList.toggle("hidden");
};

render();

function loadSuppliersForDropdown() {
  const suppliers = JSON.parse(localStorage.getItem("suppliers") || "[]");
  console.log("suppliers running");

  if (suppliers.length === 0) {
    console.log("No Suppliers available");
    alert("You can't create Purchase Order first add Product Suppliers");
  }
  const select = document.getElementById("supplier_id") as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Suppliers</option>`;

  suppliers.forEach((sup: any) => {
    select.innerHTML += `
                <option value="${sup.id}">
                    ${sup.name}
                </option>
            `;
  });
}

function loadProductsForDropdown() {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  console.log("products running");

  if (products.length === 0) {
    console.log("No Products available");
    alert("You can't create Purchase Order first add Products");
  }
  const select = document.getElementById("product") as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Produts</option>`;

  products.forEach((pro: any) => {
    select.innerHTML += `
                <option value="${pro.id}">
                    ${pro.name}
                </option>
            `;
  });
}

function loadWarehousesForDropdown() {
  const warehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");

  const select = document.getElementById("warehouse_id") as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Warehouse</option>`;

  warehouses.forEach((wh: any) => {
    select.innerHTML += `
      <option value="${wh.id}">
        ${wh.name}
      </option>
    `;
  });
}

loadWarehousesForDropdown();

loadProductsForDropdown();

loadSuppliersForDropdown();

// deleting customer order:

// reverse stock
// addStockEntry(product_id, warehouse_id, 1, quantity);

// If deleting purchase order:

// addStockEntry(product_id, warehouse_id, 2, quantity);
