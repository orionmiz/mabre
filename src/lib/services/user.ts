import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export const findUser = async (where: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({
    where,
  });
};

export const findUsers = async (params: {
  skip?: number;
  take?: number;
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}) => {
  return prisma.user.findMany({
    ...params,
    include: {
      _count: true,
    },
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};

export const updateUser = async (params: {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
}) => {
  return prisma.user.update({ ...params });
};

export const deleteUser = async (where: Prisma.UserWhereUniqueInput) => {
  return prisma.user.delete({ where });
};
