import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export const findBoard = async (where: Prisma.BoardWhereUniqueInput) => {
  return prisma.board.findUnique({
    where,
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });
};

export const findBoards = async () => {
  return prisma.board.findMany();
};

export const createBoard = async (data: Prisma.BoardCreateInput) => {
  return prisma.board.create({
    data,
  });
};

export const updateBoard = async (params: {
  where: Prisma.BoardWhereUniqueInput;
  data: Prisma.BoardUpdateInput;
}) => {
  return prisma.board.update({ ...params });
};

export const deleteBoard = async (where: Prisma.BoardWhereUniqueInput) => {
  return prisma.board.delete({ where });
};
