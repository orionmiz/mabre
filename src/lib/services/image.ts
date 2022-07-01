import prisma from "../prisma";

export const findImages = prisma.image.findMany;

export const deleteImages = prisma.image.deleteMany;
