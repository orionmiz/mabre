export const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY as string
);

export const client_id = process.env.NEXT_PUBLIC_MS_CLIENT_ID as string;
export const client_secret = process.env.MS_CLIENT_SECRET as string;

export const isSecureMode = process.env.NODE_ENV === "production";

export const CDN = process.env.CDN as string;

export const host = isSecureMode
  ? (process.env.NEXT_PUBLIC_HOST as string)
  : "http://localhost:3000";
export const host_game = process.env.NEXT_PUBLIC_GAME_HOST as string;
export const host_hub = `http://${host_game}:7070`;