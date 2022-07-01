import { Board } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findBoards } from "~/lib/services/board";

export type BoardResponse = Record<string, Omit<Board, "id">>;

/**
 * @api {get} /api/boards Get boards
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      const boards = (await findBoards()).reduce((prev: BoardResponse, cur) => {
        const { id, ...omit } = cur;
        prev[id] = omit;
        return prev;
      }, {});
      res.json(boards);
      break;
    }
    default: {
      break;
    }
  }
}
