import type { Wareshouse } from "../Models/Warehouse.model.js";
import { nameRegX } from "../utils/validations.js";
import { initLocationDropdown, loadDistricts } from "../utils/loadLocationData.js";
import { showWarning } from "../utils/SwalFunctions.js";

declare var Swal: any;

function showSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Warehouse Added Successfully",
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    window.location.reload();
  });
}
(window as any).showSuccess = showSuccess;

function deleteFeature(id: number) {
  Swal.fire({
    title: "Are you sure?",
    text: "This will be deleted and can't be recover later",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    cancelButtonColor: "#64748B",
    confirmButtonText: "Yes, Delete it",
    confirmButtonColor: "#DC2626",
  }).then((result: any) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted",
        text: "Category successfully deleted",
        icon: "success",
        confirmButtonText: "OK",
      });
      deleteWarehouse(id);
      window.location.reload();
    }
  });
}

const form_heading = document.getElementById("heading") as HTMLHeadElement;
const sub_btn = document.getElementById("sub-btn") as HTMLButtonElement;

function editFeature() {
  Swal.fire({
    title: "Are you sure?",
    text: "This will change the edited fields",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    cancelButtonColor: "#64748B",
    confirmButtonText: "Yes, Edit it",
    confirmButtonColor: "#DC2626",
  }).then((result: any) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Edited",
        text: "Category successfully edited",
        icon: "success",
        confirmButtonText: "OK",
      });
      form.classList.toggle("hidden");
      table.classList.toggle("hidden");
      btn.classList.toggle("hidden");
      updatedWarehouse();
      window.location.reload();
    }
  });
}

let editingWarehouseId: number | null = null;

(window as any).deleteFeature = deleteFeature;
(window as any).editFeature = editFeature;

const organization_id = 1;

const STORAGE_KEY = "warehouses";

let warehouses: Wareshouse[] = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]"
);

const form = document.getElementById("warehouse-form") as HTMLFormElement;

const table = document.querySelector("#warehouseTable") as HTMLTableSectionElement;

let sub_form = document.getElementById("warehouse-form") as HTMLElement;

const close_btn = document.getElementById("close-btn") as HTMLButtonElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

if(editingWarehouseId == null)
{
    const name = (
    document.getElementById("warehouse-name") as HTMLInputElement
  ).value.trim();

  console.log("name",name);
  
  const isWarehouseNameExist = warehouses.some((p:any)=>
    p.name == name
  )

 warehouses.forEach((p)=>{
  console.log("name::",p.name);
  
 })
  const warehouseshde = warehouses.filter((p:any)=>{
     p.name.toLowerCase() == name.toLowerCase() 
  })
     console.log("warehousehde",warehouseshde);
     
      if (!nameRegX.test(name)) {
        showWarning(
          "Warehouse name should be atleast 3 digits long and doesn't exceed 50 digits, should not include any special characters ",
        );
        return;
      }
      console.log(isWarehouseNameExist);
      
  if(isWarehouseNameExist)
  {
    showWarning("Warehouses names should be different");
    return;
  }


  const state = (document.getElementById("state") as HTMLSelectElement).value;
  const district = (document.getElementById("district") as HTMLSelectElement).value;

  if (!state) {
    showWarning("Please select a state");
    return;
  }

  if (!district) {
    showWarning("Please select a district");
    return;
  }

  const location = `${district}, ${state}`;

  const manager_id =
    Number(
      (document.getElementById("warehouse-manager") as HTMLSelectElement).value
    ) || null;

  if (!name) {
    showWarning("Warehouse name required");
    return;
  }

  if (!location) {
    showWarning("Location is required");
    return;
  }

  if (!manager_id) {
    showWarning("Manager is required");
    return;
  }

  if (name.length < 3 || name.length > 50) {
    showWarning("Name must be between 3 and 50 characters.");
    return;
  }

  const regex = /^[a-zA-Z0-9\s-]+$/;

  if (!regex.test(name)) {
    showWarning(
      "Warehouse Name can only contain letters, numbers, spaces, and hyphens."
    );
    return;
  }

  const existsmanagerId = warehouses.some(
    (war) =>
      war.manager_id === manager_id &&
      war.organization_id === organization_id &&
      war.id !== editingWarehouseId
  );

  if (existsmanagerId) {
    showWarning(
      "A manager with this Id is already assigned to other warehouse please assign a different manager"
    );
    return;
  }

  const newWarehouse: Wareshouse = {
    id: Number(Date.now().toString()),
    organization_id,
    name,
    location,
    manager_id,
    is_active: true,
  };

  warehouses.push(newWarehouse);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(warehouses));

  sub_form.classList.add("hidden");
  table.classList.remove("hidden");

  showSuccess();

  form.reset();
}
else{
  editFeature();
}
});

