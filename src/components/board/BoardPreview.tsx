import { findArticlesFromPage } from "~/lib/services/article";
import { Modelize } from "~/lib/types";
import ArticlePreviewItem from "./ArticlePreviewItem";
import styles from "./BoardPreview.module.scss";

export default function BoardPreview({
  boardId,
  title,
  articles,
}: {
  boardId: string;
  title: string;
  articles: Modelize<typeof findArticlesFromPage>;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.boardTitle}>{title}</div>
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
  );
}
