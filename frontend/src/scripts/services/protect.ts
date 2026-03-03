import { verifyToken } from "./Auth.js";

const PATH = window.location.origin

const isTokenIsStillValid =  verifyToken();
document.addEventListener('DOMContentLoaded', async ()=>{
    console.log(isTokenIsStillValid);
    // console.log(user);
    
    
    if(!isTokenIsStillValid.success)
        {
            window.location.href = `${PATH}/frontend/src/pages/Auth.html`
        }
    })
    
    
    
// export function hasPermission(perm: string): boolean {

//   const user = isTokenIsStillValid?.payload;
//     const role = isTokenIsStillValid?.payload;
//   if (!user) return false;
//   if(role == "superadmin")
//   {
//     console.log("user.role_name",user.role_name);
    
//       return true;
//   }else{
//     const role_id = user.role_id;

//   const permissions = JSON.parse(
//     localStorage.getItem("permissions") || "[]"
//   );

//   const rolePermissions = JSON.parse(
//     localStorage.getItem("rolePermissions") || "[]"
//   );

//   const permissionObj = permissions.find(
//     (p: any) => p.name === perm
//   );

//   if (!permissionObj) return false;

//   const hasPerm = rolePermissions.some(
//     (rp: any) =>
//       rp.role_id === role_id &&
//       rp.permission_id === permissionObj.id
//   );

//   return hasPerm;
//   }

  
// }
