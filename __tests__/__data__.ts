import { Prisma } from "@prisma/client";

export const tester: Prisma.UserCreateInput = {
  name: "tester1",
  mc_uuid: "nope",
  ms_user_id: "nope",
};

export const testBoard: Prisma.BoardCreateInput = {
  id: "test1",
  desc: "테스트 게시판1",
};

export const testArticle: Prisma.ArticleCreateInput = {
  title: "Test Article",
  content: {
    time: 1654643285582,
    blocks: [
      {
        id: "EF-gyCNEm_",
        type: "paragraph",
        data: {
          text: "Test",
        },
      },
    ],
    version: "2.24.3",
  },
  author: {
    connectOrCreate: {
      where: {
        name: tester.name,
      },
      create: tester,
    },
  },
  board: {
    connectOrCreate: {
      where: {
        id: testBoard.id,
      },
      create: testBoard,
    },
  },
  images: {
    connectOrCreate: [
      {
        where: {
          key: "test1",
        },
        create: {
          key: "test1",
        },
      },
      {
        where: {
          key: "test",
        },
        create: {
          key: "test",
        },
      },
    ],
  },
};

export const testComment: Prisma.CommentCreateInput = {
  text: "Test Comment",
  article: {
    connectOrCreate: {
      where: {
        id: 23,
      },
      create: testArticle,
    },
  },
  author: {
    connectOrCreate: {
      where: {
        name: tester.name,
      },
      create: tester,
    },
  },
};

export const noticeBoard: Prisma.BoardCreateInput = {
  id: "notice",
  desc: "공지사항",

  write: 1,
  comment: 1,
};

export const freeBoard: Prisma.BoardCreateInput = {
  id: "free",
  desc: "자유게시판",
};

export const testNotice: Prisma.ArticleCreateInput = {
  title: "Test Notice",
  content: {
    time: 1654643285582,
    blocks: [
      {
        id: "EF-gyCNEm_",
        type: "paragraph",
        data: {
          text: "Test",
        },
      },
    ],
    version: "2.24.3",
  },
  author: {
    connectOrCreate: {
      where: {
        name: tester.name,
      },
      create: tester,
    },
  },
  board: {
    connectOrCreate: {
      where: {
        id: testBoard.id,
      },
      create: testBoard,
    },
  },
};
