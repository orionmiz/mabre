import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "~/lib/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCookie(
    res,
    "access_token",
    {},
    {
      maxAge: 0,
    }
  );

  res.status(200).json({});
}
