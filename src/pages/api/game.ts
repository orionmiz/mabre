import { NextApiRequest, NextApiResponse } from "next";
import { CommonResponse } from "~/lib/api";
import { host_game } from "~/lib/constants";

export interface GameResponse extends CommonResponse {
  version: string;
  connected: number;
  maxPlayers: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const gameResponse: GameResponse = await fetch(`${host_game}/server`)
    .then((res) => res.json())
    .catch(() => null);

  res.status(200).json(gameResponse ?? { error: "Game server is not running" });
}
