import { findArticle } from "~/lib/services/article";
import { findBoard } from "~/lib/services/board";

import WritePage from "../write";
export default WritePage;

export const getStaticProps = async ({
  params,
}: {
  params: {
    board: string;
    article: string;
  };
}) => {
  const { board: boardId, article: articleId } = params;

  const board = await findBoard({
    id: boardId,
  });

  if (!board) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  const article = await findArticle({
    id: +articleId,
  });

  if (!article) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }

  return {
    props: {
      board: board.desc,
      article: {
        title: article.title,
        content: article.content,
      },
      mode: "edit",
    },
  };
};

export { getStaticPaths } from "../[article]";
