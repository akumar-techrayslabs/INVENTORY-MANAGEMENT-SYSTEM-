import type { Product } from "../Models/product.model.js";
import type { ProductVariant } from "../Models/productVariant.model.js";
import { hasPermission } from "../services/protect.js";
import { showSuccess, showWarning } from "../utils/SwalFunctions.js";
import { ProductNameRegex, skuRegex } from "../utils/validations.js";

console.log("Products page");

let products: Product[] = JSON.parse(localStorage.getItem("products") || "[]");

let varieties: ProductVariant[] = JSON.parse(
  localStorage.getItem("varieties") || "[]",
);

const form = document.getElementById("product-form") as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!hasPermission("ADD_PRODUCT")) {
    alert("You are not authorized");
    return;
  } else {
    const warehouse_id = Number(
      (document.getElementById("warehouse_id") as HTMLSelectElement).value,
    );
    const name = (
      document.getElementById("product-name") as HTMLInputElement
    ).value.trim();

    const sku = (
      document.getElementById("product-sku") as HTMLInputElement
    ).value.trim();


    const category_id =
      Number(
        (document.getElementById("product-category") as HTMLSelectElement)
          .value,
      ) || null;

    console.log("jjhjkhjhjhjhhjkhjhjhj", category_id);

    const reorder_level = 0;

      const skuExists = products.some(
        (p) => p.sku === sku,
      );

      if (skuExists) {
        showWarning("SKU already exists for this organization");
        return;
      }

    if (!ProductNameRegex.test(name)) {
      showWarning(
        "Invalid product name, it must be atleast 3 digit long and doesn't exceed 100 characters, must not include any special characters",
      );
      return;
    }

    if (!skuRegex.test(sku)) {
      showWarning(
        "SKU must be 3-20 characters and contain only uppercase letters, numbers, _ or -",
      );
      return;
    }

    if (!warehouse_id) {
      showWarning("Please select warehouse");
      return;
    }

    if (!category_id) {
      showWarning("Please select category");
      return;
    }

    // const skuExists = products.some((p) => p.sku === sku);

    // if (skuExists) {
    //   showWarning("Product SKU already exists");
    //   return;
    // }

    const productId = Date.now();

    const newProduct: Product = {
      id: productId,
      warehouse_id,
      name,
      sku,
      category_id,
      reorder_level,
      is_active: true,
      organization_id:1,
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    const variant_name = (
      document.getElementById("product-variant-name") as HTMLInputElement
    ).value.trim();
    const variant_sku = (
      document.getElementById("product-variant-sku") as HTMLInputElement
    ).value.trim();
    const variant_price = Number(
      (document.getElementById("product-price") as HTMLInputElement).value,
    );

    if (!ProductNameRegex.test(variant_name)) {
      showWarning(
        "Invalid product variant name, it must be atleast 3 digit long and doesn't exceed 100 characters, must not include any special characters",
      );
      return;
    }

    if (variant_price <= 0) {
      showWarning(" price must be greater than 0");
      return;
    }

    if (!skuRegex.test(variant_sku)) {
      showWarning("Variant SKU must be 3-20 characters and contain only uppercase letters, numbers, _ or -");
      return;
    }
    if (variant_sku) {
      const variantExists = varieties.some((v) => v.sku === variant_sku);

      if (variantExists) {
        showWarning("Variant SKU must be unique");
        return;
      }

      const newVariant: ProductVariant = {
        id: Date.now() + 1,
        product_id: productId,
        product_variant_name: variant_name,
        sku: variant_sku,
        price: variant_price,
      };

      varieties.push(newVariant);
      localStorage.setItem("varieties", JSON.stringify(varieties));
    }

    showSuccess("Product Created Successfully");
    form.reset();
  }
});

function loadCategoriesForDropdown() {
  const categories = JSON.parse(localStorage.getItem("categories") || "[]");
  console.log("loadcategory running");

  if (categories.length === 0) {
    console.log("No category available");
    // alert("No categories added Please add a category First!")
    return;
  }
  const select = document.getElementById(
    "product-category",
  ) as HTMLSelectElement;

  select.innerHTML = `<option value="">Select Category</option>`;

  categories.forEach((category: any) => {
    select.innerHTML += `
                <option value="${category.id}">
                    ${category.name}
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

window.addEventListener("DOMContentLoaded", () => {
  loadWarehousesForDropdown();
  loadCategoriesForDropdown();
});

// it is to fix the randomness of category dropdown
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    loadCategoriesForDropdown();
  }
});
