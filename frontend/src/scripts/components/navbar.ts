import { logoutAdmin, verifyToken } from "../services/Auth.js";



export function logout(){
    
    const logoutbtn = document.getElementById("logout") as HTMLButtonElement;
    
    
    logoutbtn.addEventListener("click",()=>{
        logoutAdmin()
        
        window.location.reload();
        
        
        
    })
}

export async function rolefinder(){
    const user_label = document.getElementById("user-label")as HTMLDivElement
    const isTokenIsStillValid = verifyToken();
    console.log(user_label);

  const role = isTokenIsStillValid?.payload?.role;
  const p = document.createElement(`p`)
    p.innerHTML =  `<p 
     
      class="px-5 py-2 text-sm font-medium border rounded-3xl  text-gray-700 hover:text-black transition duration-200 mr-3"
    >
   ${role}
  </p>`
  user_label.append(p)


  
  console.log(role);
}
