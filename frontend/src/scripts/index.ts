
import { loadComponent } from "./layout.js";
import { sidebar } from "./sidebar.js";




document.addEventListener("DOMContentLoaded", async () => {

  await loadComponent("sidebar-placeholder", "./src/components/sidebar.html");
  await loadComponent("sidebar-navbar", "./src/components/navbar.html");

  sidebar();


});