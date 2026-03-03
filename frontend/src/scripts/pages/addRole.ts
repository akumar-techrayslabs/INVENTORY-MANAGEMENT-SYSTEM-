import type { Role } from "../Models/Role.model.js";
import type { RolePermission } from "../Models/RolePermissions.model.js";



const organization_id = 1;

const STORAGE_KEY = "roles";

 let roles: Role[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
declare var Swal: any;

function showSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Role Added Successfully",
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    window.location.reload();
  });
}


let rolePermissions: RolePermission[] = JSON.parse(
  localStorage.getItem("rolePermissions") || "[]"
);

(window as any).showSuccess = showSuccess;
const form = document.getElementById("role-form") as HTMLFormElement;
// const tableBody = document.getElementById("category-table") as HTMLElement;
const table = document.querySelector("#roleTable") as HTMLTableSectionElement;
let sub_form = document.getElementById("role-form") as HTMLElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("roles");

  const name = (
    document.getElementById("name") as HTMLInputElement
  ).value.trim();

  if (!name) {
    alert("Role name required");
    return;
  }

  const existsCategory = roles.some(
    (rol) =>
      rol.name.toLowerCase() === name.toLowerCase() &&
      rol.organization_id === organization_id,
  );

  if (existsCategory) {
    alert("Role already exists");
    return;
  }

  const newRole: Role = {
    id: Number(Date.now().toString()),
    organization_id,
    name,
  };

  roles.push(newRole);

  const checkboxes = document.querySelectorAll(
    "#permission-container input[type='checkbox']:checked",
  );

  checkboxes.forEach((cb: any) => {
    rolePermissions.push({
      role_id: newRole.id,
      permission_id: Number(cb.value),
    });
  });

  localStorage.setItem("rolePermissions", JSON.stringify(rolePermissions));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));

  showSuccess();
  form.classList.toggle("hidden");
  table.classList.toggle("hidden");
  // renderCategories();
  form.reset();
});

const btn = document.getElementById("add-btn") as HTMLDivElement;
console.log("btn", btn);

btn.addEventListener("click", () => {
  console.log("clicked");

  form.classList.toggle("hidden");
  table.classList.toggle("hidden");
});
function renderSuppliers() {
  const tableBody = document.querySelector(
    "#roleTable tbody",
  ) as HTMLTableSectionElement;
  tableBody.innerHTML = "";

  roles.forEach((role, index) => {
    const rowId = `items-${role.id}`;

    tableBody.innerHTML += `
            <tr>
                <td class="p-2">${index + 1}</td>
                <td class="p-2">${role.name}</td>
                <td class="p-2">
                <button onclick="toggleItems('${rowId}')"
            class=" text-black px-3 py-1 rounded flex flex-col justify-center items-center hover:bg-teal-600 cursor-pointer" title="see all items">
         
           <i class="fa-solid fa-angle-down " style="color: #000;"></i>
          </button></td>
 

               
            </tr>
              <tr id="${rowId}" class="hidden ">
        <td colspan="8">
          ${renderRolesTable(role.id)}
        </td>
      </tr>
        `;
  });
}


function renderRolesTable(id:number) {
    const items = JSON.parse(localStorage.getItem("rolePermissions")|| "[]");
    console.log("items",items);
    
  let html = `
    <div class="p-4 mt-2 mb-10">
    <table class="w-full border text-sm text-center py-4">
      <thead class="bg-emerald-400 h-4">
        <tr class="py-4 px-3">
          <th class="py-3 px-3">Permissions</th>
         
        </tr>
      </thead>
      
      <tbody>
  `;
  const permissions = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  items.forEach((item:any) => {

    if(item.role_id == id)
    {
       let  permission_id = item.permission_id
       let permission = permissions.find((pr:any)=>pr.id == permission_id)
       console.log("permission",permission.name);
       

    html += `
      <tr class="divide-y">
      <td class="py-3 px-3">${permission.name}</td>
    
      </tr>
    `;
    }
 
  });

  html += `</tbody></table></div>`;

  return html;
}

(window as any).toggleItems = function(id: string) {
  const row = document.getElementById(id);
  row?.classList.toggle("hidden");
};

renderSuppliers();
