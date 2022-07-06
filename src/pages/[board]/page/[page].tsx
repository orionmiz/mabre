import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { findArticles, findArticlesFromPage } from "~/lib/services/article";
import { findBoard } from "~/lib/services/board";
import { Modelize } from "~/lib/types";
import Layout from "~/components/Layout";
import BoardList from "~/components/board/BoardList";
import styles from "./BoardPage.module.scss";
import Board from "~/components/Board";
import { getTotalPages } from "~/lib/util";
import { getUser } from "~/lib/auth";

const articlesPerPage = 10;

export default function BoardPage({
  boardId,
  title,
  articles,
  page,
  totalPages,
  writable,
}: {
  boardId: string;
  title: string;
  articles: Modelize<typeof findArticles>;
  page: number;
  totalPages: number;
  writable: boolean;
}) {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.boardList}>
          <BoardList />
        </div>
        <Board
          boardId={boardId}
          title={title}
          articles={articles}
          page={page}
          totalPages={totalPages}
          writable={writable}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.access_token as string;
  const user = await getUser(token);

  const query = context.params as ParsedUrlQuery;

  const boardId = query.board as string;
  const page = parseInt((query.page as string) ?? 1);

  const board = await findBoard({
    id: boardId as string,
  });

  if (!board) {
    return {
      props: {},
      redirect: {
        destination: "404",
        permanent: false,
      },
    };
  }

  const totalPages = getTotalPages(board._count.articles, articlesPerPage);

  if (page > totalPages || page < 1) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: `/${boardId}/page/1`,
      },
    };
  }

  const articles = await findArticlesFromPage({
    where: {
      boardId,
    },
    page,
    count: 10,
  });

  return {
    props: {
      boardId,
      title: board.desc,
      articles: JSON.parse(JSON.stringify(articles)),
      page,
      totalPages,
      writable: user && user.role >= board.write,
    },
  };
};
