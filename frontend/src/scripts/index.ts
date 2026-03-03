

import { logout } from "./components/navbar.js";
import { sidebar } from "./components/sidebar.js";
import { loadComponent } from "./layout/layout.js";

const BASE = window.location.origin;


document.addEventListener("DOMContentLoaded", async () => {

  await loadComponent("sidebar-placeholder", `${BASE}/frontend/src/components/sidebar.html`);
  await loadComponent("sidebar-navbar", `${BASE}/frontend/src/components/navbar.html`);
  await loadComponent("dashboard-placeholder", `${BASE}/frontend/src/pages/Dashboard.html`);
  sidebar();
  logout();


});