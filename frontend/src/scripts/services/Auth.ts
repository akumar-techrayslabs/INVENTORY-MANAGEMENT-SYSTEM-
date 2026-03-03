import type { TokenPayload } from "../Models/TokenPayload.model.js";

const SUPER_ADMIN = {
  email: "super@admin.com",
  password: "Super@123"
};


//  ---------  Token Generation function ---- 

function generateToken(data: Omit<TokenPayload, "exp">): string {
  const payload: TokenPayload = {
    ...data,
    exp: Date.now() + 24 * 60 * 60 * 1000
  };

  return btoa(JSON.stringify(payload));
}

// ------------ Token Verification ------------------- 


export function verifyToken() {
  const token = localStorage.getItem("token");

  if (!token) return { success: false };

  try {
    const decoded: TokenPayload = JSON.parse(atob(token));

    if (decoded.exp < Date.now()) {
      localStorage.removeItem("token");
      return { success: false };
    }

    return { success: true, payload: decoded };

  } catch {
    return { success: false };
  }
}

// ------------------------------------- Super Admin Login -------------------------------------
export function loginSuperAdmin(email: string, password: string) {
  if (
    email === SUPER_ADMIN.email &&
    password === SUPER_ADMIN.password
  ) {
    const token = generateToken({
      email,
      role: "superadmin"
    });

    localStorage.setItem("token", token);
    return { success: true };
  }

  return { success: false, message: "Invalid credentials" };
}

// ------------------- Logout Function -------------------------------
export function logoutAdmin() {
  localStorage.removeItem("token");
}

