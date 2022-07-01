import { NextApiRequest, NextApiResponse } from "next";
import { decrypt } from "~/lib/jwt";
import { UserAuthPayload } from "~/lib/auth";
import { CommonResponse } from "~/lib/api";

export interface ProfileResponse extends CommonResponse {
  id: number;
  name: string;
  role: number;
  admin: boolean;
  guest?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.access_token;

  if (!token)
    return res.status(200).json({
      guest: true,
    });

  const info = await decrypt(token).catch(() => null);

  if (!info)
    return res.json({
      guest: true,
    });

  const payload = info.payload as UserAuthPayload;

  res.json(payload);
}
