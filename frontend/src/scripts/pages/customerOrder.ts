

import type { CustomerOrder } from "../Models/CustomerOrder.model.js";
import type { CustomerOrderItem } from "../Models/CustomerOrderItem.model.js";
import { hasPermission } from "../services/protect.js";
import { addStockEntry, getCurrentStock } from "../services/stockManagement.js";






declare var Swal: any;

function showSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Customer Order Created",
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    window.location.reload();
  });
}

function showWarning(message: string) {
  Swal.fire({
    title: "Warning!",
    text: message,
    icon: "warning",
    confirmButtonText: "OK",
  });
}
function approveFeature(id: number) {
  Swal.fire({
    title: "Are you sure?",
    text: "This will approve the purchase order and stocks will get updated accordingly",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    cancelButtonColor: "#64748B",
    confirmButtonText: "Yes, Approve it",
    confirmButtonColor: "#DC2626",
  }).then((result: any) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted",
        text: "Feature successfully deleted",
        icon: "success",
        confirmButtonText: "OK",
      });
      approvePurchaseOrder(id);
      window.location.reload();
    }
  });
}
(window as any).approveFeature = approveFeature;

(window as any).showSuccess = showSuccess;
(window as any).showWarning = showWarning;
let editingCustomerId: number | null = null;
let items: CustomerOrderItem[] = [];
let itemId = 1;

const addItemsForm = document.getElementById(
  "product-items-form",
) as HTMLFormElement;

const close_btn = document.getElementById("close-btn") as HTMLButtonElement;
const saveBtn = document.getElementById("saveCO")!;
const table = document.getElementById("itemsTable")!;
const grandTotalEl = document.getElementById("grandTotal")!;
const customer_add_section = document.getElementById(
  "customer-add-section",
) as HTMLDivElement;
const customer_list = document.getElementById(
  "customer-list",
) as HTMLDivElement;

let products = JSON.parse(localStorage.getItem("products") || "[]");

const tableBody = document.querySelector(
  "#customerTable tbody",
) as HTMLTableSectionElement;

const btn = document.getElementById("add-btn") as HTMLDivElement;

btn.addEventListener("click", () => {
  customer_add_section.classList.toggle("hidden");
  customer_list.classList.toggle("hidden");
  btn.classList.toggle("hidden");
});

addItemsForm.addEventListener("submit", (e) => {
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

  if (!product_id || !qty || !price) {
    showWarning("Please fill all product details");
    return;
  }

  const total = qty * price;
  const prod = products.find((p:any)=>p.id == product_id)

  const warehouse_id = prod.warehouse_id
  const item: CustomerOrderItem = {
    id: itemId++,
    warehouse_id,
    product_id,
    quantity: qty,
    unit_price: price,
    total_amount: total,
  };

  items.push(item);
  renderItems();
});

