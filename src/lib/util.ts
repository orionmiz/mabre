import crypto from "crypto";
import { NextApiResponse } from "next";
import { serialize, CookieSerializeOptions } from "cookie";
import { isSecureMode } from "./constants";

export const getRandomString = (length = 8) => {
  return crypto.randomBytes(length).toString("hex");
};

export const getFileHash = (buffer: Buffer) => {
  return crypto.createHash("md5").update(Buffer.from(buffer)).digest("hex");
};

export const getTotalPages = (total: number, limit: number) => {
  return Math.max(Math.floor((total - 1) / limit) + 1, 1);
};

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  if (options.maxAge) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader(
    "Set-Cookie",
    serialize(name, stringValue, {
      httpOnly: true,
      secure: isSecureMode,
      path: "/",
      ...options,
    })
  );
};
