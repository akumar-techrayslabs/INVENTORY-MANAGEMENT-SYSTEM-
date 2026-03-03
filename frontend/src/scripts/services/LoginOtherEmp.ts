import { verifyToken } from "./Auth.js";

declare var Swal: any;

const staffLoginForm = document.querySelector("form") as HTMLFormElement;

let users = JSON.parse(localStorage.getItem("users") || "[]");
let roles = JSON.parse(localStorage.getItem("roles") || "[]");

function generateToken(data: any) {
  const payload = {
    ...data,
    exp: Date.now() + 24 * 60 * 60 * 1000
  };

  return btoa(JSON.stringify(payload));
}

staffLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = (document.querySelector("input[type='email']") as HTMLInputElement).value;
  
  const password = (document.querySelector("input[type='password']") as HTMLInputElement).value;

  const isUserAvailable = users.find((user: any) => user.email === email);

  if (!isUserAvailable) {
    Swal.fire("User doesn't exist");
    return;
  }

  if (isUserAvailable.password === password) {
    const role = roles.find((r: any) => r.id === isUserAvailable.role_id);

    const token = generateToken({
      email,
      role: role?.name,
      role_id: role?.id
    });

    localStorage.setItem("token", token);

    Swal.fire("Login Successful").then(() => {
      window.location.href = "./Dashboard.html";
    });

  } else {
    Swal.fire("Invalid credentials");
  }
});