function renderItems() {
  table.innerHTML = "";
  let grandTotal = 0;

  items.forEach((item) => {
    grandTotal += item.total_amount;
    let product = products.find((p: any) => p.id == item.product_id);

    table.innerHTML += `
      <tr class="border-t">
        <td>${product?.name || "N/A"}</td>
        <td>${item.quantity}</td>
        <td>${item.unit_price}</td>
        <td>${item.total_amount.toFixed(2)}</td>
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

  console.log("it is working");
  
  if (items.length === 0) {
    showWarning("Add at least one product to create Customer Order!");
    return;
  }


  const customer_id = Number(
    (document.getElementById("customer_id") as HTMLSelectElement).value
  );


  // const warehouse_id = 1; // change later if dynamic
  const status_id = 1;
  const created_by = 1;


  if (!customer_id) {
    showWarning("Please select customer");
    return;
  }


  const grandTotal = Number(grandTotalEl.textContent);


  let customerOrders: CustomerOrder[] =
    JSON.parse(localStorage.getItem("customerOrders") || "[]");




for (let item of items) {

  const product = products.find((p:any) => p.id == item.product_id)

  if(!product){
    showWarning("Product not found");
    return;
  }

  let currentStock = getCurrentStock(item.product_id, item.warehouse_id);

  // // If editing order → add old quantity back to stock for validation
  // if(editingCustomerId){

  //   const existingOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
  //   const existingOrder = existingOrders.find((o:any)=>o.id === editingCustomerId);

  //   const oldItem = existingOrder?.items.find((i:any)=>i.product_id === item.product_id);

  //   if(oldItem){
  //     currentStock = Number(currentStock) + Number(oldItem.quantity);
  //   }

  // }

  if (Number(currentStock) < Number(item.quantity)) {
    showWarning("Insufficient stock for selected product!");
    return;
  }

}






  if (editingCustomerId) {

  const index = customerOrders.findIndex(
    (order) => order.id === editingCustomerId
  );

  const existingOrder = customerOrders[index];

  if (!existingOrder) {
    showWarning("Order not found");
    return;
  }

  // Restore previous stock
  existingOrder.items.forEach((oldItem:any) => {

    const product = products.find((p:any)=>p.id === oldItem.product_id);

    if(!product) return;

    // addStockEntry(
    //   oldItem.product_id,
    //   oldItem.warehouse_id,
    //   1, // IN movement 
    //   oldItem.quantity
    // );

  });

  const warehouse_id = items.length ? items[0]?.warehouse_id : null;

  if (!warehouse_id) {
    showWarning("Warehouse not found for selected product");
    return;
  }

  // Apply new stock deduction
  items.forEach((item:any)=>{

    const product = products.find((p:any)=>p.id === item.product_id);

    if(!product) return;

    // addStockEntry(
    //   item.product_id,
    //   item.warehouse_id,
    //   2, // OUT movement
    //   item.quantity
    // );

  });
  customerOrders[index] = {
    id: editingCustomerId,
    warehouse_id,
    customer_id,
    status:"draft",
    created_by,
    total_amount: grandTotal,
    items
  };

  editingCustomerId = null;
}



  else {


    const warehouse_id = items.length? items[0]?.warehouse_id:null;
    if(!warehouse_id)
    {
      showWarning("Warehouse not found fof selected Product");
      return;
    }
    const newOrder: CustomerOrder = {
      id: Date.now(),
      customer_id,
      warehouse_id,
      status:"draft",

      total_amount: grandTotal,
      created_by,
      items
    };


    customerOrders.push(newOrder);



    items.forEach((item) => {
        const product = products.find((p:any)=>p.id === item.product_id);
        if(!product) return ;
      // addStockEntry(
      //   item.product_id,
      //   item.warehouse_id,
      //   2, // OUT movement
      //   item.quantity
      // );
    });
  }




  localStorage.setItem("customerOrders", JSON.stringify(customerOrders));


  // Reset
  items = [];
  itemId = 1;
  renderItems();


  (document.getElementById("customer_id") as HTMLSelectElement).value = "";


  customer_add_section.classList.add("hidden");
  customer_list.classList.remove("hidden");


  renderCustomerOrders();


  showSuccess();
});



function loadProductsForDropdown() {
  const products = JSON.parse(localStorage.getItem("products") || "[]");

  const select = document.getElementById("product") as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Product</option>`;

  if (products.length === 0) {
    alert("You must add Products first");
    return;
  }

  products.forEach((pro: any) => {
    select.innerHTML += `
      <option value="${pro.id}">
        ${pro.name}
      </option>
    `;
  });
}

function loadCustomersForDropdown() {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");

  const select = document.getElementById("customer_id") as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Customer</option>`;

  if (customers.length === 0) {
    alert("You must add Customers first");
    return;
  }

  customers.forEach((cus: any) => {
    select.innerHTML += `
      <option value="${cus.id}">
        ${cus.name}
      </option>
    `;
  });
}

function renderCustomerOrders() {
  const customerOrders: CustomerOrder[] = JSON.parse(
    localStorage.getItem("customerOrders") || "[]",
  );

  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const warehouses = JSON.parse(localStorage.getItem("warehouses") || "[]");
  const statuses = JSON.parse(localStorage.getItem("statuses") || "[]");

  tableBody.innerHTML = "";

  customerOrders.forEach((order, index) => {
    const rowId = `items-${order.id}`;

    const customer = customers.find((c: any) => c.id == order.customer_id);
    const warehouse = warehouses.find((w: any) => w.id == order.warehouse_id);
 

    tableBody.innerHTML += `
      <tr class="border-t bg-white">
        <td class="py-3 px-2">${index + 1}</td>
        <td class="py-3 px-2">${order.id}</td>
        <td class="py-3 px-2">${customer?.name || "-"}</td>
        <td class="py-3 px-2">${warehouse?.name || "-"}</td>
        <td class="py-3 px-2">
  ${
    order.status === "draft"
      ? `<button onclick="approveFeature(${order.id})"
         class="bg-green-500 text-white px-2 py-1 rounded cursor-pointer">
         Approve
       </button>`
      : `<span class="text-green-600 font-semibold">Approved</span>`
  }
</td>
        <td class="py-3 px-2">₹ ${order.total_amount}</td>
        <td class="py-3 px-2">
          <button onclick="toggleItems('${rowId}')"
            class="text-black px-3 py-1 rounded hover:bg-teal-600 cursor-pointer">
            <i class="fa-solid fa-angle-down"></i>
          </button>
        </td>

         <td>
             ${
  order.status === "draft"
    ? `<button onclick="editCustomerOrder(${order.id})"
       class="text-white px-2 py-3 rounded">
       <i class="fa-solid fa-pen-to-square cursor-pointer" style="color:#1e2939;"></i>
     </button>`
    : `<span class="text-gray-400">Locked</span>`
}
 </td>
 
      <td>
    ${order.status === "draft" ?` <button onclick="deleteCustomerOrder(${order.id})"
    class=" text-white px-2 py-3 rounded">
      <i class="fa-solid fa-trash cursor-pointer" style="color: #1e2939;"></i>
  </button>`:`<span class="text-gray-400">Locked</span>`}
 
    </td>
      </tr>

      <tr id="${rowId}" class="hidden ">
        <td colspan="7">
          ${renderItemsTable(order.items)}
        </td>
      </tr>
    `;
  });
}

(window as any).deleteCustomerOrder = function (id: number) {
  Swal.fire({
    title: "Are you sure?",
    text: "This will delete the Customer Order",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  }).then((result: any) => {
    if (result.isConfirmed) {
      if (!hasPermission("DELETE_PRODUCT")) {
        alert("You are not authorized");
        return;
      } else {
        let customerOrders: CustomerOrder[] = JSON.parse(
          localStorage.getItem("customerOrders") || "[]",
        );
        const order = customerOrders.find(order => order.id == id);

        customerOrders = customerOrders.filter((order) => order.id !== id);
        //   const orderId = products.find((pr)=)
        order?.items.forEach((item) => {
          const product = products.find((p:any) => p.id === item.product_id)
          if(!product) return ;
          addStockEntry(
            item.product_id,
            product.warehouse_id,
            1, // in  movement
            item.quantity,
          );
        });

        localStorage.setItem("customerOrders", JSON.stringify(customerOrders));

        renderCustomerOrders();
      }
    }
  });
};

(window as any).approvePurchaseOrder = approvePurchaseOrder;
// function to approved Purchase Orders 
 function approvePurchaseOrder(id: number) {

  let customerOrder: CustomerOrder[] =
    JSON.parse(localStorage.getItem("customerOrders") || "[]");

    if(!customerOrder)
    {
      showWarning("No purchase Order found");
      return;
    }
  const index = customerOrder.findIndex(po => po.id === id);

  if (index === -1) return;

  const order = customerOrder[index];
  if(order?.status === "approved")
  {
    showWarning("Order is already approved");
    return;
  }
  if(!order)return;
     order.items.forEach(item => {
      addStockEntry(
        item.product_id,
        order.warehouse_id,
        2,
        item.quantity
      );
    });
  if(order?.status)

  customerOrder[index]!.status = "approved";


  localStorage.setItem("customerOrders", JSON.stringify(customerOrder));

  // showSuccess("Purchase Order Approved");
  Swal.fire({
    title: "Success!",
    text: "Customer Order Approved and Stock Updated",
    icon: "success",
    confirmButtonText: "OK"
  });
renderCustomerOrders();
 
};
/*

  items.forEach(item => {

  const currentStock = getCurrentStock(item.product_id, 1);
    console.log("currentStock ",currentStock);
    console.log("item-quantity",item.quantity);
    let curStock = Number(currentStock);
    let curQuantity = Number(item.quantity)
  if(curStock < curQuantity){
    console.log("------------------------------------------------");
    alert("Insufficient stock for selected product!")
    // showWarning("Insufficient stock for selected product!");
    return;
  }
  else{
      const newOrder: CustomerOrder = {
    id: Date.now(),
    customer_id,
    warehouse_id,
    status_id,
    total_amount: grandTotal,
    created_by,
    items
  };

  customerOrders.push(newOrder);
     addStockEntry(
    item.product_id,
    1,
    2, // out movement       
    item.quantity
  );

  items = [];
itemId = 1;
renderItems();

(document.getElementById("customer_id") as HTMLSelectElement).value = "";

customer_add_section.classList.add("hidden");
customer_list.classList.remove("hidden");

renderCustomerOrders();

  showSuccess();
  }

 

});

*/
(window as any).editCustomerOrder = function (id: number) {
     const heading = document.getElementById("heading") as HTMLHeadElement;
   heading.innerText = "Update Customer Order"
   saveBtn.innerText = "Update Customer Order"
   btn.classList.toggle("hidden")
  const customerOrders: CustomerOrder[] = JSON.parse(
    localStorage.getItem("customerOrders") || "[]",
  );
  if (!hasPermission("UPDATE_ORDERS")) {
    alert("You are not authorized");
    return;
  } else {
    const order = customerOrders.find((o) => o.id === id);

    if (!order) return;

    editingCustomerId = id;

    customer_add_section.classList.remove("hidden");
    customer_list.classList.add("hidden");

    (document.getElementById("customer_id") as HTMLSelectElement).value =
      order.customer_id.toString();

    items = [...order.items];
    // this is so that no items can have the same id after adding new items
    itemId = Math.max(...items.map((i) => i.id), 0) + 1;

    renderItems();
  }
};

function renderItemsTable(items: CustomerOrderItem[]) {
  const products = JSON.parse(localStorage.getItem("products") || "[]");

  let html = `
    <div class="p-4 mt-2 mb-10">
      <table class="w-full border text-sm text-center">
        <thead class="bg-emerald-400">
          <tr>
            <th class="py-3 px-3">Product</th>
            <th class="py-3 px-3">Qty</th>
            <th class="py-3 px-3">Unit Price</th>
            <th class="py-3 px-3">Total</th>
          </tr>
        </thead>
        <tbody>
  `;

  items.forEach((item) => {
    const product = products.find((p: any) => p.id == item.product_id);

    html += `
      <tr>
        <td class="py-3 px-3">${product?.name || "-"}</td>
        <td class="py-3 px-3">${item.quantity}</td>
        <td class="py-3 px-3">${item.unit_price}</td>
        <td class="py-3 px-3">${item.total_amount.toFixed(2)}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}

(window as any).toggleItems = function (id: string) {
  const row = document.getElementById(id);
  row?.classList.toggle("hidden");
};

close_btn.addEventListener("click", () => {

  customer_add_section.classList.toggle("hidden");
  btn.classList.toggle("hidden")
  customer_list.classList.remove("hidden")
  addItemsForm.classList.toggle("hidden");
});

renderCustomerOrders();

loadProductsForDropdown();
loadCustomersForDropdown();
