import type { Suppliers } from "../Models/Suppliers.model.js";

declare var Swal:any
function showSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Supplier Added Successfully",
    icon: "success",
    confirmButtonText: "OK",
  }).then(()=>{
  
      
  form.classList.add("hidden");
  table.classList.remove("hidden")
      renderSuppliers();
  });
}
(window as any).showSuccess = showSuccess

const organization_id = 1;
const table = document.querySelector(
  "#supplierTable",
) as HTMLTableSectionElement;
//   let sub_form = document.getElementById("customer-form") as HTMLElement;

const STORAGE_KEY = "suppliers";

let suppliers: Suppliers[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
);

const form = document.getElementById("supplier-form") as HTMLFormElement;



form.addEventListener("submit", (e) => {
    e.preventDefault();

   console.log("suppliers");
   

    const name = (
        document.getElementById("name") as HTMLInputElement
    ).value.trim();
    const email = (
        document.getElementById("email") as HTMLInputElement
    ).value.trim();
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
  }


    if (!name) {
        alert("Suppliers name required");
        return;
    }
    if (!email) {
        alert("Email is required");
        return;
    }

   
    const existsSupplierEmail = suppliers.some(
        sup => sup.email === email
            && sup.organization_id === organization_id
    );

    if (existsSupplierEmail) {
        alert("Supplier with this email id is already exists");
        return;
    }

    const newSupplier: Suppliers = {
        id: Number(Date.now().toString()),
        organization_id,
        name,
        email,
        is_active: true
    };

    suppliers.push(newSupplier);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));

    showSuccess();
  
    // renderCategories();
    form.reset();
});


const btn = document.getElementById("add-btn") as HTMLDivElement;
console.log("btn", btn);

btn.addEventListener("click", () => {
  console.log("clicked");
  btn.classList.toggle("hidden");

  form.classList.toggle("hidden");
  table.classList.toggle("hidden")
});
function renderSuppliers() {
    const suppliers = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const tableBody = document.querySelector(
  "#supplierTable tbody",
) as HTMLTableSectionElement;
  tableBody.innerHTML = "";

  suppliers.forEach((sup:any, index:any) => {
    tableBody.innerHTML += `
            <tr>
                <td class="p-2">${index + 1}</td>
                <td class="p-2">${sup.name}</td>
                <td class="p-2">${sup.email}</td>
                <td class="p-2">${sup.is_active}</td>

               
            </tr>
        `;
  });
}
const close_btn = document.getElementById("close-btn") as HTMLButtonElement;
close_btn.addEventListener("click",()=>{
document.getElementById("supplier-form")?.classList.toggle("hidden");
document.getElementById("supplierTable")?.classList.toggle("hidden");
btn.classList.toggle("hidden");

})
renderSuppliers();

