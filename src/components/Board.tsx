import { findArticlesFromPage } from "~/lib/services/article";
import { Modelize } from "~/lib/types";
import ArticlePreviewItem from "./board/ArticlePreviewItem";
import styles from "./Board.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import PageNavigator from "./PageNavigator";

export default function Board({
  boardId,
  title,
  articles,
  page,
  totalPages,
  writable,
}: {
  boardId: string;
  title: string;
  articles: Modelize<typeof findArticlesFromPage>;
  page: number;
  totalPages: number;
  writable: boolean;
}) {
  return (
    <div className={styles.container}>
      <div
        style={{
          flex: "1 1",
        }}
      >
        <div className={styles.desc}>
          <div className={styles.boardTitle}>{title}</div>
          {writable && (
            <Link href={`/${boardId}/write`}>
              <a className={styles.write}>
                <FontAwesomeIcon icon={faPen} />
                글쓰기
              </a>
            </Link>
          )}
        </div>
        {articles.map((article) => (
          <ArticlePreviewItem
            id={article.id}
            boardId={boardId}
            author={article.author.name}
            comments={article._count.comments}
            timestamp={article.createdAt}
            title={article.title}
            highlight={article.fixed}
            include_image={article.includeImage}
            key={article.id}
          />
        ))}
      </div>
      <div
        style={{
          flex: "0 0 auto",
        }}
      >
        <PageNavigator
          page={page}
          totalPages={totalPages}
          baseURL={`/${boardId}/page`}
        />
      </div>
    </div>
  );
}
