import type { Customers } from "../Models/Customers.model.js";

declare var Swal: any;
function showSuccess() {
  Swal.fire({
    title: "Success!",
    text: "Customer Added Successfully",
    icon: "success",
    confirmButtonText: "OK",
  }).then(()=>{
    window.location.reload();
  });
}
(window as any).showSuccess = showSuccess;

const organization_id = 1;

const STORAGE_KEY = "customers";

let customers: Customers[] = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]",
);

const form = document.getElementById("customer-form") as HTMLFormElement;

const table = document.querySelector(
  "#customerTable",
) as HTMLTableSectionElement;
  let sub_form = document.getElementById("customer-form") as HTMLElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log("customers");

  const name = (
    document.getElementById("name") as HTMLInputElement
  ).value.trim();
  const email = (
    document.getElementById("email") as HTMLInputElement
  ).value.trim();
  const company = (
    document.getElementById("company") as HTMLInputElement
  )?.value.trim()

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

  const existsCustomerEmail = customers.some(
    (cus) => cus.email === email && cus.organization_id === organization_id,
  );

  if (existsCustomerEmail) {
    alert("Customer with this email id is already exists");
    return;
  }

  const newCustomer: Customers = {
    id: Number(Date.now().toString()),
    organization_id,
    name,
    email,
    company,
    is_active: true,
  };

  customers.push(newCustomer);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
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
function renderCustomers() {
    const tableBody = document.querySelector(
  "#customerTable tbody",
) as HTMLTableSectionElement;
  tableBody.innerHTML = "";

  customers.forEach((cus, index) => {
    tableBody.innerHTML += `
            <tr>
                <td class="p-2">${index + 1}</td>
                <td class="p-2">${cus.name}</td>
                <td class="p-2">${cus.email}</td>
                <td class="p-2">${cus.company}</td>

               
            </tr>
        `;
  });
}

renderCustomers();
