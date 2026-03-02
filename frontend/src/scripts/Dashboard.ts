document.addEventListener("DOMContentLoaded", () => {

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const categories = JSON.parse(localStorage.getItem("categories") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const customerOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");

  (document.getElementById("total-products") as HTMLElement).textContent =
    products.length.toString();

  (document.getElementById("total-categories") as HTMLElement).textContent =
    categories.length.toString();

  (document.getElementById("total-users") as HTMLElement).textContent =
    users.length.toString();

  (document.getElementById("total-orders") as HTMLElement).textContent =
    customerOrders.length.toString();

});
