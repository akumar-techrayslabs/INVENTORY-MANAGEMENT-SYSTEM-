import type { Wareshouse } from "../Models/Warehouse.model.js";

declare var Swal: any;
function showSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Warehouse Added Successfully",
    icon: "success",
    confirmButtonText: "OK",
  }).then(()=>{
    window.location.reload();
  });
}
(window as any).showSuccess = showSuccess;

const organization_id = 1;

const STORAGE_KEY = "warehouses";

let warehouses: Wareshouse[] = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]",
);

const form = document.getElementById("warehouse-form") as HTMLFormElement;

const table = document.querySelector(
  "#warehouseTable",
) as HTMLTableSectionElement;

  let sub_form = document.getElementById("warehouse-form") as HTMLElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("customers");

  const name = (
    document.getElementById("warehouse-name") as HTMLInputElement
  ).value.trim();
  const location = (
    document.getElementById("warehouse-location") as HTMLInputElement
  ).value.trim();

    const manager_id =
    Number(
      (document.getElementById("warehouse-manager") as HTMLSelectElement).value,
    ) || null;

  if (!name) {
    alert("Warehouse name required");
    return;
  }
  if (!location) {
    alert("Location is required");
    return;
  }
  if (!manager_id) {
    alert("Manager is required");
    return;
  }

  const existsmanagerId = warehouses.some(
    (war) => war.manager_id === manager_id && war.organization_id === organization_id,
  );

  if (existsmanagerId) {
    alert("A manager with this Id is already assigned to other warehouse please assign a different manager");
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
  table.classList.remove("hidden")
  showSuccess();
  // renderCategories();
  form.reset();


});

const btn = document.getElementById("add-btn") as HTMLDivElement;
console.log("btn", btn);

btn.addEventListener("click", () => {
  console.log("clicked");
  

  sub_form.classList.toggle("hidden");
  table.classList.toggle("hidden")
});
function renderWarehouses() {
    const tableBody = document.querySelector(
  "#warehouseTable tbody",
) as HTMLTableSectionElement;
  tableBody.innerHTML = "";
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  warehouses.forEach((war, index) => {
    const manager_name = users.find((us:any)=>us.id === war.manager_id)
    tableBody.innerHTML += `
            <tr>
                <td class="p-2">${index + 1}</td>
                <td class="p-2">${war.name}</td>
                <td class="p-2">${war.location}</td>
                <td class="p-2">${manager_name.full_name}</td>

               
            </tr>
        `;
  });
}
function loadUsersForDropdown() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  console.log("loadusers running");
  
  if(users.length === 0 )
  {
    console.log("No User available");
    alert("No User added Please add a User First!")
  }
  const select = document.getElementById(
    "warehouse-manager",
  ) as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Manager</option>`;

  users
    .forEach((user: any) => {
      select.innerHTML += `
                <option value="${user.id}">
                    ${user.full_name}
                </option>
            `;
    });
}
loadUsersForDropdown();
renderWarehouses();
