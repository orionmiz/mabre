import { decrypt } from "./jwt";
import { JWTPayload } from "jose";

export interface UserAuthPayload extends JWTPayload {
  id: number;
  name: string;
  role: number;
  admin: boolean;
}

export interface UserRegPayload extends JWTPayload {
  ms_user_id: string;
  access_token: string;
}

export const getUser = async (token: string) => {
  const result = await decrypt(token).catch(() => null);

  if (!result) return null;

  return result.payload as UserAuthPayload;
};

export const hasRole = (user: UserAuthPayload) => {
  user.role;
};
