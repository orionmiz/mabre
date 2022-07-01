import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export const findComment = async (where: Prisma.CommentWhereUniqueInput) => {
  return prisma.comment.findUnique({ where });
};

export const findComments = async (params: {
  skip?: number;
  take?: number;
  cursor?: Prisma.CommentWhereUniqueInput;
  where?: Prisma.CommentWhereInput;
  orderBy?: Prisma.CommentOrderByWithRelationInput;
}) => {
  return prisma.comment.findMany({ ...params });
};

export const findCommentsFromPage = async ({
  where,
  page,
  count,
}: {
  where: Prisma.CommentWhereInput;
  page: number;
  count: number;
}) => {
  return prisma.comment.findMany({
    where,
    orderBy: {
      id: "asc",
    },
    skip: (page - 1) * count,
    take: count,
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const createComment = async (data: Prisma.CommentCreateInput) => {
  return prisma.comment.create({
    data,
  });
};

export const updateComment = async (params: {
  where: Prisma.CommentWhereUniqueInput;
  data: Prisma.CommentUpdateInput;
}) => {
  return prisma.comment.update({ ...params });
};

export const deleteComment = async (where: Prisma.CommentWhereUniqueInput) => {
  return prisma.comment.delete({ where });
};

export const countComment = async (params: {
  where: Prisma.CommentWhereInput;
}) => {
  return prisma.comment.count({ ...params });
};
