import { GetStaticPaths } from "next";
import { findArticle, findArticles } from "~/lib/services/article";
import { findBoards } from "~/lib/services/board";
import Layout from "~/components/Layout";
import { Modelize } from "~/lib/types";
import { parseDate } from "~/lib/util";
import dynamic from "next/dynamic";
import styles from "./ArticlePage.module.scss";
import BoardList from "~/components/board/BoardList";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEdit,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import CommentList from "~/components/board/CommentList";
import useProfile from "~/hooks/useProfile";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "~/components/util/Spinner";

const Editor = dynamic(() => import("~/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className={styles.editor}>
      <Spinner />
    </div>
  ),
});

export default function ArticlePage({
  boardId,
  article,
}: {
  boardId: string;
  article: Modelize<typeof findArticle>;
}) {
  const { profile } = useProfile();

  const router = useRouter();

  const [pending, setPending] = useState(false);

  const erase = async () => {
    if (pending) {
      return;
    }

    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      const res = await fetch(`/api/boards/${boardId}/${article.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("게시글이 삭제되었습니다.");
        router.push(`/${boardId}`);
      } else {
        alert(res.statusText);
        setPending(false);
      }
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.boardList}>
          <BoardList />
        </div>
        <div className={styles.content}>
          <div className={styles.article}>
            <div>
              <div className={styles.info}>
                <h2 className={styles.title}>{article.title}</h2>
                <div className={styles.meta}>
                  <div className={styles.writer}>
                    <FontAwesomeIcon icon={faUser} />
                    {article.author.name}
                  </div>
                  <div className={styles.date}>
                    <FontAwesomeIcon icon={faClock} />
                    {format(parseDate(article.createdAt), "yyyy.M.d HH:mm")}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Editor
                readOnly
                content={article.content as unknown as EditorJS.OutputData}
              />
            </div>
          </div>
          {profile && (profile.id === article.authorId || profile.admin) && (
            <div className={styles.actions}>
              <Link href={`/${boardId}/edit/${article.id}`}>
                <a className={styles.edit}>
                  <FontAwesomeIcon icon={faEdit} />
                  수정
                </a>
              </Link>
              <button className={styles.delete} onClick={erase}>
                <FontAwesomeIcon icon={faTrashCan} />
                삭제
              </button>
            </div>
          )}
          <div>
            <CommentList boardId={boardId} articleId={article.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async ({
  params,
}: {
  params: {
    board: string;
    article: string;
  };
}) => {
  const { board: boardId, article: articleId } = params;

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
      boardId,
      article: JSON.parse(JSON.stringify(article)),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const boardList = await findBoards();

  const paths = (
    await Promise.all(
      boardList.map(async (board) => {
        const articleList = await findArticles({
          where: { boardId: board.id },
        });

        return articleList.map((article) => ({
          params: {
            board: board.id,
            article: `${article.id}`,
          },
        }));
      })
    )
  ).flat();

  return {
    paths,
    fallback: "blocking",
  };
};
