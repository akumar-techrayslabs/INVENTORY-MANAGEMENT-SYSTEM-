import type { Category } from "../Models/Category.model.js";
import type { Product } from "../Models/product.model.js";
import { hasPermission } from "../services/protect.js";

declare var Swal: any;
function showWarning(msg: string) {
  Swal.fire({
    title: "warning!",
    text: msg,
    icon: "warning",
    confirmButtonText: "OK",
  }).then(() => {
    return;
  });
}
(window as any).showWarning = showWarning;
function showSuccess(msg: string) {
  Swal.fire({
    title: "success!",
    text: msg,
    icon: "success",
    confirmButtonText: "OK",
  }).then(() => {
    window.location.reload();
  });
}

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
      updatedCategory();
      // window.location.reload();
    }
  });
}

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
      deleteCategory(id);
      window.location.reload();
      
    }
  });
}
(window as any).showWarning = showWarning;
(window as any).showSuccess = showSuccess;
(window as any).deleteFeature = deleteFeature;

const organization_id = 1;

const STORAGE_KEY = "categories";

let categories: Category[] = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]",
);

const form = document.getElementById("category-form") as HTMLFormElement;
// const tableBody = document.getElementById("category-table") as HTMLElement;

let sub_form = document.getElementById("category-form") as HTMLElement;
const closeButton = document.getElementById("close-btn") as HTMLButtonElement;
const form_label = document.getElementById("form-label") as HTMLHeadElement;
const subBtn = document.getElementById("sub-btn") as HTMLButtonElement;


const table = document.querySelector(
  "#categoryTable",
) as HTMLTableSectionElement;
closeButton.addEventListener('click',()=>{
  sub_form.classList.toggle("hidden");
  table.classList.toggle("hidden")
  btn.classList.toggle("hidden");
})


form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!editingCategoryId) {
    if (!hasPermission("ADD_CATEGORY")) {
      showWarning("You are not authorized");
      return;
    } else {
      console.log("category");

      const name = (
        document.getElementById("name") as HTMLInputElement
      ).value.trim();

      if (!name) {
        showWarning("Category name required");
        return;
      }
      const categoryRegX = /^[A-Za-z0-9][A-Za-z0-9\s\-_]{2,49}$/;
      if (!categoryRegX.test(name)) {
        showWarning(
          "Category name should be atleast 3 digits long and doesn't exceed 50 digits, should not include and special characters",
        );
        return;
      }

      const existsCategory = categories.some(
        (cat) =>
          cat.name.toLowerCase() === name.toLowerCase() &&
          cat.organization_id === organization_id,
      );

      if (existsCategory) {
        showWarning("Category already exists");
        return;
      }

      const newCategory: Category = {
        id: Number(Date.now().toString()),
        organization_id,
        name,
        is_active: true,
      };

      categories.push(newCategory);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      sub_form.classList.toggle("hidden");
      table.classList.toggle("hidden");
      showSuccess("Category added Successfully!");
      renderCategories();

      form.reset();
    }
  } else {

    editFeature();

    // document.getElementById("edit-form")?.classList.toggle("hidden");
    // document.getElementById("productTable")?.classList.toggle("hidden");
  }
});

const btn = document.getElementById("add-btn") as HTMLDivElement;
console.log("btn", btn);

btn.addEventListener("click", () => {

  console.log("clicked");

  form.classList.toggle("hidden");
  table.classList.toggle("hidden");
  btn.classList.toggle("hidden");
});

function renderCategories() {
  const tableBody = document.querySelector(
    "#categoryTable tbody",
  ) as HTMLTableSectionElement;
  tableBody.innerHTML = "";

  categories.forEach((cat, index) => {
    tableBody.innerHTML += `
            <tr>
                <td class="p-2">${index + 1}</td>
                <td class="p-2">${cat.name}</td>
                <td class="p-2">${cat.is_active}</td>
                <td class="p-2"><i class="fa-solid fa-trash cursor-pointer" style="color: #1e2939;" onclick="deleteFeature(${cat.id})"></i></td>
        
                     <td class="py-3 px-4"> <i class="fa-solid fa-pen-to-square cursor-pointer" style="color: #1e2939;" onclick="editCategory(${cat.id})"></i>
      </td>
               
            </tr>
        `;
  });
}

function deleteCategory(id: number): void {
  categories = categories.filter((p) => p.id != id);
  let products: Product[] = JSON.parse(
    localStorage.getItem("products") || "[]",
  );
  const product = products.some((p: any) => {
    p.category_id == id;
  });

  if (product) {
    showWarning(
      "This category has been assigned to some products you can't delete",
    );
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));

  //   showDelete();
}
(window as any).deleteCategory = deleteCategory;

let editingCategoryId: number | null = null;

function editCategory(id: number): void {
  const sub_btn = document.getElementById("sub-btn") as HTMLButtonElement;

  form_label.innerText="Edit Category";
  subBtn.innerText = "Edit Category";



  console.log("edit-btn-clicked");

  const category = categories.find((p) => p.id == id);

  if (!category) {
    showWarning("No Categories found");
    return;
  }

  console.log("product", category);

  editingCategoryId = id;

  const editForm = document.getElementById("category-form") as HTMLElement;
  console.log("editform", editForm);

  const table = document.getElementById("categoryTable") as HTMLElement;

  editForm.classList.remove("hidden");
  table.classList.add("hidden");

  (document.getElementById("name") as HTMLInputElement).value = category.name;
}

(window as any).editCategory = editCategory;

function updatedCategory(): void {
  if (editingCategoryId == null) 
  {
    showWarning("no Category Id is there")
    console.log("no editingCategory Id ");
    
    return;
  }

  const name = (document.getElementById("name") as HTMLInputElement).value;

  if (!name) {
    showWarning("Category name required");
    return;
  }
  const categoryRegX = /^[A-Za-z0-9][A-Za-z0-9\s\-_]{2,49}$/;
  if (!categoryRegX.test(name)) {
    showWarning(
      "Category name should be atleast 3 digits long and doesn't exceed 50 digits, should not include and special characters",
    );
    return;
  }

  const existsCategory = categories.some(
    (cat) =>
      cat.name.toLowerCase() === name.toLowerCase() &&
      cat.organization_id === organization_id && 
      cat.id !== editingCategoryId
  );

  if (existsCategory) {
    showWarning(
      "Can't update this category name with already exists other categories name",
    );
    return;
  }

  const updatedCategory: Category = {
    id: editingCategoryId,
    name,
    organization_id,
    is_active: true,
  };

  console.log("editiingCategoryId", editingCategoryId);

  categories = categories.map((p) =>
    p.id == editingCategoryId ? updatedCategory : p,
  );

  localStorage.setItem("categories", JSON.stringify(categories));

  document.getElementById("category-form")?.classList.toggle("hidden");
  document.getElementById("categoryTable")?.classList.toggle("hidden");

  editingCategoryId = null;

  renderCategories();

  Swal.fire({
    title: "Success!",
    text: "Category Updated Successfully",
    icon: "success",
    confirmButtonText: "OK",
  });
}

// 
// console.log("btn", btn);
//     console.log("btn",btn);

//   editbtn?.addEventListener("click",(e)=>{
//     e.preventDefault();
//     console.log("edit-btnclicked");
//     // updatedProduct();

//   });

(window as any).updatedCategory = updatedCategory;

renderCategories();
