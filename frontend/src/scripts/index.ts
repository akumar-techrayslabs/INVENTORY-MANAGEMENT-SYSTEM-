
import { loadComponent } from "./layout.js";
import { sidebar } from "./sidebar.js";




document.addEventListener("DOMContentLoaded", async () => {

  await loadComponent("sidebar-placeholder", "/frontend/src/components/sidebar.html");

  sidebar();


});