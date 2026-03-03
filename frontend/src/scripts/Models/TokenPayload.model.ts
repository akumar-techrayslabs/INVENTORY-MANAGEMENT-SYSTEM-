export interface TokenPayload {
  email: string;
  role: string;
  role_id?: number;
  exp: number;
}