const btn = document.getElementById("add-btn") as HTMLDivElement;

btn.addEventListener("click", () => {
  btn.classList.add("hidden");
  sub_form.classList.toggle("hidden");
  table.classList.toggle("hidden");
});

function renderWarehouses() {
  const tableBody = document.querySelector(
    "#warehouseTable tbody"
  ) as HTMLTableSectionElement;

  tableBody.innerHTML = "";

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  warehouses.forEach((war, index) => {
    const manager_name = users.find((us: any) => us.id === war.manager_id);

    tableBody.innerHTML += `
      <tr>
        <td class="p-2">${index + 1}</td>
        <td class="p-2">${war.name}</td>
        <td class="p-2">${war.location}</td>
        <td class="p-2">${manager_name?.full_name || ""}</td>
        <td class="p-2">
          <i class="fa-solid fa-trash cursor-pointer" style="color: #1e2939;" onclick="deleteFeature(${war.id})"></i>
        </td>
        <td class="py-3 px-4">
          <i class="fa-solid fa-pen-to-square cursor-pointer" style="color: #1e2939;" onclick="editWarehouse(${war.id})"></i>
        </td>
      </tr>
    `;
  });
}

function deleteWarehouse(id: number): void {
  warehouses = warehouses.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(warehouses));
}

(window as any).deleteWarehouse = deleteWarehouse;

function editWarehouse(id: number): void {

  sub_btn.innerText = "Update Warehouse";
  form_heading.innerText = "Update Warehouse";
  btn.classList.toggle("hidden");
  const warehouse = warehouses.find((p) => p.id == id);

  if (!warehouse) {
    showWarning("No Warehouses found");
    return;
  }

  editingWarehouseId = id;

  const editForm = document.getElementById("warehouse-form") as HTMLElement;

  editForm.classList.remove("hidden");
  table.classList.add("hidden");

  (document.getElementById("warehouse-name") as HTMLInputElement).value = warehouse.name;


  const [district, state] = warehouse.location.split(", ");

  const stateSelect = document.getElementById("state") as HTMLSelectElement;
  const districtSelect = document.getElementById("district") as HTMLSelectElement;

  if(!state)
  {
    console.error("state is not present");
    return;
  }
  if(!district)
  {
    console.error("district is not present");
    return;
  }
  stateSelect.value = state;


  loadDistricts(state);


  setTimeout(() => {
    districtSelect.value = district;
  }, 100);


  (document.getElementById("warehouse-manager") as HTMLSelectElement).value =
    warehouse.manager_id?.toString() || "";
}


(window as any).editWarehouse = editWarehouse;

function updatedWarehouse(): void {
  if (editingWarehouseId == null) {
    showWarning("no Warehouse Id is there");
    return;
  }

  const name = (
    document.getElementById("warehouse-name") as HTMLInputElement
  ).value;

  if (!name) {
    showWarning("Warehouse name required");
    return;
  }

  const categoryRegX = /^[A-Za-z0-9][A-Za-z0-9\s\-_]{2,49}$/;

  if (!categoryRegX.test(name)) {
    showWarning(
      "Warehouse name should be atleast 3 digits long and doesn't exceed 50 digits, should not include special characters"
    );
    return;
  }
  const state = (document.getElementById("state") as HTMLSelectElement).value;
const district = (document.getElementById("district") as HTMLSelectElement).value;

if (!state) {
  showWarning("Please select a state");
  return;
}

if (!district) {
  showWarning("Please select a district");
  return;
}

const location = `${district}, ${state}`;


warehouses = warehouses.map((p) =>
  p.id == editingWarehouseId ? { ...p, name, location } : p
);

  

  localStorage.setItem(STORAGE_KEY, JSON.stringify(warehouses));

  editingWarehouseId = null;

  renderWarehouses();

  Swal.fire({
    title: "Success!",
    text: "Warehouse Updated Successfully",
    icon: "success",
    confirmButtonText: "OK",
  });
}

function loadUsersForDropdown() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.length === 0) {
    showWarning("No User added Please add a User First!");
  }

  const select = document.getElementById(
    "warehouse-manager"
  ) as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Manager</option>`;

  users.forEach((user: any) => {
    select.innerHTML += `
      <option value="${user.id}">
        ${user.full_name}
      </option>
    `;
  });
}

const stateSelect = document.getElementById("state") as HTMLSelectElement;

stateSelect.addEventListener("change", () => {
  const state = stateSelect.value;
  loadDistricts(state);
});

close_btn.addEventListener("click", () => {
  editingWarehouseId = null;
  window.location.reload();
  btn.classList.remove("hidden");
  form.classList.add("hidden");
  table.classList.remove("hidden");
  // window.location.reload();
});

loadUsersForDropdown();
renderWarehouses();
initLocationDropdown();
