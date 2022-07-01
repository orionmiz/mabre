import { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "~/lib/auth";
import {
  countComment,
  deleteComment,
  findComment,
} from "~/lib/services/comment";

/**
 * @api {put} /api/boards/:board/:article/comments/:comment Update a comment
 * @api {delete} /api/boards/:board/:article/comments/:comment Delete a comment
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "DELETE") {
    res.status(405).end();
    return;
  }

  const user = await getUser(req.cookies.access_token as string);

  if (!user) {
    res.status(401).json({
      error: "Failed to verify access token",
    });
    return;
  }

  const { article: articleId, comment: commentId } = req.query as Record<
    string,
    string
  >;

  const comment = await findComment({
    articleId_id: {
      articleId: +articleId,
      id: +commentId,
    },
  });

  if (!comment) {
    res.status(404).json({
      error: "Comment not found",
    });
    return;
  }

  // check roles
  switch (req.method) {
    case "PUT": {
      break;
    }
    case "DELETE": {
      if (comment.authorId !== user.id && !user.admin) {
        res.status(403).json({
          error: "Forbidden",
        });
        return;
      }

      await deleteComment({
        articleId_id: {
          articleId: +articleId,
          id: +commentId,
        },
      });

      const count = await countComment({
        where: {
          articleId: +articleId,
        },
      });

      res.json({
        count,
      });

      break;
    }
  }
}
