import { client_id, client_secret } from "./constants";

export const getAccessFromCode = async (
  redirect_uri: string,
  code: string
): Promise<{
  user_id: string;
  access_token: string;
  refresh_token: string;
  authentication_token: string;
}> => {
  const params = new URLSearchParams({
    client_id,
    client_secret,
    redirect_uri,
    code,
    grant_type: "authorization_code",
    scope: "Xboxlive.signin Xboxlive.offline_access",
  });

  const res = await fetch(`https://login.live.com/oauth20_token.srf`, {
    method: "POST",
    body: params,
  });

  if (res.status !== 200) {
    throw new Error(`Failed to get token, redirect_uri: ${redirect_uri}`);
  }

  const info = await res.json();

  return info;
};

const getXBLInfo = async (access_token: string) => {
  const params = {
    Properties: {
      AuthMethod: "RPS",
      RpsTicket: `d=${access_token}`,
      SiteName: "user.auth.xboxlive.com",
    },
    RelyingParty: "http://auth.xboxlive.com",
    TokenType: "JWT",
  };

  const res = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "x-xbl-contract-version": "1",
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error("Failed to get xbl info");
  }

  const info = await res.json();

  return [info.Token, info.DisplayClaims.xui[0].uhs];
};

const getXSTSToken = async (xbl_token: string) => {
  const params = {
    Properties: {
      SandboxId: "RETAIL",
      UserTokens: [xbl_token],
    },
    RelyingParty: "rp://api.minecraftservices.com/",
    TokenType: "JWT",
  };

  const res = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error("Failed to get xsts token");
  }

  const info = await res.json();

  return info.Token;
};

const getMinecraftAccessToken = async (uhs: string, xsts_token: string) => {
  const params = {
    identityToken: `XBL3.0 x=${uhs};${xsts_token}`,
  };

  const res = await fetch(
    "https://api.minecraftservices.com/authentication/login_with_xbox",
    {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res.status !== 200) {
    throw new Error("Failed to get minecraft access token");
  }

  const info = await res.json();

  return info.access_token;
};

const checkGameOwnership = async (access_token: string) => {
  const res = await fetch(
    "https://api.minecraftservices.com/entitlements/mcstore",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (res.status !== 200) {
    throw new Error("Failed to check game ownership");
  }

  const info: {
    items: {
      name: string;
      signature: string;
    }[];
    signature: string;
    keyId: string;
  } = await res.json();

  if (!info.items.length) return false;

  const mc = info.items.find((item) => item.name === "game_minecraft");

  return mc ? true : false;
};

interface Resource {
  id: string;
  state: "ACTIVE" | "INACTIVE";
  url: string;
}

const getProfile = async (
  access_token: string
): Promise<{
  id: string;
  name: string;
  skins: (Resource & {
    variant: string; // 'CLASSIC'...
  })[];
  capes: (Resource & {
    alias: string; // 'Migrator'...
  })[];
}> => {
  const res = await fetch(
    "https://api.minecraftservices.com/minecraft/profile",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (res.status !== 200) {
    throw new Error("Failed to get profile");
  }

  const info = await res.json();
  return info;
};

export const getAccountProfile = async (access_token: string) => {
  const [xbl_token, xbl_uhs] = await getXBLInfo(access_token);
  const xsts_token = await getXSTSToken(xbl_token);
  const mc_access_token = await getMinecraftAccessToken(xbl_uhs, xsts_token);
  const hasGame = await checkGameOwnership(mc_access_token);

  if (!hasGame) {
    throw Error("User does not own Minecraft");
  }

  const profile = await getProfile(mc_access_token);

  return {
    mc_uuid: profile.id,
    name: profile.name,
  };
};
