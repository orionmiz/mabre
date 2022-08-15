import { faComment, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ArticlePreview.module.scss";
import { formatDistance } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

export default function ArticlePreviewItem({
  id,
  boardId,
  title,
  author,
  timestamp,
  include_image = false,
  highlight = false,
  comments,
}: {
  id: number;
  boardId: string;
  title: string;
  author: string;
  timestamp: Date;
  include_image?: boolean;
  highlight?: boolean;
  comments: number;
}) {
  return (
    <Link href={`/${boardId}/${id}`}>
      <a>
        <div className={styles.container}>
          <div className={styles.title}>
            {include_image && (
              <FontAwesomeIcon icon={faImage} color="skyblue" />
            )}{" "}
            {<span className={highlight ? styles.highlight : ""}>{title}</span>}
          </div>
          <div className={styles.desc}>
            <div className={styles.author}>{author}</div>
            {comments > 0 && (
              <div>
                <FontAwesomeIcon icon={faComment} /> {comments}
              </div>
            )}
            <div>
              {formatDistance(timestamp, new Date(), {
                addSuffix: true,
                locale: ko,
                includeSeconds: true,
              })}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
