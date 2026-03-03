import type { RolePermission } from "../Models/RolePermissions.model.js";


let rolePermissions: RolePermission[] = JSON.parse(
  localStorage.getItem("rolePermissions") || "[]"
);

export function loadPermissionsForRole() {

  const permissions = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  const container = document.getElementById("permission-container")!;

  container.innerHTML = "";

  permissions.forEach((perm: any) => {



      
    container.innerHTML += `
      <label class="flex items-center gap-2">
        <input type="checkbox"
               value="${perm.id}"/>
        ${perm.name}
      </label>
    `;
  });
}



loadPermissionsForRole();
