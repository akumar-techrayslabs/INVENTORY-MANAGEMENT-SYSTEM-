
import { loginSuperAdmin } from "./Auth.js";

const adminLoginForm = document.querySelector("form") as HTMLFormElement;
console.log("hello ");

// declare var Swal: { fire: (arg0: { title: string; text: string; icon: string; confirmButtonText: string; }) => void; };
declare var Swal: any;
async function showAlert():Promise<void> {
    Swal.fire({
        title: 'Success!',
        text: 'Login Successfully',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(()=>{
        window.location.href= "./Dashboard.html"
    });
}

function showError() {
    Swal.fire({
        title: 'Invalid Credentials or something went wrong!',
        text: 'Login Failed',
        icon: 'fail',
        confirmButtonText: 'Try Again'
    });
}
adminLoginForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const email = (document.querySelector("input[type = 'email']") as HTMLInputElement).value;
    const password = (document.querySelector("#password") as HTMLInputElement).value;
    console.log("email",email,": ", "password",password);

    console.log("here is the reuslt");
    const result = loginSuperAdmin(email,password);
    
    if(result.success === true)
    {
        showAlert();

    }
    else if(result.success === false){
        showError();
    }
    
    

})
