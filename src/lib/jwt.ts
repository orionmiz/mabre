import * as jose from "jose";
import { JWT_SECRET_KEY } from "./constants";

const protectedHeader = { alg: "dir", enc: "A256GCM" };

export const encrypt = <T extends jose.JWTPayload>(payload: T) => {
  return new jose.EncryptJWT(payload)
    .setProtectedHeader(protectedHeader)
    .setIssuedAt()
    .setExpirationTime("2h")
    .encrypt(JWT_SECRET_KEY);
};

export const decrypt = (jwt: string) => {
  return jose.jwtDecrypt(jwt, JWT_SECRET_KEY);
};

export const validate = (jwt: string, claims: object) => {
  return jose.jwtDecrypt(jwt, JWT_SECRET_KEY, claims);
};
