import { NextApiRequest, NextApiResponse } from "next";
import { CommonResponse } from "~/lib/api";
import { getUser } from "~/lib/auth";
import { findArticle } from "~/lib/services/article";
import { findBoard } from "~/lib/services/board";
import {
  countComment,
  createComment,
  findCommentsFromPage,
} from "~/lib/services/comment";
import { Modelize } from "~/lib/types";

export interface CommentResponse extends CommonResponse {
  comments: Modelize<typeof findCommentsFromPage>;
  total: number;
  writable: boolean;
}

const commentsPerPage = 10;

/**
 * @api {get} /api/boards/:board/:article/comments:page Get comments
 * @api {post} /api/boards/:board/:article/comments Create a comment
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const {
    board: boardId,
    article: articleId,
    page,
  } = req.query as Record<string, string>;

  const user = await getUser(req.cookies.access_token as string);

  if (!user) {
    res.status(401).json({
      error: "Failed to verify access token",
    });
    return;
  }

  const board = await findBoard({
    id: boardId,
  });

  if (!board) {
    res.status(404).json({
      error: "Board not found",
    });
    return;
  }

  const article = await findArticle({
    id: +articleId,
  });

  if (!article) {
    res.status(404).json({
      error: "Article not found",
    });
    return;
  }

  // check roles
  switch (req.method) {
    case "GET": {
      if (board.read > user.role && article.authorId !== user.id) {
        res.status(403).json({
          error: "You don't have permission to read this board",
        });
        return;
      }

      const comments = await findCommentsFromPage({
        where: {
          articleId: +articleId,
        },
        page: +page,
        count: commentsPerPage,
      });

      const count = await countComment({
        where: {
          articleId: +articleId,
        },
      });

      res.json({
        comments,
        total: count,
        writable: user.role >= board.write,
      });

      break;
    }
    case "POST": {
      if (board.write > user.role) {
        res.status(403).json({
          error: "You don't have permission to write this board",
        });
        return;
      }

      const text = req.body as string;

      if (!text || !text.length || text.length > 100) {
        res.status(400).json({
          error: "Comment must be between 1 and 100 characters",
        });
        return;
      }

      const comment = await createComment({
        text,
        author: {
          connect: {
            id: user.id,
          },
        },
        article: {
          connect: {
            id: +articleId,
          },
        },
      }).catch(() => {
        return null;
      });

      if (!comment) {
        res.status(500).json({
          error: "Failed to create comment",
        });
        return;
      }

      const count = await countComment({
        where: {
          articleId: +articleId,
        },
      });
      res.json({ count });
      break;
    }
  }
}
