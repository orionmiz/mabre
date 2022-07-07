import { Article, Prisma, PrismaPromise } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { revalidateArticle, updateImages } from "~/lib/article";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { deleteImageObjects } from "~/lib/s3";
import {
  deleteArticle,
  findArticle,
  findArticleWithImages,
} from "~/lib/services/article";
import { deleteImages, findImages } from "~/lib/services/image";

/**
 * @api {get} /api/boards/:board/:article Get the meta data of an article (except content)
 * @api {put} /api/boards/:board/:article Update an article
 * @api {delete} /api/boards/:board/:article Delete an article
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method === "GET") {
    const { article: id } = req.query as Record<string, string>;

    const article = await findArticle({
      id: +id,
    });
    if (!article) {
      res.status(404).json({
        error: "Article not found",
      });
      return;
    }

    return res.status(200).json({
      authorId: article.authorId,
    });
  }

  if (method !== "PUT" && method !== "DELETE") {
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

  const { board: boardId, article: id } = req.query as Record<string, string>;

  const article = await findArticleWithImages({
    id: +id,
  });

  if (!article) {
    res.status(404).json({
      error: "Article not found",
    });
    return;
  }

  const oldImages = article.images.map((image) => image.key);

  // check roles
  switch (method) {
    // update article
    case "PUT": {
      // only author can update this article
      if (article.authorId !== user.id) {
        res.status(403).json({
          error: "You don't have permission to update this article",
        });
        return;
      }

      const { title, content } = req.body as {
        title: string;
        content: EditorJS.OutputData;
      };

      const { newImages, unusedImages, linkedImages, includeImage } =
        await updateImages({
          oldImages,
          update: content,
        });

      await processUnusedImages({
        articleAction: () => {
          return prisma.article.update({
            where: {
              id: +id,
            },
            data: {
              title,
              content: content as unknown as Prisma.JsonObject,
              includeImage,
              images: {
                disconnect: unusedImages.map((key) => ({
                  key,
                })),
                connectOrCreate: newImages.map((key) => ({
                  create: {
                    key,
                  },
                  where: {
                    key,
                  },
                })),
                connect: linkedImages.map((key) => ({
                  key,
                })),
              },
            },
          });
        },
        unusedImages,
      });

      break;
    }
    case "DELETE": {
      // only author or admin can delete this article
      if (article.authorId !== user.id && !user.admin) {
        res.status(403).json({
          error: "You don't have permission to update this article",
        });
        return;
      }

      if (oldImages.length) {
        await processUnusedImages({
          articleAction: () => {
            return prisma.article.delete({
              where: {
                id: +id,
              },
            });
          },
          unusedImages: oldImages,
        });
      } else {
        await deleteArticle({
          id: +id,
        });
      }

      break;
    }
  }

  revalidateArticle(res, boardId, article.id);

  return res.json({
    success: true,
  });
}

const processUnusedImages = async ({
  articleAction,
  unusedImages,
}: {
  articleAction: () => PrismaPromise<Article>;
  unusedImages: string[];
}) => {
  const [, unusedImagesSafe, deletion] = await prisma.$transaction([
    // disconnect from all images
    articleAction(),
    findImages({
      where: {
        key: {
          in: unusedImages,
        },
        articles: {
          none: {},
        },
      },
    }),
    deleteImages({
      where: {
        key: {
          in: unusedImages,
        },
        articles: {
          none: {},
        },
      },
    }),
  ]);

  if (deletion.count) {
    const toBeDeleted = unusedImagesSafe.map((image) => image.key);
    deleteImageObjects(toBeDeleted);
  }
};
