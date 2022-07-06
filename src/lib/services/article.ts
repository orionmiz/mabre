import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export const findArticle = async (where: Prisma.ArticleWhereUniqueInput) => {
  return prisma.article.findUnique({
    where,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const findArticleWithImages = async (
  where: Prisma.ArticleWhereUniqueInput
) => {
  return prisma.article.findUnique({
    where,
    include: {
      images: true,
    },
  });
};

export const findArticles = async (params: {
  skip?: number;
  take?: number;
  cursor?: Prisma.ArticleWhereUniqueInput;
  where?: Prisma.ArticleWhereInput;
  orderBy?: Prisma.ArticleOrderByWithRelationInput;
}) => {
  return prisma.article.findMany({
    ...params,
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const findArticlesFromPage = async (params: {
  where: Prisma.ArticleWhereInput;
  page: number;
  count: number;
}) => {
  const { where, page, count } = params;

  return prisma.article.findMany({
    where,
    orderBy: {
      id: "desc",
    },
    skip: (page - 1) * count,
    take: count,
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const createArticle = async (data: Prisma.ArticleCreateInput) => {
  return prisma.article.create({
    data,
  });
};

export const updateArticle = async (params: {
  where: Prisma.ArticleWhereUniqueInput;
  data: Prisma.ArticleUpdateInput;
}) => {
  return prisma.article.update({ ...params });
};

export const deleteArticle = async (where: Prisma.ArticleWhereUniqueInput) => {
  return prisma.article.delete({ where });
};
