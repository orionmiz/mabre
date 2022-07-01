import { NextApiRequest, NextApiResponse } from "next";
import { UserAuthPayload, UserRegPayload } from "~/lib/auth";
import { decrypt, encrypt } from "~/lib/jwt";
import { getAccountProfile } from "~/lib/oauth";
import { createUser } from "~/lib/services/user";
import { setCookie } from "~/lib/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
    });
  }

  const regToken = req.cookies.registration;

  if (!regToken)
    return res.status(400).json({
      error: "Missing registration token",
    });

  const { ms_user_id, access_token } = (await decrypt(regToken))
    .payload as UserRegPayload;

  const profile = await getAccountProfile(access_token).catch(() => {
    res.status(403).json({
      error: "Failed to get username",
    });
  });

  if (!profile) return;

  const user = await createUser({
    ...profile,
    ms_user_id,
  }).catch(() => {
    res.status(403).json({
      error: "Failed to create user", // duplicate?
    });
  });

  if (!user) return;

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

  res.status(200).send(user.name);
}
