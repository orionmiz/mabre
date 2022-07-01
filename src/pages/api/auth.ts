import { NextApiRequest, NextApiResponse } from "next";
import { encrypt } from "~/lib/jwt";
import { findUser } from "~/lib/services/user";
import { setCookie } from "~/lib/util";
import { getAccessFromCode } from "~/lib/oauth";
import { UserAuthPayload, UserRegPayload } from "~/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;
  const redirect = req.query.redirect as string;

  if (!code || !redirect) {
    res.status(400).json({
      error: "Missing code or redirect",
    });
    return;
  }

  if (!req.url) {
    res.status(400).json({
      error: "Missing url",
    });
    return;
  }

  // get origin from request
  const origin = new URL(req.url, `http://${req.headers.host}`).href;

  // remove 'code' from url
  const redirect_uri = origin.replace(`&code=${code}`, "");

  const { user_id, access_token } = await getAccessFromCode(redirect_uri, code);

  const user = await findUser({
    ms_user_id: user_id,
  });

  if (user) {
    setCookie(
      res,
      "access_token",
      await encrypt<UserAuthPayload>({
        id: user.id,
        name: user.name,
        role: user.role,
        admin: user.admin,
      })
    );
    res.redirect(redirect);
    return;
  }

  setCookie(
    res,
    "registration",
    await encrypt<UserRegPayload>({
      ms_user_id: user_id,
      access_token,
    })
  );

  res.redirect(`/register`);
}
