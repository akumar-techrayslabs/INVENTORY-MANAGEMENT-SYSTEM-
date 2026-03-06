

import { logout, rolefinder } from "./components/navbar.js";
import { sidebar } from "./components/sidebar.js";
import { loadComponent } from "./layout/layout.js";


const BASE = window.location.origin;


document.addEventListener("DOMContentLoaded", async () => {


  await loadComponent("sidebar-placeholder", `${BASE}/src/components/sidebar.html`);
  await loadComponent("sidebar-navbar", `${BASE}/src/components/navbar.html`);
  await loadComponent("dashboard-placeholder", `${BASE}/src/pages/Dashboard.html`);

  sidebar();

    logout();
    rolefinder();

});

 localStorage.setItem("permissions", JSON.stringify([
  { id: 1, name: "CREATE_PRODUCT" },
  { id: 2, name: "EDIT_PRODUCT" },
  { id: 3, name: "DELETE_PRODUCT" },
  { id: 4, name: "VIEW_STOCK" },
  { id: 5, name: "CREATE_ORDER" },
  { id: 6, name: "DELETE_ORDER" }
]));