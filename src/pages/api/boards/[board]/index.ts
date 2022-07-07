import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { processImages, revalidateArticle } from "~/lib/article";
import { getUser } from "~/lib/auth";
import { createArticle } from "~/lib/services/article";
import { findBoard } from "~/lib/services/board";

/**
 * @api {post} /api/boards/:board Create an article
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const user = await getUser(req.cookies.access_token as string);

  if (!user) {
    res.status(401).json({
      error: "Failed to verify access token",
    });
    return;
  }

  const boardId = req.query.board as string;

  const { title, content } = req.body as {
    title: string;
    content: EditorJS.OutputData;
  };

  const board = await findBoard({
    id: boardId,
  });

  if (!board) {
    res.status(404).json({
      error: "Board not found",
    });
    return;
  }

  if (board.write > user.role) {
    res.status(403).json({
      error: "You don't have permission to write this board",
    });
    return;
  }

  const imageKeys = await processImages(content);

  const article = await createArticle({
    title,
    content: content as unknown as Prisma.JsonObject,
    includeImage: imageKeys.length > 0,
    images: {
      connectOrCreate: [
        ...imageKeys.map((key) => ({
          where: {
            key,
          },
          create: {
            key,
          },
        })),
      ],
    },
    author: {
      connect: {
        id: user.id,
      },
    },
    board: {
      connect: {
        id: boardId,
      },
    },
  }).catch((err) => {
    console.error(err);
    return null;
  });

  // DB Error.. (or invalid user id)
  if (!article) {
    res.status(500).json({
      error: "Failed to create article",
    });
    return;
  }

  revalidateArticle(res, boardId, article.id);

  res.json({
    redirect: `/${boardId}/${article.id}`,
  });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
