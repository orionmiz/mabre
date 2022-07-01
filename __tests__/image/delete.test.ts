import prisma from "~/lib/prisma";

test("Delete separated images", async () => {
  prisma.image.deleteMany({
    where: {
      articles: {
        none: {},
      },
    },
  });
});
