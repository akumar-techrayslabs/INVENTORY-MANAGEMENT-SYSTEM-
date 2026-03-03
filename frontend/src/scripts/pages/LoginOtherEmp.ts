import type { User } from "../Models/User.model.js";
import { generateToken } from "../services/Auth.js";




 let users:User[]  = JSON.parse(
  localStorage.getItem("users") || "[]",
);


declare var Swal:any;
const staffLoginForm = document.querySelector("form") as HTMLFormElement;
async function showAlert(message:string){
    Swal.fire({
        title: 'Warning!',
        text: `${message}`,
        icon: 'success',
        confirmButtonText: 'OK'
    })
}
let roles = JSON.parse(localStorage.getItem("roles") || "[]");
staffLoginForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const email = (document.querySelector("input[type = 'email']") as HTMLInputElement).value;

    
    const password = (document.querySelector("input[type = 'password']") as HTMLInputElement).value;
 
    
    console.log("email",email,": ", "password",password);

  
    const isUserAvailable = users.find((user:any)=>user.email == email)
    console.log("isUserAvailable",isUserAvailable);
    
    if(!isUserAvailable)
    {
        showAlert("User doesn't exist")
    }
   
    if(isUserAvailable?.password == password)
    {
        const role_id = isUserAvailable.role_id
        const role_name = roles.find((role:any)=>role.id == role_id)
        const token =generateToken({email,role:role_name?.name,role_id })
       

        localStorage.setItem("token",token);
        showAlert("Login Successful").then(()=>{
        window.location.href= "./Dashboard.html"
    })
       
    }
    else {
        showAlert("Invalid credentials")
    }
    

})



// export async function verifyTokenStaff(){
//     const token = localStorage.getItem("token");
//     console.log(token);
  
    
//     if(token == null)
//     {   console.log("token is null");
    
//         return false;
//     }
//     else{
         
//         try{
         
        
//         await  jwtVerify(token,SECRET_KEY);
//         return true;
//     }
//     catch(error){
//         console.log("toke is eeor ");
//         console.log(error);
        
        
//         return false;
//     }
//     }
 
// }

// export function logoutAdmin()
// {
//     console.log("logout successfully");
    
//     localStorage.removeItem("token");
    
// }