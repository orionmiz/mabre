import { NextApiRequest, NextApiResponse } from "next";
import { CommonResponse } from "~/lib/api";
import { host_hub } from "~/lib/constants";

export interface GameResponse extends CommonResponse {
  version: string;
  connected: number;
  maxPlayers: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 5000);

  const gameResponse: GameResponse = await fetch(`${host_hub}/server`, {
    signal: controller.signal,
  })
    .then((res) => {
      clearTimeout(timeoutId);
      return res.json();
    })
    .catch(() => null);

  res.status(200).json(gameResponse ?? { error: "Game server is not running" });
}
